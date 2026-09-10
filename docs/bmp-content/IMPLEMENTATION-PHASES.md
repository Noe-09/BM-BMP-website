# BMP Canonical Content Integration Phases

Implementation begins only after the first review gate is approved. Each phase ends with focused tests and a review checkpoint.

## Recommended approach

Use a content-first retrofit of the existing Next.js App Router site. Preserve the strong layout, motion, project, and accessibility primitives where they fit; replace the BM Visual-only information architecture with a typed BMP content boundary and shared public shell. Do not rebuild the site from scratch and do not integrate Gateway in this branch.

Alternatives considered:

1. Build a second site under `/bmp`. This reduces immediate changes but duplicates navigation, metadata, styles, and long-term maintenance while making BMP look secondary.
2. Rebuild every route and component. This provides maximum visual freedom but discards proven responsive, motion, and case-study work and raises regression risk.

The content-first retrofit is recommended because it follows the canonical architecture with the smallest coherent production change.

## Phase 0 Canonical content extraction and models

- Align the obsolete BM Visual-only scope in `CLAUDE.md` if Proposal 6 is approved.
- Add typed status and content-field primitives.
- Add brand, navigation, Home, About, services, Creator, Work, and Contact modules.
- Encode canonical public copy verbatim and exclude Content Studio instructions.
- Add tests that assert locked copy, category lists, service lists, CTA labels, empty Creator state, and no internal prompt exposure.
- Add the required verified project-status classification and prevent incomplete or unverified Work records from publishing.
- Checkpoint: content-diff review against the DOCX.

## Phase 1 Routing and shared page architecture

- Create the approved App Router directories.
- Add shared BMP header, footer, page hero, CTA, and empty-state primitives using existing UI foundations.
- Update root metadata from BM Visual-only language to canonical BMP positioning.
- Keep route files as Server Components and isolate interaction in Client Components.
- Checkpoint: all canonical routes render, navigation is keyboard-accessible, and frozen Gateway tests remain unchanged and passing.

## Phase 2 Home

- Recompose the root page around the exact canonical hero and three capability blocks.
- Render canonical positioning and both CTAs immediately; motion, 3D, loaders, and experimental layers may not gate or obscure them.
- Present the three capabilities as strong destination surfaces within one BMP identity, not as generic SaaS/service cards.
- Link capability blocks and CTAs to approved routes.
- Checkpoint: exact-copy test, semantic heading review, responsive hero review, and reduced-motion review.

## Phase 3 About services Creator and Contact

- Build About with the full approved narrative, highlight, five-step process, and lean-team wording.
- Build BM Visual and BM Tech with exact supporting copy and service lists.
- Build BMP Creator as an owned-product proof layer with an honest empty state and no invented products.
- Build Contact with canonical labels and the approved submission boundary.
- Checkpoint: no service drift, no inflated team language, no generic AI claims, and accessible form labels/errors.

## Phase 4 Work index and case-study architecture

- Build the Work index with the five canonical categories.
- Adapt the existing project and case-study system to the canonical schema.
- Publish only founder-verified records; keep incomplete records non-public and explicitly marked in data.
- Preserve intended/qualitative outcome language only when supported.
- Checkpoint: static params, metadata, missing-record 404 behavior, asset alt text, and proof verification.

## Phase 5 Asset and content gap mapping

- Reconcile `CONTENT-GAPS.md` and `ASSET-REQUIREMENTS.md` against the implemented data.
- Remove resolved entries and retain every unresolved proof, asset, backend, and metadata gap.
- Record any copy variation or architecture deviation in `PROPOSED-CHANGES.md` before implementation.
- Checkpoint: no fabricated asset or hidden fallback copy.

## Phase 6 Responsive accessibility and content QA

- Run unit/content tests, typecheck, lint, and production build.
- Verify desktop, tablet, and mobile layouts in a browser.
- Verify keyboard navigation, focus order, semantic headings, forms, alt text, reduced motion, and contrast.
- Run final canonical copy diff and unsupported-claim scan.
- Re-run the full Gateway test suite and visually smoke-test its approved routes without modifying them.
- Checkpoint: evidence-backed completion report with remaining gaps clearly listed.

## Files expected to change after approval

- `CLAUDE.md`, limited to the approved scope and naming alignment
- `app/page.tsx`
- `app/layout.tsx`
- `app/contact/page.tsx`
- `app/globals.css`, `app/site.css`, and focused new page styles
- `app/work/page.tsx`
- `app/work/[slug]/page.tsx`
- New route files for BM Visual, BM Tech, Creator, and About
- New `content/*.ts` modules
- New `components/site/*` and focused page components
- Existing Work/case modules and tests where the approved data migration requires it
- New content, route, accessibility, and form tests

## Reusable components and systems found

- `components/ui/Container.tsx`
- `components/ui/Grid.tsx`
- `components/ui/Section.tsx`
- `components/ui/Heading.tsx`
- `components/ui/Eyebrow.tsx`
- `components/ui/TextLink.tsx`
- `components/motion/ContextCursor.tsx`
- `components/motion/SceneThemeController.tsx`
- `lib/motion/useInteractionProfile.ts`
- `components/work/SelectedWork.tsx` and its interaction variants
- `components/case/ProjectCasePage.tsx`, `CaseHero.tsx`, `CaseScenes.tsx`, and `NextProject.tsx`
- `lib/projects/selected-work.ts` and `lib/projects/project-cases.ts` as migration inputs
- Existing layout grid, typography tokens, focus styles, reduced-motion handling, project media, and contact visual direction

## Files and systems that must remain untouched

- `app/gateway-prototype/**`
- `components/gateway/**`
- `lib/gateway/**`
- `tests/gateway-*.test.mjs`
- Approved Gateway shaders, environment, scene, state, navigation, progress, journey, selection, fallback, and interaction semantics
- The canonical DOCX and the separate BMP Content Studio prompt
