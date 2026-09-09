import type { Metadata } from "next";

import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Container } from "@/components/ui/Container";
import { CREATOR } from "@/content/creator";

export const metadata: Metadata = {
  title: "BMP Creator",
  description: CREATOR.supportingCopy.value,
};

export default function CreatorPage() {
  return (
    <div className="bmp-page bmp-page--creator">
      <SiteHeader />
      <main>
        <PageHero
          eyebrow="BMP Creator"
          headline={CREATOR.headline.value}
          intro={CREATOR.supportingCopy.value}
          tone="creator"
        />
        <section
          className="bmp-creator-index"
          data-creator-products={CREATOR.products.length}
          aria-label="BMP Creator products"
        >
          <Container>
            {CREATOR.products.length === 0 ? (
              <EmptyState label={CREATOR.action.label.value} />
            ) : null}
          </Container>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
