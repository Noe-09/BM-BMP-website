"use client";

import { useEffect } from "react";

import {
  dampCreatorVisualProgress,
  getCreatorJourneyState,
  getCreatorPresenceState,
} from "@/lib/creator/journey";

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
    const arrival = document.querySelector<HTMLElement>(
      '[data-creator-stage="00-arrival"]',
    );
    if (!root || !arrival || chapters.length === 0) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previousProgress = 0;
    let previousTime = performance.now();
    let renderedArrivalProgress = Number.NaN;
    const renderedProgress = chapters.map(() => Number.NaN);

    const update = (frameTime = performance.now()) => {
      frame = 0;
      const elapsedMs = Math.min(Math.max(frameTime - previousTime, 0), 64);
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
        elapsedMs,
        worldSlugs,
        reducedMotion: motionQuery.matches,
      });

      let activeWorld = marker < start ? "arrival" : state.activeWorld;
      let activePortalProgress = 0;
      const arrivalBounds = arrival.getBoundingClientRect();
      const arrivalTravel = Math.max(
        arrivalBounds.height - window.innerHeight,
        1,
      );
      const targetArrivalProgress = Math.min(
        1,
        Math.max(0, -arrivalBounds.top / arrivalTravel),
      );
      const arrivalVisual = dampCreatorVisualProgress(
        renderedArrivalProgress,
        targetArrivalProgress,
        elapsedMs,
        { reducedMotion: motionQuery.matches },
      );
      renderedArrivalProgress = arrivalVisual.value;
      arrival.style.setProperty(
        "--arrival-target-progress",
        targetArrivalProgress.toFixed(4),
      );
      arrival.style.setProperty(
        "--arrival-progress",
        arrivalVisual.value.toFixed(4),
      );
      let settled = arrivalVisual.settled;

      chapters.forEach((chapter, index) => {
        const bounds = chapter.getBoundingClientRect();
        const travel = Math.max(bounds.height + window.innerHeight, 1);
        const targetPortalProgress = Math.min(
          1,
          Math.max(0, (window.innerHeight - bounds.top) / travel),
        );
        const visual = dampCreatorVisualProgress(
          renderedProgress[index],
          targetPortalProgress,
          elapsedMs,
          { reducedMotion: motionQuery.matches },
        );
        const presenceState = getCreatorPresenceState(visual.value);
        const portal = chapter.querySelector<HTMLElement>("[data-creator-world]");

        renderedProgress[index] = visual.value;
        settled = settled && visual.settled;
        chapter.style.setProperty(
          "--portal-target-progress",
          targetPortalProgress.toFixed(4),
        );
        chapter.style.setProperty("--portal-progress", visual.value.toFixed(4));
        chapter.style.setProperty(
          "--portal-frame-progress",
          presenceState.frameProgress.toFixed(4),
        );
        chapter.style.setProperty(
          "--portal-presence",
          presenceState.presence.toFixed(4),
        );
        portal?.style.setProperty(
          "--portal-target-progress",
          targetPortalProgress.toFixed(4),
        );
        portal?.style.setProperty("--portal-progress", visual.value.toFixed(4));
        portal?.style.setProperty(
          "--portal-frame-progress",
          presenceState.frameProgress.toFixed(4),
        );
        portal?.style.setProperty(
          "--portal-presence",
          presenceState.presence.toFixed(4),
        );

        if (
          bounds.top <= window.innerHeight * 0.56 &&
          bounds.bottom > window.innerHeight * 0.44
        ) {
          activeWorld = chapter.dataset.creatorChapter ?? activeWorld;
          activePortalProgress = targetPortalProgress;
        }
      });

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
      previousTime = frameTime;

      if (!settled) frame = window.requestAnimationFrame(update);
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
