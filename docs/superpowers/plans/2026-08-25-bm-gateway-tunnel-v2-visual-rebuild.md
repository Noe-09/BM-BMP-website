# BM Gateway Tunnel V2 Visual Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the standalone BM Gateway Tunnel visual system into an original, campaign-grade architectural experience while preserving the proven V1 state, navigation, accessibility, fallback, and session engine.

**Architecture:** Author the spatial environment deterministically in Blender with built-in `bpy`, export one semantic GLB, load it with raw Three.js, and drive camera/architecture/light state from small deterministic TypeScript functions. DOM remains responsible for loader copy, semantic selection, accessibility, and real navigation links. Visual work is deliberately split into short Claude sections with a hard review gate between graybox geometry, camera, lighting, loader, split, and final mobile/performance polish.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript, Three.js 0.185.1, Blender Python (`bpy` only), Node built-in test runner, CSS.

**Spec:** `docs/superpowers/specs/2026-08-25-bm-gateway-tunnel-v2-visual-design.md`

## Global Constraints

- Work only on `feat/bm-gateway-tunnel-v2` in the existing `bm-gateway-tunnel` worktree.
- Production `/` and `app/page.tsx` remain untouched.
- Preserve V1 state machine, navigation safety, `bmGatewaySeen`, semantic real links, keyboard behavior, reduced-motion state handling, WebGL fallback, readiness timeout, and coarse-pointer interaction unless a genuine compatibility bug is demonstrated.
- No React Three Fiber, Drei, GSAP, Lenis, Framer Motion, postprocessing package, Blender addon, or other new dependency.
- Blender automation uses built-in `bpy` only.
- No neon purple/blue, holograms, HUDs, code rain, circuit textures, dense particles, sci-fi doors, giant machinery, heavy fog, lens flare, chrome showroom styling, or decorative bloom.
- Graybox geometry must pass still-frame review before final material/lighting work begins.
- Visuals and Technical architecture must be authored independently; do not mirror one side to make the other.
- Every Claude section ends with a hard stop. Do not start the next section without review.
- V2 is still prototype-only; do not production-integrate the gateway.

---

## File Map

### New files

- `docs/gateway-v2/checkpoints/00-audit-freeze.md` — concise record of frozen engine contracts and files allowed to change.
- `docs/gateway-v2/checkpoints/01-graybox.md` — V2.1 geometry parameters, render paths, review notes, and approval state.
- `docs/gateway-v2/checkpoints/02-camera.md` — approved camera key poses and visual review notes.
- `docs/gateway-v2/checkpoints/03-lighting.md` — material/light palette and approved shot notes.
- `docs/gateway-v2/checkpoints/04-loader.md` — loader reveal QA notes.
- `docs/gateway-v2/checkpoints/05-split.md` — split/preview QA notes.
- `docs/gateway-v2/checkpoints/06-final.md` — mobile/performance/final verification evidence.
- `tools/blender/build_gateway_v2.py` — deterministic Blender scene generator, preview renderer, and later GLB exporter.
- `public/gateway/gateway-v2.glb` — approved optimized architectural asset generated only after graybox approval.
- `lib/gateway/asset.ts` — GLB asset URL, required semantic node contract, and resolver.
- `lib/gateway/cameraPath.ts` — authored camera key poses and deterministic sampling.
- `tests/gateway-v2-asset.test.mjs` — semantic asset contract and resolver tests.
- `tests/gateway-v2-camera.test.mjs` — camera path interpolation and endpoint tests.
- `tests/gateway-v2-presentation.test.mjs` — V2 DOM/CSS/loader visual-contract assertions.

### Existing files expected to change

- `lib/gateway/scene.ts` — replace in-browser box-authored architecture with GLB loading, semantic-node control, restrained runtime materials/lights, and disposal.
- `lib/gateway/choreography.ts` — consume authored camera samples and expose V2 reveal/open/light controls while preserving state-facing semantics.
- `components/gateway/TunnelCanvas.tsx` — wait for asynchronous GLB readiness before reporting scene ready; preserve resize/RAF/disposal behavior.
- `components/gateway/GatewayPrototype.tsx` — pass loader progress into visual choreography only; preserve state/navigation logic.
- `components/gateway/LoaderOverlay.tsx` — restrained V2 loader hierarchy only.
- `components/gateway/SelectionOverlay.tsx` — spatial-signage markup/layout refinements without weakening semantic links or pointer/keyboard behavior.
- `app/gateway-prototype/gateway.css` — V2 loader, spatial signage, split, responsive, and reduced-motion presentation.
- `tests/gateway-choreography.test.mjs` — update camera-field expectations while preserving 50/50, 62/38, 68/32, identity leak, reduced motion, and exit asymmetry contracts.
- `tests/gateway-markup.test.mjs` — preserve semantic/accessibility contracts and add V2 signage requirements.

