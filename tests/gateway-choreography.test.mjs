import assert from "node:assert/strict";
import test from "node:test";
import { deriveGatewayPose } from "../lib/gateway/choreography.ts";

const base = {
  travelProgress: 1,
  selectionBias: 0,
  exitProgress: 0,
  committed: null,
  reducedMotion: false,
  coarsePointer: false,
};

test("neutral split is balanced", () => {
  const pose = deriveGatewayPose(base);
  assert.equal(pose.leftPercent, 50);
  assert.equal(pose.rightPercent, 50);
  assert.equal(pose.cameraX, 0);
  assert.equal(pose.monolithX, 0);
});

test("desktop previews resolve to 62/38 with restrained camera bias", () => {
  const visuals = deriveGatewayPose({ ...base, selectionBias: -1 });
  const technical = deriveGatewayPose({ ...base, selectionBias: 1 });
  assert.deepEqual([visuals.leftPercent, visuals.rightPercent], [62, 38]);
  assert.deepEqual([technical.leftPercent, technical.rightPercent], [38, 62]);
  assert.ok(Math.abs(visuals.cameraYaw) <= 0.035);
  assert.ok(Math.abs(technical.cameraYaw) <= 0.035);
  assert.ok(visuals.visualLight > visuals.technicalLight);
  assert.ok(technical.technicalLight > technical.visualLight);
  assert.notEqual(visuals.leftOpen, technical.rightOpen);
});

test("coarse preview uses 68/32 and absolute camera endpoints 12 to -8", () => {
  const desktopStart = deriveGatewayPose({ ...base, travelProgress: 0 });
  const desktopEnd = deriveGatewayPose({ ...base, travelProgress: 1 });
  const mobileStart = deriveGatewayPose({ ...base, travelProgress: 0, coarsePointer: true });
  const mobileEnd = deriveGatewayPose({ ...base, travelProgress: 1, coarsePointer: true });
  const mobilePreview = deriveGatewayPose({ ...base, selectionBias: -1, coarsePointer: true });

  const desktopDistance = Math.abs(desktopEnd.cameraZ - desktopStart.cameraZ);
  const mobileDistance = Math.abs(mobileEnd.cameraZ - mobileStart.cameraZ);

  assert.equal(desktopStart.cameraZ, 12);
  assert.equal(desktopEnd.cameraZ, -18);
  assert.equal(mobileStart.cameraZ, 12);
  assert.equal(mobileEnd.cameraZ, -8);
  assert.deepEqual([mobilePreview.leftPercent, mobilePreview.rightPercent], [68, 32]);
  assert.ok(mobileDistance <= desktopDistance * 0.7);
  assert.ok(mobileDistance >= desktopDistance * 0.6);
});

test("identity leak is gated until the final fifteen percent of travel", () => {
  assert.equal(deriveGatewayPose({ ...base, travelProgress: 0.84 }).identityLeak, 0);
  const preHover = deriveGatewayPose({ ...base, travelProgress: 0.925 });
  assert.ok(Math.abs(preHover.identityLeak - 0.5) < 1e-9);
  assert.ok(preHover.visualLight > preHover.technicalLight);
  assert.ok(preHover.leftOpen > preHover.rightOpen);
  assert.ok(preHover.neutralLight > 0);
  assert.equal(deriveGatewayPose({ ...base, travelProgress: 1 }).identityLeak, 1);
});

