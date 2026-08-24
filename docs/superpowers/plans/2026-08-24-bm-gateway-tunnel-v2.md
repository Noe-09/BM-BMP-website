# BM Gateway Tunnel Prototype Implementation Plan — V2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an isolated `/gateway-prototype` experience that validates BM's brutalist architectural loader → tunnel → split → division-preview choreography without replacing the current BM Visuals homepage or building BMP Technical prematurely.

**Architecture:** Keep semantic navigation and the top-level interaction state in React/DOM, keep loader/travel/spatial math in pure TypeScript modules, and isolate raw Three.js behind one scene-controller interface. The route is progressively enhanced: server-rendered links are authoritative, WebGL adds the corridor when available, and animation may delay ordinary pointer navigation only when the enhancement is healthy and the visitor has not requested reduced motion.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript, raw Three.js 0.185.x, the existing BM CSS/motion system, Node's built-in test runner.

**Spec:** `docs/superpowers/specs/2026-08-24-bm-gateway-tunnel-design.md`

## Global Constraints

- Prototype only. Do not replace or redesign the current `/` BM Visuals homepage.
- Implement the prototype at `/gateway-prototype`.
- BM Visuals destination is `/`.
- Temporary BMP Technical destination is `/gateway-prototype/technical` and contains no invented proof/services.
- Approved selection copy is exact:
  - `BM VISUALS`
  - `Creative / Digital Experience`
  - `Digital identities`
  - `with motion, story and distinction.`
  - `BMP TECHNICAL`
  - `Technology / AI Systems`
  - `AI systems, product logic`
  - `and technical execution.`
- Loader copy is `BM`, `INITIALIZING`, numeric `00 → 100` with no `%`, followed by `TWO WORLDS. ONE SYSTEM.`
- First-visit loader minimum target is 2400 ms; return-session loader target is 600 ms; ready hold is 260 ms; skip appears at 1350 ms; hard fallback timeout is 9000 ms.
- Desktop neutral split is 50/50 and preview is 62/38. Coarse/touch preview is 68/32.
- Mobile/coarse camera travel must be approximately 30–40% shorter than desktop camera travel.
- Use only raw Three.js plus dependencies already in the repository. Do not add React Three Fiber, Drei, GSAP, Lenis, Blender assets, post-processing, bloom, SSAO, chromatic aberration, depth of field, or film-grain shaders.
- Build the scene from primitive geometry. Target approximately 10–20 meaningful meshes and 5–7 major architectural masses.
- No neon, holograms, code rain, dashboards, circuit textures, dense particles, sci-fi doors, rotating machinery, glowing BM logo, heavy fog, fake lens flare, grungy cracked concrete, or game HUD language.
- Canvas is decorative and `aria-hidden="true"`; all required copy and destinations remain semantic DOM.
- Reduced motion uses short loader → static architectural reveal → split. Do not merely slow the complete camera journey.
- Navigation wins over animation. Modified clicks, middle/right clicks, keyboard activation, explicit new-tab targets, downloads, reduced motion, and unhealthy enhancement remain native.
- Reuse existing `useInteractionProfile`, `MOTION`, `clamp01`, `damp`, and contextual-cursor architecture.
- Do not modify `app/page.tsx`, project registries, project cases, Fabriclism, Aurelia, HAVEN, ÆTHER, contact, or unrelated BM Visuals styles.
- Required final viewports: 1440×900, 1280×800, 768×1024, 390×844.
- Required interaction QA: fine pointer, coarse/touch, keyboard, reduced motion, WebGL failure, 9-second timeout, browser Back, resize/orientation, rapid hover, scroll spam, click spam, visibility pause/resume.

---

## File Structure

```text
app/gateway-prototype/
├── page.tsx
├── gateway.css
└── technical/page.tsx

components/gateway/
├── GatewayPrototype.tsx
├── GatewayFallback.tsx
├── LoaderOverlay.tsx
├── TunnelCanvas.tsx
└── SelectionOverlay.tsx

lib/gateway/
├── state.ts
├── progress.ts
├── navigation.ts
├── choreography.ts
└── scene.ts

tests/
├── gateway-state.test.mjs
├── gateway-navigation.test.mjs
├── gateway-choreography.test.mjs
└── gateway-markup.test.mjs
```

Modify only these existing files:

- `components/motion/ContextCursor.tsx` — add one compact `gateway` mode.
- `app/motion.css` — style that mode without altering `view` or `explore` behavior.

---

### Task 1: Establish an isolated semantic route and intentional no-JS/WebGL fallback

**Files:**
- Create: `app/gateway-prototype/page.tsx`
- Create: `app/gateway-prototype/gateway.css`
- Create: `app/gateway-prototype/technical/page.tsx`
- Create: `components/gateway/GatewayFallback.tsx`
- Create: `tests/gateway-markup.test.mjs`

**Interfaces:**
- `GatewayFallback()` provides the BM parent statement, both approved short descriptions, and two real links.
- Visuals link: `/`.
- Technical link: `/gateway-prototype/technical`.
- Both prototype routes set `robots: { index: false, follow: false }`.