---

### Task 0: V2.0 Audit + Freeze

**Claude budget class:** Sonnet-class.

**Files:**
- Create: `docs/gateway-v2/checkpoints/00-audit-freeze.md`
- Read only: `lib/gateway/state.ts`, `lib/gateway/navigation.ts`, `lib/gateway/progress.ts`, `components/gateway/GatewayPrototype.tsx`, `components/gateway/TunnelCanvas.tsx`, `components/gateway/SelectionOverlay.tsx`, `tests/gateway-state.test.mjs`, `tests/gateway-navigation.test.mjs`, `tests/gateway-choreography.test.mjs`

**Interfaces:**
- Consumes: V1 public gateway contracts already present in the repository.
- Produces: a short frozen-engine contract that every later Claude chat can read instead of re-reading the whole V1 implementation.

- [ ] **Step 1: Verify the worktree and branch before writing anything**

Run:

```bash
git rev-parse --show-toplevel
git branch --show-current
git status --short
```

Expected:

```text
.../bm-gateway-tunnel
feat/bm-gateway-tunnel-v2
```

`git status --short` must be empty before audit work starts.

- [ ] **Step 2: Run the V1 gateway regression suite before freezing it**

Run:

```bash
npm test -- --test-name-pattern='gateway|Gateway'
```

If the npm script does not forward the pattern on the installed Node version, run:

```bash
node --test tests/gateway-*.test.mjs
```

Expected: all existing gateway tests pass. If any fail before V2 changes, stop and report the baseline failure.

- [ ] **Step 3: Write the freeze checkpoint**

Create `docs/gateway-v2/checkpoints/00-audit-freeze.md` with exactly these headings and concrete findings:

```markdown
# V2.0 Audit + Freeze

## Frozen engine files
- lib/gateway/state.ts
- lib/gateway/navigation.ts
- lib/gateway/progress.ts

## Frozen behavioral contracts
- SESSION_RESOLVED gates loader progression.
- bmGatewaySeen controls short return loader behavior.
- Real links remain native for keyboard, modifier, middle-click, target/download, reduced motion, and failed enhancement.
- event.detail > 0 is required for enhanced pointer navigation.
- Reduced motion removes camera travel but keeps semantic selection.
- Coarse pointer uses preview-first interaction.
- WebGL/readiness failure preserves semantic navigation.

## Allowed V2 visual surfaces
- lib/gateway/scene.ts
- lib/gateway/choreography.ts
- components/gateway/TunnelCanvas.tsx only for async asset readiness
- components/gateway/GatewayPrototype.tsx only for visual-progress plumbing
- components/gateway/LoaderOverlay.tsx
- components/gateway/SelectionOverlay.tsx visual structure only
- app/gateway-prototype/gateway.css
- tools/blender/*
- public/gateway/*

## Baseline verification
Record exact commands and pass counts here.
```

- [ ] **Step 4: Confirm the audit did not touch frozen engine code**

Run:

```bash
git diff -- lib/gateway/state.ts lib/gateway/navigation.ts lib/gateway/progress.ts
```

Expected: no output.

- [ ] **Step 5: Commit and stop**

```bash
git add docs/gateway-v2/checkpoints/00-audit-freeze.md
git commit -m "docs: freeze gateway V2 engine contracts"
```

**HARD STOP:** Do not create Blender files or edit visual code in this section.

---

### Task 1: V2.1A Blender Script + First Graybox

**Claude budget class:** strongest Opus-class model.

**Files:**
- Create: `tools/blender/build_gateway_v2.py`
- Create locally/generated: `gateway-v2-preview.blend`
- Create locally/generated: `renders/01-entry.png`
- Create locally/generated: `renders/02-threshold.png`
- Create locally/generated: `renders/03-gallery.png`
- Create locally/generated: `renders/04-core.png`
- Create locally/generated: `renders/05-split.png`
- Create: `docs/gateway-v2/checkpoints/01-graybox.md`

**Interfaces:**
- Consumes: frozen-engine checkpoint only for scope awareness; no runtime code changes.
- Produces: deterministic graybox Blender scene with semantic objects and five review cameras.

- [ ] **Step 1: Locate Blender CLI and fail closed if unavailable**

On Windows try:

```powershell
where.exe blender
```

If not found, inspect standard Blender install locations. Once found, record the exact executable path. If Blender cannot be found, stop. Do not rebuild the environment in Three.js.

- [ ] **Step 2: Write a minimal deterministic Blender generator**

