import type { CreatorWorld } from "@/content/creator";
import { CreatorMedia } from "../CreatorMedia";

export function ArtifactGallery({ world }: { world: CreatorWorld }) {
  return (
    <section
      className="creator-detail__artifacts creator-shell"
      data-creator-detail-artifacts={world.slug}
      aria-labelledby={`creator-artifacts-${world.slug}`}
    >
      <header>
        <p className="creator-kicker">ARTIFACTS / VERIFIED</p>
        <h2 id={`creator-artifacts-${world.slug}`}>Evidence from the world.</h2>
      </header>
      <div className="creator-detail__artifact-grid">
        {world.media.map((media, index) => (
          <CreatorMedia
            key={media.src}
            media={media}
            className={`creator-detail__artifact creator-detail__artifact--${index + 1}`}
            quality={index === 0 ? 92 : 88}
            sizes={
              index === 0
                ? "(max-width: 640px) 92vw, (max-width: 1600px) 62vw, 992px"
                : "(max-width: 640px) 92vw, (max-width: 1600px) 34vw, 544px"
            }
          />
        ))}
      </div>
    </section>
  );
}
