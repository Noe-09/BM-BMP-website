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
