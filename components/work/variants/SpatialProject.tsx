"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { SelectedProject } from "@/components/work/SelectedProject";
import type { SelectedProject as Project } from "@/lib/projects/selected-work";
import { clamp01 } from "@/lib/motion/physics";
import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";
import { getViewportSceneProgress } from "@/lib/work/interaction";

type SpatialProjectProps = { project: Project };

export function SpatialProject({ project }: SpatialProjectProps) {
  const profile = useInteractionProfile();
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack || !profile.ready) return;

    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (!visible) return;
      const rect = stack.getBoundingClientRect();
      const progress = profile.reducedMotion
        ? 1
        : getViewportSceneProgress({
            top: rect.top,
            height: rect.height,
            viewportHeight: window.innerHeight,
          });
      const collapse = clamp01((progress - 0.18) / 0.58);
      stack.style.setProperty("--spatial-collapse", collapse.toFixed(4));
      stack.style.setProperty(
        "--spatial-spread-x",
        `${((1 - collapse) * 8.5).toFixed(3)}vw`,
      );
      stack.style.setProperty(
        "--spatial-spread-y",
        `${((1 - collapse) * 6.5).toFixed(3)}vh`,
      );
      stack.style.setProperty("--spatial-scale", (0.94 + collapse * 0.06).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
    });
    observer.observe(stack);
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
    <SelectedProject project={project} className="spatial-project">
      <div
        ref={stackRef}
        className="spatial-stack"
        data-cursor="view"
        data-cursor-label={project.cursorLabel}
        onPointerMove={(event) => {
          if (!profile.allowPointerDepth) return;
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
          const y = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
          event.currentTarget.style.setProperty("--spatial-x", `${(x * 8).toFixed(2)}px`);
          event.currentTarget.style.setProperty("--spatial-y", `${(y * 6).toFixed(2)}px`);
        }}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty("--spatial-x", "0px");
          event.currentTarget.style.setProperty("--spatial-y", "0px");
        }}
      >
        <div className="spatial-stack__grid" aria-hidden="true" />
        {project.previewAssets.map((asset, index) => (
          <figure className={`spatial-stack__plane spatial-stack__plane--${index + 1}`} key={asset.src}>
            <Image
              src={asset.src}
              alt={asset.alt}
              fill
              sizes="(max-width: 767px) 82vw, 58vw"
            />
          </figure>
        ))}
        <div className="spatial-stack__technical" aria-hidden="true">
          <span>LAB / 04</span>
          <span>SPECIMEN FIELD</span>
          <span>OPTICAL STATUS / ACTIVE</span>
        </div>
      </div>
    </SelectedProject>
  );
}
