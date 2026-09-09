import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { HOME } from "@/content/home";

export function CapabilityWorlds() {
  return (
    <section className="bmp-capability-worlds" aria-label="BMP capabilities">
      {HOME.capabilities.map((capability, index) => (
        <article
          key={capability.key}
          className="bmp-capability-world"
          data-world={capability.key}
        >
          <div className="bmp-capability-world__atmosphere" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <Container className="bmp-capability-world__inner">
            <p className="bmp-capability-world__index">
              {String(index + 1).padStart(2, "0")} / 03
            </p>
            <h2>{capability.name.value}</h2>
            <div className="bmp-capability-world__statement">
              <h3>{capability.headline.value}</h3>
              <p>{capability.supportingCopy.value}</p>
              <Link href={capability.href.value} aria-label={capability.name.value}>
                <span>{capability.name.value}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </Container>
        </article>
      ))}
    </section>
  );
}
