# BM Gateway Tunnel Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated `/gateway-prototype` experience that validates BM's brutalist architectural loader → tunnel → split → division-preview choreography without replacing the current BM Visuals homepage or building BMP Technical prematurely.

**Architecture:** Keep the semantic gateway and interaction state in React/DOM, keep deterministic progress/choreography math in pure TypeScript modules, and isolate raw Three.js behind a small scene-controller interface. The route is progressively enhanced: semantic links render without WebGL/JavaScript, Three.js adds the corridor and spatial transitions when available, and native navigation always remains authoritative.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript, raw Three.js 0.185.x, existing CSS/motion system, Node's built-in test runner.

**Spec:** `docs/superpowers/specs/2026-08-24-bm-gateway-tunnel-design.md`

## Global Constraints

- Prototype only. Do not replace or redesign the current `/` BM Visuals homepage.
- Implement the prototype at `/gateway-prototype`; use `/` as the BM Visuals destination and `/gateway-prototype/technical` as the temporary BMP Technical end-state.
- Preserve the approved wording: `BM VISUALS`, `Creative / Digital Experience`, `Digital identities / with motion, story and distinction.`, `BMP TECHNICAL`, `Technology / AI Systems`, `AI systems, product logic / and technical execution.`
- Loader copy is `BM`, `INITIALIZING`, numeric `00 → 100` with no `%`, then `TWO WORLDS. ONE SYSTEM.`
- First-visit loader minimum display target is approximately 2.3–2.5 seconds; `SKIP →` may appear after approximately 1.2–1.5 seconds; hard fallback timeout is approximately 8–10 seconds.
- Desktop selection is neutral 50/50 and previews approximately 62/38. Mobile preview may expand approximately 68/32.
- Use only raw Three.js plus existing dependencies. Do not add React Three Fiber, Drei, GSAP, Lenis, Blender assets, post-processing, bloom, SSAO, chromatic aberration, depth of field, or film-grain shaders.
- Build the scene from primitive geometry; target roughly 10–20 meaningful meshes and 5–7 major architectural masses.
- No neon, holograms, code rain, floating dashboards, circuit textures, dense particles, sci-fi doors, mechanical machinery, glowing BM logo, heavy fog, lens flare, or grungy cracked concrete.
- Canvas is decorative and `aria-hidden="true"`; all required copy and destinations remain semantic DOM.
- Reduced motion changes choreography to short loader → static architectural reveal → split. Do not merely slow the full camera journey.
- Navigation wins over animation. If enhancement fails, use the real destination link immediately.
- Reuse existing `useInteractionProfile`, `damp`, motion tokens, and contextual-cursor architecture rather than creating parallel global systems.
- Do not modify `app/page.tsx`, project data, cases, Aurelia, HAVEN, ÆTHER, Fabriclism, contact, or unrelated BM Visuals styles.
- Required final verification: 1440×900, 1280×800, 768×1024, and 390×844 plus fine pointer, coarse/touch, reduced motion, keyboard, WebGL failure, browser Back, resize/orientation, and rapid-input cases.

---

## File Structure

Create the gateway as a dedicated feature boundary:

```text
app/gateway-prototype/
├── page.tsx                    # server route, metadata, route-scoped CSS import
├── gateway.css                 # entire gateway visual/responsive system
└── technical/page.tsx          # temporary Technical destination

components/gateway/
├── GatewayPrototype.tsx        # client orchestrator and shared state owner
├── LoaderOverlay.tsx           # loader/counter/skip UI
├── TunnelCanvas.tsx            # canvas lifecycle and Three controller bridge
├── SelectionOverlay.tsx        # semantic division UI + preview/commit events
└── GatewayFallback.tsx         # no-WebGL/no-enhancement semantic split

lib/gateway/
├── state.ts                    # reducer, phase/selection types, session-mode rules
├── progress.ts                 # loader/travel progress math
├── choreography.ts             # pure camera/architecture/ratio mapping
├── navigation.ts               # enhancement policy for real links
└── scene.ts                    # raw Three.js scene/controller

tests/
├── gateway-state.test.mjs
├── gateway-choreography.test.mjs
├── gateway-navigation.test.mjs
└── gateway-markup.test.mjs
```

Modify only:

- `components/motion/ContextCursor.tsx` — add a compact gateway cursor mode.
- `app/motion.css` — style that new mode without changing existing `view`/`explore` behavior.

---

### Task 1: Establish the isolated semantic route and fallback contract

**Files:**
- Create: `app/gateway-prototype/page.tsx`
- Create: `app/gateway-prototype/gateway.css`
- Create: `app/gateway-prototype/technical/page.tsx`
- Create: `components/gateway/GatewayFallback.tsx`
- Create: `tests/gateway-markup.test.mjs`

