import type { Metadata } from "next";

import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { CREATOR } from "@/content/creator";

export const metadata: Metadata = {
  title: "BMP Creator",
  description: CREATOR.supportingCopy.value,
};

export default function CreatorPage() {
  return (
    <main className="bmp-page bmp-page--creator">
      <SiteHeader />
      <PageHero
        eyebrow="BMP Creator"
        headline={CREATOR.headline.value}
        intro={CREATOR.supportingCopy.value}
        tone="creator"
      />
      <SiteFooter />
    </main>
  );
}
