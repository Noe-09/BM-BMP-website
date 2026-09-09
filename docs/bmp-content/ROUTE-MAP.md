# BMP Proposed Route Map

## Public sitemap

| Public page | Proposed route | App Router file | Change state | Content source |
| --- | --- | --- | --- | --- |
| Home | `/` | `app/page.tsx` | Modify | `content/home.ts`, `content/brand.ts` |
| Work | `/work` | `app/work/page.tsx` | Create | `content/work.ts` |
| Work detail | `/work/[slug]` | `app/work/[slug]/page.tsx` | Adapt reusable route | Verified `content/work.ts` records |
| BM Visual | `/bm-visual` | `app/bm-visual/page.tsx` | Create | `content/services.ts` |
| BM Tech | `/bm-tech` | `app/bm-tech/page.tsx` | Create | `content/services.ts` |
| BMP Creator | `/creator` | `app/creator/page.tsx` | Create | `content/creator.ts` |
| About Us | `/about` | `app/about/page.tsx` | Create | `content/about.ts` |
| Contact / Start a Project | `/contact` | `app/contact/page.tsx` | Modify | `content/contact.ts` |

The canonical document supplies page names, not URL slugs. The proposed slugs are therefore awaiting approval in `PROPOSED-CHANGES.md`.

## Shared route architecture

- `app/layout.tsx` remains the root document and changes its BMP metadata only during implementation.
- `components/site/SiteHeader.tsx` and `components/site/SiteFooter.tsx` provide the canonical navigation and master-brand shell.
- The shared shell stays restrained and brand-led; it must not introduce conventional SaaS navigation, generic service-card chrome, or an oversized agency menu.
- Focused page primitives should extend the existing `Container`, `Grid`, `Section`, `Heading`, `Eyebrow`, and `TextLink` components.
- Page-specific interactive sections remain separate Client Components; public copy stays in the content modules.
- Page routes define their own static metadata derived from approved copy. Missing domain and social-card assets stay explicit gaps.

## Frozen routes

The following existing Gateway routes remain independent and are not part of this public-site implementation gate:

- `/gateway-prototype`
- `/gateway-prototype/technical`
- `/gateway-prototype/review`

No redirect, rewrite, entry-page integration, shader, scene, navigation, progress, or state change is proposed here.

## Route acceptance rules

- No major public route beyond the canonical sitemap.
- Work detail routes exist only for complete, verified records.
- Every published Work detail route has a verified `ProjectStatus` and exposes that status honestly.
- Empty Creator data does not generate fake product detail routes.
- Navigation names use `BM Visual`, `BM Tech`, and `BMP Creator` even while the frozen Gateway retains its approved labels.
- Every route has one semantic `h1`, keyboard-visible focus, canonical CTAs, and responsive navigation.
