import {
  getProject,
  type ProjectAsset,
  type ProjectRecord,
  type ProjectTheme,
} from "./selected-work.ts";

export type ProjectCaseSlug = "fabriclism" | "aurelia-skin" | "aether";
export type ProjectCaseVariant = "fabriclism" | "aurelia" | "aether";
export type ProjectCaseSectionId = "idea" | "experience" | "motion" | "responsive" | "live";

export type ProjectCaseItem = {
  index: string;
  title: string;
  copy: string;
  asset?: ProjectAsset;
};

export type ProjectCaseSection = {
  id: ProjectCaseSectionId;
  eyebrow: string;
  heading: string[];
  body?: string;
  assets?: ProjectAsset[];
  items?: ProjectCaseItem[];
};

export type ProjectCaseNarrative = {
  projectSlug: ProjectCaseSlug;
  caseVariant: ProjectCaseVariant;
  theme: ProjectTheme;
  positioning: string;
  thesis: string[];
  seoDescription: string;
  heroAsset: ProjectAsset;
  sections: ProjectCaseSection[];
  nextSlug: ProjectCaseSlug;
};

export type ProjectCase = ProjectCaseNarrative & {
  project: ProjectRecord;
};

const projectCases: Record<ProjectCaseSlug, ProjectCaseNarrative> = {
  fabriclism: {
    projectSlug: "fabriclism",
    caseVariant: "fabriclism",
    theme: "fabric",
    positioning:
      "A streetwear commerce experience built around collection, attitude and movement.",
    thesis: [
      "Most fashion stores sell products.",
      "We wanted the store to sell the world around the products.",
    ],
    seoDescription:
      "A BM Visuals concept case study for Fabriclism, a streetwear commerce experience built around campaign, collection and movement.",
    heroAsset: {
      src: "/projects/fabriclism/campaign.webp",
      alt: "Fabriclism campaign opening with a streetwear rail and graphic campaign identity",
    },
    sections: [
      {
        id: "idea",
        eyebrow: "02 / The idea",
        heading: ["Sell the world", "around the product."],
        body:
          "Campaign attitude leads. Commerce follows inside the same visual system, so browsing never feels separate from the brand.",
        assets: [
          {
            src: "/projects/fabriclism/campaign.webp",
            alt: "Fabriclism campaign image establishing the brand world",
          },
          {
            src: "/projects/fabriclism/home.webp",
            alt: "Fabriclism homepage carrying campaign language into product browsing",
          },
        ],
      },
      {
        id: "experience",
        eyebrow: "03 / Experience breakdown",
        heading: ["A store paced", "like a lookbook."],
        items: [
          {
            index: "01",
            title: "Campaign first",
            copy: "The opening establishes atmosphere before catalogue density.",
            asset: {
              src: "/projects/fabriclism/home.webp",
              alt: "Fabriclism homepage and campaign-led product presentation",
            },
          },
          {
            index: "02",
            title: "Collection",
            copy: "Graphic navigation keeps a dense catalogue directional and legible.",
            asset: {
              src: "/projects/fabriclism/collection.webp",
              alt: "Fabriclism collection grid and category navigation",
            },
          },
          {
            index: "03",
            title: "Product",
            copy: "Product detail preserves the campaign tone while clarifying choice.",
            asset: {
              src: "/projects/fabriclism/product.webp",
              alt: "Fabriclism signature tee product page",
            },
          },
          {
            index: "04",
            title: "Mobile",
            copy: "The same hierarchy is recomposed for a narrower, faster shopping rhythm.",
            asset: {
              src: "/projects/fabriclism/mobile-home.webp",
              alt: "Fabriclism live homepage captured at a mobile viewport",
            },
          },
        ],
      },
      {
        id: "motion",
        eyebrow: "04 / Motion system",
        heading: ["Motion is part", "of the brand."],
        body:
          "Navigation, image changes and product states respond with the same direct graphic cadence as the identity.",
        assets: [
          {
            src: "/projects/fabriclism/collection.webp",
            alt: "Fabriclism collection state used to explain the browsing motion system",
          },
          {
            src: "/projects/fabriclism/product.webp",
            alt: "Fabriclism product state used to explain interactive product behavior",
          },
        ],
      },
      {
        id: "responsive",
        eyebrow: "05 / Responsive",
        heading: ["Designed to move", "with you."],
        assets: [
          {
            src: "/projects/fabriclism/mobile-home.webp",
            alt: "Fabriclism mobile home captured from the live experience",
          },
          {
            src: "/projects/fabriclism/mobile-collection.webp",
            alt: "Fabriclism mobile collection captured from the live experience",
          },
          {
            src: "/projects/fabriclism/mobile-product.webp",
            alt: "Fabriclism mobile product page captured from the live experience",
          },
        ],
      },
      {
        id: "live",
        eyebrow: "06 / Live experience",
        heading: ["Don't just look at it.", "Use it."],
      },
    ],
    nextSlug: "aurelia-skin",
  },
  "aurelia-skin": {
    projectSlug: "aurelia-skin",
    caseVariant: "aurelia",
    theme: "aurelia",
    positioning:
      "A skincare experience balancing clinical clarity with the softness of a daily ritual.",
    thesis: ["Clinical clarity.", "Ritual softness."],
    seoDescription:
      "A BM Visuals concept case study for Aurelia Skin, a warm skincare commerce experience shaped by light, serum and ritual.",
    heroAsset: {
      src: "/projects/aurelia/hero.png",
      alt: "Aurelia Skin opening with a translucent portrait and serum product",
    },
    sections: [
      {
        id: "idea",
        eyebrow: "02 / The idea",
        heading: ["Clarity without", "clinical distance."],
        body:
          "Information stays precise, while material, light and breathing room make the routine feel personal.",
        assets: [
          {
            src: "/projects/aurelia/desktop-01.webp",
            alt: "Aurelia ingredient system and ritual interface",
          },
        ],
      },
      {
        id: "experience",
        eyebrow: "03 / Commerce",
        heading: ["A quiet path", "to the product."],
        body:
          "Editorial hierarchy gives product discovery room without losing the structure a commerce experience needs.",
        assets: [
          {
            src: "/projects/aurelia/desktop-02.webp",
            alt: "Aurelia product collection with warm product photography",
          },
          {
            src: "/projects/aurelia/detail-02.webp",
            alt: "Aurelia editorial product and journal presentation",
          },
        ],
      },
      {
        id: "motion",
        eyebrow: "04 / Visual language",
        heading: ["Light behaves", "like serum."],
        body:
          "Soft reveals and layered translucency connect clinical information to the sensory language of skincare.",
        assets: [
          {
            src: "/projects/aurelia/hero.png",
            alt: "Aurelia translucent campaign composition",
          },
        ],
      },
      {
        id: "responsive",
        eyebrow: "05 / Responsive",
        heading: ["The ritual", "travels lightly."],
        assets: [
          {
            src: "/projects/aurelia/mobile-01.webp",
            alt: "Aurelia mobile homepage with campaign headline and shopping actions",
          },
        ],
      },
      {
        id: "live",
        eyebrow: "06 / Live experience",
        heading: ["Enter the", "Aurelia ritual."],
      },
    ],
    nextSlug: "aether",
  },
  aether: {
    projectSlug: "aether",
    caseVariant: "aether",
    theme: "aether",
    positioning:
      "An experimental digital exhibition where optical objects are catalogued as living specimens.",
    thesis: ["The object precedes", "the wearer."],
    seoDescription:
      "A BM Visuals experimental concept case study for ÆTHER, a technical digital exhibition and eyewear laboratory.",
    heroAsset: {
      src: "/projects/aether/hero.webp",
      alt: "ÆTHER laboratory opening with oversized identity and an optical specimen",
    },
    sections: [
      {
        id: "idea",
        eyebrow: "02 / Principle 01",
        heading: ["The object", "comes first."],
        body:
          "ÆTHER treats eyewear as an autonomous optical object before it becomes something worn.",
        assets: [
          {
            src: "/projects/aether/hero.webp",
            alt: "ÆTHER experiment identity and optical object",
          },
        ],
      },
      {
        id: "experience",
        eyebrow: "03 / Specimen system",
        heading: ["Every object", "has a record."],
        body:
          "Nomenclature, material data and controlled image fields turn browsing into observation.",
        assets: [
          {
            src: "/projects/aether/specimen.webp",
            alt: "ÆTHER specimen 003 technical record",
          },
        ],
      },
      {
        id: "motion",
        eyebrow: "04 / Deconstruction",
        heading: ["Precision becomes", "the interface."],
        body:
          "Scanner language and separated planes expose the system without recreating the full laboratory inside BM.",
        assets: [
          {
            src: "/projects/aether/deconstructed.webp",
            alt: "ÆTHER specimen deconstruction and component analysis",
          },
        ],
      },
      {
        id: "responsive",
        eyebrow: "05 / Responsive exhibition",
        heading: ["The laboratory", "changes scale."],
        assets: [
          {
            src: "/projects/aether/mobile.webp",
            alt: "ÆTHER live laboratory captured at a mobile viewport",
          },
        ],
      },
      {
        id: "live",
        eyebrow: "06 / Live laboratory",
        heading: ["Continue the", "observation."],
      },
    ],
    nextSlug: "fabriclism",
  },
};

export function getProjectCaseSlugs(): ProjectCaseSlug[] {
  return ["fabriclism", "aurelia-skin", "aether"];
}

export function getProjectCase(slug: string): ProjectCase | undefined {
  if (!getProjectCaseSlugs().includes(slug as ProjectCaseSlug)) return undefined;
  const narrative = projectCases[slug as ProjectCaseSlug];
  const project = getProject(narrative.projectSlug);
  return project ? { ...narrative, project } : undefined;
}

export function getNextProjectCase(slug: string): ProjectCase | undefined {
  const current = getProjectCase(slug);
  return current ? getProjectCase(current.nextSlug) : undefined;
}
