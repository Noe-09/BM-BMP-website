import {
  getProject,
  type ProjectAsset,
  type ProjectRecord,
  type ProjectTheme,
} from "./selected-work.ts";

export type ProjectCaseSlug = "fabriclism" | "aurelia-skin" | "haven" | "aether";
export type ProjectCaseVariant = "fabriclism" | "aurelia" | "haven" | "aether";
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
      "A fashion-commerce experience built around Personal Uniform—where state, campaign, lookbook and shopping move as one editorial world.",
    thesis: [
      "Most fashion stores begin with products.",
      "Fabriclism begins with how you want to be seen.",
    ],
    seoDescription:
      "A BM Visuals concept case study for Fabriclism, a Personal Uniform fashion-commerce experience combining state-driven storytelling, editorial interaction and functional shopping.",
    heroAsset: {
      src: "/projects/fabriclism/campaign.webp",
      alt: "Fabriclism F/W 026 Personal Uniform campaign with oversized typography and editorial fashion imagery",
    },
    sections: [
      {
        id: "idea",
        eyebrow: "02 / The idea",
        heading: ["Start with a state,", "not a product."],
        body:
          "QUIET, PRESENT and UNRESOLVED turn the first interaction into a styling ritual. The choice shifts campaign imagery, featured looks and the Uniform Builder without restricting the catalogue.",
        assets: [
          {
            src: "/projects/fabriclism/state.webp",
            alt: "Fabriclism Choose Your State composition with QUIET, PRESENT and UNRESOLVED styling states",
          },
          {
            src: "/projects/fabriclism/campaign.webp",
            alt: "Fabriclism F/W 026 campaign after the Personal Uniform state selection",
          },
        ],
      },
      {
        id: "experience",
        eyebrow: "03 / Experience",
        heading: ["A fashion world", "that still shops."],
        items: [
          {
            index: "01",
            title: "Choose a state",
            copy: "The visitor chooses a temporary styling posture before entering the collection.",
            asset: {
              src: "/projects/fabriclism/state.webp",
              alt: "Fabriclism state selector showing the QUIET, PRESENT and UNRESOLVED choices",
            },
          },
          {
            index: "02",
            title: "Uniform Index",
            copy: "Eight curated looks turn product discovery into an editorial index.",
            asset: {
              src: "/projects/fabriclism/uniform-index.webp",
              alt: "Fabriclism Uniform Index showing curated looks and an editorial preview",
            },
          },
          {
            index: "03",
            title: "Build a Uniform",
            copy: "Curated outfit presets make styling interactive while the visual direction stays controlled.",
            asset: {
              src: "/projects/fabriclism/builder.webp",
              alt: "Fabriclism dark Build A Uniform scene with curated outfit preset controls",
            },
          },
          {
            index: "04",
            title: "Commerce",
            copy: "Shop and product pages stay clear, functional and easy to use when the experience shifts from discovery to decision.",
            asset: {
              src: "/projects/fabriclism/product.webp",
              alt: "Fabriclism 058 Corefit Tee product page with gallery, colour, size and add-to-bag controls",
            },
          },
        ],
      },
      {
        id: "motion",
        eyebrow: "04 / Motion language",
        heading: ["Cut. Drag.", "Layer."],
        body:
          "Full-viewport title frames, cropped typography and image-led scene handoffs give the experience a fashion-film cadence while commerce interactions stay restrained.",
        assets: [
          {
            src: "/projects/fabriclism/campaign.webp",
            alt: "Fabriclism F/W 026 campaign with cropped typography and editorial fashion imagery",
          },
          {
            src: "/projects/fabriclism/interlude.webp",
            alt: "Fabriclism NO FINAL FORM full-bleed campaign interruption",
          },
        ],
      },
      {
        id: "responsive",
        eyebrow: "05 / Responsive",
        heading: ["Same identity.", "Different rhythm."],
        body:
          "Desktop choreography is recomposed into direct tap, scroll and accordion behaviour without turning mobile into a reduced copy of the desktop site.",
        assets: [
          {
            src: "/projects/fabriclism/mobile-state.webp",
            alt: "Fabriclism mobile state selector with QUIET, PRESENT and UNRESOLVED choices",
          },
          {
            src: "/projects/fabriclism/mobile-index.webp",
            alt: "Fabriclism mobile Uniform Index with a tap-open curated look",
          },
          {
            src: "/projects/fabriclism/mobile-product.webp",
            alt: "Fabriclism mobile 058 Corefit Tee product page with real gallery thumbnails",
          },
        ],
      },
      {
        id: "live",
        eyebrow: "06 / Live experience",
        heading: ["Enter the world.", "Build your own."],
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
    nextSlug: "haven",
  },
  haven: {
    projectSlug: "haven",
    caseVariant: "haven",
    theme: "haven",
    positioning:
      "An editorial hospitality and commerce concept shaped around coffee ritual, atmosphere and slow digital interaction.",
    thesis: ["A place is more", "than a menu.", "It is a rhythm."],
    seoDescription:
      "A BM Visuals hospitality concept case study exploring coffee ritual, editorial commerce, atmosphere and slow digital interaction.",
    heroAsset: {
      src: "/projects/haven/hero.webp",
      alt: "HAVEN live opening with A Pause in the City over coffee ritual imagery",
    },
    sections: [
      {
        id: "idea",
        eyebrow: "02 / The idea",
        heading: ["A place is more", "than a menu."],
        body:
          "HAVEN treats hospitality as a feeling of pace: coffee, light, ceramic and time arranged before commerce asks for attention.",
        assets: [
          {
            src: "/projects/haven/hero.webp",
            alt: "HAVEN opening screen with the phrase A Pause in the City",
          },
          {
            src: "/projects/haven/space.webp",
            alt: "HAVEN The Space screen showing a quiet interior and A room for doing nothing",
          },
        ],
      },
      {
        id: "experience",
        eyebrow: "03 / Morning ritual",
        heading: ["The morning", "has a rhythm."],
        items: [
          {
            index: "01",
            title: "Grind",
            copy: "The opening state grounds the ritual in bean, time and measured preparation.",
            asset: {
              src: "/projects/haven/ritual.webp",
              alt: "HAVEN GRIND ritual state with Cầu Đất Arabica and 18 gram metadata",
            },
          },
          {
            index: "02",
            title: "Dose",
            copy: "Preparation becomes a calm editorial sequence rather than a utility instruction.",
          },
          {
            index: "03",
            title: "Extract",
            copy: "Time, temperature and pressure add texture without interrupting the atmosphere.",
          },
          {
            index: "04",
            title: "Serve",
            copy: "The signature drink carries the ritual forward into a considered hospitality moment.",
            asset: {
              src: "/projects/haven/no01.webp",
              alt: "HAVEN No.01 signature drink screen with espresso and cold cream",
            },
          },
        ],
      },
      {
        id: "motion",
        eyebrow: "04 / Editorial commerce",
        heading: ["From ritual", "to commerce."],
        body:
          "Menu discovery, the Haven No.01 signature and retail objects remain inside one warm hospitality world—functional, but never rushed.",
        assets: [
          {
            src: "/projects/haven/menu.webp",
            alt: "HAVEN editorial menu screen with coffee selection and responsive image field",
          },
          {
            src: "/projects/haven/commerce.webp",
            alt: "HAVEN Bring Haven Home retail screen with coffee products",
          },
        ],
      },
      {
        id: "responsive",
        eyebrow: "05 / Responsive experience",
        heading: ["Slow,", "not static."],
        body:
          "The mobile composition keeps the same quiet hierarchy and ritual-led entry without requiring hover or a desktop viewport.",
        assets: [
          {
            src: "/projects/haven/mobile.webp",
            alt: "HAVEN mobile opening with Pause in the City typography and concept actions",
          },
        ],
      },
      {
        id: "live",
        eyebrow: "06 / Live experience",
        heading: ["Stay", "a little", "longer."],
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
  return ["fabriclism", "aurelia-skin", "haven", "aether"];
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
