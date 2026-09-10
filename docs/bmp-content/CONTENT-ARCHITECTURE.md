# BMP Canonical Content Architecture

## Purpose

This document proposes the production content boundary for the BMP website. The public copy source is `BMP_Website_Brand_Core_Content_Studio_08-09-2026.docx`, dated 08 September 2026. The separate BMP Content Studio prompt and its production instructions are explicitly excluded from public website data.

No production content modules are created at this review gate.

## Source precedence

1. The explicit canonical-content integration brief governs scope, safety, review gates, and implementation constraints.
2. The canonical DOCX supplies approved brand facts, public messaging, page copy, service lists, and content structure.
3. Existing repository copy and project records may be reused only when they do not conflict with the first two sources and their status is verified.
4. Missing information remains marked `MISSING_CONTENT` or `NEEDS_ASSET`; it is not inferred.

## Status vocabulary

| Status | Meaning | Public rendering rule |
| --- | --- | --- |
| `APPROVED_COPY` | Exact public copy approved in the canonical DOCX | Render verbatim unless a recorded variation is approved |
| `STRUCTURED_DATA` | Taxonomy, labels, routes, field definitions, or verified existing records | Render only when the record is complete and verified |
| `MISSING_CONTENT` | Required factual or operational information is not supplied | Do not invent or imply it |
| `NEEDS_ASSET` | A required visual or proof asset is absent or unverified | Do not fabricate visual proof |

## Proposed module map

```text
content/
  types.ts       Shared status, content-field, CTA, asset, and page types
  brand.ts       Brand architecture, positioning, promise, values, audience, voice
  navigation.ts  Public navigation labels and approved route references
  home.ts        Home hero and three capability blocks
  about.ts       Intro, full narrative, highlight, process, and lean-team wording
  services.ts    BM Visual and BM Tech page content and service groups
  creator.ts     Creator page copy and an initially empty product registry
  work.ts        Work taxonomy, project schema, case-study schema, and verified records
  contact.ts     Contact copy, field schema, CTAs, and submission configuration status
  index.ts       Public typed exports only
```

## Proposed shared types

```ts
type ContentStatus =
  | "APPROVED_COPY"
  | "STRUCTURED_DATA"
  | "MISSING_CONTENT"
  | "NEEDS_ASSET";

type ContentField<T> = {
  value: T | null;
  status: ContentStatus;
  source: string;
  reviewNote?: string;
};

type CTA = {
  label: ContentField<string>;
  href: ContentField<string>;
};

type AssetReference = {
  src: string | null;
  alt: string | null;
  kind: "image" | "video" | "screen" | "process" | "demo";
  status: "verified" | "candidate" | "NEEDS_ASSET";
};
```

The source identifier should point to a stable internal reference such as `canonical-docx:home.hero.headline`, not to page or paragraph formatting in Word.

## Canonical module ownership

### `brand.ts`

- `APPROVED_COPY`: primary positioning, short positioning, brand promise, value framework, mission, vision, values, differentiators, audience, market stance, personality, visual direction, and voice.
- `STRUCTURED_DATA`: the relationship `BMP → BM Visual | BM Tech | BMP Creator`.
- No Content Studio funnel or production-prompt material.

### `home.ts`

- `APPROVED_COPY`: eyebrow, headline, supporting copy, primary and secondary CTA labels, and the exact three capability headings and supporting paragraphs.
- `STRUCTURED_DATA`: capability order and destination keys.
- Route destinations remain proposed until the route-slug proposal is approved.

### `about.ts`

- `APPROVED_COPY`: page headline, short intro, all five full About paragraphs, highlight statement, five process steps, and lean-team wording.
- The internal Vietnamese note about future founder/team cards is not public copy.

### `services.ts`

- `APPROVED_COPY`: BM Visual and BM Tech headlines, supporting copy, all six service groups for each division, and CTA labels.
- `STRUCTURED_DATA`: service-group order and division identity.
- No additional capability or generic AI claim may be added.

