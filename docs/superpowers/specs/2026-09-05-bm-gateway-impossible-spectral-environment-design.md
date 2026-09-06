# BM Gateway V2 — Reversible Impossible Spectral Environment Implementation Specification

Date: 2026-09-05\
Status: Historical pre-implementation proposal; superseded in detail by checkpoint 14\
Branch: `feat/bm-gateway-tunnel-v2`\
Starting commit: `8215fc0c6687ba60af6d550519932f3ac8153df6`

The subsequent creative corrective brief authorized implementation and a branch-local commit. The architecture and frozen contracts below remain the design reference; exact shipped modules, controller constants, geometry choices, verification and limitations are recorded in `docs/gateway-v2/checkpoints/14-creative-tunnel-rebuild.md`. This proposal is not a claim that every originally proposed system was implemented verbatim.

## 1. Purpose

Rebuild the BM Gateway traversal and final chamber as one reversible, authored spectral impossible space while preserving the existing navigation, accessibility, fallback, session, selection, and hero-entity contracts.

The approved runtime architecture is:

```text
one pure visual-progress controller
→ one deterministic chapter mapper
→ one authored Three.js scene graph
→ shared traversal material families
→ separately owned final hero entities
```

This pass does not use a full-screen raymarch. It does not integrate the prototype into production, merge branches, create a pull request, or redesign the BM Visuals worldform or BMP Technical monolith.

The visual target is one coherent impossible spatial world that can be scrubbed forward and backward. The primary quality gate is the midground composition, not object count, camera motion, foreground occlusion, or shader intensity.

## 2. Scope and frozen contracts

### 2.1 Frozen files

The implementation must not modify:

- `lib/gateway/state.ts`
- `lib/gateway/navigation.ts`
- `lib/gateway/progress.ts`
- `app/page.tsx`

The final checkpoint must confirm this with:

```bash
git diff --exit-code 8215fc0c6687ba60af6d550519932f3ac8153df6 -- \
  lib/gateway/state.ts \
  lib/gateway/navigation.ts \
  lib/gateway/progress.ts \
  app/page.tsx
```

### 2.2 Frozen behavior

The following remain intact:

- `bmGatewaySeen` session behavior and one-time session resolution
- semantic links and keyboard activation
- modifier-click, middle-click, `target`, and `download` behavior
- coarse-pointer preview-first behavior
- reduced-motion short entry and static endpoint
- WebGL failure fallback and hard readiness timeout
- commit lock and navigation fallback
- production-route isolation
- current final selection interaction

### 2.3 Final hero entities

The following stay as separately owned visual systems:

- `lib/gateway/entities/visualsEntity.ts`
- `lib/gateway/entities/visualsShader.ts`
- `lib/gateway/entities/technicalEntity.ts`
- `lib/gateway/entities/technicalShader.ts`

Traversal shaders must not be imported into those modules. Their geometry, materials, hover/project-preview reveal, and selection behavior are not rewritten. `scene.ts` applies a deterministic emergence envelope to the `DualEntitySystem.group` boundary; the entity implementations remain untouched.

## 3. Existing systems to remove or replace

The current traversal fails the approved art direction because it relies on:

- two large near-camera blade planes
- eight repeated manifold planes
- four generic transmission planes
- 64 line segments functioning as tunnel/speed filaments
- a final chamber that scales in as a separate scene
- repeated box baffles and a literal luminous center seam
- elapsed-time shader motion that cannot reconstruct solely from master progress
- a second damping layer in `scene.ts`, making the rendered scene history-dependent

These systems will be removed rather than cosmetically restyled.

Expected removals:

- `lib/gateway/matter/livingMatterSystem.ts`
- `lib/gateway/matter/livingMatterShader.ts`
- `lib/gateway/environment/chamberEnvironment.ts`
- `lib/gateway/environment/chamberShader.ts`

Their responsibilities are replaced by the spectral environment modules defined below. Removal is contingent on the replacement passing the frozen gateway suite and browser verification.

## 4. File and module architecture

### 4.1 Pure journey modules

`lib/gateway/journey/controller.ts`

