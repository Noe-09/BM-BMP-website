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

export function clampCreatorProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
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
