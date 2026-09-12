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

test("revealed Creator worlds use authored image compositions", async () => {
  const components = await Promise.all(
    ["WeinsWorld", "SlyourWorld", "XideWorld"].map(async (name) => ({
      name,
      source: await readFile(
        new URL(`../components/creator/worlds/${name}.tsx`, import.meta.url),
        "utf8",
      ),
    })),
  );

  for (const { name, source } of components) {
    assert.match(source, /CreatorWorld/);
    assert.match(source, /CreatorMedia/);
    assert.doesNotMatch(source, /iframe|dangerouslySetInnerHTML/);
    assert.match(source, /world\.name/);
    assert.match(source, /world\.thesis/);

    if (name === "WeinsWorld") {
      assert.match(source, /priority/);
    } else {
      assert.doesNotMatch(source, /priority/);
    }
  }
});

test("Creator media uses optimized images with a neutral failure state", async () => {
  const source = await readFile(
    new URL("../components/creator/CreatorMedia.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /from "next\/image"/);
  assert.match(source, /sizes/);
  assert.match(source, /onError/);
  assert.match(source, /Media unavailable/);
});
