import { Color } from "three";
import { smoothRange } from "../journey/chapterState.ts";

const channels = ["pearl", "cool", "violet", "warm", "shadow"] as const;
export type SpectralPalette = Record<typeof channels[number], Color>;
export const createSpectralPalette = (): SpectralPalette => ({
  pearl: new Color(), cool: new Color(), violet: new Color(), warm: new Color(), shadow: new Color(),
});

// Authored sRGB swatches are converted once; interpolation happens in linear light.
// Warm hues are reserved for narrow reflected highlights, never a surface-wide wash.
const stops = [
  { p: 0, colors: [0xf0f1f5, 0xc1dedd, 0xd5cce8, 0xead6ce, 0x69757f] },
  { p: .16, colors: [0xeaf2f1, 0x77bfc5, 0xbab0d6, 0xddb6aa, 0x506d79] },
  { p: .34, colors: [0xe5f1f3, 0x459fae, 0xb5a0c9, 0xd6987f, 0x35485d] },
  { p: .46, colors: [0xe9eff8, 0x458aaf, 0xc09cba, 0xd28a70, 0x303b53] },
  { p: .68, colors: [0xf5f3f6, 0x429e9e, 0x9c87ba, 0xd8996b, 0x232d3c] },
  { p: .78, colors: [0xf1eef6, 0x6bafb6, 0xb3a1c7, 0xd7a08b, 0x394759] },
  { p: .90, colors: [0xecf2f5, 0x9fcbd0, 0xc0b6dc, 0xdfb4a8, 0x657786] },
  { p: 1, colors: [0xf0f2f6, 0xb3d5da, 0xcebfdf, 0xe3bfb4, 0x788895] },
].map(stop => ({ p: stop.p, colors: stop.colors.map(hex => new Color(hex)) }));

/** No history or clock: a backwards sample restores exactly the same light. */
export function sampleSpectralPalette(progress: number, target: SpectralPalette): SpectralPalette {
  const p = Math.max(0, Math.min(1, progress));
  const index = Math.max(1, stops.findIndex(stop => stop.p >= p));
  const before = stops[index - 1], after = stops[index];
  const blend = smoothRange(before.p, after.p, p);
  channels.forEach((channel, i) => target[channel].copy(before.colors[i]).lerp(after.colors[i], blend));
  return target;
}
