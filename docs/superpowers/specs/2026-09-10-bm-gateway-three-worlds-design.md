# BM Gateway — Three Worlds Selection & Cinematic Briefing Design

Date: 2026-09-10
Status: Approved for implementation
Branch: `feat/bm-gateway-three-worlds`
Base: `da4fc5d6fedc3acc88680a8b4f099c86673aee24` (`origin/main`, including merged PR #21)

## 1. Purpose

Evolve the approved Gateway / Tunnel Ver 4 destination layer from a binary BM Visuals / BMP Technical selector into the canonical three-world BMP architecture:

- BM Visual → `/bm-visual`
- BM Tech → `/bm-tech`
- BMP Creator → `/creator`

The tunnel, Impossible Core, spectral chamber, master journey, scroll/autoplay behavior, palette, camera travel, and reverse reconstruction remain the approved Tunnel Ver 4 experience. This feature begins only when the destination chamber emerges.

Selecting a world no longer navigates immediately. It starts a reversible cinematic briefing inside the same chamber. The briefing ends in an explicit decision state with `GO BACK` and a real `CONTINUE →` link. There is no timer-driven navigation.

## 2. Audited baseline

The current implementation confirms the brief's binary assumptions:

- `GatewayDivision` is `"visuals" | "technical"`.
- `GatewayState` overloads `committed` as both selection and outbound transition state.
- `getSelectionBias()` compresses interaction to `-1 | 0 | 1`.
- `deriveGatewayPose()` uses the same scalar for entity response, camera bias, overlay ratios, and exit choreography.
- `DualEntitySystem` owns only `VisualsEntity` and `TechnicalEntity`.
- `SelectionOverlay` exposes two immediate-navigation links with legacy public names and prototype destinations.
- `GatewayFallback` contains the same two legacy destinations.

Canonical names, headlines, descriptions, and routes already exist in `content/home.ts`. Gateway code will consume that typed source rather than duplicate canonical copy.

The clean base passes 128 tests. At the settled neutral chamber on a 1280×720 browser viewport, the WebGL instrumentation reports 26 draw calls, 45,980 triangles, and no final-chamber refraction pass. These values are the performance baseline.

BM Visual already owns the approved dual shell, atmosphere, Fabriclism/Aurelia/Haven textures, autonomous rotation, preview parallax, and shell separation. The feature exists but is perceptually suppressed: preview alpha is strictly hover-gated from zero, the opaque shell dominates depth, and only a faint fragment remains visible through the opened gap. The implementation will restore visibility without replacing this entity.

## 3. Scope boundaries

### In scope

- A typed three-destination content/model boundary.
- Semantic `split`, `preview`, `briefing`, `decision`, `commit`, and `exit` states.
- A separate normalized and reversible `briefingProgress` timeline.
- One new deterministic Construct / Seed Creator entity.
- Three-entity chamber composition and per-division interaction weights.
- A neutral selector, cinematic briefing copy, delayed decision controls, focus restoration, touch preview, Escape, and reduced-motion behavior.
- Canonical routes and labels in enhanced and fallback experiences.
- BM Visual preview visibility correction.
- Regression, accessibility, browser, and performance verification.

### Explicitly out of scope

- Changes to Tunnel Ver 4 origin, passage, Impossible Core, release, chamber architecture, journey timing, master progress, forward/reverse input physics, autoplay, or idle resume.
- A portal, reactor, giant logo, modal, frozen-background overlay, or card-based selection layout.
- Rebuilding BM Visual or BM Tech from scratch.
- New canonical marketing copy.
- Automatic continuation, production-home integration, or merging the pull request.

## 4. Three-world content model

Add `lib/gateway/destinations.ts` as the Gateway's typed adapter over `HOME.capabilities`.

```ts
type GatewayDivision = "visuals" | "technical" | "creator";

type GatewayDestination = {
  division: GatewayDivision;
  name: string;
  publicLabel: "BM VISUAL" | "BM TECH" | "BMP CREATOR";
  headline: string;
  description: string;
  href: "/bm-visual" | "/bm-tech" | "/creator";
};
```

The adapter maps internal Gateway identifiers to canonical content keys (`visual`, `tech`, `creator`) once. Enhanced selection, briefing, fallback, route tests, and cursor labels consume the same destination records. Internal `technical` may remain; public output never uses `BM VISUALS` or `BMP TECHNICAL`.

## 5. State architecture

`GatewayState` becomes explicit rather than overloading preview/commit fields:

```ts
type GatewayState = {
  phase:
    | "loading"
    | "ready"
    | "auto-entry"
    | "user-travel"
    | "split"
    | "preview"
    | "briefing"
    | "decision"
    | "commit"
    | "exit"
    | "fallback";
  previewDivision: GatewayDivision | null;
  selectedDivision: GatewayDivision | null;
  returning: boolean;
  sessionResolved: boolean;
};
```

State transitions:

```text
loading → ready → auto-entry/user-travel → split
split ↔ preview
split/preview → briefing → decision
briefing/decision → briefing (reverse) → split
decision → commit → exit
any non-exit lifecycle failure → fallback
```

The reducer remains pure. Timeline completion events move `briefing → decision` and reverse completion moves `briefing → split`. A selected division exists only during briefing, decision, commit, and exit. Preview is temporary and cannot imply a navigation lock.

Escape clears `preview`. Escape in `briefing` or `decision` requests the same reversible return path as `GO BACK`.

## 6. Dual timelines

### Master journey (`travelProgress`, 0…1)

The existing controller, constants, and mapping stay unchanged. It continues to own tunnel travel, chamber arrival, reverse reconstruction, autoplay, idle resume, and neutral-chamber rewind.

### Destination briefing (`briefingProgress`, 0…1)

Add `lib/gateway/briefing.ts` with pure timing and mapping functions. `GatewayPrototype` owns one briefing-controller ref and mirrors its current normalized value into React state for presentation. The controller advances toward 1 after intentional selection and reverses toward 0 after Go Back/Escape. It never writes `travelProgress`.

The full-motion duration is approximately five seconds:

- 0.00–0.20: selection acknowledgement
- 0.20–0.56: camera/entity focus
- 0.48–0.76: identity reveal
- 0.68–1.00: supporting description and settle
- 1.00: decision controls become available and state becomes `decision`

Reduced motion resolves the same information architecture quickly with a short bounded transition, no long camera travel, and immediate stable spatial targets. The decision state and controls still exist.

## 7. Per-destination interaction model

Replace scalar selection bias with a pure record keyed by all divisions:

```ts
type DestinationInteraction = Record<GatewayDivision, {
  hoverWeight: number;
  selectedWeight: number;
  recedeWeight: number;
  focusWeight: number;
}>;
```

`deriveDestinationInteraction({ previewDivision, selectedDivision, briefingProgress })` produces the same targets for the same semantic input. No geometry derives meaning from left/center/right numeric bias. The result feeds both the scene and DOM presentation.

- Neutral: every weight is zero.
- Preview: the previewed world receives hover/focus weight; other worlds remain present.
- Briefing/decision: the selected world gains selected/focus weight with `briefingProgress`; the other two gain recede weight.
- Reverse: the same mapper naturally reconstructs the neutral chamber as progress returns to zero.

## 8. Scene and choreography integration

Rename `DualEntitySystem` to `DestinationEntitySystem`; do not keep a misleading compatibility alias. It owns Visual, Creator, and Technical entities plus the existing destination light rig.

`deriveGatewayPose()` retains all tunnel-derived values and adds destination-focus outputs driven only at the chamber endpoint:

- per-division interaction weights
- briefing camera X/Y/Z offset and target
- subtle briefing FOV adjustment
- selected-world composition translation and scale
- non-selected depth/darkness falloff
- briefing text reveal weights
- decision reveal weight

At `briefingProgress === 0`, camera, environment, and entity transforms equal the approved neutral chamber. Tunnel traversal values remain a function of master journey progress alone.

Selected composition gives roughly 55–65% perceptual authority to the entity/environment on the left and 30–40% to editorial copy on the right. This is achieved through restrained camera target, dolly, object translation/scale, and falloff—not a giant scale jump. Narrow layouts stack the semantic briefing without cropping the selected object.

## 9. Entity design

### BM Visual

Preserve all current geometry, real preview textures, shaders, shell opening, atmosphere, rotation, and parallax. Extend entity inputs from a scalar hover to explicit interaction weights.

Visibility correction:

- retain a very low neutral preview floor for quiet autonomous inner life;
- raise hover/selected preview opacity and contrast without exposing hard rectangular planes;
- coordinate shell separation, depth order, and inner atmosphere opacity so fragments can be perceived through the cavity;
- use selected weight to open further and reveal more than hover;
- retain blur/refractive grading and premium pearl character.

### BM Tech

Preserve the split casing, backbone, logic planes, plinth, shaders, and precise motion. Explicit hover/selected weights expose structural intelligence progressively. Selected state increases casing separation, internal-plane authority, and datum response rather than applying a general brightness boost.

### BMP Creator

Add `creatorEntity.ts` and a focused shader/material module only if custom shading is necessary. The entity is a compact Construct / Seed assembly, not a sphere, monolith, cube, icon, or logo:

- one small asymmetric mineral core;
- a partial pearlescent shell made from a few authored segments;
- a restrained set of graphite modular pieces;
- deterministic orbit, docking, and assembly offsets using fixed authored phases;
- one low-output internal cyan/violet/warm spectral source.

Idle movement is slow. Hover makes assembly relationships legible. Selected state docks some pieces while opening others to reveal the core. Geometry and materials are shared where practical, with no `Math.random()` and no high-count scatter.

Neutral placement remains cinematic rather than columnar: Visual left/near, Creator central/slightly deeper and smaller, Tech right/near. Differences establish character without changing semantic authority.

## 10. Selection and briefing UI

The enhanced overlay is split into focused units:

- `SelectionOverlay`: neutral/preview destination controls and concise identity/headline.
- `BriefingOverlay`: semantic announcement region, canonical name/headline/description, and delayed decision controls.

Neutral state shows only `BM VISUAL`, `BM TECH`, `BMP CREATOR`, plus the restrained master-brand line `Creative × Technology × Products.` No supporting paragraphs appear until briefing.

Fine pointer and keyboard focus show one canonical headline and a subtle entity response. Leaving/blurring returns to neutral unless focus moved within the same destination or a selection is active.

Destination controls are semantic buttons because their action is selection, not navigation. The decision `CONTINUE →` is a real canonical anchor. This keeps the selection model honest and confines navigation enhancement logic to the actual navigation control.

## 11. Pointer, keyboard, and focus behavior

### Fine pointer

- hover/focus previews only;
- click/Enter intentionally selects and starts briefing;
- no navigation occurs before decision.

### Coarse pointer

- first tap sets preview and exposes the short headline;
- second deliberate activation of the same destination starts briefing;
- tapping another destination transfers preview;
- no first tap can navigate.

### Keyboard and focus

- all three destination buttons participate in logical tab order;
- activating one stores its element ref and starts briefing;
- when briefing identity becomes available, focus moves to a focusable briefing heading/region and its content is announced;
- decision controls enter tab order only in `decision`;
- receded destination buttons are inert and not focusable;
- Go Back completes the reverse, then restores focus to the originating destination button;
- Escape is available before decision controls appear and follows the same return path.

## 12. Navigation semantics

Only `CONTINUE →` performs normal division navigation. It remains an anchor with the canonical `href`.

The existing intent helpers continue to distinguish primary pointer enhancement from keyboard, modifier, middle-click, `target`, `download`, reduced motion, and unavailable enhancement. Normal enhanced activation acquires the existing synchronous commit lock, dispatches `commit`, runs the outbound transition, writes `bmGatewaySeen`, then routes with the existing location fallback. Modified/middle/new-context activations retain native anchor behavior and do not corrupt current-tab state. Keyboard and reduced-motion activations retain native navigation while marking the session when eligible.

No selection timer calls Continue. Duplicate-navigation protection remains in place.

## 13. Scroll and journey ownership

Journey wheel/drag listeners remain active for `auto-entry`, `user-travel`, `split`, and `preview`, preserving neutral-chamber reverse scroll. They are inactive in `briefing`, `decision`, `commit`, and `exit`, so reading input cannot alter master journey progress. Go Back restores `split` only after `briefingProgress` reaches zero; journey reversal becomes available again at that point.

## 14. Fallback and reduced motion

`GatewayFallback` renders all three canonical destinations as ordinary links using the shared destination records. Creator is never WebGL-only. The fallback is useful without hover and does not imitate the timed cinematic briefing.

Reduced motion keeps all three choices and the full briefing. It suppresses autonomous entity/camera movement, resolves selected composition quickly, reveals the canonical description, and exposes Go Back/Continue without forcing a prolonged WebGL sequence.

## 15. Performance strategy

Baseline at 1280×720 neutral chamber:

- draw calls: 26
- triangles: 45,980
- final refraction pass: inactive

The Creator entity targets a restrained increase: no more than roughly 12 additional neutral draw calls and a final triangle count below roughly 65,000 at the same state. It uses shared low/medium-segment geometries, a small material family, no textures, deterministic authored pieces, and complete disposal. Existing DPR caps remain unchanged. Browser instrumentation continues exposing draw calls and triangles for before/after comparison.

Briefing animation reuses the existing render loop and adds no second RAF loop. All listeners and Three.js resources are disposed through their current owners.

## 16. Testing and verification

Implementation follows TDD. Failing tests are added before each behavior change for:

- three division identifiers and canonical destination records;
- exact labels and routes;
- preview versus intentional selection semantics;
- briefing/decision timing and reversible Go Back;
- Continue-only commit/navigation;
- Creator coarse-pointer preview-first behavior;
- Escape recovery;
- reduced-motion information preservation;
- modifier/middle/keyboard navigation contracts;
- deterministic per-division interaction and Creator transforms;
- unchanged journey and reverse reconstruction tests;
- fallback and semantic markup for all destinations.

Final verification includes full tests, typecheck, lint, production build, console/runtime checks, and actual browser review at every state required by the approved brief. BM Visual preview fragments must be visibly perceptible in screenshots at hover and selected states. Performance is recorded at the same viewport and chamber state as the baseline.

## 17. Acceptance boundary

The implementation is acceptable only if it reads as the existing Tunnel Ver 4 settling into three distinct spatial worlds, then physically reorganizing into a cinematic briefing. It is rejected if it resembles cards, a game character selector, a modal, three neon props, randomized Creator geometry, a rebuilt tunnel, or an automatic click-through.
