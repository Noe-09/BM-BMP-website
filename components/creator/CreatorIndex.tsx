import Link from "next/link";

import type { CreatorWorld } from "@/content/creator";

type CreatorIndexProps = {
  worlds: readonly CreatorWorld[];
};

function IndexContents({ world }: { world: CreatorWorld }) {
  return (
    <>
      <span className="creator-index__number">{world.index}</span>
      <span className="creator-index__name">{world.name}</span>
      <span className="creator-index__motifs">{world.motifs.join(" / ")}</span>
      <span className="creator-index__state">{world.statusLabel}</span>
      {world.route ? <span aria-hidden="true">↗</span> : null}
    </>
  );
}

export function CreatorIndex({ worlds }: CreatorIndexProps) {
  return (
    <section
      className="creator-index"
      data-creator-index="worlds"
      data-creator-stage="07-index"
      aria-labelledby="creator-index-title"
    >
      <div className="creator-shell">
        <header className="creator-index__header">
          <p className="creator-kicker">07 — INDEX OF WORLDS</p>
          <h2 id="creator-index-title">CREATOR INDEX</h2>
          <p>Six worlds. Three revealed. Three still taking form.</p>
        </header>
        <ol className="creator-index__list">
          {worlds.map((world) => (
            <li key={world.slug} data-index-world={world.slug}>
              {world.route ? (
                <Link href={world.route}>
                  <IndexContents world={world} />
                </Link>
              ) : (
                <div>
                  <IndexContents world={world} />
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
