"use client";

import { useEffect, useState } from "react";

const BOOT_SESSION_KEY = "bmp-tech-boot-seen-v1";
const BOOT_STATES = ["SIGNAL", "ROUTE", "VERIFY", "ONLINE"] as const;

type BootState = (typeof BOOT_STATES)[number];

function hasSeenBoot() {
  try {
    return typeof window !== "undefined" && sessionStorage.getItem(BOOT_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markBootSeen() {
  try {
    sessionStorage.setItem(BOOT_SESSION_KEY, "1");
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

export function TechBoot() {
  const [state, setState] = useState<BootState>("SIGNAL");

  useEffect(() => {
    const experience = document.querySelector<HTMLElement>("[data-tech-experience]");

    if (!experience) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers: number[] = [];
    const complete = () => {
      setState("ONLINE");
      experience.dataset.techBoot = "complete";
      markBootSeen();
    };

    experience.dataset.techBoot = "active";

    if (reducedMotion.matches) {
      complete();
      return;
    }

    if (hasSeenBoot()) {
      setState("ONLINE");
      timers.push(window.setTimeout(complete, 160));
    } else {
      timers.push(window.setTimeout(() => setState("ROUTE"), 260));
      timers.push(window.setTimeout(() => setState("VERIFY"), 520));
      timers.push(window.setTimeout(() => setState("ONLINE"), 780));
      timers.push(window.setTimeout(complete, 1040));
    }

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div className="tech-boot" aria-hidden="true">
      <div className="tech-boot__topology">
        <span className="tech-boot__route tech-boot__route--vertical" />
        <span className="tech-boot__route tech-boot__route--horizontal" />
        <span className="tech-boot__node tech-boot__node--origin" />
        <span className="tech-boot__node tech-boot__node--signal" />
      </div>
      <p className="tech-boot__state">{state}</p>
      <p className="tech-boot__index">SYSTEM / 01</p>
    </div>
  );
}
