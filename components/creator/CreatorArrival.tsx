import type { CreatorWorld } from "@/content/creator";

type CreatorArrivalProps = {
  firstWorld: CreatorWorld;
};

export function CreatorArrival({ firstWorld }: CreatorArrivalProps) {
  return (
    <section className="creator-arrival" data-creator-stage="00-arrival">
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
          <p>
            Authored worlds, products, and experiments made inside BMP.
            Creator proves imagination.
          </p>
          <a href={`#creator-world-${firstWorld.slug}`}>
            Enter the worlds <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div className="creator-arrival__orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </section>
  );
}
