import Link from "next/link";

import type { CreatorWorld } from "@/content/creator";
import { CreatorThreshold } from "./CreatorThreshold";
import { SlyourWorld } from "./worlds/SlyourWorld";
import { WeinsWorld } from "./worlds/WeinsWorld";
import { XideWorld } from "./worlds/XideWorld";

type CreatorWorldSequenceProps = {
  worlds: readonly CreatorWorld[];
};

function FoundationWorld({ world }: { world: CreatorWorld }) {
  return (
    <section
      id={`creator-world-${world.slug}`}
      className="creator-world creator-world--foundation"
      data-creator-world={world.slug}
      data-reveal-state={world.revealState}
      data-creator-stage={`${world.index}-${world.slug}`}
      aria-labelledby={`creator-world-title-${world.slug}`}
    >
      <div className="creator-shell creator-world__inner">
        <header className="creator-world__header">
          <p>{world.index} / 06</p>
          <p>{world.statusLabel}</p>
          <p>{world.character}</p>
        </header>
        <div className="creator-world__title">
          <p>{world.motifs.join(" / ")}</p>
          <h2 id={`creator-world-title-${world.slug}`}>{world.name}</h2>
        </div>
        <div className="creator-world__footer">
          <p>{world.thesis}</p>
          {world.route ? (
            <Link href={world.route}>
              Enter {world.name} <span aria-hidden="true">↗</span>
            </Link>
          ) : (
            <p>{world.developmentNote}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function WorldChapter({ world }: { world: CreatorWorld }) {
  switch (world.slug) {
    case "weins":
      return <WeinsWorld world={world} />;
    case "slyour":
      return <SlyourWorld world={world} />;
    case "the-xide":
      return <XideWorld world={world} />;
    default:
      return <FoundationWorld world={world} />;
  }
}

export function CreatorWorldSequence({ worlds }: CreatorWorldSequenceProps) {
  const firstUnrevealed = worlds.findIndex(({ wing }) => wing === "unrevealed");

  return (
    <div className="creator-world-sequence" data-creator-stage="01-06-worlds">
      {worlds.map((world, index) => (
        <div className="creator-world-sequence__chapter" key={world.slug}>
          {index === firstUnrevealed ? <CreatorThreshold /> : null}
          <WorldChapter world={world} />
        </div>
      ))}
    </div>
  );
}