**Interfaces:**
- `GatewayFallback()` renders the parent BM statement and two real destination links.
- Visuals destination: `/`.
- Technical destination: `/gateway-prototype/technical`.
- Prototype route metadata is non-indexing and explicitly identifies the page as a prototype.

- [ ] **Step 1: Write the failing semantic-contract test**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("gateway fallback exposes both BM divisions through real links", async () => {
  const source = await read("../components/gateway/GatewayFallback.tsx");

  assert.match(source, /BM VISUALS/);
  assert.match(source, /Creative \/ Digital Experience/);
  assert.match(source, /href="\/"/);
  assert.match(source, /BMP TECHNICAL/);
  assert.match(source, /Technology \/ AI Systems/);
  assert.match(source, /href="\/gateway-prototype\/technical"/);
});

test("prototype route remains isolated from the production homepage", async () => {
  const gateway = await read("../app/gateway-prototype/page.tsx");
  const home = await read("../app/page.tsx");

  assert.match(gateway, /gateway\.css/);
  assert.doesNotMatch(home, /GatewayPrototype|gateway-prototype/i);
});
```

- [ ] **Step 2: Run the targeted test and verify it fails because the gateway files do not exist**

Run:

```bash
node --test tests/gateway-markup.test.mjs
```

Expected: FAIL with file-not-found errors for the new route/component.

- [ ] **Step 3: Implement the server route and semantic fallback**

Use this route shape:

```tsx
import type { Metadata } from "next";
import { GatewayPrototype } from "@/components/gateway/GatewayPrototype";
import "./gateway.css";

export const metadata: Metadata = {
  title: "BM Gateway Prototype",
  description: "Prototype gateway between BM Visuals and BMP Technical.",
  robots: { index: false, follow: false },
};

export default function GatewayPrototypePage() {
  return <GatewayPrototype />;
}
```

`GatewayPrototype` is created in Task 5; for this task use `GatewayFallback` directly so the route builds before enhancement exists, then swap to the orchestrator in Task 5.

Fallback markup must include:

```tsx
<main className="gateway-page gateway-fallback" data-scene-theme="graphite">
  <p className="gateway-fallback__mark">BM</p>
  <p className="gateway-fallback__statement">TWO WORLDS. ONE SYSTEM.</p>
  <nav aria-label="BM divisions" className="gateway-fallback__choices">
    <Link href="/">BM VISUALS <span>Creative / Digital Experience</span></Link>
    <Link href="/gateway-prototype/technical">BMP TECHNICAL <span>Technology / AI Systems</span></Link>
  </nav>
</main>
```

- [ ] **Step 4: Add the temporary Technical end-state**

Render a minimal page containing only:

```text
BMP TECHNICAL
Technology / AI Systems
PROTOTYPE DESTINATION
BACK TO GATEWAY ←
```

Set `robots: { index: false, follow: false }`. Do not invent Technical services or proof.

- [ ] **Step 5: Run the test, typecheck, and build**

```bash
node --test tests/gateway-markup.test.mjs
npm run typecheck
npm run build
```

Expected: PASS; `/gateway-prototype` and `/gateway-prototype/technical` build without changing `/`.

- [ ] **Step 6: Commit**

```bash
git add app/gateway-prototype components/gateway/GatewayFallback.tsx tests/gateway-markup.test.mjs
git commit -m "feat: establish isolated BM gateway prototype route"
```

---

### Task 2: Implement deterministic gateway state, session, loader, travel, and navigation policies

**Files:**
- Create: `lib/gateway/state.ts`
- Create: `lib/gateway/progress.ts`
- Create: `lib/gateway/navigation.ts`
- Create: `tests/gateway-state.test.mjs`
- Create: `tests/gateway-navigation.test.mjs`

**Interfaces:**

```ts
export type GatewayDivision = "visuals" | "technical";
export type GatewayPhase =
  | "loading"
  | "auto-entry"
  | "user-travel"
  | "split"
  | "preview"
  | "commit"
  | "exit"
  | "fallback";

export type GatewayState = {
  phase: GatewayPhase;
  preview: GatewayDivision | null;
  committed: GatewayDivision | null;
  returning: boolean;
};

export type GatewayEvent =
  | { type: "LOADER_COMPLETE"; reducedMotion: boolean }
  | { type: "AUTO_COMPLETE" }
  | { type: "TRAVEL_COMPLETE" }
  | { type: "PREVIEW"; division: GatewayDivision }
  | { type: "CLEAR_PREVIEW" }
  | { type: "COMMIT"; division: GatewayDivision }
  | { type: "EXIT" }
  | { type: "FAIL" };

