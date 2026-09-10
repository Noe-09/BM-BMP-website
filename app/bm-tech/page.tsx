import type { Metadata } from "next";

import { ServiceIndex } from "@/components/services/ServiceIndex";
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
    <div className="bmp-page bmp-page--tech">
      <SiteHeader />
      <main>
        <PageHero
          eyebrow={SERVICES.tech.name.value}
          headline={SERVICES.tech.headline.value}
          intro={SERVICES.tech.supportingCopy.value}
          tone="tech"
        />
        <ServiceIndex
          name={SERVICES.tech.name.value}
          groups={SERVICES.tech.groups.value}
          action={{
            label: SERVICES.tech.action.label.value,
            href: SERVICES.tech.action.href.value,
          }}
          tone="tech"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
