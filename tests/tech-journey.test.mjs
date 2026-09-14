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
