# BMP Creator V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build BMP Creator V1 as an accessible, performant exhibition journey with six canonical worlds and public detail experiences for WEINS, SLYOUR, and THE XIDE.

**Architecture:** Keep routes, content, and metadata in Server Components. Drive the experience from one typed Creator registry, pure reveal/publication/journey helpers, and one narrow client scroll controller; render world identity and veil material with focused React components and route-scoped CSS.

**Tech Stack:** Next.js 16.3.1 App Router, React 19.2.8, TypeScript 5, CSS, Node test runner, and Next.js Image. No new dependencies and no WebGL.

**Spec:** `docs/superpowers/specs/2026-09-13-bmp-creator-v1-design.md`

## Global Constraints

- Work only on `feat/bmp-creator-v1`; do not merge to `main`.
- Do not modify Gateway or BM Visual production files, motion, registries, routes, or tests.
- World order is WEINS, SLYOUR, THE XIDE, PAWSONA, RELATIONSHIP, MINER.
- Reveal states are `open`, `open`, `preview`, `sealed`, `sealed`, `sealed`.
- Only `/creator/weins`, `/creator/slyour`, and `/creator/the-xide` may publish.
- Never fabricate assets, interfaces, gameplay, customers, metrics, outcomes, or launch states.
- Use only audited media from `Noe-09/Weins@5d72137`, `Noe-09/Slyour@c2f40bb`, and `Noe-09/The-Xide@70c94ba`.
- Omit external URLs until independently verified.
- Preserve native scrolling, reduced-motion usability, semantic order, keyboard access, and visible focus.
- Verify widths 360, 390, 768, 1024, and 1440 CSS pixels.

---

### Task 1: Creator reveal-state and publication contract

**Files:**
- Create: `tests/creator-publication.test.mjs`
- Create: `lib/creator/reveal-state.ts`
- Create: `lib/creator/publication.ts`
- Modify: `content/creator.ts`
- Modify: `content/index.ts`
- Modify: `tests/bmp-content.test.mjs`
- Modify: `tests/bmp-content-parity.test.mjs`

**Interfaces:**
- Produces: `CreatorRevealState`, `CreatorWorld`, `CreatorMedia`, `CreatorDetailSection`
- Produces: `validateCreatorWorld(world): readonly string[]`
- Produces: `assertValidCreatorRegistry(worlds): void`
- Produces: `canPublishCreatorDetail(world): boolean`
- Produces: `getPublishedCreatorWorlds(worlds): CreatorWorld[]`
- Produces: `getPublishedCreatorWorld(slug, worlds): CreatorWorld | undefined`

- [ ] **Step 1: Write the failing publication test**

```js
assert.deepEqual(CREATOR.worlds.map(({ index }) => index), ["01", "02", "03", "04", "05", "06"]);
assert.deepEqual(CREATOR.worlds.map(({ revealState }) => revealState), ["open", "open", "preview", "sealed", "sealed", "sealed"]);
assert.deepEqual(getPublishedCreatorWorlds(CREATOR.worlds).map(({ slug }) => slug), ["weins", "slyour", "the-xide"]);
assert.equal(getPublishedCreatorWorld("pawsona", CREATOR.worlds), undefined);
assert.deepEqual(CREATOR.worlds.filter((world) => projectRegistry.some((project) => project.slug === world.slug)), []);
```

- [ ] **Step 2: Run RED**

Run: `node --test tests/creator-publication.test.mjs`

Expected: module/import failure because the helpers and six-world registry do not exist.

- [ ] **Step 3: Implement state validation and fail-closed publication**

```ts
export const CREATOR_REVEAL_STATES = ["sealed", "glimpse", "preview", "open"] as const;
export type CreatorRevealState = (typeof CREATOR_REVEAL_STATES)[number];

export function canPublishCreatorDetail(world: CreatorWorld) {
  return (world.revealState === "preview" || world.revealState === "open")
    && world.route !== null
    && world.detail?.length === 6
    && world.media.length > 0
    && world.media.every(isVerifiedCreatorMedia);
}
```

