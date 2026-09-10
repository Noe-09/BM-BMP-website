"use client";

import Image from "next/image";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { getVisualCapabilities } from "@/lib/home/ending";
import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";

type CapabilitiesIndexProps = {
  groups: readonly string[];
};

export function CapabilitiesIndex({ groups }: CapabilitiesIndexProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const profile = useInteractionProfile();
  const capabilities = getVisualCapabilities(groups);
  const active = capabilities[activeIndex];

  return (
    <section
      className="capabilities-index bm-rule"
      data-bm-visual-section="capabilities"
      data-scene-theme="paper"
      aria-labelledby="capabilities-title"
    >
      <Container>
        <div className="ending-heading">
          <p className="section-label">Capabilities / 06</p>
          <h2 id="capabilities-title">Six ways to sharpen your visual presence.</h2>
        </div>

        <div className="capabilities-index__layout">
          <ul className="capabilities-index__list" aria-label="Studio capabilities">
            {capabilities.map((capability, index) => (
              <li key={capability.id}>
                <button
                  type="button"
                  className="capability-index-row"
                  aria-pressed={activeIndex === index}
                  onPointerEnter={() => profile.allowPointerDepth && setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                >
                  <span>{capability.number}</span>
                  <strong>{capability.title}</strong>
                  <i aria-hidden>{activeIndex === index ? "↗" : "—"}</i>
                </button>
              </li>
            ))}
          </ul>

          <figure className="capabilities-proof" aria-live="polite">
            <div className="capabilities-proof__viewport">
              <Image
                key={active.id}
                src={active.proof.src}
                alt={active.proof.alt}
                fill
                sizes="(max-width: 767px) 92vw, (max-width: 1199px) 42vw, 38vw"
              />
              <span className="capabilities-proof__project">Project view / {active.proof.project}</span>
            </div>
            <figcaption>{active.detail}</figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
