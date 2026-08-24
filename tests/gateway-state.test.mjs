import assert from "node:assert/strict";
import test from "node:test";
import {
  createGatewayState,
  gatewayReducer,
  getSelectionBias,
} from "../lib/gateway/state.ts";
import {
  applyTravelDelta,
  formatLoaderNumber,
  getLoaderMode,
  getLoaderTarget,
  getTravelControlTarget,
  shouldShowSkip,
  stepTravelProgress,
} from "../lib/gateway/progress.ts";

function resolveSession(state, returning = false) {
  return gatewayReducer(state, { type: "SESSION_RESOLVED", returning });
}

test("first visit follows loading → ready → auto → travel → split", () => {
  let state = resolveSession(createGatewayState(false));
  state = gatewayReducer(state, { type: "LOAD_READY" });
  assert.equal(state.phase, "ready");
  state = gatewayReducer(state, { type: "BEGIN_ENTRY", reducedMotion: false });
  assert.equal(state.phase, "auto-entry");
  state = gatewayReducer(state, { type: "AUTO_COMPLETE" });
  assert.equal(state.phase, "user-travel");
  state = gatewayReducer(state, { type: "TRAVEL_COMPLETE" });
  assert.equal(state.phase, "split");
});

test("load readiness waits for the session result", () => {
  let state = gatewayReducer(createGatewayState(true), { type: "LOAD_READY" });
  assert.equal(state.phase, "loading");
  assert.equal(state.sessionResolved, false);
  state = resolveSession(state, true);
  state = gatewayReducer(state, { type: "LOAD_READY" });
  assert.equal(state.phase, "ready");
  assert.equal(state.returning, true);
});

test("duplicate session resolution cannot replace the resolved return state", () => {
  let state = resolveSession(createGatewayState(false), false);
  state = gatewayReducer(state, { type: "SESSION_RESOLVED", returning: true });
  assert.equal(state.returning, false);
  assert.equal(state.sessionResolved, true);
  assert.equal(state.phase, "loading");
});

test("late session resolution cannot change entry behavior after loading is ready", () => {
  let state = resolveSession(createGatewayState(false), false);
  state = gatewayReducer(state, { type: "LOAD_READY" });
  state = gatewayReducer(state, { type: "SESSION_RESOLVED", returning: true });
  assert.equal(state.phase, "ready");
  assert.equal(state.returning, false);
  state = gatewayReducer(state, { type: "BEGIN_ENTRY", reducedMotion: false });
  assert.equal(state.phase, "auto-entry");
});

test("return and reduced-motion entry skip the long camera journey", () => {
  let returning = resolveSession(createGatewayState(true), true);
  returning = gatewayReducer(returning, { type: "LOAD_READY" });
  returning = gatewayReducer(returning, { type: "BEGIN_ENTRY", reducedMotion: false });
  assert.equal(returning.phase, "split");

  let reduced = resolveSession(createGatewayState(false));
  reduced = gatewayReducer(reduced, { type: "LOAD_READY" });
  reduced = gatewayReducer(reduced, { type: "BEGIN_ENTRY", reducedMotion: true });
  assert.equal(reduced.phase, "split");
});

test("rapid previews replace each other and commit locks selection", () => {
  let state = { ...createGatewayState(false), phase: "split", sessionResolved: true };
  state = gatewayReducer(state, { type: "PREVIEW", division: "visuals" });
  assert.equal(getSelectionBias(state), -1);
  state = gatewayReducer(state, { type: "PREVIEW", division: "technical" });
  assert.equal(getSelectionBias(state), 1);
  state = gatewayReducer(state, { type: "COMMIT", division: "technical" });
  state = gatewayReducer(state, { type: "PREVIEW", division: "visuals" });
  assert.equal(state.committed, "technical");
  assert.equal(getSelectionBias(state), 1);
});

test("loader timing is gated, formatted without percent, and travel clamps", () => {
  assert.ok(getLoaderTarget(1, 600, "first") < 1);
  assert.equal(getLoaderTarget(1, 2400, "first"), 1);
  assert.equal(getLoaderTarget(1, 600, "short"), 1);
  assert.equal(formatLoaderNumber(0), "00");
  assert.equal(formatLoaderNumber(0.74), "74");
  assert.equal(formatLoaderNumber(1), "100");
  assert.equal(shouldShowSkip(1200, "first"), false);
  assert.equal(shouldShowSkip(1400, "first"), true);
  assert.equal(shouldShowSkip(5000, "short"), false);
  assert.equal(applyTravelDelta(0.95, 10000), 1);
  assert.equal(applyTravelDelta(0.05, -10000), 0);
});

test("loader mode makes return or reduced-motion visits short and non-skippable", () => {
  assert.equal(getLoaderMode(false, false), "first");
  assert.equal(getLoaderMode(true, false), "short");
  assert.equal(getLoaderMode(false, true), "short");
  assert.equal(shouldShowSkip(9999, getLoaderMode(false, true)), false);
});

test("travel progress damps toward its target", () => {
  const next = stepTravelProgress(0, 1, 0.1);
  assert.ok(next > 0);
  assert.ok(next < 1);
  assert.equal(stepTravelProgress(0.4, 0.4, 0.1), 0.4);
});

test("first-visit travel control reaches split through the existing progression", () => {
  let state = resolveSession(createGatewayState(false));
  state = gatewayReducer(state, { type: "LOAD_READY" });
  state = gatewayReducer(state, { type: "BEGIN_ENTRY", reducedMotion: false });
  state = gatewayReducer(state, { type: "AUTO_COMPLETE" });
  assert.equal(state.phase, "user-travel");

  const target = getTravelControlTarget(state.phase);
  assert.equal(target, 1);

  let rendered = 0.68;
  for (let frame = 0; frame < 240 && rendered < 0.995; frame += 1) {
    rendered = stepTravelProgress(rendered, target, 1 / 60);
  }
  assert.ok(rendered >= 0.995);

  state = gatewayReducer(state, { type: "TRAVEL_COMPLETE" });
  assert.equal(state.phase, "split");
  assert.equal(getTravelControlTarget(state.phase), null);
});