- owns the only mutable visual journey state
- receives normalized input events and frame time
- advances autoplay
- handles forward and reverse impulses
- handles idle resume and velocity ramping
- pauses at progress `1`
- allows reverse input to leave progress `1`
- has no React, DOM, Three.js, state-machine, navigation, or router imports

`lib/gateway/journey/chapterState.ts`

- clamps one normalized render progress
- maps progress to continuous camera, chapter, density, material, light, structural, chamber, and entity-emergence values
- contains no elapsed-time input and no mutable state
- exposes deterministic values for unit tests and Three.js consumers

### 4.2 Environment modules

`lib/gateway/environment/spectralGeometry.ts`

- creates authored surface patches, partial shells, cavity rims, mineral escarpments, and nested void geometry
- uses deterministic parameters only
- creates several related pieces per conceptual system where needed
- does not generate line tunnels, rectangular frame sequences, random prop fields, or generic object scatters

`lib/gateway/environment/spectralMaterial.ts`

- owns shared GLSL utilities and traversal-only material factories
- creates a controlled family of optical, pearl, mineral, graphite, refractive-edge, and internally luminous states
- uses master progress and fixed per-system phase offsets, never elapsed time
- does not export materials to final hero entity modules

`lib/gateway/environment/spectralEnvironment.ts`

- owns the complete origin, formation, passage, core, dissolution, and residual chamber environment
- groups related meshes into conceptual spatial systems
- applies the pure chapter frame directly
- keeps far destination, midground composition, rare foreground accents, and final chamber in one scene graph
- owns and disposes all environment geometry/material resources

### 4.3 Integration modules

`lib/gateway/choreography.ts`

- continues producing the public `GatewayPose`
- uses the chapter mapper for restrained camera values and emergence envelopes
- retains selection, exit, coarse-pointer, and reduced-motion behavior
- remains a pure function

`lib/gateway/scene.ts`

- constructs renderer, camera, spectral environment, independent dual entities, and selective light rig
- removes `LivingMatterSystem` and `ChamberEnvironment`
- applies journey camera/environment values directly from render progress
- does not damp master progress, camera, chapter, or environmental transforms a second time
- may continue damping selection-only values such as hover bias inside their existing systems

`components/gateway/GatewayPrototype.tsx`

- owns application lifecycle/state-machine dispatch, session behavior, semantic navigation, and React presentation
- holds one ref containing `VisualJourneyState`
- mirrors `renderProgress` into React state only to render the canvas and presentation attributes
- does not independently own `targetProgress` or a second rendered-progress ref
- registers scrub input during eligible journey and final-selection phases without dispatching navigation/product-state mutations

`components/gateway/TunnelCanvas.tsx`

- remains the decorative canvas lifecycle boundary
- forwards deterministic poses to the scene
- keeps DPR caps, cleanup, visibility handling, readiness, and failure behavior

`app/gateway-prototype/gateway.css`

- adds the visual transition between journey and selection readiness
- does not change semantic link behavior or production styles

## 5. Exact visual-progress ownership

### 5.1 Single source of truth

`VisualJourneyState` in `lib/gateway/journey/controller.ts` is the sole owner of:

```ts
type VisualJourneyState = {
  targetProgress: number;
  renderProgress: number;
  autoplayVelocity: number;
  lastInputAtMs: number | null;
  seek: null | {
    from: number;
    to: number;
    startedAtMs: number;
    durationMs: number;
  };
};
```

`GatewayPrototype` stores this object in one ref. React `travelProgress` is a read-only presentation snapshot copied from `renderProgress`; it is never read back to calculate motion. No `targetProgressRef` or `renderedProgressRef` remains beside the controller state.

The application state machine remains authoritative for loading, fallback, selection preview, commit, and exit. It does not own or infer the reversible visual journey position.

### 5.2 Pure controller API

The controller exposes pure state transitions:

