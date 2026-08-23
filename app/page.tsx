import Link from "next/link";
import { CapabilitiesIndex } from "@/components/home/CapabilitiesIndex";
import { ClosingScene } from "@/components/home/ClosingScene";
import { HeroSequence } from "@/components/home/HeroSequence";
import { StudioProcess } from "@/components/home/StudioProcess";
import { SelectedWork } from "@/components/work/SelectedWork";
import { Container } from "@/components/ui/Container";
import "./ending.css";
import "./home.css";

export default function Home() {
  return (
    <main className="home-page">
      <header className="site-nav site-nav--flagship">
        <Container className="site-nav__inner">
          <Link href="/" className="site-mark" aria-label="BM Visuals home">
            BM VISUALS
          </Link>
          <nav className="site-nav__links" aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
            <Link href="/contact">Start a Project ↗</Link>
          </nav>
        </Container>
      </header>

      <HeroSequence />

      <SelectedWork />

      <CapabilitiesIndex />

      <StudioProcess />

      <ClosingScene />

      <footer className="footer bm-rule">
        <Container className="footer-inner">
          <div>
            <strong>BM Visuals</strong>
            <p>Digital experience division of BM</p>
          </div>
          <div className="footer-links">
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
            <Link href="/contact">Contact</Link>
          </div>
          <p>Vietnam · Working internationally</p>
        </Container>
      </footer>
    </main>
  );
}
