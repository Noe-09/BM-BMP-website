import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CreatorDetailShell } from "@/components/creator/detail/CreatorDetailShell";
import { CREATOR } from "@/content/creator";
import {
  getPublishedCreatorWorld,
  getPublishedCreatorWorlds,
} from "@/lib/creator/publication";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedCreatorWorlds(CREATOR.worlds).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/creator/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const world = getPublishedCreatorWorld(slug, CREATOR.worlds);
  if (!world) notFound();

  return {
    title: `${world.name} — BMP Creator`,
    description: world.developmentNote,
    openGraph: {
      title: `${world.name} — BMP Creator`,
      description: world.developmentNote,
      type: "website",
    },
  };
}

export default async function CreatorDetailPage({
  params,
}: PageProps<"/creator/[slug]">) {
  const { slug } = await params;
  const world = getPublishedCreatorWorld(slug, CREATOR.worlds);
  if (!world) notFound();

  return <CreatorDetailShell world={world} worlds={CREATOR.worlds} />;
}
