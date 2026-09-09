import { approvedCopy, structuredData, type AssetReference } from "./types.ts";

const SOURCE = "canonical-docx:bmp-creator";

export type CreatorProduct = {
  name: string;
  slug: string;
  status: string;
  productType: string;
  problem: string;
  concept: string;
  visualAssets: AssetReference[];
  demo: string | null;
  link: string | null;
  developmentNote: string;
};

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
  products: [] as CreatorProduct[],
} as const;
