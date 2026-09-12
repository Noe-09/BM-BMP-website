import type { CreatorDetailSection, CreatorWorld } from "@/content/creator";

type BuildStateProps = {
  world: CreatorWorld;
  section: CreatorDetailSection;
};

export function BuildState({ world, section }: BuildStateProps) {
  return (
    <section
      className="creator-detail__state"
      data-creator-detail-section={section.id}
      aria-labelledby={`creator-detail-${world.slug}-${section.id}`}
    >
      <div className="creator-shell creator-detail__state-grid">
        <div>
          <p className="creator-kicker">05 / BUILD STATE</p>
          <h2 id={`creator-detail-${world.slug}-${section.id}`}>{section.label}</h2>
        </div>
        <p>{section.body}</p>
        <dl>
          <div>
            <dt>Publication</dt>
            <dd>{world.statusLabel}</dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>{world.media.length} verified artifacts</dd>
          </div>
          <div>
            <dt>Live destination</dt>
            <dd>{world.liveUrl ? "Verified" : "Not published"}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