```ts
createVisualJourneyState(initialProgress?: number): VisualJourneyState

applyScrollImpulse(
  state: VisualJourneyState,
  input: { deltaPixels: number; nowMs: number },
): VisualJourneyState

beginVisualSeek(
  state: VisualJourneyState,
  input: { to: number; nowMs: number; durationMs: number },
): VisualJourneyState

stepVisualJourney(
  state: VisualJourneyState,
  input: {
    deltaSeconds: number;
    nowMs: number;
    autoplayAllowed: boolean;
  },
): VisualJourneyState
```

Every function returns a new deterministic state and clamps both progress values to `[0, 1]`.

### 5.3 Autoplay calculation

Constants:

```text
AUTOPLAY_SPEED = 0.055 progress units / second
IDLE_DELAY_MS = 850
AUTOPLAY_RAMP_MS = 900
RENDER_DAMPING = 8.5
SCROLL_PROGRESS_PER_PIXEL = 0.00075
MAX_SCROLL_PIXELS_PER_EVENT = 180
FINAL_EPSILON = 0.001
```

When there has been no user input, autoplay begins at full cinematic velocity. After input, autoplay remains zero for `850 ms`, then ramps from zero to `AUTOPLAY_SPEED` over `900 ms` using smoothstep:

```text
resume = smoothstep(0, 1, (nowMs - lastInputAtMs - 850) / 900)
autoplayVelocity = autoplayAllowed ? AUTOPLAY_SPEED × resume : 0
targetProgress += autoplayVelocity × deltaSeconds
```

`renderProgress` approaches `targetProgress` with frame-rate-independent exponential damping. If the remaining distance is within `FINAL_EPSILON`, it snaps exactly to the target. There is no additional progress/camera damping in the WebGL scene.

### 5.4 Scroll impulse and reverse suppression

Wheel `deltaMode` is normalized to pixels by the React integration. The signed pixel delta is clamped to `[-180, 180]` before applying the progress scale.

Forward input:

```text
targetProgress = max(targetProgress, renderProgress) + positiveImpulse
```

Reverse input:

```text
targetProgress = min(targetProgress, renderProgress) + negativeImpulse
```

Anchoring a reverse impulse to the lower of target/render progress removes any buffered autoplay lead. `lastInputAtMs` is updated and `autoplayVelocity` becomes zero on every accepted input, so autoplay cannot fight reverse input.

Pointer-drag/swipe deltas enter through the same impulse function after conversion to signed pixel motion. The existing travel button uses `beginVisualSeek(..., { to: 1 })`; loader skip uses the same controller-owned seek state. Neither creates another target-progress source.

While `seek` is active, it has precedence over autoplay: `targetProgress` and `renderProgress` both follow the same smoothstep interpolation from `seek.from` to `seek.to`, `autoplayVelocity` remains zero, and input cancels the seek before applying its impulse. At `startedAtMs + durationMs`, both progress values equal `seek.to` exactly and `seek` becomes `null`. Loader skip keeps the existing `800 ms` duration; the travel control uses the existing damped controller path rather than creating an independent animation.

### 5.5 Final pause and rewind

When both `targetProgress` and `renderProgress` reach `1`, the controller sets `autoplayVelocity` to zero and remains stable indefinitely.

A negative impulse at `1` immediately sets `targetProgress < 1`, clears any seek, records the input time, and allows the following render step to move `renderProgress` below `1`. This does not dispatch a reducer event, change browser history, clear commit state, or mutate navigation state.

After the user stops rewinding, the same `850 ms` idle delay and `900 ms` ramp return the visual journey toward `1`. On reaching `1` again, the final selection resumes its stable visual state.

### 5.6 Lifecycle integration without navigation coupling

- Loading and ready phases do not advance the controller.
- First-visit `auto-entry` enables autoplay from `0`.
- Crossing the existing handoff threshold near `0.68` dispatches `AUTO_COMPLETE` once, preserving the frozen application phase progression while autoplay continues visually.
- Reaching `1` during `user-travel` dispatches `TRAVEL_COMPLETE` once, preserving the existing transition into `split`.
- In `split` or `preview`, progress remains at `1` until reverse input. Reverse scrubbing changes only `VisualJourneyState`.
- `commit`, `exit`, and `fallback` reject journey scrub input.
- Returning and reduced-motion visits initialize both controller progress values to `1`; no cinematic traversal is forced.

