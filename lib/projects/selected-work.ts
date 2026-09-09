import type { ProjectStatus, WorkCategory } from "../../content/work.ts";

export type ProjectInteraction = "lookbook" | "liquid" | "editorial" | "spatial";

export type ProjectTheme = "fabric" | "aurelia" | "haven" | "aether";

export type ProjectAsset = {
  src: string;
  alt: string;
  label?: string;
};

export type ProjectRecord = {
  slug: string;
  title: string;
  index: string;
  year: string;
  status: ProjectStatus;
  categories: WorkCategory[];
  disciplines: string[];
  description: string;
  challenge: string;
  created: string;
  outcome: string;
  caseStudy: {
    challenge: string;
    direction: string;
    built: string;
    significance: string;
    next: string;
  };
  interactionVariant: ProjectInteraction;
  theme: ProjectTheme;
  previewAssets: ProjectAsset[];
  liveUrl?: string;
  actionLabel?: string;
  cursorLabel?: string;
  publication: {
    status: "verified";
    verifiedAt: "2026-09-09";
    source: string;
  };
};

export type SelectedProject = ProjectRecord;

export const projectRegistry: ProjectRecord[] = [
  {
    slug: "fabriclism",
    title: "FABRICLISM",
    index: "01 / 04",
    year: "2026",
    status: "Concept",
    categories: ["Brand & Visual", "Web & Digital Experience"],
    disciplines: ["Fashion", "E-commerce", "Art Direction", "Creative Development"],
    description:
      "A fashion-commerce concept built around Personal Uniform—state-driven campaign, curated looks, material studies and functional shopping inside one editorial world.",
    challenge:
      "Most fashion stores begin with products. Fabriclism begins with how you want to be seen.",
    created:
      "A fashion-commerce concept built around Personal Uniform—state-driven campaign, curated looks, material studies and functional shopping inside one editorial world.",
    outcome:
      "Shop and product pages stay clear, functional and easy to use when the experience shifts from discovery to decision.",
    caseStudy: {
      challenge:
        "Most fashion stores begin with products. Fabriclism begins with how you want to be seen.",
      direction:
        "A fashion-commerce experience built around Personal Uniform—where state, campaign, lookbook and shopping move as one editorial world.",
      built:
        "A fashion-commerce concept built around Personal Uniform—state-driven campaign, curated looks, material studies and functional shopping inside one editorial world.",
      significance:
        "Shop and product pages stay clear, functional and easy to use when the experience shifts from discovery to decision.",
      next:
        "Desktop choreography is recomposed into direct tap, scroll and accordion behaviour without turning mobile into a reduced copy of the desktop site.",
    },
    interactionVariant: "lookbook",
    theme: "fabric",
    liveUrl: "https://demo-fabriclism.vercel.app/",
    actionLabel: "Visit live",
    cursorLabel: "Explore →",
    previewAssets: [
      {
        src: "/projects/fabriclism/campaign.webp",
        alt: "Fabriclism F/W 026 Personal Uniform campaign with oversized typography and editorial fashion imagery",
        label: "Campaign",
      },
      {
        src: "/projects/fabriclism/state.webp",
        alt: "Fabriclism Choose Your State composition with QUIET, PRESENT and UNRESOLVED styling states",
        label: "State",
      },
      {
        src: "/projects/fabriclism/uniform-index.webp",
        alt: "Fabriclism Uniform Index with eight curated looks and an editorial preview",
        label: "Uniform Index",
      },
      {
        src: "/projects/fabriclism/builder.webp",
        alt: "Fabriclism dark Build A Uniform scene with a curated outfit preset and garment breakdown",
        label: "Build a Uniform",
      },
      {
        src: "/projects/fabriclism/product.webp",
        alt: "Fabriclism 058 Corefit Tee product page with editorial gallery and commerce controls",
        label: "Commerce",
      },
    ],
    publication: {
      status: "verified",
      verifiedAt: "2026-09-09",
      source: "repository proof assets and live URL verified 2026-09-09",
    },
  },
  {
    slug: "aurelia-skin",
    title: "AURELIA SKIN",
    index: "02 / 04",
    year: "2026",
    status: "Concept",
    categories: ["Brand & Visual", "Web & Digital Experience"],
    disciplines: ["Beauty", "E-commerce", "Art Direction"],
    description:
      "A warm skincare world balancing clinical clarity with the softness of serum, light and ritual.",
    challenge: "Clinical clarity. Ritual softness.",
    created:
      "A warm skincare world balancing clinical clarity with the softness of serum, light and ritual.",
    outcome:
      "Editorial hierarchy gives product discovery room without losing the structure a commerce experience needs.",
    caseStudy: {
      challenge: "Clinical clarity. Ritual softness.",
      direction:
        "A skincare experience balancing clinical clarity with the softness of a daily ritual.",
      built:
        "A warm skincare world balancing clinical clarity with the softness of serum, light and ritual.",
      significance:
        "Editorial hierarchy gives product discovery room without losing the structure a commerce experience needs.",
      next: "The ritual travels lightly.",
    },
    interactionVariant: "liquid",
    theme: "aurelia",
    liveUrl: "https://aurelia-skin.vercel.app/",
    actionLabel: "Visit live",
    cursorLabel: "Explore →",
    previewAssets: [
      {
        src: "/projects/aurelia/hero.png",
        alt: "Aurelia Skin homepage with translucent portrait and serum product",
      },
      {
        src: "/projects/aurelia/desktop-02.webp",
        alt: "Aurelia Skin product collection with warm product photography",
      },
    ],
    publication: {
      status: "verified",
      verifiedAt: "2026-09-09",
      source: "repository proof assets and live URL verified 2026-09-09",
    },
  },
  {
    slug: "haven",
    title: "HAVEN",
    index: "03 / 04",
    year: "2026",
    status: "Concept",
    categories: ["Brand & Visual", "Web & Digital Experience"],
    disciplines: ["Hospitality", "Editorial", "Commerce", "Digital Experience"],
    description:
      "An editorial hospitality and commerce concept shaped around coffee ritual, atmosphere, space and slow digital interaction.",
    challenge: "A place is more than a menu. It is a rhythm.",
    created:
      "An editorial hospitality and commerce concept shaped around coffee ritual, atmosphere, space and slow digital interaction.",
    outcome:
      "Menu discovery, the Haven No.01 signature and retail objects remain inside one warm hospitality world—functional, but never rushed.",
    caseStudy: {
      challenge: "A place is more than a menu. It is a rhythm.",
      direction:
        "An editorial hospitality and commerce concept shaped around coffee ritual, atmosphere and slow digital interaction.",
      built:
        "An editorial hospitality and commerce concept shaped around coffee ritual, atmosphere, space and slow digital interaction.",
      significance:
        "Menu discovery, the Haven No.01 signature and retail objects remain inside one warm hospitality world—functional, but never rushed.",
      next:
        "The mobile composition keeps the same quiet hierarchy and ritual-led entry without requiring hover or a desktop viewport.",
    },
    interactionVariant: "editorial",
    theme: "haven",
    liveUrl: "https://haven-rebuild.vercel.app/",
    actionLabel: "Visit live",
    cursorLabel: "Enter Haven ↗",
    previewAssets: [
      {
        src: "/projects/haven/hero.webp",
        alt: "HAVEN live opening with A Pause in the City over warm coffee ritual imagery",
        label: "Opening",
      },
      {
        src: "/projects/haven/ritual.webp",
        alt: "HAVEN Morning Ritual GRIND state with coffee-process metadata",
        label: "Ritual",
      },
      {
        src: "/projects/haven/menu.webp",
        alt: "HAVEN editorial coffee menu with interactive item hierarchy",
        label: "Menu",
      },
      {
        src: "/projects/haven/mobile.webp",
        alt: "HAVEN mobile opening with A Pause in the City composition",
        label: "Mobile",
      },
    ],
    publication: {
      status: "verified",
      verifiedAt: "2026-09-09",
      source: "repository proof assets and live URL verified 2026-09-09",
    },
  },
  {
    slug: "aether",
    title: "ÆTHER",
    index: "04 / 04",
    year: "2026",
    status: "Experiment",
    categories: ["Brand & Visual", "Web & Digital Experience", "Experiments"],
    disciplines: ["Digital Exhibition", "Fashion Campaign", "Experimental Commerce"],
    description:
      "An experimental eyewear laboratory where specimen systems, optical objects and campaign language become one spatial interface.",
    challenge: "The object precedes the wearer.",
    created:
      "An experimental eyewear laboratory where specimen systems, optical objects and campaign language become one spatial interface.",
    outcome:
      "Nomenclature, material data and controlled image fields turn browsing into observation.",
    caseStudy: {
      challenge: "The object precedes the wearer.",
      direction:
        "An experimental digital exhibition where optical objects are catalogued as living specimens.",
      built:
        "An experimental eyewear laboratory where specimen systems, optical objects and campaign language become one spatial interface.",
      significance:
        "Nomenclature, material data and controlled image fields turn browsing into observation.",
      next: "The laboratory changes scale.",
    },
    interactionVariant: "spatial",
    theme: "aether",
    liveUrl: "https://aether-app-cyan.vercel.app/",
    actionLabel: "Enter lab",
    cursorLabel: "Enter lab ↗",
    previewAssets: [
      {
        src: "/projects/aether/hero.webp",
        alt: "ÆTHER laboratory opening with oversized typography and an optical specimen",
      },
      {
        src: "/projects/aether/specimen.webp",
        alt: "ÆTHER specimen 003 technical interface",
      },
      {
        src: "/projects/aether/deconstructed.webp",
        alt: "ÆTHER deconstructed specimen analysis interface",
      },
    ],
    publication: {
      status: "verified",
      verifiedAt: "2026-09-09",
      source: "repository proof assets and live URL verified 2026-09-09",
    },
  },
];

export function getProject(slug: string) {
  return projectRegistry.find((project) => project.slug === slug);
}

export const selectedProjects = projectRegistry;
