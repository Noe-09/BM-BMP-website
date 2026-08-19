import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TextLink } from "@/components/ui/TextLink";

const MARQUEE_TEXT =
  "ART DIRECTION + INTERACTION + DIGITAL CRAFT + DEVELOPMENT + IDENTITY +";

const projects = [
  {
    number: "01",
    title: "Aurelia Skin",
    meta: "Beauty / Ecommerce",
    image: "/projects/aurelia/hero.png",
    supports: [
      "/projects/aurelia/detail-01.webp",
      "/projects/aurelia/mobile-01.webp",
    ],
    tone: "aurelia",
    note: "Soft product storytelling shaped into a clean, tactile digital world.",
    href: "https://aurelia-skin.vercel.app/",
  },
  {
    number: "02",
    title: "Personal Branding",
    meta: "Editorial / Identity",
    image: "/projects/personal-branding/hero.png",
    supports: [
      "/projects/personal-branding/detail-01.png",
      "/projects/personal-branding/mobile-01.webp",
    ],
    tone: "personal",
    note: "Editorial rhythm, identity and typography built to feel unmistakably personal.",
    href: "https://personal-brandingg-beta.vercel.app/",
  },
  {
    number: "03",
    title: "Dental",
    meta: "Healthcare / Conversion",
    image: "/projects/dental/hero.webp",
    supports: ["/projects/dental/detail-01.webp"],
    tone: "dental",
    note: "Clarity and trust translated into a sharper service experience.",
    href: "https://dental-mocha-omega.vercel.app/",
  },
  {
    number: "04",
    title: "Spa",
    meta: "Wellness / Digital Experience",
    image: "/projects/spa/hero.webp",
    supports: [
      "/projects/spa/detail-01.webp",
      "/projects/spa/desktop-01.webp",
    ],
    tone: "spa",
    note: "A calmer digital pace designed around atmosphere and sense of place.",
    href: "https://spa-demo-mauve.vercel.app/",
  },
] as const;

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

          <div
            className="hero-composition"
            aria-label="We create digital identities people remember"
          >
            <span className="hero-word hero-word--we">WE CREATE</span>
            <span className="hero-word hero-word--digital">DIGITAL</span>
            <span className="hero-word hero-word--identities">IDENTITIES</span>
            <span className="hero-word hero-word--people">PEOPLE</span>
            <span className="hero-word hero-word--remember">REMEMBER.</span>
          </div>

          <div className="hero-bottom bm-grid">
            <p className="hero-copy">
              Websites, digital experiences and creative systems built around
              ambitious brands.
            </p>
            <div className="hero-actions">
              <a href="#work" className="editorial-link">
                View Selected Work ↓
              </a>
              <Link href="/contact" className="editorial-link">
                Start a Project ↗
              </Link>
            </div>
          </div>
        </Container>
        <div className="hero-accent" aria-hidden>
          BM / 26
        </div>
      </section>

      <section className="statement-section">
        <Container>
          <div className="bm-grid statement-grid">
            <p className="section-label">What we believe</p>
            <div className="statement-copy">
              <h2>Brands shouldn&apos;t just exist online.</h2>
              <h2 className="muted-line">They should feel alive.</h2>
              <p>
                BM Visuals combines strategy, art direction, UI/UX, motion and
                development to create digital experiences shaped around the
                identity of each brand.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <div className="signal-strip" aria-hidden>
        <div className="signal-strip__marquee">
          {[0, 1].map((group) => (
            <div className="signal-strip__group" key={group}>
              {[0, 1, 2, 3].map((item) => (
                <span key={item}>{MARQUEE_TEXT}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section id="work" className="work-intro">
        <Container>
          <div className="work-heading-row">
            <p className="section-label">Selected Work</p>
            <p className="section-index">2026 — 04 Projects</p>
          </div>
          <h2 className="work-intro__title">
            Different brands.
            <br />
            <span>Different digital worlds.</span>
          </h2>
        </Container>
      </section>

      <section className="project-worlds">
        {projects.map((project, index) => (
          <article
            className={`project-world project-world--${project.tone}`}
            key={project.title}
          >
            <Container className="project-world__inner">
              <div className="project-world__meta">
                <span>{project.number}</span>
                <span>{project.meta}</span>
                <span>BM / 2026</span>
              </div>

              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`project-world__stage project-world__stage--${project.tone}`}
                aria-label={`Open ${project.title} live website`}
              >
                {project.tone === "aurelia" ? (
                  <>
                    <div className="pw-aurelia__title" aria-hidden>
                      <span>AURELIA</span>
                      <span>SKIN</span>
                    </div>
                    <div className="pw-aurelia__layout">
                      <div className="pw-aurelia__main">
                        <Image
                          src={project.image}
                          alt={`${project.title} preview`}
                          fill
                          sizes="(max-width: 768px) 100vw, 56vw"
                          className="project-world__image"
                          priority={index === 0}
                        />
                      </div>
                      <div className="pw-aurelia__side" aria-hidden>
                        {/* eslint-disable @next/next/no-img-element */}
                        <img src={project.supports[0]} alt="" />
                        <img src={project.supports[1]} alt="" />
                      </div>
                    </div>
                    <p className="pw-aurelia__caption" aria-hidden>
                      — beauty / ritual / glow
                    </p>
                  </>
                ) : project.tone === "personal" ? (
                  <>
                    <div className="pw-personal__head">
                      <p className="pw-personal__eyebrow">
                        Editorial System — 02
                      </p>
                      <h3 className="pw-personal__heading" aria-hidden>
                        PERSONAL
                        <br />
                        BRANDING
                      </h3>
                    </div>
                    <div className="pw-personal__layout">
                      <div className="pw-personal__main">
                        <Image
                          src={project.image}
                          alt={`${project.title} preview`}
                          fill
                          sizes="(max-width: 768px) 100vw, 56vw"
                          className="project-world__image"
                        />
                      </div>
                      <div className="pw-personal__rail" aria-hidden>
                        <span className="pw-personal__railRule" />
                        <span className="pw-personal__railText">
                          IDENTITY — VOICE — PRESENCE — EDITORIAL
                        </span>
                        <span className="pw-personal__railRule" />
                        {/* eslint-disable @next/next/no-img-element */}
                        <img
                          className="pw-personal__crop"
                          src={project.supports[0]}
                          alt=""
                        />
                        <img
                          className="pw-personal__crop pw-personal__crop--mobile"
                          src={project.supports[1]}
                          alt=""
                        />
                      </div>
                    </div>
                  </>
                ) : project.tone === "dental" ? (
                  <>
                    <div className="pw-dental__gridline" aria-hidden />
                    <div className="pw-dental__layout">
                      <div className="pw-dental__type" aria-hidden>
                        <span className="pw-dental__kicker">
                          03 — Healthcare / Conversion
                        </span>
                        <h3>DENTAL</h3>
                        <span className="pw-dental__sub">
                          Precision · Clarity · Trust
                        </span>
                      </div>
                      <div className="pw-dental__media">
                        <Image
                          src={project.image}
                          alt={`${project.title} preview`}
                          fill
                          sizes="(max-width: 768px) 100vw, 64vw"
                          className="project-world__image"
                        />
                      </div>
                      <div className="pw-dental__detail" aria-hidden>
                        {/* eslint-disable @next/next/no-img-element */}
                        <img src={project.supports[0]} alt="" />
                        <span>Detail — service clarity</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="pw-spa__layout">
                    <div className="pw-spa__type" aria-hidden>
                      <span className="pw-spa__eyebrow">04 — Wellness</span>
                      <h3>SPA</h3>
                      <span className="pw-spa__tagline">
                        Soft · Airy · Elevated
                      </span>
                    </div>
                    <div className="pw-spa__main">
                      <Image
                        src={project.image}
                        alt={`${project.title} preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, 52vw"
                        className="project-world__image"
                      />
                    </div>
                    <div className="pw-spa__stack" aria-hidden>
                      {/* eslint-disable @next/next/no-img-element */}
                      <img
                        className="pw-spa__crop pw-spa__crop--a"
                        src={project.supports[0]}
                        alt=""
                      />
                      <img
                        className="pw-spa__crop pw-spa__crop--b"
                        src={project.supports[1]}
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </a>

              <div className="project-world__footer bm-grid">
                <p>{project.note}</p>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-world__visit"
                >
                  Visit live site <span aria-hidden>↗</span>
                </a>
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
              <h2 className="large-statement muted-line">
                A digital experience built around your brand.
              </h2>
              <p className="philosophy-copy">
                We do not begin with templates. We begin with the brand, the
                audience and the experience they should remember.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="capabilities-section">
        <Container>
          <div className="capabilities-intro">
            <p className="section-label">Capabilities</p>
            <p>
              Strategy, design, motion and development working as one system.
            </p>
          </div>
          <div className="capability-list">
            <div className="capability-row">
              <span>01</span>
              <h3>Strategy</h3>
              <p>
                Digital Direction · Experience Strategy · Brand Research ·
                Creative Direction
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
                Motion Direction · Micro-interactions · Digital Storytelling ·
                3D when appropriate
              </p>
            </div>
            <div className="capability-row">
              <span>04</span>
              <h3>Build</h3>
              <p>
                Creative Development · Frontend Development · Ecommerce · CMS
                Integration
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="studio" className="studio-section">
        <Container>
          <div className="studio-mark" aria-hidden>
            SMALL / SERIOUS
          </div>
          <div className="bm-grid studio-grid">
            <p className="section-label">Studio</p>
            <div>
              <h2 className="large-statement">Small team.</h2>
              <h2 className="large-statement muted-line">Serious craft.</h2>
              <p>
                BM Visuals is an independent multidisciplinary studio working
                across design, motion and technology. We collaborate closely
                with brands that care about how they are experienced online.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="closing-section">
        <Container>
          <p className="section-label">Start a Project</p>
          <div className="closing-row">
            <h2>
              Have something
              <br />
              worth making?
            </h2>
            <TextLink
              href="/contact"
              arrow
              underline={false}
              className="closing-link"
            >
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
