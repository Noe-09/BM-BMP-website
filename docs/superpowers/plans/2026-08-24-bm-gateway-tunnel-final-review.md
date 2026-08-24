# BM Gateway Tunnel Prototype — Final Review Addendum

> **Execution rule:** Implement `2026-08-24-bm-gateway-tunnel-v2.md` with every correction in this addendum applied. Where this file conflicts with V2, this file wins. The approved design spec remains `../specs/2026-08-24-bm-gateway-tunnel-design.md`.

The V2 implementation plan is otherwise approved. Final self-review found four details that must be corrected before code begins.

## Correction 1 — Reduced-motion first visit uses the short loader

V2 currently expresses loader timing in terms of first vs return visit in the progress helper, while its responsive section correctly requires a short reduced-motion loader. Make this unambiguous.

Replace the loader-mode concept with:

```ts
export type LoaderMode = "first" | "short";

const loaderMode: LoaderMode =
  state.returning || profile.reducedMotion ? "short" : "first";
```

Timing remains:

```ts
export const GATEWAY_TIMING = {
  loaderMinMs: 2400,
  shortLoaderMs: 600,
  readyHoldMs: 260,
  skipRevealMs: 1350,
  fallbackMs: 9000,
  autoEntryMs: 1750,
  autoEntryCoarseMs: 1200,
  skipFastForwardMs: 800,
  exitMs: 850,
} as const;
```

`getLoaderTarget(realProgress, elapsedMs, mode)` uses 2400 ms for `first`, 600 ms for `short`. `shouldShowSkip()` is true only for `first` after 1350 ms. Add tests proving a reduced-motion first visit selects short mode and does not expose Skip.

## Correction 2 — Session state must be explicitly resolved after hydration

Do not assume `sessionStorage` is known in `createGatewayState()` during SSR.

Add:

```ts
export type GatewayState = {
  phase: GatewayPhase;
  preview: GatewayDivision | null;
  committed: GatewayDivision | null;
  returning: boolean;
  sessionResolved: boolean;
};
```

and event:

```ts
| { type: "SESSION_RESOLVED"; returning: boolean }
```

Initial state:

```ts
{
  phase: "loading",
  preview: null,
  committed: null,
  returning: false,
  sessionResolved: false,
}
```

`SESSION_RESOLVED` updates `returning` + `sessionResolved` without leaving `loading`.

In `GatewayPrototype`, the first client effect reads `sessionStorage.getItem("bmGatewaySeen")` inside `try/catch`, dispatches `SESSION_RESOLVED`, then starts loader timing/readiness. `LOAD_READY` must not advance before `sessionResolved === true`.

This preserves server-rendered fallback links and avoids hydration/server-storage assumptions.

## Correction 3 — Central monolith must visibly carry BM without Three font assets

The design requires the central monolith to say only `BM`. Do not introduce `FontLoader`, textures, SVG textures, or extra 3D text dependencies.

In `SelectionOverlay`, render a DOM architectural sign aligned to the Three monolith:

```tsx
<div className="gateway-core-mark" aria-hidden="true">
  BM
</div>
```

It appears at the split and moves visually with the monolith bias through the same CSS/state variables. Add a static markup assertion for `gateway-core-mark` and `BM`.

The Three monolith remains a plain mineral/concrete mass.

## Correction 4 — Division identity must leak during the final 15% before hover

V2 distinguishes division lighting strongly during preview, but the approved design says visitors should begin sensing the difference during the last 10–15% of the approach.

Extend `GatewayPose`:

```ts
export type GatewayPose = {
  cameraZ: number;
  cameraX: number;
  cameraYaw: number;
  monolithX: number;
  leftOpen: number;
  rightOpen: number;
  neutralLight: number;
  visualLight: number;
  technicalLight: number;
  identityLeak: number;
  leftPercent: number;
  rightPercent: number;
};
```

Compute:

```ts
const identityLeak = clamp01((travelProgress - 0.85) / 0.15);
```

Before any preview, use `identityLeak` to gradually introduce:

- Visuals: softer, broader, slightly warmer-neutral/pale-mineral contribution.
- Technical: colder-neutral, thinner, more precise slit contribution.

Preview then adds to those base differences.

Add tests:

```text
travelProgress 0.84 → identityLeak 0
travelProgress 0.925 → identityLeak approximately 0.5
travelProgress 1 → identityLeak 1
```

## Final canonical execution order

1. Read the approved design spec.
2. Read `2026-08-24-bm-gateway-tunnel-v2.md`.
3. Apply this addendum as mandatory overrides.
4. Use TDD task-by-task exactly as planned.
5. Finish with the Task 8 viewport/interaction/performance QA and stop at the approved 8.5–9/10 threshold.

Do not production-integrate the gateway into `/` as part of this execution.
