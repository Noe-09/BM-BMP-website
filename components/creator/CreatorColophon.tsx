import Link from "next/link";

export function CreatorColophon() {
  return (
    <section
      className="creator-colophon"
      data-creator-colophon="08"
      data-creator-stage="08-colophon"
      aria-labelledby="creator-colophon-title"
    >
      <div className="creator-shell creator-colophon__inner">
        <p className="creator-kicker">08 — CREATOR COLOPHON</p>
        <h2 id="creator-colophon-title">Made because it should exist.</h2>
        <div className="creator-colophon__statement">
          <p>Visual proves taste.</p>
          <p>Creator proves imagination.</p>
          <p>Tech proves capability.</p>
        </div>
        <nav aria-label="Continue from BMP Creator">
          <Link href="/about">About BMP <span aria-hidden="true">↗</span></Link>
          <Link href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
        </nav>
      </div>
    </section>
  );
}
