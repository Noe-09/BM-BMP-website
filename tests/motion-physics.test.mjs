import assert from "node:assert/strict";
import test from "node:test";

import {
  clamp01,
  damp,
  getActiveSceneIndex,
  getSceneProgress,
  resolveInteractionProfile,
} from "../lib/motion/physics.ts";

test("getActiveSceneIndex restores the latest scene above the viewport marker", () => {
  assert.equal(getActiveSceneIndex([120, 980], 450), 0);
  assert.equal(getActiveSceneIndex([-1600, -120], 450), 1);
  assert.equal(getActiveSceneIndex([700, 1600], 450), 0);
});

test("clamp01 prevents scroll progress from escaping its scene", () => {
  assert.equal(clamp01(-0.25), 0);
  assert.equal(clamp01(0.42), 0.42);
  assert.equal(clamp01(1.4), 1);
});

test("damp produces the same result for equivalent elapsed time", () => {
  const oneFrame = damp(0, 1, 8, 1 / 30);
  const halfFrame = damp(0, 1, 8, 1 / 60);
  const twoHalfFrames = damp(halfFrame, 1, 8, 1 / 60);

  assert.ok(Math.abs(oneFrame - twoHalfFrames) < 1e-12);
  assert.ok(oneFrame > 0 && oneFrame < 1);
});

test("getSceneProgress maps a sticky scene from its start to its exit", () => {
  const scene = { height: 1800, viewportHeight: 900 };

  assert.equal(getSceneProgress({ ...scene, top: 120 }), 0);
  assert.equal(getSceneProgress({ ...scene, top: -450 }), 0.5);
  assert.equal(getSceneProgress({ ...scene, top: -1200 }), 1);
});

test("reduced motion disables continuous motion even on a fine pointer", () => {
  assert.deepEqual(
    resolveInteractionProfile({
      finePointer: true,
      coarsePointer: false,
      reducedMotion: true,
    }),
    {
      pointer: "fine",
      reducedMotion: true,
      allowPointerDepth: false,
      allowAmbientMotion: false,
    },
  );
});

test("a coarse primary pointer never enables hover-dependent depth", () => {
  assert.deepEqual(
    resolveInteractionProfile({
      finePointer: true,
      coarsePointer: true,
      reducedMotion: false,
    }),
    {
      pointer: "coarse",
      reducedMotion: false,
      allowPointerDepth: false,
      allowAmbientMotion: true,
    },
  );
});
