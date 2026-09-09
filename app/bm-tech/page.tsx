import type { Metadata } from "next";

import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SERVICES } from "@/content/services";

export const metadata: Metadata = {
  title: "BM Tech",
  description: SERVICES.tech.supportingCopy.value,
};

export default function BMTechPage() {
  return (
    <main className="bmp-page bmp-page--tech">
      <SiteHeader />
      <PageHero
        eyebrow={SERVICES.tech.name.value}
        headline={SERVICES.tech.headline.value}
        intro={SERVICES.tech.supportingCopy.value}
        tone="tech"
      />
      <SiteFooter />
    </main>
  );
}
