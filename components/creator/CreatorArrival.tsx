import type { CreatorWorld } from "@/content/creator";
import { CreatorMedia } from "./CreatorMedia";

type CreatorArrivalProps = {
  firstWorld: CreatorWorld;
};

export function CreatorArrival({ firstWorld }: CreatorArrivalProps) {
  return (
    <section className="creator-arrival" data-creator-stage="00-arrival">
      <div className="creator-arrival__intrusion">
        <CreatorMedia
          media={firstWorld.media[0]}
          priority
          sizes="(max-width: 640px) 84vw, 58vw"
        />
      </div>
      <div className="creator-shell creator-arrival__inner">
        <p className="creator-kicker">
          <span>00 — ARRIVAL</span>
          <span>BMP / CREATOR</span>
        </p>
        <h1>
          <span>THINGS</span>
          <span>WE DECIDED</span>
          <span>SHOULD EXIST.</span>
        </h1>
        <div className="creator-arrival__footer">
          <p>Six authored worlds inside BMP.</p>
          <a href={`#creator-world-${firstWorld.slug}`}>
            Enter <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
