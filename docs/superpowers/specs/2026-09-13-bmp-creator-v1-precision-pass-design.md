# BMP Creator V1 Precision Pass Design

**Status:** Approved 2026-09-13

## Objective

Refine the approved WORLD PORTALS Creator experience so its motion, imagery,
typography, and optical hierarchy feel sharp, controlled, and seamless without
changing its information architecture or visual direction.

## Locked Boundaries

- Preserve native scrolling. Raw document position remains authoritative for
  semantic state, active-world selection, accessibility, and routing.
- Smooth only the visual rendering layer with tightly bounded, frame-rate-
  independent damping.
- Keep WEINS, SLYOUR, and THE XIDE as Revealed Worlds and Pawsona,
  Relationship, and Miner as Unrevealed Worlds.
- Preserve Creator Veil and the SEALED / GLIMPSE / PREVIEW / OPEN vocabulary.
- Preserve Creator publication and reveal-state architecture.
- Do not add Lenis, GSAP, WebGL, or another smooth-scroll dependency.
- Do not modify Gateway, BM Visual, unrelated BMP surfaces, or `main`.

## Motion Contract

The controller maintains separate target and rendered portal progress values.
It computes target values directly from scroll geometry and uses them for all
logical decisions. Rendered values converge using exponential damping:

```text
alpha = 1 - exp(-lambda * deltaTime)
rendered += (target - rendered) * alpha
```

The damping function is framerate independent, clamps invalid input, accelerates
or snaps large gaps, reacts immediately to direction reversals, and reports when
it has converged. The controller owns one requestAnimationFrame loop, continues
only while rendering must settle, and cancels it during cleanup. Reduced-motion
mode renders target values immediately.

Continuously animated geometry prioritizes `transform` and `opacity`. Animated
layout width/left and full-raster clip paths are replaced with transform or
static-overflow compositions where the visual result remains equivalent.

## Presence Frames

Each revealed world has an authored presence interval centered around the
middle of its chapter. Within that interval, dominant-media geometry is stable
or nearly stable, image scale is minimized, and typography resolves into a
clear hierarchy. Approach and departure retain directionality without making
the presence frame chase the scroll position.

## Media Contract

- Keep the verified WEINS primary image preloaded.
- Primary portal and arrival media use quality 92.
- Secondary project media use quality 88.
- Next.js `images.qualities` explicitly allowlists 88 and 92 alongside the
  existing default 75.
- `sizes` describes the maximum realistic transformed footprint at each
  breakpoint.
- Desktop composition is reduced where a 1376px landscape source would
  otherwise be materially over-scaled, especially at DPR 2.
- Primary sources remain crisp; atmosphere belongs to separate layers.
- Replace duplicated `look-01-silhouette.jpg` with the distinct verified WEINS
  source `look-04-proportion.jpg` from `Noe-09/Weins@5d72137`.
- Do not generate, upscale, or fabricate media.

## Typography Chroma

Typography is differentiated through one dominant neutral and one controlled
accent per world:

- WEINS: graphite/zinc with chalk/stone; no default difference blending.
- SLYOUR: warm ink with Saigon crimson used as an authored typographic voice.
- THE XIDE: bone/smoke with restrained copper/amber; object first, type second.
- Pawsona: neutral almost-white with a muted spectral-green trace.
- Relationship: silver-grey with a cool blue-grey temporal accent.
- Miner: mineral grey with restrained oxide warmth.

The accents establish hierarchy rather than decorate every line. Metadata
contrast is tuned by role instead of applying one repeated opacity everywhere.

## Responsive and Accessibility Contract

Desktop may retain layered motion, but mobile prioritizes one sharp dominant
composition, readable typography, stable geometry, and lightweight transforms.
Reduced-motion mode bypasses damping and presents resolved compositions.
Keyboard navigation, anchor loads, image fallbacks, and native page scrolling
remain intact.

## Acceptance

- Slow scrolling is continuous without obvious wheel stepping.
- Fast and reverse scrolling remain visually attached to native input.
- The visual loop settles quickly and stops.
- WEINS, SLYOUR, and THE XIDE each yield a crisp presence still.
- The revealed worlds remain distinguishable from typography alone.
- XIDE retains visible shadow detail without softening primary media.
- Creator imagery is visibly sharper at DPR 2 than the previous preview.
- All automated checks and viewport/accessibility QA pass without Gateway or
  BM Visual regressions.
