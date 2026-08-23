function clampUnit(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getScrubIndex(progress: number, itemCount: number) {
  if (itemCount <= 1) return 0;
  return Math.min(itemCount - 1, Math.floor(clampUnit(progress) * itemCount));
}

export function getDragScrubProgress(
  startProgress: number,
  pointerDeltaX: number,
  sceneWidth: number,
) {
  const width = Math.max(1, sceneWidth);
  return clampUnit(startProgress - pointerDeltaX / width);
}

export function getViewportSceneProgress({
  top,
  height,
  viewportHeight,
}: {
  top: number;
  height: number;
  viewportHeight: number;
}) {
  return clampUnit((viewportHeight - top) / Math.max(1, height + viewportHeight));
}

export type ProjectNavigationIntent = {
  button: number;
  detail: number;
  defaultPrevented: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  target?: string;
  download: boolean;
  reducedMotion: boolean;
};

export function shouldEnhanceProjectNavigation(intent: ProjectNavigationIntent) {
  const opensAnotherContext = Boolean(intent.target && intent.target !== "_self");
  const hasModifier = intent.metaKey || intent.ctrlKey || intent.shiftKey || intent.altKey;

  return (
    !intent.defaultPrevented &&
    intent.button === 0 &&
    intent.detail > 0 &&
    !hasModifier &&
    !opensAnotherContext &&
    !intent.download &&
    !intent.reducedMotion
  );
}
