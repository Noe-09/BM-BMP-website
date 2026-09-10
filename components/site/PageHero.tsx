import { Container } from "@/components/ui/Container";

type PageHeroProps = {
  eyebrow: string;
  headline: string;
  intro?: string;
  tone?: "paper" | "dark" | "visual" | "tech" | "creator";
};

export function PageHero({
  eyebrow,
  headline,
  intro,
  tone = "paper",
}: PageHeroProps) {
  return (
    <section className="bmp-page-hero" data-tone={tone}>
      <Container className="bmp-page-hero__inner">
        <p className="bmp-page-hero__eyebrow">{eyebrow}</p>
        <h1>{headline}</h1>
        {intro ? <p className="bmp-page-hero__intro">{intro}</p> : null}
      </Container>
    </section>
  );
}
