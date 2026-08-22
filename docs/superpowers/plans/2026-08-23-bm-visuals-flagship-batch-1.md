# BM Visuals Flagship Batch 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved BM Visuals Batch 1 foundation, hybrid hero, contextual cursor, manifesto bridge, and theme choreography without redesigning downstream homepage sections.

**Architecture:** Keep `app/page.tsx` as a Server Component and isolate the interactive opening inside one client-side `HeroSequence`. Load vanilla Three.js only through a client-only dynamic import; drive DOM and WebGL from one small physics module and capability profile, with CSS fallbacks for reduced motion and unavailable WebGL.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS, Three.js, Node test runner.

**Spec:** `C:/Users/boson/Downloads/2026-08-23-bm-visuals-flagship-design.md`

## Global Constraints

- Batch 1 only: no BMP Technical, BM Gateway, Fabriclism, case studies, or Selected Work redesign.
- Motion durations: micro 150–300 ms, component 400–700 ms, scene 800–1400 ms.
- Ordinary motion stays near translate 4–24 px, rotate 0.5–3 degrees, scale 1–1.04.
- Preserve semantic DOM copy, keyboard focus, coarse-pointer equivalents, and reduced-motion quality.
- Code-split Three.js and constrain WebGL to the hero.

---

### Task 1: Restore a runnable preserved homepage baseline

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/site.css`

- [ ] Remove committed merge-conflict markers by retaining the simpler pre-conflict Selected Work and downstream sections from `HEAD^`.
- [ ] Run `npm run lint`, `npm run typecheck`, and `npm run build`; confirm conflict-related failures are gone before adding the feature.

### Task 2: Add test-first motion and interaction foundations

**Files:**
- Create: `tests/motion-physics.test.mjs`
- Create: `lib/motion/physics.ts`
- Create: `lib/motion/useInteractionProfile.ts`
- Create: `components/motion/ContextCursor.tsx`
- Create: `components/motion/SceneThemeController.tsx`
- Create: `app/motion.css`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `package.json`

**Interfaces:**
- `MOTION`: shared duration/easing/amplitude tokens.
- `clamp01(value)`, `damp(current, target, smoothing, delta)`, `getSceneProgress(...)`: deterministic motion helpers.
- `resolveInteractionProfile(...)` and `useInteractionProfile()`: fine/coarse/reduced-motion capability contract.
- `[data-cursor="view|explore"]` and `[data-scene-theme]`: declarative cursor/theme hooks for later batches.

- [ ] Write failing tests for clamping, time-correct damping, scene progress, and reduced/coarse precedence.
- [ ] Run `npm test` and confirm failure because the production module is absent.
- [ ] Implement the minimal physics/profile module and rerun `npm test` to green.
- [ ] Add the cursor, theme observer, CSS tokens/utilities, and global mounting points.

### Task 3: Build the hybrid hero and manifesto bridge

**Files:**
- Create: `components/home/HeroSequence.tsx`
- Create: `components/home/HeroCanvas.tsx`
- Create: `app/home.css`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- `HeroSequence`: semantic hero + manifesto scene with scroll CSS variables and fine-pointer depth.
- `HeroCanvas`: dynamically imported, hero-only Three.js scene with an original folded-ribbon BM object.

- [ ] Install only `three` and its TypeScript definitions; add no animation framework.
- [ ] Implement the semantic editorial composition and CSS fallback object.
- [ ] Implement the code-split Three.js folded-ribbon object, bounded pointer response, mobile scroll/ambient response, visibility pausing, and cleanup.
- [ ] Choreograph the hero exit into the short manifesto and expose scene-theme attributes for later Selected Work scenes.
- [ ] Preserve every section after the manifesto unchanged.

### Task 4: Verify quality and completion

**Files:**
- Modify only files above if verification finds Batch 1 regressions.

- [ ] Run the React/Next best-practices checklist, focusing on bundle isolation, listener cleanup, hydration, and accessibility.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` from a clean result.
- [ ] Start the production app and verify 1440×900, 1280×800, 1024×768, 768×1024, 390×844, and 375×812.
- [ ] Verify fine pointer, coarse/touch emulation, and `prefers-reduced-motion` with screenshots, overflow checks, semantic content, and error-overlay/console checks.
- [ ] Inspect the production route output to confirm Three.js is isolated to a lazy hero chunk.
