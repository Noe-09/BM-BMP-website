# BMP Canonical Content Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the approved BMP brand document into a typed, canonical, accessible multi-page website without altering the frozen Gateway experience.

**Architecture:** A typed `content/` boundary owns canonical copy and publication status. Next.js App Router Server Components consume this data through a restrained shared BMP shell, while focused Client Components are used only for interaction. Existing concept-work components are migrated behind verified public status and honest Concept/Experiment labeling.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, CSS, Node test runner.

**Spec:** `docs/bmp-content/CONTENT-ARCHITECTURE.md`, `docs/bmp-content/ROUTE-MAP.md`, `docs/bmp-content/PROPOSED-CHANGES.md`, and `docs/bmp-content/IMPLEMENTATION-PHASES.md`

## Global Constraints

- `BMP_Website_Brand_Core_Content_Studio_08-09-2026.docx` remains the canonical copy source.
- Preserve the exact brand architecture `BMP / BM Visual / BM Tech / BMP Creator`.
- Preserve exact approved public copy; do not expose the BMP Content Studio master prompt.
- Do not invent claims, clients, metrics, awards, team size, ownership, or case-study outcomes.
- Every published Work record has a verified status from `Client Work | Concept | Demo | Experiment | Owned Product`.
- Home renders its eyebrow, canonical headline, supporting copy, and both CTAs immediately without waiting for motion, 3D, loaders, or canvas readiness.
- Capability destinations are authored surfaces within one BMP identity, not generic cards.
- Shared navigation is restrained, editorial, and brand-led.
- Keep `app/gateway-prototype/**`, `components/gateway/**`, `lib/gateway/**`, and `tests/gateway-*.test.mjs` untouched.
- Checkpoint every phase with focused tests and a commit.

---

### Task 1 Phase 0 Canonical content boundary

**Files:**
- Create: `tests/bmp-content.test.mjs`
- Create: `content/types.ts`
- Create: `content/brand.ts`
- Create: `content/navigation.ts`
- Create: `content/home.ts`
- Create: `content/about.ts`
- Create: `content/services.ts`
- Create: `content/creator.ts`
- Create: `content/work.ts`
- Create: `content/contact.ts`
- Create: `content/index.ts`
- Modify: `CLAUDE.md`

**Interfaces:**
- Produces: `ContentField<T>`, `ApprovedCopy<T>`, `StructuredData<T>`, `MissingContent`, `AssetReference`, `CTA`, `ProjectStatus`, `WorkCategory`, `WorkProject`, `getPublishedWorkProjects()`.
- Produces: `brand`, `navigation`, `home`, `about`, `services`, `creator`, `work`, and `contact` named exports.

- [ ] **Step 1: Read the test-writing rules**

Run: `sed -n '1,320p' /Users/noe/.codex/plugins/cache/openai-curated-remote/superpowers/6.3.0/skills/test-driven-development/writing-good-tests.md`

- [ ] **Step 2: Write the failing canonical-content test**

Add assertions that import all `content/*.ts` exports and verify:

```js
assert.equal(brand.shortPositioning.value, "Creative × Technology × Products.");
assert.equal(home.hero.headline.value, "We turn ideas and business problems into brands, systems, and digital products.");
assert.deepEqual(services.visual.groups.value, [
  "Brand identity & visual direction",
  "Website visual presentation / landing page creative direction",
  "Social media visual systems & content assets",
  "Marketing creatives / campaign visuals",
  "AI-assisted visual production & concept development",
  "Logo motion, intro/outro and lightweight motion assets",
]);
assert.deepEqual(work.categories.value, [
  "Brand & Visual",
  "Web & Digital Experience",
  "Systems & Automation",
  "Products by BMP",
  "Experiments",
]);
assert.deepEqual(creator.products, []);
assert.deepEqual(getPublishedWorkProjects([]), []);
```

Read all public route/component sources and assert that `You are BMP Content Studio` and `WHEN I GIVE YOU A TOPIC` do not appear.

- [ ] **Step 3: Run the test and verify RED**

Run: `node --test tests/bmp-content.test.mjs`

Expected: FAIL with module-not-found for `content/index.ts`.

- [ ] **Step 4: Implement status primitives and exact canonical modules**

Use a discriminated field type:

```ts
export type ContentField<T> =
  | { status: "APPROVED_COPY" | "STRUCTURED_DATA"; value: T; source: string; reviewNote?: string }
  | { status: "MISSING_CONTENT" | "NEEDS_ASSET"; value: null; source: string; reviewNote: string };

export type ProjectStatus =
  | "Client Work"
  | "Concept"
  | "Demo"
  | "Experiment"
  | "Owned Product";
```

