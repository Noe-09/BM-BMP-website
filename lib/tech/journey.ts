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
  interaction: "simulation-focus" | "context";
};

export type TechRouteSimulationState =
  | "baseline"
  | "resolved"
  | "current"
  | "held";

const TECH_ROUTE_ORDER = [
  "ingest-normalize",
  "normalize-orchestrate",
  "orchestrate-assist",
  "assist-checkpoint",
  "checkpoint-execute",
  "execute-return",
  "return-ingest",
] as const;

const TECH_PHASE_ROUTE_STATES: Partial<
  Record<TechPhase, { current: readonly number[]; resolvedThrough: number; held?: number }>
> = {
  ingest: { current: [0], resolvedThrough: -1 },
  normalize: { current: [1], resolvedThrough: 0 },
  orchestrate: { current: [2], resolvedThrough: 1 },
  assist: { current: [3], resolvedThrough: 2 },
  checkpoint: { current: [], resolvedThrough: 3, held: 4 },
  execute: { current: [4, 5], resolvedThrough: 3 },
  return: { current: [6], resolvedThrough: 5 },
};

const TECH_CAUSAL_CONSEQUENCES: Partial<
  Record<TechPhase, TechCausalConsequence>
> = {
  ingest: { effect: "signal-enter", propagation: "flow", tone: "signal", interaction: "simulation-focus" },
  normalize: { effect: "data-structure", propagation: "flow", tone: "signal", interaction: "simulation-focus" },
  orchestrate: { effect: "route-resolve", propagation: "flow", tone: "signal", interaction: "simulation-focus" },
  assist: { effect: "assist-form", propagation: "flow", tone: "signal", interaction: "simulation-focus" },
  checkpoint: { effect: "human-hold", propagation: "hold", tone: "human", interaction: "simulation-focus" },
  execute: { effect: "output-propagate", propagation: "flow", tone: "signal", interaction: "simulation-focus" },
  return: { effect: "feedback-return", propagation: "flow", tone: "signal", interaction: "simulation-focus" },
};

const CONTEXT_CONSEQUENCE: TechCausalConsequence = {
  effect: "context",
  propagation: "hold",
  tone: "planned",
  interaction: "context",
};

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getTechCausalConsequence(phase: TechPhase) {
  return TECH_CAUSAL_CONSEQUENCES[phase] ?? CONTEXT_CONSEQUENCE;
}

export function getTechRouteSimulationState(
  phase: TechPhase,
  routeId: string,
): TechRouteSimulationState {
  const routeIndex = TECH_ROUTE_ORDER.indexOf(
    routeId as (typeof TECH_ROUTE_ORDER)[number],
  );
  const phaseState = TECH_PHASE_ROUTE_STATES[phase];

  if (routeIndex === -1 || !phaseState) {
    return "baseline";
  }
  if (phaseState.held === routeIndex) {
    return "held";
  }
  if (phaseState.current.includes(routeIndex)) {
    return "current";
  }
  if (routeIndex <= phaseState.resolvedThrough) {
    return "resolved";
  }
  return "baseline";
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