`tools/blender/build_gateway_v2.py` must define these constants near the top so later composition corrections are parameter edits rather than scene rewrites:

```python
PARAMS = {
    "overall_depth": 40.0,
    "entry_width": 9.0,
    "gallery_width": 10.5,
    "compressed_ceiling": 3.6,
    "open_ceiling": 6.0,
    "gallery_left_angle_deg": 3.0,
    "gallery_right_angle_deg": -5.0,
    "monolith_height": 6.2,
    "monolith_width": 2.0,
    "monolith_depth": 2.6,
    "split_width": 18.0,
}
```

The script must create collections named:

```python
COLLECTIONS = (
    "BM_GATEWAY",
    "GEO_STATIC",
    "ENTRY",
    "GALLERY",
    "CORE",
    "VISUALS",
    "TECHNICAL",
    "LIGHT_GUIDES",
    "EXPORT",
)
```

It must create independently authored objects including:

```python
REQUIRED_OBJECTS = (
    "entry_foreground_slab",
    "entry_overhead",
    "gallery_wall_left",
    "gallery_wall_oblique",
    "gallery_ceiling",
    "gallery_light_cut",
    "core_monolith",
    "visuals_root",
    "visuals_aperture_outer",
    "visuals_aperture_inner",
    "technical_root",
    "technical_aperture_outer",
    "technical_aperture_inner",
    "technical_aperture_cut",
)
```

Do not make Technical by mirroring/copying Visuals.

- [ ] **Step 3: Add five named review cameras**

The script must create:

```python
CAMERAS = (
    "CAM_ENTRY",
    "CAM_THRESHOLD",
    "CAM_GALLERY",
    "CAM_CORE",
    "CAM_SPLIT",
)
```

Start all review cameras around a 42° lens-equivalent FOV and compose them to satisfy the spec: asymmetrical entry, compressed threshold, 30–45% foreground occlusion in gallery where appropriate, partial monolith discovery, and non-mirrored split.

- [ ] **Step 4: Generate neutral clay only**

Use no image textures, no bloom, no volumetrics, and no cinematic material tricks. Use one graphite/mineral clay material plus a pale non-emissive guide material for `gallery_light_cut`. Use a neutral world and simple preview illumination sufficient to read form.

- [ ] **Step 5: Run Blender headless to build and render all five cameras**

Use the resolved Blender executable, for example:

```powershell
& "C:\Program Files\Blender Foundation\Blender\blender.exe" --background --python tools/blender/build_gateway_v2.py
```

The script must save `gateway-v2-preview.blend` and render the five PNGs under `renders/`.

- [ ] **Step 6: Verify generated artifacts exist and the script is deterministic**

Run the Blender command twice. Then compare object/camera counts printed by the script and confirm both runs report identical semantic names and transforms. The script must print a final summary containing exactly the five camera names and all required semantic objects.

- [ ] **Step 7: Write the graybox checkpoint and stop for human visual review**

`docs/gateway-v2/checkpoints/01-graybox.md` must record:

```markdown
# V2.1 Graybox

## Generator
- tools/blender/build_gateway_v2.py
- Blender executable: <exact local path>

## Renders
- renders/01-entry.png
- renders/02-threshold.png
- renders/03-gallery.png
- renders/04-core.png
- renders/05-split.png

## Geometry parameters
Record the exact PARAMS values from the approved run.

## Review status
PENDING HUMAN REVIEW
```

- [ ] **Step 8: Commit source/checkpoint only, unless repository policy explicitly wants generated previews tracked**

```bash
git add tools/blender/build_gateway_v2.py docs/gateway-v2/checkpoints/01-graybox.md
git commit -m "feat: add gateway V2 Blender graybox generator"
```

**HARD STOP:** Do not export final GLB, edit Three.js, create final materials, or start camera runtime choreography. Human review of the five stills is required first.

---

### Task 2: V2.1B Composition Corrections Only

**Claude budget class:** strongest Opus-class model.

**Files:**
- Modify: `tools/blender/build_gateway_v2.py`
- Modify: `docs/gateway-v2/checkpoints/01-graybox.md`
- Regenerate locally: the same five `renders/*.png`

**Interfaces:**
- Consumes: human review notes for the five graybox frames.
- Produces: approved graybox composition; no runtime/API changes.

- [ ] **Step 1: Read only the latest graybox checkpoint and human review notes**

Do not re-audit the repository or start runtime integration.

- [ ] **Step 2: Translate every review note into parameter/transform edits**

Prefer changes to `PARAMS`, camera transforms, or the transforms of existing meaningful masses. Do not add decorative boxes unless the review explicitly identifies a missing architectural mass.

- [ ] **Step 3: Regenerate all five frames with the exact same Blender command**