export function createGatewayState(returning: boolean): GatewayState;
export function gatewayReducer(state: GatewayState, event: GatewayEvent): GatewayState;
export function getSelectionBias(state: GatewayState): -1 | 0 | 1;
```

Progress API:

```ts
export const GATEWAY_TIMING = {
  loaderMinMs: 2400,
  skipRevealMs: 1350,
  fallbackMs: 9000,
  autoEntryMs: 1750,
  skipFastForwardMs: 800,
  exitMs: 850,
} as const;

export function getLoaderTarget(realProgress: number, elapsedMs: number): number;
export function formatLoaderNumber(progress: number): string;
export function shouldShowSkip(elapsedMs: number, returning: boolean): boolean;
export function applyTravelDelta(progress: number, delta: number): number;
export function stepTravelProgress(current: number, target: number, deltaSeconds: number): number;
```

Navigation API follows the existing project-transition safety pattern:

```ts
export type GatewayNavigationIntent = {
  button: number;
  defaultPrevented: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  target?: string;
  download: boolean;
  reducedMotion: boolean;
  enhancementReady: boolean;
};

export function shouldEnhanceGatewayNavigation(intent: GatewayNavigationIntent): boolean;
```

- [ ] **Step 1: Write failing reducer/progress tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  createGatewayState,
  gatewayReducer,
  getSelectionBias,
} from "../lib/gateway/state.ts";
import {
  applyTravelDelta,
  formatLoaderNumber,
  getLoaderTarget,
  shouldShowSkip,
} from "../lib/gateway/progress.ts";

test("first visit follows loading → auto → travel → split", () => {
  let state = createGatewayState(false);
  state = gatewayReducer(state, { type: "LOADER_COMPLETE", reducedMotion: false });
  assert.equal(state.phase, "auto-entry");
  state = gatewayReducer(state, { type: "AUTO_COMPLETE" });
  assert.equal(state.phase, "user-travel");
  state = gatewayReducer(state, { type: "TRAVEL_COMPLETE" });
  assert.equal(state.phase, "split");
});

test("return and reduced-motion visits skip the long camera journey", () => {
  const returning = gatewayReducer(createGatewayState(true), {
    type: "LOADER_COMPLETE",
    reducedMotion: false,
  });
  const reduced = gatewayReducer(createGatewayState(false), {
    type: "LOADER_COMPLETE",
    reducedMotion: true,
  });
  assert.equal(returning.phase, "split");
  assert.equal(reduced.phase, "split");
});

test("rapid previews replace each other and commit locks the chosen division", () => {
  let state = { ...createGatewayState(false), phase: "split" };
  state = gatewayReducer(state, { type: "PREVIEW", division: "visuals" });
  assert.equal(getSelectionBias(state), -1);
  state = gatewayReducer(state, { type: "PREVIEW", division: "technical" });
  assert.equal(getSelectionBias(state), 1);
  state = gatewayReducer(state, { type: "COMMIT", division: "technical" });
  const attemptedSwitch = gatewayReducer(state, { type: "PREVIEW", division: "visuals" });
  assert.equal(attemptedSwitch.committed, "technical");
});

test("loader is time-gated, never shows a percent sign, and travel clamps", () => {
  assert.ok(getLoaderTarget(1, 600) < 1);
  assert.equal(getLoaderTarget(1, 2400), 1);
  assert.equal(formatLoaderNumber(0), "00");
  assert.equal(formatLoaderNumber(1), "100");
  assert.equal(formatLoaderNumber(0.74), "74");
  assert.equal(shouldShowSkip(1200, false), false);
  assert.equal(shouldShowSkip(1400, false), true);
  assert.equal(shouldShowSkip(5000, true), false);
  assert.equal(applyTravelDelta(0.95, 10000), 1);
  assert.equal(applyTravelDelta(0.05, -10000), 0);
});
```

- [ ] **Step 2: Write failing navigation-policy tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { shouldEnhanceGatewayNavigation } from "../lib/gateway/navigation.ts";

const primary = {
  button: 0,
  defaultPrevented: false,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  target: undefined,
  download: false,
  reducedMotion: false,
  enhancementReady: true,
};

