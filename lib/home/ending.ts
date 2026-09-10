import { clamp01 } from "../motion/physics.ts";

export type Capability = {
  id: string;
  number: string;
  title: string;
  detail: string;
  proof: { src: string; alt: string; project: string };
};

type CapabilityPresentation = Omit<Capability, "title">;

const CAPABILITY_PRESENTATIONS: CapabilityPresentation[] = [
  {
    id: "brand-identity",
    number: "01",
    detail:
      "A clearer visual direction connects identity, typography, imagery and everyday brand use.",
    proof: {
      src: "/projects/aurelia/hero.png",
      alt: "Aurelia Skin visual direction pairing portraiture with product imagery",
      project: "AURELIA SKIN",
    },
  },
  {
    id: "website-presentation",
    number: "02",
    detail:
      "Landing-page direction aligns hierarchy, imagery and interaction around the message.",
    proof: {
      src: "/projects/fabriclism/uniform-index.webp",
      alt: "Fabriclism Uniform Index combining curated looks with editorial product discovery",
      project: "FABRICLISM",
    },
  },
  {
    id: "social-visual-systems",
    number: "03",
    detail:
      "Repeatable visual rules help social content feel connected without making every asset identical.",
    proof: {
      src: "/projects/fabriclism/campaign.webp",
      alt: "Fabriclism campaign composition with oversized typography and editorial fashion imagery",
      project: "FABRICLISM",
    },
  },
  {
    id: "marketing-creatives",
    number: "04",
    detail:
      "Campaign systems give launches and promotions a recognizable visual thread.",
    proof: {
      src: "/projects/haven/ritual.webp",
      alt: "HAVEN ritual composition with editorial typography and coffee-process imagery",
      project: "HAVEN",
    },
  },
  {
    id: "ai-assisted-production",
    number: "05",
    detail:
      "AI-assisted exploration can widen concept development while direction and judgment remain intentional.",
    proof: {
      src: "/projects/aether/deconstructed.webp",
      alt: "ÆTHER deconstructed specimen interface with layered visual studies",
      project: "ÆTHER",
    },
  },
  {
    id: "lightweight-motion",
    number: "06",
    detail:
      "Lightweight motion gives logos, openings and transitions a more distinctive rhythm.",
    proof: {
      src: "/projects/aether/specimen.webp",
      alt: "ÆTHER specimen interface demonstrating an interaction-led campaign system",
      project: "ÆTHER",
    },
  },
];

export function getVisualCapabilities(
  groups: readonly string[],
): Capability[] {
  if (groups.length !== CAPABILITY_PRESENTATIONS.length) {
    throw new Error(
      `Expected ${CAPABILITY_PRESENTATIONS.length} canonical BM Visual service groups, received ${groups.length}.`,
    );
  }

  return groups.map((title, index) => ({
    ...CAPABILITY_PRESENTATIONS[index],
    title,
  }));
}

export const PROCESS_STEPS = [
  { number: "01", title: "Understand", detail: "Find the sharpest version of the problem." },
  { number: "02", title: "Direction", detail: "Set the visual and experiential point of view." },
  { number: "03", title: "Design", detail: "Build a system where every element belongs." },
  { number: "04", title: "Build", detail: "Translate the idea without sanding off its character." },
  { number: "05", title: "Refine", detail: "Test, tune and remove everything that does not earn its place." },
] as const;

export function getProcessStepIndex(progress: number, itemCount: number) {
  if (itemCount <= 0) return 0;
  return Math.min(itemCount - 1, Math.floor(clamp01(progress) * itemCount));
}