Validation rejects publishable worlds without six detail sections or verified media, any non-publishable world with a route, and sealed worlds with media/live URLs.

- [ ] **Step 4: Add the six exact records to `content/creator.ts`**

Keep the canonical headline/supporting copy/action. Use the approved facts and these paths:

```ts
const mediaPaths = [
  "/creator/weins/hero-minimal.jpg",
  "/creator/weins/fabric-macro.jpg",
  "/creator/weins/look-01-silhouette.jpg",
  "/creator/slyour/hero-campaign.jpg",
  "/creator/slyour/look-02-crimson.jpg",
  "/creator/slyour/puffer-macro.jpg",
  "/creator/the-xide/hero-atmosphere.jpg",
  "/creator/the-xide/candle-packshot.jpg",
  "/creator/the-xide/botanical-strata.jpg",
];
```

Set only three internal routes and set every `liveUrl` to null. Validate the registry at module initialization.

- [ ] **Step 5: Replace obsolete empty-registry test assertions**

Preserve canonical brand checks while asserting six worlds and three publishable slugs.

- [ ] **Step 6: Run GREEN**

Run: `node --test tests/creator-publication.test.mjs tests/bmp-content.test.mjs tests/bmp-content-parity.test.mjs`

Expected: all focused tests pass.

- [ ] **Step 7: Commit**

```bash
git add tests/creator-publication.test.mjs lib/creator/reveal-state.ts lib/creator/publication.ts content/creator.ts content/index.ts tests/bmp-content.test.mjs tests/bmp-content-parity.test.mjs
git commit -m "feat: add creator world publication model"
```

---

### Task 2: Deterministic journey mathematics

**Files:**
- Create: `tests/creator-journey.test.mjs`
- Create: `lib/creator/journey.ts`

**Interfaces:**
- Produces: `CreatorJourneyState`
- Produces: `clampCreatorProgress(value): number`
- Produces: `getCreatorWorldProgress(globalProgress, worldCount): { activeIndex: number; worldProgress: number }`
- Produces: `getCreatorDirection(previous, current): -1 | 0 | 1`
- Produces: `getCreatorJourneyState(input): CreatorJourneyState`

- [ ] **Step 1: Write boundary and reverse-direction tests**

```js
assert.deepEqual(getCreatorWorldProgress(0, 6), { activeIndex: 0, worldProgress: 0 });
assert.deepEqual(getCreatorWorldProgress(1, 6), { activeIndex: 5, worldProgress: 1 });
assert.equal(getCreatorWorldProgress(0.5, 6).activeIndex, 3);
assert.equal(getCreatorDirection(0.7, 0.4), -1);
assert.equal(getCreatorDirection(0.4, 0.7), 1);
assert.equal(getCreatorDirection(0.4, 0.4), 0);
```

Cover every `1 / 6` transition and out-of-range clamping.

- [ ] **Step 2: Run RED**

Run: `node --test tests/creator-journey.test.mjs`

Expected: missing-module failure.

- [ ] **Step 3: Implement pure mapping**

```ts
const clamped = clampCreatorProgress(globalProgress);
const scaled = clamped * worldCount;
const activeIndex = Math.min(worldCount - 1, Math.floor(scaled));
const worldProgress = activeIndex === worldCount - 1 && clamped === 1
  ? 1
  : scaled - activeIndex;
```

Velocity is absolute progress delta divided by positive elapsed milliseconds; otherwise zero.

- [ ] **Step 4: Run GREEN and commit**

Run: `node --test tests/creator-journey.test.mjs`

```bash
git add tests/creator-journey.test.mjs lib/creator/journey.ts
git commit -m "feat: add deterministic creator journey state"
```

---

### Task 3: Semantic exhibition foundation

