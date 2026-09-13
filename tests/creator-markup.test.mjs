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
  const [source, sequence] = await Promise.all([
    readFile(
      new URL(
        "../components/creator/CreatorJourneyController.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL("../components/creator/CreatorWorldSequence.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(source, /^"use client";/);
  assert.match(source, /passive: true/);
  assert.match(source, /requestAnimationFrame/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /getBoundingClientRect/);
  assert.match(source, /data-creator-chapter/);
  assert.match(source, /dampCreatorVisualProgress/);
  assert.match(source, /--portal-target-progress/);
  assert.match(source, /--portal-frame-progress/);
  assert.match(source, /--portal-progress/);
  assert.match(source, /settled/);
  assert.match(sequence, /creator-portal-sequence/);
  assert.match(sequence, /data-creator-chapter/);
  assert.doesNotMatch(source, /wheel|scrollTo|scrollIntoView/);
});

test("revealed Creator worlds use three non-template portal grammars", async () => {
  const components = await Promise.all(
    ["WeinsWorld", "SlyourWorld", "XideWorld"].map(async (name) => ({
      name,
      source: await readFile(
        new URL(`../components/creator/worlds/${name}.tsx`, import.meta.url),
        "utf8",
      ),
    })),
  );

  for (const { source } of components) {
    assert.match(source, /CreatorWorld/);
    assert.match(source, /CreatorMedia/);
    assert.doesNotMatch(source, /iframe|dangerouslySetInnerHTML/);
    assert.match(source, /world\.name/);
    assert.doesNotMatch(source, /creator-world__header|creator-world__footer/);
  }

  const byName = Object.fromEntries(
    components.map(({ name, source }) => [name, source]),
  );
  assert.equal((byName.WeinsWorld.match(/<CreatorMedia/g) ?? []).length, 2);
  assert.match(byName.WeinsWorld, /media=\{world\.media\[0\]\}[\s\S]*priority/);
  assert.equal((byName.SlyourWorld.match(/<CreatorMedia/g) ?? []).length, 2);
  assert.equal((byName.XideWorld.match(/<CreatorMedia/g) ?? []).length, 1);
  assert.match(byName.WeinsWorld, /weins-portal__slab/);
  assert.match(byName.SlyourWorld, /slyour-portal__editorial-wall/);
  assert.match(byName.XideWorld, /xide-portal__darkness/);
});

test("Creator arrival lets the first verified world intrude without an orbit", async () => {
  const source = await readFile(
    new URL("../components/creator/CreatorArrival.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /CreatorMedia/);
  assert.match(source, /firstWorld\.media\[0\]/);
  assert.match(source, /priority/);
  assert.doesNotMatch(source, /creator-arrival__orbit/);
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
  assert.match(source, /preload=\{priority\}/);
  assert.match(source, /loading=\{priority \? undefined : "lazy"\}/);
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
    assert.match(source, /creator-sealed-portal/);
    assert.doesNotMatch(source, /creator-world__header|creator-world__footer/);
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
  assert.doesNotMatch(source, /creator-veil__legend/);
});

test("Creator overview CSS forms a continuous sticky exhibition", async () => {
  const css = await readFile(
    new URL("../app/creator/creator.css", import.meta.url),
    "utf8",
  );

  assert.match(css, /\.creator-portal-sequence/);
  assert.match(css, /\.creator-world \{[\s\S]*position: sticky/);
  assert.match(css, /--portal-progress/);
  assert.match(css, /--portal-frame-progress/);
  assert.match(css, /\.weins-portal__visual[\s\S]*scale\(/);
  assert.match(css, /\.weins-portal__slab[\s\S]{0,420}scaleX\(/);
  assert.doesNotMatch(
    css,
    /\.weins-portal__slab\s*\{[^}]*width:\s*calc\([^}]*--portal-progress/s,
  );
  assert.doesNotMatch(
    css,
    /\.slyour-portal__campaign\s*\{[^}]*left:\s*calc\([^}]*--portal-progress/s,
  );
  assert.doesNotMatch(
    css,
    /\.weins-portal__visual\s*\{[^}]*clip-path:[^}]*--portal-progress/s,
  );
  assert.doesNotMatch(
    css,
    /\.xide-portal__environment\s*\{[^}]*clip-path:[^}]*--portal-presence/s,
  );
  assert.match(css, /\.slyour-portal__editorial-wall/);
  assert.match(css, /\.xide-portal__darkness/);
  assert.doesNotMatch(css, /\.creator-world \{[\s\S]{0,220}border-top/);
  assert.doesNotMatch(css, /\.creator-veil \{[\s\S]{0,260}border:/);
});

test("Creator degrades motion safely and cleans up every global listener", async () => {
  const [controller, css, sequence] = await Promise.all([
    readFile(
      new URL(
        "../components/creator/CreatorJourneyController.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(new URL("../app/creator/creator.css", import.meta.url), "utf8"),
    readFile(
      new URL("../components/creator/CreatorWorldSequence.tsx", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /overflow-x: clip/);
  assert.match(css, /\.creator-page \.bmp-header__mark,[\s\S]*min-height: 44px/);
  assert.match(css, /\.creator-threshold h2 \{\n    font-size: clamp\(3/);
  assert.match(
    css,
    /\.creator-arrival__footer p \{[\s\S]{0,160}font-size: 0\.82rem;[\s\S]{0,80}line-height: 1\.25;/,
  );
  assert.match(controller, /cancelAnimationFrame/);
  assert.ok((controller.match(/removeEventListener/g) ?? []).length >= 3);
  assert.doesNotMatch(`${controller}\n${sequence}`, /three|WebGL|canvas/i);
});
