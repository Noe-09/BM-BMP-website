import type { Metadata } from "next";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { WORK } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description: WORK.intro.value,
};

export default function WorkPage() {
  return (
    <main className="bmp-page bmp-page--work">
      <SiteHeader />
      <PageHero eyebrow="Work / Proof hub" headline={WORK.headline.value} intro={WORK.intro.value} />
      <section className="bmp-index-section" aria-label="Work categories">
        <Container>
          <ol className="bmp-index-list">
            {WORK.categories.value.map((category, index) => (
              <li key={category}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{category}</strong>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <SiteFooter />
    </main>
  );
}
