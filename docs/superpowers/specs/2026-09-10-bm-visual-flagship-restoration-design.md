# BM Visual Flagship Restoration Design

## Objective

Restore the approved pre-BMP BM Visual flagship experience at `/bm-visual` while preserving the BMP master site, canonical typed content boundary, shared Work/case-study data, and frozen Gateway.

## Root cause

PR #20 correctly replaced the former BM Visual-only `/` page with the BMP master-brand Home and added `/bm-visual`. The new division route was implemented as the generic `SiteHeader + PageHero + ServiceIndex + SiteFooter` composition. The former flagship components, styles, motion helpers, project variants, and assets were not deleted, but `app/page.tsx` stopped importing and composing them, which orphaned the experience.

## Chosen architecture

`app/bm-visual/page.tsx` remains a Server Component and owns metadata plus canonical data selection. It reconnects the existing `HeroSequence`, `SelectedWork`, `CapabilitiesIndex`, `StudioProcess`, and `ClosingScene` components and imports the existing `home.css` and `ending.css` styles. Interactive Client Components receive only serializable canonical strings and arrays.

The route uses division-specific navigation and footer treatments that visually belong to the flagship system while deriving destinations from `content/navigation.ts`. The identity is explicitly `BMP / BM Visual`, so the experience remains a BMP division rather than reverting to the obsolete standalone BM Visuals architecture.

## Content adaptation

- Hero headline: `Make the brand worth noticing.`
- Hero supporting copy: the exact canonical BM Visual supporting paragraph from `content/services.ts`.
- Capabilities: the exact six canonical BM Visual service-group labels from `content/services.ts`, paired with existing verified project proof media and restrained explanatory detail.
- Closing CTA: `Improve your visual presence`, linking to `/contact`.
- Naming: public division references use `BM Visual`; `BM Visuals` and obsolete standalone-company language are removed from this public route.
- Point-of-view and studio/process material may retain existing editorial presentation only where it remains consistent with the canonical positioning and truthfulness rules.

## Work relationship

`SelectedWork` continues to consume the existing shared project registry. It accepts or derives a Visual-only subset from verified records categorized as `Brand & Visual` or `Web & Digital Experience`, so `/bm-visual` curates shared Work without duplicating project records. Case-study links continue to use `/work/[slug]`.

## Interaction and accessibility

The existing WebGL hero, semantic fallback, pointer depth, scroll progression, scene themes, context cursor, project-world transitions, responsive breakpoints, and reduced-motion CSS remain in place. Existing button, focus, click/tap, and keyboard semantics are preserved. The flagship navigation exposes routes to BMP Home, Work, BM Tech, BMP Creator, About Us, and Contact.

## Regression boundary

The `/bm-visual` runtime test must assert consumer-visible output for five flagship regions: hero/point of view, selected work, capabilities, studio/process, and closing CTA. It must also assert the exact canonical headline, supporting copy, six service groups, CTA, BMP relationship, and representative shared case-study links. Removing the flagship composition or replacing it with the generic service-only layout must fail this test.

## Verification

- Test the regression in RED before implementation and GREEN afterward.
- Run relevant unit/integration tests, typecheck, lint, and the production build.
- Review `/bm-visual` at desktop and mobile widths.
- Emulate `prefers-reduced-motion: reduce` and confirm semantic content remains available without canvas dependence.
- Traverse interactive controls by keyboard and verify visible focus and working links.
- Verify Selected Work case-study destinations.
- Compare all Gateway paths against `68e6eab24acc0705081ff39a94496bc878909923`; the diff must be empty.
- Push the branch and create a non-merged preview-ready pull request.

## Out of scope

- No rollback or redesign of BMP Home or other canonical routes.
- No project-data duplication or new unverified project claims.
- No new major public route.
- No change under `app/gateway-prototype/**`, `components/gateway/**`, `lib/gateway/**`, or `tests/gateway-*.test.mjs`.
