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
  const neutralStart = deriveGatewayPose({ ...base, travelProgress: 0 });
  const neutralHalf = deriveGatewayPose({ ...base, travelProgress: 0.5 });
  const neutralFull = deriveGatewayPose({ ...base, travelProgress: 1 });
  const visualsStart = deriveGatewayPose({ ...base, travelProgress: 0, selectionBias: -1 });
  const visualsHalf = deriveGatewayPose({ ...base, travelProgress: 0.5, selectionBias: -1 });
  const visualsFull = deriveGatewayPose({ ...base, travelProgress: 1, selectionBias: -1 });
  const technicalStart = deriveGatewayPose({ ...base, travelProgress: 0, selectionBias: 1 });
  const technicalHalf = deriveGatewayPose({ ...base, travelProgress: 0.5, selectionBias: 1 });
  const technicalFull = deriveGatewayPose({ ...base, travelProgress: 1, selectionBias: 1 });
  const visualIncrementHalf = (visualsHalf.leftOpen - neutralHalf.leftOpen) - (visualsStart.leftOpen - neutralStart.leftOpen);
  const visualIncrementFull = (visualsFull.leftOpen - neutralFull.leftOpen) - (visualsStart.leftOpen - neutralStart.leftOpen);
  const technicalIncrementHalf = (technicalHalf.rightOpen - neutralHalf.rightOpen) - (technicalStart.rightOpen - neutralStart.rightOpen);
  const technicalIncrementFull = (technicalFull.rightOpen - neutralFull.rightOpen) - (technicalStart.rightOpen - neutralStart.rightOpen);
  assert.ok(visualsStart.leftOpen > neutralStart.leftOpen);
  assert.ok(technicalStart.rightOpen > neutralStart.rightOpen);
  assert.ok(visualIncrementHalf > visualIncrementFull * 0.5);
  assert.ok(Math.abs(technicalIncrementHalf - technicalIncrementFull * 0.5) < 1e-9);
});

test("travel inputs are clamped before interpolation", () => {
  const low = deriveGatewayPose({ ...base, travelProgress: -10, exitProgress: -2 });
  const high = deriveGatewayPose({ ...base, travelProgress: 10, exitProgress: 2 });
  assert.equal(low.cameraZ, 12);
  assert.equal(high.cameraZ, -18);
  assert.equal(high.identityLeak, 1);
});

test("Visuals exit brightens, softens, and opens only the Visuals passage", () => {
  const splitInput = { ...base, travelProgress: 0.7, selectionBias: -1, exitProgress: 0.8 };
  const committedInput = { ...splitInput, committed: "visuals" };
  const split = deriveGatewayPose(splitInput);
  const splitAtZero = deriveGatewayPose({ ...splitInput, exitProgress: 0 });
  const committed = deriveGatewayPose(committedInput);
  const committedAtZero = deriveGatewayPose({ ...committedInput, exitProgress: 0 });
  assert.equal(split.cameraZ, splitAtZero.cameraZ);
  assert.ok(committed.cameraZ < committedAtZero.cameraZ);
  assert.ok(committed.leftOpen > committedAtZero.leftOpen);
  assert.ok(committed.visualLight > committedAtZero.visualLight);
  assert.equal(committed.rightOpen, committedAtZero.rightOpen);
  assert.equal(committed.technicalLight, committedAtZero.technicalLight);
});

test("Technical exit sharpens light and camera alignment with a distinct aperture", () => {
  const input = { ...base, travelProgress: 0.7, selectionBias: 1, committed: "technical" };
  const atZero = deriveGatewayPose({ ...input, exitProgress: 0 });
  const atHigh = deriveGatewayPose({ ...input, exitProgress: 4 });
  const visualInput = { ...base, travelProgress: 0.7, selectionBias: -1, committed: "visuals" };
  const visualZero = deriveGatewayPose({ ...visualInput, exitProgress: 0 });
  const visualExit = deriveGatewayPose({ ...visualInput, exitProgress: 1 });
  assert.ok(atHigh.cameraZ < atZero.cameraZ);
  assert.ok(atHigh.rightOpen > atZero.rightOpen);
  assert.ok(atHigh.technicalLight > atZero.technicalLight);
  assert.ok(atHigh.cameraX > atZero.cameraX);
  assert.ok(Math.abs(atHigh.cameraYaw) < Math.abs(atZero.cameraYaw));
  assert.notEqual(
    atHigh.rightOpen - atZero.rightOpen,
    visualExit.leftOpen - visualZero.leftOpen,
  );
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
