import {
  BoxGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from "three";

import type { GatewayPose } from "./choreography";
import { damp } from "../motion/physics.ts";

export type GatewaySceneController = {
  setTarget(frame: GatewayPose): void;
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
  };
}

function smoothingFor(key: keyof SceneState) {
  if (key === "leftOpen" || key === "rightOpen") return 7;
  if (key.endsWith("Light") || key === "identityLeak") return 9;
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
    scene.background = new Color(0x111312);

    const camera = new PerspectiveCamera(48, 1, 0.1, 80);
    camera.position.set(0, 1.2, INITIAL_STATE.cameraZ);

    const ownMaterial = <T extends Material>(material: T) => {
      materials.push(material);
      return material;
    };
    const ownGeometry = <T extends BufferGeometry>(geometry: T) => {
      geometries.push(geometry);
      return geometry;
    };
    const box = (
      width: number,
      height: number,
      depth: number,
      material: MeshStandardMaterial,
    ) => new Mesh(ownGeometry(new BoxGeometry(width, height, depth)), material);
    const plane = (
      width: number,
      height: number,
      material: MeshStandardMaterial,
    ) => new Mesh(ownGeometry(new PlaneGeometry(width, height)), material);

    const concreteMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0x676863,
        roughness: 0.88,
        metalness: 0.03,
      }),
    );
    const monolithMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0x8b8981,
        roughness: 0.82,
        metalness: 0.02,
      }),
    );
    const blackenedMetalMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0x171918,
        roughness: 0.58,
        metalness: 0.34,
      }),
    );
    const lightCutMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0xc8c5b9,
        emissive: 0xc8c5b9,
        emissiveIntensity: 0.2,
        roughness: 0.72,
        metalness: 0,
        side: DoubleSide,
      }),
    );
    const visualWingMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0x6f706b,
        roughness: 0.9,
        metalness: 0.02,
      }),
    );
    const technicalWingMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0x6f706b,
        roughness: 0.84,
        metalness: 0.04,
      }),
    );
    const visualSlitMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0xbdb9ad,
        emissive: 0xbdb9ad,
        emissiveIntensity: 0.18,
        roughness: 0.78,
        metalness: 0,
      }),
    );
    const technicalSlitMaterial = ownMaterial(
      new MeshStandardMaterial({
        color: 0xaeb8bb,
        emissive: 0xaeb8bb,
        emissiveIntensity: 0.16,
        roughness: 0.7,
        metalness: 0,
      }),
    );

    // Six primary masses establish the pavilion: floor, paired walls, ceiling,
    // the light-cut terminus, and the central unmarked mineral monolith.
    const floor = box(16, 0.35, 40, concreteMaterial);
    floor.position.set(0, -2.65, -10);
    scene.add(floor);

    const leftWall = box(2.8, 8, 40, concreteMaterial);
    leftWall.position.set(-7.15, 1.2, -10);
    scene.add(leftWall);

    const rightWall = box(2.8, 8, 40, concreteMaterial);
    rightWall.position.set(7.15, 1.2, -10);
    scene.add(rightWall);

    const ceiling = box(16, 0.65, 40, concreteMaterial);
    ceiling.position.set(0, 5.35, -10);
    scene.add(ceiling);

    const lightCut = plane(7.2, 0.2, lightCutMaterial);
    lightCut.position.set(0, 4.72, -27.8);
    scene.add(lightCut);

    const monolith = box(2.1, 6.9, 2.2, monolithMaterial);
    monolith.position.set(0, 0.82, -25.4);
    scene.add(monolith);

    // The mineral entry frame is intentionally structural, not ornamental.
    const entryLeft = box(0.5, 7.4, 0.65, concreteMaterial);
    entryLeft.position.set(-5.65, 1.1, 3.5);
    scene.add(entryLeft);
    const entryRight = box(0.5, 7.4, 0.65, concreteMaterial);
    entryRight.position.set(5.65, 1.1, 3.5);
    scene.add(entryRight);
    const entryLintel = box(11.8, 0.55, 0.65, concreteMaterial);
    entryLintel.position.set(0, 4.55, 3.5);
    scene.add(entryLintel);

    const visualWing = new Group();
    visualWing.position.set(-3.5, 0.15, -22.8);
    const visualOuter = box(2.4, 5.9, 1.25, visualWingMaterial);
    visualOuter.position.x = -1.25;
    visualWing.add(visualOuter);
    const visualInner = box(1.15, 4.5, 1.55, visualWingMaterial);
    visualInner.position.set(0.65, -0.45, 0.05);
    visualWing.add(visualInner);
    const visualSlit = plane(2.35, 0.16, visualSlitMaterial);
    visualSlit.position.set(-0.35, 1.25, 0.79);
    visualWing.add(visualSlit);
    scene.add(visualWing);

    const technicalWing = new Group();
    technicalWing.position.set(3.5, 0.15, -22.8);
    const technicalOuter = box(2.4, 5.9, 1.25, technicalWingMaterial);
    technicalOuter.position.x = 1.25;
    technicalWing.add(technicalOuter);
    const technicalInner = box(1.15, 4.5, 1.55, technicalWingMaterial);
    technicalInner.position.set(-0.65, -0.45, 0.05);
    technicalWing.add(technicalInner);
    const technicalSlitHigh = plane(0.92, 0.07, technicalSlitMaterial);
    technicalSlitHigh.position.set(0.25, 1.42, 0.79);
    technicalWing.add(technicalSlitHigh);
    const technicalSlitLow = plane(0.64, 0.055, technicalSlitMaterial);
    technicalSlitLow.position.set(0.55, 1.05, 0.79);
    technicalWing.add(technicalSlitLow);
    scene.add(technicalWing);

    const leftThreshold = box(3.4, 0.055, 0.4, blackenedMetalMaterial);
    leftThreshold.position.set(-3.6, -2.43, -20.2);
    scene.add(leftThreshold);
    const rightThreshold = box(3.4, 0.055, 0.4, blackenedMetalMaterial);
    rightThreshold.position.set(3.6, -2.43, -20.2);
    scene.add(rightThreshold);

    const hemisphere = new HemisphereLight(0xd8d4c8, 0x171918, 0.42);
    scene.add(hemisphere);
    const neutralKey = new DirectionalLight(0xe2ded2, 1.05);
    neutralKey.position.set(-2.5, 5.5, 6);
    scene.add(neutralKey);
    const visualDiffuse = new PointLight(0xc9c0ad, 1.7, 15, 2);
    visualDiffuse.position.set(-4.5, 2.4, -18.5);
    scene.add(visualDiffuse);
    const technicalPrecision = new PointLight(0xb8c5ca, 1.35, 11, 2);
    technicalPrecision.position.set(4.3, 2.1, -19.2);
    scene.add(technicalPrecision);

    const neutralWingColor = new Color(0x6f706b);
    const visualWingColor = new Color(0x88847a);
    const technicalWingColor = new Color(0x667074);
    const neutralSlitColor = new Color(0xb8b7b0);
    const visualIdentityColor = new Color(0xd0c7b4);
    const technicalIdentityColor = new Color(0xb2c3ca);
    const current = { ...INITIAL_STATE };
    let target = { ...INITIAL_STATE };
    let disposed = false;

    const applyState = () => {
      camera.position.x = current.cameraX;
      camera.position.z = current.cameraZ;
      camera.rotation.y = current.cameraYaw;
      monolith.position.x = current.monolithX;

      visualWing.position.x = -3.5 - current.leftOpen * 2.15;
      visualWing.rotation.y = -current.leftOpen * 0.2;
      technicalWing.position.x = 3.5 + current.rightOpen * 2.15;
      technicalWing.rotation.y = current.rightOpen * 0.2;

      hemisphere.intensity = 0.16 + current.neutralLight * 0.5;
      neutralKey.intensity = 0.38 + current.neutralLight * 1.25;
      lightCutMaterial.emissiveIntensity = 0.08 + current.neutralLight * 0.42;

      visualWingMaterial.color
        .copy(neutralWingColor)
        .lerp(visualWingColor, current.identityLeak);
      technicalWingMaterial.color
        .copy(neutralWingColor)
        .lerp(technicalWingColor, current.identityLeak);
      visualWingMaterial.roughness = Math.min(
        1,
        0.9 + Math.max(0, current.visualLight - 0.7) * 0.2,
      );
      technicalWingMaterial.roughness = Math.max(
        0.56,
        0.84 - Math.max(0, current.technicalLight - 0.65) * 0.28,
      );
      visualSlitMaterial.color
        .copy(neutralSlitColor)
        .lerp(visualIdentityColor, current.identityLeak);
      visualSlitMaterial.emissive.copy(visualSlitMaterial.color);
      technicalSlitMaterial.color
        .copy(neutralSlitColor)
        .lerp(technicalIdentityColor, current.identityLeak);
      technicalSlitMaterial.emissive.copy(technicalSlitMaterial.color);

      visualDiffuse.color.copy(neutralSlitColor).lerp(
        visualIdentityColor,
        current.identityLeak,
      );
      visualDiffuse.intensity = 0.42 + current.visualLight * 2.6;
      visualSlitMaterial.emissiveIntensity =
        0.08 + current.visualLight * (0.3 + current.identityLeak * 0.55);

      technicalPrecision.color.copy(neutralSlitColor).lerp(
        technicalIdentityColor,
        current.identityLeak,
      );
      technicalPrecision.intensity = 0.32 + current.technicalLight * 2.35;
      technicalSlitMaterial.emissiveIntensity =
        0.06 + current.technicalLight * (0.36 + current.identityLeak * 0.72);
      technicalSlitMaterial.roughness = Math.max(
        0.42,
        0.7 - current.technicalLight * 0.16,
      );
    };

    applyState();

    return {
      setTarget(frame) {
        target = copyState(frame);
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

        for (const key of TRACKED_KEYS) {
          current[key] = damp(
            current[key],
            target[key],
            smoothingFor(key),
            deltaSeconds,
          );
        }

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
        scene.clear();
        disposeOwnedResources();
      },
    };
  } catch (error) {
    disposeOwnedResources();
    throw error;
  }
}