**Files:**
- Create: `tests/creator-markup.test.mjs`
- Create: `app/creator/layout.tsx`
- Create: `app/creator/creator.css`
- Create: `components/creator/CreatorExperience.tsx`
- Create: `components/creator/CreatorArrival.tsx`
- Create: `components/creator/CreatorWorldSequence.tsx`
- Create: `components/creator/CreatorThreshold.tsx`
- Create: `components/creator/CreatorIndex.tsx`
- Create: `components/creator/CreatorColophon.tsx`
- Create: `components/creator/CreatorJourneyController.tsx`
- Modify: `app/creator/page.tsx`
- Modify: `tests/bmp-pages.test.mjs`

**Interfaces:**
- Consumes: `CREATOR.worlds` and journey helpers
- Produces: `[data-creator-experience]`, `[data-creator-world]`, `[data-creator-threshold]`, `[data-creator-index]`

- [ ] **Step 1: Write failing route/markup tests**

Assert one `h1`, arrival copy, all ten arc markers, canonical six-world order, threshold copy, and `data-creator-products="6"`. Assert the route imports `CreatorExperience`, not `PageHero`, `EmptyState`, or BM Visual components.

- [ ] **Step 2: Run RED**

Run: `node --test tests/creator-markup.test.mjs tests/bmp-pages.test.mjs`

- [ ] **Step 3: Build the Server Component route tree**

```tsx
export default function CreatorPage() {
  return <div className="creator-page"><SiteHeader /><main><CreatorExperience worlds={CREATOR.worlds} /></main><SiteFooter /></div>;
}
```

Render Arrival, WorldSequence, Index, and Colophon in order. Include one client controller that returns `null`.

- [ ] **Step 4: Implement the one client controller**

Use passive scroll, resize, `matchMedia("(prefers-reduced-motion: reduce)")`, and one queued animation frame. Update only root datasets and CSS variables. Cleanup every listener and pending frame. Do not intercept wheel/touch or set scroll position.

- [ ] **Step 5: Establish route-scoped CSS**

Define Creator tokens, arrival rhythm, threshold, index, colophon, `overflow-x: clip`, focus states, mobile recomposition, and a reduced-motion block. Leave world-specific media physics for Tasks 4–5.

- [ ] **Step 6: Run GREEN and commit**

Run: `node --test tests/creator-markup.test.mjs tests/bmp-pages.test.mjs`

```bash
git add tests/creator-markup.test.mjs tests/bmp-pages.test.mjs app/creator components/creator/CreatorExperience.tsx components/creator/CreatorArrival.tsx components/creator/CreatorWorldSequence.tsx components/creator/CreatorThreshold.tsx components/creator/CreatorIndex.tsx components/creator/CreatorColophon.tsx components/creator/CreatorJourneyController.tsx
git commit -m "feat: build creator journey foundation"
```

---

### Task 4: Audited media and revealed worlds

**Files:**
- Create: nine files under `public/creator/{weins,slyour,the-xide}/`
- Create: `components/creator/CreatorMedia.tsx`
- Create: `components/creator/worlds/WeinsWorld.tsx`
- Create: `components/creator/worlds/SlyourWorld.tsx`
- Create: `components/creator/worlds/XideWorld.tsx`
- Modify: `components/creator/CreatorWorldSequence.tsx`
- Modify: `app/creator/creator.css`
- Modify: `tests/creator-markup.test.mjs`

**Interfaces:**
- Consumes: `CreatorWorld` and `CreatorMedia`
- Produces: three distinct revealed compositions plus a neutral missing-media artifact

- [ ] **Step 1: Add failing revealed-world tests**

Assert each component consumes its record, uses `next/image`, renders truthful headings, never embeds a source site, and only the WEINS opening image receives `priority`.

- [ ] **Step 2: Run RED**

Run: `node --test tests/creator-markup.test.mjs tests/creator-publication.test.mjs`

- [ ] **Step 3: Copy and verify audited assets**

Copy only the nine spec-listed images from the owned local repositories. Check destination format/dimensions with `file` and `sips`, then compare SHA-256 source/destination hashes.

