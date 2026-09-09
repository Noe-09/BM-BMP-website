import { approvedCopy, structuredData } from "./types.ts";

const SOURCE = "canonical-docx:brand-core";

export const BRAND = {
  name: structuredData("BMP", SOURCE),
  architecture: structuredData(
    [
      { name: "BMP", role: "master brand / credibility layer" },
      { name: "BM Visual", role: "creative & visual services" },
      { name: "BM Tech", role: "digital systems & technical solutions" },
      { name: "BMP Creator", role: "products/apps built by BMP" },
    ] as const,
    SOURCE,
  ),
  positioning: approvedCopy(
    "BMP is a creative-tech studio turning business problems and ideas into brands, digital systems, and products.",
    SOURCE,
  ),
  shortPositioning: approvedCopy(
    "Creative × Technology × Products.",
    SOURCE,
  ),
  promise: approvedCopy(
    "Make businesses look credible, work smarter, and turn ideas into real digital experiences.",
    SOURCE,
  ),
  valueFramework: approvedCopy(
    ["Look better.", "Work better.", "Build something real."] as const,
    SOURCE,
  ),
  audience: approvedCopy(
    "Local brands & SMBs; founders and lean teams; businesses that need stronger digital presence or useful systems without building a full internal department.",
    SOURCE,
  ),
  marketStance: approvedCopy(
    "Vietnam + international. Start with accessible SMB projects, use real work and owned products as proof, then expand credibility and deal size.",
    SOURCE,
  ),
  personality: approvedCopy(
    ["Sharp.", "Modern.", "Curious.", "Capable.", "Experimental."] as const,
    SOURCE,
  ),
  visualDirection: approvedCopy(
    "Minimal + editorial + technological + experimental. Avoid generic cyberpunk/neon-agency clichés.",
    SOURCE,
  ),
  voice: approvedCopy(
    "Clear, intelligent, concise, confident without exaggeration. Problem-led, proof-led, builder mindset.",
    SOURCE,
  ),
  mission: approvedCopy(
    "To help ambitious small businesses and founders turn unclear ideas, weak digital presence, and repetitive problems into clear brands, useful systems, and real digital products.",
    SOURCE,
  ),
  vision: approvedCopy(
    "To build a lean creative-tech studio where services and owned products strengthen each other — client work creates insight, product building creates proof, and both compound into a stronger brand.",
    SOURCE,
  ),
  values: approvedCopy(
    [
      {
        title: "Build before boasting",
        body: "We prefer showing working outputs, prototypes, systems, and products over making oversized claims.",
      },
      {
        title: "Solve the real problem",
        body: "Technology and design are tools. The problem comes first.",
      },
      {
        title: "Clarity over complexity",
        body: "The best solution is understandable, useful, and maintainable.",
      },
      {
        title: "Taste with purpose",
        body: "Visual quality should improve attention, recognition, trust, and action — not exist only for decoration.",
      },
      {
        title: "Learn by shipping",
        body: "We improve through real projects, real products, feedback, and iteration.",
      },
    ] as const,
    SOURCE,
  ),
  differentiators: approvedCopy(
    [
      "One studio across visual, technology, and product thinking — without pretending every project needs all three.",
      "Problem-led services: we sell outcomes and useful systems, not “hours of design” or “lines of code”.",
      "Owned-product proof: BMP also builds its own apps and experiments, so product thinking is visible in public work.",
      "Lean execution: suitable for founders and SMBs that need a capable external build partner rather than a large agency structure.",
      "Content and distribution are treated as part of the product’s credibility, not an afterthought.",
    ] as const,
    SOURCE,
  ),
} as const;
