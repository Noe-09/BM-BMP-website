"use client";

import { useEffect } from "react";

import {
  clamp01,
  dampTechProgress,
  getTechPhase,
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
    let previousRawProgress = rawProgress;
    let lastFrameTime = 0;
    let frameId: number | null = null;

    const writeVisualProgress = () => {
      experience.style.setProperty("--tech-visual-progress", String(visualProgress));
    };

    const writeRawState = () => {
      rawProgress = getJourneyProgress(experience);
      const { phase, phaseProgress } = getTechPhase(rawProgress);
      const direction = Math.sign(rawProgress - previousRawProgress);

      experience.dataset.techPhase = phase;
      experience.dataset.techDirection = String(direction);
      experience.style.setProperty("--tech-progress", String(rawProgress));
      experience.style.setProperty("--tech-phase-progress", String(phaseProgress));
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
      writeVisualProgress();

      if (Math.abs(rawProgress - visualProgress) <= SETTLED_EPSILON) {
        visualProgress = rawProgress;
        writeVisualProgress();
        frameId = null;
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    const scheduleVisualUpdate = () => {
      if (reducedMotion.matches) {
        visualProgress = rawProgress;
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
