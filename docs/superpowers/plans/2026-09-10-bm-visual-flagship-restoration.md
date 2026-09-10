# BM Visual Flagship Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the existing rich BM Visual flagship experience at `/bm-visual` inside the approved BMP master-brand architecture.

**Architecture:** Keep the route as a Server Component that reads canonical content and passes serializable values into the existing interactive flagship components. Reconnect the original styles and interaction systems, curate shared verified Work data, and add BMP-aware division chrome without touching the frozen Gateway.

**Tech Stack:** Next.js 16.3.1 App Router, React 19.2.8, TypeScript, Three.js, global CSS, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-10-bm-visual-flagship-restoration-design.md`

## Global Constraints

- Branch from `68e6eab24acc0705081ff39a94496bc878909923`; never modify or merge `main`.
- Canonical public BM Visual copy comes from `content/services.ts` and must remain exact.
- Reuse `HeroSequence`, `HeroCanvas`, `SelectedWork`, `CapabilitiesIndex`, `StudioProcess`, `ClosingScene`, `app/home.css`, and `app/ending.css`.
- Reuse verified assets and shared Work/case-study records; do not duplicate project data.
- Preserve responsive, reduced-motion, pointer, scroll, keyboard, and semantic fallback behavior.
- Make the BMP master-brand relationship and routes back to BMP explicit.
- Do not modify `app/gateway-prototype/**`, `components/gateway/**`, `lib/gateway/**`, or `tests/gateway-*.test.mjs`.

---

### Task 1: Flagship regression boundary

**Files:**
- Modify: `tests/bmp-pages.test.mjs`

**Interfaces:**
- Consumes: rendered `/bm-visual` HTML from the existing Next.js integration harness.
- Produces: a regression assertion for flagship regions, canonical copy, BMP navigation, and shared Work links.

- [ ] **Step 1: Make the existing integration harness use webpack in this runtime**

Add `"--webpack"` to the `next dev` argument list in `tests/bmp-pages.test.mjs`; direct baseline diagnosis proved the default Turbopack server accepts connections but does not return route responses in this bundled runtime, while webpack returns HTTP 200.

- [ ] **Step 2: Write the failing flagship regression test**

Extend the BM Visual route assertion to require literal rendered markers:

```js
for (const section of ["hero", "selected-work", "capabilities", "studio", "closing"]) {
  assert.ok(html.includes(`data-bm-visual-section="${section}"`), section);
}
for (const href of ["/", "/work", "/bm-tech", "/creator", "/about", "/contact"]) {
  assert.match(html, new RegExp(`href="${href.replace("/", "\\/")}"`));
}
for (const slug of ["fabriclism", "aurelia-skin", "haven", "aether"]) {
  assert.match(html, new RegExp(`href="/work/${slug}"`));
}
```

Keep the existing exact canonical headline, supporting copy, six groups, and CTA assertions.

- [ ] **Step 3: Run the test and confirm RED**

Run:

```bash
node --test tests/bmp-pages.test.mjs
```

Expected: FAIL because the current minimal route does not render `data-bm-visual-section="hero"` or any other flagship region.

### Task 2: Canonical flagship composition

**Files:**
- Modify: `app/bm-visual/page.tsx`
- Create: `components/site/BMVisualHeader.tsx`
- Create: `components/site/BMVisualFooter.tsx`
- Modify: `components/home/HeroSequence.tsx`
- Modify: `components/home/ClosingScene.tsx`
- Modify: `components/work/SelectedWork.tsx`

**Interfaces:**
- Consumes: `SERVICES.visual`, `NAVIGATION`, and the shared verified project registry.
- Produces: a Server Component route with all five flagship region markers and serializable canonical props for interactive children.

- [ ] **Step 1: Recompose the route**

Import `../../home.css` and `../../ending.css`, render the BMP-aware division header/footer, and compose the existing flagship components in this order:

```tsx
<BMVisualHeader />
<main className="home-page bm-visual-flagship">
  <HeroSequence headline={...} supportingCopy={...} action={...} />
  <SelectedWork />
  <CapabilitiesIndex groups={...} />
  <StudioProcess />
  <ClosingScene action={...} />
</main>
<BMVisualFooter />
```

- [ ] **Step 2: Adapt hero copy without changing its motion architecture**

Define serializable props for `headline`, `supportingCopy`, and `action`. Render the exact canonical headline for assistive technology and split only the aria-hidden visual treatment for choreography. Replace obsolete `BM Visuals` and standalone-division language with `BMP / BM Visual` wording.

- [ ] **Step 3: Adapt the closing scene CTA**

Accept `{ label: string; href: string }`, render `Improve your visual presence`, and keep the existing motif, pointer depth, mobile scroll equivalent, and contact destination.

- [ ] **Step 4: Preserve shared selected Work**

Filter the existing verified registry to projects whose categories include `Brand & Visual` or `Web & Digital Experience`, render the existing four project variants, and add the `selected-work` region marker without copying records.

- [ ] **Step 5: Add division-specific BMP chrome**

Render `BMP / BM Visual` as the identity link to `/`; use `NAVIGATION` destinations for Work, BM Tech, BMP Creator, About Us, and Contact. Keep the flagship typographic treatment and keyboard-visible links.

### Task 3: Canonical capabilities and studio semantics

**Files:**
- Modify: `components/home/CapabilitiesIndex.tsx`
- Modify: `components/home/StudioProcess.tsx`
- Modify: `lib/home/ending.ts`
- Modify: `app/home.css`
- Modify: `app/ending.css`

**Interfaces:**
- Consumes: the six `SERVICES.visual.groups.value` strings passed from the Server Component.
- Produces: six interactive capability rows using canonical titles plus existing verified proof media; region markers and BMP-aware copy for studio/process.

- [ ] **Step 1: Separate canonical capability titles from presentation proof**

Keep six proof records in `lib/home/ending.ts`, but remove legacy title ownership. Add a pure `getVisualCapabilities(groups)` adapter that pairs each canonical label with its existing detail and verified proof by index and preserves `01` through `06` numbering.

- [ ] **Step 2: Feed canonical groups into the interactive index**

Change `CapabilitiesIndex` to accept `groups: readonly string[]`, call the adapter, preserve hover/focus/click state, and add `data-bm-visual-section="capabilities"`.

- [ ] **Step 3: Mark and rename studio presentation**

Add `data-bm-visual-section="studio"`, replace public `BM Visuals` naming with `BM Visual`, retain the existing ordered process controls and truthful design/motion/craft principles.

- [ ] **Step 4: Scope BMP division chrome styles**

Add only the CSS needed for the BMP-aware division header/footer and canonical hero wrapping. Retain existing responsive and `prefers-reduced-motion` blocks; do not flatten project or capability compositions.

- [ ] **Step 5: Run the integration test and confirm GREEN**

Run:

```bash
node --test tests/bmp-pages.test.mjs
```

Expected: all BM Visual, BM Tech, About, Creator, and Contact route assertions pass.

### Task 4: Engineering and visual verification

**Files:**
- Modify only files required to resolve verified defects found in this task's scope.

**Interfaces:**
- Consumes: completed route and regression boundary.
- Produces: verified desktop/mobile/reduced-motion/keyboard behavior and production-ready branch state.

- [ ] **Step 1: Run focused and broad tests**

Run the new BM Visual integration test, interaction tests, accessibility test, content parity tests, case tests, and all non-Gateway tests. Run the Gateway tests without editing them.

- [ ] **Step 2: Run static checks and production build**

Run the repository's TypeScript, ESLint, and production-build commands with the explicit bundled Node runtime.

- [ ] **Step 3: Inspect in a real browser**

Start the app, inspect `/bm-visual` at 1440px desktop and approximately 390px mobile, emulate reduced motion, tab through navigation/capability/process/case/CTA controls, verify case destinations, and check the browser console.

- [ ] **Step 4: Verify Gateway zero diff**

Run:

```bash
git diff --exit-code 68e6eab24acc0705081ff39a94496bc878909923 -- app/gateway-prototype components/gateway lib/gateway 'tests/gateway-*.test.mjs'
```

Expected: exit code 0 with no output.

- [ ] **Step 5: Review and commit**

Review the complete diff for canonical copy, truthfulness, scope, generated files, and Gateway exclusions; then create small meaningful commits.

### Task 5: Preview-ready pull request

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: verified commits on `fix/restore-bm-visual-flagship`.
- Produces: pushed branch, open non-merged pull request, and Vercel Preview URL.

- [ ] **Step 1: Push the branch**

```bash
git push -u origin fix/restore-bm-visual-flagship
```

- [ ] **Step 2: Create the pull request**

Create a PR targeting `main` with root cause, systems restored, canonical adaptations, verification evidence, and explicit Gateway-frozen confirmation.

- [ ] **Step 3: Obtain preview URL**

Read the Vercel deployment/check attached to the PR, wait for it to become ready, and return its Preview URL without merging the PR.
