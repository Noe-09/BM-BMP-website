import assert from "node:assert/strict";
import test from "node:test";
import { deriveBreakthroughFrame } from "../lib/gateway/environment/breakthroughState.ts";

test("breakthrough score reconstructs exactly in arbitrary journey order", () => {
  const points = [0, .08, .16, .25, .34, .46, .58, .68, .74, .78, .90, 1];
  const expected = points.map(deriveBreakthroughFrame);
  for (const i of [11, 8, 4, 0, 7, 2, 10, 5, 1, 9, 6, 3])
    assert.deepEqual(deriveBreakthroughFrame(points[i]), expected[i]);
  for (const p of points) for (const value of Object.values(deriveBreakthroughFrame(p)))
    assert.ok(Number.isFinite(value) && value >= 0 && value <= 1);
});

test("core pressure and release have distinct contrasting endpoints", () => {
  assert.equal(deriveBreakthroughFrame(0).blackout, 0);
  assert.ok(deriveBreakthroughFrame(.68).blackout > .98);
  assert.equal(deriveBreakthroughFrame(1).blackout, 0);
  assert.equal(deriveBreakthroughFrame(.54).exchange, 0);
  assert.equal(deriveBreakthroughFrame(.74).exchange, 1);
  assert.equal(deriveBreakthroughFrame(.80).release, 0);
  assert.equal(deriveBreakthroughFrame(.96).release, 1);
  assert.ok(deriveBreakthroughFrame(.34).rupture > .95);
});

test("all authored event boundaries remain continuous", () => {
  for (const p of [.14, .18, .34, .38, .48, .50, .54, .60, .68, .74, .78, .80, .90, .96]) {
    const before = deriveBreakthroughFrame(p - 1e-7), after = deriveBreakthroughFrame(p + 1e-7);
    for (const key in before) assert.ok(Math.abs(before[key] - after[key]) < .00001, `${p}/${key}`);
  }
});
