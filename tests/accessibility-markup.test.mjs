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
  assert.match(source, /data-label-length=\{getLabelLength\(capability\.title\)\}/);
  assert.doesNotMatch(source, /role="listitem"/);
});

test("capability typography has explicit long-label tiers at every responsive size", async () => {
  const css = await readFile(new URL("../app/ending.css", import.meta.url), "utf8");

  assert.match(css, /data-label-length="long"/);
  assert.match(css, /data-label-length="extra-long"/);
  assert.match(css, /@media \(max-width: 1023px\)[\s\S]*data-label-length="long"/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*data-label-length="extra-long"/);
});

test("public routes consistently identify BMP as the canonical master brand", async () => {
  const files = await Promise.all(
    [
      "../app/layout.tsx",
      "../app/page.tsx",
      "../app/contact/page.tsx",
      "../components/site/SiteHeader.tsx",
      "../components/site/SiteFooter.tsx",
    ].map((path) => readFile(new URL(path, import.meta.url), "utf8")),
  );

  for (const source of files) {
    assert.match(source, /BMP|SiteHeader|SiteFooter/);
    assert.doesNotMatch(source, /Independent digital studio/i);
  }
});

test("Fabriclism lookbook guidance is derived from project data", async () => {
  const source = await readFile(
    new URL("../components/work/variants/LookbookProject.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /\$\{project\.title\} lookbook/);
  assert.match(source, /\$\{project\.previewAssets\.length\} project views/);
  assert.doesNotMatch(source, /Fabriclism digital lookbook/i);
});
