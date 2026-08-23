# BM Visuals Flagship Batch 3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the BM case-study system and three production-ready concept cases, then replace the conventional post-Selected-Work homepage with authored Capabilities, Studio/Process, closing CTA, and ending choreography.

**Architecture:** Keep one canonical project registry for facts shared by homepage and case routes. Add case-only narrative data keyed by canonical slugs, render it through a static App Router route and shared semantic case primitives, and preserve distinct art direction through three `caseVariant` compositions. Homepage-to-case animation remains a progressive enhancement around native links, while all motion reuses the Batch 1 physics/profile/theme system.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Next/Image, CSS, existing vanilla Three.js hero only, Node test runner.

**Spec:** `C:/Users/boson/Downloads/2026-08-23-bm-visuals-flagship-design.md` plus the approved Batch 3 request in `C:/Users/boson/.codex/attachments/6d39a075-71e3-4fa7-975b-2077a1c4a55b/pasted-text.txt`

## Global Constraints

- Batch 3 only. Do not start Batch 4 and do not redesign Batch 1 hero/manifesto or Batch 2 project worlds.
- Ready case routes are exactly `/work/fabriclism`, `/work/aurelia-skin`, and `/work/aether`.
- HAVEN stays homepage-only: no case route, no final live-proof action, and no provisional case data.
- Shared facts (`title`, `year`, `status`, `disciplines`, `liveUrl`) have one canonical source.
- Concept status must be explicit; never invent clients, testimonials, awards, business metrics, or outcomes.
- Use real approved project assets and truthful captures from live projects only.
- Add no Lenis, GSAP, Framer Motion, R3F, animation library, smooth-scroll system, or new WebGL dependency.
- Keep Three.js limited to the existing homepage hero; case routes use DOM/CSS.
- Motion uses existing timings: micro 150–300 ms, component 400–700 ms, scene 800–1400 ms.
- Native links and direct URLs remain authoritative; transition animation cannot gate route correctness.
- Preserve semantic headings, keyboard focus, touch behavior, meaningful alt text, and reduced-motion quality.
- Required responsive verification: 1440×900, 1280×800, 1024×768, 768×1024, 390×844, 375×812.

---

### Task 1: Canonical project and case-data architecture

**Files:**
- Modify: `lib/projects/selected-work.ts`
- Modify: `tsconfig.json` — permit explicit `.ts` source imports used by the repository's native Node test runner.
- Create: `lib/projects/project-cases.ts`
- Create: `tests/project-cases.test.mjs`

**Interfaces:**
- `ProjectRecord`: canonical shared facts, homepage interaction metadata, and preview assets.
- `ProjectCase`: case-only `thesis`, `description`, `caseVariant`, `heroAsset`, `sections`, `responsiveAssets`, and `nextSlug`.
- `getProject(slug)`, `getProjectCase(slug)`, `getProjectCaseSlugs()`, `getNextProjectCase(slug)`.
- `selectedProjects`: derived ordered homepage projection from the canonical registry.

- [ ] **Step 1: Write failing architecture tests**

```js
test("ready case slugs exclude HAVEN", () => {
  assert.deepEqual(getProjectCaseSlugs(), ["fabriclism", "aurelia-skin", "aether"]);
});

test("case facts resolve from the canonical project record", () => {
  const caseStudy = getProjectCase("aether");
  assert.equal(caseStudy.project.status, "Experimental Concept");
  assert.equal(caseStudy.project.liveUrl, "https://aether-app-cyan.vercel.app/");
});

test("next-world order skips unfinished HAVEN", () => {
  assert.equal(getNextProjectCase("fabriclism").project.slug, "aurelia-skin");
  assert.equal(getNextProjectCase("aurelia-skin").project.slug, "aether");
  assert.equal(getNextProjectCase("aether").project.slug, "fabriclism");
});
```

- [ ] **Step 2: Run `npm test` and confirm failure because the case module is absent**
- [ ] **Step 3: Refactor canonical facts and implement case lookup/next-world helpers**
- [ ] **Step 4: Add case narratives without duplicating canonical project facts**
- [ ] **Step 5: Run `npm test` and confirm all data tests pass**

### Task 2: Shared static case route and semantic primitives

**Files:**
- Create: `app/work/[slug]/page.tsx`
- Create: `app/case.css`
- Create: `components/case/ProjectCasePage.tsx`
- Create: `components/case/CaseHero.tsx`
- Create: `components/case/CaseScenes.tsx`
- Create: `components/case/NextProject.tsx`
- Modify: `app/motion.css`

