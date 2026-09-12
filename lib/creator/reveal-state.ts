import type { CreatorDetailSection, CreatorMedia, CreatorWorld } from "../../content/creator.ts";

export const CREATOR_REVEAL_STATES = [
  "sealed",
  "glimpse",
  "preview",
  "open",
] as const;

export type CreatorRevealState = (typeof CREATOR_REVEAL_STATES)[number];

const DETAIL_SECTION_ORDER: CreatorDetailSection["id"][] = [
  "idea",
  "world",
  "exists",
  "behaves",
  "state",
  "next",
];

export function isVerifiedCreatorMedia(media: CreatorMedia): boolean {
  return (
    media.kind === "image" &&
    media.status === "verified" &&
    media.src.startsWith("/creator/") &&
    media.alt.trim().length > 0 &&
    media.label.trim().length > 0 &&
    media.source.startsWith("owned-repository:")
  );
}

export function validateCreatorWorld(world: CreatorWorld): readonly string[] {
  const errors: string[] = [];
  const publishable =
    world.revealState === "preview" || world.revealState === "open";

  if (!CREATOR_REVEAL_STATES.includes(world.revealState)) {
    errors.push(`${world.slug}: invalid reveal state`);
  }
  if (!publishable && world.route !== null) {
    errors.push(`${world.slug}: non-publishable worlds cannot expose a route`);
  }
  if (world.revealState === "sealed" && world.media.length > 0) {
    errors.push(`${world.slug}: sealed worlds cannot expose media`);
  }
  if (world.revealState === "sealed" && world.liveUrl !== null) {
    errors.push(`${world.slug}: sealed worlds cannot expose live URLs`);
  }
  if (publishable && !world.media.some(isVerifiedCreatorMedia)) {
    errors.push(`${world.slug}: publishable worlds require verified media`);
  }

  const detailIds = world.detail?.map(({ id }) => id) ?? [];
  if (
    publishable &&
    (detailIds.length !== DETAIL_SECTION_ORDER.length ||
      detailIds.some((id, index) => id !== DETAIL_SECTION_ORDER[index]))
  ) {
    errors.push(`${world.slug}: publishable worlds require six detail sections`);
  }
  if (publishable && world.route !== `/creator/${world.slug}`) {
    errors.push(`${world.slug}: publishable worlds require their canonical route`);
  }

  return errors;
}

export function assertValidCreatorRegistry(
  worlds: readonly CreatorWorld[],
): void {
  const errors = worlds.flatMap(validateCreatorWorld);
  const slugs = new Set<string>();
  const indices = new Set<string>();

  for (const world of worlds) {
    if (slugs.has(world.slug)) errors.push(`${world.slug}: duplicate slug`);
    if (indices.has(world.index)) errors.push(`${world.index}: duplicate index`);
    slugs.add(world.slug);
    indices.add(world.index);
  }

  if (errors.length > 0) {
    throw new Error(`Invalid Creator registry:\n${errors.join("\n")}`);
  }
}
