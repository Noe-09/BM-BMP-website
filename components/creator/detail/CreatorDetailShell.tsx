import Link from "next/link";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type {
  CreatorDetailSection,
  CreatorWorld,
} from "@/content/creator";
import { getPublishedCreatorWorlds } from "@/lib/creator/publication";
import { ArtifactGallery } from "./ArtifactGallery";
import { BuildState } from "./BuildState";
import { NextWorld } from "./NextWorld";

type CreatorDetailShellProps = {
  world: CreatorWorld;
  worlds: readonly CreatorWorld[];
};

function DetailText({
  world,
  section,
  ordinal,
}: {
  world: CreatorWorld;
  section: CreatorDetailSection;
  ordinal: string;
}) {
  return (
    <section
      className="creator-detail__chapter"
      data-creator-detail-section={section.id}
      aria-labelledby={`creator-detail-${world.slug}-${section.id}`}
    >
      <div className="creator-shell creator-detail__chapter-grid">
        <p className="creator-kicker">{ordinal} / FIELD NOTE</p>
        <h2 id={`creator-detail-${world.slug}-${section.id}`}>{section.label}</h2>
        <p>{section.body}</p>
      </div>
    </section>
  );
}

export function CreatorDetailShell({ world, worlds }: CreatorDetailShellProps) {
  const details = world.detail;
  if (!details || !world.route) return null;

  const byId = Object.fromEntries(details.map((section) => [section.id, section])) as Record<
    CreatorDetailSection["id"],
    CreatorDetailSection
  >;
  const published = getPublishedCreatorWorlds(worlds);
  const currentIndex = published.findIndex(({ slug }) => slug === world.slug);
  const next = published[(currentIndex + 1) % published.length] ?? published[0];
  if (!next) return null;

  return (
    <div className="creator-page creator-detail" data-creator-theme={world.slug}>
      <SiteHeader />
      <main>
        <section className="creator-detail__entry" aria-labelledby="creator-detail-title">
          <div className="creator-shell creator-detail__entry-inner">
            <p className="creator-kicker">
              ENTRY / {world.index} / {world.statusLabel}
            </p>
            <div>
              <p>{world.motifs.join(" / ")}</p>
              <h1 id="creator-detail-title">{world.name}</h1>
            </div>
            <div className="creator-detail__entry-footer">
              <p>{world.thesis}</p>
              <p>{world.character}</p>
            </div>
          </div>
          <div className="creator-detail__entry-mark" aria-hidden="true" />
        </section>

        <DetailText world={world} section={byId.idea} ordinal="01" />
        <DetailText world={world} section={byId.world} ordinal="02" />
        <ArtifactGallery world={world} />
        <DetailText world={world} section={byId.exists} ordinal="03" />
        <DetailText world={world} section={byId.behaves} ordinal="04" />
        <BuildState world={world} section={byId.state} />
        <NextWorld current={world} next={next} section={byId.next} />

        <section className="creator-detail__exit">
          <div className="creator-shell">
            <p className="creator-kicker">ENTER / EXIT</p>
            <h2>{world.name} remains its own world.</h2>
            <div>
              <Link href="/creator">Return to Creator</Link>
              {world.liveUrl ? (
                <a
                  className="creator-detail__live-link"
                  href={world.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${world.name} live experience (opens in a new tab)`}
                >
                  VISIT LIVE <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