**Interfaces:**
- `generateStaticParams()` returns `getProjectCaseSlugs().map(slug => ({ slug }))`.
- `generateMetadata({ params })` returns truthful concept-work title/description and calls `notFound()` for an unknown slug.
- `ProjectCasePage({ caseStudy })` owns route navigation, six-scene semantic ordering, commercial CTA, and next world.
- `CaseScenes({ caseStudy })` selects Fabriclism/Aurelia/ÆTHER composition by `caseVariant` while preserving shared `<section>` contracts.

- [ ] **Step 1: Read the installed Next.js 16 dynamic-route and metadata guides under `node_modules/next/dist/docs/`**
- [ ] **Step 2: Implement static params, async params handling, metadata, and `notFound()`**
- [ ] **Step 3: Implement shared case navigation, hero, live CTA, sales-layer link, and next-world link as semantic DOM**
- [ ] **Step 4: Add route-scoped theme tokens and mobile/reduced-motion CSS without importing Three.js**
- [ ] **Step 5: Run `npm run typecheck` and `npm run build`; confirm all three static routes are generated and `/work/haven` is absent**

### Task 3: Progressive homepage-to-case navigation

**Files:**
- Create: `components/motion/ProjectTransitionLink.tsx`
- Modify: `components/work/SelectedProject.tsx`
- Modify: `components/work/variants/LookbookProject.tsx`
- Modify: `components/work/variants/LiquidProject.tsx`
- Modify: `components/work/variants/SpatialProject.tsx`
- Modify: `app/work.css`
- Modify: `lib/work/interaction.ts`
- Modify: `tests/selected-work-interaction.test.mjs`
- Modify: `lib/projects/selected-work.ts`

**Interfaces:**
- `ProjectTransitionLink` renders a real Next `<Link href>` and intercepts only an unmodified primary-pointer activation when JavaScript is ready and reduced motion is off.
- Modified clicks, middle clicks, keyboard activation, `target`, downloads, direct URL loads, and reduced motion use native navigation.
- The enhancement clones only visual presentation into an `aria-hidden` fixed overlay; route push begins independently and is never contingent on `transitionend`.
- `[data-project-transition-source]` identifies a real homepage media source without changing the existing project interaction.

- [ ] **Step 1: Add a pure `shouldEnhanceProjectNavigation` policy and failing tests for modified clicks, keyboard detail, reduced motion, and primary clicks**
- [ ] **Step 2: Run `npm test` and confirm the new policy tests fail**
- [ ] **Step 3: Implement the semantic link, bounded overlay animation, cleanup timeout, and immediate routing fallback**
- [ ] **Step 4: Add primary internal case action plus quieter external live action for Fabriclism, Aurelia, and ÆTHER; keep HAVEN actionless**
- [ ] **Step 5: Mark transition sources in only the three ready project variants**
- [ ] **Step 6: Run lint, typecheck, and keyboard/modifier-focused browser checks**

### Task 4: Fabriclism flagship case

**Files:**
- Modify: `components/case/CaseScenes.tsx`
- Modify: `app/case.css`
- Create from truthful live captures: `public/projects/fabriclism/mobile-home.webp`
- Create from truthful live captures: `public/projects/fabriclism/mobile-collection.webp`
- Create from truthful live captures: `public/projects/fabriclism/mobile-product.webp`

**Interfaces:**
- Fabriclism uses six sections with stable IDs: `identity`, `idea`, `experience`, `motion`, `responsive`, `live`.
- Existing campaign/home/collection/product assets remain primary; new mobile files must be captures from the live URL at an actual mobile viewport.
- The motion scene demonstrates real recorded states through controlled media progression; it does not invent interfaces or metrics.

- [ ] **Step 1: Capture only missing mobile proof from `https://demo-fabriclism.vercel.app/` at a real mobile viewport and optimize to WebP**
- [ ] **Step 2: Build the cinematic identity and editorial thesis scenes**
- [ ] **Step 3: Build a paced HOME/COLLECTION/PRODUCT/MOBILE experience breakdown rather than a four-image grid**
- [ ] **Step 4: Build one focused motion-system scene using real navigation/product/media states**
- [ ] **Step 5: Build the responsive composition and `DON'T JUST LOOK AT IT. USE IT.` live close**
- [ ] **Step 6: Verify the case remains legible and complete with scripts disabled/reduced motion**

### Task 5: Concise Aurelia and ÆTHER cases

**Files:**
- Modify: `components/case/CaseScenes.tsx`
- Modify: `app/case.css`
- Create from a truthful live capture: `public/projects/aether/mobile.webp`

**Interfaces:**
- Aurelia uses existing optimized hero, commerce, detail, and mobile media but excludes testimonial/result proof and unsupported claims.
- ÆTHER uses existing hero/specimen/deconstructed media, explicit `Experimental Concept` status, and no additional canvas.
- Both preserve the shared six-part route rhythm while using shorter content and distinct art direction.