- [ ] **Step 4: Implement the media fail-safe and world components**

`CreatorMedia` renders a labeled Next.js `<Image>` with responsive `sizes`; invalid media renders a neutral labeled artifact. WEINS uses structural planes, SLYOUR uses campaign/object overlap, and THE XIDE uses a low-light object altar and trace.

- [ ] **Step 5: Add distinct CSS physics**

Derive bounded `transform`, `clip-path`, and opacity from journey variables. Keep base content readable without JavaScript and reveal every layer in reduced motion.

- [ ] **Step 6: Run GREEN and commit**

Run: `node --test tests/creator-markup.test.mjs tests/creator-publication.test.mjs`

```bash
git add public/creator components/creator/CreatorMedia.tsx components/creator/worlds components/creator/CreatorWorldSequence.tsx app/creator/creator.css tests/creator-markup.test.mjs
git commit -m "feat: build revealed creator worlds"
```

---

### Task 5: Creator Veil and unrevealed wing

**Files:**
- Create: `components/creator/veil/CreatorVeil.tsx`
- Create: `components/creator/veil/VeilArtifact.tsx`
- Create: `components/creator/worlds/PawsonaWorld.tsx`
- Create: `components/creator/worlds/RelationshipWorld.tsx`
- Create: `components/creator/worlds/MinerWorld.tsx`
- Modify: `components/creator/CreatorWorldSequence.tsx`
- Modify: `app/creator/creator.css`
- Modify: `tests/creator-markup.test.mjs`

**Interfaces:**
- Produces: `CreatorVeil({ world, variant }: { world: CreatorWorld; variant: "cluster" | "timeline" | "strata" })`

- [ ] **Step 1: Write failing veil assertions**

Assert each sealed world has textual `SEALED`, no link/image, one unique veil variant, and `aria-hidden="true"` on all decorative layers.

- [ ] **Step 2: Run RED**

Run: `node --test tests/creator-markup.test.mjs`

- [ ] **Step 3: Implement the four-layer veil**

Render dark field, obscured form, light trace, and surface grain as one assistive-technology-hidden visual wrapper.

- [ ] **Step 4: Implement distinct sealed physics**

Pawsona uses warm clusters, Relationship uses temporal ticks/path, and Miner uses descending strata. Use no product/interface/gameplay copy or assets.

- [ ] **Step 5: Run GREEN and commit**

Run: `node --test tests/creator-markup.test.mjs tests/creator-publication.test.mjs`

```bash
git add components/creator/veil components/creator/worlds components/creator/CreatorWorldSequence.tsx app/creator/creator.css tests/creator-markup.test.mjs
git commit -m "feat: add creator veil and unrevealed wing"
```

---

### Task 6: Creator-specific detail experiences

**Files:**
- Create: `tests/creator-routes.test.mjs`
- Create: `app/creator/[slug]/page.tsx`
- Create: `components/creator/detail/CreatorDetailShell.tsx`
- Create: `components/creator/detail/ArtifactGallery.tsx`
- Create: `components/creator/detail/BuildState.tsx`
- Create: `components/creator/detail/NextWorld.tsx`
- Modify: `app/creator/creator.css`

**Interfaces:**
- Consumes: Creator publication helpers
- Produces: static params and metadata for only three public slugs

- [ ] **Step 1: Write failing route tests**

```js
for (const slug of ["weins", "slyour", "the-xide"]) assert.equal((await fetch(`${baseUrl}/creator/${slug}`)).status, 200);
for (const slug of ["pawsona", "relationship", "miner", "not-a-world"]) assert.equal((await fetch(`${baseUrl}/creator/${slug}`)).status, 404);
```

Also assert the eight Creator detail grammar markers and absence of `VISIT LIVE`.

- [ ] **Step 2: Run RED**

Run: `node --test tests/creator-routes.test.mjs`

- [ ] **Step 3: Implement fail-closed Next.js 16 routing**

