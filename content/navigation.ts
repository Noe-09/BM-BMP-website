import { approvedCopy, structuredData, type CTA } from "./types.ts";

const SOURCE = "canonical-docx:website-structure";

const navigationItem = (label: string, href: string): CTA => ({
  label: approvedCopy(label, SOURCE),
  href: structuredData(href, "approved-proposal:public-route-slugs"),
});

export const NAVIGATION = {
  home: navigationItem("BMP", "/"),
  items: [
    navigationItem("Work", "/work"),
    navigationItem("BM Visual", "/bm-visual"),
    navigationItem("BM Tech", "/bm-tech"),
    navigationItem("BMP Creator", "/creator"),
    navigationItem("About Us", "/about"),
    navigationItem("Start a Project", "/contact"),
  ],
} as const;
