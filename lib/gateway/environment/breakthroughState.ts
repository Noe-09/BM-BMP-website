import { smoothRange } from "../journey/chapterState.ts";
import { clamp01 } from "../../motion/physics.ts";
import { deriveCinematicFrame } from "../journey/cinematicProfile.ts";

/** Environment score only. No input state, clock, or accumulated motion. */
export function deriveBreakthroughFrame(progress: number) {
  const p = clamp01(progress);
  const rupture = smoothRange(.14, .34, p);
  const compression = smoothRange(.38, .60, p);
  const exchange = smoothRange(.54, .74, p);
  const release = smoothRange(.80, .96, p);
  const blackout = smoothRange(.38, .60, p) * (1 - smoothRange(.80, .94, p));
  return {
    progress: p, rupture, compression, exchange, release, blackout,
    architecture: smoothRange(.08, .38, p),
    opticalEnergy: deriveCinematicFrame(p).opticalEnergy,
    spectral: clamp01(.12 + rupture * .48 + blackout * .4 - release * .78),
  };
}
