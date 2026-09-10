import { approvedCopy, structuredData } from "./types.ts";

const SOURCE = "canonical-docx:home";

export const HOME = {
  hero: {
    eyebrow: approvedCopy("Creative × Technology × Products", SOURCE),
    headline: approvedCopy(
      "We turn ideas and business problems into brands, systems, and digital products.",
      SOURCE,
    ),
    supportingCopy: approvedCopy(
      "BMP is a creative-tech studio working across visual identity, digital experiences, practical business systems, and products of our own.",
      SOURCE,
    ),
    actions: [
      {
        label: approvedCopy("Explore our work", SOURCE),
        href: structuredData("/work", "approved-proposal:public-route-slugs"),
      },
      {
        label: approvedCopy("Start a project", SOURCE),
        href: structuredData("/contact", "approved-proposal:public-route-slugs"),
      },
    ],
  },
  capabilities: [
    {
      key: "visual",
      name: approvedCopy("BM Visual", SOURCE),
      headline: approvedCopy("Make the brand worth noticing.", SOURCE),
      supportingCopy: approvedCopy(
        "Brand identity, visual systems, social creative, website presentation, and marketing assets designed to improve recognition and credibility.",
        SOURCE,
      ),
      href: structuredData("/bm-visual", "approved-proposal:public-route-slugs"),
    },
    {
      key: "tech",
      name: approvedCopy("BM Tech", SOURCE),
      headline: approvedCopy("Build systems around real problems.", SOURCE),
      supportingCopy: approvedCopy(
        "Practical web systems, automation, AI-assisted tools, workflows, and custom digital solutions that reduce friction and help teams work smarter.",
        SOURCE,
      ),
      href: structuredData("/bm-tech", "approved-proposal:public-route-slugs"),
    },
    {
      key: "creator",
      name: approvedCopy("BMP Creator", SOURCE),
      headline: approvedCopy("We build our own things too.", SOURCE),
      supportingCopy: approvedCopy(
        "Apps, experiments, and digital products built by BMP — a public proof of how we think, design, ship, and learn.",
        SOURCE,
      ),
      href: structuredData("/creator", "approved-proposal:public-route-slugs"),
    },
  ] as const,
} as const;
