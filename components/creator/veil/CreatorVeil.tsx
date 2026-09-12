import type { CreatorWorld } from "@/content/creator";
import { VeilArtifact } from "./VeilArtifact";

export type CreatorVeilVariant = "cluster" | "timeline" | "strata";

type CreatorVeilProps = {
  world: CreatorWorld;
  variant: CreatorVeilVariant;
};

export function CreatorVeil({ world, variant }: CreatorVeilProps) {
  return (
    <div
      className={`creator-veil creator-veil--${variant}`}
      data-creator-veil={variant}
      data-world={world.slug}
    >
      <div className="creator-veil__layer creator-veil__layer--back" aria-hidden="true">
        <VeilArtifact kind="mass" />
      </div>
      <div className="creator-veil__layer creator-veil__layer--middle" aria-hidden="true">
        <VeilArtifact kind="trace" />
      </div>
      <div className="creator-veil__layer creator-veil__layer--front" aria-hidden="true">
        <VeilArtifact kind="signal" />
      </div>
      <p className="creator-veil__legend">
        <span>{world.index} / SIGNAL WITHHELD</span>
        <span>{world.motifs.join(" / ")}</span>
      </p>
    </div>
  );
}
