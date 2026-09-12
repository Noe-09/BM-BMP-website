import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Creator route owns an exhibition composition instead of BM Visual grammar", async () => {
  const source = await readFile(
    new URL("../app/creator/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /CreatorExperience/);
  assert.doesNotMatch(source, /PageHero|EmptyState/);
  assert.doesNotMatch(
    source,
    /BMVisual|SelectedWork|ProjectCasePage|WorkCard/,
  );
});

test("Creator keeps browser interaction inside one narrow controller", async () => {
  const source = await readFile(
    new URL(
      "../components/creator/CreatorJourneyController.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(source, /^"use client";/);
  assert.match(source, /passive: true/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /prefers-reduced-motion/);
  assert.doesNotMatch(source, /wheel|scrollTo|scrollIntoView/);
});