- [ ] **Step 1: Build Aurelia identity, clinical-clarity × ritual-softness thesis, commerce, liquid language, responsive, and live scenes**
- [ ] **Step 2: Build ÆTHER identity, object-precedes-wearer thesis, specimen, deconstruction, responsive, and laboratory CTA scenes**
- [ ] **Step 3: Capture and optimize one actual ÆTHER mobile state for responsive proof**
- [ ] **Step 4: Verify neither case contains fabricated metrics, testimonials, awards, or client language**
- [ ] **Step 5: Verify next-world navigation Fabriclism → Aurelia → ÆTHER → Fabriclism**

### Task 6: Kinetic Capabilities and ÆTHER handoff

**Files:**
- Create: `components/home/CapabilitiesIndex.tsx`
- Create: `lib/home/ending.ts`
- Create: `tests/home-ending.test.mjs`
- Create: `tests/accessibility-markup.test.mjs`
- Create: `app/ending.css`
- Modify: `app/page.tsx`
- Modify: `app/motion.css`

**Interfaces:**
- `CAPABILITIES`: six typed capability rows, each referencing an existing optimized `ProjectAsset` as proof.
- `getProcessStepIndex(progress, count)` provides deterministic progress behavior.
- `CapabilitiesIndex` exposes one active semantic button at a time through hover, focus, and click/tap; proof remains readable without JavaScript.

- [ ] **Step 1: Write failing tests for capability order/proof integrity and process progress clamping**
- [ ] **Step 2: Run `npm test` and confirm failure before adding `lib/home/ending.ts`**
- [ ] **Step 3: Implement the six-row capability data and pure process helper**
- [ ] **Step 4: Replace the old philosophy/capability rows with the kinetic index and a single shared proof viewport using existing optimized project media**
- [ ] **Step 5: Choreograph the ÆTHER background/grid retreat into BM graphite/paper capability language via `data-scene-theme`**
- [ ] **Step 6: Add mobile tap behavior, keyboard focus activation, and reduced-motion static selection**

### Task 7: Studio/Process, closing CTA, footer, and contact continuity

**Files:**
- Create: `components/home/StudioProcess.tsx`
- Create: `components/home/ClosingScene.tsx`
- Modify: `app/page.tsx`
- Modify: `app/ending.css`
- Modify: `app/site.css`
- Modify: `app/contact/page.tsx`

**Interfaces:**
- `StudioProcess` renders three editorial principles and an ordered `UNDERSTAND → DIRECTION → DESIGN → BUILD → REFINE` sequence.
- Desktop scroll and focus update one active process step; mobile provides readable tap/focus controls; reduced motion renders a strong static sequence.
- `ClosingScene` uses the approved copy, one `/contact` link, CSS thread/ribbon layers, bounded pointer depth, and a scroll/ambient mobile equivalent.

- [ ] **Step 1: Build the concise, honest Studio positioning and three operating principles without card UI**
- [ ] **Step 2: Implement the integrated process sequence with IntersectionObserver/RAF work limited to the visible scene**
- [ ] **Step 3: Build the full closing scene with lightweight line/thread motifs echoing the hero and no canvas**
- [ ] **Step 4: Replace the old closing and retain a minimal utility footer**
- [ ] **Step 5: Align `/contact` copy/colors only where needed for a coherent handoff; do not add forms, CRM, database, or booking**
- [ ] **Step 6: Remove only obsolete lower-homepage CSS selectors made dead by this replacement**

### Task 8: Fresh verification, performance review, and delivery

**Files:**
- Modify only Batch 3 files above if verification exposes a regression.

**Interfaces:**
- No runtime interface; this task produces evidence and the final Git/Vercel delivery.

- [ ] **Step 1: Run `git diff --check`**
- [ ] **Step 2: Run `rg -n '^(<<<<<<<|=======|>>>>>>>)' --glob '!node_modules/**' --glob '!.next/**' --glob '!.git/**' .` and confirm no markers**
- [ ] **Step 3: Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` from the final tree**
- [ ] **Step 4: Browser-test `/`, all three case routes, and `/contact` at all six required viewport sizes**
- [ ] **Step 5: Verify fine pointer, coarse/touch, reduced motion, keyboard traversal, direct routes, refresh, live links, next-world links, overflow, image loading, console, hydration, and error overlays**
- [ ] **Step 6: Inspect initial homepage/case media requests, hero Three.js isolation from case routes, lazy below-fold media, video/RAF behavior, and listener cleanup**
- [ ] **Step 7: Run the React best-practices review for modified TSX components and fix Batch 3 issues**
- [ ] **Step 8: Commit Batch 3 on `codex/bm-flagship-batch-3`, push to origin, create a PR into `main`, do not merge, and wait for/report Vercel Preview status**
