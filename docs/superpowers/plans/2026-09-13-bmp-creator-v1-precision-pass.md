# BMP Creator V1 Precision Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the approved Creator WORLD PORTALS experience sharp, controlled, and seamless through bounded visual damping, credible media delivery, distinct typography chroma, and optically stable presence frames.

**Architecture:** Keep native scroll and raw geometry authoritative while one client controller damps only visual progress. Refine existing portal CSS rather than replacing the chapter architecture, and make image quality/sizing explicit per media role using verified owned assets only.

**Tech Stack:** Next.js 16.3.1 App Router, React 19, TypeScript, CSS, Node test runner, Next/Image

**Spec:** `docs/superpowers/specs/2026-09-13-bmp-creator-v1-precision-pass-design.md`

## Global Constraints

- Work only on `feat/bmp-creator-v1`; do not merge to `main`.
- Preserve native scrolling and raw semantic state.
- Do not modify Gateway, BM Visual, unrelated BMP surfaces, or Creator publication/reveal-state architecture.
- Do not add Lenis, GSAP, WebGL, or another smooth-scroll dependency.
- Use only verified owned media; do not generate or upscale assets.
- Use small meaningful commits and verify continuously.

---

### Task 1: Bounded visual-progress rendering

**Files:**
- Modify: `lib/creator/journey.ts`
- Modify: `components/creator/CreatorJourneyController.tsx`
- Test: `tests/creator-journey.test.mjs`
- Test: `tests/creator-markup.test.mjs`

**Interfaces:**
- Produces: `dampCreatorVisualProgress(current, target, elapsedMs, options?)`
- Produces: `{ value: number; settled: boolean }` with bounded, reversible behavior
- Consumes: raw per-chapter progress from browser geometry

- [x] Add failing pure-function tests for equivalent elapsed-time behavior,
      large-gap catch-up, direction reversal, invalid input, and convergence.
- [x] Run the focused journey test and confirm the new assertions fail because
      the damping export does not exist.
- [x] Implement the minimal pure damping helper.
- [x] Re-run the focused test and confirm it passes.
- [x] Add failing controller markup assertions for separate target/rendered
      variables, reduced-motion bypass, continued settling RAF, and cleanup.
- [x] Refactor the controller to keep per-chapter target/rendered refs, use raw
      values for semantics, and stop RAF after convergence.
- [x] Run Creator journey/markup tests, typecheck, and lint.
- [x] Commit as `perf: smooth creator visual progress rendering`.

### Task 2: Transform-first portal geometry and presence plateaus

**Files:**
- Modify: `app/creator/creator.css`
- Test: `tests/creator-markup.test.mjs`

**Interfaces:**
- Consumes: `--portal-target-progress`, `--portal-progress`, and
  `--portal-presence` from Task 1
- Produces: stable approach / presence / departure compositions using transform
  and opacity

- [x] Add failing behavioral contract assertions that portal CSS does not
      continuously animate WEINS slab width, SLYOUR campaign left, or full-image
      WEINS/XIDE clip paths.
- [x] Confirm the focused test fails against the current CSS.
- [x] Convert WEINS slab expansion to `scaleX`/translate, keep crop geometry
      static, and remove difference blending from the title.
- [x] Convert SLYOUR campaign travel from `left` to translate while retaining
      its static editorial crop.
- [x] Replace XIDE's animated image clip with stable overflow geometry and
      transform/opacity.
- [x] Add bounded presence-plateau variables that stabilize each revealed
      world's dominant media around chapter midpoint.
- [x] Tune mobile and reduced-motion compositions to remain static and sharp.
- [x] Run Creator tests and typecheck.
- [x] Commit as `perf: resolve creator portal presence geometry`.

### Task 3: Creator image-delivery policy

**Files:**
- Modify: `components/creator/CreatorMedia.tsx`
- Modify: `components/creator/CreatorArrival.tsx`
- Modify: `components/creator/worlds/WeinsWorld.tsx`
- Modify: `components/creator/worlds/SlyourWorld.tsx`
- Modify: `components/creator/worlds/XideWorld.tsx`
- Modify: `components/creator/detail/ArtifactGallery.tsx`
- Modify: `next.config.ts`
- Test: `tests/creator-markup.test.mjs`

