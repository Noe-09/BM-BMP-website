import { BmpHero } from "@/components/home/BmpHero";
import { CapabilityWorlds } from "@/components/home/CapabilityWorlds";
import { ValueFramework } from "@/components/home/ValueFramework";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function Home() {
  return (
    <div className="bmp-page bmp-home">
      <SiteHeader />
      <main>
        <BmpHero />
        <CapabilityWorlds />
        <ValueFramework />
      </main>
      <SiteFooter />
    </div>
  );
}
