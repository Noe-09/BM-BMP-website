import { clamp01 } from "../../motion/physics.ts";

export const smoothRange = (a: number, b: number, p: number) => {
  const t = clamp01((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Every environment value is a pure function of the ONE displayed progress. */
export function deriveJourneyFrame(progress: number) {
  const p = clamp01(progress);
  const formation = smoothRange(.04, .34, p);
  const passage = smoothRange(.22, .48, p) * (1 - smoothRange(.72, .94, p));
  const core = smoothRange(.54, .66, p) * (1 - smoothRange(.74, .88, p));
  const opening = smoothRange(.76, .98, p);
  return {
    progress: p,
    chapter: p < .16 ? "origin" : p < .34 ? "formation" : p < .58 ? "passage" : p < .78 ? "core" : "emergence",
    formation, passage, core, opening,
    emergence: smoothRange(.78, .96, p),
    separation: smoothRange(.60, .73, p),
    inversion: smoothRange(.60, .70, p) * (1 - smoothRange(.76, .90, p)),
    darkness: passage * .14 + core * .30,
    spectral: .2 + passage * .48 + core * .2 - opening * .04,
    driftX: Math.sin(p * Math.PI * 2) * .28 * (1 - opening),
    driftY: Math.sin(p * Math.PI) * .16 * (1 - opening),
    nearFirst: smoothRange(.22, .29, p) * (1 - smoothRange(.32, .39, p)),
    nearSecond: smoothRange(.54, .60, p) * (1 - smoothRange(.67, .73, p)),
  };
}

export type JourneyFrame = ReturnType<typeof deriveJourneyFrame>;
