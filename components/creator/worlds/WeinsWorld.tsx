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
      <div className="weins-portal">
        <div className="weins-portal__visual">
          <CreatorMedia
            media={world.media[0]}
            quality={92}
            sizes="(max-width: 640px) 100vw, (max-width: 1490px) 82vw, 1210px"
          />
        </div>
        <div className="weins-portal__slab" aria-hidden="true" />
        <CreatorMedia
          media={world.media[2]}
          className="weins-portal__silhouette"
          quality={88}
          sizes="(max-width: 640px) 34vw, 288px"
        />
        <div className="creator-shell weins-portal__identity">
          <p className="weins-portal__index">{world.index} / 06</p>
          <div>
            <h2 id={`creator-world-title-${world.slug}`}>{world.name}</h2>
            <p>{world.motifs.join(" / ")}</p>
          </div>
          <Link className="weins-portal__action" href={world.route!}>
            {world.statusLabel} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
