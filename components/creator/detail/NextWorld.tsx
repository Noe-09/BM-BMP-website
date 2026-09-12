import Link from "next/link";

import type { CreatorDetailSection, CreatorWorld } from "@/content/creator";

type NextWorldProps = {
  current: CreatorWorld;
  next: CreatorWorld;
  section: CreatorDetailSection;
};

export function NextWorld({ current, next, section }: NextWorldProps) {
  return (
    <section
      className="creator-detail__next"
      data-creator-detail-section={section.id}
      aria-labelledby={`creator-detail-${current.slug}-${section.id}`}
    >
      <div className="creator-shell creator-detail__next-grid">
        <p className="creator-kicker">06 / CONTINUE</p>
        <div>
          <h2 id={`creator-detail-${current.slug}-${section.id}`}>{section.label}</h2>
          <p>{section.body}</p>
        </div>
        <nav aria-label="Creator detail continuation">
          <Link href={next.route!}>
            Next world — {next.name} <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/creator#creator-index">Creator Index</Link>
        </nav>
      </div>
    </section>
  );
}
