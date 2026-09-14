export type CreatorDirection = -1 | 0 | 1;

export type CreatorJourneyState = {
  globalCreatorProgress: number;
  activeWorld: string | null;
  worldProgress: number;
  direction: CreatorDirection;
  velocity: number;
  reducedMotion: boolean;
};

export type CreatorJourneyInput = {
  progress: number;
  previousProgress: number;
  elapsedMs: number;
  worldSlugs: readonly string[];
  reducedMotion: boolean;
};

export type CreatorVisualDampingOptions = {
  lambda?: number;
  maxLag?: number;
  snapGap?: number;
  epsilon?: number;
  reducedMotion?: boolean;
};

export type CreatorVisualDampingState = {
  value: number;
  settled: boolean;
};

export type CreatorPresenceState = {
  frameProgress: number;
  presence: number;
};

const CREATOR_VISUAL_DAMPING = {
  lambda: 18,
  maxLag: 0.1,
  snapGap: 0.36,
  epsilon: 0.0001,
} as const;

export function clampCreatorProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function dampCreatorVisualProgress(
  current: number,
  target: number,
  elapsedMs: number,
  options: CreatorVisualDampingOptions = {},
): CreatorVisualDampingState {
  const targetValue = clampCreatorProgress(target);
  if (!Number.isFinite(current) || options.reducedMotion) {
    return { value: targetValue, settled: true };
  }

  const currentValue = clampCreatorProgress(current);
  const lambda = Math.max(0, options.lambda ?? CREATOR_VISUAL_DAMPING.lambda);
  const maxLag = Math.max(0, options.maxLag ?? CREATOR_VISUAL_DAMPING.maxLag);
  const snapGap = Math.max(maxLag, options.snapGap ?? CREATOR_VISUAL_DAMPING.snapGap);
  const epsilon = Math.max(0, options.epsilon ?? CREATOR_VISUAL_DAMPING.epsilon);
  const gap = targetValue - currentValue;

  if (Math.abs(gap) <= epsilon || Math.abs(gap) >= snapGap) {
    return { value: targetValue, settled: true };
  }

  const boundedCurrent =
    Math.abs(gap) > maxLag
      ? targetValue - Math.sign(gap) * maxLag
      : currentValue;
  const deltaSeconds = Math.max(0, elapsedMs) / 1000;
  const alpha = 1 - Math.exp(-lambda * deltaSeconds);
  const value = boundedCurrent + (targetValue - boundedCurrent) * alpha;

  if (Math.abs(targetValue - value) <= epsilon) {
    return { value: targetValue, settled: true };
  }

  return { value: clampCreatorProgress(value), settled: false };
}

export function getCreatorPresenceState(progress: number): CreatorPresenceState {
  const value = clampCreatorProgress(progress);
  const approachStart = 0.18;
  const presenceStart = 0.42;
  const presenceEnd = 0.58;
  const departureEnd = 0.82;

  if (value <= approachStart) return { frameProgress: 0, presence: 0 };
  if (value < presenceStart) {
    return {
      frameProgress:
        ((value - approachStart) / (presenceStart - approachStart)) * 0.5,
      presence: (value - approachStart) / (presenceStart - approachStart),
    };
  }
  if (value <= presenceEnd) return { frameProgress: 0.5, presence: 1 };
  if (value < departureEnd) {
    return {
      frameProgress:
        0.5 +
        ((value - presenceEnd) / (departureEnd - presenceEnd)) * 0.5,
      presence: (departureEnd - value) / (departureEnd - presenceEnd),
    };
  }

  return { frameProgress: 1, presence: 0 };
}

export function getCreatorWorldProgress(
  globalProgress: number,
  worldCount: number,
): { activeIndex: number; worldProgress: number } {
  if (!Number.isInteger(worldCount) || worldCount <= 0) {
    return { activeIndex: -1, worldProgress: 0 };
  }

  const clamped = clampCreatorProgress(globalProgress);
  const scaled = clamped * worldCount;
  const activeIndex = Math.min(worldCount - 1, Math.floor(scaled));
  const worldProgress =
    activeIndex === worldCount - 1 && clamped === 1
      ? 1
      : scaled - activeIndex;

  return { activeIndex, worldProgress };
}

export function getCreatorDirection(
  previousProgress: number,
  currentProgress: number,
): CreatorDirection {
  if (currentProgress > previousProgress) return 1;
  if (currentProgress < previousProgress) return -1;
  return 0;
}

export function getCreatorJourneyState({
  progress,
  previousProgress,
  elapsedMs,
  worldSlugs,
  reducedMotion,
}: CreatorJourneyInput): CreatorJourneyState {
  const globalCreatorProgress = clampCreatorProgress(progress);
  const previous = clampCreatorProgress(previousProgress);
  const { activeIndex, worldProgress } = getCreatorWorldProgress(
    globalCreatorProgress,
    worldSlugs.length,
  );

  return {
    globalCreatorProgress,
    activeWorld: activeIndex >= 0 ? worldSlugs[activeIndex] ?? null : null,
    worldProgress,
    direction: getCreatorDirection(previous, globalCreatorProgress),
    velocity:
      elapsedMs > 0
        ? Math.abs(globalCreatorProgress - previous) / elapsedMs
        : 0,
    reducedMotion,
  };
}
