import Link from "next/link";
import { HeroSequence } from "@/components/home/HeroSequence";
import { SelectedWork } from "@/components/work/SelectedWork";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";
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

      <section className="philosophy-section bm-rule">
        <Container>
          <div className="bm-grid philosophy-grid">
            <p className="section-label">Our Approach</p>
            <div>
              <h2 className="large-statement">Not another website.</h2>
              <h2 className="large-statement muted-line">
                A digital experience built around your brand.
              </h2>
              <p className="philosophy-copy">
                We do not begin with templates. We begin with the brand, the audience and the
                experience they should remember.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="capabilities-section bm-rule">
        <Container>
          <div className="capabilities-intro">
            <p className="section-label">Capabilities</p>
            <p>Strategy, design, motion and development working as one system.</p>
          </div>
          <div className="capability-list">
            <div className="capability-row">
              <span>01</span>
              <h3>Strategy</h3>
              <p>
                Digital Direction · Experience Strategy · Brand Research · Creative Direction
              </p>
            </div>
            <div className="capability-row">
              <span>02</span>
              <h3>Design</h3>
              <p>Art Direction · UI/UX · Visual Systems · Interactive Design</p>
            </div>
            <div className="capability-row">
              <span>03</span>
              <h3>Motion</h3>
              <p>
                Motion Direction · Micro-interactions · Digital Storytelling · 3D when appropriate
              </p>
            </div>
            <div className="capability-row">
              <span>04</span>
              <h3>Build</h3>
              <p>
                Creative Development · Frontend Development · Ecommerce · CMS Integration
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="studio" className="studio-section bm-rule">
        <Container>
          <div className="bm-grid studio-grid">
            <p className="section-label">Studio</p>
            <div>
              <h2 className="large-statement">Small team.</h2>
              <h2 className="large-statement muted-line">Serious craft.</h2>
              <p>
                BM Visuals is an independent multidisciplinary studio working across design,
                motion and technology. We collaborate closely with brands that care about how they
                are experienced online.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="closing-section bm-rule">
        <Container>
          <p className="section-label">Start a Project</p>
          <div className="closing-row">
            <h2>Have something worth making?</h2>
            <TextLink href="/contact" arrow underline={false} className="closing-link">
              Let&apos;s build it differently
            </TextLink>
          </div>
        </Container>
      </section>

      <footer className="footer bm-rule">
        <Container className="footer-inner">
          <div>
            <strong>BM Visuals</strong>
            <p>Independent Digital Studio</p>
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
