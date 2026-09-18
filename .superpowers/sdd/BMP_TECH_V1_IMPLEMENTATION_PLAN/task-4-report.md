# BMP Tech V1 — Task 4 Report

## Outcome

Implemented the pure BMP Tech journey model and its single client-side native-scroll controller.

## RED evidence

`PATH="/Users/noe/.gemini/antigravity/bin:$PATH" node --test tests/tech-journey.test.mjs`

Result: failed as intended because `lib/tech/journey.ts` did not yet exist (`ENOENT`).

## GREEN evidence

`PATH="/Users/noe/.gemini/antigravity/bin:$PATH" node --test tests/tech-journey.test.mjs`

Result: PASS — 1 test, 0 failures.

`PATH="/Users/noe/.gemini/antigravity/bin:$PATH" npm run typecheck`

Result: PASS — `tsc --noEmit` exited 0.

## Files

- `lib/tech/journey.ts` — phase constants, clamping, damping, and raw-progress phase mapping.
- `components/tech/TechJourneyController.tsx` — the one passive native-scroll controller.
- `tests/tech-journey.test.mjs` — controller/source contract coverage.

## Commits

- `01b1275fbd6049ab35fc4091b1adfd347e140ec1` — `feat: add BMP Tech causal journey controller`
- Bookkeeping checkpoint follows in `chore: checkpoint BMP Tech task 4`.

## Self-review

- The controller derives raw progress from the experience bounding rect and its scrollable journey range.
- It writes semantic phase, phase progress, and direction immediately after each input; only rendered visual progress is damped.
- RAF is requested after inputs and continues only until the visual value settles. Reduced motion resolves visual state immediately.
- Cleanup removes scroll, resize, and media-query listeners and cancels any outstanding frame.
- The implementation contains no wheel interception, prevented input, or programmatic scrolling.
- Every system maturity remains data-driven and `PLANNED`; Task 4 adds no truth-model changes.

## Concerns

The existing test setup is Node source-contract testing without a TypeScript runtime loader, so pure helpers cannot be imported for executable behavioral tests without adding test tooling. The source contract and TypeScript check cover the supported setup; later runtime QA should exercise slow/fast/reverse scroll, resize, and reduced-motion behavior in the browser.
