import type { Metadata } from "next";

import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ABOUT } from "@/content/about";

export const metadata: Metadata = {
  title: "About Us",
  description: ABOUT.intro.value,
};

export default function AboutPage() {
  return (
    <main className="bmp-page bmp-page--about">
      <SiteHeader />
      <PageHero eyebrow="About Us" headline={ABOUT.headline.value} intro={ABOUT.intro.value} />
      <SiteFooter />
    </main>
  );
}