The selection overlay remains under application-state ownership. During a visual rewind it may be visually and interactively suspended through a presentation wrapper (`aria-hidden` plus `inert`) until `renderProgress >= 0.985`; it remains mounted and returns unchanged at the final chamber. The wrapper does not alter its links, focus handlers, preview rules, or commit logic.

For browser verification, the gateway root exposes read-only attributes such as `data-gateway-visual-progress` and `data-gateway-journey-ready`. These attributes reflect controller output and do not feed back into it.

## 6. Deterministic chapter mapping

`deriveJourneyFrame(progress)` consumes only normalized progress. It does not consume wall-clock time, delta time, input history, pointer position, React phase, or navigation state.

```ts
type JourneyFrame = {
  progress: number;
  chapter: "origin" | "formation" | "passage" | "core" | "emergence";
  chapterProgress: number;
  camera: {
    x: number;
    y: number;
    z: number;
    yaw: number;
    pitch: number;
    roll: 0;
    fov: number;
  };
  density: { near: number; mid: number; far: number };
  material: {
    optical: number;
    pearl: number;
    mineral: number;
    graphite: number;
    spectral: number;
  };
  light: {
    background: number;
    ambient: number;
    key: number;
    edge: number;
    coreContrast: number;
  };
  systems: {
    origin: number;
    formation: number;
    passage: number;
    core: number;
    dissolution: number;
    chamber: number;
  };
  core: {
    contradiction: number;
    cavitySeparation: number;
    boundaryOpening: number;
    internalReveal: number;
  };
  entityEmergence: number;
};
```

Chapter boundaries:

| Progress | Chapter | Structural intent |
|---:|---|---|
| `0.00–0.16` | Origin | bright mineral quiet, low density, first optical disturbance |
| `0.16–0.34` | Formation | large related masses assemble around a readable destination |
| `0.34–0.58` | Spectral Passage | maximum midground travel richness and depth compression |
| `0.58–0.78` | Impossible Core | contradictory depth, reforming cavities, boundary/opening reversal |
| `0.78–1.00` | Emergence | topology separates and thins into the residual final chamber |

Discrete chapter ownership uses half-open ranges: Origin `[0, 0.16)`, Formation `[0.16, 0.34)`, Passage `[0.34, 0.58)`, Core `[0.58, 0.78)`, and Emergence `[0.78, 1]`.

Continuous numeric outputs interpolate between authored boundary keyframes with cubic smoothstep. The discrete `chapter` label may change at a boundary, but camera, lighting, density, material, transform, and visibility values must be continuous at `boundary ± 0.000001`.

Representative deterministic fixtures are required at:

```text
0.00, 0.08, 0.16, 0.25, 0.34, 0.46,
0.58, 0.68, 0.78, 0.90, 1.00
```

The same input must deep-equal the same output regardless of call order or prior values.

## 7. Camera strategy

The camera follows a restrained piecewise-authored dolly derived from the same chapter keyframes. It has:

- smooth forward penetration
- lateral displacement limited to approximately `±0.35 m`
- yaw limited to approximately `±0.02 rad`
- pitch limited to approximately `±0.012 rad`
- zero roll
- FOV kept within `44–47°`
- no elapsed-time movement, shake, bob, or random drift

The desktop path retains the current approximate `z: 12 → -18` range. Coarse pointer retains its shorter endpoint behavior. Reduced motion remains at the settled endpoint.

Camera movement cannot be increased to repair a weak paused frame. If the deep axis or spatial hierarchy is unclear, geometry, material visibility, or lighting must be revised instead.

## 8. One-world spatial architecture

The environment is organized as conceptual systems, not one obvious mesh per item. A system may contain several connected or overlapping surface pieces, cavity skins, internal faces, and edge responses. All systems share the same progress field, palette rhythm, spatial phase convention, and chapter frame.

No object has independent random motion. Traversal environment animation is a function of progress only. Fixed per-system phase offsets may vary form, but cannot introduce unrelated timing.

### 8.1 Deep destination and far field

