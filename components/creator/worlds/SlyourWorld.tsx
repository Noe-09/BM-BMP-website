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
      <div className="creator-shell creator-world__inner creator-world__inner--slyour">
        <header className="creator-world__header">
          <p>{world.index} / 06</p>
          <p>{world.statusLabel}</p>
          <p>{world.character}</p>
        </header>
        <div className="slyour-composition">
          <div className="creator-world__title slyour-composition__title">
            <p>{world.motifs.join(" / ")}</p>
            <h2 id={`creator-world-title-${world.slug}`}>{world.name}</h2>
          </div>
          <CreatorMedia
            media={world.media[0]}
            className="slyour-composition__campaign"
            sizes="(max-width: 640px) 88vw, 58vw"
          />
          <CreatorMedia
            media={world.media[1]}
            className="slyour-composition__object"
            sizes="(max-width: 640px) 54vw, 26vw"
          />
          <CreatorMedia
            media={world.media[2]}
            className="slyour-composition__material"
            sizes="(max-width: 640px) 42vw, 20vw"
          />
          <p className="slyour-composition__stamp" aria-hidden="true">
            YOUNG SAIGON / SOFT OBJECTS
          </p>
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
