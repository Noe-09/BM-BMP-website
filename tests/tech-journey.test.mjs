import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getAnchoredTechPhase } from "../lib/tech/journey.ts";

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
  assert.match(controller, /--tech-visual-phase-progress/);
  assert.match(controller, /getAnchoredTechPhase/);
  assert.match(controller, /removeEventListener/);
  assert.match(controller, /cancelAnimationFrame/);

  assert.match(journey, /export const TECH_PHASES/);
  assert.match(journey, /export function dampTechProgress/);
  assert.match(journey, /export function getTechPhase/);

  assert.doesNotMatch(controller, /\bwheel\b|scrollTo|scrollIntoView/);
});

test("Tech semantic phases follow ordered anchor geometry rather than equal page bands", () => {
  const anchors = [
    { phase: "observe", position: 160 },
    { phase: "ingest", position: 840 },
    { phase: "normalize", position: 1480 },
    { phase: "checkpoint", position: 3220 },
    { phase: "return", position: 4760 },
    { phase: "state", position: 5480 },
    { phase: "close", position: 9100 },
  ];

  assert.deepEqual(getAnchoredTechPhase(anchors, 160), {
    phase: "observe",
    phaseProgress: 0,
  });
  assert.deepEqual(getAnchoredTechPhase(anchors, 3220), {
    phase: "checkpoint",
    phaseProgress: 0,
  });
  assert.equal(getAnchoredTechPhase(anchors, 4760).phase, "return");
  assert.equal(getAnchoredTechPhase(anchors, 4000).phase, "checkpoint");
});

test("Tech journey anchors and rendered motion are explicit in the source contract", async () => {
  const [observatory, state, spectrum, register, closing, topology, css] = await Promise.all([
    read("components/tech/SystemObservatory.tsx"),
    read("components/tech/SystemState.tsx"),
    read("components/tech/SystemSpectrum.tsx"),
    read("components/tech/SystemsRegister.tsx"),
    read("components/tech/TechClosing.tsx"),
    read("components/tech/SystemTopology.tsx"),
    read("app/bm-tech/tech.css"),
  ]);

  for (const phase of ["observe", "ingest", "normalize", "orchestrate", "assist", "checkpoint", "execute", "return"]) {
    assert.match(observatory, new RegExp(`data-tech-phase-anchor="${phase}"`));
  }
  for (const [source, phase] of [[state, "state"], [spectrum, "spectrum"], [register, "register"], [closing, "close"]]) {
    assert.match(source, new RegExp(`data-tech-phase-anchor="${phase}"`));
  }
  assert.match(topology, /transform="rotate\(45\)"/);
  assert.doesNotMatch(css, /tech-topology__node\[data-node-type="checkpoint"\] rect[\s\S]{0,180}transform: rotate/);
  assert.match(css, /--tech-visual-phase-progress/);
  assert.match(css, /--tech-visual-progress/);
  assert.match(css, /stroke-dashoffset:\s*0\s*!important/);
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
