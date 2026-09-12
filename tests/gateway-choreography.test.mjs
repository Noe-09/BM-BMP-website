import assert from "node:assert/strict";
import test from "node:test";

import { deriveDestinationInteraction } from "../lib/gateway/briefing.ts";
import { deriveGatewayPose } from "../lib/gateway/choreography.ts";

const interactions = (
  previewDivision = null,
  selectedDivision = null,
  briefingProgress = 0,
) =>
  deriveDestinationInteraction({
    previewDivision,
    selectedDivision,
    briefingProgress,
  });

const base = {
  travelProgress: 1,
  briefingProgress: 0,
  interactions: interactions(),
  selectedDivision: null,
  exitProgress: 0,
  reducedMotion: false,
  coarsePointer: false,
};

test("neutral split preserves the approved journey endpoint", () => {
  const pose = deriveGatewayPose(base);
  assert.equal(pose.cameraZ, -18);
  assert.equal(pose.cameraX, 0);
  assert.equal(pose.cameraYaw, 0);
  assert.equal(pose.cameraFov, 46);
  assert.equal(pose.briefingProgress, 0);
});

test("three previews use typed interactions instead of binary selection math", () => {
  const visuals = deriveGatewayPose({ ...base, interactions: interactions("visuals") });
  const creator = deriveGatewayPose({ ...base, interactions: interactions("creator") });
  const technical = deriveGatewayPose({ ...base, interactions: interactions("technical") });

  assert.ok(visuals.visualLight > visuals.technicalLight);
  assert.ok(technical.technicalLight > technical.visualLight);
  assert.ok(creator.creatorLight > visuals.creatorLight);
  assert.ok(visuals.cameraX < creator.cameraX);
  assert.ok(technical.cameraX > creator.cameraX);
  assert.deepEqual(creator.interactions.creator, {
    hoverWeight: 1,
    selectedWeight: 0,
    recedeWeight: 0,
    focusWeight: 0.2,
  });
});

test("all three selected worlds receive the same left-authority framing", () => {
  for (const selectedDivision of ["visuals", "technical", "creator"]) {
    const pose = deriveGatewayPose({
      ...base,
      briefingProgress: 1,
      interactions: interactions(null, selectedDivision, 1),
      selectedDivision,
    });
    assert.equal(pose.briefingFrame.focus, 1);
    assert.equal(pose.cameraX, 0.72);
    assert.equal(pose.cameraZ, -19.4);
    assert.equal(pose.cameraFov, 43.5);
    assert.equal(pose.selectedDivision, selectedDivision);
  }
});

test("briefing zero exactly reproduces neutral chamber transforms", () => {
  const neutral = deriveGatewayPose(base);
  for (const selectedDivision of ["visuals", "technical", "creator"]) {
    const atZero = deriveGatewayPose({
      ...base,
      selectedDivision,
      briefingProgress: 0,
      interactions: interactions(null, selectedDivision, 0),
    });
    assert.deepEqual(atZero, { ...neutral, selectedDivision });
  }
});

test("coarse travel keeps approved absolute camera endpoints", () => {
  const desktopStart = deriveGatewayPose({ ...base, travelProgress: 0 });
  const mobileStart = deriveGatewayPose({
    ...base,
    travelProgress: 0,
    coarsePointer: true,
  });
  const mobileEnd = deriveGatewayPose({ ...base, coarsePointer: true });

  assert.equal(desktopStart.cameraZ, 12);
  assert.equal(mobileStart.cameraZ, 12);
  assert.equal(mobileEnd.cameraZ, -8);
});

test("identity leak and tunnel metrics remain gated by master travel only", () => {
  assert.equal(deriveGatewayPose({ ...base, travelProgress: 0.84 }).identityLeak, 0);
  assert.equal(deriveGatewayPose({ ...base, travelProgress: 1 }).identityLeak, 1);

  const previewAtHalf = deriveGatewayPose({
    ...base,
    travelProgress: 0.5,
    interactions: interactions("creator"),
  });
  const neutralAtHalf = deriveGatewayPose({ ...base, travelProgress: 0.5 });
  assert.equal(previewAtHalf.aperture, neutralAtHalf.aperture);
  assert.equal(previewAtHalf.eventDarkness, neutralAtHalf.eventDarkness);
});

test("travel and briefing inputs clamp before interpolation", () => {
  const low = deriveGatewayPose({
    ...base,
    travelProgress: -10,
    briefingProgress: -2,
  });
  const high = deriveGatewayPose({
    ...base,
    travelProgress: 10,
    briefingProgress: 4,
    selectedDivision: "creator",
    interactions: interactions(null, "creator", 4),
  });
  assert.equal(low.cameraZ, 12);
  assert.equal(high.cameraZ, -19.4);
  assert.equal(high.identityLeak, 1);
  assert.equal(high.briefingProgress, 1);
});

test("outbound exit affects only a committed selected world", () => {
  const selected = deriveGatewayPose({
    ...base,
    briefingProgress: 1,
    interactions: interactions(null, "technical", 1),
    selectedDivision: "technical",
    exitProgress: 0,
  });
  const exiting = deriveGatewayPose({
    ...base,
    briefingProgress: 1,
    interactions: interactions(null, "technical", 1),
    selectedDivision: "technical",
    exitProgress: 1,
  });
  const unselected = deriveGatewayPose({ ...base, exitProgress: 1 });

  assert.ok(exiting.cameraZ < selected.cameraZ);
  assert.equal(unselected.cameraZ, deriveGatewayPose(base).cameraZ);
});

test("reduced motion preserves information and removes spatial travel", () => {
  const selected = deriveGatewayPose({
    ...base,
    reducedMotion: true,
    briefingProgress: 1,
    interactions: interactions(null, "creator", 1),
    selectedDivision: "creator",
  });
  assert.equal(selected.cameraZ, -18);
  assert.equal(selected.cameraX, 0);
  assert.equal(selected.cameraYaw, 0);
  assert.equal(selected.cameraFov, 46);
  assert.equal(selected.briefingFrame.description, 1);
  assert.equal(selected.briefingFrame.decision, 1);
});
