import assert from "node:assert/strict";
import test from "node:test";

import {
  clampCreatorProgress,
  getCreatorDirection,
  getCreatorJourneyState,
  getCreatorWorldProgress,
} from "../lib/creator/journey.ts";

const slugs = ["weins", "slyour", "the-xide", "pawsona", "relationship", "miner"];

test("Creator progress clamps to the normalized journey", () => {
  assert.equal(clampCreatorProgress(-0.4), 0);
  assert.equal(clampCreatorProgress(0.375), 0.375);
  assert.equal(clampCreatorProgress(1.8), 1);
  assert.equal(clampCreatorProgress(Number.NaN), 0);
});

test("Creator progress maps every transition to the entering world", () => {
  const epsilon = 0.000001;
  const boundaries = [
    { progress: 0, activeIndex: 0, local: 0 },
    { progress: 1 / 6 - epsilon, activeIndex: 0 },
    { progress: 1 / 6, activeIndex: 1, local: 0 },
    { progress: 2 / 6, activeIndex: 2, local: 0 },
    { progress: 3 / 6, activeIndex: 3, local: 0 },
    { progress: 4 / 6, activeIndex: 4, local: 0 },
    { progress: 5 / 6, activeIndex: 5, local: 0 },
    { progress: 1, activeIndex: 5, local: 1 },
  ];

  for (const boundary of boundaries) {
    const result = getCreatorWorldProgress(boundary.progress, 6);
    assert.equal(result.activeIndex, boundary.activeIndex);
    if (boundary.local !== undefined) {
      assert.ok(Math.abs(result.worldProgress - boundary.local) < epsilon);
    }
  }
});

test("Creator local progress remains normalized during fast jumps", () => {
  assert.deepEqual(getCreatorWorldProgress(0, 6), {
    activeIndex: 0,
    worldProgress: 0,
  });
  assert.deepEqual(getCreatorWorldProgress(0.5, 6), {
    activeIndex: 3,
    worldProgress: 0,
  });
  assert.deepEqual(getCreatorWorldProgress(1, 6), {
    activeIndex: 5,
    worldProgress: 1,
  });
  assert.deepEqual(getCreatorWorldProgress(0.75, 0), {
    activeIndex: -1,
    worldProgress: 0,
  });
});

test("Creator direction follows current movement in both directions", () => {
  assert.equal(getCreatorDirection(0.7, 0.4), -1);
  assert.equal(getCreatorDirection(0.4, 0.7), 1);
  assert.equal(getCreatorDirection(0.4, 0.4), 0);
});

test("Creator journey state derives world, velocity, and reduced motion", () => {
  assert.deepEqual(
    getCreatorJourneyState({
      progress: 0.4,
      previousProgress: 0.2,
      elapsedMs: 100,
      worldSlugs: slugs,
      reducedMotion: true,
    }),
    {
      globalCreatorProgress: 0.4,
      activeWorld: "the-xide",
      worldProgress: 0.40000000000000036,
      direction: 1,
      velocity: 0.002,
      reducedMotion: true,
    },
  );

  assert.equal(
    getCreatorJourneyState({
      progress: 0.2,
      previousProgress: 0.5,
      elapsedMs: 0,
      worldSlugs: slugs,
      reducedMotion: false,
    }).velocity,
    0,
  );
});
