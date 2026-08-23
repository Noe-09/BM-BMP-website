# BM Visuals Flagship Batch 4 Execution Plan

**Goal:** Final polish and hardening of the approved Batch 1–3.5 BM Visuals experience. Refine the existing composition and interaction system; do not introduce new sections, visual worlds, routes, or dependencies.

**Baseline:** `origin/main` at `0cd87c087666b58ff5f9d73ca96c136af33b4d34`, which includes the merged HAVEN integration and all four ready case routes.

## Expected files

- Modify: `app/layout.tsx` — truthful division-level homepage metadata.
- Modify: `app/page.tsx` — footer positioning descriptor.
- Modify: `components/home/HeroSequence.tsx` — replace experimental topline/coordinate language with BM division metadata.
- Modify: `app/home.css` — refine hero line widths, hierarchy and tablet/mobile composition without changing the ribbon or choreography architecture.
- Modify: `app/motion.css` — reduce View/Explore cursor weight and add restrained light-world treatment while retaining fine-pointer-only behavior.
- Modify: `app/work.css` — feather Aurelia’s optical reveal boundary and retain a legible static/reduced-motion state.
- Modify: `app/ending.css` — shorten orange process pacing modestly and subordinate the closing motif to its typography/CTA.
- Modify: `app/case.css` — strengthen responsive title/footer/nav handoff only where visual QA finds a collision or crop risk.
- Modify: `app/site.css` — align contact/footer positioning text where needed.
- Modify: `components/case/ProjectCasePage.tsx` — case footer positioning descriptor.
- Modify: `tests/accessibility-markup.test.mjs` — lock the public division descriptor and semantic capability controls before changing public copy.

## Execution

1. Add a source-level regression test for the approved `DIGITAL EXPERIENCE DIVISION OF BM` positioning and verify it fails against the current stale independent-studio wording.
2. Update the shared public positions (metadata, hero, footer, case footer, contact support copy) with one concise division descriptor; preserve project facts and all live URLs.
3. Tune CSS only: 84px contextual action cursor with a quieter paper/Aurelia/HAVEN surface; prevent hero title clipping at 1024px while preserving the folded-ribbon relationship; replace the Aurelia hard circular ring with a diffuse optical edge/halo and retain touch/scroll and reduced-motion behavior.
4. Apply only targeted pacing refinements to Studio and the Closing Scene after visual review; leave Fabriclism, HAVEN and ÆTHER structurally untouched unless QA reveals an actual responsive fault.
5. Run focused browser QA at the required desktop/tablet/mobile sizes and input profiles, then the full lint/type/test/build suite. Fix only Batch 4 regressions, inspect runtime output and asset loading, commit, push, create an open PR to `main`, and inspect the Vercel Preview.

## Verification

- Static/public-copy test plus all existing node tests.
- `git diff --check`, conflict-marker scan, lint, typecheck, production build.
- Browser checks on `/`, `/contact`, and all four cases at 1440x900, 1280x800, 1024x768, 768x1024, 390x844 and 375x812; confirm no horizontal overflow, clipped display text, broken media, console errors, or error overlays.
- Verify fine/coarse/reduced profiles, project transition progressive enhancement, native external links, next-world sequence, direct anchors and case refreshes where automation supports them.