```tsx
export const dynamicParams = false;
export function generateStaticParams() {
  return getPublishedCreatorWorlds(CREATOR.worlds).map(({ slug }) => ({ slug }));
}
export default async function CreatorDetailPage({ params }: PageProps<"/creator/[slug]">) {
  const { slug } = await params;
  const world = getPublishedCreatorWorld(slug, CREATOR.worlds);
  if (!world) notFound();
  return <CreatorDetailShell world={world} worlds={CREATOR.worlds} />;
}
```

Use the same lookup in `generateMetadata`.

- [ ] **Step 4: Implement the detail grammar**

Render ENTRY, six data-driven sections, artifact gallery, current state, next publishable world, and ENTER/EXIT. Render `VISIT LIVE` only when `liveUrl` is non-null; no record has it in V1.

- [ ] **Step 5: Add distinct detail art direction**

Theme through `data-creator-theme` for structural WEINS, energetic SLYOUR, and ritual THE XIDE. Do not import `components/case/**` or BM Visual CSS.

- [ ] **Step 6: Run GREEN and commit**

Run: `node --test tests/creator-routes.test.mjs tests/creator-publication.test.mjs`

```bash
git add tests/creator-routes.test.mjs app/creator/[slug]/page.tsx components/creator/detail app/creator/creator.css
git commit -m "feat: add creator detail experiences"
```

---

### Task 7: Responsive, accessibility, and regression QA

**Files:**
- Modify only when evidence requires it: Creator files from Tasks 1–6
- Modify: `tests/creator-markup.test.mjs`
- Modify: `tests/creator-routes.test.mjs`

- [ ] **Step 1: Add static quality assertions**

Assert semantic headings, textual states, native links, veil `aria-hidden`, responsive image `sizes`, one priority image, passive scroll, cleanup, no wheel handler, no Three.js import, and reduced-motion CSS.

- [ ] **Step 2: Run all automated checks**

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: every command exits zero.

- [ ] **Step 3: Browser-verify overview and details**

Inspect `/creator`, `/creator/weins`, `/creator/slyour`, and `/creator/the-xide`; check console errors first. At 360, 390, 768, 1024, and 1440 verify hierarchy, distinct worlds, threshold, veil quality, index clarity, usable targets, and no horizontal overflow.

- [ ] **Step 4: Verify interaction modes**

Use keyboard-only navigation. Emulate reduced motion. Scroll forward, reverse, and rapidly across boundaries; confirm state follows position and never sticks.

- [ ] **Step 5: Verify locked paths**

```bash
git diff main...HEAD -- app/gateway-prototype components/gateway lib/gateway app/bm-visual components/home components/work lib/projects/selected-work.ts
```

Expected: no output.

- [ ] **Step 6: Fix only verified Creator defects and repeat Step 2**

Keep fixes within Creator scope and commit only if QA changes files:

```bash
git add app/creator components/creator content/creator.ts lib/creator tests/creator-*.test.mjs tests/bmp-*.test.mjs public/creator
git commit -m "fix: polish creator responsive choreography"
```

---

### Task 8: Final verification, push, and handoff

**Files:**
- No planned source changes

- [ ] **Step 1: Run fresh verification**

Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `git diff --check main...HEAD`, and `git status --short --branch`. All commands must exit zero and the branch must be clean.

- [ ] **Step 2: Confirm scope and history**

Run `git log --oneline main..HEAD` and `git diff --name-status main...HEAD`. Confirm only Creator implementation/tests/assets and the requested spec/plan changed.

- [ ] **Step 3: Push without merging**

```bash
git push -u origin feat/bmp-creator-v1
```

- [ ] **Step 4: Report preview truthfully**

If an integration produces a branch preview, report its verified URL. Otherwise report that no preview URL was available; do not invent one.

- [ ] **Step 5: Write the session report**

Report completed work, exact verification results, remaining gaps, exact next action, pushed branch, and preview status. Leave the branch clean.