Expected: all five PNGs update from one deterministic script run.

- [ ] **Step 4: Run the still-frame rejection checklist**

Reject the iteration if any frame:

```text
- resembles a game level
- exposes the entire room
- is overly symmetrical
- substitutes many small boxes for strong masses
- keeps one ceiling height everywhere
- reveals the monolith too early
- makes the split resemble sci-fi doors
- needs effects to look intentional
```

- [ ] **Step 5: Update the checkpoint with exact approved parameters**

Change `Review status` only to:

```text
APPROVED GRAYBOX
```

when the human has explicitly approved the stills.

- [ ] **Step 6: Commit and stop**

```bash
git add tools/blender/build_gateway_v2.py docs/gateway-v2/checkpoints/01-graybox.md
git commit -m "refine: approve gateway V2 graybox composition"
```

**HARD STOP:** No GLB export or runtime integration until `APPROVED GRAYBOX` is present.

---

### Task 3: V2.1C Semantic GLB Export + Asset Contract

**Claude budget class:** Sonnet-class.

**Files:**
- Modify: `tools/blender/build_gateway_v2.py`
- Create: `public/gateway/gateway-v2.glb`
- Create: `lib/gateway/asset.ts`
- Create: `tests/gateway-v2-asset.test.mjs`
- Modify: `lib/gateway/scene.ts`
- Modify: `components/gateway/TunnelCanvas.tsx`
- Modify: `docs/gateway-v2/checkpoints/01-graybox.md`

**Interfaces:**
- Produces:

```ts
export const GATEWAY_ASSET_URL = "/gateway/gateway-v2.glb";

export const REQUIRED_GATEWAY_NODES = [
  "core_monolith",
  "visuals_root",
  "technical_root",
  "gallery_light_cut",
] as const;

export type GatewaySceneNodes = {
  coreMonolith: Object3D;
  visualsRoot: Object3D;
  technicalRoot: Object3D;
  galleryLightCut: Object3D;
};

export function resolveGatewaySceneNodes(root: Object3D): GatewaySceneNodes;
```

`GatewaySceneController` gains:

```ts
readonly ready: Promise<void>;
```

but preserves `setTarget`, `resize`, `tick`, `render`, and `dispose`.

- [ ] **Step 1: Write the failing semantic-node resolver test**

Create `tests/gateway-v2-asset.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { Group } from "three";
import {
  GATEWAY_ASSET_URL,
  resolveGatewaySceneNodes,
} from "../lib/gateway/asset.ts";

test("gateway V2 asset URL is stable", () => {
  assert.equal(GATEWAY_ASSET_URL, "/gateway/gateway-v2.glb");
});

test("semantic gateway nodes resolve by name", () => {
  const root = new Group();
  for (const name of [
    "core_monolith",
    "visuals_root",
    "technical_root",
    "gallery_light_cut",
  ]) {
    const node = new Group();
    node.name = name;
    root.add(node);
  }
  const nodes = resolveGatewaySceneNodes(root);
  assert.equal(nodes.coreMonolith.name, "core_monolith");
  assert.equal(nodes.visualsRoot.name, "visuals_root");
  assert.equal(nodes.technicalRoot.name, "technical_root");
});

test("missing semantic nodes fail closed", () => {
  assert.throws(() => resolveGatewaySceneNodes(new Group()), /core_monolith/);
});
```

- [ ] **Step 2: Run the test and confirm RED**

```bash
node --test tests/gateway-v2-asset.test.mjs
```

Expected: fail because `lib/gateway/asset.ts` does not exist.

- [ ] **Step 3: Implement `lib/gateway/asset.ts` minimally and make the test green**

Use `root.getObjectByName(name)` and throw an `Error` naming the missing semantic node. Do not use mesh indices.

- [ ] **Step 4: Add deterministic GLB export to the Blender script**

Export the approved `EXPORT` hierarchy to `public/gateway/gateway-v2.glb` using Blender's built-in glTF exporter. Apply transforms, exclude preview cameras/lights, and avoid external texture files. Keep the asset self-contained binary GLB.

- [ ] **Step 5: Replace procedural runtime architecture with GLB loading**

In `lib/gateway/scene.ts`, import:

```ts
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
```

Create the renderer/scene/camera synchronously, set `controller.ready` to the GLTF load promise, add the loaded root to the scene, resolve semantic nodes with `resolveGatewaySceneNodes`, and retain base transforms for later opening animations.

Do not call the scene ready until GLB load and semantic-node resolution succeed.

- [ ] **Step 6: Update `TunnelCanvas.tsx` to honor async readiness**

After `createGatewayScene(canvas)`, use:

