import assert from "node:assert/strict";
import test from "node:test";

import {
  CAPABILITIES,
  PROCESS_STEPS,
  getProcessStepIndex,
} from "../lib/home/ending.ts";

test("capabilities expose six distinct disciplines backed by existing project media", () => {
  assert.equal(CAPABILITIES.length, 6);
  assert.equal(new Set(CAPABILITIES.map(({ id }) => id)).size, 6);
  assert.equal(new Set(CAPABILITIES.map(({ title }) => title)).size, 6);

  for (const capability of CAPABILITIES) {
    assert.match(capability.proof.src, /^\/projects\//);
    assert.ok(capability.proof.alt.length > 0);
    assert.doesNotMatch(capability.proof.src, /\/coffee\//);
  }
});

test("the studio process remains a concise five-step sequence", () => {
  assert.deepEqual(
    PROCESS_STEPS.map(({ number, title }) => [number, title]),
    [
      ["01", "Understand"],
      ["02", "Direction"],
      ["03", "Design"],
      ["04", "Build"],
      ["05", "Refine"],
    ],
  );
});

test("process progress clamps to a valid active step", () => {
  assert.equal(getProcessStepIndex(-1, 5), 0);
  assert.equal(getProcessStepIndex(0, 5), 0);
  assert.equal(getProcessStepIndex(0.5, 5), 2);
  assert.equal(getProcessStepIndex(1, 5), 4);
  assert.equal(getProcessStepIndex(2, 5), 4);
  assert.equal(getProcessStepIndex(0.5, 0), 0);
});
