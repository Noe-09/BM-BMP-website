import type { CreatorWorld } from "@/content/creator";
import { CreatorArrival } from "./CreatorArrival";
import { CreatorColophon } from "./CreatorColophon";
import { CreatorIndex } from "./CreatorIndex";
import { CreatorJourneyController } from "./CreatorJourneyController";
import { CreatorWorldSequence } from "./CreatorWorldSequence";

type CreatorExperienceProps = {
  worlds: readonly CreatorWorld[];
};

export function CreatorExperience({ worlds }: CreatorExperienceProps) {
  return (
    <div
      className="creator-experience"
      data-creator-experience
      data-creator-products={worlds.length}
      data-active-world="arrival"
      data-direction="0"
    >
      <CreatorJourneyController worldSlugs={worlds.map(({ slug }) => slug)} />
      <CreatorArrival firstWorld={worlds[0]} />
      <CreatorWorldSequence worlds={worlds} />
      <CreatorIndex worlds={worlds} />
      <CreatorColophon />
    </div>
  );
}
