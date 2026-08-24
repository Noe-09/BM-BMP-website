import assert from "node:assert/strict";
import test from "node:test";

import * as gatewayProgress from "../lib/gateway/progress.ts";

test("gateway presentation assigns visible layer ownership by lifecycle phase", () => {
  const getPresentation = gatewayProgress.getGatewayPresentation;
  assert.equal(typeof getPresentation, "function");

  const cases = [
    {
      name: "server and first hydration fallback",
      input: { phase: "loading", enhancementStarted: false, sceneReady: false, selectionOverlayPresent: true },
      want: {
        enhancementActive: false,
        enhancementHealthy: false,
        fallbackActive: true,
        showLoader: false,
        showSelection: false,
        showTravelCue: false,
        layerOwner: "fallback",
      },
    },
    {
      name: "WebGL setup fallback",
      input: { phase: "loading", enhancementStarted: true, sceneReady: false, selectionOverlayPresent: true },
      want: {
        enhancementActive: true,
        enhancementHealthy: false,
        fallbackActive: true,
        showLoader: false,
        showSelection: false,
        showTravelCue: false,
        layerOwner: "fallback",
      },
    },
    {
      name: "healthy loader enhancement",
      input: { phase: "loading", enhancementStarted: true, sceneReady: true, selectionOverlayPresent: true },
      want: {
        enhancementActive: true,
        enhancementHealthy: true,
        fallbackActive: true,
        showLoader: true,
        showSelection: false,
        showTravelCue: false,
        layerOwner: "enhancement",
      },
    },
    {
      name: "automatic travel enhancement",
      input: { phase: "auto-entry", enhancementStarted: true, sceneReady: true, selectionOverlayPresent: true },
      want: {
        enhancementActive: true,
        enhancementHealthy: true,
        fallbackActive: true,
        showLoader: false,
        showSelection: false,
        showTravelCue: false,
        layerOwner: "enhancement",
      },
    },
    {
      name: "manual travel enhancement and cue",
      input: { phase: "user-travel", enhancementStarted: true, sceneReady: true, selectionOverlayPresent: true },
      want: {
        enhancementActive: true,
        enhancementHealthy: true,
        fallbackActive: true,
        showLoader: false,
        showSelection: false,
        showTravelCue: true,
        layerOwner: "enhancement",
      },
    },
    {
      name: "split chooser stays fallback-owned until the semantic overlay is present",
      input: { phase: "split", enhancementStarted: true, sceneReady: true, selectionOverlayPresent: false },
      want: {
        enhancementActive: true,
        enhancementHealthy: true,
        fallbackActive: true,
        showLoader: false,
        showSelection: false,
        showTravelCue: false,
        layerOwner: "fallback",
      },
    },
    {
      name: "semantic split chooser deactivates the fallback",
      input: { phase: "split", enhancementStarted: true, sceneReady: true, selectionOverlayPresent: true },
      want: {
        enhancementActive: true,
        enhancementHealthy: true,
        fallbackActive: false,
        showLoader: false,
        showSelection: true,
        showTravelCue: false,
        layerOwner: "enhancement",
      },
    },
    {
      name: "failed enhancement fallback only",
      input: { phase: "fallback", enhancementStarted: true, sceneReady: true, selectionOverlayPresent: true },
      want: {
        enhancementActive: false,
        enhancementHealthy: false,
        fallbackActive: true,
        showLoader: false,
        showSelection: false,
        showTravelCue: false,
        layerOwner: "fallback",
      },
    },
  ];

  for (const fixture of cases) {
    assert.deepEqual(getPresentation?.(fixture.input), fixture.want, fixture.name);
  }
});
