"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { SelectedProject } from "@/components/work/SelectedProject";
import type { SelectedProject as Project } from "@/lib/projects/selected-work";
import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";
import { getViewportSceneProgress } from "@/lib/work/interaction";

type LiquidProjectProps = { project: Project };

export function LiquidProject({ project }: LiquidProjectProps) {
  const profile = useInteractionProfile();
  const mediaRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const positionLens = (clientX: number, clientY: number) => {
    const media = mediaRef.current;
    if (!media) return;
    const rect = media.getBoundingClientRect();
    const x = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
    const y = ((clientY - rect.top) / Math.max(1, rect.height)) * 100;
    media.style.setProperty("--lens-x", `${Math.min(100, Math.max(0, x)).toFixed(2)}%`);
    media.style.setProperty("--lens-y", `${Math.min(100, Math.max(0, y)).toFixed(2)}%`);
  };

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || !profile.ready || profile.reducedMotion || profile.allowPointerDepth) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = media.getBoundingClientRect();
      const progress = getViewportSceneProgress({
        top: rect.top,
        height: rect.height,
        viewportHeight: window.innerHeight,
      });
      media.style.setProperty("--lens-x", `${(24 + progress * 52).toFixed(2)}%`);
      media.style.setProperty("--lens-y", `${(70 - progress * 38).toFixed(2)}%`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [profile.allowPointerDepth, profile.ready, profile.reducedMotion]);

  return (
    <SelectedProject project={project} className="liquid-project">
      <div
        ref={mediaRef}
        className="liquid-media"
        data-project-transition-source={project.slug}
        data-cursor="explore"
        data-cursor-label={project.cursorLabel}
        onPointerMove={(event) => {
          if (profile.reducedMotion) return;
          if (profile.allowPointerDepth || draggingRef.current) {
            positionLens(event.clientX, event.clientY);
          }
        }}
        onPointerDown={(event) => {
          if (profile.reducedMotion) return;
          draggingRef.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          positionLens(event.clientX, event.clientY);
        }}
        onPointerUp={(event) => {
          draggingRef.current = false;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
      >
        <Image
          src={project.previewAssets[0].src}
          alt={project.previewAssets[0].alt}
          fill
          sizes="(max-width: 767px) 92vw, 74vw"
          className="liquid-media__base"
        />
        <div className="liquid-media__reveal" aria-hidden="true">
          <Image
            src={project.previewAssets[1].src}
            alt=""
            fill
            sizes="(max-width: 767px) 92vw, 74vw"
            className="liquid-media__alternate"
          />
        </div>
        <span className="liquid-media__ring" aria-hidden="true" />
        <p className="liquid-media__instruction">
          <span className="bm-only-fine">Move through the serum field</span>
          <span className="bm-only-coarse">Drag or scroll to reveal</span>
        </p>
      </div>
    </SelectedProject>
  );
}