- [ ] **Step 1: Write the failing semantic contract test**

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("gateway fallback exposes both BM divisions and approved short descriptions", async () => {
  const source = await read("../components/gateway/GatewayFallback.tsx");

  assert.match(source, /BM VISUALS/);
  assert.match(source, /Creative \/ Digital Experience/);
  assert.match(source, /Digital identities/);
  assert.match(source, /with motion, story and distinction\./);
  assert.match(source, /href="\/"/);

  assert.match(source, /BMP TECHNICAL/);
  assert.match(source, /Technology \/ AI Systems/);
  assert.match(source, /AI systems, product logic/);
  assert.match(source, /and technical execution\./);
  assert.match(source, /href="\/gateway-prototype\/technical"/);
});

test("gateway route is isolated from the production homepage", async () => {
  const gateway = await read("../app/gateway-prototype/page.tsx");
  const home = await read("../app/page.tsx");

  assert.match(gateway, /gateway\.css/);
  assert.doesNotMatch(home, /GatewayPrototype|gateway-prototype/i);
});
```

- [ ] **Step 2: Run the test and verify red state**

```bash
node --test tests/gateway-markup.test.mjs
```

Expected: FAIL because the gateway files do not exist.

- [ ] **Step 3: Implement the Task-1 route with the fallback, not the future orchestrator**

`app/gateway-prototype/page.tsx` must be:

```tsx
import type { Metadata } from "next";
import { GatewayFallback } from "@/components/gateway/GatewayFallback";
import "./gateway.css";

export const metadata: Metadata = {
  title: "BM Gateway Prototype",
  description: "Prototype gateway between BM Visuals and BMP Technical.",
  robots: { index: false, follow: false },
};

export default function GatewayPrototypePage() {
  return <GatewayFallback />;
}
```

Task 5 will deliberately replace `GatewayFallback` with `GatewayPrototype`. Do not import a component that does not exist yet.

- [ ] **Step 4: Implement `GatewayFallback` as semantic DOM**

Use one `<main>`, one BM heading/mark, one statement, and one `<nav aria-label="BM divisions">`. Each destination uses a real Next `<Link>` and includes its short intro copy; do not render a card grid or error message.

Required visible text:

```text
BM
TWO WORLDS. ONE SYSTEM.

BM VISUALS
Creative / Digital Experience
Digital identities
with motion, story and distinction.
ENTER VISUALS →

BMP TECHNICAL
Technology / AI Systems
AI systems, product logic
and technical execution.
ENTER TECHNICAL →
```

- [ ] **Step 5: Implement the temporary Technical destination**

Render only:

```text
BMP TECHNICAL
Technology / AI Systems
PROTOTYPE DESTINATION
BACK TO GATEWAY ←
```

`BACK TO GATEWAY ←` links to `/gateway-prototype`. Do not add services, case studies, metrics, dashboards, or claims.

- [ ] **Step 6: Add minimal route CSS so the fallback is intentional before JavaScript exists**

Use a full `100svh` graphite page, BM typography, hairline divider logic, and readable links. No gradients, glass, glow, rounded cards, or animation dependency.

- [ ] **Step 7: Verify and commit**

```bash
node --test tests/gateway-markup.test.mjs
npm run typecheck
npm run build
git add app/gateway-prototype components/gateway/GatewayFallback.tsx tests/gateway-markup.test.mjs
git commit -m "feat: establish isolated BM gateway prototype route"
```

Expected: PASS; `/` remains untouched.

---

### Task 2: Implement deterministic state, timing, loader/travel math, and safe navigation policy

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
  | "ready"
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
  | { type: "LOAD_READY" }
  | { type: "BEGIN_ENTRY"; reducedMotion: boolean }
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

Timing/progress API:

```ts
export const GATEWAY_TIMING = {
  loaderMinMs: 2400,
  returnLoaderMs: 600,
  readyHoldMs: 260,
  skipRevealMs: 1350,
  fallbackMs: 9000,
  autoEntryMs: 1750,
  autoEntryCoarseMs: 1200,
  skipFastForwardMs: 800,
  exitMs: 850,
} as const;

