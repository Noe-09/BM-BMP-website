import { approvedCopy, structuredData } from "./types.ts";

const SOURCE = "canonical-docx:service-pages";

export const SERVICES = {
  visual: {
    name: approvedCopy("BM Visual", SOURCE),
    headline: approvedCopy("Make the brand worth noticing.", SOURCE),
    supportingCopy: approvedCopy(
      "BM Visual helps businesses turn scattered, inconsistent, or forgettable digital presence into a clearer visual system that earns attention and feels more credible.",
      SOURCE,
    ),
    groups: approvedCopy(
      [
        "Brand identity & visual direction",
        "Website visual presentation / landing page creative direction",
        "Social media visual systems & content assets",
        "Marketing creatives / campaign visuals",
        "AI-assisted visual production & concept development",
        "Logo motion, intro/outro and lightweight motion assets",
      ] as const,
      SOURCE,
    ),
    action: {
      label: approvedCopy("Improve your visual presence", SOURCE),
      href: structuredData("/contact", "approved-proposal:public-route-slugs"),
    },
  },
  tech: {
    name: approvedCopy("BM Tech", SOURCE),
    headline: approvedCopy("Build systems around real problems.", SOURCE),
    supportingCopy: approvedCopy(
      "BM Tech helps lean businesses replace repetitive work, disconnected information, and manual processes with practical digital systems and lightweight tools.",
      SOURCE,
    ),
    groups: approvedCopy(
      [
        "Business websites & focused web systems",
        "Workflow automation and integrations",
        "AI-assisted internal tools and customer-facing utilities",
        "Chat / support / lead-handling systems",
        "CRM-lite and operational dashboards",
        "Custom MVPs and practical digital prototypes",
      ] as const,
      SOURCE,
    ),
    action: {
      label: approvedCopy("Tell us the problem", SOURCE),
      href: structuredData("/contact", "approved-proposal:public-route-slugs"),
    },
  },
} as const;
