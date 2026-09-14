# BMP Creator V1 Design Specification

## Status and authority

This specification materializes the human-approved BMP Creator V1 brief dated 13 September 2026. It governs only the `/creator` experience and its publishable detail routes on branch `feat/bmp-creator-v1`.

The current brief supersedes the older Creator gap in `docs/bmp-content/CONTENT-GAPS.md`, which recorded that no product names or publication states had yet been supplied. The brief now supplies the canonical six-world roster and initial reveal states. All other canonical BMP content and truthfulness constraints remain in force.

BM Visual and the Gateway are locked surfaces. Their source, presentation grammar, motion, registries, and routes are not implementation inputs beyond read-only regression comparison.

## Product intent

BMP Creator is an authored exhibition of worlds BMP chooses to create. It proves imagination, while BM Visual proves taste through commissioned-expression grammar and BM Tech proves capability through systems grammar.

The experience must read as a spatial journey through distinct worlds, not as a portfolio, case-study list, card grid, agency page, dark BM Visual clone, or content-free WebGL experiment. Lusion is a benchmark for ambition and execution quality only. No Lusion layout, asset, typography combination, motion sequence, or signature interaction may be reproduced.

The opening statement is:

```text
BMP / CREATOR

THINGS
WE DECIDED
SHOULD EXIST.
```

The Creator shell begins in near-black and off-white, using the existing BMP type foundation. Each revealed world may introduce its own palette through composition, cropping, density, and motion rather than a new typeface.

## Canonical experience arc

The `/creator` route renders this exact semantic and visual order:

1. `00 — ARRIVAL`
2. `01 — WEINS`
3. `02 — SLYOUR`
4. `03 — THE XIDE`
5. `THRESHOLD — THE UNREVEALED`
6. `04 — PAWSONA`
7. `05 — RELATIONSHIP`
8. `06 — MINER`
9. `07 — CREATOR INDEX`
10. `08 — CREATOR COLOPHON`

The transition from THE XIDE into the unrevealed wing is a signature authored moment. Illumination falls away, the visible counter advances from `03 / 06` to `04 / 06`, and the page explicitly states:

```text
THE UNREVEALED

Still being made inside BMP.
```

This text makes the access state legible even without animation.

## Canonical six-world registry

World order and publication states are fixed for V1:

| Index | World | Wing | Reveal state | Public detail route | External URL |
| --- | --- | --- | --- | --- | --- |
| 01 | WEINS | Revealed | `open` | `/creator/weins` | Omitted until independently verified |
| 02 | SLYOUR | Revealed | `open` | `/creator/slyour` | Omitted until independently verified |
| 03 | THE XIDE | Revealed | `preview` | `/creator/the-xide` | Omitted until independently verified |
| 04 | PAWSONA | Unrevealed | `sealed` | None; requests must 404 | None |
| 05 | RELATIONSHIP | Unrevealed | `sealed` | None; requests must 404 | None |
| 06 | MINER | Unrevealed | `sealed` | None; requests must 404 | None |

No other world may be added to V1. Fabriclism, Aurelia Skin, Haven, and ÆTHER remain BM Visual/Work records and must not appear in the Creator registry.

## Reveal-state model

The public model is:

```ts
export type CreatorRevealState =
  | "sealed"
  | "glimpse"
  | "preview"
  | "open";
```

Reveal state is a publication contract, not a style token. It controls all of the following:

- `sealed`: no factual media, public detail route, CTA, external URL, or descriptive product interface. Only approved name, index, state label, development note, and abstract veil physics are public.
- `glimpse`: may expose specifically approved teaser media and metadata, but does not receive a detail route or external URL unless a later brief explicitly promotes it.
- `preview`: requires at least one verified media asset plus complete detail metadata; receives an internal public detail route. An external URL appears only when separately verified.
- `open`: requires at least one verified media asset plus complete detail metadata; receives an internal public detail route. An external URL appears only when separately verified.

