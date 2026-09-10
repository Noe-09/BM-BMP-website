import assert from "node:assert/strict";
import test from "node:test";

import {
  BRIEFING_TIMING,
  createBriefingTimeline,
  deriveBriefingFrame,
  deriveDestinationInteraction,
  seekBriefingTimeline,
  stepBriefingTimeline,
} from "../lib/gateway/briefing.ts";

test("neutral, preview, and selected interactions cover all three worlds", () => {
  const neutral = deriveDestinationInteraction({
    previewDivision: null,
    selectedDivision: null,
    briefingProgress: 0,
  });
  assert.deepEqual(Object.keys(neutral), ["visuals", "technical", "creator"]);
  assert.ok(
    Object.values(neutral).every((interaction) =>
      Object.values(interaction).every((value) => value === 0),
    ),
  );

  const preview = deriveDestinationInteraction({
    previewDivision: "creator",
    selectedDivision: null,
    briefingProgress: 0,
  });
  assert.deepEqual(preview.creator, {
    hoverWeight: 1,
    selectedWeight: 0,
    recedeWeight: 0,
    focusWeight: 0.2,
  });
  assert.equal(preview.visuals.recedeWeight, 0);
  assert.equal(preview.technical.recedeWeight, 0);

  const selected = deriveDestinationInteraction({
    previewDivision: null,
    selectedDivision: "technical",
    briefingProgress: 0.75,
  });
  assert.equal(selected.technical.selectedWeight, 0.75);
  assert.ok(selected.technical.focusWeight > 0.9);
  assert.equal(selected.visuals.recedeWeight, 0.75);
  assert.equal(selected.creator.recedeWeight, 0.75);
});

test("briefing reveal stages are bounded and decision waits for completion", () => {
  const boundaries = [0, 0.2, 0.48, 0.56, 0.68, 0.76, 1];
  for (const progress of boundaries) {
    const frame = deriveBriefingFrame(progress);
    for (const value of Object.values(frame)) {
      assert.ok(value >= 0 && value <= 1);
    }
  }

  assert.deepEqual(deriveBriefingFrame(0), {
    progress: 0,
    acknowledgement: 0,
    focus: 0,
    identity: 0,
    description: 0,
    decision: 0,
  });
  assert.equal(deriveBriefingFrame(0.999).decision, 0);
  assert.equal(deriveBriefingFrame(1).decision, 1);
  assert.equal(deriveBriefingFrame(0.47).identity, 0);
  assert.equal(deriveBriefingFrame(0.67).description, 0);
});

test("briefing timeline runs forward and reverses", () => {
  let timeline = createBriefingTimeline();
  timeline = seekBriefingTimeline(
    timeline,
    1,
    1000,
    BRIEFING_TIMING.fullMotionMs,
  );
  timeline = stepBriefingTimeline(timeline, 3500);
  assert.equal(timeline.progress, 0.5);

  timeline = seekBriefingTimeline(
    timeline,
    0,
    3500,
    BRIEFING_TIMING.fullMotionMs * timeline.progress,
  );
  timeline = stepBriefingTimeline(timeline, 4750);
  assert.equal(timeline.progress, 0.25);
  timeline = stepBriefingTimeline(timeline, 6000);
  assert.equal(timeline.progress, 0);
  assert.equal(timeline.seek, null);
});

test("briefing frames reconstruct exactly in shuffled progress order", () => {
  const progressValues = [0.82, 0.1, 1, 0.42, 0, 0.68, 0.24];
  const first = new Map(
    progressValues.map((progress) => [progress, deriveBriefingFrame(progress)]),
  );

  for (const progress of [...progressValues].reverse()) {
    assert.deepEqual(deriveBriefingFrame(progress), first.get(progress));
    const input = {
      previewDivision: null,
      selectedDivision: "creator",
      briefingProgress: progress,
    };
    assert.deepEqual(
      deriveDestinationInteraction(input),
      deriveDestinationInteraction(input),
    );
  }
});
