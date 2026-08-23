"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { SelectedProject } from "@/components/work/SelectedProject";
import type { SelectedProject as Project } from "@/lib/projects/selected-work";
import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";
import { getDragScrubProgress, getScrubIndex } from "@/lib/work/interaction";

type LookbookProjectProps = { project: Project };

export function LookbookProject({ project }: LookbookProjectProps) {
  const profile = useInteractionProfile();
  const sceneRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, startProgress: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  const setProgress = (progress: number) => {
    progressRef.current = Math.min(1, Math.max(0, progress));
    setActiveIndex(getScrubIndex(progressRef.current, project.previewAssets.length));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scene = sceneRef.current;
    if (!scene || profile.reducedMotion) return;
    const rect = scene.getBoundingClientRect();

    if (dragRef.current.active) {
      setProgress(
        getDragScrubProgress(
          dragRef.current.startProgress,
          event.clientX - dragRef.current.startX,
          rect.width,
        ),
      );
    } else if (profile.allowPointerDepth) {
      setProgress((event.clientX - rect.left) / Math.max(1, rect.width));
    }

    const x = ((event.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
    const y = ((event.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    scene.style.setProperty("--lookbook-x", `${(x * 12).toFixed(2)}px`);
    scene.style.setProperty("--lookbook-y", `${(y * 8).toFixed(2)}px`);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (profile.reducedMotion) return;
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startProgress: progressRef.current,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (profile.reducedMotion) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.min(
      project.previewAssets.length - 1,
      Math.max(0, activeIndex + direction),
    );
    setProgress(nextIndex / project.previewAssets.length + 0.001);
  };

  return (
    <SelectedProject project={project} className="lookbook-project">
      <div
        ref={sceneRef}
        className="lookbook"
        data-cursor="explore"
        data-cursor-label={project.cursorLabel}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onPointerLeave={(event) => {
          handlePointerEnd(event);
          event.currentTarget.style.setProperty("--lookbook-x", "0px");
          event.currentTarget.style.setProperty("--lookbook-y", "0px");
        }}
        onKeyDown={handleKeyDown}
        role="group"
        tabIndex={profile.reducedMotion ? -1 : 0}
        aria-label={
          profile.reducedMotion
            ? "Fabriclism digital lookbook campaign view."
            : "Fabriclism digital lookbook. Drag, move the pointer, or use left and right arrow keys to explore five views."
        }
      >
        <div className="lookbook__campaign" aria-hidden="true">
          <Image
            src={project.previewAssets[0].src}
            alt=""
            fill
            sizes="100vw"
            className="lookbook__campaign-image"
          />
        </div>

        <div className="lookbook__viewport" data-project-transition-source={project.slug}>
          {project.previewAssets.map((asset, index) => (
            <figure
              className="lookbook__frame"
              data-active={index === activeIndex ? "true" : "false"}
              aria-hidden={index !== activeIndex}
              key={asset.label}
            >
              <Image
                src={asset.src}
                alt={index === activeIndex ? asset.alt : ""}
                fill
                sizes="(max-width: 767px) 86vw, 64vw"
                className="lookbook__image"
              />
            </figure>
          ))}
          <span className="lookbook__frame-label" aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} / {project.previewAssets[activeIndex].label}
          </span>
        </div>

        <div className="lookbook__scrub" aria-hidden="true">
          <span>01</span>
          <ol>
            {project.previewAssets.map((asset, index) => (
              <li data-active={index === activeIndex ? "true" : "false"} key={asset.label} />
            ))}
          </ol>
          <span>05</span>
        </div>

        <p className="lookbook__instruction">
          <span className="bm-only-fine">Move horizontally to scrub</span>
          <span className="bm-only-coarse">Swipe to scrub</span>
        </p>
      </div>
    </SelectedProject>
  );
}
