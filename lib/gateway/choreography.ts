import { clamp01 } from "../motion/physics.ts";
import {
  deriveBriefingFrame,
  type BriefingFrame,
  type DestinationInteraction,
} from "./briefing.ts";
import type { GatewayDivision } from "./state.ts";

export type GatewayPoseInput = {
  travelProgress: number;
  briefingProgress: number;
  interactions: DestinationInteraction;
  selectedDivision: GatewayDivision | null;
  exitProgress: number;
  reducedMotion: boolean;
  coarsePointer: boolean;
};

export type GatewayPose = {
  reducedMotion: boolean;
  cameraZ: number;
  cameraX: number;
  cameraY: number;
  cameraYaw: number;
  cameraTargetX: number;
  cameraFov: number;
  leftOpen: number;
  rightOpen: number;
  visualLight: number;
  technicalLight: number;
  creatorLight: number;
  neutralLight: number;
  identityLeak: number;
  travelProgress: number;
  briefingProgress: number;
  briefingFrame: BriefingFrame;
  interactions: DestinationInteraction;
  selectedDivision: GatewayDivision | null;
  tension: number;
  aperture: number;
  eventDarkness: number;
};

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

const DIVISION_AXIS: Record<GatewayDivision, number> = {
  visuals: -1,
  creator: 0,
  technical: 1,
};

export function deriveGatewayPose(input: GatewayPoseInput): GatewayPose {
  const travelProgress = clamp01(input.travelProgress);
  const briefingProgress = clamp01(input.briefingProgress);
  const exitProgress = clamp01(input.exitProgress);
  const briefingFrame = deriveBriefingFrame(briefingProgress);
  const identityLeak = clamp01((travelProgress - 0.85) / 0.15);
  const startZ = 12;
  const endZ = input.coarsePointer ? -8 : -18;
  const previewDivision = (
    Object.keys(input.interactions) as GatewayDivision[]
  ).find((division) => input.interactions[division].hoverWeight > 0) ?? null;
  const previewAxis = previewDivision ? DIVISION_AXIS[previewDivision] : 0;
  const previewAmount = previewDivision
    ? input.interactions[previewDivision].hoverWeight
    : 0;
  const spatialMotion = input.reducedMotion ? 0 : 1;
  const focus = briefingFrame.focus * spatialMotion;

  let cameraZ = input.reducedMotion
    ? endZ
    : lerp(startZ, endZ, travelProgress) - focus * 1.4;
  if (!input.reducedMotion && input.selectedDivision) {
    cameraZ -= exitProgress * 3.2;
  }

  const neutralLight = clamp01(0.52 + identityLeak * 0.18);
  const visualInteraction = input.interactions.visuals;
  const technicalInteraction = input.interactions.technical;
  const creatorInteraction = input.interactions.creator;
  const visualAuthority = Math.max(
    visualInteraction.hoverWeight * 0.8,
    visualInteraction.selectedWeight,
  );
  const technicalAuthority = Math.max(
    technicalInteraction.hoverWeight * 0.8,
    technicalInteraction.selectedWeight,
  );
  const creatorAuthority = Math.max(
    creatorInteraction.hoverWeight * 0.8,
    creatorInteraction.selectedWeight,
  );

  const visualLight = clamp01(
    neutralLight + identityLeak * 0.08 + visualAuthority * 0.24,
  );
  const technicalLight = clamp01(
    neutralLight - identityLeak * 0.07 + technicalAuthority * 0.28,
  );
  const creatorLight = clamp01(
    neutralLight - identityLeak * 0.02 + creatorAuthority * 0.25,
  );
  const leftOpen = clamp01(
    identityLeak * 0.18 + visualAuthority * 0.28 * spatialMotion,
  );
  const rightOpen = clamp01(
    identityLeak * 0.12 + technicalAuthority * 0.3 * spatialMotion,
  );

  const tension = clamp01(
    Math.sin(travelProgress * Math.PI) * 0.85 + previewAmount * 0.15,
  );
  const aperture = clamp01((travelProgress - 0.28) / 0.32);
  const darknessWindow = clamp01((travelProgress - 0.62) / 0.14);
  const darknessDecay = clamp01((0.86 - travelProgress) / 0.12);
  const eventDarkness = input.reducedMotion
    ? 0
    : Math.min(darknessWindow, darknessDecay) * 0.72;

  return {
    reducedMotion: input.reducedMotion,
    cameraZ,
    cameraX: spatialMotion * (previewAxis * 0.18 + focus * 0.72),
    cameraY: spatialMotion * focus * 0.06,
    cameraYaw: spatialMotion * (previewAxis * 0.012 - focus * 0.022),
    cameraTargetX: spatialMotion * focus * -1.25,
    cameraFov: 46 - focus * 2.5,
    leftOpen,
    rightOpen,
    visualLight,
    technicalLight,
    creatorLight,
    neutralLight,
    identityLeak,
    travelProgress,
    briefingProgress,
    briefingFrame,
    interactions: input.interactions,
    selectedDivision: input.selectedDivision,
    tension,
    aperture,
    eventDarkness,
  };
}