```ts
void controller.ready.then(
  () => {
    if (!disposed) readyRef.current();
  },
  () => {
    if (!disposed) failureRef.current();
  },
);
```

Remove the old immediate `readyRef.current()` call. Preserve ResizeObserver, hidden-tab RAF pause, DPR caps, cleanup, and controller disposal.

- [ ] **Step 7: Verify asset load contract**

Run:

```bash
node --test tests/gateway-v2-asset.test.mjs
npm run typecheck
npm run build
```

Expected: all pass and `/gateway-prototype` builds with no missing GLB import/runtime type error.

- [ ] **Step 8: Commit and stop**

```bash
git add tools/blender/build_gateway_v2.py public/gateway/gateway-v2.glb lib/gateway/asset.ts lib/gateway/scene.ts components/gateway/TunnelCanvas.tsx tests/gateway-v2-asset.test.mjs docs/gateway-v2/checkpoints/01-graybox.md
git commit -m "feat: load semantic gateway V2 GLB"
```

**HARD STOP:** No final materials, loader redesign, or split typography in this section.

---

### Task 4: V2.2 Authored Camera Choreography

**Claude budget class:** strongest Opus-class model.

**Files:**
- Create: `lib/gateway/cameraPath.ts`
- Create: `tests/gateway-v2-camera.test.mjs`
- Modify: `lib/gateway/choreography.ts`
- Modify: `lib/gateway/scene.ts`
- Modify: `tests/gateway-choreography.test.mjs`
- Create: `docs/gateway-v2/checkpoints/02-camera.md`

**Interfaces:**
- Produces:

```ts
export type GatewayCameraSample = {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  fov: number;
};

export function sampleGatewayCamera(
  progress: number,
  coarsePointer: boolean,
): GatewayCameraSample;
```

`GatewayPose` adds:

```ts
cameraY: number;
cameraTargetX: number;
cameraTargetY: number;
cameraTargetZ: number;
cameraFov: number;
```

while retaining `cameraX`, `cameraZ`, `cameraYaw`, `monolithX`, openings, lights, identity leak, and split percentages for compatibility during V2 migration.

- [ ] **Step 1: Write RED tests for five-pose camera sampling**

`tests/gateway-v2-camera.test.mjs` must assert:

```js
assert.equal(sampleGatewayCamera(0, false).fov, 42);
assert.ok(sampleGatewayCamera(0, false).x < 0);
assert.ok(sampleGatewayCamera(0.5, false).z < sampleGatewayCamera(0.25, false).z);
assert.ok(sampleGatewayCamera(1, false).z < sampleGatewayCamera(0.75, false).z);
assert.ok(sampleGatewayCamera(1, true).z > sampleGatewayCamera(1, false).z);
```

Also assert clamping for progress below 0 and above 1.

- [ ] **Step 2: Run RED**

```bash
node --test tests/gateway-v2-camera.test.mjs
```

Expected: fail because `cameraPath.ts` does not exist.

- [ ] **Step 3: Implement five authored camera key poses**

Use a small keyframe table representing `THE VOID`, `THE THRESHOLD`, `THE CUT`, `THE CORE`, `THE DIVIDE`. Interpolate position, target, and FOV with smoothstep/eased segment interpolation. Keep FOV in the approved 40–44° range.

Do not implement a generic spline framework; the five-shot table is the product.

- [ ] **Step 4: Wire camera samples into `deriveGatewayPose`**

Preserve existing split percentages, identity leak gate from 0.85→1, reduced-motion semantics, and distinct Visuals/Technical preview/exit values. Reduced motion must resolve to the settled split camera without travel interpolation.

- [ ] **Step 5: Update Three camera application**

In `scene.ts`, apply position and `camera.lookAt(targetX, targetY, targetZ)`, update FOV only when changed, and keep preview yaw/bias extremely restrained. Do not add roll or head bob.

- [ ] **Step 6: Update existing choreography tests**

Keep assertions for 50/50, 62/38, 68/32, identity leak, asymmetric openings, reduced motion, and exit behavior. Replace only obsolete assumptions that desktop travel is a straight `12 → -18` Z lerp.

- [ ] **Step 7: Run targeted and full gateway tests**

```bash
node --test tests/gateway-v2-camera.test.mjs tests/gateway-choreography.test.mjs
node --test tests/gateway-*.test.mjs
npm run typecheck
```

- [ ] **Step 8: Capture the five runtime camera checkpoints and write `02-camera.md`**

Record the exact progress values used for the five shots and the approved FOV range. Human review must explicitly confirm that the motion reads as architectural dolly choreography rather than FPS travel.

- [ ] **Step 9: Commit and stop**

