import assert from "node:assert/strict";
import test from "node:test";

import { CREATOR } from "../content/creator.ts";
import {
  getPublishedCreatorWorld,
  getPublishedCreatorWorlds,
} from "../lib/creator/publication.ts";
import {
  CREATOR_REVEAL_STATES,
  validateCreatorWorld,
} from "../lib/creator/reveal-state.ts";
import { projectRegistry } from "../lib/projects/selected-work.ts";

test("Creator exposes the complete reveal-state vocabulary", () => {
  assert.deepEqual(CREATOR_REVEAL_STATES, [
    "sealed",
    "glimpse",
    "preview",
    "open",
  ]);
});

test("Creator keeps the approved six-world order and initial states", () => {
  assert.deepEqual(
    CREATOR.worlds.map(({ index, name, revealState }) => ({
      index,
      name,
      revealState,
    })),
    [
      { index: "01", name: "WEINS", revealState: "open" },
      { index: "02", name: "SLYOUR", revealState: "open" },
      { index: "03", name: "THE XIDE", revealState: "preview" },
      { index: "04", name: "PAWSONA", revealState: "sealed" },
      { index: "05", name: "RELATIONSHIP", revealState: "sealed" },
      { index: "06", name: "MINER", revealState: "sealed" },
    ],
  );
});

test("only complete open and preview worlds publish detail routes", () => {
  assert.deepEqual(
    getPublishedCreatorWorlds(CREATOR.worlds).map(({ slug, route }) => ({
      slug,
      route,
    })),
    [
      { slug: "weins", route: "/creator/weins" },
      { slug: "slyour", route: "/creator/slyour" },
      { slug: "the-xide", route: "/creator/the-xide" },
    ],
  );
  assert.equal(getPublishedCreatorWorld("pawsona", CREATOR.worlds), undefined);
  assert.equal(getPublishedCreatorWorld("miner", CREATOR.worlds), undefined);
  assert.equal(getPublishedCreatorWorld("unknown", CREATOR.worlds), undefined);
});

test("published worlds provide complete detail metadata and verified media", () => {
  for (const world of getPublishedCreatorWorlds(CREATOR.worlds)) {
    assert.equal(world.detail?.length, 6, `${world.slug} detail grammar`);
    assert.ok(world.media.length > 0, `${world.slug} media`);
    for (const media of world.media) {
      assert.equal(media.status, "verified");
      assert.ok(media.src.startsWith(`/creator/${world.slug}/`));
      assert.ok(media.alt.length > 12);
      assert.ok(media.label.length > 0);
      assert.match(media.source, /^owned-repository:/);
    }
  }
});

test("sealed worlds fail validation when they leak publication material", () => {
  const sealed = CREATOR.worlds.find(({ slug }) => slug === "pawsona");
  assert.ok(sealed);

  const invalid = {
    ...sealed,
    route: "/creator/pawsona",
    liveUrl: "https://invalid.example",
    media: [
      {
        src: "/creator/pawsona/fake.jpg",
        alt: "Fabricated Pawsona interface",
        label: "Fake interface",
        kind: "image",
        status: "verified",
        source: "test:invalid",
      },
    ],
  };

  assert.deepEqual(validateCreatorWorld(invalid), [
    "pawsona: non-publishable worlds cannot expose a route",
    "pawsona: sealed worlds cannot expose media",
    "pawsona: sealed worlds cannot expose live URLs",
  ]);
});

test("publishable worlds fail validation without proof or detail grammar", () => {
  const published = CREATOR.worlds.find(({ slug }) => slug === "weins");
  assert.ok(published);

  assert.deepEqual(
    validateCreatorWorld({ ...published, media: [], detail: null }),
    [
      "weins: publishable worlds require verified media",
      "weins: publishable worlds require six detail sections",
    ],
  );
});

test("Creator worlds never overlap the locked BM Visual selection", () => {
  const visualSlugs = new Set(projectRegistry.map(({ slug }) => slug));
  assert.deepEqual(
    CREATOR.worlds.filter(({ slug }) => visualSlugs.has(slug)),
    [],
  );
});
