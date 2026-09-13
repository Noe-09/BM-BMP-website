import { assertValidCreatorRegistry } from "../lib/creator/reveal-state.ts";
import type { CreatorRevealState } from "../lib/creator/reveal-state.ts";
import { approvedCopy, structuredData } from "./types.ts";

const SOURCE = "canonical-docx:bmp-creator";

export type CreatorWorldSlug =
  | "weins"
  | "slyour"
  | "the-xide"
  | "pawsona"
  | "relationship"
  | "miner";

export type CreatorMedia = {
  src: string;
  alt: string;
  label: string;
  kind: "image";
  status: "verified";
  source: string;
};

export type CreatorDetailSection = {
  id: "idea" | "world" | "exists" | "behaves" | "state" | "next";
  label: string;
  body: string;
};

export type CreatorWorld = {
  index: "01" | "02" | "03" | "04" | "05" | "06";
  slug: CreatorWorldSlug;
  name: string;
  wing: "revealed" | "unrevealed";
  revealState: CreatorRevealState;
  statusLabel: "OPEN" | "PREVIEW" | "GLIMPSE" | "SEALED";
  character: string;
  thesis: string;
  motifs: readonly string[];
  developmentNote: string;
  media: readonly CreatorMedia[];
  detail: readonly CreatorDetailSection[] | null;
  route: `/creator/${CreatorWorldSlug}` | null;
  liveUrl: string | null;
};

const DETAIL_LABELS = {
  idea: "THE IDEA",
  world: "THE WORLD",
  exists: "WHAT EXISTS",
  behaves: "HOW IT BEHAVES",
  state: "CURRENT STATE",
  next: "WHAT'S NEXT",
} as const;

const detail = (
  values: readonly [string, string, string, string, string, string],
): readonly CreatorDetailSection[] =>
  (["idea", "world", "exists", "behaves", "state", "next"] as const).map(
    (id, index) => ({ id, label: DETAIL_LABELS[id], body: values[index] }),
  );