export function getLoaderTarget(
  realProgress: number,
  elapsedMs: number,
  returning: boolean,
): number;
export function formatLoaderNumber(progress: number): string;
export function shouldShowSkip(elapsedMs: number, returning: boolean): boolean;
export function applyTravelDelta(progress: number, delta: number): number;
export function stepTravelProgress(current: number, target: number, deltaSeconds: number): number;
```

Navigation API:

```ts
export type GatewayNavigationIntent = {
  button: number;
  detail: number;
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

- [ ] **Step 1: Write failing state/progress tests**

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

test("first visit follows loading → ready → auto → travel → split", () => {
  let state = createGatewayState(false);
  state = gatewayReducer(state, { type: "LOAD_READY" });
  assert.equal(state.phase, "ready");
  state = gatewayReducer(state, { type: "BEGIN_ENTRY", reducedMotion: false });
  assert.equal(state.phase, "auto-entry");
  state = gatewayReducer(state, { type: "AUTO_COMPLETE" });
  assert.equal(state.phase, "user-travel");
  state = gatewayReducer(state, { type: "TRAVEL_COMPLETE" });
  assert.equal(state.phase, "split");
});

test("return and reduced-motion entry skip the long camera journey", () => {
  let returning = gatewayReducer(createGatewayState(true), { type: "LOAD_READY" });
  returning = gatewayReducer(returning, { type: "BEGIN_ENTRY", reducedMotion: false });
  assert.equal(returning.phase, "split");

  let reduced = gatewayReducer(createGatewayState(false), { type: "LOAD_READY" });
  reduced = gatewayReducer(reduced, { type: "BEGIN_ENTRY", reducedMotion: true });
  assert.equal(reduced.phase, "split");
});

test("rapid previews replace each other and commit locks selection", () => {
  let state = { ...createGatewayState(false), phase: "split" };
  state = gatewayReducer(state, { type: "PREVIEW", division: "visuals" });
  assert.equal(getSelectionBias(state), -1);
  state = gatewayReducer(state, { type: "PREVIEW", division: "technical" });
  assert.equal(getSelectionBias(state), 1);
  state = gatewayReducer(state, { type: "COMMIT", division: "technical" });
  state = gatewayReducer(state, { type: "PREVIEW", division: "visuals" });
  assert.equal(state.committed, "technical");
  assert.equal(getSelectionBias(state), 1);
});

test("loader timing is gated, formatted without percent, and travel clamps", () => {
  assert.ok(getLoaderTarget(1, 600, false) < 1);
  assert.equal(getLoaderTarget(1, 2400, false), 1);
  assert.equal(getLoaderTarget(1, 600, true), 1);
  assert.equal(formatLoaderNumber(0), "00");
  assert.equal(formatLoaderNumber(0.74), "74");
  assert.equal(formatLoaderNumber(1), "100");
  assert.equal(shouldShowSkip(1200, false), false);
  assert.equal(shouldShowSkip(1400, false), true);
  assert.equal(shouldShowSkip(5000, true), false);
  assert.equal(applyTravelDelta(0.95, 10000), 1);
  assert.equal(applyTravelDelta(0.05, -10000), 0);
});
```

- [ ] **Step 2: Write failing navigation tests, including keyboard activation**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { shouldEnhanceGatewayNavigation } from "../lib/gateway/navigation.ts";

const primary = {
  button: 0,
  detail: 1,
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

test("gateway enhances only an ordinary primary-pointer activation", () => {
  assert.equal(shouldEnhanceGatewayNavigation(primary), true);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, button: 1 }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, button: 2 }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, detail: 0 }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, ctrlKey: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, target: "_blank" }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, download: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, reducedMotion: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, enhancementReady: false }), false);
});
```

- [ ] **Step 3: Run red tests**

```bash
node --test tests/gateway-state.test.mjs tests/gateway-navigation.test.mjs
```

Expected: FAIL because the modules do not exist.

- [ ] **Step 4: Implement pure state/progress modules**

Use `clamp01`, `damp`, and `MOTION.damping.scroll` from `lib/motion/physics.ts`.

Rules:

```text
LOAD_READY: loading → ready
BEGIN_ENTRY: ready → split when returning or reducedMotion, otherwise ready → auto-entry
AUTO_COMPLETE: auto-entry → user-travel
TRAVEL_COMPLETE: user-travel → split
PREVIEW: split/preview → preview with latest division
CLEAR_PREVIEW: preview → split
COMMIT: split/preview → commit and lock the chosen division
EXIT: commit → exit
FAIL: any non-exit state → fallback
```

Ignore `PREVIEW` and `CLEAR_PREVIEW` after `committed !== null`.

`getLoaderTarget()` must cap incomplete real loading at `0.96`; it returns `1` only when real progress is `1` and the applicable minimum time is reached (`2400` first visit, `600` return visit).

`applyTravelDelta()` uses sensitivity `0.0012` and clamps to `[0, 1]`.

`stepTravelProgress()` uses `damp(current, target, MOTION.damping.scroll, deltaSeconds)`.

- [ ] **Step 5: Implement safe navigation policy**

Return true only when all are true:

```text
button === 0
detail > 0
not defaultPrevented
no modifier key
no non-_self target
not download
not reducedMotion
enhancementReady
```

This preserves native keyboard Enter because click events generated by keyboard have `detail === 0`.

- [ ] **Step 6: Verify and commit**

```bash
node --test tests/gateway-state.test.mjs tests/gateway-navigation.test.mjs
npm run typecheck
git add lib/gateway tests/gateway-state.test.mjs tests/gateway-navigation.test.mjs
git commit -m "feat: add gateway state and progress policies"
```

---

### Task 3: Lock testable spatial choreography before writing Three.js scene code

**Files:**
- Create: `lib/gateway/choreography.ts`
- Create: `tests/gateway-choreography.test.mjs`

**Interfaces:**

`lib/gateway/choreography.ts` explicitly imports:

```ts
import type { GatewayDivision } from "./state";
```

and exports:

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

- [ ] **Step 1: Write failing choreography tests**

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

test("coarse preview uses 68/32 and camera path is roughly one-third shorter", () => {
  const desktopStart = deriveGatewayPose({ ...base, travelProgress: 0 });
  const desktopEnd = deriveGatewayPose({ ...base, travelProgress: 1 });
  const mobileStart = deriveGatewayPose({ ...base, travelProgress: 0, coarsePointer: true });
  const mobileEnd = deriveGatewayPose({ ...base, travelProgress: 1, coarsePointer: true });
  const mobilePreview = deriveGatewayPose({ ...base, selectionBias: -1, coarsePointer: true });

  const desktopDistance = Math.abs(desktopEnd.cameraZ - desktopStart.cameraZ);
  const mobileDistance = Math.abs(mobileEnd.cameraZ - mobileStart.cameraZ);

  assert.deepEqual([mobilePreview.leftPercent, mobilePreview.rightPercent], [68, 32]);
  assert.ok(mobileDistance <= desktopDistance * 0.7);
  assert.ok(mobileDistance >= desktopDistance * 0.6);
});

test("reduced motion removes travel and preview camera bias", () => {
  const start = deriveGatewayPose({ ...base, travelProgress: 0, reducedMotion: true, selectionBias: -1 });
  const end = deriveGatewayPose({ ...base, travelProgress: 1, reducedMotion: true, selectionBias: -1 });
  assert.equal(start.cameraZ, end.cameraZ);
  assert.equal(end.cameraX, 0);
  assert.equal(end.cameraYaw, 0);
});
```

- [ ] **Step 2: Run red test**

```bash
node --test tests/gateway-choreography.test.mjs
```

- [ ] **Step 3: Implement pure interpolation with explicit desktop/coarse paths**

Use a small local `lerp()` plus `clamp01()`.

Desktop travel:

```ts
const startZ = 12;
const endZ = -18; // distance 30
```

Coarse/touch travel:

```ts
const startZ = 8;
const endZ = -11; // distance 19 ≈ 36.7% shorter
```

Reduced motion uses the endpoint Z directly regardless of travel progress.

Preview bias:

```ts
const cameraX = reducedMotion ? 0 : selectionBias * 0.32;
const cameraYaw = reducedMotion ? 0 : selectionBias * 0.018;
const monolithX = selectionBias * 1.1;
```

Desktop ratio is 50/50 neutral and 62/38 preview. Coarse ratio is 68/32 preview. `exitProgress` must move the committed camera farther through the selected passage without changing an uncommitted split.

Visuals preview increases `visualLight` and `leftOpen` using a softer interpolation curve. Technical preview increases `technicalLight` and `rightOpen` with a more exact/linear separation. Do not implement Technical as a perfect mirrored copy of Visuals.

- [ ] **Step 4: Verify and commit**

```bash
node --test tests/gateway-choreography.test.mjs
npm run typecheck
git add lib/gateway/choreography.ts tests/gateway-choreography.test.mjs
git commit -m "feat: define BM gateway spatial choreography"
```

---

### Task 4: Build the raw Three.js architectural scene behind one controller interface

**Files:**
- Create: `lib/gateway/scene.ts`
- Create: `components/gateway/TunnelCanvas.tsx`
- Modify: `tests/gateway-markup.test.mjs`

**Interfaces:**

`lib/gateway/scene.ts` explicitly imports:

```ts
import type { GatewayPose } from "./choreography";
```

and exports:

```ts
export type GatewaySceneController = {
  setTarget(frame: GatewayPose): void;
  resize(width: number, height: number, dpr: number): void;
  tick(deltaSeconds: number): boolean;
  render(): void;
  dispose(): void;
};

export function createGatewayScene(canvas: HTMLCanvasElement): GatewaySceneController;
```

`tick()` returns `true` only while current scene transforms are still converging toward target transforms.

- [ ] **Step 1: Extend static tests before scene implementation**

```js
test("gateway canvas is decorative and scene stays dependency-light", async () => {
  const canvas = await read("../components/gateway/TunnelCanvas.tsx");
  const scene = await read("../lib/gateway/scene.ts");

  assert.match(canvas, /aria-hidden="true"/);
  assert.match(scene, /from "three"/);
  assert.match(scene, /BoxGeometry|PlaneGeometry/);
  assert.doesNotMatch(scene, /@react-three|drei|gsap|postprocessing|EffectComposer/);
  assert.doesNotMatch(scene, /TextureLoader|GLTFLoader/);
});
```

- [ ] **Step 2: Run red test**

```bash
node --test tests/gateway-markup.test.mjs
```

Expected: FAIL because scene/canvas files are absent.

- [ ] **Step 3: Implement architectural scene foundation**

Create exactly one `WebGLRenderer` with:

```ts
new WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: "high-performance",
});
```

Scene requirements:

- Perspective camera FOV within 45–52°.
- Graphite background.
- Smooth high-roughness, low-metalness concrete/mineral materials.
- Restrained blackened-metal material only for joints/threshold strips.
- Entry frame.
- Floor.
- Left and right primary wall masses.
- Ceiling mass.
- One light-cut architectural plane.
- Central BM monolith.
- Visuals split-wing group.
- Technical split-wing group.
- A few emissive slit planes.
- One low-intensity hemisphere/ambient contribution plus no more than four controlled direct light sources.
- No textures, GLTF, particles, post-processing, or shadows in the first implementation.

Keep meaningful mesh count between approximately 10 and 20.

- [ ] **Step 4: Implement target-driven scene transforms**

`setTarget()` stores the newest `GatewayPose`. `tick()` uses `damp()` to move current transforms toward the target and returns false when all tracked deltas fall below a small epsilon.

Map pose values to camera Z/X/yaw, monolith X, left/right wing opening, Visuals diffuse-light strength, and Technical slit-light strength.

Do not start independent hover timers in `scene.ts`; target replacement is the interruption mechanism.

- [ ] **Step 5: Implement `TunnelCanvas` lifecycle**

Props:

```ts
type TunnelCanvasProps = {
  pose: GatewayPose;
  coarsePointer: boolean;
  onReady(): void;
  onFailure(): void;
};
```

Behavior:

- Construct scene controller inside one `useEffect` with `try/catch`.
- Call `onReady()` after successful renderer + scene initialization.
- Call `onFailure()` if creation throws.
- Use `ResizeObserver` on the canvas container and call `controller.resize()`; do not remount on resize/orientation change.
- DPR cap: `Math.min(window.devicePixelRatio || 1, coarsePointer ? 1.25 : 1.5)`.
- On new `pose`, call `setTarget(pose)` and restart RAF if stopped.
- RAF calls `tick(delta)` then `render()`, and stops when `tick()` returns false.
- On `visibilitychange`, cancel RAF when hidden; on visible, restart one frame and continue only if settling.
- On cleanup, cancel RAF, disconnect observer, remove listener, call `dispose()`.
- Canvas markup is `<canvas aria-hidden="true" tabIndex={-1} />`.

- [ ] **Step 6: Verify and commit**

```bash
node --test tests/gateway-markup.test.mjs tests/gateway-choreography.test.mjs
npm run lint
npm run typecheck
npm run build
git add lib/gateway/scene.ts components/gateway/TunnelCanvas.tsx tests/gateway-markup.test.mjs
git commit -m "feat: build BM gateway architectural Three scene"
```

Expected: PASS and no package.json/package-lock dependency changes.

---

### Task 5: Build loader, shared orchestrator, hybrid travel, session flow, and fallback timeout

**Files:**
- Create: `components/gateway/LoaderOverlay.tsx`
- Create: `components/gateway/GatewayPrototype.tsx`
- Modify: `app/gateway-prototype/page.tsx`
- Modify: `components/gateway/GatewayFallback.tsx`
- Modify: `tests/gateway-markup.test.mjs`

**Interfaces:**
- `GatewayPrototype` owns reducer state, `useInteractionProfile()`, scene readiness, font readiness, elapsed loader time, displayed progress, travel target/rendered progress, exit progress, session mode, and enhancement health.
- Session key is exactly `bmGatewaySeen`, value `"1"`.
- `LoaderOverlay` props:

```ts
type LoaderOverlayProps = {
  progress: number;
  returning: boolean;
  phase: GatewayPhase;
  canSkip: boolean;
  onSkip(): void;
};
```

- [ ] **Step 1: Add failing loader/orchestrator assertions**

```js
test("loader uses BM counter language without percent", async () => {
  const source = await read("../components/gateway/LoaderOverlay.tsx");
  assert.match(source, /INITIALIZING/);
  assert.match(source, /TWO WORLDS\. ONE SYSTEM\./);
  assert.match(source, /SKIP/);
  assert.doesNotMatch(source, /%/);
});

