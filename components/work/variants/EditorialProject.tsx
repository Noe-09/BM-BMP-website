"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { SelectedProject } from "@/components/work/SelectedProject";
import type { SelectedProject as Project } from "@/lib/projects/selected-work";
import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";
import { getViewportSceneProgress } from "@/lib/work/interaction";

type EditorialProjectProps = { project: Project };

export function EditorialProject({ project }: EditorialProjectProps) {
  const profile = useInteractionProfile();
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layout = layoutRef.current;
    if (!layout || !profile.ready || profile.reducedMotion) return;

    let frame = 0;
    let visible = false;
    let previousScroll = window.scrollY;
    let lag = 0;
    const update = () => {
      frame = 0;
      if (!visible) return;
      const rect = layout.getBoundingClientRect();
      const progress = getViewportSceneProgress({
        top: rect.top,
        height: rect.height,
        viewportHeight: window.innerHeight,
      });
      const velocity = Math.max(-1, Math.min(1, (window.scrollY - previousScroll) / 42));
      lag += (velocity - lag) * 0.14;
      previousScroll = window.scrollY;
      layout.style.setProperty("--editorial-progress", progress.toFixed(4));
      layout.style.setProperty("--editorial-lag-up", `${(-lag * 18).toFixed(2)}px`);
      layout.style.setProperty("--editorial-lag-down", `${(lag * 12).toFixed(2)}px`);
      layout.style.setProperty("--editorial-lag-soft", `${(-lag * 10).toFixed(2)}px`);
      layout.style.setProperty("--editorial-lag-long", `${(lag * 18).toFixed(2)}px`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(layout);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [profile.ready, profile.reducedMotion]);

  return (
    <SelectedProject project={project} className="editorial-project">
      <div ref={layoutRef} className="editorial-layout">
        <figure className="editorial-layout__image editorial-layout__image--hero">
          <Image
            src={project.previewAssets[0].src}
            alt={project.previewAssets[0].alt}
            fill
            sizes="(max-width: 767px) 92vw, 58vw"
          />
        </figure>
        <figure className="editorial-layout__image editorial-layout__image--story">
          <Image
            src={project.previewAssets[1].src}
            alt={project.previewAssets[1].alt}
            fill
            sizes="(max-width: 767px) 68vw, 33vw"
          />
        </figure>
        <figure className="editorial-layout__image editorial-layout__image--menu">
          <Image
            src={project.previewAssets[2].src}
            alt={project.previewAssets[2].alt}
            fill
            sizes="(max-width: 767px) 75vw, 38vw"
          />
        </figure>
        <figure className="editorial-layout__image editorial-layout__image--mobile">
          <Image
            src={project.previewAssets[3].src}
            alt={project.previewAssets[3].alt}
            fill
            sizes="(max-width: 767px) 34vw, 16vw"
          />
        </figure>
        <p className="editorial-layout__caption">Coffee / Bistro / City refuge</p>
        <p className="editorial-layout__folio" aria-hidden="true">03</p>
      </div>
    </SelectedProject>
  );
}
