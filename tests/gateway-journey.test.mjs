import assert from "node:assert/strict";
import test from "node:test";
import { createJourney, impulseJourney, stepJourney, seekJourney } from "../lib/gateway/journey/controller.ts";
import { deriveJourneyFrame } from "../lib/gateway/journey/chapterState.ts";
import { deriveHeroFraming } from "../lib/gateway/journey/framing.ts";

const advance = (state, seconds, start = 0, autoplay = true) => {
  for (let i = 1; i <= Math.round(seconds * 60); i++) {
    state = stepJourney(state, 1 / 60, start + i * 1000 / 60, autoplay);
  }
  return state;
};

test("idle autoplay carries the entire journey to an exactly paused endpoint", () => {
  const moving = advance(createJourney(), 4);
  assert.ok(moving.renderProgress > 0.1);
  const end = advance(moving, 30, 4000);
  assert.equal(end.renderProgress, 1);
  assert.equal(end.targetProgress, 1);
  assert.equal(end.autoplayVelocity, 0);
  assert.deepEqual(advance(end, 10, 34000), end);
});

test("reverse cancels a buffered forward target and suppresses autoplay", () => {
  const buffered = { ...createJourney(0.6), targetProgress: 0.9 };
  const reverse = impulseJourney(buffered, -100, 1000);
  assert.ok(reverse.targetProgress < 0.6);
  const moved = advance(reverse, 0.8, 1000);
  assert.ok(moved.renderProgress < 0.6);
  assert.equal(moved.autoplayVelocity, 0);
  const ramp = stepJourney(moved, 1 / 60, 2200, true);
  assert.ok(ramp.autoplayVelocity > 0 && ramp.autoplayVelocity < 0.055);
  const resumed = advance(ramp, 2, 2200);
  assert.ok(resumed.renderProgress > moved.renderProgress);
});

test("rewind leaves the final chamber and can return without resetting the journey", () => {
  const rewound = advance(impulseJourney(createJourney(1), -180, 0), 0.5);
  assert.ok(rewound.renderProgress < 0.95);
  const final = advance(rewound, 10, 500);
  assert.equal(final.renderProgress, 1);
});

test("input clamps, disabled autoplay holds, and seeking is cancelled by reverse", () => {
  assert.equal(impulseJourney(createJourney(), -10000, 0).targetProgress, 0);
  assert.equal(impulseJourney(createJourney(1), 10000, 0).targetProgress, 1);
  assert.deepEqual(advance(createJourney(0.4), 3, 0, false), createJourney(0.4));
  const seek = seekJourney(createJourney(0.4), 1, 0, 800);
  const halfway = stepJourney(seek, 0.05, 400, true);
  assert.ok(Math.abs(halfway.renderProgress - 0.7) < 1e-8);
  assert.equal(stepJourney(seek, 0.05, 800, true).renderProgress, 1);
  const reversed = impulseJourney(halfway, -100, 400);
  assert.equal(reversed.seek, null);
  assert.ok(reversed.targetProgress < halfway.renderProgress);
});

test("chapter frames reconstruct after arbitrary forward and reverse sampling", () => {
  const points = [0, .08, .16, .25, .34, .46, .58, .68, .78, .90, 1];
  const expectedChapters = ["origin", "origin", "formation", "formation", "passage", "passage", "core", "core", "emergence", "emergence", "emergence"];
  const frames = points.map(p => deriveJourneyFrame(p));
  assert.deepEqual(frames.map(f => f.chapter), expectedChapters);
  for (let i = points.length - 1; i >= 0; i--) assert.deepEqual(deriveJourneyFrame(points[i]), frames[i]);
  for (const frame of frames) {
    for (const value of Object.values(frame)) if (typeof value === "number") assert.ok(Number.isFinite(value));
    assert.ok(Math.abs(frame.driftX) <= .35);
    assert.ok(Math.abs(frame.driftY) <= .2);
  }
  assert.equal(deriveJourneyFrame(.78).emergence, 0);
  assert.equal(deriveJourneyFrame(1).emergence, 1);
  assert.ok(deriveJourneyFrame(.68).core > .8);
  assert.equal(deriveJourneyFrame(1).opening, 1);
});

test("chapter boundaries have no numeric discontinuities", () => {
  for (const p of [.16, .34, .58, .78, .96]) {
    const before = deriveJourneyFrame(p - 1e-7);
    const after = deriveJourneyFrame(p + 1e-7);
    for (const key of Object.keys(before)) if (typeof before[key] === "number") {
      assert.ok(Math.abs(before[key] - after[key]) < .0001, `${p}: ${key}`);
    }
  }
});

test("responsive framing keeps both heroes in front of the chamber at a constant depth", () => {
  for (const aspect of [390 / 844, 768 / 1024, 1280 / 720, 1920 / 1080]) {
    for (const cameraZ of [-18, -8]) {
      const framing = deriveHeroFraming(cameraZ, aspect);
      assert.ok(Math.abs(cameraZ - (-26 * framing.scale + framing.z) - 12) < 1e-8);
      // Existing neutral pair spans approximately +/-6m; perspective FOV is 46 degrees.
      const halfWidth = 12 * Math.tan(23 * Math.PI / 180) * aspect;
      assert.ok(6 * framing.scale < halfWidth);
    }
  }
});
