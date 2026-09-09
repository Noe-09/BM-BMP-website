import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { HOME } from "@/content/home";

export function BmpHero() {
  return (
    <section className="bmp-home-hero" aria-labelledby="bmp-home-title">
      <div className="bmp-home-hero__field" aria-hidden="true">
        <span>B</span>
        <span>M</span>
        <span>P</span>
      </div>
      <Container className="bmp-home-hero__inner">
        <p className="bmp-home-hero__eyebrow">{HOME.hero.eyebrow.value}</p>
        <h1 id="bmp-home-title">{HOME.hero.headline.value}</h1>
        <div className="bmp-home-hero__decision">
          <p>{HOME.hero.supportingCopy.value}</p>
          <div className="bmp-home-hero__actions">
            {HOME.hero.actions.map((action, index) => (
              <Link
                key={action.href.value}
                href={action.href.value}
                className={index === 0 ? "bmp-button bmp-button--solid" : "bmp-button"}
              >
                {action.label.value}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
