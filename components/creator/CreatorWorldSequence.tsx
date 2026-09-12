import type { CreatorWorld } from "@/content/creator";
import { CreatorThreshold } from "./CreatorThreshold";
import { MinerWorld } from "./worlds/MinerWorld";
import { PawsonaWorld } from "./worlds/PawsonaWorld";
import { RelationshipWorld } from "./worlds/RelationshipWorld";
import { SlyourWorld } from "./worlds/SlyourWorld";
import { WeinsWorld } from "./worlds/WeinsWorld";
import { XideWorld } from "./worlds/XideWorld";

type CreatorWorldSequenceProps = {
  worlds: readonly CreatorWorld[];
};

function WorldChapter({ world }: { world: CreatorWorld }) {
  switch (world.slug) {
    case "weins":
      return <WeinsWorld world={world} />;
    case "slyour":
      return <SlyourWorld world={world} />;
    case "the-xide":
      return <XideWorld world={world} />;
    case "pawsona":
      return <PawsonaWorld world={world} />;
    case "relationship":
      return <RelationshipWorld world={world} />;
    case "miner":
      return <MinerWorld world={world} />;
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