test("gateway enhancement runs only for an ordinary ready primary navigation", () => {
  assert.equal(shouldEnhanceGatewayNavigation(primary), true);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, button: 1 }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, ctrlKey: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, target: "_blank" }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, reducedMotion: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, enhancementReady: false }), false);
});
```

- [ ] **Step 3: Run both tests and confirm the modules are missing**

```bash
node --test tests/gateway-state.test.mjs tests/gateway-navigation.test.mjs
```

Expected: FAIL before implementation.

- [ ] **Step 4: Implement minimal pure modules**

Use existing `clamp01` and `damp` from `lib/motion/physics.ts`. `getLoaderTarget()` must cap incomplete real loading at `0.96`, and may return `1` only when both real progress and the 2400 ms time gate have completed.

Use a travel sensitivity around `0.0012` per wheel delta unit and `MOTION.damping.scroll` for frame-rate-independent damping.

`gatewayReducer()` must ignore preview/clear-preview events after `committed` becomes non-null.

- [ ] **Step 5: Run tests**

```bash
node --test tests/gateway-state.test.mjs tests/gateway-navigation.test.mjs
npm run typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/gateway tests/gateway-state.test.mjs tests/gateway-navigation.test.mjs
git commit -m "feat: add gateway interaction state and progress policies"
```

---

### Task 3: Define testable spatial choreography before building Three.js

**Files:**
- Create: `lib/gateway/choreography.ts`
- Create: `tests/gateway-choreography.test.mjs`

**Interfaces:**

```ts
export type GatewayPoseInput = {
  travelProgress: number;
  selectionBias: -1 | 0 | 1;
  exitProgress: number;
  committed: GatewayDivision | null;
  reducedMotion: boolean;
  coarsePointer: boolean;
};

export type GatewayPose = {
  cameraZ: number;
  cameraX: number;
  cameraYaw: number;
  monolithX: number;
  leftOpen: number;
  rightOpen: number;
  visualLight: number;
  technicalLight: number;
  leftPercent: number;
  rightPercent: number;
};

export function deriveGatewayPose(input: GatewayPoseInput): GatewayPose;
```

- [ ] **Step 1: Write the failing choreography tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { deriveGatewayPose } from "../lib/gateway/choreography.ts";

const base = {
  travelProgress: 1,
  selectionBias: 0,
  exitProgress: 0,
  committed: null,
  reducedMotion: false,
  coarsePointer: false,
};

test("neutral split is balanced", () => {
  const pose = deriveGatewayPose(base);
  assert.equal(pose.leftPercent, 50);
  assert.equal(pose.rightPercent, 50);
  assert.equal(pose.cameraX, 0);
  assert.equal(pose.monolithX, 0);
});

test("desktop previews resolve to 62/38 with restrained camera bias", () => {
  const visuals = deriveGatewayPose({ ...base, selectionBias: -1 });
  const technical = deriveGatewayPose({ ...base, selectionBias: 1 });
  assert.deepEqual([visuals.leftPercent, visuals.rightPercent], [62, 38]);
  assert.deepEqual([technical.leftPercent, technical.rightPercent], [38, 62]);
  assert.ok(Math.abs(visuals.cameraYaw) <= 0.035);
  assert.ok(Math.abs(technical.cameraYaw) <= 0.035);
});

test("coarse preview expands further while reduced motion removes camera bias", () => {
  const mobile = deriveGatewayPose({ ...base, selectionBias: -1, coarsePointer: true });
  const reduced = deriveGatewayPose({ ...base, selectionBias: -1, reducedMotion: true });
  assert.deepEqual([mobile.leftPercent, mobile.rightPercent], [68, 32]);
  assert.equal(reduced.cameraX, 0);
  assert.equal(reduced.cameraYaw, 0);
});
```

- [ ] **Step 2: Run and confirm failure**

```bash
node --test tests/gateway-choreography.test.mjs
```

- [ ] **Step 3: Implement choreography as pure interpolation**

Use clamped/smoothed progress, not DOM measurements. Suggested spatial range:

```ts
const cameraZ = lerp(12, -18, travelProgress);
const cameraX = reducedMotion ? 0 : selectionBias * 0.32;
const cameraYaw = reducedMotion ? 0 : selectionBias * 0.018;
const monolithX = selectionBias * 1.1;
```

Because `-1` means Visuals/left, signs for `cameraX` and `monolithX` may need inversion according to Three.js coordinates; tests should assert magnitude and ratio, while the browser QA confirms the physical direction.

Visuals preview should increase `visualLight` and soft/open left geometry; Technical preview should increase `technicalLight` and separate the right structural planes. Do not make the two sides identical mirrored animations internally.

- [ ] **Step 4: Run test and typecheck**

```bash
node --test tests/gateway-choreography.test.mjs
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/gateway/choreography.ts tests/gateway-choreography.test.mjs
git commit -m "feat: define BM gateway spatial choreography"
```

---

### Task 4: Build the raw Three.js architectural scene behind a small controller interface

**Files:**
- Create: `lib/gateway/scene.ts`
- Create: `components/gateway/TunnelCanvas.tsx`
- Modify: `tests/gateway-markup.test.mjs`

**Interfaces:**

```ts
export type GatewaySceneFrame = GatewayPose;

export type GatewaySceneController = {
  setTarget(frame: GatewaySceneFrame): void;
  resize(width: number, height: number, dpr: number): void;
  tick(deltaSeconds: number): boolean;
  render(): void;
  dispose(): void;
};

export function createGatewayScene(canvas: HTMLCanvasElement): GatewaySceneController;
```

