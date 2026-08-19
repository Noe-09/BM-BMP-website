import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";

const projects = [
  {
    number: "01",
    title: "Aurelia Skin",
    meta: "Beauty / Ecommerce",
    image: "/projects/aurelia/hero.png",
    tone: "aurelia",
    note: "Soft product storytelling shaped into a clean, tactile digital world.",
  },
  {
    number: "02",
    title: "Personal Branding",
    meta: "Editorial / Identity",
    image: "/projects/personal-branding/hero.png",
    tone: "personal",
    note: "Editorial rhythm, identity and typography built to feel unmistakably personal.",
  },
  {
    number: "03",
    title: "Dental",
    meta: "Healthcare / Conversion",
    image: "/projects/dental/hero.webp",
    tone: "dental",
    note: "Clarity and trust translated into a sharper service experience.",
  },
  {
    number: "04",
    title: "Spa",
    meta: "Wellness / Digital Experience",
    image: "/projects/spa/hero.webp",
    tone: "spa",
    note: "A calmer digital pace designed around atmosphere and sense of place.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-nav">
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

      <section className="hero-section">
        <Container>
          <div className="hero-topline">
            <span>Independent Digital Studio</span>
            <span>Vietnam / Worldwide</span>
          </div>

          <div className="hero-composition" aria-label="We create digital identities people remember">
            <span className="hero-word hero-word--we">WE CREATE</span>
            <span className="hero-word hero-word--digital">DIGITAL</span>
            <span className="hero-word hero-word--identities">IDENTITIES</span>
            <span className="hero-word hero-word--people">PEOPLE</span>
            <span className="hero-word hero-word--remember">REMEMBER.</span>
          </div>

          <div className="hero-bottom bm-grid">
            <p className="hero-copy">
              Websites, digital experiences and creative systems built around ambitious brands.
            </p>
            <div className="hero-actions">
              <a href="#work" className="editorial-link">View Selected Work ↓</a>
              <Link href="/contact" className="editorial-link">Start a Project ↗</Link>
            </div>
          </div>
        </Container>
        <div className="hero-accent" aria-hidden>BM / 26</div>
      </section>

      <section className="statement-section">
        <Container>
          <div className="bm-grid statement-grid">
            <p className="section-label">What we believe</p>
            <div className="statement-copy">
              <h2>Brands shouldn&apos;t just exist online.</h2>
              <h2 className="muted-line">They should feel alive.</h2>
              <p>
                BM Visuals combines strategy, art direction, UI/UX, motion and development to create digital experiences shaped around the identity of each brand.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <div className="signal-strip" aria-hidden>
        <div className="signal-strip__track">
          <span>ART DIRECTION</span><i>+</i><span>INTERACTION</span><i>+</i><span>DIGITAL CRAFT</span><i>+</i><span>DEVELOPMENT</span><i>+</i><span>IDENTITY</span>
        </div>
      </div>

      <section id="work" className="work-intro">
        <Container>
          <div className="work-heading-row">
            <p className="section-label">Selected Work</p>
            <p className="section-index">2026 — 04 Projects</p>
          </div>
          <h2 className="work-intro__title">Different brands.<br /><span>Different digital worlds.</span></h2>
        </Container>
      </section>

      <section className="project-worlds">
        {projects.map((project, index) => (
          <article className={`project-world project-world--${project.tone}`} key={project.title}>
            <Container className="project-world__inner">
              <div className="project-world__meta">
                <span>{project.number}</span>
                <span>{project.meta}</span>
                <span>BM / 2026</span>
              </div>

              <div className={`project-world__stage project-world__stage--${index + 1}`}>
                <div className="project-world__media">
                  <Image
                    src={project.image}
                    alt={`${project.title} project preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 86vw"
                    className="project-world__image"
                    priority={index === 0}
                  />
                </div>
                <div className="project-world__title" aria-hidden>
                  {project.title.split(" ").map((word) => <span key={word}>{word}</span>)}
                </div>
              </div>

              <div className="project-world__footer bm-grid">
                <p>{project.note}</p>
                <span className="project-world__arrow" aria-hidden>↗</span>
              </div>
            </Container>
          </article>
        ))}
      </section>

      <section className="philosophy-section">
        <Container>
          <div className="bm-grid philosophy-grid">
            <p className="section-label">Our Approach</p>
            <div>
              <h2 className="large-statement">Not another website.</h2>
              <h2 className="large-statement muted-line">A digital experience built around your brand.</h2>
              <p className="philosophy-copy">
                We do not begin with templates. We begin with the brand, the audience and the experience they should remember.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="capabilities-section">
        <Container>
          <div className="capabilities-intro">
            <p className="section-label">Capabilities</p>
            <p>Strategy, design, motion and development working as one system.</p>
          </div>
          <div className="capability-list">
            <div className="capability-row"><span>01</span><h3>Strategy</h3><p>Digital Direction · Experience Strategy · Brand Research · Creative Direction</p></div>
            <div className="capability-row"><span>02</span><h3>Design</h3><p>Art Direction · UI/UX · Visual Systems · Interactive Design</p></div>
            <div className="capability-row"><span>03</span><h3>Motion</h3><p>Motion Direction · Micro-interactions · Digital Storytelling · 3D when appropriate</p></div>
            <div className="capability-row"><span>04</span><h3>Build</h3><p>Creative Development · Frontend Development · Ecommerce · CMS Integration</p></div>
          </div>
        </Container>
      </section>

      <section id="studio" className="studio-section">
        <Container>
          <div className="studio-mark" aria-hidden>SMALL / SERIOUS</div>
          <div className="bm-grid studio-grid">
            <p className="section-label">Studio</p>
            <div>
              <h2 className="large-statement">Small team.</h2>
              <h2 className="large-statement muted-line">Serious craft.</h2>
              <p>
                BM Visuals is an independent multidisciplinary studio working across design, motion and technology. We collaborate closely with brands that care about how they are experienced online.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="closing-section">
        <Container>
          <p className="section-label">Start a Project</p>
          <div className="closing-row">
            <h2>Have something<br />worth making?</h2>
            <TextLink href="/contact" arrow underline={false} className="closing-link">
              Let&apos;s build it differently
            </TextLink>
          </div>
        </Container>
      </section>

      <footer className="footer">
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