test("orchestrator owns session key, fallback timing, and semantic fallback", async () => {
  const source = await read("../components/gateway/GatewayPrototype.tsx");
  assert.match(source, /bmGatewaySeen/);
  assert.match(source, /fallbackMs/);
  assert.match(source, /GatewayFallback/);
});
```

- [ ] **Step 2: Run red test**

```bash
node --test tests/gateway-markup.test.mjs
```

- [ ] **Step 3: Implement progressive-enhancement bootstrap**

`GatewayPrototype` is a client component, but its initial server render must still contain `GatewayFallback`. The first hydrated render also retains it. Only after the client has initialized the interaction profile and started a healthy enhancement may the fallback receive `hidden`/`aria-hidden` and the loader/canvas take visual ownership.

If JavaScript never runs, the fallback stays visible and both links work.

If enhancement later fails, restore the fallback and remove/hide the loader/canvas path.

- [ ] **Step 4: Implement semi-real loader readiness without boolean arithmetic**

Track booleans `sceneReady` and `fontsReady`. Compute:

```ts
const realProgress = (sceneReady ? 0.8 : 0) + (fontsReady ? 0.2 : 0);
```

Resolve fonts with:

```ts
const fontsPromise = document.fonts?.ready ?? Promise.resolve();
```

Damp displayed progress toward `getLoaderTarget(realProgress, elapsedMs, returning)`.

Start one hard timeout using `GATEWAY_TIMING.fallbackMs`. If the scene is not healthy by 9000 ms, dispatch `FAIL` and reveal the semantic fallback.

When displayed progress reaches 1, dispatch `LOAD_READY`; hold the `ready` phase for 260 ms, display `TWO WORLDS. ONE SYSTEM.`, then dispatch `BEGIN_ENTRY` with current reduced-motion state.

Return-session flow uses the 600 ms loader minimum and then goes directly from ready to split when the scene is healthy.

- [ ] **Step 5: Implement hybrid auto/manual travel**

For fine pointer:

```text
auto-entry duration: 1750 ms
auto target: 0 → 0.68
manual travel: 0.68 → 1
```

For coarse pointer:

```text
auto-entry duration: 1200 ms
auto target: 0 → 0.72
manual travel: 0.72 → 1
```

The coarse **world-space camera range is already 36.7% shorter in `deriveGatewayPose()`**; this task additionally shortens temporal choreography without pretending that progress percentage alone reduces physical travel.

During manual travel:

- Attach a non-passive `wheel` listener to the full-screen gateway root only while phase is `user-travel`; prevent default only in that phase.
- Track pointer/touch drag start Y and convert vertical delta through `applyTravelDelta()`.
- Use `stepTravelProgress()` each RAF.
- Dispatch `TRAVEL_COMPLETE` when rendered progress reaches `>= 0.995`.
- Show `MOVE FORWARD` only in `user-travel`.

Skip after 1350 ms sets a `skipTarget` and interpolates target progress to 1 over 800 ms; dispatch split only after rendered progress reaches the endpoint.

- [ ] **Step 6: Implement session behavior**

Read `sessionStorage.getItem("bmGatewaySeen")` only inside `useEffect` after hydration. Initialize `returning` from that result before starting the loader timer.

Write `sessionStorage.setItem("bmGatewaySeen", "1")` only when a valid division commit begins.

Browser Back therefore remounts/returns with the session flag and uses the ~600 ms return flow rather than the 2400 ms first-visit loader.

- [ ] **Step 7: Swap the route from fallback-only to orchestrator**

Change `app/gateway-prototype/page.tsx` to import/render `GatewayPrototype`. Keep route metadata and route CSS import unchanged.

- [ ] **Step 8: Verify and commit**

```bash
node --test tests/gateway-state.test.mjs tests/gateway-markup.test.mjs
npm run lint
npm run typecheck
npm run build
git add components/gateway app/gateway-prototype/page.tsx tests/gateway-markup.test.mjs
git commit -m "feat: choreograph BM gateway loading and tunnel travel"
```

---

### Task 6: Implement semantic split preview, compact cursor, and safe commit transition

**Files:**
- Create: `components/gateway/SelectionOverlay.tsx`
- Modify: `components/gateway/GatewayPrototype.tsx`
- Modify: `components/motion/ContextCursor.tsx`
- Modify: `app/motion.css`
- Modify: `tests/gateway-markup.test.mjs`

**Interfaces:**

```ts
type SelectionOverlayProps = {
  state: GatewayState;
  leftPercent: number;
  rightPercent: number;
  enhancementReady: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  onPreview(division: GatewayDivision): void;
  onClearPreview(): void;
  onCommit(division: GatewayDivision, href: string, event: React.MouseEvent<HTMLAnchorElement>): void;
};
```

Both CTAs are real Next `<Link>` elements.

- [ ] **Step 1: Add failing selection/cursor assertions**

```js
test("selection overlay contains approved short copy and both real CTAs", async () => {
  const source = await read("../components/gateway/SelectionOverlay.tsx");
  assert.match(source, /Digital identities/);
  assert.match(source, /with motion, story and distinction\./);
  assert.match(source, /AI systems, product logic/);
  assert.match(source, /and technical execution\./);
  assert.match(source, /ENTER VISUALS/);
  assert.match(source, /ENTER TECHNICAL/);
  assert.match(source, /href="\/"/);
  assert.match(source, /href="\/gateway-prototype\/technical"/);
});