`tick()` returns `true` while internal transforms are still settling so `TunnelCanvas` can stop requesting frames when static.

- [ ] **Step 1: Extend the markup/static-architecture test before creating the files**

Add:

```js
test("gateway canvas is decorative and the scene stays dependency-light", async () => {
  const canvas = await read("../components/gateway/TunnelCanvas.tsx");
  const scene = await read("../lib/gateway/scene.ts");

  assert.match(canvas, /aria-hidden="true"/);
  assert.match(scene, /from "three"/);
  assert.match(scene, /BoxGeometry|PlaneGeometry/);
  assert.doesNotMatch(scene, /@react-three|drei|gsap|postprocessing|EffectComposer/);
  assert.doesNotMatch(scene, /TextureLoader|GLTFLoader/);
});
```

- [ ] **Step 2: Run and confirm failure because canvas/scene are absent**

```bash
node --test tests/gateway-markup.test.mjs
```

- [ ] **Step 3: Implement the scene foundation**

`createGatewayScene()` must create:

- one `WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" })`;
- one restrained `PerspectiveCamera` with FOV approximately 45–52°, no head bob and no FPS controls;
- graphite `Scene` background;
- smooth `MeshStandardMaterial` concrete variants with high roughness and low metalness;
- blackened-metal material only for restrained joints;
- an entry frame, floor, two main wall masses, ceiling mass, light-cut plane, central monolith, two split-wing groups, and several emissive slit planes;
- a modest ambient/hemisphere source plus only a few controlled directional/point lights;
- no shadows initially; enable only one bounded shadow source later if browser QA proves depth is insufficient.

Use primitive meshes and keep the final mesh count in the approximate 10–20 range.

- [ ] **Step 4: Implement target-driven transforms**

`setTarget()` stores the latest `GatewayPose`. `tick()` damps current values toward target values using existing `damp()` and returns whether meaningful movement remains.

Map pose values to:

- camera Z/X/yaw;
- monolith X shift;
- Visuals wing opening and pale-mineral light intensity;
- Technical wing structural separation and colder slit intensity.

Do not animate by starting independent timers in the scene; all motion derives from current targets so rapid hover switching interrupts cleanly.

- [ ] **Step 5: Implement canvas lifecycle**

`TunnelCanvas` must:

- create the controller inside `useEffect` with try/catch;
- call `onReady()` only after renderer/scene creation succeeds;
- call `onFailure()` on renderer construction/runtime initialization failure;
- use `ResizeObserver` or window resize to call `resize()` without remounting;
- cap DPR using `Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.5)`;
- pause RAF while `document.hidden` is true;
- restart RAF when target props change or visibility returns;
- call `dispose()` and remove listeners/observers on unmount;
- render `<canvas aria-hidden="true" tabIndex={-1}>`.

- [ ] **Step 6: Run verification**

```bash
node --test tests/gateway-markup.test.mjs tests/gateway-choreography.test.mjs
npm run lint
npm run typecheck
npm run build
```

Expected: PASS and no added package dependency.

- [ ] **Step 7: Commit**

```bash
git add lib/gateway/scene.ts components/gateway/TunnelCanvas.tsx tests/gateway-markup.test.mjs
git commit -m "feat: build BM gateway architectural Three scene"
```

---

### Task 5: Build the loader, hybrid travel controller, session behavior, and WebGL fallback

**Files:**
- Create: `components/gateway/LoaderOverlay.tsx`
- Create: `components/gateway/GatewayPrototype.tsx`
- Modify: `app/gateway-prototype/page.tsx`
- Modify: `components/gateway/GatewayFallback.tsx`
- Modify: `tests/gateway-markup.test.mjs`

**Interfaces:**
- `GatewayPrototype` owns the reducer, interaction profile, readiness, loader timing, travel target/current values, `selectionBias`, fallback state, and session flag.
- `LoaderOverlay({ progress, phase, canSkip, onSkip })` renders `BM`, `INITIALIZING`, numeric counter, statement, and skip.
- Session key: `bmGatewaySeen` with value `"1"`.

- [ ] **Step 1: Add failing loader/static assertions**

```js
test("gateway loader uses BM-specific counter copy without a percent sign", async () => {
  const source = await read("../components/gateway/LoaderOverlay.tsx");
  assert.match(source, /INITIALIZING/);
  assert.match(source, /TWO WORLDS\. ONE SYSTEM\./);
  assert.match(source, /SKIP/);
  assert.doesNotMatch(source, /%/);
});

test("gateway orchestration owns the session key and hard fallback", async () => {
  const source = await read("../components/gateway/GatewayPrototype.tsx");
  assert.match(source, /bmGatewaySeen/);
  assert.match(source, /fallbackMs/);
  assert.match(source, /GatewayFallback/);
});
```

- [ ] **Step 2: Run and confirm failure**