- present through the entire journey
- formed by offset concave mineral horizons and a central absence rather than a portal, orb, frame, or screen
- keeps one slightly asymmetric deep-space destination readable through formation, passage, and core
- includes restrained distant silhouettes and tiny fixed luminous structures
- changes slowly relative to the midground
- remains as residual depth in the final chamber

### 8.2 Origin field

- broad partial mineral surfaces establish a bright, quiet space
- large negative space dominates over visible geometry
- a subtle refractive discontinuity introduces the shared spectral system
- surfaces fold into the formation field rather than fading as a separate scene

### 8.3 Formation escarpment

- several related partial shells share edges and apparent continuities
- pieces overlap across depth so they read as one architectural-scale mass
- openings align toward the deep destination
- pearl translucency and soft mineral opacity reveal structure selectively

### 8.4 Spectral passage field

- carries most visual sophistication in the `5–12 m` region ahead of the camera
- uses connected folded surfaces, broad cavities, suspended spectral volumes, and partial mineral bodies
- keeps the central/deep destination visible through negative space
- increases richness through changing overlap, compression, scale relation, and visibility rather than flying props
- never becomes repeated frames, rails, rods, speed lines, or evenly distributed glass objects

### 8.5 Impossible core

The core is a structural transformation, not a color/distortion preset. It uses related solid and translucent pieces to create three coupled events:

1. **Contradictory depth:** a nearer concave mass reduces screen scale while translating toward the camera as a farther inner mass expands, causing their apparent depth order to disagree without incorrect depth-buffer hacks.
2. **Nested cavity reformation:** two off-axis cavities align into one continuous void near `0.58`, separate and nest around the destination near `0.68`, then open into different surrounding boundaries by `0.78`.
3. **Boundary-to-opening reversal:** a partial shell rotates and separates from its internal face so a region first read as a solid boundary becomes the rim of a newly revealed negative space.

These transformations are explicit progress curves in `JourneyFrame.core`. Color contrast and refraction support the event but do not create it.

The initial curves are fixed for the first implementation and may be tuned only after browser review without changing their ownership:

```text
contradiction = smoothstep(0.58, 0.66, p) × (1 - smoothstep(0.74, 0.80, p))
cavitySeparation = smoothstep(0.60, 0.70, p)
boundaryOpening = smoothstep(0.64, 0.76, p)
internalReveal = smoothstep(0.60, 0.69, p) × (1 - smoothstep(0.76, 0.86, p))
```

The core system's chapter weight removes its residual geometry during emergence; `cavitySeparation` and `boundaryOpening` may therefore remain at `1` without leaving core props visible at the final state.

### 8.6 Foreground accents

Only two memorable foreground relationships are authored:

- one lateral optical membrane during late formation/early passage
- one large partial refractive surface during the core approach

They remain to one side of the axis, do not repeatedly cross the lens, and do not become the primary velocity cue. Target foreground occupancy is below roughly 25% of the frame outside their brief peak moments.

### 8.7 Dissolution and final chamber

From `0.78`, the same passage/core structures separate, thin, and reveal more negative space. The chamber is not scaled in or swapped in. It is the quiet arrangement of the same spatial language:

- deep destination remains present but softened
- broad residual spectral mass subtly supports the Visuals side
- quieter aligned mineral structure subtly supports the Technical side
- both sides overlap through shared center negative space and material response
- no literal left/right split, center seam, orb, HUD, or portal is introduced
- density reaches its minimum final value while depth remains legible

`entityEmergence` is `0` through progress `0.78`, rises with smoothstep from `0.78` to `0.96`, and remains `1` through the final state. `scene.ts` applies it at the `DualEntitySystem.group` boundary. On rewind the group de-resolves deterministically; at `1` its existing geometry, materials, hover, preview reveal, and selection behavior are fully restored.

## 9. Near, mid, and far composition rules

The midground is the hero:

- most visible structure sits approximately `5–12 m` ahead of the active camera
- midground masses occupy the primary compositional weight without filling the whole frame
- the far destination remains visible through a deliberate negative-space channel
- far forms move/transform at a lower apparent rate than midground forms
- foreground appears only during the two authored accent windows