Invalid configuration fails validation rather than degrading silently. Publication helpers are pure functions and are tested directly. Route generation consumes only publishable records, and any non-publishable slug calls `notFound()`.

## Typed content boundary

`content/creator.ts` is the single public Creator data source. It retains the canonical BMP Creator supporting copy while replacing the previously empty registry with six human-approved world records.

The primary interfaces are:

```ts
type CreatorMedia = {
  src: string;
  alt: string;
  label: string;
  kind: "image";
  status: "verified";
  source: string;
};

type CreatorDetailSection = {
  id:
    | "idea"
    | "world"
    | "exists"
    | "behaves"
    | "state"
    | "next";
  label: string;
  body: string;
};

type CreatorWorld = {
  index: "01" | "02" | "03" | "04" | "05" | "06";
  slug: "weins" | "slyour" | "the-xide" | "pawsona" | "relationship" | "miner";
  name: string;
  wing: "revealed" | "unrevealed";
  revealState: CreatorRevealState;
  statusLabel: "OPEN" | "PREVIEW" | "GLIMPSE" | "SEALED";
  character: string;
  thesis: string;
  motifs: readonly string[];
  developmentNote: string;
  media: readonly CreatorMedia[];
  detail: readonly CreatorDetailSection[] | null;
  liveUrl: string | null;
};
```

All public prose in opened worlds is constrained to the approved brief and factual owned-repository sources. Sealed worlds use only the supplied conceptual physics and access-state language; they do not invent interfaces or product behavior.

## Verified media and provenance

Creator media is copied into `public/creator/` from owned repositories at the audited source commits below. Only assets listed in those repositories' media registries as approved/coherent are eligible.

| World | Owned repository | Audited commit | V1 media selection |
| --- | --- | --- | --- |
| WEINS | `Noe-09/Weins` | `5d72137` | `hero-minimal.jpg`, `fabric-macro.jpg`, `look-01-silhouette.jpg` |
| SLYOUR | `Noe-09/Slyour` | `c2f40bb` | `hero-campaign.jpg`, `look-02-crimson.jpg`, `puffer-macro.jpg` |
| THE XIDE | `Noe-09/The-Xide` | `70c94ba` | `hero-atmosphere.jpg`, `candle-packshot.jpg`, `botanical-strata.jpg` |

The selection remains curated rather than reconstructing or embedding the source sites. Next.js `Image` owns responsive delivery and layout stability. Only the WEINS opening asset receives eager priority; subsequent media is lazy by default. No videos or continuous canvases are required for V1.

If a configured media asset is unavailable, the view renders a controlled neutral artifact with its factual label rather than a broken image or fabricated replacement.

## Overview architecture

The route remains a Server Component and owns metadata. Static sections and all essential text render on the server. A single focused Client Component observes the Creator root and updates deterministic journey attributes/CSS variables; it does not own the content tree.

```text
app/creator/
  layout.tsx                    Creator-only stylesheet boundary
  page.tsx                      Server route and metadata
  [slug]/page.tsx               Publishable detail routes only
  creator.css                   Complete Creator visual system

components/creator/
  CreatorExperience.tsx         Semantic overview composition
  CreatorArrival.tsx            Arrival statement and journey cue
  CreatorWorldSequence.tsx      Ordered world composition
  CreatorThreshold.tsx          Revealed-to-unrevealed transition
  CreatorIndex.tsx              Functional catalogue index
  CreatorColophon.tsx           Creator/BM distinction and exits
  CreatorJourneyController.tsx  Single browser scroll controller
  worlds/*                      Six world-specific compositions
  veil/*                        Shared veil material and artifacts
  detail/*                      Creator-specific detail grammar

lib/creator/
  reveal-state.ts               State/configuration validation
  publication.ts                Detail-route fail-closed rules
  journey.ts                    Pure progress mapping
```

No new dependency is added. DOM/CSS owns composition and veil material. JavaScript owns only normalized state. WebGL is not justified for V1 because the Creator Veil can reach the required dimensional quality with layered gradients, masks, texture, and transforms at lower runtime cost.

