import {
  Color, DirectionalLight, HemisphereLight, PerspectiveCamera,
  Scene, SRGBColorSpace, Vector2, WebGLRenderer, WebGLRenderTarget,
} from "three";
import type { GatewayPose } from "./choreography";
import { deriveJourneyFrame } from "./journey/chapterState";
import { deriveHeroFraming } from "./journey/framing";
import { SpectralEnvironment } from "./environment/spectralEnvironment";
import { DualEntitySystem } from "./entities/dualEntitySystem";

export type GatewaySceneController = {
  setTarget(frame: GatewayPose): void;
  setPointer?(x: number, y: number): void;
  resize(width: number, height: number, dpr: number): void;
  tick(deltaSeconds: number): boolean;
  render(): void;
  dispose(): void;
};

export function createGatewayScene(canvas: HTMLCanvasElement): GatewaySceneController {
  let renderer: WebGLRenderer | undefined;
  let environment: SpectralEnvironment | undefined;
  let entities: DualEntitySystem | undefined;
  let refraction: WebGLRenderTarget | undefined;
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    environment?.dispose(); entities?.dispose(); refraction?.dispose(); renderer?.dispose();
  };
  try {
    const activeRenderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer = activeRenderer;
    activeRenderer.outputColorSpace = SRGBColorSpace;
    const capture = new WebGLRenderTarget(1, 1, { depthBuffer: true });
    refraction = capture;
    const scene = new Scene();
    const bright = new Color(0xeff3f3);
    const spectralDepth = new Color(0x8ba5b7);
    const background = bright.clone();
    scene.background = background;
    const camera = new PerspectiveCamera(46, 1, .1, 190);
    camera.position.set(0, 0, 12);
    const world = new SpectralEnvironment();
    environment = world;
    scene.add(world.group);
    const heroes = new DualEntitySystem();
    entities = heroes;
    scene.add(heroes.group);
    const ambient = new HemisphereLight(0xf6f5fc, 0x8ba9af, 1.05);
    const key = new DirectionalLight(0xfff5eb, 1.8);
    key.position.set(-5, 9, 8);
    scene.add(ambient, key);
    const pointer = new Vector2();
    let pose: GatewayPose | null = null;

    return {
      setTarget(frame) { pose = frame; },
      setPointer(x, y) { pointer.set(x, y); },
      resize(width, height, dpr) {
        if (disposed || width <= 0 || height <= 0) return;
        activeRenderer.setPixelRatio(dpr);
        activeRenderer.setSize(width, height, false);
        const widthPixels = Math.round(width * dpr);
        const heightPixels = Math.round(height * dpr);
        capture.setSize(Math.max(1, Math.round(widthPixels * .6)), Math.max(1, Math.round(heightPixels * .6)));
        world.setRefraction(capture.texture, widthPixels, heightPixels);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      },
      tick(deltaSeconds) {
        if (disposed || !pose) return false;
        const frame = deriveJourneyFrame(pose.reducedMotion ? 1 : pose.travelProgress);
        // No second damping layer: the controller's displayed progress IS this frame.
        camera.position.set(pose.cameraX + frame.driftX, frame.driftY, pose.cameraZ);
        camera.rotation.set(0, pose.cameraYaw, 0);
        background.copy(bright).lerp(spectralDepth, frame.darkness);
        world.update(frame, pose.cameraZ, background);
        ambient.intensity = 1.05 - frame.darkness * .4;
        key.intensity = 1.8 - frame.darkness * .45;
        heroes.group.visible = frame.emergence > 0;
        const heroFraming = deriveHeroFraming(pose.cameraZ, camera.aspect);
        heroes.group.scale.setScalar(heroFraming.scale);
        heroes.group.position.z = heroFraming.z;
        heroes.setPointer(pose.reducedMotion ? 0 : pointer.x, pose.reducedMotion ? 0 : pointer.y);
        heroes.tick(deltaSeconds, {
          // Reuse existing emergence kinematics without editing entity geometry or shaders.
          progress: pose.reducedMotion ? 1 : .72 + frame.emergence * .23,
          selectionBias: pose.selectionBias,
          reducedMotion: pose.reducedMotion,
          eventDarkness: frame.darkness,
        }, frame.progress * 22);
        canvas.dataset.journeyChapter = frame.chapter;
        return frame.progress > 0 && frame.progress < 1;
      },
      render() {
        if (disposed) return;
        const needsOptics = world.optics.children.some(mesh => mesh.visible);
        let captureCalls = 0;
        let captureTriangles = 0;
        if (needsOptics) {
          world.optics.visible = false;
          activeRenderer.setRenderTarget(capture);
          activeRenderer.render(scene, camera);
          captureCalls = activeRenderer.info.render.calls;
          captureTriangles = activeRenderer.info.render.triangles;
          activeRenderer.setRenderTarget(null);
          world.optics.visible = true;
        }
        activeRenderer.render(scene, camera);
        canvas.dataset.sceneDrawCalls = String(captureCalls + activeRenderer.info.render.calls);
        canvas.dataset.sceneTriangles = String(captureTriangles + activeRenderer.info.render.triangles);
        canvas.dataset.refractionActive = String(needsOptics);
      },
      dispose() { scene.clear(); dispose(); },
    };
  } catch (error) { dispose(); throw error; }
}
