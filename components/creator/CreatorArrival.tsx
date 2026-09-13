type CreatorArrivalProps = {
  firstWorldSlug: string;
};

export function CreatorArrival({ firstWorldSlug }: CreatorArrivalProps) {
  return (
    <section className="creator-arrival" data-creator-stage="00-arrival">
      <div
        className="creator-arrival__threshold"
        data-creator-arrival-artifact="neutral-threshold"
        aria-hidden="true"
      >
        <div className="creator-arrival__artifact">
          <span className="creator-arrival__depth" />
          <span className="creator-arrival__plane creator-arrival__plane--left" />
          <span className="creator-arrival__plane creator-arrival__plane--right" />
          <span className="creator-arrival__seam" />
        </div>
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
          <a href={`#creator-world-${firstWorldSlug}`}>
            Enter <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
