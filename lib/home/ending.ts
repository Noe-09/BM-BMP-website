import { clamp01 } from "../motion/physics.ts";

export type Capability = {
  id: string;
  number: string;
  title: string;
  detail: string;
  proof: { src: string; alt: string; project: string };
};

export const CAPABILITIES: Capability[] = [
  {
    id: "digital-experiences",
    number: "01",
    title: "Digital Experiences",
    detail: "Distinctive digital worlds shaped around how a brand should feel—not a template it should fill.",
    proof: {
      src: "/projects/aether/hero.webp",
      alt: "ÆTHER digital exhibition opening with optical specimen and oversized type",
      project: "ÆTHER",
    },
  },
  {
    id: "ecommerce",
    number: "02",
    title: "E-commerce",
    detail: "Commerce that keeps campaign energy intact from first impression to product decision.",
    proof: {
      src: "/projects/fabriclism/uniform-index.webp",
      alt: "Fabriclism Uniform Index combining curated looks with editorial product discovery",
      project: "FABRICLISM",
    },
  },
  {
    id: "art-direction",
    number: "03",
    title: "Art Direction",
    detail: "Image, typography and interface composed as one recognizable visual language.",
    proof: {
      src: "/projects/aurelia/hero.png",
      alt: "Aurelia Skin art direction pairing translucent portraiture with serum packaging",
      project: "AURELIA SKIN",
    },
  },
  {
    id: "ui-ux",
    number: "04",
    title: "UI / UX",
    detail: "Clear systems with deliberate hierarchy, pacing and useful interaction at every scale.",
    proof: {
      src: "/projects/fabriclism/product.webp",
      alt: "Fabriclism 058 Corefit Tee product interface with an editorial gallery and commerce controls",
      project: "FABRICLISM",
    },
  },
  {
    id: "creative-development",
    number: "05",
    title: "Creative Development",
    detail: "Frontend craft that protects the concept while keeping the experience fast and resilient.",
    proof: {
      src: "/projects/aether/deconstructed.webp",
      alt: "ÆTHER deconstructed specimen interface built as an experimental web experience",
      project: "ÆTHER",
    },
  },
  {
    id: "interaction-motion",
    number: "06",
    title: "Interaction & Motion",
    detail: "Movement used for focus, spatial continuity and character—never decoration alone.",
    proof: {
      src: "/projects/aether/specimen.webp",
      alt: "ÆTHER specimen interface demonstrating an interaction-led campaign system",
      project: "ÆTHER",
    },
  },
];

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