Transcribe the exact Home, About, service, Creator, Contact, mission, vision, values, differentiators, audience, voice, Work taxonomy, and case-section labels from the DOCX. Encode the Creator product list as an empty typed array. `getPublishedWorkProjects()` returns only records with `publication.status === "verified"`, a verified project status, and all required public fields.

- [ ] **Step 5: Align repository guidance**

Replace only the obsolete BM Visual-only build-scope and BMP Technical prohibition in `CLAUDE.md` with the approved BMP sitemap and naming map. Preserve compatible design, engineering, accessibility, and Gateway safety instructions.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run: `node --test tests/bmp-content.test.mjs`

Expected: PASS.

Run: `npm run typecheck`

Expected: PASS.

- [ ] **Step 7: Canonical copy diff and checkpoint**

Compare every exported approved string with the extracted DOCX text, then run:

```bash
git diff --check
git add CLAUDE.md content tests/bmp-content.test.mjs
git commit -m "feat: add canonical BMP content boundary"
```

---

### Task 2 Phase 1 Routes and restrained shared shell

**Files:**
- Create: `tests/bmp-shell.test.mjs`
- Create: `components/site/SiteHeader.tsx`
- Create: `components/site/SiteFooter.tsx`
- Create: `components/site/PageHero.tsx`
- Create: `components/site/EmptyState.tsx`
- Create: `app/work/page.tsx`
- Create: `app/bm-visual/page.tsx`
- Create: `app/bm-tech/page.tsx`
- Create: `app/creator/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/bmp.css`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `tests/accessibility-markup.test.mjs`

**Interfaces:**
- Consumes: `navigation`, `brand`, and page content exports.
- Produces: shared `SiteHeader`, `SiteFooter`, `PageHero`, and `EmptyState` Server Components.

- [ ] **Step 1: Write failing route and shell tests**

Assert that every route file exists, imports canonical data, has one page-level heading, and uses the shared shell. Assert the header uses links for `/work`, `/bm-visual`, `/bm-tech`, `/creator`, `/about`, and `/contact`. Assert the shell does not contain `Solutions`, `Pricing`, `Platform`, or generic dropdown/menu-card markup.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/bmp-shell.test.mjs tests/accessibility-markup.test.mjs`

Expected: FAIL because routes and shared components are missing and the legacy accessibility assertion expects BM Visual-only descriptors.

- [ ] **Step 3: Implement the shared BMP shell and route skeletons**

Create a semantic header/footer driven by `content/navigation.ts`. Use `aria-label="Primary navigation"`, a visible keyboard focus state, and a compact mobile treatment that keeps the Contact destination available. Add static page metadata in each Server Component. Route skeletons render approved page headlines and no fabricated entries.

- [ ] **Step 4: Update root metadata and public guidance tests**

Set root metadata from canonical positioning:

```ts
title: { default: "BMP — Creative × Technology × Products", template: "%s — BMP" }
description: "BMP is a creative-tech studio turning business problems and ideas into brands, digital systems, and products."
```

Replace the obsolete BM Visual-only accessibility test with assertions for canonical names and semantic shared navigation.

- [ ] **Step 5: Add the shared visual foundation**

Add `app/bmp.css` with a restrained fixed/sticky brand-led header, editorial typography, strong rules, asymmetric grids, visible focus, reduced motion, and responsive behavior. Do not use generic rounded card grids, pills, dashboard motifs, neon, glassmorphism, or large agency menus.

- [ ] **Step 6: Run focused tests and checkpoint**

Run: `node --test tests/bmp-shell.test.mjs tests/accessibility-markup.test.mjs`

Run: `npm run typecheck && npm run lint`

Expected: all PASS.

```bash
git diff --check
git add app components/site tests/bmp-shell.test.mjs tests/accessibility-markup.test.mjs
git commit -m "feat: add BMP routes and shared shell"
```

---

### Task 3 Phase 2 Immediate-clear Home and capability worlds

**Files:**
- Create: `tests/bmp-home.test.mjs`
- Create: `components/home/BmpHero.tsx`
- Create: `components/home/CapabilityWorlds.tsx`
- Create: `components/home/ValueFramework.tsx`
- Modify: `app/page.tsx`
- Modify: `app/bmp.css`

**Interfaces:**
- Consumes: `home`, `brand`, and canonical navigation routes.
- Produces: semantic, immediate `BmpHero` and three `CapabilityWorlds` destination links.

- [ ] **Step 1: Write the failing Home contract test**

Assert the source contains the canonical eyebrow, headline, supporting copy, both CTA labels, three exact capability headings/supporting paragraphs, and links to approved destinations. Assert canonical hero copy is present in regular semantic markup rather than supplied only through a canvas, loader, timeout, or readiness state.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/bmp-home.test.mjs`

