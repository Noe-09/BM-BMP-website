export type ProjectInteraction = "lookbook" | "liquid" | "editorial" | "spatial";

export type ProjectTheme = "fabric" | "aurelia" | "haven" | "aether";

export type ProjectStatus = "Concept Project" | "Experimental Concept";

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
  disciplines: string[];
  description: string;
  interactionVariant: ProjectInteraction;
  theme: ProjectTheme;
  previewAssets: ProjectAsset[];
  liveUrl?: string;
  actionLabel?: string;
  cursorLabel?: string;
};

export type SelectedProject = ProjectRecord;

export const projectRegistry: ProjectRecord[] = [
  {
    slug: "fabriclism",
    title: "FABRICLISM",
    index: "01 / 04",
    year: "2026",
    status: "Concept Project",
    disciplines: ["Fashion", "E-commerce", "Art Direction", "Creative Development"],
    description:
      "A fashion-commerce concept built around Personal Uniform—state-driven campaign, curated looks, material studies and functional shopping inside one editorial world.",
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
  },
  {
    slug: "aurelia-skin",
    title: "AURELIA SKIN",
    index: "02 / 04",
    year: "2026",
    status: "Concept Project",
    disciplines: ["Beauty", "E-commerce", "Art Direction"],
    description:
      "A warm skincare world balancing clinical clarity with the softness of serum, light and ritual.",
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
  },
  {
    slug: "haven",
    title: "HAVEN",
    index: "03 / 04",
    year: "2026",
    status: "Concept Project",
    disciplines: ["Hospitality", "Editorial", "Commerce", "Digital Experience"],
    description:
      "An editorial hospitality and commerce concept shaped around coffee ritual, atmosphere, space and slow digital interaction.",
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
  },
  {
    slug: "aether",
    title: "ÆTHER",
    index: "04 / 04",
    year: "2026",
    status: "Experimental Concept",
    disciplines: ["Digital Exhibition", "Fashion Campaign", "Experimental Commerce"],
    description:
      "An experimental eyewear laboratory where specimen systems, optical objects and campaign language become one spatial interface.",
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
  },
];

export function getProject(slug: string) {
  return projectRegistry.find((project) => project.slug === slug);
}

export const selectedProjects = projectRegistry;
