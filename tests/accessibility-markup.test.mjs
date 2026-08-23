import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("capability controls retain native button semantics inside a real list", async () => {
  const source = await readFile(
    new URL("../components/home/CapabilitiesIndex.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /<ul className="capabilities-index__list"/);
  assert.match(source, /<li key=\{capability\.id\}>/);
  assert.doesNotMatch(source, /role="listitem"/);
});
