import type { TechPhase } from "@/content/tech";

export const TECH_PHASES: readonly TechPhase[] = [
  "observe",
  "ingest",
  "normalize",
  "orchestrate",
  "assist",
  "checkpoint",
  "execute",
  "return",
  "state",
  "spectrum",
  "register",
  "close",
];

export type TechPhaseAnchor = {
  phase: TechPhase;
  position: number;
};

export type TechCausalConsequence = {
  effect:
    | "signal-enter"
    | "data-structure"
    | "route-resolve"
    | "assist-form"
    | "human-hold"
    | "output-propagate"
    | "feedback-return"
    | "context";
  propagation: "flow" | "hold";
  tone: "signal" | "human" | "planned";
};

const TECH_CAUSAL_CONSEQUENCES: Partial<
  Record<TechPhase, TechCausalConsequence>
> = {
  ingest: { effect: "signal-enter", propagation: "flow", tone: "signal" },
  normalize: { effect: "data-structure", propagation: "flow", tone: "signal" },
  orchestrate: { effect: "route-resolve", propagation: "flow", tone: "signal" },
  assist: { effect: "assist-form", propagation: "flow", tone: "signal" },
  checkpoint: { effect: "human-hold", propagation: "hold", tone: "human" },
  execute: { effect: "output-propagate", propagation: "flow", tone: "signal" },
  return: { effect: "feedback-return", propagation: "flow", tone: "signal" },
};

const CONTEXT_CONSEQUENCE: TechCausalConsequence = {
  effect: "context",
  propagation: "hold",
  tone: "planned",
};

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getTechCausalConsequence(phase: TechPhase) {
  return TECH_CAUSAL_CONSEQUENCES[phase] ?? CONTEXT_CONSEQUENCE;
}

export function dampTechProgress(
  current: number,
  target: number,
  deltaSeconds: number,
  lambda = 16,
) {
  const alpha = 1 - Math.exp(-lambda * Math.max(0, deltaSeconds));
  return current + (target - current) * alpha;
}

export function getTechPhase(progress: number) {
  const clamped = clamp01(progress);
  const scaled = clamped * TECH_PHASES.length;
  const index = Math.min(TECH_PHASES.length - 1, Math.floor(scaled));
  const phaseStart = index / TECH_PHASES.length;
  const phaseEnd = (index + 1) / TECH_PHASES.length;
  const phaseProgress =
    phaseEnd === phaseStart
      ? 1
      : clamp01((clamped - phaseStart) / (phaseEnd - phaseStart));

  return {
    phase: TECH_PHASES[index],
    phaseProgress,
  };
}

export function getAnchoredTechPhase(
  anchors: readonly TechPhaseAnchor[],
  readingPosition: number,
) {
  const ordered = [...anchors].sort((a, b) => a.position - b.position);
  const first = ordered[0];

  if (!first) {
    return { phase: "observe" as const, phaseProgress: 0 };
  }

  const index = ordered.findIndex((anchor, nextIndex) => {
    const next = ordered[nextIndex + 1];
    return readingPosition >= anchor.position && (!next || readingPosition < next.position);
  });
  const activeIndex = index === -1 ? 0 : index;
  const active = ordered[activeIndex];
  const next = ordered[activeIndex + 1];

  return {
    phase: active.phase,
    phaseProgress: next
      ? clamp01((readingPosition - active.position) / Math.max(1, next.position - active.position))
      : 1,
  };
}