Expected: FAIL because the existing Home is BM Visual-only.

- [ ] **Step 3: Implement the semantic hero**

Render `Creative × Technology × Products`, the exact headline and supporting paragraph, `Explore our work`, and `Start a project` in the initial Server Component HTML. Use progressive CSS-only composition; do not gate content on JavaScript.

- [ ] **Step 4: Implement three destination worlds**

Create one shared editorial composition with three full-width/asymmetric destinations. BM Visual uses atmospheric image/color behavior, BM Tech uses precise structural lines, and BMP Creator uses product-oriented experimental indexing. Preserve exact copy and shared BMP type/spacing.

- [ ] **Step 5: Add value framework and restraint**

Render `Look better. Work better. Build something real.` as a transitional editorial statement, not three feature cards.

- [ ] **Step 6: Run focused tests and checkpoint**

Run: `node --test tests/bmp-home.test.mjs tests/bmp-content.test.mjs`

Run: `npm run typecheck && npm run lint`

Expected: all PASS.

```bash
git diff --check
git add app/page.tsx app/bmp.css components/home tests/bmp-home.test.mjs
git commit -m "feat: build canonical BMP home"
```

---

### Task 4 Phase 3 About services Creator and Contact

**Files:**
- Create: `tests/bmp-pages.test.mjs`
- Create: `components/site/ServiceIndex.tsx`
- Create: `components/site/ContactForm.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/bm-visual/page.tsx`
- Modify: `app/bm-tech/page.tsx`
- Modify: `app/creator/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/bmp.css`

**Interfaces:**
- Consumes: exact `about`, `services`, `creator`, and `contact` content exports.
- Produces: public service index, honest Creator empty state, and an accessible contact form whose submission remains inactive until configuration exists.

- [ ] **Step 1: Write failing page-copy and semantics tests**