test("context cursor adds gateway mode while retaining existing modes", async () => {
  const source = await read("../components/motion/ContextCursor.tsx");
  assert.match(source, /"gateway"/);
  assert.match(source, /"view"/);
  assert.match(source, /"explore"/);
});
```

- [ ] **Step 2: Run red test**

```bash
node --test tests/gateway-markup.test.mjs
```

- [ ] **Step 3: Implement neutral, fine-pointer, coarse-pointer, and keyboard preview**

DOM uses two full-height semantic division regions, not rounded cards.

Fine pointer:

- Pointer enter Visuals region → `PREVIEW visuals`.
- Pointer enter Technical region → `PREVIEW technical`.
- Leaving the whole selection container → `CLEAR_PREVIEW`.
- Focusing a division CTA previews that division.

Coarse pointer:

- The region contains a non-link preview button with the same visible title/descriptor.
- First tap sets preview/68% ownership.
- CTA remains a separate real link and becomes visually prominent after preview.
- Tapping the other preview button switches selection.

Keyboard:

- Tab reaches both real CTA links.
- Focus previews the corresponding side.
- Enter remains native because navigation policy rejects `detail === 0`.
- `Escape` while in `preview` dispatches `CLEAR_PREVIEW`.

Apply pose ratios via `--gateway-left` and `--gateway-right` CSS variables.

- [ ] **Step 4: Implement interruptible copy reveal**

Use only CSS property transitions driven by `data-gateway-selection`; do not schedule chained `setTimeout` calls for hover copy.

Reveal sequence:

```text
title response immediately
line 1 after ~160 ms
line 2 ~110 ms later
CTA ~120 ms later
```

Switching selection reverses/cancels through CSS state immediately, preventing queued copy overlap.

- [ ] **Step 5: Add compact `gateway` mode to the existing contextual cursor**

Extend:

```ts
type CursorMode = "default" | "view" | "explore" | "gateway";
```

`readCursorState()` accepts `data-cursor="gateway"` and uses `data-cursor-label` for `ENTER VISUALS ↗` / `ENTER TECHNICAL ↗`.

In `app/motion.css`, gateway mode stays a 10–12px dot with a small text label offset beside it. It must **not** inherit the current 84px orange `view`/`explore` blob dimensions. Existing modes remain byte-for-byte behaviorally equivalent.

The existing `useInteractionProfile()` already suppresses the custom cursor for coarse pointer and reduced motion; do not build another pointer-capability system.

- [ ] **Step 6: Implement ordinary-pointer commit enhancement with native fallback**

On CTA click, build `GatewayNavigationIntent` from the actual React mouse event, including `button` and `detail`.

If `shouldEnhanceGatewayNavigation()` is false, return without `preventDefault()`.

If true:

1. `preventDefault()`.
2. Dispatch `COMMIT`.
3. Set `bmGatewaySeen = "1"`.
4. Ignore later preview and commit requests while committed.
5. Animate `exitProgress` 0→1 over 850 ms using RAF/time interpolation.
6. Derive the exit pose from the committed division; Visuals brightens/opens, Technical aligns/sharpens.
7. Dispatch `EXIT`, then call `router.push(href)`.
8. Start a 1400 ms safety timeout; if `window.location.pathname` has not changed to the expected pathname, call `window.location.assign(href)`.

Reduced motion, keyboard activation, modifiers, middle/right click, target `_blank`, and downloads never enter this path.

- [ ] **Step 7: Verify and commit**

```bash
node --test tests/gateway-navigation.test.mjs tests/gateway-state.test.mjs tests/gateway-markup.test.mjs
npm run lint
npm run typecheck
npm run build
git add components/gateway/SelectionOverlay.tsx components/gateway/GatewayPrototype.tsx components/motion/ContextCursor.tsx app/motion.css tests/gateway-markup.test.mjs
git commit -m "feat: add BM gateway division preview and entry transitions"
```

---

### Task 7: Finish brutalist art direction, responsive composition, reduced motion, and progressive-enhancement CSS

**Files:**
- Modify: `app/gateway-prototype/gateway.css`
- Modify: `components/gateway/GatewayFallback.tsx`
- Modify: `components/gateway/GatewayPrototype.tsx`
- Modify: `tests/gateway-markup.test.mjs`

**Interfaces:**
- `.gateway-page` owns viewport isolation.
- Route state hooks are `data-gateway-enhanced`, `data-gateway-phase`, and `data-gateway-selection`.
- Fallback is visible in SSR/no-JS and in explicit `fallback` phase; the enhanced loader/scene owns the viewport only after healthy client initialization.

- [ ] **Step 1: Add failing responsive/reduced-motion static assertion**

```js
test("gateway CSS contains coarse-pointer and reduced-motion modes", async () => {
  const css = await read("../app/gateway-prototype/gateway.css");
  assert.match(css, /pointer: coarse|hover: none/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /100svh/);
});
```

- [ ] **Step 2: Establish route-scoped visual tokens**

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

Use large architectural/editorial division type, small tracked descriptors, hairlines, negative space, and restrained opacity. Do not add rounded cards, pills, gradients, glassmorphism, glow, or decorative tech chrome.

- [ ] **Step 3: Compose loader and desktop split**

Loader remains sparse: BM mark, numeric counter, small `INITIALIZING`, optional skip in a corner. The hidden canvas behind it gradually becomes visible through opacity/exposure controlled by loader progress.

At viewport width ≥1024px:

- Visuals/Technical regions occupy `--gateway-left` and `--gateway-right`.
- Neutral state is 50/50.
- Preview transitions over 450–650 ms with existing scene easing.
- Central gap aligns to the Three monolith.
- Intro copy is only two short lines.
- Unselected side remains legible at reduced contrast.

- [ ] **Step 4: Compose tablet/mobile without shrinking desktop UI**

For portrait tablet/mobile:

- Keep canvas spatial logic left/right but allow text regions to stack vertically when needed.
- Coarse preview owns approximately 68% while leaving the other division visible.
- Preview CTA appears after the first tap.
- No custom cursor or pointer parallax.
- Mobile `MOVE FORWARD` wording remains short; do not add tutorial paragraphs.
- CSS must tolerate 390×844 and 768×1024 without clipped CTA or horizontal overflow.

- [ ] **Step 5: Implement reduced-motion presentation**

When `prefers-reduced-motion: reduce`:

- Route uses 600 ms-or-less BM loader presentation once critical readiness exists.
- `deriveGatewayPose()` supplies static endpoint camera position and zero X/yaw bias.
- No auto/manual long camera travel is required.
- No accelerated spatial exit; real link navigation stays native because navigation enhancement is disabled.
- Selection uses contrast, modest ratio shift, and immediate/near-immediate copy reveal.

Do not modify the repository's global reduced-motion rule.

- [ ] **Step 6: Keep fallback visually intentional**

Fallback uses the same BM mark, statement, division typography, approved short descriptions, and hairline language. Never display `WebGL unsupported`, `GPU error`, stack traces, or `loading failed` to visitors.

- [ ] **Step 7: Verify and commit**

```bash
node --test tests/gateway-markup.test.mjs
npm run lint
npm run typecheck
npm test
npm run build
git add app/gateway-prototype/gateway.css components/gateway tests/gateway-markup.test.mjs
git commit -m "feat: polish responsive BM gateway prototype"
```

Expected: all existing and gateway tests PASS.

---

### Task 8: Fresh verification, visual QA, performance guardrails, and prototype delivery

**Files:**
- Modify only gateway prototype files if verification finds a gateway regression.
- Do not alter production BM Visuals presentation during QA.

**Interfaces:**
- This task produces verification evidence and a reviewable prototype branch/preview. It does not integrate the gateway into `/`.

- [ ] **Step 1: Run clean repository checks**

```bash
git diff --check
rg -n '^(<<<<<<<|=======|>>>>>>>)' --glob '!node_modules/**' --glob '!.next/**' --glob '!.git/**' .
npm run lint
npm run typecheck
npm test
npm run build
```

Expected: all commands PASS and no conflict markers.

- [ ] **Step 2: Confirm dependency scope did not drift**

```bash
git diff -- package.json package-lock.json
```

Expected: no dependency diff. `three` already exists; no R3F, Drei, GSAP, Lenis, GLTF stack, or post-processing package is added.

- [ ] **Step 3: Capture and inspect the seven required freeze frames**

```text
1. Loader around 50
2. Tunnel just after auto-entry
3. Neutral split
4. Visuals preview
5. Technical preview
6. Mobile neutral split
7. Mobile selected preview
```

Each frozen frame must read as an intentional brand composition without needing motion to hide weak layout.

- [ ] **Step 4: Verify viewport matrix and live resizing**

```text
1440×900
1280×800
768×1024
390×844
```

Resize/rotate while in tunnel and at split. Confirm the renderer updates size/aspect without remounting and DOM composition retains visible titles/CTAs.

- [ ] **Step 5: Verify interaction edge cases**

Manually verify every case:

```text
rapid Visuals → Technical → Visuals preview
wheel/trackpad spam clamps progress and never skips split
touch/swipe reaches split on coarse pointer
first coarse tap previews; CTA enters
click spam after commit cannot double-navigate
Tab previews each division and visible focus remains
Enter on focused CTA uses native navigation
Escape returns preview to neutral
modifier/middle/right/new-tab navigation stays native
Back from Visuals uses short session flow
reduced motion skips long journey and enhanced exit
forced WebGL creation failure shows fallback
scene not ready at 9000 ms shows fallback
hidden tab pauses RAF; visible tab resumes safely
resize/orientation does not remount or lose selection
```

- [ ] **Step 6: Verify creative failure criterion**

Ask: **Does the freeze frame and movement read as an architectural brand installation rather than an FPS lobby, sci-fi game menu, or Unreal demo?**

If not, correct in this order only:

```text
1. reduce FOV distortion
2. reduce camera speed/yaw
3. neutralize colored/contrasty lighting
4. simplify environmental geometry/detail
5. reduce mechanical movement
6. tighten typography/composition
```

Do not add effects to solve a game-like result.

- [ ] **Step 7: Verify runtime guardrails**

In browser devtools confirm:

```text
no texture/GLTF requests
DPR is capped at 1.5 fine / 1.25 coarse
settled split does not keep a heavy continuous RAF loop
no listener/renderer growth across gateway → Visuals → Back cycles
no console, hydration, React, or WebGL errors
normal first-use blocking time stays approximately ≤5–6 seconds
```

- [ ] **Step 8: Score against the approved stop rule**

All six answers should be yes:

```text
Loader creates anticipation without copying the reference?
Loader → tunnel feels like one space?
Corridor feels premium/architectural rather than game-like?
50/50 split is understandable without long instruction?
62/38 preview differentiates the divisions?
Exit makes both divisions feel like one BM ecosystem?
```

If the prototype reaches approximately 8.5–9/10, stop. Do not add sound, project previews, particles, shaders, production parent routing, or BMP Technical feature work inside this plan.

- [ ] **Step 9: Push a reviewable prototype branch/PR without production integration**

At execution time, create an isolated worktree/feature branch from the approved design branch, recommended name `feat/bm-gateway-tunnel-prototype`. Push the completed prototype and open a review PR. The PR must not replace `/` and must not claim the gateway is production-integrated.
