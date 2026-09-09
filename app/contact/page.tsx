import { Container } from "@/components/ui/Container";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

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
      <SiteHeader />

      <section className="contact-hero">
        <Container>
          <p className="section-label">Start a Project</p>
          <h1>Have something worth building?</h1>
          <div className="bm-grid contact-intro">
            <p>
              Tell us what needs to exist.<br />
              Let&apos;s make it hard to forget.
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

      <SiteFooter />
    </main>
  );
}
