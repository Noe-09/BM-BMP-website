import Link from "next/link";

import type { CreatorWorld } from "@/content/creator";
import { CreatorMedia } from "../CreatorMedia";

export function XideWorld({ world }: { world: CreatorWorld }) {
  return (
    <section
      id={`creator-world-${world.slug}`}
      className="creator-world creator-world--xide"
      data-creator-world={world.slug}
      data-reveal-state={world.revealState}
      data-creator-stage={`${world.index}-${world.slug}`}
      aria-labelledby={`creator-world-title-${world.slug}`}
    >
      <div className="creator-shell creator-world__inner creator-world__inner--xide">
        <header className="creator-world__header">
          <p>{world.index} / 06</p>
          <p>{world.statusLabel}</p>
          <p>{world.character}</p>
        </header>
        <div className="xide-composition">
          <div className="xide-composition__halo" aria-hidden="true" />
          <CreatorMedia
            media={world.media[0]}
            className="xide-composition__atmosphere"
            sizes="(max-width: 640px) 90vw, 64vw"
          />
          <CreatorMedia
            media={world.media[1]}
            className="xide-composition__object"
            sizes="(max-width: 640px) 45vw, 24vw"
          />
          <CreatorMedia
            media={world.media[2]}
            className="xide-composition__strata"
            sizes="(max-width: 640px) 64vw, 30vw"
          />
          <div className="creator-world__title xide-composition__title">
            <p>{world.motifs.join(" / ")}</p>
            <h2 id={`creator-world-title-${world.slug}`}>{world.name}</h2>
          </div>
          <ol className="xide-composition__trace" aria-label="Scent progression">
            {world.motifs.map((motif, index) => (
              <li key={motif}>
                <span>0{index + 1}</span> {motif}
              </li>
            ))}
          </ol>
        </div>
        <div className="creator-world__footer">
          <p>{world.thesis}</p>
          <Link href={world.route!}>
            Enter preview <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
