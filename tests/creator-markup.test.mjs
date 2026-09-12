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

test("sealed worlds disclose status without leaking media or navigation", async () => {
  const variants = new Map([
    ["PawsonaWorld", "cluster"],
    ["RelationshipWorld", "timeline"],
    ["MinerWorld", "strata"],
  ]);

  for (const [name, variant] of variants) {
    const source = await readFile(
      new URL(`../components/creator/worlds/${name}.tsx`, import.meta.url),
      "utf8",
    );

    assert.match(source, /CreatorWorld/);
    assert.match(source, /CreatorVeil/);
    assert.match(source, new RegExp(`variant="${variant}"`));
    assert.match(source, /world\.statusLabel/);
    assert.match(source, /world\.developmentNote/);
    assert.doesNotMatch(source, /next\/image|next\/link|CreatorMedia|<a\b/);
  }
});

test("Creator Veil keeps every atmospheric layer decorative", async () => {
  const source = await readFile(
    new URL("../components/creator/veil/CreatorVeil.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /cluster.*timeline.*strata/s);
  assert.ok((source.match(/aria-hidden="true"/g) ?? []).length >= 3);
  assert.doesNotMatch(source, /Image|canvas|WebGL|iframe/);
});
