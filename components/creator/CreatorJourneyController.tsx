"use client";

import { useEffect } from "react";

import { getCreatorJourneyState } from "@/lib/creator/journey";

type CreatorJourneyControllerProps = {
  worldSlugs: readonly string[];
};

export function CreatorJourneyController({
  worldSlugs,
}: CreatorJourneyControllerProps) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-creator-experience]");
    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>("[data-creator-chapter]"),
    );
    if (!root || chapters.length === 0) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousProgress = 0;
    let previousTime = performance.now();

    const update = () => {
      frame = 0;
      const now = performance.now();
      const first = chapters[0];
      const last = chapters[chapters.length - 1];
      const firstBounds = first.getBoundingClientRect();
      const lastBounds = last.getBoundingClientRect();
      const start = firstBounds.top + window.scrollY;
      const end = lastBounds.bottom + window.scrollY;
      const marker = window.scrollY + window.innerHeight * 0.5;
      const progress = end > start ? (marker - start) / (end - start) : 0;
      const state = getCreatorJourneyState({
        progress,
        previousProgress,
        elapsedMs: now - previousTime,
        worldSlugs,
        reducedMotion: motionQuery.matches,
      });

      let activeWorld = marker < start ? "arrival" : state.activeWorld;
      let activePortalProgress = 0;

      for (const chapter of chapters) {
        const bounds = chapter.getBoundingClientRect();
        const travel = Math.max(bounds.height + window.innerHeight, 1);
        const portalProgress = Math.min(
          1,
          Math.max(0, (window.innerHeight - bounds.top) / travel),
        );
        const presence = Math.max(0, 1 - Math.abs(portalProgress - 0.5) * 2);
        const portal = chapter.querySelector<HTMLElement>("[data-creator-world]");

        chapter.style.setProperty("--portal-progress", portalProgress.toFixed(4));
        chapter.style.setProperty("--portal-presence", presence.toFixed(4));
        portal?.style.setProperty("--portal-progress", portalProgress.toFixed(4));
        portal?.style.setProperty("--portal-presence", presence.toFixed(4));

        if (
          bounds.top <= window.innerHeight * 0.56 &&
          bounds.bottom > window.innerHeight * 0.44
        ) {
          activeWorld = chapter.dataset.creatorChapter ?? activeWorld;
          activePortalProgress = portalProgress;
        }
      }

      root.dataset.activeWorld = activeWorld ?? "arrival";
      root.dataset.direction = String(state.direction);
      root.dataset.reducedMotion = String(state.reducedMotion);
      root.style.setProperty(
        "--creator-progress",
        state.globalCreatorProgress.toFixed(4),
      );
      root.style.setProperty("--world-progress", activePortalProgress.toFixed(4));
      root.style.setProperty("--creator-velocity", state.velocity.toFixed(6));

      previousProgress = state.globalCreatorProgress;
      previousTime = now;
    };

    const queueUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
    motionQuery.addEventListener("change", queueUpdate);

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      motionQuery.removeEventListener("change", queueUpdate);
    };
  }, [worldSlugs]);

  return null;
}
