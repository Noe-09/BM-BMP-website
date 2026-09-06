import { clamp01, damp } from "../../motion/physics.ts";

export type VisualJourney = {
  targetProgress: number;
  renderProgress: number;
  autoplayVelocity: number;
  lastInputAtMs: number | null;
  seek: null | { from: number; to: number; startedAtMs: number; durationMs: number };
};

export function createJourney(progress = 0): VisualJourney {
  return { targetProgress: clamp01(progress), renderProgress: clamp01(progress), autoplayVelocity: 0, lastInputAtMs: null, seek: null };
}

export function impulseJourney(state: VisualJourney, pixels: number, nowMs: number): VisualJourney {
  if (!Number.isFinite(pixels) || pixels === 0) return state;
  const impulse = Math.max(-180, Math.min(180, pixels)) * .00075;
  // Reverse starts behind the rendered frame, cancelling any buffered forward lead.
  const origin = impulse < 0
    ? Math.min(state.targetProgress, state.renderProgress)
    : Math.max(state.targetProgress, state.renderProgress);
  return { ...state, targetProgress: clamp01(origin + impulse), autoplayVelocity: 0, lastInputAtMs: nowMs, seek: null };
}

export function seekJourney(state: VisualJourney, to: number, nowMs: number, durationMs = 800): VisualJourney {
  return { ...state, autoplayVelocity: 0, seek: { from: state.renderProgress, to: clamp01(to), startedAtMs: nowMs, durationMs: Math.max(1, durationMs) } };
}

export function stepJourney(state: VisualJourney, deltaSeconds: number, nowMs: number, autoplayAllowed: boolean): VisualJourney {
  if (state.seek) {
    const t = clamp01((nowMs - state.seek.startedAtMs) / state.seek.durationMs);
    const progress = state.seek.from + (state.seek.to - state.seek.from) * t * t * (3 - 2 * t);
    return { ...state, targetProgress: progress, renderProgress: progress, autoplayVelocity: 0, seek: t === 1 ? null : state.seek };
  }
  const t = state.lastInputAtMs === null ? 1 : clamp01((nowMs - state.lastInputAtMs - 850) / 900);
  const autoplayVelocity = autoplayAllowed && state.targetProgress < 1 ? .055 * t * t * (3 - 2 * t) : 0;
  const dt = Math.max(0, Math.min(.05, deltaSeconds));
  const targetProgress = clamp01(state.targetProgress + autoplayVelocity * dt);
  let renderProgress = damp(state.renderProgress, targetProgress, 8.5, dt);
  if (Math.abs(targetProgress - renderProgress) < .0005) renderProgress = targetProgress;
  return { ...state, targetProgress, renderProgress, autoplayVelocity: targetProgress === 1 ? 0 : autoplayVelocity };
}
