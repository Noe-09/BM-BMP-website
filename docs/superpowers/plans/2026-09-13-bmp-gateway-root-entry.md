# BMP Gateway Production Root Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the approved Gateway the production root, preserve the former Home at `/studio`, and add a returning-session replay affordance without changing the cinematic system.

**Architecture:** Keep `GatewayPrototype` as the single client orchestrator, move route ownership and its stylesheet to the root page, redirect the former prototype route, and model replay as a guarded reducer event plus an in-memory journey reset. Separate identity navigation (`/studio`) from world switching (`/`) through typed navigation content used by existing headers and footers.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Three.js, CSS, Node test runner

**Spec:** `docs/superpowers/specs/2026-09-13-bmp-gateway-root-entry-design.md`

## Fixed constraints

- Base is `origin/main` at `1ea5d4b2f6184f57438118ec4dc88d2ea55228df`, which contains merged PR #22.
- Preserve all approved Gateway geometry, colors, authored chapter timing, autoplay profile, Impossible Core, release, final chamber, Three Worlds selection, briefing, navigation, and interaction semantics.
- Keep direct routes direct; introduce no middleware wall and no fourth world.
- Keep `bmGatewaySeen` session-scoped and write it only at the existing meaningful commit boundary.
- Replay must not navigate or mutate browser storage.
- Follow red/green TDD and commit stable milestones separately.

---

### Task 1: Lock production route and metadata contracts

**Files:**
- Create: `tests/gateway-root-routing.test.mjs`
- Modify: `tests/gateway-markup.test.mjs`
- Modify: `tests/bmp-shell.test.mjs`

- [ ] Write failing source and HTTP regressions proving `/` owns Gateway metadata, `/studio` owns the old Home, `/gateway-prototype` redirects to `/`, direct routes do not redirect, and Gateway CSS has one canonical owner.
- [ ] Add metadata assertions for an indexable canonical root and distinct indexable Studio title, both using canonical brand positioning.
- [ ] Run the focused tests and confirm they fail for the pre-migration route structure.

### Task 2: Migrate Home and Gateway route ownership

**Files:**
- Create: `app/studio/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/gateway-prototype/page.tsx`
- Move: `app/gateway-prototype/gateway.css` → `app/gateway.css`
- Modify: `app/gateway-prototype/review/page.tsx`
- Modify: `app/gateway-prototype/technical/page.tsx`
- Modify: affected Gateway markup tests

- [ ] Move the existing Home imports and JSX unchanged to `/studio` and add distinct Studio metadata from `BRAND.positioning`.
- [ ] Render `GatewayPrototype` at `/` with production metadata and the canonical stylesheet import.
- [ ] Redirect `/gateway-prototype` to `/` with `redirect()` so preview rollback is not permanently cached.
- [ ] Retarget internal development routes/tests to the single `app/gateway.css` file without duplicating CSS.
- [ ] Run focused routing, markup, and shell tests to green; commit the route migration.

### Task 3: Separate identity and world-switching navigation

**Files:**
- Modify: `content/navigation.ts`
- Modify: `components/site/SiteHeader.tsx`
- Modify: `components/site/SiteFooter.tsx`
- Modify: `components/site/BMVisualHeader.tsx`
- Modify: `components/site/BMVisualFooter.tsx`
- Modify: navigation/shell tests as required

- [ ] Write failing tests for BMP identity → `/studio`, explicit `Switch World` → `/`, and unchanged direct links.
- [ ] Add typed identity and Gateway navigation entries; apply them deliberately to shared and BM Visual headers/footers with the smallest existing-design-compatible link addition.
- [ ] Verify every informational/division route remains direct and no blind `href="/"` replacement occurred.
- [ ] Run focused navigation and page tests to green; commit the navigation migration.

### Task 4: Add deterministic returning-session replay

**Files:**
- Modify: `lib/gateway/state.ts`
- Modify: `components/gateway/GatewayPrototype.tsx`
- Modify: `components/gateway/SelectionOverlay.tsx`
- Modify: `app/gateway.css`
- Modify: `tests/gateway-state.test.mjs`
- Modify: `tests/gateway-markup.test.mjs`

- [ ] Write failing reducer and markup tests for returning-only replay, valid neutral-chamber guards, state cleanup, accessible button semantics, and no storage deletion/navigation.
- [ ] Add `REPLAY_JOURNEY` to the reducer, accepted only for a returning neutral split/preview state.
- [ ] Reset only in-memory journey/briefing/selection refs and visual progress, dispatch replay, and wake the existing single animation loop.
- [ ] Render a visually secondary `REPLAY JOURNEY` button only for returning neutral selection; keep it reachable by keyboard/touch.
- [ ] Verify replay completes through the existing deterministic journey path and leaves the session marker intact.
- [ ] Run focused state, journey, navigation, and markup tests to green; commit replay.

### Task 5: Full automated verification and browser QA

**Files:**
- Create or update: `docs/gateway-root-entry/verification.md`

- [ ] Run `node --test --test-concurrency=1 tests/*.test.mjs`.
- [ ] Run `tsc --noEmit`.
- [ ] Run `eslint .`.
- [ ] Run `next build --webpack`.
- [ ] Run `git diff --check`.
- [ ] Start the production build and browser-test desktop first visit, returning session, replay, three hover/focus previews, briefing Go Back/Continue, direct routes, touch viewport, reduced motion, and `/gateway-prototype` redirect.
- [ ] Confirm one canvas, no console/runtime/WebGL errors, and unchanged scene budget tests.
- [ ] Record exact results and remaining naming debt; run final clean-tree and scope preflight.
- [ ] Commit verification evidence.

### Task 6: Preview PR delivery

- [ ] Push `feat/bmp-gateway-root-entry` to origin.
- [ ] Open a PR targeting `main` with the approved routing/session scope and exact verification evidence.
- [ ] Wait for Vercel Preview to reach READY, inspect build logs for real errors, and smoke-test the deployed root, Studio, redirect, direct routes, session return, and replay.
- [ ] Report branch, base/head SHAs, PR and Vercel identifiers/URLs, routing/session/replay/navigation/metadata changes, files, verification, browser QA, and known weaknesses.
- [ ] Do not merge; stop for human visual review.
