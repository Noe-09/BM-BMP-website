# BM Visuals Flagship Batch 3.5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace obsolete Coffee proof with truthful final HAVEN captures, make HAVEN a first-class case route, and insert it into the existing Batch 3 case sequence.

**Architecture:** Keep shared HAVEN facts in `lib/projects/selected-work.ts`; add only HAVEN’s case-specific narrative, assets, variant, SEO, and next route in `lib/projects/project-cases.ts`. Reuse the editorial Selected Work scene, progressive `ProjectTransitionLink`, generic case renderer, semantic markup, and DOM/CSS-only case system; add only a HAVEN theme treatment to the existing CSS.

**Tech Stack:** Next.js App Router, React, TypeScript, Next/Image, CSS, existing motion utilities, Node test runner.

**Spec:** `C:\Users\boson\.codex\attachments\397f45f4-f699-4c69-9607-05c8f94d6230\pasted-text.txt`

## Global Constraints

- Integrate HAVEN only; do not redesign the homepage, existing three cases, capabilities architecture, Studio/Process, ClosingScene, hero, or global cursor.
- HAVEN is a `Concept Project`; do not claim a client, results, awards, operational business, or metrics.
- Reuse final live experience captures only; do not reuse old Coffee media as current flagship proof, invent UI, iframe HAVEN, add WebGL, or add dependencies.
- Case facts are canonical registry data; case registry contains only narrative, media, `caseVariant`, SEO, and next-world data.
- Preserve native navigation, modified-click behavior, keyboard navigation, direct URLs, and reduced-motion fallbacks.
- Test desktop/tablet/mobile, touch/coarse pointer, reduced motion, semantic headings, focus, overflow, and image loading.

---

### Task 1: Capture and validate final HAVEN proof media

**Files:**
- Create: `public/projects/haven/{hero,ritual,menu,no01,space,commerce,mobile}.webp`

- [ ] Capture seven optimized images from actual final HAVEN desktop/mobile states: hero, Morning Ritual, Menu, No.01, Space, Commerce, and mobile.
- [ ] Keep the dimensions appropriate to the existing editorial and case compositions; retain readable project UI/text and do not create or preserve obsolete Coffee proof as the selected-work source.
- [ ] Inspect generated dimensions and byte sizes before using them.

### Task 2: Extend canonical HAVEN and case data (TDD)

**Files:**
- Modify: `tests/project-cases.test.mjs`
- Modify: `lib/projects/selected-work.ts`
- Modify: `lib/projects/project-cases.ts`

- [ ] Write tests asserting HAVEN canonical facts, live URL, ready static case route, all live URLs, and Fabriclism → Aurelia → HAVEN → ÆTHER → Fabriclism.
- [ ] Run `npm test` and confirm the tests fail because HAVEN is not a ready case.
- [ ] Update the canonical record with the approved status, year, disciplines, concise description, live URL, action/cursor labels, and final media paths.
- [ ] Add only case-specific HAVEN narrative with `haven` variant, truthful scene copy, six-section data, SEO description, and `aether` next slug; change Aurelia’s next slug to HAVEN.
- [ ] Run `npm test` and confirm the data contract passes.

### Task 3: Connect the existing homepage and case renderer

**Files:**
- Modify: `components/work/variants/EditorialProject.tsx`
- Modify: `app/case.css`
- Modify: `app/work.css`

- [ ] Mark the visible HAVEN editorial hero media as `data-project-transition-source="haven"`; preserve current image lag/crop choreography and actions supplied by `SelectedProject`.
- [ ] Add a restrained `haven` case and Next World theme: espresso/paper tones, serif-led typography, warm photographic presentation, and dedicated responsive composition without altering other project variants.
- [ ] Use existing generic scenes for identity, idea, ritual sequence, editorial commerce, responsive proof, and live close; avoid new route or animation primitives.

### Task 4: Verify the complete integration and deliver it

**Files:**
- Modify only the files above if verification finds a Batch 3.5 regression.

- [ ] Run `git diff --check` and a conflict-marker scan.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- [ ] Browser-test `/`, all four case routes, and final HAVEN at 1440×900, 1280×800, 1024×768, 768×1024, 390×844, and 375×812; test direct `/work/haven`, refresh, actions, Next World links, keyboard navigation, coarse pointer, reduced motion, overflow, console, and broken images.
- [ ] Commit only Batch 3.5 files on `codex/bm-flagship-batch-3-5`, push, create a PR into `main`, do not merge, and report the Vercel Preview result.
