"use client";

import { useEffect } from "react";

import {
  clamp01,
  dampTechProgress,
  getAnchoredTechPhase,
} from "@/lib/tech/journey";

const SETTLED_EPSILON = 0.0005;

function getJourneyProgress(experience: HTMLElement) {
  const rect = experience.getBoundingClientRect();
  const journeyRange = Math.max(1, experience.scrollHeight - window.innerHeight);

  return clamp01(-rect.top / journeyRange);
}

export function TechJourneyController() {
  useEffect(() => {
    const experience = document.querySelector<HTMLElement>(
      "[data-tech-experience]",
    );

    if (!experience) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let rawProgress = getJourneyProgress(experience);
    let visualProgress = rawProgress;
    let rawPhaseProgress = 0;
    let visualPhaseProgress = rawPhaseProgress;
    let visualPhase = experience.dataset.techPhase ?? "observe";
    let previousRawProgress = rawProgress;
    let lastFrameTime = 0;
    let frameId: number | null = null;

    const writeVisualProgress = () => {
      experience.style.setProperty("--tech-visual-progress", String(visualProgress));
      experience.style.setProperty("--tech-visual-phase-progress", String(visualPhaseProgress));
    };

    const writeRawState = () => {
      rawProgress = getJourneyProgress(experience);
      const anchors = Array.from(
        experience.querySelectorAll<HTMLElement>("[data-tech-phase-anchor]"),
        (anchor) => ({
          phase: anchor.dataset.techPhaseAnchor,
          position: anchor.getBoundingClientRect().top + window.scrollY,
        }),
      ).filter(
        (anchor): anchor is { phase: Parameters<typeof getAnchoredTechPhase>[0][number]["phase"]; position: number } =>
          Boolean(anchor.phase),
      );
      const { phase, phaseProgress } = getAnchoredTechPhase(
        anchors,
        window.scrollY + window.innerHeight * 0.2,
      );
      const direction = Math.sign(rawProgress - previousRawProgress);

      if (phase !== visualPhase) {
        visualPhase = phase;
        visualPhaseProgress = phaseProgress;
      }

      experience.dataset.techPhase = phase;
      experience.dataset.techDirection = String(direction);
      experience.style.setProperty("--tech-progress", String(rawProgress));
      experience.style.setProperty("--tech-phase-progress", String(phaseProgress));
      rawPhaseProgress = phaseProgress;
      previousRawProgress = rawProgress;
    };

    const cancelFrame = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const tick = (frameTime: number) => {
      const deltaSeconds = lastFrameTime
        ? (frameTime - lastFrameTime) / 1000
        : 0;
      lastFrameTime = frameTime;
      visualProgress = dampTechProgress(
        visualProgress,
        rawProgress,
        deltaSeconds,
      );
      visualPhaseProgress = dampTechProgress(
        visualPhaseProgress,
        rawPhaseProgress,
        deltaSeconds,
      );
      writeVisualProgress();

      if (
        Math.abs(rawProgress - visualProgress) <= SETTLED_EPSILON &&
        Math.abs(rawPhaseProgress - visualPhaseProgress) <= SETTLED_EPSILON
      ) {
        visualProgress = rawProgress;
        visualPhaseProgress = rawPhaseProgress;
        writeVisualProgress();
        frameId = null;
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    const scheduleVisualUpdate = () => {
      if (reducedMotion.matches) {
        visualProgress = rawProgress;
        visualPhaseProgress = rawPhaseProgress;
        writeVisualProgress();
        cancelFrame();
        return;
      }

      if (frameId === null) {
        lastFrameTime = 0;
        frameId = requestAnimationFrame(tick);
      }
    };

    const handleInput = () => {
      writeRawState();
      scheduleVisualUpdate();
    };

    const handleMotionChange = () => {
      handleInput();
    };

    writeRawState();
    writeVisualProgress();
    window.addEventListener("scroll", handleInput, { passive: true });
    window.addEventListener("resize", handleInput, { passive: true });
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("scroll", handleInput);
      window.removeEventListener("resize", handleInput);
      reducedMotion.removeEventListener("change", handleMotionChange);
      cancelFrame();
    };
  }, []);

  return null;
}
