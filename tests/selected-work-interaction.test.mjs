import assert from "node:assert/strict";
import test from "node:test";

import {
  getDragScrubProgress,
  getScrubIndex,
  getViewportSceneProgress,
  shouldEnhanceProjectNavigation,
} from "../lib/work/interaction.ts";

test("getScrubIndex maps a normalized pointer position across every lookbook state", () => {
  assert.equal(getScrubIndex(-0.2, 5), 0);
  assert.equal(getScrubIndex(0.19, 5), 0);
  assert.equal(getScrubIndex(0.2, 5), 1);
  assert.equal(getScrubIndex(0.8, 5), 4);
  assert.equal(getScrubIndex(1.4, 5), 4);
});

test("getDragScrubProgress preserves the starting state and clamps the swipe", () => {
  assert.equal(getDragScrubProgress(0.5, 60, 300), 0.3);
  assert.equal(getDragScrubProgress(0.1, 240, 300), 0);
  assert.equal(getDragScrubProgress(0.9, -240, 300), 1);
});

test("getViewportSceneProgress covers entry, ownership, and exit without escaping", () => {
  const scene = { height: 900, viewportHeight: 900 };

  assert.equal(getViewportSceneProgress({ ...scene, top: 900 }), 0);
  assert.equal(getViewportSceneProgress({ ...scene, top: 0 }), 0.5);
  assert.equal(getViewportSceneProgress({ ...scene, top: -900 }), 1);
  assert.equal(getViewportSceneProgress({ ...scene, top: -1500 }), 1);
});

const primaryNavigation = {
  button: 0,
  detail: 1,
  defaultPrevented: false,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  target: undefined,
  download: false,
  reducedMotion: false,
};

test("project transition enhances only an ordinary primary-pointer navigation", () => {
  assert.equal(shouldEnhanceProjectNavigation(primaryNavigation), true);
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, button: 1 }), false);
});

test("project transition preserves modified and explicit new-context navigation", () => {
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, metaKey: true }), false);
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, ctrlKey: true }), false);
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, shiftKey: true }), false);
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, altKey: true }), false);
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, target: "_blank" }), false);
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, download: true }), false);
});

test("project transition leaves keyboard and reduced-motion activation native", () => {
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, detail: 0 }), false);
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, reducedMotion: true }), false);
  assert.equal(shouldEnhanceProjectNavigation({ ...primaryNavigation, defaultPrevented: true }), false);
});