```bash
node --test tests/gateway-markup.test.mjs
```

- [ ] **Step 3: Implement semi-real readiness and loader timing**

In `GatewayPrototype` track two readiness inputs:

```ts
const realProgress = sceneReady * 0.8 + fontsReady * 0.2;
```

Resolve `fontsReady` from `document.fonts?.ready`, defaulting safely to ready when the API is absent. Animate displayed progress by damping toward `getLoaderTarget(realProgress, elapsedMs)` on RAF.

Start a 9000 ms hard timeout at mount; if the scene has not become usable by then, dispatch `FAIL` and reveal `GatewayFallback`.

On first visit, complete the loader only when displayed progress reaches 1. On return visit, show a short BM flash around 500–700 ms and then dispatch directly to split.

- [ ] **Step 4: Implement hybrid travel**

During `auto-entry`, interpolate travel target from 0 to approximately 0.68 over `GATEWAY_TIMING.autoEntryMs`.

Then dispatch `AUTO_COMPLETE` and reveal `MOVE FORWARD`.

During `user-travel`:

- attach non-passive `wheel` only to the full-screen gateway root and prevent default only in this phase;
- update target progress through `applyTravelDelta()`;
- support vertical touch/pointer drag by tracking start Y and applying the same clamped progress helper;
- damp rendered progress each frame;
- dispatch `TRAVEL_COMPLETE` once rendered progress reaches approximately `0.995`.

Skip must animate the target to 1 over approximately 800 ms and finish at split, not immediately teleport.

- [ ] **Step 5: Implement session and failure behavior**

Read `sessionStorage.getItem("bmGatewaySeen")` after hydration. Do not access sessionStorage during server render.

Write `bmGatewaySeen = "1"` only when a division commit begins.

If WebGL fails, timeout fires, or an unexpected scene initialization exception occurs, phase becomes `fallback`, canvas enhancement is removed, and the semantic fallback remains usable.

- [ ] **Step 6: Swap the route to the orchestrator and verify**

```bash
node --test tests/gateway-state.test.mjs tests/gateway-markup.test.mjs
npm run lint
npm run typecheck
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/gateway app/gateway-prototype/page.tsx tests/gateway-markup.test.mjs
git commit -m "feat: choreograph BM gateway loading and tunnel travel"
```

---

### Task 6: Implement split preview, semantic exit links, compact contextual cursor, and commit transition

**Files:**
- Create: `components/gateway/SelectionOverlay.tsx`
- Modify: `components/gateway/GatewayPrototype.tsx`
- Modify: `components/motion/ContextCursor.tsx`
- Modify: `app/motion.css`
- Modify: `tests/gateway-markup.test.mjs`

**Interfaces:**
- SelectionOverlay receives `state`, `leftPercent`, `rightPercent`, and callbacks `onPreview`, `onClearPreview`, `onCommit`.
- Both CTAs remain real links with the canonical destinations.
- Existing cursor modes `default`, `view`, and `explore` must remain unchanged; add `gateway` only.

- [ ] **Step 1: Add failing selection/cursor assertions**

```js
test("selection overlay contains the approved short division copy and real CTAs", async () => {
  const source = await read("../components/gateway/SelectionOverlay.tsx");
  assert.match(source, /Digital identities/);
  assert.match(source, /with motion, story and distinction\./);
  assert.match(source, /AI systems, product logic/);
  assert.match(source, /and technical execution\./);
  assert.match(source, /ENTER VISUALS/);
  assert.match(source, /ENTER TECHNICAL/);
});

test("context cursor adds a compact gateway mode without replacing existing modes", async () => {
  const source = await read("../components/motion/ContextCursor.tsx");
  assert.match(source, /"gateway"/);
  assert.match(source, /"view"/);
  assert.match(source, /"explore"/);
});
```

- [ ] **Step 2: Run and confirm failure**

```bash
node --test tests/gateway-markup.test.mjs
```

- [ ] **Step 3: Implement neutral and preview states**

Selection DOM structure should use two semantic regions, each with visible title/descriptor and a real CTA link. Do not build card UI or rounded panels.

Fine pointer:

- pointer enter/focus Visuals → `PREVIEW visuals`;
- pointer enter/focus Technical → `PREVIEW technical`;
- pointer leave the overall split → `CLEAR_PREVIEW`;
- use pose percentages for CSS custom properties `--gateway-left` and `--gateway-right`.

Copy reveal order is title response → first line → second line → CTA, using CSS transition delays around 160 ms / +110 ms / +120 ms. Transitions must be property-driven so state switching interrupts instead of queueing.

Coarse pointer:

- first tap on a division's non-link preview area selects/expands it;
- CTA then becomes prominent and remains a real link;
- tapping the other preview area switches selection;
- do not fake hover.