```bash
git add lib/gateway/cameraPath.ts lib/gateway/choreography.ts lib/gateway/scene.ts tests/gateway-v2-camera.test.mjs tests/gateway-choreography.test.mjs docs/gateway-v2/checkpoints/02-camera.md
git commit -m "feat: choreograph gateway V2 camera path"
```

**HARD STOP:** Do not start final materials/lighting until camera framing is approved.

---

### Task 5: V2.3 Materials + Architectural Lighting

**Claude budget class:** strongest Opus-class model.

**Files:**
- Modify: `tools/blender/build_gateway_v2.py` only if material slots/names need authoring support
- Modify: `lib/gateway/scene.ts`
- Modify: `lib/gateway/choreography.ts`
- Modify: `tests/gateway-choreography.test.mjs`
- Create: `docs/gateway-v2/checkpoints/03-lighting.md`

**Interfaces:**
- Consumes: semantic GLB nodes and approved camera path.
- Produces: runtime material/light state controlled by existing `neutralLight`, `visualLight`, `technicalLight`, `identityLeak` pose values.

- [ ] **Step 1: Add/adjust RED choreography assertions for lighting separation**

At travel `0.84`, identity leakage remains zero. At `0.925`, Visuals and Technical must have distinguishable light values. At full split, Visuals preview must brighten/soften only Visuals; Technical preview must sharpen/brighten only Technical.

- [ ] **Step 2: Run RED if the new assertions expose missing V2 behavior**

```bash
node --test tests/gateway-choreography.test.mjs
```

- [ ] **Step 3: Implement restrained runtime material palette**

Use a small number of high-roughness mineral/graphite materials. The neutral world stays near-black/graphite; Visuals shifts only toward warm ivory/mineral; Technical shifts only toward colder steel/mineral. No texture library or postprocessing is added.

- [ ] **Step 4: Implement one dominant light idea per authored shot**

Use the minimum lights needed to achieve:

```text
Entry: near-black + seam
Gallery: dominant cut
Core: controlled silhouette/back-light behavior
Split: broad Visuals diffuse vs precise Technical cut
```

Avoid hemisphere/directional fill that makes all surfaces equally visible.

- [ ] **Step 5: Verify freeze frames again**

At the same five camera checkpoints, capture stills. Lighting must improve already-approved composition rather than hide weak geometry. If geometry suddenly needs extra effects to work, return to Task 2 instead of adding effects.

- [ ] **Step 6: Run tests/typecheck/build**

```bash
node --test tests/gateway-choreography.test.mjs
npm run typecheck
npm run build
```

- [ ] **Step 7: Write `03-lighting.md`, commit, and stop**

Record exact palette values, light count/types, and human approval notes.

```bash
git add lib/gateway/scene.ts lib/gateway/choreography.ts tests/gateway-choreography.test.mjs docs/gateway-v2/checkpoints/03-lighting.md tools/blender/build_gateway_v2.py
git commit -m "feat: art direct gateway V2 materials and light"
```

**HARD STOP:** No loader or selection-layout redesign in this section.

---

### Task 6: V2.4 Loader Architectural Reveal

**Claude budget class:** Sonnet-class.

**Files:**
- Modify: `components/gateway/GatewayPrototype.tsx`
- Modify: `components/gateway/LoaderOverlay.tsx`
- Modify: `lib/gateway/choreography.ts`
- Modify: `app/gateway-prototype/gateway.css`
- Create/Modify: `tests/gateway-v2-presentation.test.mjs`
- Create: `docs/gateway-v2/checkpoints/04-loader.md`

**Interfaces:**
- `GatewayPoseInput` adds:

```ts
loaderProgress: number;
```

- `GatewayPose` adds:

```ts
sceneReveal: number;
```

`loaderProgress` comes from the existing `displayedProgress` state; it is visual-only and must not change loader phase timing/state transitions.

- [ ] **Step 1: Write RED presentation tests**

Assert source contracts for restrained loader copy and the absence of the V1 giant-counter treatment. The loader must retain `BM`, `INITIALIZING`, numeric progress, optional Skip in first mode, and `TWO WORLDS. ONE SYSTEM.` behavior.

- [ ] **Step 2: Add RED choreography tests for visual reveal**

Assert:

```js
assert.equal(deriveGatewayPose({ ...input, loaderProgress: 0 }).sceneReveal, 0);
assert.ok(deriveGatewayPose({ ...input, loaderProgress: 0.5 }).sceneReveal > 0);
assert.equal(deriveGatewayPose({ ...input, loaderProgress: 1 }).sceneReveal, 1);
```

- [ ] **Step 3: Pass `displayedProgress` into `deriveGatewayPose`**

