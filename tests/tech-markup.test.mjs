import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("BM Tech route owns Systems Observatory instead of generic services grammar", async () => {
  const page = await read("app/bm-tech/page.tsx");
  const experience = await read("components/tech/TechExperience.tsx");

  assert.match(page, /TechExperience/);
  assert.match(page, /SiteHeader/);
  assert.match(page, /SiteFooter/);
  assert.doesNotMatch(page, /PageHero|ServiceIndex/);
  assert.match(experience, /data-tech-experience/);
  assert.match(experience, /SystemObservatory/);
  assert.match(experience, /SystemState/);
  assert.match(experience, /SystemSpectrum/);
  assert.match(experience, /SystemsRegister/);
  assert.match(experience, /TechClosing/);
});

test("BM Tech owns route-scoped styling", async () => {
  const layout = await read("app/bm-tech/layout.tsx");
  assert.match(layout, /import "\.\/tech\.css"/);
});
