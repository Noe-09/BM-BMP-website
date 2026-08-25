import type { GatewayDivision } from "./state";
import { clamp01 } from "../motion/physics.ts";

export type GatewayPoseInput = {
  travelProgress: number;
  selectionBias: -1 | 0 | 1;
  exitProgress: number;
  committed: GatewayDivision | null;
  reducedMotion: boolean;
  coarsePointer: boolean;
};

export type GatewayPose = {
  cameraZ: number;
  cameraX: number;
  cameraYaw: number;
  monolithX: number;
  leftOpen: number;
  rightOpen: number;
  visualLight: number;
  technicalLight: number;
  neutralLight: number;
  identityLeak: number;
  leftPercent: number;
  rightPercent: number;
  travelProgress: number;
  tension: number;
  aperture: number;
  eventDarkness: number;
  selectionBias: number;
};

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

export function deriveGatewayPose(input: GatewayPoseInput): GatewayPose {
  const travelProgress = clamp01(input.travelProgress);
  const exitProgress = clamp01(input.exitProgress);
  const selectionBias = Math.max(-1, Math.min(1, input.selectionBias));
  const identityLeak = clamp01((travelProgress - 0.85) / 0.15);
  const startZ = 12;
  const endZ = input.coarsePointer ? -8 : -18;

  // Reduced motion keeps the scene at its settled endpoint while DOM ratios
  // and contrast remain useful for communicating the selected destination.
  let cameraZ = input.reducedMotion
    ? endZ
    : lerp(startZ, endZ, travelProgress);
  const committedBias =
    input.committed === "visuals" ? -1 : input.committed === "technical" ? 1 : 0;
  if (!input.reducedMotion && committedBias !== 0) cameraZ -= exitProgress * 4;

  const previewAmount = Math.abs(selectionBias);
  const coarse = input.coarsePointer ? 1 : 0;
  const selectedPercent = coarse ? 68 : 62;
  const leftPercent =
    selectionBias < 0
      ? selectedPercent
      : selectionBias > 0
        ? 100 - selectedPercent
        : 50;
  const rightPercent =
    selectionBias > 0
      ? selectedPercent
      : selectionBias < 0
        ? 100 - selectedPercent
        : 50;

  const neutralLight = clamp01(0.52 + identityLeak * 0.18);
  const visualBase = neutralLight + identityLeak * 0.08;
  const technicalBase = neutralLight - identityLeak * 0.07;
  const softTravel = 1 - (1 - travelProgress) ** 2;
  const visualPreview =
    selectionBias < 0 ? previewAmount * (0.12 + 0.16 * softTravel) : 0;
  const technicalPreview =
    selectionBias > 0 ? previewAmount * (0.14 + 0.18 * travelProgress) : 0;
  const spatialPreviewScale = input.reducedMotion ? 0 : 1;
  let leftOpen = clamp01(
    identityLeak * 0.18 + visualPreview * spatialPreviewScale,
  );
  let rightOpen = clamp01(
    identityLeak * 0.12 + technicalPreview * spatialPreviewScale,
  );
  let visualLight = clamp01(visualBase + visualPreview);
  let technicalLight = clamp01(technicalBase + technicalPreview);
  let cameraX = input.reducedMotion ? 0 : selectionBias * 0.32;
  let cameraYaw = input.reducedMotion ? 0 : selectionBias * 0.018;

  if (!input.reducedMotion && committedBias < 0) {
    leftOpen = clamp01(leftOpen + exitProgress * 0.38);
    visualLight += exitProgress * 0.22;
  }
  if (!input.reducedMotion && committedBias > 0) {
    rightOpen = clamp01(rightOpen + exitProgress * 0.16);
    technicalLight += exitProgress * 0.28;
    cameraX += exitProgress * 0.48;
    cameraYaw *= 1 - exitProgress;
  }

  // Living Matter Traversal Metrics:
  // 1. Tension: Peaks during aperture formation & deep pass-through
  const tension = clamp01(
    Math.sin(travelProgress * Math.PI) * 0.85 + previewAmount * 0.15,
  );

  // 2. Aperture: Begins opening at 0.30, fully open through pass-through and emergence
  const aperture = clamp01((travelProgress - 0.28) / 0.32);

  // 3. Event Darkness: Controlled momentary graphite shadow during deep pass-through (0.65 - 0.84)
  const darknessWindow = clamp01((travelProgress - 0.62) / 0.14);
  const darknessDecay = clamp01((0.86 - travelProgress) / 0.12);
  const eventDarkness = input.reducedMotion
    ? 0
    : Math.min(darknessWindow, darknessDecay) * 0.72;

  return {
    cameraZ,
    cameraX,
    cameraYaw,
    monolithX: input.reducedMotion ? 0 : selectionBias * 1.1,
    leftOpen,
    rightOpen,
    visualLight,
    technicalLight,
    neutralLight,
    identityLeak,
    leftPercent,
    rightPercent,
    travelProgress,
    tension,
    aperture,
    eventDarkness,
    selectionBias,
  };
}
