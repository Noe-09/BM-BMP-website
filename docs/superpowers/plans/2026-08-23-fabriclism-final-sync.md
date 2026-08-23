# Fabriclism Final Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace BM Visuals' obsolete Fabriclism V1 portfolio evidence and copy with a truthful representation of the final Personal Uniform experience, while retaining the existing BM project-world and case-study architecture.

**Architecture:** Keep shared project facts in `lib/projects/selected-work.ts`; keep only Fabriclism-specific narrative and case media in `lib/projects/project-cases.ts`. Reuse the existing five-frame lookbook, generic case scenes, Next/Image delivery, keyboard/scrub behavior, and capability proof system. Capture final production states as optimized local assets and remove only superseded Fabriclism V1 assets after all references move.

**Tech Stack:** Next.js 16, React 19, TypeScript, existing CSS motion system, Node test runner, browser production captures.

**Spec:** `C:\Users\boson\.codex\attachments\a062ffa5-802a-469e-a8cd-56c0f550a2dd\pasted-text.txt`

## Global Constraints

- Work only on the `codex/fabriclism-final-sync` branch created from the latest `origin/main`.
- Preserve the approved BM homepage, hero, manifesto, capabilities, studio, closing CTA, navigation, and every Aurelia, HAVEN, and AETHER project record/case/asset.
- Keep Fabriclism as an unofficial `Concept Project`; add no fabricated client relationship, performance claim, inventory claim, endorsement, or official F/W 026 claim.
- Preserve the existing semantic lookbook controls, fine/coarse-pointer behavior, reduced-motion behavior, and real external live link.
- Use only local, truthful production captures from `https://demo-fabriclism.vercel.app/`; do not embed the live site or add dependencies.
- Retain the existing horizontal five-frame lookbook interaction and case-study component system; make CSS changes only if the new captures create a demonstrated crop problem.

---

### Task 1: Establish regression coverage for the final Fabriclism facts

**Files:**
- Modify: `tests/project-cases.test.mjs`
- Modify: `tests/accessibility-markup.test.mjs`

**Interfaces:**
- Consumes: `projectRegistry`, `getProjectCase`, the existing `LookbookProject` source.
- Produces: executable protection for the final canonical facts, five-frame sequence, case narrative, and data-driven accessible lookbook label.

- [ ] **Step 1: Write failing assertions for the final registry and case facts**

  Add a focused Fabriclism test which asserts the four disciplines, Personal Uniform description, `Campaign / State / Uniform Index / Build a Uniform / Commerce` labels, the final positioning/thesis/SEO, and the live heading.

- [ ] **Step 2: Write a failing static accessibility assertion**

  Assert that `LookbookProject` derives its group label from `project.title` and the preview asset count, rather than containing a hard-coded Fabriclism V1 descriptor.

- [ ] **Step 3: Run the targeted tests and confirm they fail for the obsolete V1 data**

  Run: `node --test tests/project-cases.test.mjs tests/accessibility-markup.test.mjs`

  Expected: failures identify the old Fabriclism disciplines/copy/labels and the hard-coded lookbook text.

- [ ] **Step 4: Commit the red test only if it is independently reviewable**

  Do not commit a deliberately failing test separately when its corresponding data and assets must change in the same reviewable commit.

### Task 2: Capture and install truthful final project media

**Files:**
- Create: `public/projects/fabriclism/campaign.webp`
- Create: `public/projects/fabriclism/state.webp`
- Create: `public/projects/fabriclism/uniform-index.webp`
- Create: `public/projects/fabriclism/material.webp`
- Create: `public/projects/fabriclism/builder.webp`
- Create: `public/projects/fabriclism/product.webp`
- Create: `public/projects/fabriclism/interlude.webp`
- Create: `public/projects/fabriclism/title-sequence.webp` when a clean first-session title frame is obtainable
- Create: `public/projects/fabriclism/mobile-state.webp`
- Create: `public/projects/fabriclism/mobile-index.webp`
- Create: `public/projects/fabriclism/mobile-product.webp`
- Delete after reference scan: `public/projects/fabriclism/home.webp`
- Delete after reference scan: `public/projects/fabriclism/collection.webp`
- Delete after reference scan: `public/projects/fabriclism/mobile.webp`
- Delete after reference scan: `public/projects/fabriclism/mobile-home.webp`
- Delete after reference scan: `public/projects/fabriclism/mobile-collection.webp`

**Interfaces:**
- Consumes: final production scenes and responsive routes at `demo-fabriclism.vercel.app`.
- Produces: local source-of-truth media paths used by the project registry, case registry, and capability proof data.