This must not alter `getLoaderTarget`, loader duration, session resolution, Skip eligibility, fallback timeout, or navigation.

- [ ] **Step 4: Recompose loader CSS**

Target hierarchy:

```text
BM

INITIALIZING                         047
```

Remove the dominant `23vw` giant counter composition. Keep typography restrained and let the architecture increasingly own the frame as `sceneReveal` approaches 1.

- [ ] **Step 5: Apply `sceneReveal` in Three.js**

Use it to modulate exposure/light visibility or material darkness so the scene emerges continuously behind the loader. Do not crossfade to a different scene.

- [ ] **Step 6: Verify first, short, reduced-motion, Skip, and fallback modes**

Run:

```bash
node --test tests/gateway-v2-presentation.test.mjs tests/gateway-choreography.test.mjs tests/gateway-state.test.mjs
npm run typecheck
npm run build
```

Manual QA must verify normal first load, session return, reduced motion, Skip, and forced 9-second readiness failure.

- [ ] **Step 7: Write checkpoint, commit, and stop**

```bash
git add components/gateway/GatewayPrototype.tsx components/gateway/LoaderOverlay.tsx lib/gateway/choreography.ts app/gateway-prototype/gateway.css tests/gateway-v2-presentation.test.mjs tests/gateway-choreography.test.mjs docs/gateway-v2/checkpoints/04-loader.md
git commit -m "feat: reveal gateway architecture through loader"
```

**HARD STOP:** Do not redesign split signage in this section.

---

### Task 7: V2.5 Split Chamber + Spatial Signage

**Claude budget class:** strongest Opus-class model.

**Files:**
- Modify: `components/gateway/SelectionOverlay.tsx`
- Modify: `app/gateway-prototype/gateway.css`
- Modify: `lib/gateway/scene.ts`
- Modify: `lib/gateway/choreography.ts`
- Modify: `tests/gateway-markup.test.mjs`
- Modify: `tests/gateway-v2-presentation.test.mjs`
- Create: `docs/gateway-v2/checkpoints/05-split.md`

**Interfaces:**
- Preserve `SelectionOverlayProps` event callbacks and real `Link` destinations.
- Preserve desktop 50/50 neutral, 62/38 preview and coarse 68/32 semantic ownership.
- Architecture uses existing `leftOpen`, `rightOpen`, `visualLight`, `technicalLight` values but applies them asymmetrically to `visuals_root` and `technical_root`.

- [ ] **Step 1: Write/adjust RED markup tests before changing layout**

Tests must continue to assert:

```text
BM VISUALS
Creative / Digital Experience
Digital identities
with motion, story and distinction.
ENTER VISUALS ↗

BMP TECHNICAL
Technology / AI Systems
AI systems, product logic
and technical execution.
ENTER TECHNICAL ↗
```

They must also assert both destinations remain real anchors/Next Links and the accessibility intro retains `BM` and `TWO WORLDS. ONE SYSTEM.`.

- [ ] **Step 2: Remove the visual two-column-page treatment while preserving interaction hit regions**

The screen may still use invisible/transparent left/right interaction regions, but visible typography should sit as spatial signage near the passages/core. Remove the central webpage-style divider as the primary split cue.

- [ ] **Step 3: Recompose the BM core mark**

Keep the accessible BM heading in DOM. The visible BM mark should align visually with the monolith and stop reading like a bordered UI badge. Do not bake text into the GLB.

- [ ] **Step 4: Make Visuals and Technical preview architecture visibly non-mirrored**

Visuals: broad aperture opening, larger surfaces, softer/broader light response.

Technical: structural separation, tighter/nested planes, precise cut response.

Keep camera bias around 1–2° equivalent at most; geometry does the work.

- [ ] **Step 5: Preserve coarse/mobile two-step behavior**

First tap previews; CTA enters. No fake hover and no custom cursor on touch.

- [ ] **Step 6: Run regression tests**

```bash
node --test tests/gateway-markup.test.mjs tests/gateway-v2-presentation.test.mjs tests/gateway-navigation.test.mjs tests/gateway-choreography.test.mjs
npm run typecheck
npm run build
```

- [ ] **Step 7: Human-review five states**

Capture:

```text
neutral split
Visuals preview
Technical preview
mobile neutral
mobile preview
```

The neutral split must not read as a generic two-column landing page.

- [ ] **Step 8: Write checkpoint, commit, and stop**

```bash
git add components/gateway/SelectionOverlay.tsx app/gateway-prototype/gateway.css lib/gateway/scene.ts lib/gateway/choreography.ts tests/gateway-markup.test.mjs tests/gateway-v2-presentation.test.mjs docs/gateway-v2/checkpoints/05-split.md
git commit -m "feat: turn gateway split into spatial signage"
```

