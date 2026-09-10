import { clamp01 } from "../motion/physics.ts";
import { GATEWAY_DIVISIONS } from "./destinations.ts";
import type { GatewayDivision } from "./state.ts";

export const BRIEFING_TIMING = {
  fullMotionMs: 5000,
  reducedMotionMs: 220,
} as const;

export type BriefingTimeline = {
  progress: number;
  seek: null | {
    from: number;
    to: number;
    startedAtMs: number;
    durationMs: number;
  };
};

export type BriefingFrame = {
  progress: number;
  acknowledgement: number;
  focus: number;
  identity: number;
  description: number;
  decision: number;
};

export type EntityInteraction = {
  hoverWeight: number;
  selectedWeight: number;
  recedeWeight: number;
  focusWeight: number;
};

export type DestinationInteraction = Record<
  GatewayDivision,
  EntityInteraction
>;

export type DestinationInteractionInput = {
  previewDivision: GatewayDivision | null;
  selectedDivision: GatewayDivision | null;
  briefingProgress: number;
};

const smoothRange = (progress: number, start: number, end: number) => {
  const normalized = clamp01((progress - start) / (end - start));
  return normalized * normalized * (3 - 2 * normalized);
};

export function createBriefingTimeline(
  initialProgress = 0,
): BriefingTimeline {
  return { progress: clamp01(initialProgress), seek: null };
}

export function seekBriefingTimeline(
  timeline: BriefingTimeline,
  target: number,
  nowMs: number,
  durationMs: number,
): BriefingTimeline {
  const to = clamp01(target);
  if (timeline.progress === to || durationMs <= 0) {
    return { progress: to, seek: null };
  }
  return {
    ...timeline,
    seek: {
      from: timeline.progress,
      to,
      startedAtMs: nowMs,
      durationMs,
    },
  };
}

export function stepBriefingTimeline(
  timeline: BriefingTimeline,
  nowMs: number,
): BriefingTimeline {
  if (!timeline.seek) return timeline;
  const elapsed = Math.max(0, nowMs - timeline.seek.startedAtMs);
  const amount = clamp01(elapsed / timeline.seek.durationMs);
  const progress =
    timeline.seek.from +
    (timeline.seek.to - timeline.seek.from) * amount;
  return amount === 1
    ? { progress: timeline.seek.to, seek: null }
    : { ...timeline, progress };
}

export function deriveBriefingFrame(progressInput: number): BriefingFrame {
  const progress = clamp01(progressInput);
  return {
    progress,
    acknowledgement: smoothRange(progress, 0, 0.2),
    focus: smoothRange(progress, 0.2, 0.56),
    identity: smoothRange(progress, 0.48, 0.76),
    description: smoothRange(progress, 0.68, 1),
    decision: progress === 1 ? 1 : 0,
  };
}

export function deriveDestinationInteraction(
  input: DestinationInteractionInput,
): DestinationInteraction {
  const progress = clamp01(input.briefingProgress);
  const focus = deriveBriefingFrame(progress).focus;
  return Object.fromEntries(
    GATEWAY_DIVISIONS.map((division) => {
      const hovered =
        input.selectedDivision === null && input.previewDivision === division
          ? 1
          : 0;
      const selected = input.selectedDivision === division ? progress : 0;
      const receded =
        input.selectedDivision !== null && input.selectedDivision !== division
          ? progress
          : 0;
      return [
        division,
        {
          hoverWeight: hovered,
          selectedWeight: selected,
          recedeWeight: receded,
          focusWeight: selected > 0 ? focus : hovered * 0.2,
        },
      ];
    }),
  ) as DestinationInteraction;
}
