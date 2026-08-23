# BM Visuals Flagship Batch 2 Execution Plan

**Scope:** Selected Work only. Preserve the approved Batch 1 hero/manifesto and every downstream homepage section; stop before Batch 3.

## Files to create

- `lib/projects/selected-work.ts` — typed, centralized data for Fabriclism, Aurelia, HAVEN, and ÆTHER.
- `lib/work/interaction.ts` — deterministic scrub/reveal/scene-progress helpers shared by the four variants.
- `components/work/SelectedWork.tsx` — semantic Selected Work entry, shared scene lifecycle, and project-world handoff.
- `components/work/SelectedProject.tsx` — shared intro/meta/action shell.
- `components/work/variants/LookbookProject.tsx` — Fabriclism pointer/swipe scrub.
- `components/work/variants/LiquidProject.tsx` — Aurelia pointer/touch/scroll lens.
- `components/work/variants/EditorialProject.tsx` — HAVEN scroll-led magazine rhythm.
- `components/work/variants/SpatialProject.tsx` — ÆTHER DOM/CSS exploded-to-aligned depth.
- `app/work.css` — all Selected Work composition, transitions, breakpoints, and reduced-motion styling.
- `tests/selected-work-interaction.test.mjs` — pure interaction/scene mapping coverage.
- `public/projects/fabriclism/campaign.webp`
- `public/projects/fabriclism/home.webp`
- `public/projects/fabriclism/collection.webp`
- `public/projects/fabriclism/product.webp`
- `public/projects/fabriclism/mobile.webp`
- `public/projects/aether/hero.webp`
- `public/projects/aether/specimen.webp`
- `public/projects/aether/deconstructed.webp`

## Files to modify

- `app/page.tsx` — replace only the conventional project stack with `SelectedWork`.
- `app/home.css` — strengthen the manifesto-to-work overlap without redesigning Batch 1.
- `app/motion.css` — add project-world theme tokens and contextual cursor-label support.
- `app/globals.css` — import the new Selected Work stylesheet.
- `components/motion/ContextCursor.tsx` — preserve Default/View/Explore modes while allowing scene-specific text labels.

## Execution order

1. Write failing tests for scrub/reveal/progress mapping, then implement the shared interaction helpers.
2. Capture and optimize a small truthful Fabriclism/ÆTHER asset set; reuse existing Aurelia and HAVEN assets.
3. Build the shared semantic project shell and four distinct responsive variants.
4. Integrate theme/cursor handoffs and the manifesto-to-Fabriclism entry.
5. Run the full command suite and browser-check all required viewports, fine/coarse pointer, reduced motion, `/#work`, links, overflow, and console output.
6. Commit and push `codex/bm-flagship-batch-2`, open a PR into `main`, do not merge, and report the Vercel Preview state.

## Dependency decision

Add none. Three.js remains hero-only; Selected Work uses React, DOM/CSS, existing BM motion physics, and browser-native observers/events.