Assert exact About paragraphs, highlight, `Understand / Define / Build / Review / Improve`, lean-team wording, both six-item service lists, Creator headline/supporting copy, Contact headline/body/fields, and CTA labels. Assert Creator has no fake product cards. Assert every form control has a label and the inactive submit control is disabled while submission is `MISSING_CONTENT`.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/bmp-pages.test.mjs`

Expected: FAIL because the skeleton pages do not contain complete canonical content and the old Contact page has no canonical form.

- [ ] **Step 3: Build About and division pages**

Render all canonical About copy faithfully. Build BM Visual as the expressive service surface and BM Tech as the structural service surface without adding services or claims. Service groups use semantic lists with outcome-led canonical supporting copy.

- [ ] **Step 4: Build honest Creator state**

Render the canonical Creator copy and CTA. When `creator.products` is empty, render the shared honest empty state and no invented product name, status, image, demo, or link.

- [ ] **Step 5: Build the Contact boundary**

Render the seven canonical fields with required state from data. Keep the canonical submit button disabled while `contact.submission.status === "MISSING_CONTENT"`. Retain the existing verified Zalo, LinkedIn, and Facebook links as separate direct-contact paths without presenting them as canonical form destinations.

- [ ] **Step 6: Run focused tests and checkpoint**

Run: `node --test tests/bmp-pages.test.mjs tests/bmp-content.test.mjs`

Run: `npm run typecheck && npm run lint`

Expected: all PASS.

```bash
git diff --check
git add app/about app/bm-visual app/bm-tech app/creator app/contact components/site app/bmp.css tests/bmp-pages.test.mjs
git commit -m "feat: add canonical BMP destination pages"
```

---

### Task 5 Phase 4 Verified Work hub and reusable case studies

**Files:**
- Create: `tests/bmp-work.test.mjs`
- Create: `components/work/WorkIndex.tsx`
- Modify: `content/work.ts`
- Modify: `lib/projects/selected-work.ts`
- Modify: `lib/projects/project-cases.ts`
- Modify: `components/case/ProjectCasePage.tsx`
- Modify: `components/case/CaseHero.tsx`
- Modify: `components/case/CaseScenes.tsx`
- Modify: `components/case/NextProject.tsx`
- Modify: `app/work/page.tsx`
- Modify: `app/work/[slug]/page.tsx`
- Modify: `tests/project-cases.test.mjs`
- Modify: `app/bmp.css`
- Modify: `app/case.css`

**Interfaces:**
- Consumes: canonical Work categories/schema and existing concept assets/copy.
- Produces: verified public `ProjectStatus` on every Work record, honest category/status labels, and reusable canonical case-section structure.

- [ ] **Step 1: Verify existing project evidence**

For Fabriclism, Aurelia Skin, Haven, and Æther, check local asset existence, current repository labeling, live URL response, absence of client language, and absence of metrics/results claims. Record only supported status: `Concept` for the first three and `Experiment` for Æther unless contrary evidence is found. If a record fails verification, keep it draft and omit it from public output.

- [ ] **Step 2: Write failing Work publication tests**

Test that invalid/unverified records are excluded, every returned public record has one approved `ProjectStatus`, and source/project markup visibly renders status. Replace legacy assertions for `Concept Project` and `Experimental Concept` with `Concept` and `Experiment`.

- [ ] **Step 3: Run the test and verify RED**

Run: `node --test tests/bmp-work.test.mjs tests/project-cases.test.mjs`

Expected: FAIL because the old registry uses non-canonical status labels and the Work index is incomplete.

- [ ] **Step 4: Migrate verified project records**

Add publication verification, canonical status, canonical category mapping, challenge, created output, hero assets, supported qualitative outcome, and case fields. Preserve concept framing and existing source copy; never convert a concept into client work. Missing case fields remain `MISSING_CONTENT` and do not receive invented prose.

- [ ] **Step 5: Build Work index and adapt case routes**

Render canonical Work headline, intro, categories, project status, challenge, what BMP created, hero media, supported outcome, and View project/See process CTA. Case pages use canonical section labels: The challenge, The direction, What we built, Why it matters, Next. Unknown or unpublished slugs call `notFound()`.

- [ ] **Step 6: Run focused tests and checkpoint**

Run: `node --test tests/bmp-work.test.mjs tests/project-cases.test.mjs tests/selected-work-interaction.test.mjs`

Run: `npm run typecheck && npm run lint`

Expected: all PASS.

```bash
git diff --check
git add content/work.ts lib/projects app/work components/work components/case app/bmp.css app/case.css tests
git commit -m "feat: build verified BMP work hub"
```

---

### Task 6 Phases 5 and 6 gap reconciliation and full QA

**Files:**
- Create: `tests/bmp-content-parity.test.mjs`
- Modify: `docs/bmp-content/CONTENT-GAPS.md`
- Modify: `docs/bmp-content/ASSET-REQUIREMENTS.md`
- Modify: `docs/bmp-content/PROPOSED-CHANGES.md` only if an actual deviation was introduced
- Modify: focused public CSS/components only when QA exposes a tested defect

**Interfaces:**
- Consumes: all public content modules and routes.
- Produces: a final canonical parity check and current unresolved-gap inventory.

- [ ] **Step 1: Write the failing parity test**

Assert all locked lines, CTAs, Work categories, service arrays, lean-team wording, project status labels, and route links. Assert public sources contain none of: `You are BMP Content Studio`, `Funnel stage`, `Nano Banana image prompts`, invented metric patterns, `Concept Project`, or `Experimental Concept`.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/bmp-content-parity.test.mjs`

Expected: FAIL on any remaining legacy naming/copy or missing route contract. If it passes immediately, strengthen it against the identified legacy source before continuing.

- [ ] **Step 3: Resolve tested parity defects and reconcile audits**

Fix only evidence-backed mismatches. Update gap and asset documents so resolved entries are removed and unresolved contact, proof, metadata, and Creator gaps remain explicit.

- [ ] **Step 4: Run the complete automated verification**

Run: `npm test`

Run: `npm run typecheck`

Run: `npm run lint`

Run: `npm run build`

Expected: all commands exit 0 with no test failures, type errors, lint errors, or build errors.

- [ ] **Step 5: Verify the public site in a browser**

Start the development server and inspect `/`, `/work`, every published `/work/[slug]`, `/bm-visual`, `/bm-tech`, `/creator`, `/about`, and `/contact` at desktop and mobile widths. Check headings, navigation, focus order, form labels/disabled state, image loading/alt text, reduced-motion behavior, console errors, and first-view Home clarity.

- [ ] **Step 6: Verify the frozen Gateway**

Confirm `git diff origin/main -- app/gateway-prototype components/gateway lib/gateway tests/gateway-*.test.mjs` is empty. Smoke-test all three Gateway routes without changing them.

- [ ] **Step 7: Final content diff and checkpoint**

Re-extract the canonical DOCX text and compare all approved public strings. Run unsupported-claim and internal-prompt scans, then:

```bash
git diff --check
git add docs/bmp-content tests/bmp-content-parity.test.mjs
git commit -m "test: verify BMP canonical content integration"
```
