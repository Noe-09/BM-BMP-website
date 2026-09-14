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

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
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