Keyboard:

- focusing the Visuals CTA previews Visuals;
- focusing Technical previews Technical;
- real Enter navigation remains available even if enhancement is unavailable;
- Escape while previewing dispatches `CLEAR_PREVIEW`.

- [ ] **Step 4: Implement compact gateway cursor mode**

Extend:

```ts
type CursorMode = "default" | "view" | "explore" | "gateway";
```

Allow `data-cursor="gateway"` and custom `data-cursor-label` values.

In `app/motion.css`, gateway mode must remain a small dot approximately 10–12px with the label offset beside it. Do not inherit the existing 84px orange `view/explore` blob. Preserve existing modes exactly.

- [ ] **Step 5: Implement enhanced commit navigation**

For each CTA, derive a `GatewayNavigationIntent`. If `shouldEnhanceGatewayNavigation()` returns false, do not prevent default.

If true:

1. `preventDefault()`.
2. Dispatch `COMMIT` with the selected division and set the session flag.
3. Animate `exitProgress` from 0→1 for about 850 ms.
4. During commit, ignore new preview/click requests.
5. At the end call `router.push(href)`.
6. Schedule a fallback `window.location.assign(href)` if pathname has not changed after a bounded safety timeout (approximately 1300–1500 ms).

Visuals exit increases light and opens the left passage to full frame. Technical exit aligns/sharpens the right passage while remaining darker. No black cut is added by the gateway itself.

- [ ] **Step 6: Verify**

```bash
node --test tests/gateway-navigation.test.mjs tests/gateway-state.test.mjs tests/gateway-markup.test.mjs
npm run lint
npm run typecheck
npm run build
```

Expected: PASS; existing site cursor behavior remains intact.

- [ ] **Step 7: Commit**

```bash
git add components/gateway/SelectionOverlay.tsx components/gateway/GatewayPrototype.tsx components/motion/ContextCursor.tsx app/motion.css tests/gateway-markup.test.mjs
git commit -m "feat: add BM gateway division preview and entry transitions"
```

---

### Task 7: Finish gateway art direction, responsive modes, reduced motion, and progressive enhancement CSS

**Files:**
- Modify: `app/gateway-prototype/gateway.css`
- Modify: `components/gateway/GatewayFallback.tsx`
- Modify: `components/gateway/GatewayPrototype.tsx`
- Modify: `tests/gateway-markup.test.mjs`

**Interfaces:**
- `.gateway-page` owns viewport isolation.
- `data-gateway-enhanced`, `data-gateway-phase`, and `data-gateway-selection` are the only route-level DOM state hooks CSS needs.
- Fallback markup is visible by default; enhancement hides/recomposes it only after hydration/scene readiness.

- [ ] **Step 1: Add static assertions for progressive enhancement and reduced motion**

```js
test("gateway CSS contains touch and reduced-motion first-class modes", async () => {
  const css = await read("../app/gateway-prototype/gateway.css");
  assert.match(css, /pointer: coarse|hover: none/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /100svh/);
});
```

- [ ] **Step 2: Establish the brutalist visual system**

Use route-scoped colors close to:

```css
.gateway-page {
  --gateway-bg: #090909;
  --gateway-ink: #f2f0eb;
  --gateway-muted: rgba(242, 240, 235, 0.56);
  --gateway-line: rgba(242, 240, 235, 0.18);
  min-height: 100svh;
  overflow: hidden;
  background: var(--gateway-bg);
}
```

Keep typography architectural/editorial: large uppercase division titles, small tracked descriptors, no rounded cards, pills, gradients, glassmorphism, glow, or decorative UI chrome.

Loader should remain visually sparse: BM mark, counter, small initialization metadata, and minimal skip in a corner.

- [ ] **Step 3: Implement desktop split layout**

At ≥1024px:

- two absolute/full-height division regions use `--gateway-left` / `--gateway-right`;
- central alignment preserves the monolith gap;
- preview copy occupies only 2 short lines;
- neutral state is 50/50;
- selected region transitions over roughly 450–650 ms with existing scene easing;
- non-selected region stays legible but lower contrast.

- [ ] **Step 4: Implement tablet/mobile behavior**

At portrait tablet and mobile:

- preserve spatial left/right meaning in canvas but allow overlay copy to compose vertically;
- use stacked choice regions when horizontal text would be cramped;
- selected coarse region uses about 68% visual ownership and leaves the other division visible;
- no custom cursor;
- `MOVE FORWARD` becomes touch-appropriate without adding long instructions;
- mobile camera journey is shortened by using the coarse-pointer choreography path.

- [ ] **Step 5: Implement reduced-motion CSS/behavior**

With reduced motion:

- loader is short and static;
- no long camera translate, no camera yaw/bias, no accelerated exit;
- selection relies on contrast, modest width changes, and immediate copy reveal;
- global existing reduced-motion rules remain untouched.

