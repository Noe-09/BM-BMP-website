import type { CreatorWorld } from "../../content/creator.ts";
import { validateCreatorWorld } from "./reveal-state.ts";

export function canPublishCreatorDetail(world: CreatorWorld): boolean {
  return (
    (world.revealState === "preview" || world.revealState === "open") &&
    validateCreatorWorld(world).length === 0
  );
}

export function getPublishedCreatorWorlds(
  worlds: readonly CreatorWorld[],
): CreatorWorld[] {
  return worlds.filter(canPublishCreatorDetail);
}

export function getPublishedCreatorWorld(
  slug: string,
  worlds: readonly CreatorWorld[],
): CreatorWorld | undefined {
  return worlds.find(
    (world) => world.slug === slug && canPublishCreatorDetail(world),
  );
}
