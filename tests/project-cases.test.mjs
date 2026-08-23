import assert from "node:assert/strict";
import test from "node:test";

import {
  getNextProjectCase,
  getProjectCase,
  getProjectCaseSlugs,
} from "../lib/projects/project-cases.ts";
import { projectRegistry } from "../lib/projects/selected-work.ts";

test("HAVEN is a ready concept case with final canonical facts", () => {
  const haven = projectRegistry.find((project) => project.slug === "haven");

  assert.deepEqual(getProjectCaseSlugs(), [
    "fabriclism",
    "aurelia-skin",
    "haven",
    "aether",
  ]);
  assert.equal(haven?.title, "HAVEN");
  assert.equal(haven?.year, "2026");
  assert.equal(haven?.status, "Concept Project");
  assert.deepEqual(haven?.disciplines, [
    "Hospitality",
    "Editorial",
    "Commerce",
    "Digital Experience",
  ]);
  assert.equal(haven?.liveUrl, "https://haven-rebuild.vercel.app/");
  assert.equal(getProjectCase("haven")?.project.liveUrl, haven?.liveUrl);
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

test("Fabriclism presents the final Personal Uniform experience", () => {
  const fabriclism = getProjectCase("fabriclism");

  assert.deepEqual(fabriclism?.project.disciplines, [
    "Fashion",
    "E-commerce",
    "Art Direction",
    "Creative Development",
  ]);
  assert.equal(
    fabriclism?.project.description,
    "A fashion-commerce concept built around Personal Uniform—state-driven campaign, curated looks, material studies and functional shopping inside one editorial world.",
  );
  assert.deepEqual(
    fabriclism?.project.previewAssets.map((asset) => asset.label),
    ["Campaign", "State", "Uniform Index", "Build a Uniform", "Commerce"],
  );
  assert.equal(
    fabriclism?.positioning,
    "A fashion-commerce experience built around Personal Uniform—where state, campaign, lookbook and shopping move as one editorial world.",
  );
  assert.deepEqual(fabriclism?.thesis, [
    "Most fashion stores begin with products.",
    "Fabriclism begins with how you want to be seen.",
  ]);
  assert.equal(
    fabriclism?.seoDescription,
    "A BM Visuals concept case study for Fabriclism, a Personal Uniform fashion-commerce experience combining state-driven storytelling, editorial interaction and functional shopping.",
  );
  assert.deepEqual(fabriclism?.sections.at(-1)?.heading, [
    "Enter the world.",
    "Build your own.",
  ]);
});

test("next-world order includes HAVEN between Aurelia and ÆTHER", () => {
  assert.equal(getNextProjectCase("fabriclism")?.project.slug, "aurelia-skin");
  assert.equal(getNextProjectCase("aurelia-skin")?.project.slug, "haven");
  assert.equal(getNextProjectCase("haven")?.project.slug, "aether");
  assert.equal(getNextProjectCase("aether")?.project.slug, "fabriclism");
});

test("every ready case has a real live URL", () => {
  for (const slug of getProjectCaseSlugs()) {
    assert.match(getProjectCase(slug)?.project.liveUrl ?? "", /^https:\/\//);
  }
});

test("unknown case slugs fail closed", () => {
  assert.equal(getProjectCase("unknown-project"), undefined);
});