**HARD STOP:** No unrelated site redesign or production routing integration.

---

### Task 8: V2.6 Mobile, Performance, Reduced Motion + Final Verification

**Claude budget class:** Sonnet-class; use Opus only for a narrowly identified visual defect after evidence.

**Files:**
- Modify only as evidence requires: `lib/gateway/scene.ts`, `components/gateway/TunnelCanvas.tsx`, `app/gateway-prototype/gateway.css`, `lib/gateway/choreography.ts`
- Create: `docs/gateway-v2/checkpoints/06-final.md`

**Interfaces:**
- No new product interfaces. This task hardens the approved V2 system.

- [ ] **Step 1: Establish asset/performance evidence**

Record GLB byte size:

```bash
node -e "const fs=require('fs'); console.log(fs.statSync('public/gateway/gateway-v2.glb').size)"
```

Keep the asset lean through geometry/material discipline; do not add a compression dependency in this task.

- [ ] **Step 2: Verify renderer lifecycle and DPR caps**

Preserve desktop DPR cap `1.5`, coarse/mobile cap `1.25`, hidden-tab RAF pause, and resource disposal. Confirm navigating away and back does not create multiple canvases/render loops.

- [ ] **Step 3: Verify reduced motion remains a static architectural reveal**

Reduced motion must use short loader → settled architectural split, no long dolly, no preview camera bias, and restrained selection contrast/architecture response only.

- [ ] **Step 4: Run full automated verification fresh**

```bash
git diff --check
npm run lint
npm run typecheck
npm test
npm run build
```

All commands must exit 0 before completion is claimed.

- [ ] **Step 5: Run conflict/scope scans**

```bash
git grep -nE '^(<<<<<<<|=======|>>>>>>>)' -- . ':!package-lock.json'
git diff origin/main -- app/page.tsx package.json package-lock.json
```

Expected: no conflict markers and no V2 modifications to production homepage or dependency manifests.

- [ ] **Step 6: Browser QA at approved sizes**

Verify:

```text
1440×900
1280×800
768×1024
390×844 true-coarse/touch emulation where available
```

Check loader, all five core shots, neutral split, both desktop previews, mobile neutral/preview, keyboard focus/Enter/Escape, Back/return session, reduced motion, forced WebGL failure, 9-second readiness timeout, resize/orientation, hidden-tab RAF pause, repeated route entry/cleanup, rapid hover switching, wheel spam, click spam, and console/hydration errors.

- [ ] **Step 7: Run final creative rejection test**

If the experience resembles an FPS lobby, sci-fi game menu, Unreal showcase, or generic AI site, fix composition/FOV/camera speed/geometry/lighting. Do not add effects as the fix.

- [ ] **Step 8: Write final checkpoint with evidence**

`docs/gateway-v2/checkpoints/06-final.md` must include exact final commit candidate SHA, command outputs/pass counts, asset size, QA viewport results, known limitations, and the five approved freeze-frame paths.

- [ ] **Step 9: Commit, push, and stop before merge**

```bash
git add docs/gateway-v2/checkpoints/06-final.md
git commit -m "docs: record gateway V2 final verification"
git push -u origin feat/bm-gateway-tunnel-v2
```

Create a PR for review if desired, but **do not merge it** and do not replace production `/`.

---

## Claude Sectioning / API Budget Rules

Use a fresh Claude chat for each hard-bounded section whenever possible:

```text
V2.0  → Sonnet 5
V2.1A → Opus 5
V2.1B → Opus 5 only after human still-frame notes
V2.1C → Sonnet 5
V2.2  → Opus 5
V2.3  → Opus 5
V2.4  → Sonnet 5
V2.5  → Opus 5
V2.6  → Sonnet 5
```

Each new chat reads:

1. the approved spec,
2. this plan section only,
3. the immediately previous checkpoint,
4. only the source files listed for that task.

Do not paste prior Claude transcripts into the next chat. The checkpoint is the handoff artifact.

## Plan Self-Review

- Spec coverage: all approved V2 sections are mapped to Tasks 0–8, including Blender procedural authoring, graybox review gate, semantic GLB, authored camera, materials/lighting, loader reveal, spatial split, mobile/reduced motion/performance, and non-production integration.
- Placeholder scan: no `TBD`, `TODO`, “implement later”, or unspecified test step remains.
- Type consistency: `GatewaySceneController.ready`, `GatewayCameraSample`, `GatewayPose` camera additions, `loaderProgress`, `sceneReveal`, and semantic node names are defined before later tasks consume them.
- Scope consistency: frozen V1 engine contracts remain outside normal V2 edit scope; production `/` and dependency manifests remain protected.
