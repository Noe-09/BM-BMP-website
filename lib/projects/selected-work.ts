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
    disciplines: ["Fashion", "E-commerce", "Creative Development"],
    description:
      "A streetwear store treated as a directional digital lookbook—campaign, collection and commerce held inside one graphic system.",
    interactionVariant: "lookbook",
    theme: "fabric",
    liveUrl: "https://demo-fabriclism.vercel.app/",
    actionLabel: "Visit live",
    cursorLabel: "Explore →",
    previewAssets: [
      {
        src: "/projects/fabriclism/campaign.webp",
        alt: "Fabriclism campaign homepage with streetwear rail and campaign typography",
        label: "Campaign",
      },
      {
        src: "/projects/fabriclism/home.webp",
        alt: "Fabriclism new arrivals product presentation",
        label: "Home",
      },
      {
        src: "/projects/fabriclism/collection.webp",
        alt: "Fabriclism collection grid and category navigation",
        label: "Collection",
      },
      {
        src: "/projects/fabriclism/product.webp",
        alt: "Fabriclism product page for a signature black tee",
        label: "Product",
      },
      {
        src: "/projects/fabriclism/mobile.webp",
        alt: "Portrait campaign crop used for the Fabriclism mobile lookbook state",
        label: "Mobile",
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
    disciplines: ["Hospitality", "Editorial", "Digital Experience"],
    description:
      "A café and bistro experience composed around atmosphere, tactile surfaces and the cadence of an independent magazine.",
    interactionVariant: "editorial",
    theme: "haven",
    previewAssets: [
      {
        src: "/projects/coffee/hero.png",
        alt: "HAVEN café homepage with a dark, atmospheric interior",
      },
      {
        src: "/projects/coffee/desktop-01.webp",
        alt: "HAVEN story page with coffee-making still life",
      },
      {
        src: "/projects/coffee/desktop-02.webp",
        alt: "HAVEN menu featuring coffee and brunch dishes",
      },
      {
        src: "/projects/coffee/mobile-01.webp",
        alt: "HAVEN mobile homepage",
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