## Journey controller

One normalized controller provides:

```ts
type CreatorJourneyState = {
  globalCreatorProgress: number;
  activeWorld: CreatorWorld["slug"] | null;
  worldProgress: number;
  direction: -1 | 0 | 1;
  velocity: number;
  reducedMotion: boolean;
};
```

Pure journey functions clamp progress, map progress to the ordered six-world range, derive local world progress, and calculate direction. The browser adapter uses one passive scroll listener and one `requestAnimationFrame` at most per scroll frame. It writes state to the Creator root via `data-active-world`, `data-direction`, and numeric CSS custom properties.

The browser keeps native scrolling. There is no wheel interception, forced snapping, custom scroll position, or navigation delay. Reverse and fast scrolling recalculate from current geometry each frame rather than depending on accumulated transition state.

Reduced motion keeps every section visible and composed, disables parallax-like transforms and long transitions, and preserves the full reading order and index.

## World compositions

No adjacent world shares the same dominant composition.

### 01 — WEINS

- Character: architectural, structural, monochrome, garment mass.
- Dominant composition: full-bleed structural field with a large cropped wordmark, orthogonal planes, and an offset garment silhouette.
- Factual language: `FORM / WEIGHT / SILHOUETTE`, `Weight defines form.`, architectural volume, garment construction, silhouette, fit, and precise commerce.
- Motion: compression, scale, and structural masks derived from normalized progress.
- Palette: zinc, concrete, chalk, graphite.

### 02 — SLYOUR

- Character: Editorial Commerce × Product Theatre × Young Saigon Energy.
- Dominant composition: warm editorial stage with overlapping campaign crop and isolated object/material panels.
- Factual language: `Soft Objects / Saigon`, campaign, object, material, and commerce.
- Motion: crop shifts and scene-to-object translation.
- Palette: warm white, crimson, dirty olive, ink.

### 03 — THE XIDE

- Character: ritual, object, material, darkness.
- Dominant composition: low-light object altar with a narrow illuminated image field and vertical scent-note trace.
- Factual language: `Memory Has a Scent`, `TRACE / BLOOM / SEDIMENT`, smoked glass, botanical material, and quiet commerce.
- Motion: illumination recedes as local progress approaches departure, preparing the threshold.
- Palette: warm obsidian, smoke, stone, restrained amber.

Unsupported duration, certification, sourcing, MOQ, lead-time, or performance claims from the source project are prohibited.

### 04 — PAWSONA

- State: sealed.
- Dominant composition: distributed warm clusters and faint relational traces behind the Creator Veil.
- Public language is limited to name, index, `SEALED`, and “Still being made inside BMP.”
- No Pawsona UI, screenshot, feature description, or implied launch state is created.

### 05 — RELATIONSHIP

- State: sealed.
- Dominant composition: linked temporal marks, dates-as-abstract ticks, and a restrained continuous path behind the Creator Veil.
- No planning interface or feature set is invented.

### 06 — MINER

- State: sealed.
- Dominant composition: descending strata, depth bands, and pressure lines behind the Creator Veil.
- No gameplay, pixel art, mechanics, or screenshot is invented.

## Creator Veil

The shared veil has four compositional layers:

1. `DARK FIELD` — near-black base with world-specific tonal bias.
2. `OBSCURED FORM` — abstract shape system selected by veil variant.
3. `LIGHT TRACE` — restrained line or glow that reveals depth without spotlight theatrics.
4. `SURFACE GRAIN` — low-opacity CSS grain/micro-pattern that remains decorative and `aria-hidden`.

The veil is not a loading state. Every sealed section includes explicit `SEALED` text and the unrevealed explanation in the logical reading order. It avoids cards, skeleton loaders, glass panels, neon, cyberpunk, and generic gradient rectangles.

## Creator Index

The index returns to functional clarity after the immersive sequence. It is a semantic ordered list with index, name, motifs/type line, and textual state for all six worlds.