const worlds: readonly CreatorWorld[] = [
  {
    index: "01",
    slug: "weins",
    name: "WEINS",
    wing: "revealed",
    revealState: "open",
    statusLabel: "OPEN",
    character: "Architectural / structural / monochrome / garment physics",
    thesis: "Weight defines form.",
    motifs: ["FORM", "WEIGHT", "SILHOUETTE"],
    developmentNote:
      "Open — an authored menswear world shaped by garment mass, construction, silhouette, fit, and precise commerce.",
    media: [
      {
        src: "/creator/weins/hero-minimal.jpg",
        alt: "WEINS model in a chalk heavyweight tee framed by a concrete architectural plane",
        label: "The Minimal",
        kind: "image",
        status: "verified",
        source: "owned-repository:Noe-09/Weins@5d72137",
      },
      {
        src: "/creator/weins/fabric-macro.jpg",
        alt: "Macro study of the dense cotton knit used in the WEINS garment system",
        label: "Construction",
        kind: "image",
        status: "verified",
        source: "owned-repository:Noe-09/Weins@5d72137",
      },
      {
        src: "/creator/weins/look-04-proportion.jpg",
        alt: "WEINS split-frame proportion study of an oversized black tee and trouser",
        label: "Proportion",
        kind: "image",
        status: "verified",
        source: "owned-repository:Noe-09/Weins@5d72137",
      },
    ],
    detail: detail([
      "WEINS begins with a verified principle: Weight defines form. Garment mass is treated as the source of silhouette rather than decoration.",
      "Zinc, concrete, chalk, and graphite frame an architectural menswear world built around proportion and material weight.",
      "The owned flagship contains three collection worlds, garment construction stories, a curated lookbook, fit guidance, and precise commerce flows.",
      "Structural planes compress and release around garment imagery while metadata remains measured, quiet, and direct.",
      "Open. The world and selected campaign material are verified in the owned WEINS repository.",
      "Creator presents the essential system; the complete WEINS flagship remains its own authored destination.",
    ]),
    route: "/creator/weins",
    liveUrl: null,
  },
  {
    index: "02",
    slug: "slyour",
    name: "SLYOUR",
    wing: "revealed",
    revealState: "open",
    statusLabel: "OPEN",
    character: "Editorial commerce / product theatre / Young Saigon energy",
    thesis: "Soft Objects / Saigon.",
    motifs: ["CAMPAIGN", "OBJECT", "MATERIAL"],
    developmentNote:
      "Open — a young editorial-commerce world where campaign, object, material, and shopping share one stage.",
    media: [
      {
        src: "/creator/slyour/hero-campaign.jpg",
        alt: "SLYOUR campaign scene presenting soft sculptural bags in a warm editorial composition",
        label: "Campaign",
        kind: "image",
        status: "verified",
        source: "owned-repository:Noe-09/Slyour@c2f40bb",
      },
      {
        src: "/creator/slyour/look-02-crimson.jpg",
        alt: "SLYOUR crimson campaign look staged with youthful Saigon editorial energy",
        label: "Saigon Crimson",
        kind: "image",
        status: "verified",
        source: "owned-repository:Noe-09/Slyour@c2f40bb",
      },
      {
        src: "/creator/slyour/puffer-macro.jpg",
        alt: "Close material study of SLYOUR padded fabric and soft-object construction",
        label: "Material",
        kind: "image",
        status: "verified",
        source: "owned-repository:Noe-09/Slyour@c2f40bb",
      },
    ],
    detail: detail([
      "SLYOUR turns soft objects into a vivid editorial world rooted in Saigon rather than a conventional product catalogue.",
      "Warm white, crimson, dirty olive, and ink move between campaign energy and precise object presentation.",
      "The owned world includes coherent campaign scenes, lookbook studies, product packshots, material imagery, and commerce routes.",
      "Campaign crops shift into isolated objects and tactile material detail without losing the clarity needed to browse and choose.",
      "Open. The selected campaign, product, and material family is verified in the owned SLYOUR repository.",
      "Creator holds the world as an exhibition chapter while the product system continues inside its dedicated flagship.",
    ]),
    route: "/creator/slyour",
    liveUrl: null,
  },
  {
    index: "03",
    slug: "the-xide",
    name: "THE XIDE",
    wing: "revealed",
    revealState: "preview",
    statusLabel: "PREVIEW",
    character: "Ritual / object / material / darkness",
    thesis: "Memory Has a Scent.",
    motifs: ["TRACE", "BLOOM", "SEDIMENT"],
    developmentNote:
      "Preview — a low-light sensory archive of scent, ritual, smoked glass, botanical material, and quiet commerce.",
    media: [
      {
        src: "/creator/the-xide/hero-atmosphere.jpg",
        alt: "THE XIDE candle in smoked glass with a quiet flame and curling smoke on dark stone",
        label: "Ritual",
        kind: "image",
        status: "verified",
        source: "owned-repository:Noe-09/The-Xide@70c94ba",
      },
      {
        src: "/creator/the-xide/candle-packshot.jpg",
        alt: "THE XIDE smoked-glass candle vessel presented on a dark honed stone plinth",
        label: "Object",
        kind: "image",
        status: "verified",
        source: "owned-repository:Noe-09/The-Xide@70c94ba",
      },
      {
        src: "/creator/the-xide/botanical-strata.jpg",
        alt: "THE XIDE botanical scent materials arranged in illuminated strata on black slate",
        label: "Trace / Bloom / Sediment",
        kind: "image",
        status: "verified",
        source: "owned-repository:Noe-09/The-Xide@70c94ba",
      },
    ],
    detail: detail([
      "THE XIDE begins with memory carried through scent and presents fragrance through ritual, object, and material.",
      "Warm obsidian, mineral stone, smoked glass, and restrained amber create a low-light sensory archive.",
      "Verified candle, diffuser, room-spray, botanical, and scent-system material establishes the current preview.",
      "TRACE, BLOOM, and SEDIMENT organize the fragrance system as an unfolding experience rather than another ecommerce showcase.",
      "Preview. The owned source and selected visual family are verified; unsupported performance and production claims remain excluded.",
      "The preview can open further when a public live destination is independently verified.",
    ]),
    route: "/creator/the-xide",
    liveUrl: null,
  },
  {
    index: "04",
    slug: "pawsona",
    name: "PAWSONA",
    wing: "unrevealed",
    revealState: "sealed",
    statusLabel: "SEALED",
    character: "Social presence / clusters / distributed relationships",
    thesis: "Still being made inside BMP.",
    motifs: ["PRESENCE", "CLUSTER", "TRACE"],
    developmentNote: "Sealed — still being made inside BMP.",
    media: [],
    detail: null,
    route: null,
    liveUrl: null,
  },
  {
    index: "05",
    slug: "relationship",
    name: "RELATIONSHIP",
    wing: "unrevealed",
    revealState: "sealed",
    statusLabel: "SEALED",
    character: "Time / linked moments / continuity",
    thesis: "Still being made inside BMP.",
    motifs: ["TIME", "PATH", "CONTINUITY"],
    developmentNote: "Sealed — still being made inside BMP.",
    media: [],
    detail: null,
    route: null,
    liveUrl: null,
  },
  {
    index: "06",
    slug: "miner",
    name: "MINER",
    wing: "unrevealed",
    revealState: "sealed",
    statusLabel: "SEALED",
    character: "Depth / layers / strata / progression",
    thesis: "Still being made inside BMP.",
    motifs: ["DEPTH", "STRATA", "PRESSURE"],
    developmentNote: "Sealed — still being made inside BMP.",
    media: [],
    detail: null,
    route: null,
    liveUrl: null,
  },
];

assertValidCreatorRegistry(worlds);

export const CREATOR = {
  headline: approvedCopy("We build our own things too.", SOURCE),
  supportingCopy: approvedCopy(
    "BMP Creator is where we develop our own apps, web products, experiments, and digital tools. It is both a product portfolio and a public record of how we turn ideas into working experiences.",
    SOURCE,
  ),
  action: {
    label: approvedCopy("See what we are building", SOURCE),
    href: structuredData("/creator", "approved-proposal:public-route-slugs"),
  },
  worlds,
  products: worlds,
} as const;

export type CreatorProduct = CreatorWorld;
