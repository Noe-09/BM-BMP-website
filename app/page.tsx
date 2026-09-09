import { CapabilitiesIndex } from "@/components/home/CapabilitiesIndex";
import { ClosingScene } from "@/components/home/ClosingScene";
import { HeroSequence } from "@/components/home/HeroSequence";
import { StudioProcess } from "@/components/home/StudioProcess";
import { SelectedWork } from "@/components/work/SelectedWork";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import "./ending.css";
import "./home.css";

export default function Home() {
  return (
    <main className="home-page">
      <SiteHeader />

      <HeroSequence />

      <SelectedWork />

      <CapabilitiesIndex />

      <StudioProcess />

      <ClosingScene />

      <SiteFooter />
    </main>
  );
}
