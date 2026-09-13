import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
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

test("published Creator worlds expose verified HTTPS live destinations", () => {
  assert.deepEqual(
    getPublishedCreatorWorlds(CREATOR.worlds).map(({ slug, liveUrl }) => ({
      slug,
      liveUrl,
    })),
    [
      { slug: "weins", liveUrl: "https://weins-chi.vercel.app/" },
      { slug: "slyour", liveUrl: "https://slyour.vercel.app/" },
      { slug: "the-xide", liveUrl: "https://thexide.vercel.app/" },
    ],
  );

  assert.ok(
    CREATOR.worlds
      .filter(({ revealState }) => revealState === "sealed")
      .every(({ liveUrl }) => liveUrl === null),
  );
});

test("THE XIDE detail copy reflects its verified live destination", () => {
  const xide = CREATOR.worlds.find(({ slug }) => slug === "the-xide");

  assert.ok(xide?.detail);
  assert.match(xide.detail.at(-1).body, /verified live destination/i);
  assert.doesNotMatch(xide.detail.at(-1).body, /when .* verified/i);
});

test("WEINS publishes three distinct verified source assets", async () => {
  const weins = CREATOR.worlds.find(({ slug }) => slug === "weins");
  assert.ok(weins);
  assert.equal(weins.media[2]?.src, "/creator/weins/look-04-proportion.jpg");

  const hashes = await Promise.all(
    weins.media.map(async ({ src }) =>
      createHash("sha256")
        .update(await readFile(new URL(`../public${src}`, import.meta.url)))
        .digest("hex"),
    ),
  );

  assert.equal(new Set(hashes).size, weins.media.length);
  assert.equal(
    hashes[2],
    "dcbcb7acf838ae7ded642c3243efbb97b02905645ced31d7d10264ca786cf112",
  );
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

test("Creator rejects live destinations that are not HTTPS", () => {
  const published = CREATOR.worlds.find(({ slug }) => slug === "weins");
  assert.ok(published);

  assert.deepEqual(
    validateCreatorWorld({
      ...published,
      liveUrl: "http://weins.example",
    }),
    ["weins: live URLs must use HTTPS"],
  );
});

test("Creator worlds never overlap the locked BM Visual selection", () => {
  const visualSlugs = new Set(projectRegistry.map(({ slug }) => slug));
  assert.deepEqual(
    CREATOR.worlds.filter(({ slug }) => visualSlugs.has(slug)),
    [],
  );
});
