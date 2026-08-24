import { clamp01, damp, MOTION } from "../motion/physics.ts";
import type { GatewayPhase } from "./state.ts";

export type LoaderMode = "first" | "short";

export type GatewayPresentation = {
  enhancementActive: boolean;
  enhancementHealthy: boolean;
  fallbackActive: boolean;
  showLoader: boolean;
  showSelection: boolean;
  showTravelCue: boolean;
  layerOwner: "fallback" | "enhancement";
};

export const GATEWAY_TIMING = {
  loaderMinMs: 2400,
  shortLoaderMs: 600,
  readyHoldMs: 260,
  skipRevealMs: 1350,
  fallbackMs: 9000,
  autoEntryMs: 1750,
  autoEntryCoarseMs: 1200,
  skipFastForwardMs: 800,
  exitMs: 850,
  navigationFallbackMs: 1400,
} as const;

export function getGatewayPresentation({
  phase,
  enhancementStarted,
  sceneReady,
  selectionOverlayPresent,
}: {
  phase: GatewayPhase;
  enhancementStarted: boolean;
  sceneReady: boolean;
  selectionOverlayPresent: boolean;
}): GatewayPresentation {
  const enhancementActive = enhancementStarted && phase !== "fallback";
  const enhancementHealthy = enhancementActive && sceneReady;
  const showLoader =
    enhancementHealthy && (phase === "loading" || phase === "ready");
  const showTravelCue = enhancementHealthy && phase === "user-travel";
  const showSelection =
    enhancementHealthy &&
    selectionOverlayPresent &&
    (phase === "split" ||
      phase === "preview" ||
      phase === "commit" ||
      phase === "exit");
  const fallbackActive = !showSelection;
  const enhancementOwnsLayer =
    phase === "loading" ||
    phase === "ready" ||
    phase === "auto-entry" ||
    phase === "user-travel" ||
    phase === "commit" ||
    phase === "exit";

  return {
    enhancementActive,
    enhancementHealthy,
    fallbackActive,
    showLoader,
    showSelection,
    showTravelCue,
    layerOwner:
      enhancementHealthy && (enhancementOwnsLayer || showSelection)
        ? "enhancement"
        : "fallback",
  };
}

export function getLoaderMode(returning: boolean, reducedMotion: boolean): LoaderMode {
  return returning || reducedMotion ? "short" : "first";
}

export function getLoaderTarget(
  realProgress: number,
  elapsedMs: number,
  mode: LoaderMode,
): number {
  const minimum =
    mode === "first" ? GATEWAY_TIMING.loaderMinMs : GATEWAY_TIMING.shortLoaderMs;

  if (realProgress >= 1 && elapsedMs >= minimum) return 1;
  return Math.min(clamp01(realProgress), 0.96);
}

export function formatLoaderNumber(progress: number): string {
  return String(Math.round(clamp01(progress) * 100)).padStart(2, "0");
}

export function shouldShowSkip(elapsedMs: number, mode: LoaderMode): boolean {
  return mode === "first" && elapsedMs > GATEWAY_TIMING.skipRevealMs;
}

export function applyTravelDelta(progress: number, delta: number): number {
  return clamp01(progress + delta * 0.0012);
}

export function stepTravelProgress(
  current: number,
  target: number,
  deltaSeconds: number,
): number {
  return damp(current, target, MOTION.damping.scroll, deltaSeconds);
}