The systems overlap spatially and crossfade structurally. At no representative frame should the result be readable as a checklist of sphere, plane, shell, blob, and fog primitives.

Three paused frames must be strong enough to function as campaign stills; the target set is passage around `0.46`, core around `0.68`, and emergence around `0.90`, with origin and final chamber also compositionally resolved.

## 10. Material, color, and lighting strategy

### 10.1 Traversal material family

The shared shader utilities support these distinct responses:

- almost invisible angle-dependent optical distortion
- pearlescent translucent body
- soft mineral opaque body
- graphite silhouette/cavity
- crisp refractive edge
- restrained internal cyan/teal/lavender/coral luminance
- angle-dependent interference with narrow spectral range

Materials are assigned by spatial hierarchy. Not every system is transparent, and no default glass material is used as the universal solution.

Transparency budget:

- no more than roughly eight simultaneously visible transparent environment draws
- transparent materials use `depthWrite: false` only where necessary
- opaque/mineral cavity surfaces establish stable depth
- no full-screen transparent layers

### 10.2 Color rhythm

The deterministic palette follows:

```text
bright mineral
→ pearl with restrained lavender/cyan/coral interference
→ deeper teal/graphite spectral passage
→ high-contrast graphite/mineral core
→ bright mineral emergence with residual spectral color
```

Spectral color comes from edge response, internal luminance, and controlled interference. It must not become RGB glitch, neon cyberpunk, rainbow noise, or a generic purple/blue gradient.

### 10.3 Selective lighting

`JourneyFrame.light` drives scene background/fog and a small authored light rig. Lighting selectively reveals silhouettes, refractive edges, internal faces, and cavities. The core darkens substantially but retains the deep destination. Origin and final chamber remain bright.

The scene does not evenly illuminate every surface and does not use bloom/postprocessing to compensate for weak form.

## 11. Performance constraints

- no full-screen raymarch
- no postprocessing dependency
- no texture/GLB dependency for this pass
- no hundreds of transparent meshes
- target environment draw calls: approximately `30` or fewer
- target simultaneously visible transparent environment draws: approximately `8` or fewer
- reuse geometry and materials where meaningful
- use deterministic procedural construction only at initialization
- preserve canvas DPR caps (`1.5` fine, `1.25` coarse)
- dispose every owned geometry and material exactly once
- keep shader loops bounded and avoid high-cost per-fragment noise stacks

Composition takes priority over geometry count. The conceptual systems may use multiple meshes, but each additional draw must contribute to a continuous spatial mass, internal depth, or selective material response.

## 12. Reduced motion, coarse pointer, and selection safety

Reduced-motion users keep the existing short loader and settled final endpoint. The environment receives progress `1` without continuous traversal or elapsed-time animation. Semantic selection remains available.

Coarse-pointer users retain preview-first commit behavior and the shorter camera endpoint. Swipe input, when eligible, enters the same visual controller as wheel input and cannot modify navigation state.

Rewinding is disabled after commit lock acquisition and during exit. Before commit, visual rewind does not:

- dispatch navigation events
- push browser history
- alter `committed`
- infer or choose a division
- mark the gateway session
- change semantic link destinations

## 13. Test-first implementation order

No WebGL environment implementation begins until the pure motion and choreography suites pass.

### 13.1 Progress-controller tests

Create `tests/gateway-journey-controller.test.mjs` first and verify it fails because the module does not exist. Required behaviors:

- initial autoplay advances target and render progress
- progress remains clamped to `[0, 1]`
- positive input advances from the current render/target frontier
- negative input rewinds from the lower render/target frontier
- reverse input removes buffered autoplay lead
- accepted input sets autoplay velocity to zero
- autoplay remains suppressed through `849 ms`
- autoplay ramps partially between `850–1750 ms`
- autoplay returns to full speed at/after `1750 ms`
- progress `1` remains exactly paused across repeated steps
- a negative impulse leaves progress `1`
- idle autoplay resumes after rewinding
- disabled autoplay does not advance the target
- explicit seek state owns skip/travel-button fast-forward
- equivalent elapsed time produces equivalent progress within tolerance

