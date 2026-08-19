import Link from "next/link";
import { Container } from "@/components/ui/Container";

const contacts = [
  {
    number: "01",
    label: "Zalo",
    descriptor: "Quick conversation",
    href: "https://zalo.me/0326034128",
  },
  {
    number: "02",
    label: "LinkedIn",
    descriptor: "Professional inquiries",
    href: "https://www.linkedin.com/in/baotran1909/",
  },
  {
    number: "03",
    label: "Facebook",
    descriptor: "Message us",
    href: "https://www.facebook.com/profile.php?id=61567460303851",
  },
];

export default function ContactPage() {
  return (
    <main className="contact-page">
      <header className="site-nav">
        <Container className="site-nav__inner">
          <Link href="/" className="site-mark" aria-label="BM Visuals home">
            BM VISUALS
          </Link>
          <nav className="site-nav__links" aria-label="Primary navigation">
            <Link href="/#work">Work</Link>
            <Link href="/#studio">Studio</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </Container>
      </header>

      <section className="contact-hero">
        <Container>
          <p className="section-label">Start a Project</p>
          <h1>Have something worth making?</h1>
          <div className="bm-grid contact-intro">
            <p>
              Tell us what you&apos;re building.<br />
              Let&apos;s see what we can make together.
            </p>
          </div>
        </Container>
      </section>

      <section className="contact-index bm-rule">
        <Container>
          {contacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-row"
            >
              <span className="contact-number">{contact.number}</span>
              <div className="contact-name">
                <strong>{contact.label}</strong>
                <span>{contact.descriptor}</span>
              </div>
              <span className="contact-arrow" aria-hidden>↗</span>
            </a>
          ))}
        </Container>
      </section>

      <footer className="contact-footer bm-rule">
        <Container className="contact-footer__inner">
          <p>Vietnam</p>
          <p>Working internationally.</p>
          <Link href="/">Back to BM Visuals ↑</Link>
        </Container>
      </footer>
    </main>
  );
}
