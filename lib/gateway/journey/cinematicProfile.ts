import { clamp01 } from "../../motion/physics.ts";

const speedStops = [[0, .70], [.15, .74], [.35, .78], [.55, .86], [.72, 1], [.80, 1], [.90, .64], [1, .58]] as const;

const smoothRange = (start: number, end: number, progress: number) => {
  const t = clamp01((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
};

const compactEnvelope = (start: number, peak: number, end: number, progress: number) =>
  smoothRange(start, peak, progress) * (1 - smoothRange(peak, end, progress));

export function cinematicSpeedMultiplier(progress: number): number {
  const p = clamp01(progress);
  for (let i = 1; i < speedStops.length; i++) {
    const [end, to] = speedStops[i];
    if (p <= end) {
      const [start, from] = speedStops[i - 1];
      const t = smoothRange(start, end, p);
      return from + (to - from) * t;
    }
  }
  return speedStops[speedStops.length - 1][1];
}

/** Environment-only cinema controls. Every value is reconstructed from progress. */
export function deriveCinematicFrame(progress: number) {
  const p = clamp01(progress);
  const reveal = compactEnvelope(.26, .36, .44, p);
  const coreEvent = compactEnvelope(.60, .75, .82, p);
  const release = smoothRange(.80, .98, p);
  const destination = compactEnvelope(.26, .56, .90, p);
  const passageDepth = compactEnvelope(.28, .68, .94, p);
  const authoredSpeed = cinematicSpeedMultiplier(p);
  const opticalEnergy = clamp01((authoredSpeed - .58) / .42) * (.76 + .24 * coreEvent);
  return {
    progress: p,
    reveal,
    coreEvent,
    release,
    destination,
    opticalEnergy,
    exposure: clamp01(.90 - passageDepth * .14 + release * .10),
    haze: clamp01(passageDepth * .65 * (1 - release * .35)),
    glow: clamp01(opticalEnergy * (.35 + coreEvent * .30)),
  };
}

export type CinematicFrame = ReturnType<typeof deriveCinematicFrame>;
