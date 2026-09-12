"use client";

import Image from "next/image";
import { useState } from "react";

import type { CreatorMedia as CreatorMediaRecord } from "@/content/creator";

type CreatorMediaProps = {
  media: CreatorMediaRecord | null | undefined;
  className?: string;
  priority?: boolean;
  sizes: string;
};

export function CreatorMedia({
  media,
  className = "",
  priority = false,
  sizes,
}: CreatorMediaProps) {
  const [failed, setFailed] = useState(false);
  const available = media?.status === "verified" && Boolean(media.src) && !failed;

  return (
    <figure
      className={`creator-media ${className}`.trim()}
      data-media-state={available ? "verified" : "unavailable"}
    >
      <div className="creator-media__frame">
        <div className="creator-media__fallback" aria-hidden={available}>
          <span>Creator archive</span>
          <strong>Media unavailable</strong>
        </div>
        {available && media ? (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            priority={priority}
            sizes={sizes}
            onError={() => setFailed(true)}
          />
        ) : null}
      </div>
      <figcaption>
        <span>{media?.label ?? "Unverified artifact"}</span>
        <span>{media?.status === "verified" ? "Verified source" : "Withheld"}</span>
      </figcaption>
    </figure>
  );
}
