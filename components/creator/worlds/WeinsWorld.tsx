import Link from "next/link";

import type { CreatorWorld } from "@/content/creator";
import { CreatorMedia } from "../CreatorMedia";

export function WeinsWorld({ world }: { world: CreatorWorld }) {
  return (
    <section
      id={`creator-world-${world.slug}`}
      className="creator-world creator-world--weins"
      data-creator-world={world.slug}
      data-reveal-state={world.revealState}
      data-creator-stage={`${world.index}-${world.slug}`}
      aria-labelledby={`creator-world-title-${world.slug}`}
    >
      <div className="creator-shell creator-world__inner creator-world__inner--weins">
        <header className="creator-world__header">
          <p>{world.index} / 06</p>
          <p>{world.statusLabel}</p>
          <p>{world.character}</p>
        </header>
        <div className="weins-composition">
          <div className="weins-composition__plane" aria-hidden="true" />
          <div className="creator-world__title weins-composition__title">
            <p>{world.motifs.join(" / ")}</p>
            <h2 id={`creator-world-title-${world.slug}`}>{world.name}</h2>
          </div>
          <CreatorMedia
            media={world.media[0]}
            className="weins-composition__hero"
            priority
            sizes="(max-width: 640px) 88vw, 54vw"
          />
          <CreatorMedia
            media={world.media[1]}
            className="weins-composition__material"
            sizes="(max-width: 640px) 44vw, 24vw"
          />
          <CreatorMedia
            media={world.media[2]}
            className="weins-composition__silhouette"
            sizes="(max-width: 640px) 34vw, 18vw"
          />
        </div>
        <div className="creator-world__footer">
          <p>{world.thesis}</p>
          <Link href={world.route!}>
            Enter {world.name} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