Publishable rows link to internal Creator detail routes. Sealed rows are non-link entries and never masquerade as disabled controls. Desktop hover/focus may shift a restrained background material response, but all information is permanently visible and mobile does not depend on hover.

## Detail routes and grammar

Only these routes are generated and public:

- `/creator/weins`
- `/creator/slyour`
- `/creator/the-xide`

Each page uses Creator-specific exhibition grammar:

1. `00 ENTRY`
2. `01 THE IDEA`
3. `02 THE WORLD`
4. `03 WHAT EXISTS`
5. `04 HOW IT BEHAVES`
6. `05 CURRENT STATE`
7. `06 WHAT'S NEXT`
8. `07 ENTER / EXIT`

The page presents the world through a large entry composition, factual copy, and a non-uniform artifact gallery. It does not import BM Visual case components or its challenge/direction/outcome case-study grammar. A restrained `VISIT LIVE ↗` action is absent in V1 because no external destination has been independently verified in the audited evidence.

Unknown and sealed slugs must 404. `generateStaticParams()` returns only the three publishable slugs, and the route also validates publication during render and metadata generation.

## Responsive behavior

The experience is verified at 360, 390, 768, 1024, and 1440 CSS pixels.

- Desktop/laptop may use viewport-height world stages, controlled overlap, and progress-derived transforms.
- Tablet reduces overlap and keeps all metadata within an eight-column-equivalent composition.
- Mobile recomposes each world: shorter minimum heights, linear reading order, fewer overlapping layers, direct touch-safe links, and no hover dependency.
- The threshold remains a distinct authored section at every size.
- Creator Index rows reflow into clear two-column metadata rather than shrinking desktop typography.
- No viewport may produce horizontal overflow.

## Accessibility

- One `h1` per route; world titles use ordered `h2` headings and detail sections use `h2`.
- Links are native anchors with visible focus states and at least 44px touch height where they act as controls.
- Factual media receives specific alt text from the verified asset registry.
- Veil layers and abstract artifacts are `aria-hidden`.
- Reveal state is always written as text.
- Essential order is DOM order; absolute positioning never changes reading order.
- Reduced motion is detected both in CSS and the controller state.
- The full six-world index is understandable without JavaScript or animation.

## Performance and failure behavior

- No continuous animation loop runs while the page is idle.
- Only the active scroll frame schedules work.
- The first WEINS image is prioritized; all other media uses responsive lazy delivery.
- Inactive sections do not run independent observers or listeners.
- CSS transform/opacity drives motion; layout properties are not animated.
- Missing media produces a neutral labeled artifact.
- Invalid reveal configuration throws in tests/build-time validation.
- Missing live URLs suppress the live action.
- Non-publishable slugs fail closed with 404.

## Test and visual acceptance

Automated coverage must verify:

- reveal-state vocabulary and configuration validity;
- state-to-publication rules;
- sealed routes cannot publish;
- open/preview routes require verified media and complete detail data;
- canonical world order `01` through `06`;
- Creator registry does not overlap BM Visual selected-work slugs;
- required published metadata and verified media provenance;
- normalized progress to active world and local progress mapping;
- transition boundaries and reverse direction;
- `/creator` arc, index, threshold, and one semantic `h1`;
- three detail routes render and sealed/unknown routes return 404;
- Gateway and BM Visual regression suites continue to pass.

Completion requires `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` to pass, plus browser inspection at the five required viewport widths, reduced motion, keyboard navigation, slow-load/fallback behavior, reverse scroll, and horizontal overflow.

## Scope exclusions

- No Gateway change, integration, redirect, or asset reuse.
- No BM Visual component, motion, registry, or route change.
- No BM Tech or unrelated BMP page redesign.
- No new public route beyond the three approved Creator detail routes.
- No new dependency, CMS, analytics, audio, checkout, account, or persistence system.
- No WebGL in V1.
- No fabricated screenshot, interface, gameplay, metric, customer, outcome, or launch state.
- No merge to `main`.
