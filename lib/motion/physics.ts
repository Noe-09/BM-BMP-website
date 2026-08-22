export const MOTION = {
  duration: {
    micro: 220,
    component: 560,
    scene: 1100,
  },
  easing: {
    responsive: "cubic-bezier(0.22, 1, 0.36, 1)",
    scene: "cubic-bezier(0.16, 1, 0.3, 1)",
    settle: "cubic-bezier(0.33, 1, 0.68, 1)",
  },
  amplitude: {
    micro: 6,
    component: 18,
    rotation: 2.4,
    scale: 1.025,
  },
  damping: {
    pointer: 8,
    scroll: 6,
    cursor: 18,
  },
} as const;

export type PointerCapability = "fine" | "coarse" | "none";

export type InteractionSignals = {
  finePointer: boolean;
  coarsePointer: boolean;
  reducedMotion: boolean;
};

export type InteractionProfile = {
  pointer: PointerCapability;
  reducedMotion: boolean;
  allowPointerDepth: boolean;
  allowAmbientMotion: boolean;
};

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function damp(
  current: number,
  target: number,
  smoothing: number,
  deltaSeconds: number,
) {
  const weight = 1 - Math.exp(-smoothing * Math.max(0, deltaSeconds));
  return current + (target - current) * weight;
}

export function getSceneProgress({
  top,
  height,
  viewportHeight,
}: {
  top: number;
  height: number;
  viewportHeight: number;
}) {
  const travel = Math.max(1, height - viewportHeight);
  return clamp01(-top / travel);
}

export function getActiveSceneIndex(sceneTops: number[], viewportMarker: number) {
  let activeIndex = 0;
  sceneTops.forEach((top, index) => {
    if (top <= viewportMarker) activeIndex = index;
  });
  return activeIndex;
}

export function resolveInteractionProfile({
  finePointer,
  coarsePointer,
  reducedMotion,
}: InteractionSignals): InteractionProfile {
  const pointer: PointerCapability = coarsePointer
    ? "coarse"
    : finePointer
      ? "fine"
      : "none";

  return {
    pointer,
    reducedMotion,
    allowPointerDepth: pointer === "fine" && !reducedMotion,
    allowAmbientMotion: !reducedMotion,
  };
}
