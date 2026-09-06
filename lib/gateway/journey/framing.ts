/** Fit the preserved hero pair without moving it behind the chamber boundaries. */
export function deriveHeroFraming(cameraZ: number, aspect: number) {
  const scale = Math.min(1, Math.max(.1, aspect) / 1.4);
  return { scale, z: cameraZ - 12 + 26 * scale };
}
