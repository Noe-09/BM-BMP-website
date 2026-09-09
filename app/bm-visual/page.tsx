import type { Metadata } from "next";

import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SERVICES } from "@/content/services";

export const metadata: Metadata = {
  title: "BM Visual",
  description: SERVICES.visual.supportingCopy.value,
};

export default function BMVisualPage() {
  return (
    <main className="bmp-page bmp-page--visual">
      <SiteHeader />
      <PageHero
        eyebrow={SERVICES.visual.name.value}
        headline={SERVICES.visual.headline.value}
        intro={SERVICES.visual.supportingCopy.value}
        tone="visual"
      />
      <SiteFooter />
    </main>
  );
}
