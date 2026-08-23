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

test("public studio descriptors consistently identify BM Visuals as a division of BM", async () => {
  const files = await Promise.all(
    [
      "../app/layout.tsx",
      "../app/page.tsx",
      "../app/contact/page.tsx",
      "../components/home/HeroSequence.tsx",
      "../components/case/ProjectCasePage.tsx",
    ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );

  for (const source of files) {
    assert.match(source, /DIGITAL EXPERIENCE DIVISION OF BM/i);
    assert.doesNotMatch(source, /Independent digital studio/i);
  }
});
