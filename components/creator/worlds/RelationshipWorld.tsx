import type { CreatorWorld } from "@/content/creator";
import { CreatorVeil } from "../veil/CreatorVeil";

export function RelationshipWorld({ world }: { world: CreatorWorld }) {
  return (
    <section
      id={`creator-world-${world.slug}`}
      className="creator-world creator-world--sealed creator-world--relationship"
      data-creator-world={world.slug}
      data-reveal-state={world.revealState}
      data-creator-stage={`${world.index}-${world.slug}`}
      aria-labelledby={`creator-world-title-${world.slug}`}
    >
      <div className="creator-sealed-portal creator-sealed-portal--relationship">
        <CreatorVeil world={world} variant="timeline" />
        <div className="creator-shell creator-sealed-portal__copy">
          <p className="creator-sealed-portal__state">
            <span>{world.index} / 06</span>
            <span>{world.statusLabel}</span>
          </p>
          <div className="creator-sealed-portal__identity">
            <h2 id={`creator-world-title-${world.slug}`}>{world.name}</h2>
            <p>{world.developmentNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
