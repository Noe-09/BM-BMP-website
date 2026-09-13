# BMP Gateway — Production Root Entry Verification

Verified locally on 2026-09-13 from branch `feat/bmp-gateway-root-entry`, based on
`origin/main` at `1ea5d4b2f6184f57438118ec4dc88d2ea55228df` after PR #22 merged.

## Scope

- The approved Three Worlds Gateway now owns `/`.
- The former Home composition is preserved at `/studio`.
- `/gateway-prototype` issues a temporary redirect to `/` so preview rollback is not permanently cached.
- Existing division and information routes remain directly addressable.
- BMP identity links lead to `/studio`; explicit `Switch World` links lead to `/`.
- A returning-session-only `REPLAY JOURNEY` control resets in-memory journey state without navigation or browser-storage mutation.
- Gateway geometry, palette, chapter timing, autoplay profile, Impossible Core, release, final chamber, selection, briefing, and decision timing are unchanged.

## Automated verification

- `node --test --test-concurrency=1 tests/*.test.mjs`: 150 passed, 0 failed (31.59 seconds).
- `tsc --noEmit`: passed with no output.
- `eslint .`: passed with no errors or warnings.
- `next build --webpack`: passed with Next.js 16.3.1; compiled in 1.09 seconds, TypeScript completed in 0.61 seconds, and all 18 routes generated.
- Gateway route, journey, state, navigation, content, shell, markup, briefing, accessibility, reduced-motion, touch, fallback, and presentation regressions passed.

## Browser QA

The production build was exercised in the in-app Chromium browser on desktop and at a 390×844 mobile viewport.

- A fresh `/` session completed the full automatic tunnel journey at master progress `1.00000`, reached the neutral Three Worlds chamber, rendered one canvas, and produced no console errors or warnings.
- Keyboard focus revealed the canonical summaries for BM Visual, BM Tech, and BMP Creator.
- Creator selection entered the canonical briefing; `GO BACK` reversed briefing progress to the selection chamber and restored the selected destination's focus state.
- Re-selecting Creator and activating `CONTINUE` navigated directly to `/creator`.
- The Creator shell exposed BMP identity at `/studio` and `Switch World` at `/`.
- Returning through `Switch World` reached the short-path selection chamber in approximately 1.88 seconds and displayed `REPLAY JOURNEY`.
- Replay stayed on `/`, hid its control during the journey, reset to the existing auto-entry path, and returned deterministically to the selection chamber in approximately 23.24 seconds without clearing `bmGatewaySeen`.
- `/studio`, `/bm-visual`, `/bm-tech`, `/creator`, `/work`, `/about`, and `/contact` loaded directly with the expected page identity and no Gateway overlay.
- `/gateway-prototype` resolved to `/` with the canonical production Gateway title.
- At 390×844, the selection and Creator briefing controls remained within the viewport with no horizontal overflow; the smallest measured interactive control height was 44px.
- No runtime error overlay, console error, console warning, or duplicate canvas was observed.

The local browser control could not emulate a true coarse-pointer device, `prefers-reduced-motion`, or forced WebGL initialization failure. Those paths remain covered by deterministic automated tests: touch uses the existing two-step preview/selection contract, reduced motion preserves the direct decision path, and the fallback exposes the three canonical destination links.

## Performance

This routing task does not modify scene or journey-performance code. The merged Three Worlds measurements remain:

- 1280×720 neutral chamber: 36 draw calls, 47,280 triangles, refraction inactive (within the approved 38-call / 65,000-triangle ceiling).
- Settled destination decision: 34 draw calls, 45,948 triangles.
- 390×844 Creator decision: 22 draw calls, 37,736 triangles.
- Preserved Impossible Core at master progress `0.68`: 29 draw calls, 82,936 triangles with its temporary approved refraction pass, outside the neutral-chamber ceiling.

## Known weaknesses

- The internal client orchestrator retains the historical `GatewayPrototype` component name; route ownership is production-ready, but renaming that symbol is intentionally deferred to avoid unrelated churn.
- Independent agent review could not run because the reviewer account had reached its usage limit. A direct base-to-head diff and scope audit found no unrelated changes; automated and browser checks provide the release evidence.
- Physical coarse-pointer, physical reduced-motion, representative GPU frame timing, and forced WebGL-failure browser checks remain candidates for human/device review. Their deterministic behavioral contracts are covered by tests.
- Human visual approval is still required before merge.