test("Visuals identity contribution eases softly while Technical remains linear", () => {
  const neutral = deriveGatewayPose({ ...base, travelProgress: 0.5 });
  const visuals = deriveGatewayPose({ ...base, travelProgress: 0.5, selectionBias: -1 });
  const technical = deriveGatewayPose({ ...base, travelProgress: 0.5, selectionBias: 1 });
  const visualDelta = visuals.visualLight - neutral.visualLight;
  const technicalDelta = technical.technicalLight - neutral.technicalLight;
  const visualFullDelta = deriveGatewayPose({ ...base, travelProgress: 1, selectionBias: -1 }).visualLight - deriveGatewayPose({ ...base, travelProgress: 1 }).visualLight;
  const technicalFullDelta = deriveGatewayPose({ ...base, travelProgress: 1, selectionBias: 1 }).technicalLight - deriveGatewayPose({ ...base, travelProgress: 1 }).technicalLight;
  assert.ok(visualDelta > visualFullDelta * 0.5);
  assert.ok(Math.abs(technicalDelta - technicalFullDelta * 0.5) < 1e-9);
  assert.ok(visuals.leftOpen > neutral.leftOpen);
  assert.ok(technical.rightOpen > neutral.rightOpen);
});

test("travel inputs are clamped before interpolation", () => {
  const low = deriveGatewayPose({ ...base, travelProgress: -10, exitProgress: -2 });
  const high = deriveGatewayPose({ ...base, travelProgress: 10, exitProgress: 2 });
  assert.equal(low.cameraZ, 12);
  assert.equal(high.cameraZ, -18);
  assert.equal(high.identityLeak, 1);
});

test("exit movement advances only a committed selected passage", () => {
  const splitInput = { ...base, travelProgress: 0.7, selectionBias: -1, exitProgress: 0.8 };
  const committedInput = { ...splitInput, committed: "visuals" };
  const split = deriveGatewayPose(splitInput);
  const splitAtZero = deriveGatewayPose({ ...splitInput, exitProgress: 0 });
  const committed = deriveGatewayPose(committedInput);
  const committedAtZero = deriveGatewayPose({ ...committedInput, exitProgress: 0 });
  assert.equal(split.cameraZ, splitAtZero.cameraZ);
  assert.ok(committed.cameraZ < committedAtZero.cameraZ);
  assert.ok(committed.leftOpen > committedAtZero.leftOpen);
});

test("technical exit advances its selected passage and clamps exit progress", () => {
  const input = { ...base, travelProgress: 0.7, selectionBias: 1, committed: "technical" };
  const atZero = deriveGatewayPose({ ...input, exitProgress: 0 });
  const atHigh = deriveGatewayPose({ ...input, exitProgress: 4 });
  assert.ok(atHigh.cameraZ < atZero.cameraZ);
  assert.ok(atHigh.rightOpen > atZero.rightOpen);
  assert.deepEqual(atHigh, deriveGatewayPose({ ...input, exitProgress: 1 }));
});

test("uncommitted exit progress leaves camera and openings unchanged", () => {
  const input = { ...base, travelProgress: 0.7, selectionBias: 1, committed: null };
  const atZero = deriveGatewayPose({ ...input, exitProgress: 0 });
  const atHigh = deriveGatewayPose({ ...input, exitProgress: 99 });
  assert.equal(atHigh.cameraZ, atZero.cameraZ);
  assert.equal(atHigh.leftOpen, atZero.leftOpen);
  assert.equal(atHigh.rightOpen, atZero.rightOpen);
});

test("reduced motion removes travel and preview camera bias", () => {
  const start = deriveGatewayPose({ ...base, travelProgress: 0, reducedMotion: true, selectionBias: -1 });
  const end = deriveGatewayPose({ ...base, travelProgress: 1, reducedMotion: true, selectionBias: -1 });
  assert.equal(start.cameraZ, end.cameraZ);
  assert.equal(end.cameraX, 0);
  assert.equal(end.cameraYaw, 0);
  assert.deepEqual([end.leftPercent, end.rightPercent], [62, 38]);
});

test("reduced-motion committed exit stays static at the endpoint", () => {
  const input = { ...base, reducedMotion: true, selectionBias: 1, committed: "technical" };
  const atZero = deriveGatewayPose({ ...input, exitProgress: 0 });
  const atExit = deriveGatewayPose({ ...input, exitProgress: 1 });
  assert.deepEqual(atExit, atZero);
  assert.equal(atExit.cameraX, 0);
  assert.equal(atExit.cameraYaw, 0);
});
