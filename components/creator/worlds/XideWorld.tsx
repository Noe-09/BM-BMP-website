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
      <div className="xide-portal__darkness">
        <div className="xide-portal__glow" aria-hidden="true" />
        <CreatorMedia
          media={world.media[0]}
          className="xide-portal__environment"
          sizes="(max-width: 640px) 92vw, 68vw"
        />
        <div className="creator-shell xide-portal__identity">
          <p>{world.index} / 06</p>
          <div>
            <h2 id={`creator-world-title-${world.slug}`}>{world.name}</h2>
            <p>{world.motifs.join(" / ")}</p>
          </div>
          <ol className="xide-portal__traces" aria-label="Scent progression">
            {world.motifs.map((motif, index) => (
              <li key={motif}>
                <span>0{index + 1}</span>
                <span>{motif}</span>
              </li>
            ))}
          </ol>
          <Link href={world.route!}>
            {world.statusLabel} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