- [ ] **Step 1: Capture composed desktop states from a fresh production session at 1440 x 900**

  Save real browser screenshots of the state selector, campaign, Uniform Index, Material Study, dark Uniform Builder, product route `/product/058-corefit-tee`, and the `NO FINAL FORM` interruption. Capture the title sequence only if its first-session timing yields a clean full-viewport frame.

- [ ] **Step 2: Capture actual mobile states at 390 x 844**

  Save real responsive screenshots for the state selector, Uniform Index, and product route; capture the mobile builder only when it improves evidence already needed by the case.

- [ ] **Step 3: Encode the browser captures as local WebP files at a quality that retains interface text**

  Keep desktop long edges near 1600px when practical and retain the 390 x 844 mobile source ratio. Verify dimensions and mime signatures before references change.

- [ ] **Step 4: Verify every obsolete V1 file has zero remaining references before deleting it**

  Run an exhaustive `rg` reference scan for each old filename. Do not affect non-Fabriclism assets.

### Task 3: Sync the canonical registry, case narrative, and existing capability proofs

**Files:**
- Modify: `lib/projects/selected-work.ts`
- Modify: `lib/projects/project-cases.ts`
- Modify: `lib/home/ending.ts`
- Modify: `components/work/variants/LookbookProject.tsx`
- Modify only if capture QA demonstrates a crop issue: `app/work.css`

**Interfaces:**
- Consumes: the Task 2 assets and `ProjectRecord.previewAssets`.
- Produces: one canonical Fabriclism record for homepage/case shared facts; a case-only Personal Uniform narrative; capability proof references to refreshed local assets; an accessible, data-derived lookbook label.

- [ ] **Step 1: Update only the Fabriclism canonical record**

  Set its four approved disciplines, exact Personal Uniform description, final live URL/action/cursor data, and five preview assets in this order: Campaign, State, Uniform Index, Build a Uniform, Commerce. Use final-specific, descriptive alt text.

- [ ] **Step 2: Replace only the Fabriclism case narrative and media mapping**

  Use the approved Personal Uniform positioning, thesis, SEO, campaign hero, state-first idea, four-item experience breakdown, `Cut. Drag. / Layer.` motion section, genuine mobile responsive proof, and `Enter the world. / Build your own.` live scene. Keep the next project as Aurelia.

- [ ] **Step 3: Update capability proof data without changing the capability layout**

  Point the existing ecommerce proof to `uniform-index.webp` and retain the product proof with a final-production alt. Do not alter capability copy, order, or presentation.

- [ ] **Step 4: Remove the hard-coded V1 lookbook accessibility copy**

  Derive the group label from `project.title` and `project.previewAssets.length`; retain the current keyboard, pointer, swipe, and reduced-motion behavior.

- [ ] **Step 5: Make a CSS adjustment only if real capture QA exposes a Fabriclism crop defect**

  Restrict any change to case-specific/object-position behavior in the existing lookbook presentation. Do not redesign Selected Work or other project worlds.

- [ ] **Step 6: Run targeted tests and confirm the final facts are green**

  Run: `node --test tests/project-cases.test.mjs tests/accessibility-markup.test.mjs`

  Expected: PASS with the final Personal Uniform assertions and no hard-coded V1 lookbook descriptor.

### Task 4: Verify, commit, publish, and inspect the preview

**Files:**
- Verify: all Task 1–3 files only.

- [ ] **Step 1: Search for stale active Fabriclism V1 concepts and asset references**

  Run the specified stale-copy search plus an asset-reference scan; retain only historical plan text where it is not active presentation.

- [ ] **Step 2: Run repository verification**

  Run: `git diff --check`, conflict-marker scan, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

- [ ] **Step 3: Visually verify the homepage and Fabriclism case**

  Inspect `/` and `/work/fabriclism` at 1440 x 900, 1280 x 800, 768 x 1024, and 390 x 844. Confirm five-frame scrub labels, fine/coarse controls, responsive captures, case crop, live link, and unchanged Aurelia next-world handoff.

- [ ] **Step 4: Commit and push the completed bounded integration**

  Commit with `feat: sync Fabriclism final experience across BM Visuals`, push `codex/fabriclism-final-sync`, then create a pull request against `main` if the connected GitHub tooling is available.

- [ ] **Step 5: Verify the Vercel preview and merge only when automatic permission is available**

  Use the connected deployment preview to repeat the live QA. If merge/deployment authority is not available, leave the PR merge-ready and report the exact remaining external action.