**Interfaces:**
- Produces: `quality?: 88 | 92` on `CreatorMedia`
- Produces: Next.js image quality allowlist `[75, 88, 92]`

- [x] Add failing component tests for explicit primary/secondary quality and
      realistic transformed `sizes` values.
- [x] Confirm the tests fail because CreatorMedia has no quality contract.
- [x] Add the quality prop and pass it to Next/Image without changing fallback
      behavior or eager/lazy semantics.
- [x] Configure the Next.js 16 quality allowlist.
- [x] Apply quality 92 to arrival/primary portal media and quality 88 to
      secondary portal/detail media.
- [x] Correct `sizes` after the geometry reductions, avoiding global overserve.
- [x] Run Creator tests, typecheck, lint, and a production build.
- [x] Commit as `fix: correct creator portal image delivery`.

### Task 4: Verified WEINS asset correction

**Files:**
- Add: `public/creator/weins/look-04-proportion.jpg`
- Modify: `content/creator.ts`
- Delete: `public/creator/weins/look-01-silhouette.jpg`
- Test: `tests/creator-publication.test.mjs`
- Test: `tests/creator-markup.test.mjs`

**Interfaces:**
- Consumes: verified source at
  `/Users/noe/Documents/GitHub/Weins/public/assets/lookbook/look-04-proportion.jpg`
- Produces: distinct WEINS portal secondary media with SHA-256
  `dcbcb7acf838ae7ded642c3243efbb97b02905645ced31d7d10264ca786cf112`

- [x] Add a failing registry test requiring distinct WEINS portal sources and
      the verified proportion asset.
- [x] Confirm it fails against the duplicate current asset.
- [x] Copy the audited source, verify its hash and dimensions, update src/alt/
      label, and remove the duplicate file.
- [x] Run Creator publication and markup tests.
- [x] Commit as `fix: restore distinct verified WEINS media`.

### Task 5: World typography chroma and optical hierarchy

**Files:**
- Modify: `app/creator/creator.css`
- Modify: `components/creator/worlds/PawsonaWorld.tsx`
- Modify: `components/creator/worlds/RelationshipWorld.tsx`
- Modify: `components/creator/worlds/MinerWorld.tsx`
- Test: `tests/creator-markup.test.mjs`

**Interfaces:**
- Produces: per-world palette tokens/classes for title, metadata, status, and
  accent hierarchy

- [x] Add failing assertions that each world exposes a distinct chroma hook and
      that WEINS does not depend on difference blending.
- [x] Confirm the assertions fail for the repeated sealed-world treatment.
- [x] Implement the approved graphite/chalk, warm-ink/crimson, bone/copper,
      spectral-green, cool-blue-grey, and oxide systems.
- [x] Tune title scale/weight and metadata contrast so XIDE remains object-first
      and sealed worlds remain distant.
- [x] Run Creator tests, typecheck, and lint.
- [x] Commit as `refactor: refine creator typography chroma`.

### Task 6: Optical and responsive verification

**Files:**
- Modify only Creator files if evidence reveals a defect
- Record evidence outside production source as screenshots/log output

**Interfaces:**
- Consumes: completed Tasks 1–5
- Produces: verified branch preview and final checkpoint

- [x] Run all 151+ tests, typecheck, lint, and production build.
- [x] Start the local production or development server and perform the required
      browser load/error check before further QA.
- [x] Inspect `/creator` at 1440, 1024, 768, 390, and 360 CSS pixels, including
      DPR 2 where supported.
- [x] Test slow wheel scroll, fast scroll, immediate reverse, stop/settle,
      direct anchors, refresh, keyboard, reduced motion, fallback, and overflow.
- [x] Inspect campaign-quality presence frames for WEINS, SLYOUR, and THE XIDE;
      tune only evidence-backed Creator defects using test-first fixes.
- [x] Verify BM Visual and Gateway have no source diff and visually smoke-test
      BM Visual for regression.
- [x] Re-run the full automated suite after final tuning.
- [x] Push `feat/bmp-creator-v1`, obtain the Vercel branch deployment, and
      verify the preview returns HTTP 200 with the new commit.
- [x] Report root causes, controller/CSS/media changes, source and rendered
      dimensions, quality policy, palette changes, test evidence, commit SHAs,
      preview URL, and remaining perceptual weaknesses.
