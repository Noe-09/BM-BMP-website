import assert from "node:assert/strict";
import test from "node:test";
import { createJourney, impulseJourney, stepJourney, seekJourney, autoplaySpeedMultiplier } from "../lib/gateway/journey/controller.ts";
import { deriveJourneyFrame } from "../lib/gateway/journey/chapterState.ts";
import { deriveHeroFraming } from "../lib/gateway/journey/framing.ts";
import { cinematicSpeedMultiplier, deriveCinematicFrame } from "../lib/gateway/journey/cinematicProfile.ts";

const advance = (state, seconds, start = 0, autoplay = true) => {
  for (let i = 1; i <= Math.round(seconds * 60); i++) {
    state = stepJourney(state, 1 / 60, start + i * 1000 / 60, autoplay);
  }
  return state;
};

const autoplayDurationTo = (target) => {
  let state = createJourney(), elapsed = 0;
  while (state.targetProgress < target && elapsed < 40) {
    elapsed += .001;
    state = stepJourney(state, .001, elapsed * 1000, true);
  }
  return elapsed;
};

test("autoplay accelerates the entrance and blends back by the midpoint", () => {
  assert.equal(autoplaySpeedMultiplier(0), 1.3);
  assert.ok(Math.abs(autoplaySpeedMultiplier(.25) - .988) < 1e-12);
  assert.ok(autoplaySpeedMultiplier(.44) > .83 && autoplaySpeedMultiplier(.44) < 1);
  assert.equal(autoplaySpeedMultiplier(.55), 1);
  assert.equal(autoplaySpeedMultiplier(.68), 1);
  assert.equal(autoplaySpeedMultiplier(.95), .9);

  assert.ok(Math.abs(autoplayDurationTo(.35) - 7.802) < .02);
  assert.ok(Math.abs(autoplayDurationTo(.55) - 12.292) < .02);
  assert.ok(advance(createJourney(), 4).targetProgress > .185);
});

test("speed ramps are bounded, continuous and independent of input gain in both directions", () => {
  for (const p of [0, .08, .1, .16, .18, .25, .34, .44, .46, .54, .58, .68, .78, .88, .90, 1]) {
    const speed = autoplaySpeedMultiplier(p);
    assert.ok(speed >= .9 && speed <= 1.3);
    assert.ok(Math.abs(autoplaySpeedMultiplier(p - 1e-7) - autoplaySpeedMultiplier(p + 1e-7)) < .00001);
    for (const pixels of [-100, 100]) {
      const impulse = impulseJourney(createJourney(p), pixels, 1000);
      assert.equal(impulse.targetProgress, Math.max(0, Math.min(1, p + pixels * .00075)));
      const immediate = stepJourney(impulse, 1 / 60, 1016, true);
      assert.equal(immediate.autoplayVelocity, 0);
      assert.equal(immediate.targetProgress, impulse.targetProgress);
      assert.equal(stepJourney(impulse, 1 / 60, 1850, true).autoplayVelocity, 0);
      const resumed = stepJourney(impulse, 1 / 60, 2750, true);
      const expected = impulse.targetProgress === 1 ? 0 : .055 * autoplaySpeedMultiplier(impulse.targetProgress) * cinematicSpeedMultiplier(impulse.targetProgress);
      assert.equal(resumed.autoplayVelocity, expected);
    }
  }
});

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
  assert.equal(reverse.targetProgress, 0.525);
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

test("cinematic autoplay creates the approved 20–30 percent longer authored arc", () => {
  const stops = [[0, .70], [.15, .74], [.35, .78], [.55, .86], [.72, 1], [.80, 1], [.90, .64], [1, .58]];
  for (const [progress, expected] of stops) assert.equal(cinematicSpeedMultiplier(progress), expected);

  let state = createJourney(), elapsed = 0;
  while (state.targetProgress < 1 && elapsed < 40) {
    elapsed += .001;
    state = stepJourney(state, .001, elapsed * 1000, true);
  }
  assert.ok(Math.abs(elapsed - 22.85) < .02, `cinematic target duration ${elapsed}`);
});

test("autoplay progression remains deterministic", () => {
  const first = advance(createJourney(), 12);
  const second = advance(createJourney(), 12);
  assert.deepEqual(second, first);
});

test("cinematic events and optical energy reconstruct solely from normalized progress", () => {
  const points = [0, .08, .15, .16, .25, .26, .34, .35, .36, .44, .46, .55, .58, .60, .68, .72, .75, .78, .80, .82, .90, .91, .98, 1];
  const expected = points.map(deriveCinematicFrame);
  for (let i = points.length - 1; i >= 0; i--) assert.deepEqual(deriveCinematicFrame(points[i]), expected[i]);
  for (const index of [8, 1, 17, 4, 22, 0, 15]) assert.deepEqual(deriveCinematicFrame(points[index]), expected[index]);

  assert.equal(deriveCinematicFrame(.26).reveal, 0);
  assert.equal(deriveCinematicFrame(.36).reveal, 1);
  assert.equal(deriveCinematicFrame(.44).reveal, 0);
  assert.equal(deriveCinematicFrame(.60).coreEvent, 0);
  assert.equal(deriveCinematicFrame(.75).coreEvent, 1);
  assert.equal(deriveCinematicFrame(.82).coreEvent, 0);
  assert.equal(deriveCinematicFrame(.80).release, 0);
  assert.equal(deriveCinematicFrame(.98).release, 1);
  assert.equal(deriveCinematicFrame(.75).opticalEnergy, 1);
  assert.ok(deriveCinematicFrame(.90).opticalEnergy < deriveCinematicFrame(.75).opticalEnergy);
});

test("cinematic curves remain bounded and continuous at every authored boundary", () => {
  for (const p of [0, .15, .26, .35, .36, .44, .55, .60, .72, .75, .80, .82, .90, .98, 1]) {
    const frame = deriveCinematicFrame(p);
    for (const value of Object.values(frame)) assert.ok(Number.isFinite(value) && value >= 0 && value <= 1, `${p}: ${value}`);
    const before = deriveCinematicFrame(p - 1e-7), after = deriveCinematicFrame(p + 1e-7);
    for (const key of Object.keys(frame)) assert.ok(Math.abs(before[key] - after[key]) < .00001, `${p}: ${key}`);
    assert.ok(Math.abs(cinematicSpeedMultiplier(p - 1e-7) - cinematicSpeedMultiplier(p + 1e-7)) < .00001, `${p}: speed`);
  }
});

test("cinematic depth follows light to deep to high-contrast core to light", () => {
  assert.equal(deriveCinematicFrame(0).backgroundDepth, 0);
  assert.ok(deriveCinematicFrame(.68).backgroundDepth > .5);
  assert.ok(deriveCinematicFrame(.75).backgroundDepth > deriveCinematicFrame(.46).backgroundDepth);
  assert.ok(deriveCinematicFrame(.91).backgroundDepth < deriveCinematicFrame(.75).backgroundDepth);
  assert.equal(deriveCinematicFrame(1).backgroundDepth, 0);
});
