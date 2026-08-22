"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { getActiveSceneIndex } from "@/lib/motion/physics";

export function SceneThemeController() {
  const pathname = usePathname();

  useEffect(() => {
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene-theme]"),
    );
    if (!scenes.length) {
      document.documentElement.dataset.bmTheme = "graphite";
      return;
    }

    const applyTheme = (scene: HTMLElement) => {
      const theme = scene.dataset.sceneTheme;
      if (theme) document.documentElement.dataset.bmTheme = theme;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (active) applyTheme(active.target as HTMLElement);
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.01] },
    );

    scenes.forEach((scene) => observer.observe(scene));
    const applyThemeAtViewport = () => {
      const activeIndex = getActiveSceneIndex(
        scenes.map((scene) => scene.getBoundingClientRect().top),
        window.innerHeight * 0.5,
      );
      applyTheme(scenes[activeIndex]);
    };

    let frame = 0;
    const scheduleThemeUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        applyThemeAtViewport();
      });
    };

    applyThemeAtViewport();
    scheduleThemeUpdate();
    window.addEventListener("scroll", scheduleThemeUpdate, { passive: true });
    window.addEventListener("resize", scheduleThemeUpdate, { passive: true });
    window.addEventListener("hashchange", applyThemeAtViewport);
    window.addEventListener("pageshow", applyThemeAtViewport);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleThemeUpdate);
      window.removeEventListener("resize", scheduleThemeUpdate);
      window.removeEventListener("hashchange", applyThemeAtViewport);
      window.removeEventListener("pageshow", applyThemeAtViewport);
    };
  }, [pathname]);

  return null;
}
