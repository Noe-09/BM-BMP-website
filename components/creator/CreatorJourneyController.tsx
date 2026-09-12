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
    const worlds = Array.from(
      document.querySelectorAll<HTMLElement>("[data-creator-world]"),
    );
    if (!root || worlds.length === 0) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousProgress = 0;
    let previousTime = performance.now();

    const update = () => {
      frame = 0;
      const now = performance.now();
      const first = worlds[0];
      const last = worlds[worlds.length - 1];
      const start = first.offsetTop;
      const end = last.offsetTop + last.offsetHeight;
      const marker = window.scrollY + window.innerHeight * 0.5;
      const progress = end > start ? (marker - start) / (end - start) : 0;
      const state = getCreatorJourneyState({
        progress,
        previousProgress,
        elapsedMs: now - previousTime,
        worldSlugs,
        reducedMotion: motionQuery.matches,
      });

      root.dataset.activeWorld = state.activeWorld ?? "arrival";
      root.dataset.direction = String(state.direction);
      root.dataset.reducedMotion = String(state.reducedMotion);
      root.style.setProperty(
        "--creator-progress",
        state.globalCreatorProgress.toFixed(4),
      );
      root.style.setProperty("--world-progress", state.worldProgress.toFixed(4));
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
