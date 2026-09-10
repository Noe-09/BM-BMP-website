import assert from "node:assert/strict";
import test from "node:test";

import * as ending from "../lib/home/ending.ts";
import { SERVICES } from "../content/services.ts";

const { PROCESS_STEPS, getProcessStepIndex } = ending;

test("canonical BM Visual services retain six distinct proof-backed presentations", () => {
  assert.equal(typeof ending.getVisualCapabilities, "function");
  const capabilities = ending.getVisualCapabilities(SERVICES.visual.groups.value);

  assert.equal(capabilities.length, 6);
  assert.deepEqual(
    capabilities.map(({ title }) => title),
    SERVICES.visual.groups.value,
  );
  assert.equal(new Set(capabilities.map(({ id }) => id)).size, 6);

  for (const capability of capabilities) {
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
