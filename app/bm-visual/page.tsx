import type { Metadata } from "next";

import { ServiceIndex } from "@/components/services/ServiceIndex";
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
    <div className="bmp-page bmp-page--visual">
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={SERVICES.visual.name.value}
          headline={SERVICES.visual.headline.value}
          intro={SERVICES.visual.supportingCopy.value}
          tone="visual"
        />
        <ServiceIndex
          name={SERVICES.visual.name.value}
          groups={SERVICES.visual.groups.value}
          action={{
            label: SERVICES.visual.action.label.value,
            href: SERVICES.visual.action.href.value,
          }}
          tone="visual"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