- [ ] **Step 6: Make no-JS/WebGL fallback visually intentional**

Fallback must not look like an error state. It uses the same BM mark, statement, typography, divider language, and real links. Do not display messages such as `WebGL unsupported` or `loading failed`.

- [ ] **Step 7: Run tests/build**

```bash
node --test tests/gateway-markup.test.mjs
npm run lint
npm run typecheck
npm test
npm run build
```

Expected: all existing and gateway tests PASS.

- [ ] **Step 8: Commit**

```bash
git add app/gateway-prototype/gateway.css components/gateway tests/gateway-markup.test.mjs
git commit -m "feat: polish responsive BM gateway prototype"
```

---

### Task 8: Fresh verification, visual QA, performance guardrails, and prototype delivery

**Files:**
- Modify only gateway prototype files if verification reveals a gateway regression.
- Do not change production BM Visuals presentation to improve gateway QA.

**Interfaces:**
- This task produces verification evidence and a reviewable prototype branch/preview, not production integration.

- [ ] **Step 1: Run clean repository checks**

```bash
git diff --check
rg -n '^(<<<<<<<|=======|>>>>>>>)' --glob '!node_modules/**' --glob '!.next/**' --glob '!.git/**' .
npm run lint
npm run typecheck
npm test
npm run build
```

Expected: no whitespace/conflict errors and all commands PASS.

- [ ] **Step 2: Confirm dependency scope did not drift**

```bash
git diff -- package.json package-lock.json
```

Expected: no new R3F, Drei, GSAP, Lenis, post-processing, or unrelated dependency. Ideally no dependency diff at all because `three` already exists.

- [ ] **Step 3: Browser QA the seven required freeze frames**

Capture and inspect:

1. loader around `50`;
2. tunnel just after auto-entry;
3. neutral split;
4. Visuals preview;
5. Technical preview;
6. mobile neutral split;
7. mobile selected preview.

Each still frame must look intentional without relying on motion to hide poor composition.

- [ ] **Step 4: Verify required viewport matrix**

Inspect `/gateway-prototype` at:

```text
1440 × 900
1280 × 800
768 × 1024
390 × 844
```

Also rotate/rescale during the tunnel and split to verify renderer resize, camera aspect update, and stable overlay layout without remounting the route.

- [ ] **Step 5: Verify interaction edge cases**

Manually test:

- rapid Visuals → Technical → Visuals hover switching;
- wheel/trackpad spam does not exceed travel bounds or skip split;
- touch/swipe travel on coarse pointer;
- first mobile tap previews, CTA enters;
- repeated CTA click after commit does not double-navigate;
- Tab focus previews each division and focus ring remains visible;
- Escape returns preview to neutral;
- modifier/middle/new-tab navigation stays native;
- browser Back after entering Visuals returns through short-session flow, not full loader;
- `prefers-reduced-motion` uses short/static choreography;
- WebGL renderer failure uses the DOM fallback;
- 9-second initialization timeout uses the DOM fallback;
- hidden tab pauses the scene loop and return resumes safely.

- [ ] **Step 6: Verify the creative failure criterion**

Review camera FOV/speed, lighting, geometry, and typography specifically for the question: **does this look like an architectural brand installation rather than an FPS lobby, sci-fi game menu, or Unreal demo?**

If it reads game-like, first reduce FOV distortion, camera speed/yaw, contrasty colored lighting, environmental detail, and mechanical movement. Do not solve it by adding more effects.

- [ ] **Step 7: Verify performance guardrails**

In browser devtools:

- confirm no large texture/GLTF requests;
- confirm canvas DPR cap is applied;
- confirm no continuous heavy render while the split is fully settled and untouched;
- confirm no obvious memory/listener growth across gateway → Visuals → Back cycles;
- confirm no console, hydration, WebGL, or React errors;
- confirm total first-use blocking time normally stays around/below 5–6 seconds on a normal machine.

- [ ] **Step 8: Score prototype and stop at the agreed threshold**

Evaluate the six spec questions:

```text
Loader anticipation without copying the reference?
Loader → tunnel reads as one continuous space?
Corridor premium/architectural rather than game-like?
50/50 split understandable without long instruction?
62/38 preview differentiates the two divisions?
Exit makes both divisions feel part of one BM ecosystem?
```

If the prototype is approximately **8.5–9/10**, stop. Do not add sound, project previews, particles, more shaders, production routing, or full BMP Technical features.

- [ ] **Step 9: Commit final gateway-only fixes, push, and open a review PR**

Use a feature branch/worktree based on the approved design branch, e.g. `feat/bm-gateway-tunnel-prototype`. Final commit should describe only the prototype. Open a PR for review; do not replace `/` or merge a production gateway integration as part of this plan.
