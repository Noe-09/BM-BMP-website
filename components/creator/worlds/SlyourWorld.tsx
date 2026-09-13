import Link from "next/link";

import type { CreatorWorld } from "@/content/creator";
import { CreatorMedia } from "../CreatorMedia";

export function SlyourWorld({ world }: { world: CreatorWorld }) {
  return (
    <section
      id={`creator-world-${world.slug}`}
      className="creator-world creator-world--slyour"
      data-creator-world={world.slug}
      data-reveal-state={world.revealState}
      data-creator-stage={`${world.index}-${world.slug}`}
      aria-labelledby={`creator-world-title-${world.slug}`}
    >
      <div className="slyour-portal">
        <div className="slyour-portal__editorial-wall" aria-hidden="true">
          YOUNG SAIGON / SOFT OBJECTS / YOUNG SAIGON / SOFT OBJECTS
        </div>
        <CreatorMedia
          media={world.media[0]}
          className="slyour-portal__campaign"
          sizes="(max-width: 640px) 112vw, 72vw"
        />
        <CreatorMedia
          media={world.media[1]}
          className="slyour-portal__object"
          sizes="(max-width: 640px) 48vw, 24vw"
        />
        <div className="creator-shell slyour-portal__identity">
          <p>{world.index} / 06</p>
          <div>
            <h2 id={`creator-world-title-${world.slug}`}>{world.name}</h2>
            <p>{world.motifs.join(" / ")}</p>
          </div>
          <Link href={world.route!}>
            {world.statusLabel} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
