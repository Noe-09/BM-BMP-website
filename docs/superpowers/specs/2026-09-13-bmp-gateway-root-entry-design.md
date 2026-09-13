# BMP Gateway Production Root Entry Design

**Status:** Approved routing and session design

**Source:** User-supplied master brief, 2026-09-13

## Objective

Promote the approved BM Gateway / Three Worlds experience to the canonical `/` entry point without changing Tunnel Ver 4, the Three Worlds chamber, briefing choreography, navigation timing, or interaction semantics. Move the existing BMP master-brand Home composition intact to `/studio`.

## Route ownership

- `/` renders the existing Gateway orchestrator and owns the single canonical Gateway stylesheet.
- `/studio` renders the previous root Home composition without redesign.
- `/gateway-prototype` issues a temporary redirect to `/`, avoiding a cache-persistent redirect before human review while eliminating duplicate canonical content.
- `/bm-visual`, `/bm-tech`, `/creator`, `/work`, `/about`, and `/contact` remain directly accessible.
- Gateway destinations remain exactly BM Visual → `/bm-visual`, BM Tech → `/bm-tech`, and BMP Creator → `/creator`.

## Session and replay semantics

- Keep the existing `bmGatewaySeen` sessionStorage key and write timing: a meaningful same-context keyboard/fallback commit marks the session, while enhanced primary-pointer navigation marks it at guarded commit.
- An unseen session follows the full approved loader and journey.
- A seen session uses the existing short loader and settled chamber arrival.
- Only a returning visitor in the neutral chamber sees the secondary `REPLAY JOURNEY` button.
- Replay resets the reducer and journey controller in memory, remains on `/`, preserves `bmGatewaySeen`, clears no storage, and returns to the same Three Worlds chamber after the approved journey.
- Replay does not alter manual input, reverse, idle resume, reduced-motion, selection, briefing, or Continue behavior.

## Navigation intent

- Master-brand identity links point to `/studio`.
- A restrained `Switch World` link points to `/` in shared division/site navigation.
- Existing direct destination and informational links retain their direct routes.
- No middleware gate or global redirect is introduced.

## Metadata

- `/` is indexable with title `BMP — Creative × Technology × Products` and the canonical `BRAND.positioning` description.
- `/studio` is indexable with title `BMP Studio — Creative × Technology × Products` and the same canonical master-brand description.
- `/gateway-prototype` has no indexable content because it redirects.

## Compatibility constraints

- Preserve the useful Three Worlds fallback and all touch, keyboard, focus, Escape, modifier-click, reduced-motion, duplicate-commit, and navigation-fallback semantics.
- Keep one WebGL canvas, one animation loop, one Gateway component tree, and the approved scene budget.
- Do not rename `GatewayPrototype` in this pass; the internal name is acknowledged technical debt and avoids a cosmetic refactor in a routing task.
- Add no dependencies and no analytics provider.

## Acceptance

All route, metadata, state/session, replay, markup, accessibility, and existing regression tests pass, followed by TypeScript, ESLint, production Webpack build, browser QA, Vercel preview verification, and human visual review before merge.
