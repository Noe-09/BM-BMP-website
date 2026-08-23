import assert from "node:assert/strict";
import test from "node:test";

import {
  getNextProjectCase,
  getProjectCase,
  getProjectCaseSlugs,
} from "../lib/projects/project-cases.ts";

test("ready case slugs exclude the unfinished HAVEN case", () => {
  assert.deepEqual(getProjectCaseSlugs(), ["fabriclism", "aurelia-skin", "aether"]);
  assert.equal(getProjectCase("haven"), undefined);
});

test("case studies resolve shared facts from the canonical project record", () => {
  const fabriclism = getProjectCase("fabriclism");
  const aurelia = getProjectCase("aurelia-skin");
  const aether = getProjectCase("aether");

  assert.equal(fabriclism?.project.title, "FABRICLISM");
  assert.equal(fabriclism?.project.liveUrl, "https://demo-fabriclism.vercel.app/");
  assert.equal(aurelia?.project.liveUrl, "https://aurelia-skin.vercel.app/");
  assert.equal(aether?.project.status, "Experimental Concept");
  assert.deepEqual(aether?.project.disciplines, [
    "Digital Exhibition",
    "Fashion Campaign",
    "Experimental Commerce",
  ]);
});

test("next-world order skips HAVEN until its upgraded case is ready", () => {
  assert.equal(getNextProjectCase("fabriclism")?.project.slug, "aurelia-skin");
  assert.equal(getNextProjectCase("aurelia-skin")?.project.slug, "aether");
  assert.equal(getNextProjectCase("aether")?.project.slug, "fabriclism");
  assert.equal(getNextProjectCase("haven"), undefined);
});

test("unknown case slugs fail closed", () => {
  assert.equal(getProjectCase("unknown-project"), undefined);
});
