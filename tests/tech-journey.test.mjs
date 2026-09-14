import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Tech uses one passive native-scroll controller with damped rendered progress", async () => {
  const controller = await read("components/tech/TechJourneyController.tsx");
  const journey = await read("lib/tech/journey.ts");

  assert.match(controller, /^"use client";/);
  assert.match(controller, /passive:\s*true/);
  assert.match(controller, /requestAnimationFrame/);
  assert.match(controller, /prefers-reduced-motion/);
  assert.match(controller, /--tech-progress/);
  assert.match(controller, /--tech-phase-progress/);
  assert.match(controller, /--tech-visual-progress/);
  assert.match(controller, /removeEventListener/);
  assert.match(controller, /cancelAnimationFrame/);

  assert.match(journey, /export const TECH_PHASES/);
  assert.match(journey, /export function dampTechProgress/);
  assert.match(journey, /export function getTechPhase/);

  assert.doesNotMatch(controller, /\bwheel\b|scrollTo|scrollIntoView/);
});

test("Tech boot is short, session-aware, reduced-motion-aware, and non-blocking", async () => {
  const boot = await read("components/tech/TechBoot.tsx");
  const experience = await read("components/tech/TechExperience.tsx");
  const css = await read("app/bm-tech/tech.css");

  assert.match(boot, /bmp-tech-boot-seen-v1/);
  assert.match(boot, /sessionStorage/);
  assert.match(boot, /prefers-reduced-motion/);
  assert.match(boot, /SIGNAL/);
  assert.match(boot, /ROUTE/);
  assert.match(boot, /VERIFY/);
  assert.match(boot, /ONLINE/);
  assert.match(experience, /<TechBoot/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /--tech-topology-y:\s*var\(--tech-route-offset\)/);
  assert.doesNotMatch(css, /--tech-topology-y:\s*42%/);
  assert.doesNotMatch(boot, /setTimeout\([^,]+,\s*(?:[2-9]\d{3}|\d{5,})/);
});

test("Tech boot defers its return-session display-state update", async () => {
  const boot = await read("components/tech/TechBoot.tsx");

  assert.doesNotMatch(boot, /if \(hasSeenBoot\(\)\) \{\s*setState\("ONLINE"\)/);
});
