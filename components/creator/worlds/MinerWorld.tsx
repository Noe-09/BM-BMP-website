import type { CreatorWorld } from "@/content/creator";
import { CreatorVeil } from "../veil/CreatorVeil";

export function MinerWorld({ world }: { world: CreatorWorld }) {
  return (
    <section
      id={`creator-world-${world.slug}`}
      className="creator-world creator-world--sealed creator-world--miner"
      data-creator-world={world.slug}
      data-reveal-state={world.revealState}
      data-creator-stage={`${world.index}-${world.slug}`}
      aria-labelledby={`creator-world-title-${world.slug}`}
    >
      <div className="creator-shell creator-world__inner creator-world__inner--sealed">
        <header className="creator-world__header">
          <p>{world.index} / 06</p>
          <p>{world.statusLabel}</p>
          <p>{world.character}</p>
        </header>
        <div className="creator-world__sealed-composition">
          <div className="creator-world__title">
            <p>{world.motifs.join(" / ")}</p>
            <h2 id={`creator-world-title-${world.slug}`}>{world.name}</h2>
          </div>
          <CreatorVeil world={world} variant="strata" />
        </div>
        <div className="creator-world__footer">
          <p>{world.thesis}</p>
          <p>{world.developmentNote}</p>
        </div>
      </div>
    </section>
  );
}
