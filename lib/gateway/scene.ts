import {
  Color,
  DirectionalLight,
  FogExp2,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from "three";

import type { GatewayPose } from "./choreography";
import { LivingMatterSystem } from "./matter/livingMatterSystem";
import { damp } from "../motion/physics.ts";

export type GatewaySceneController = {
  setTarget(frame: GatewayPose): void;
  setPointer?(x: number, y: number): void;
  resize(width: number, height: number, dpr: number): void;
  tick(deltaSeconds: number): boolean;
  render(): void;
  dispose(): void;
};

type SceneState = Pick<
  GatewayPose,
  | "cameraZ"
  | "cameraX"
  | "cameraYaw"
  | "monolithX"
  | "leftOpen"
  | "rightOpen"
  | "visualLight"
  | "technicalLight"
  | "neutralLight"
  | "identityLeak"
  | "travelProgress"
  | "tension"
  | "aperture"
  | "eventDarkness"
  | "selectionBias"
>;

const TRACKED_KEYS = [
  "cameraZ",
  "cameraX",
  "cameraYaw",
  "monolithX",
  "leftOpen",
  "rightOpen",
  "visualLight",
  "technicalLight",
  "neutralLight",
  "identityLeak",
  "travelProgress",
  "tension",
  "aperture",
  "eventDarkness",
  "selectionBias",
] as const satisfies readonly (keyof SceneState)[];

const INITIAL_STATE: SceneState = {
  cameraZ: 12,
  cameraX: 0,
  cameraYaw: 0,
  monolithX: 0,
  leftOpen: 0,
  rightOpen: 0,
  visualLight: 0.52,
  technicalLight: 0.52,
  neutralLight: 0.52,
  identityLeak: 0,
  travelProgress: 0,
  tension: 0,
  aperture: 0,
  eventDarkness: 0,
  selectionBias: 0,
};

const EPSILON = 0.0005;

function copyState(pose: GatewayPose): SceneState {
  return {
    cameraZ: pose.cameraZ,
    cameraX: pose.cameraX,
    cameraYaw: pose.cameraYaw,
    monolithX: pose.monolithX,
    leftOpen: pose.leftOpen,
    rightOpen: pose.rightOpen,
    visualLight: pose.visualLight,
    technicalLight: pose.technicalLight,
    neutralLight: pose.neutralLight,
    identityLeak: pose.identityLeak,
    travelProgress: pose.travelProgress ?? 0,
    tension: pose.tension ?? 0,
    aperture: pose.aperture ?? 0,
    eventDarkness: pose.eventDarkness ?? 0,
    selectionBias: pose.selectionBias ?? 0,
  };
}

function smoothingFor(key: keyof SceneState) {
  if (key === "leftOpen" || key === "rightOpen") return 7;
  if (key.endsWith("Light") || key === "identityLeak") return 9;
  if (key === "travelProgress" || key === "aperture") return 6;
  if (key === "selectionBias") return 8;
  return 5.5;
}

export function createGatewayScene(
  canvas: HTMLCanvasElement,
): GatewaySceneController {
  const geometries: BufferGeometry[] = [];
  const materials: Material[] = [];
  let renderer: WebGLRenderer | undefined;
  let resourcesDisposed = false;

  const disposeOwnedResources = () => {
    if (resourcesDisposed) return;
    resourcesDisposed = true;
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    renderer?.dispose();
  };

  try {
    const activeRenderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer = activeRenderer;
    activeRenderer.outputColorSpace = SRGBColorSpace;

    const scene = new Scene();
    const warmMineralWhite = new Color(0xf4f2ec);
    const deepGraphite = new Color(0x131514);
    const activeBgColor = warmMineralWhite.clone();
    scene.background = activeBgColor;
    const activeFog = new FogExp2(0xf4f2ec, 0.022);
    scene.fog = activeFog;

    const camera = new PerspectiveCamera(46, 1, 0.1, 80);
    camera.position.set(0, 0, INITIAL_STATE.cameraZ);

    const ownMaterial = <T extends Material>(material: T) => {
      materials.push(material);
      return material;
    };
    const ownGeometry = <T extends BufferGeometry>(geometry: T) => {
      geometries.push(geometry);
      return geometry;
    };

    // Decorative mineral wing boundary materials (preserved for subtle lateral spatial presence & contracts)
    const visualWingMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0xe2ded5,
        roughness: 0.9,
        metalness: 0.02,
        transparent: true,
        opacity: 0,
      }),
    );
    const technicalWingMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0xded9cf,
        roughness: 0.84,
        metalness: 0.04,
        transparent: true,
        opacity: 0,
      }),
    );

    // Initialize the Living Matter system
    const livingMatter = new LivingMatterSystem();
    scene.add(livingMatter.group);

    // Subtle background mineral plane
    const backdropGeo = ownGeometry(new PlaneGeometry(40, 40));
    const backdropMat = ownMaterial(
      new MeshStandardMaterial({
        color: 0xf4f2ec,
        roughness: 0.98,
        metalness: 0,
      }),
    );
    const backdrop = new Mesh(backdropGeo, backdropMat);
    backdrop.position.set(0, 0, -32);
    scene.add(backdrop);

    // Ambient mineral lighting
    const hemisphere = new HemisphereLight(0xfcfbf7, 0xdedad1, 0.65);
    scene.add(hemisphere);

    const keyLight = new DirectionalLight(0xfffefb, 1.2);
    keyLight.position.set(-2, 6, 8);
    scene.add(keyLight);

    const fillLight = new PointLight(0xe8e4da, 1.4, 25, 2);
    fillLight.position.set(3, 1, 4);
    scene.add(fillLight);

    const current = { ...INITIAL_STATE };
    let target = { ...INITIAL_STATE };
    let totalElapsedTime = 0;
    let disposed = false;

    const pointerVec = new Vector2(0, 0);

    const applyState = () => {
      camera.position.x = current.cameraX;
      camera.position.z = current.cameraZ;
      camera.rotation.y = current.cameraYaw;

      // Event darkness affects scene background, fog, and light intensities
      const darkness = current.eventDarkness;
      if (darkness > 0.001) {
        activeBgColor.copy(warmMineralWhite).lerp(deepGraphite, darkness * 0.9);
        activeFog.color.copy(activeBgColor);
      } else {
        activeBgColor.copy(warmMineralWhite);
        activeFog.color.copy(warmMineralWhite);
      }

      hemisphere.intensity =
        (0.65 - darkness * 0.45) * (0.8 + current.neutralLight * 0.4);
      keyLight.intensity =
        (1.2 - darkness * 0.8) * (0.8 + current.visualLight * 0.4);
      fillLight.intensity =
        (1.4 - darkness * 0.9) * (0.8 + current.technicalLight * 0.4);

      // Material roughness and properties updates
      visualWingMaterial.roughness = Math.min(
        1,
        0.9 + Math.max(0, current.visualLight - 0.7) * 0.2,
      );
      technicalWingMaterial.roughness = Math.max(
        0.56,
        0.84 - Math.max(0, current.technicalLight - 0.65) * 0.28,
      );
    };

    applyState();

    return {
      setTarget(frame) {
        target = copyState(frame);
      },
      setPointer(x: number, y: number) {
        pointerVec.set(x, y);
        livingMatter.setPointer(x, y);
      },
      resize(width, height, dpr) {
        if (disposed || width <= 0 || height <= 0) return;
        activeRenderer.setPixelRatio(dpr);
        activeRenderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      },
      tick(deltaSeconds) {
        if (disposed) return false;
        totalElapsedTime += deltaSeconds;

        for (const key of TRACKED_KEYS) {
          current[key] = damp(
            current[key],
            target[key],
            smoothingFor(key),
            deltaSeconds,
          );
        }

        livingMatter.tick(
          deltaSeconds,
          {
            progress: current.travelProgress,
            tension: current.tension,
            aperture: current.aperture,
            pointer: pointerVec,
            eventDarkness: current.eventDarkness,
            reducedMotion: false,
            identityLeak: current.identityLeak,
            selectionBias: current.selectionBias,
          },
          totalElapsedTime,
        );

        const settling = TRACKED_KEYS.some(
          (key) => Math.abs(target[key] - current[key]) > EPSILON,
        );
        if (!settling) Object.assign(current, target);
        applyState();
        return settling;
      },
      render() {
        if (!disposed) activeRenderer.render(scene, camera);
      },
      dispose() {
        if (disposed) return;
        disposed = true;
        livingMatter.dispose();
        scene.clear();
        disposeOwnedResources();
      },
    };
  } catch (error) {
    disposeOwnedResources();
    throw error;
  }
}