### 13.2 Chapter-mapper tests

Create `tests/gateway-chapter-state.test.mjs` first and verify it fails because the module does not exist. Required behaviors:

- clamping below `0` and above `1`
- exact deterministic output for the eleven representative progress values
- expected dominant chapter at each representative value
- boundary continuity at `0.16`, `0.34`, `0.58`, and `0.78`
- finite normalized density/material/system values
- zero camera roll and restrained camera bounds
- core structural values change independently of saturation/darkness values
- entity emergence remains absent before emergence and reaches `1` at the final state
- final chamber retains nonzero far depth and minimal but nonzero spectral residue

### 13.3 Integration and frozen-contract tests

After the pure suites pass:

- adapt gateway orchestration tests to assert one controller state owner and eligible reverse input phases
- assert the journey controller does not import state, navigation, React, DOM, or Three.js modules
- preserve all navigation/state/progress tests unchanged
- update visual-source assertions that currently require obsolete scene geometry
- retain canvas cleanup, semantic markup, accessibility, fallback, and production-isolation assertions
- test that selection readiness derives from render progress while link destinations and state remain unchanged

TDD order is red → verify expected failure → minimal implementation → green → refactor while green for each pure behavior group.

## 14. Browser and visual review gate

Automated tests and build success are necessary but not sufficient.

Run the actual `/gateway-prototype` route in a browser and capture/inspect:

- Origin near `0.08`
- Formation near `0.25`
- Spectral Passage near `0.46`
- Impossible Core near `0.68`
- Emergence near `0.90`
- Final Chamber at `1.00`
- transition frames near `0.16`, `0.34`, `0.58`, and `0.78`

The read-only `data-gateway-visual-progress` attribute is used to identify captured states. Scrub forward and backward through the same boundaries and compare reconstruction.

Motion verification:

- idle advances continuously
- forward input accelerates progress
- reverse input genuinely rewinds
- autoplay does not fight reverse input
- idle resume begins smoothly after the delay
- final state pauses indefinitely
- reverse leaves the final state
- returning to final restores the usable selection

Interaction verification:

- BM Visuals worldform resolves and de-resolves with emergence
- BM Visuals hover/project-preview reveal remains intact
- BMP Technical monolith resolves and de-resolves with emergence
- BMP Technical interaction remains intact
- keyboard, native links, coarse preview, and reduced motion remain usable

Technical verification:

- no WebGL shader compilation/link errors
- no Three.js warnings caused by the environment
- no runtime console errors
- no Next.js error overlay
- no leaked renderer/material/geometry lifecycle warnings

Self-rejection questions for every captured stage and transition:

1. Is the deep destination readable?
2. Does the midground carry the composition?
3. Do overlapping systems read as one authored world?
4. Does depth come from spatial relationships rather than flying props?
5. Is the core structurally different rather than merely darker or more saturated?
6. Could passage, core, and emergence frames work as campaign stills?

Reject and revise if the result resembles beams, rails, rods, repeated frames, floating props, random glass, generic blobs, procedural object soup, a screensaver, or a generic sci-fi tunnel.

## 15. Verification, checkpoint, and hard stop

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Then create:

`docs/gateway-v2/checkpoints/13-impossible-spectral-environment.md`

The checkpoint records:

- starting commit
- files changed
- old systems removed/replaced
- exact master-progress ownership
- autoplay and reverse behavior
- chapter architecture
- near/mid/far strategy
- camera strategy
- material and color/light strategy
- structural impossible-core behavior
- final chamber continuity
- entity integration
- performance considerations
- browser captures inspected and self-rejection results
- WebGL/console status
- tests, typecheck, lint, and build results
- frozen-file diff confirmation
- known visual weaknesses
- review status `PENDING HUMAN VISUAL REVIEW`

After verification, create an implementation commit on `feat/bm-gateway-tunnel-v2`, for example:

```text
feat: rebuild gateway spectral journey environment
```

Do not merge, create a pull request, integrate production, redesign hero entities, or begin unrelated polish. Stop after the verified implementation, checkpoint, and commit.