### `creator.ts`

- `APPROVED_COPY`: headline, supporting copy, and CTA label.
- `STRUCTURED_DATA`: an empty `CreatorProduct[]` registry with fields for name, slug, status, product type, problem, concept, assets, demo, link, and development note.
- Product entries remain empty until verified data is supplied.

### `work.ts`

- `APPROVED_COPY`: page headline, intro, category labels, card field labels, case-study section labels, and CTA labels.
- `STRUCTURED_DATA`: category enum, project record shape, case-study section shape, and next-project relationship.
- Existing concept records are candidates, not automatically canonical. Publication requires the project-data proposal to be approved and each record to pass proof verification.

Proposed record boundary:

```ts
type WorkCategory =
  | "Brand & Visual"
  | "Web & Digital Experience"
  | "Systems & Automation"
  | "Products by BMP"
  | "Experiments";

type ProjectStatus =
  | "Client Work"
  | "Concept"
  | "Demo"
  | "Experiment"
  | "Owned Product";

type WorkProject = {
  name: ContentField<string>;
  slug: ContentField<string>;
  status: ContentField<ProjectStatus>;
  categories: ContentField<WorkCategory[]>;
  challenge: ContentField<string>;
  created: ContentField<string>;
  heroAssets: ContentField<AssetReference[]>;
  outcome: ContentField<string>;
  caseStudy: {
    challenge: ContentField<string>;
    direction: ContentField<string>;
    built: ContentField<string>;
    significance: ContentField<string>;
    next: ContentField<string>;
  };
};
```

Every published Work record must have a verified status. Concept, Demo, Experiment, and Owned Product records must be labeled honestly in public. A `Client Work` status requires explicit verification and must never be inferred from project presentation or repository assets.

### `contact.ts`

- `APPROVED_COPY`: headline, body, seven field labels, and CTA labels.
- `STRUCTURED_DATA`: required/optional field state.
- `MISSING_CONTENT`: submission destination, delivery mechanism, consent/privacy wording if required, and success/error messages.

## Rendering boundaries

- Route files and presentational components consume content modules; canonical prose is not duplicated in JSX.
- Page route files remain Server Components and own metadata.
- Client Components are limited to interaction and receive serializable data.
- Raw status values and internal review notes are not exposed to site visitors. Incomplete records are omitted from public listings while remaining visible in code and audit documentation.
- Canonical-copy variations require an entry in `PROPOSED-CHANGES.md` before implementation.

## Capability presentation boundary

The three Home capabilities are content architecture, not generic cards. BM Visual, BM Tech, and BMP Creator should be implemented as three strong destination surfaces within one BMP master identity:

- BM Visual may be more expressive and atmospheric.
- BM Tech may be more structural and precise.
- BMP Creator may be more experimental and product-oriented.

The exact canonical copy remains unchanged. The distinction comes from composition, rhythm, and interaction—not invented messaging or disconnected sub-brands.

## Home clarity boundary

The Home first view must make the following readable and actionable without waiting for motion, 3D, loaders, or experimental presentation:

- `Creative × Technology × Products`
- The canonical headline
- The canonical supporting copy
- `Explore our work`
- `Start a project`

Experimental presentation may build after this clarity is established and must preserve reduced-motion and no-WebGL access to the same content.

## Canonical naming map

| Role | Canonical new-site label | Existing repository/Gateway label | Rule for this task |
| --- | --- | --- | --- |
| Master brand | BMP | BM / BM Visuals site shell | New public architecture uses `BMP` |
| Creative services | BM Visual | `BM VISUALS` | New pages use `BM Visual`; Gateway remains unchanged |
| Technical services | BM Tech | `BMP TECHNICAL` | New pages use `BM Tech`; Gateway remains unchanged |
| Owned products | BMP Creator | No current public equivalent | Use `BMP Creator` |

The Gateway label conflict is documented for later human resolution. It is not changed in this branch.
