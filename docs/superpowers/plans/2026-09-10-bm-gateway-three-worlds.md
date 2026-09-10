# BM Gateway Three Worlds Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve Tunnel Ver 4 while adding three canonical spatial destinations and a reversible cinematic briefing with explicit Go Back/Continue decisions.

**Architecture:** Keep the existing master journey controller untouched and add a separate normalized briefing controller. Replace binary selection bias with typed per-destination interaction weights consumed by a renamed three-entity scene system; keep canonical content in one adapter over `content/home.ts`, and split neutral selection from semantic briefing presentation.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Three.js, CSS, Node test runner

**Spec:** `docs/superpowers/specs/2026-09-10-bm-gateway-three-worlds-design.md`

## Global Constraints

- Branch from `origin/main` at `da4fc5d6fedc3acc88680a8b4f099c86673aee24`; never merge automatically.
- Do not alter Tunnel Ver 4 journey geometry, palette, lighting dramaturgy, camera journey, autoplay pacing, forward/reverse behavior, idle resume, or deterministic master progress.
- Canonical public labels are exactly `BM VISUAL`, `BM TECH`, and `BMP CREATOR`.
- Canonical routes are exactly `/bm-visual`, `/bm-tech`, and `/creator`.
- Canonical headlines and descriptions must be consumed from existing typed content, not duplicated in Gateway components.
- Selection starts briefing; only the final `CONTINUE →` anchor performs normal navigation.
- No `Math.random()`, automatic Continue, modal briefing, card layout, portal, reactor, giant logo, or new runtime dependency.
- Reduced motion preserves all three destinations, briefing information, Go Back, Continue, touch semantics, and keyboard access.
- Target final neutral chamber cost at 1280×720: at most 38 draw calls and fewer than 65,000 triangles; baseline is 26 draw calls and 45,980 triangles.
- Each behavior change follows red/green TDD and each stable milestone is committed separately.

---

## File responsibility map

- `lib/gateway/destinations.ts`: typed canonical Gateway destination adapter.
- `lib/gateway/state.ts`: semantic phase reducer and selected/preview division ownership.
- `lib/gateway/briefing.ts`: pure briefing controller, timeline frame, and per-destination interaction derivation.
- `lib/gateway/choreography.ts`: combines unchanged journey pose with briefing-only camera/presentation targets.
- `lib/gateway/entities/creatorEntity.ts`: deterministic Construct / Seed scene object.
- `lib/gateway/entities/destinationEntitySystem.ts`: owns all three entities and destination lighting.
- `lib/gateway/entities/visualsEntity.ts`: preserves BM Visual geometry and restores preview visibility.
- `lib/gateway/entities/technicalEntity.ts`: adapts existing BM Tech behavior to explicit interaction weights.
- `lib/gateway/scene.ts`: applies pose to camera/environment/three-entity system and preserves metrics/disposal.
- `components/gateway/SelectionOverlay.tsx`: neutral and preview controls only.
- `components/gateway/BriefingOverlay.tsx`: selected identity, canonical description, Go Back, and Continue.
- `components/gateway/GatewayPrototype.tsx`: lifecycle integration, timeline refs, focus restoration, and navigation lock.
- `components/gateway/GatewayFallback.tsx`: useful canonical three-link non-WebGL experience.
- `app/gateway-prototype/gateway.css`: all Gateway selection/briefing/responsive/reduced-motion presentation.
- `tests/gateway-destinations.test.mjs`: canonical records and public contract.
- `tests/gateway-state.test.mjs`: state transition semantics.
- `tests/gateway-briefing.test.mjs`: deterministic timeline and interaction weights.
- Existing Gateway tests: navigation, presentation, markup, journey, environment, and choreography regressions.

---

### Task 1: Canonical destinations and semantic state

**Files:**
- Create: `lib/gateway/destinations.ts`
- Create: `tests/gateway-destinations.test.mjs`
- Modify: `lib/gateway/state.ts`
- Modify: `tests/gateway-state.test.mjs`

**Interfaces:**
- Produces: `GATEWAY_DIVISIONS`, `GATEWAY_DESTINATIONS`, `getGatewayDestination(division)`.
- Produces: `GatewayDivision = "visuals" | "technical" | "creator"`.
- Produces reducer events `SELECT`, `BRIEFING_COMPLETE`, `GO_BACK`, `GO_BACK_COMPLETE`, `COMMIT`, and existing lifecycle events.
- Produces `previewDivision` and `selectedDivision` fields.

- [ ] **Step 1: Write failing destination and reducer tests**

```js
assert.deepEqual(GATEWAY_DIVISIONS, ["visuals", "technical", "creator"]);
assert.deepEqual(
  GATEWAY_DIVISIONS.map((division) => {
    const item = getGatewayDestination(division);
    return [division, item.publicLabel, item.headline, item.href];
  }),
  [
    ["visuals", "BM VISUAL", "Make the brand worth noticing.", "/bm-visual"],
    ["technical", "BM TECH", "Build systems around real problems.", "/bm-tech"],
    ["creator", "BMP CREATOR", "We build our own things too.", "/creator"],
  ],
);

let state = { ...createGatewayState(false), phase: "split", sessionResolved: true };
state = gatewayReducer(state, { type: "PREVIEW", division: "creator" });
assert.equal(state.phase, "preview");
assert.equal(state.previewDivision, "creator");
state = gatewayReducer(state, { type: "SELECT", division: "creator" });
assert.equal(state.phase, "briefing");
assert.equal(state.selectedDivision, "creator");
state = gatewayReducer(state, { type: "BRIEFING_COMPLETE" });
assert.equal(state.phase, "decision");
state = gatewayReducer(state, { type: "GO_BACK" });
assert.equal(state.phase, "briefing");
state = gatewayReducer(state, { type: "GO_BACK_COMPLETE" });
assert.equal(state.phase, "split");
assert.equal(state.selectedDivision, null);
```

- [ ] **Step 2: Run focused tests and verify red**

Run: `node --test tests/gateway-destinations.test.mjs tests/gateway-state.test.mjs`  
Expected: FAIL because destination exports, Creator, and semantic briefing events do not exist.

- [ ] **Step 3: Implement the canonical adapter and reducer**

```ts
import { HOME } from "@/content/home";

export const GATEWAY_DIVISIONS = ["visuals", "technical", "creator"] as const;
export type GatewayDivision = (typeof GATEWAY_DIVISIONS)[number];

type CanonicalCapability = (typeof HOME.capabilities)[number];
type GatewayDestination = {
  division: GatewayDivision;
  name: string;
  publicLabel: "BM VISUAL" | "BM TECH" | "BMP CREATOR";
  headline: string;
  description: string;
  href: "/bm-visual" | "/bm-tech" | "/creator";
};

const destination = (
  division: GatewayDivision,
  publicLabel: GatewayDestination["publicLabel"],
  capability: CanonicalCapability,
): GatewayDestination => ({
  division,
  name: capability.name.value,
  publicLabel,
  headline: capability.headline.value,
  description: capability.supportingCopy.value,
  href: capability.href.value,
});

export const GATEWAY_DESTINATIONS = {
  visuals: destination("visuals", "BM VISUAL", HOME.capabilities[0]),
  technical: destination("technical", "BM TECH", HOME.capabilities[1]),
  creator: destination("creator", "BMP CREATOR", HOME.capabilities[2]),
} satisfies Record<GatewayDivision, GatewayDestination>;

export const getGatewayDestination = (division: GatewayDivision) =>
  GATEWAY_DESTINATIONS[division];
```

Implement reducer guards so `SELECT` is accepted only from `split`/`preview`, `BRIEFING_COMPLETE` only from `briefing` with a selection, `GO_BACK` only from `briefing`/`decision`, `GO_BACK_COMPLETE` only while reversing a selected briefing, and `COMMIT` only from `decision` for the already selected division. Keep session and failure behavior unchanged.

- [ ] **Step 4: Run focused tests and verify green**

Run: `node --test tests/gateway-destinations.test.mjs tests/gateway-state.test.mjs`  
Expected: PASS.

- [ ] **Step 5: Commit the milestone**

```bash
git add lib/gateway/destinations.ts lib/gateway/state.ts tests/gateway-destinations.test.mjs tests/gateway-state.test.mjs
git commit -m "feat: model three gateway destinations"
```

---

### Task 2: Reversible briefing timeline and three-world interaction weights

**Files:**
- Create: `lib/gateway/briefing.ts`
- Create: `tests/gateway-briefing.test.mjs`
- Modify: `lib/gateway/choreography.ts`
- Modify: `tests/gateway-choreography.test.mjs`

**Interfaces:**
- Consumes: `GatewayDivision`, `GatewayPhase`.
- Produces: `createBriefingTimeline(initialProgress?)`, `seekBriefingTimeline(timeline, target, now, duration)`, `stepBriefingTimeline(timeline, now)`.
- Produces: `deriveBriefingFrame(progress)` with `acknowledgement`, `focus`, `identity`, `description`, and `decision` values.
- Produces: `deriveDestinationInteraction({ previewDivision, selectedDivision, briefingProgress })`.
- Produces: `GatewayPose.interactions`, `briefingProgress`, `briefingCameraX`, `briefingCameraY`, `briefingCameraZ`, `briefingTargetX`, `briefingFov`, and reveal values.

- [ ] **Step 1: Write failing pure timeline and interaction tests**

```js
const neutral = deriveDestinationInteraction({
  previewDivision: null,
  selectedDivision: null,
  briefingProgress: 0,
});
assert.deepEqual(Object.keys(neutral), ["visuals", "technical", "creator"]);
assert.ok(Object.values(neutral).every((value) => Object.values(value).every((n) => n === 0)));

const creatorPreview = deriveDestinationInteraction({
  previewDivision: "creator",
  selectedDivision: null,
  briefingProgress: 0,
});
assert.equal(creatorPreview.creator.hoverWeight, 1);
assert.equal(creatorPreview.visuals.recedeWeight, 0);

const selected = deriveDestinationInteraction({
  previewDivision: null,
  selectedDivision: "technical",
  briefingProgress: 0.75,
});
assert.ok(selected.technical.selectedWeight > 0.7);
assert.ok(selected.visuals.recedeWeight > 0);
assert.ok(selected.creator.recedeWeight > 0);

assert.deepEqual(
  deriveDestinationInteraction({ previewDivision: null, selectedDivision: "visuals", briefingProgress: 0.42 }),
  deriveDestinationInteraction({ previewDivision: null, selectedDivision: "visuals", briefingProgress: 0.42 }),
);
```

Also add boundary/continuity assertions at progress `0`, `0.2`, `0.48`, `0.56`, `0.68`, `0.76`, and `1`, plus a reverse reconstruction loop proving identical frames for identical progress values.

- [ ] **Step 2: Run focused tests and verify red**

Run: `node --test tests/gateway-briefing.test.mjs tests/gateway-choreography.test.mjs`  
Expected: FAIL because the briefing module and new pose inputs do not exist.

- [ ] **Step 3: Implement pure briefing math and update the pose contract**

```ts
export type DestinationInteraction = Record<GatewayDivision, {
  hoverWeight: number;
  selectedWeight: number;
  recedeWeight: number;
  focusWeight: number;
}>;

export type InteractionInput = {
  previewDivision: GatewayDivision | null;
  selectedDivision: GatewayDivision | null;
  briefingProgress: number;
};

export function deriveDestinationInteraction(input: InteractionInput): DestinationInteraction {
  return Object.fromEntries(GATEWAY_DIVISIONS.map((division) => {
    const selected = input.selectedDivision === division ? clamp01(input.briefingProgress) : 0;
    return [division, {
      hoverWeight: input.selectedDivision === null && input.previewDivision === division ? 1 : 0,
      selectedWeight: selected,
      focusWeight: selected,
      recedeWeight: input.selectedDivision !== null && input.selectedDivision !== division
        ? clamp01(input.briefingProgress)
        : 0,
    }];
  })) as DestinationInteraction;
}
```

Use clamped smooth-range helpers for the five authored reveal windows. Keep existing journey calculations byte-for-byte where practical; add briefing offsets after deriving the approved journey camera values and ensure every new offset is zero at briefing progress zero.

- [ ] **Step 4: Run focused and journey regression tests**

Run: `node --test tests/gateway-briefing.test.mjs tests/gateway-choreography.test.mjs tests/gateway-journey.test.mjs tests/gateway-breakthrough.test.mjs`  
Expected: PASS, including unchanged journey reverse reconstruction.

- [ ] **Step 5: Commit the milestone**

```bash
git add lib/gateway/briefing.ts lib/gateway/choreography.ts tests/gateway-briefing.test.mjs tests/gateway-choreography.test.mjs
git commit -m "feat: add reversible gateway briefing timeline"
```

---

### Task 3: Three-world selection, briefing, and fallback semantics

**Files:**
- Create: `components/gateway/BriefingOverlay.tsx`
- Modify: `components/gateway/SelectionOverlay.tsx`
- Modify: `components/gateway/GatewayFallback.tsx`
- Modify: `tests/gateway-markup.test.mjs`
- Modify: `tests/gateway-presentation.test.mjs`

**Interfaces:**
- Consumes: `GATEWAY_DIVISIONS`, `getGatewayDestination`, `GatewayState`, and briefing reveal values.
- Produces: `SelectionOverlay` callbacks `onPreview`, `onClearPreview`, `onSelect`, and `registerDestinationControl`.
- Produces: `BriefingOverlay` callbacks `onGoBack` and `onContinue` with a real anchor event.

- [ ] **Step 1: Replace legacy markup expectations with failing canonical semantic tests**

```js
for (const [label, href] of [
  ["BM VISUAL", "/bm-visual"],
  ["BM TECH", "/bm-tech"],
  ["BMP CREATOR", "/creator"],
]) {
  assert.match(fallbackSource, new RegExp(label));
  assert.match(fallbackSource, new RegExp(`href=.*${href.replace("/", "\\/")}`));
}
assert.doesNotMatch(selectionSource, /BM VISUALS|BMP TECHNICAL/);
assert.match(selectionSource, /<button/);
assert.doesNotMatch(selectionSource, /<Link/);
assert.match(briefingSource, /<Link/);
assert.match(briefingSource, /GO BACK/);
assert.match(briefingSource, /CONTINUE →/);
assert.match(briefingSource, /aria-live|role="region"/);
```

Add checks that the overlay imports the shared destination adapter and does not hardcode any canonical supporting paragraph.

- [ ] **Step 2: Run markup tests and verify red**

Run: `node --test tests/gateway-markup.test.mjs tests/gateway-presentation.test.mjs`  
Expected: FAIL on legacy labels, two-choice fallback, missing Creator, and missing briefing component.

- [ ] **Step 3: Implement selection, briefing, and fallback components**

Render selection controls from `GATEWAY_DIVISIONS`. Fine-pointer click selects immediately; coarse click calls preview when another division is previewed and selects only when the same division is already previewed. Keep only the canonical headline visible during preview.

```tsx
<button
  ref={(node) => registerDestinationControl(division, node)}
  type="button"
  aria-pressed={previewDivision === division}
  onFocus={() => onPreview(division)}
  onClick={() => onSelect(division)}
>
  <span>{destination.publicLabel}</span>
  <span>{previewDivision === division ? destination.headline : null}</span>
</button>
```

`BriefingOverlay` renders the shared name/headline/description, keeps decision controls hidden and inert before the decision phase, and uses `<Link href={destination.href}>CONTINUE →</Link>`. `GatewayFallback` maps the same records to three ordinary links.

- [ ] **Step 4: Run focused tests and verify green**

Run: `node --test tests/gateway-markup.test.mjs tests/gateway-presentation.test.mjs tests/gateway-destinations.test.mjs`  
Expected: PASS.

- [ ] **Step 5: Commit the milestone**

```bash
git add components/gateway/SelectionOverlay.tsx components/gateway/BriefingOverlay.tsx components/gateway/GatewayFallback.tsx tests/gateway-markup.test.mjs tests/gateway-presentation.test.mjs
git commit -m "feat: add three-world gateway briefing UI"
```

---

### Task 4: Orchestrator, focus, coarse pointer, Escape, and navigation

**Files:**
- Modify: `components/gateway/GatewayPrototype.tsx`
- Modify: `lib/gateway/navigation.ts`
- Modify: `lib/gateway/progress.ts`
- Modify: `tests/gateway-navigation.test.mjs`
- Modify: `tests/gateway-state.test.mjs`
- Modify: `tests/gateway-markup.test.mjs`
- Modify: `tests/gateway-presentation.test.mjs`

**Interfaces:**
- Consumes: state events, briefing timeline functions, overlay callbacks, canonical hrefs.
- Produces: `briefingProgress` dataset/state, selection and return handlers, delayed decision transition, focus restoration, and Continue-only commit flow.

- [ ] **Step 1: Add failing integration-contract tests**

Add assertions that:

```js
assert.match(source, /briefingProgress/);
assert.match(source, /BRIEFING_COMPLETE/);
assert.match(source, /GO_BACK_COMPLETE/);
assert.match(source, /previouslySelectedControlRef/);
assert.match(source, /briefingHeadingRef/);
assert.match(source, /event\.key === "Escape"/);
assert.doesNotMatch(source, /COMMIT[^]*handleSelect/);
assert.match(source, /phase === "briefing"|phase === "decision"/);
```

Extend navigation tests so Creator participates in coarse preview checks and so modifier/middle/target/download intents remain native on Continue. Extend presentation fixtures so briefing/decision show both scene and briefing overlay, while fallback ownership remains unchanged.

- [ ] **Step 2: Run focused tests and verify red**

Run: `node --test tests/gateway-navigation.test.mjs tests/gateway-state.test.mjs tests/gateway-markup.test.mjs tests/gateway-presentation.test.mjs`  
Expected: FAIL because the orchestrator still commits directly and lacks the briefing lifecycle.

- [ ] **Step 3: Integrate one briefing controller into the existing RAF loop**

Add one ref and no second `requestAnimationFrame`:

```ts
const briefingRef = useRef(createBriefingTimeline());
const [briefingProgress, setBriefingProgress] = useState(0);
```

On `SELECT`, seek to 1 over 5000 ms (or the reduced-motion duration), dispatch selection, save the source control, and move focus to the briefing heading after it is rendered. During `briefing`, step the timeline; at 1 dispatch `BRIEFING_COMPLETE`. Go Back/Escape seeks to 0; at 0 dispatch `GO_BACK_COMPLETE` and restore the saved destination control.

Keep `isJourneyPhase` limited to phases allowed to own wheel/drag: `auto-entry`, `user-travel`, `split`, and `preview`. Do not register journey input in briefing or decision.

- [ ] **Step 4: Move commit/navigation handling to Continue only**

Build the existing `GatewayNavigationIntent` from the Continue anchor. For an ordinary enhanced primary click, prevent default, acquire the commit lock, dispatch `COMMIT` for `state.selectedDivision`, animate exit, and route with the existing fallback. For keyboard and reduced-motion same-context activation, write the session and allow native navigation. For modified, middle, target, or download activation, preserve native behavior without locking the current page.

- [ ] **Step 5: Run focused tests and verify green**

Run: `node --test tests/gateway-navigation.test.mjs tests/gateway-state.test.mjs tests/gateway-markup.test.mjs tests/gateway-presentation.test.mjs`  
Expected: PASS.

- [ ] **Step 6: Commit the milestone**

```bash
git add components/gateway/GatewayPrototype.tsx lib/gateway/navigation.ts lib/gateway/progress.ts tests/gateway-navigation.test.mjs tests/gateway-state.test.mjs tests/gateway-markup.test.mjs tests/gateway-presentation.test.mjs
git commit -m "feat: orchestrate reversible gateway briefings"
```

---

### Task 5: Deterministic Creator and neutral three-entity system

**Files:**
- Create: `lib/gateway/entities/creatorEntity.ts`
- Create: `lib/gateway/entities/creatorShader.ts`
- Create: `lib/gateway/entities/destinationEntitySystem.ts`
- Delete: `lib/gateway/entities/dualEntitySystem.ts`
- Create: `tests/gateway-entities.test.mjs`
- Modify: `lib/gateway/scene.ts`
- Modify: `tests/gateway-environment.test.mjs`

**Interfaces:**
- Consumes: `DestinationInteraction` and shared `EntityUpdateParams`.
- Produces: `CreatorEntity.tick(deltaSeconds, params, totalTime)` and `dispose()`.
- Produces: `DestinationEntitySystem.tick(deltaSeconds, { progress, interactions, reducedMotion, eventDarkness }, totalTime)`.

- [ ] **Step 1: Add failing architecture and determinism tests**

```js
import { access } from "node:fs/promises";

assert.doesNotMatch(creatorSource, /Math\.random/);
assert.match(systemSource, /VisualsEntity/);
assert.match(systemSource, /TechnicalEntity/);
assert.match(systemSource, /CreatorEntity/);
assert.match(sceneSource, /DestinationEntitySystem/);
assert.doesNotMatch(sceneSource, /DualEntitySystem/);
await assert.rejects(
  access(new URL("../lib/gateway/entities/dualEntitySystem.ts", import.meta.url)),
);
```

Add source-level resource checks for explicit geometry/material arrays and disposal. Add a pure exported `deriveCreatorAssemblyFrame(totalTime, interaction, reducedMotion)` test that samples the same inputs in forward and shuffled order and expects deep equality.

- [ ] **Step 2: Run focused tests and verify red**

Run: `node --test tests/gateway-entities.test.mjs tests/gateway-environment.test.mjs`  
Expected: FAIL because Creator and the neutral entity system do not exist.

- [ ] **Step 3: Implement the Construct / Seed entity**

Use a compact authored hierarchy: one faceted core, three partial shell segments, and five shared-geometry modular pieces. Fixed phase arrays drive orbit/docking; selected weight closes two pieces toward the core and opens the shell segments. Use low/medium segment counts, at most three materials, no texture, and one point light only if it materially improves the inner source.

```ts
const PIECE_PHASES = [0.15, 1.2, 2.35, 3.6, 4.8] as const;
export function deriveCreatorAssemblyFrame(time: number, interaction: EntityInteraction, reduced: boolean) {
  const motionTime = reduced ? 0 : time;
  return PIECE_PHASES.map((phase, index) => ({
    orbit: Math.sin(motionTime * 0.11 + phase) * (0.08 + index * 0.008),
    dock: interaction.selectedWeight * (0.18 + index * 0.025),
    reveal: Math.max(interaction.hoverWeight * 0.55, interaction.selectedWeight),
  }));
}
```

- [ ] **Step 4: Replace the binary owner and integrate scene inputs**

Instantiate Visual, Creator, Technical in `DestinationEntitySystem`, place Creator centrally and slightly deeper, pass each entity its keyed interaction, and retain the existing light-darkness modulation. Update `scene.ts` import, type, tick call, and disposal. Do not modify spectral environment or journey modules.

- [ ] **Step 5: Run focused and scene regression tests**

Run: `node --test tests/gateway-entities.test.mjs tests/gateway-environment.test.mjs tests/gateway-journey.test.mjs tests/gateway-breakthrough.test.mjs`  
Expected: PASS.

- [ ] **Step 6: Commit the milestone**

```bash
git add lib/gateway/entities/creatorEntity.ts lib/gateway/entities/creatorShader.ts lib/gateway/entities/destinationEntitySystem.ts lib/gateway/entities/dualEntitySystem.ts lib/gateway/scene.ts tests/gateway-entities.test.mjs tests/gateway-environment.test.mjs
git commit -m "feat: add deterministic Creator gateway entity"
```

---

### Task 6: Explicit Visual/Tech interaction and cinematic scene focus

**Files:**
- Modify: `lib/gateway/entities/visualsEntity.ts`
- Modify: `lib/gateway/entities/visualsShader.ts`
- Modify: `lib/gateway/entities/technicalEntity.ts`
- Modify: `lib/gateway/entities/technicalShader.ts`
- Modify: `lib/gateway/entities/destinationEntitySystem.ts`
- Modify: `lib/gateway/scene.ts`
- Modify: `tests/gateway-entities.test.mjs`
- Modify: `tests/gateway-choreography.test.mjs`

**Interfaces:**
- Consumes: keyed `hoverWeight`, `selectedWeight`, `recedeWeight`, `focusWeight`.
- Produces: per-entity selected/recede transforms and visually legible BM Visual previews.

- [ ] **Step 1: Add failing tests for explicit weights and preview visibility contract**

```js
assert.match(visualSource, /selectedWeight/);
assert.match(visualSource, /recedeWeight/);
assert.match(visualShader, /uSelected/);
assert.match(visualShader, /neutralPreview/);
assert.doesNotMatch(visualSource, /selectionBias/);
assert.doesNotMatch(technicalSource, /selectionBias/);
```

Add choreography tests asserting each selected division gets the same left-authority target at progress 1, non-selected entities receive depth/falloff, and briefing zero reproduces the exact neutral pose.

- [ ] **Step 2: Run focused tests and verify red**

Run: `node --test tests/gateway-entities.test.mjs tests/gateway-choreography.test.mjs`  
Expected: FAIL on scalar entity inputs and missing selected preview uniforms.

- [ ] **Step 3: Adapt BM Visual without rebuilding it**

Keep existing meshes and textures. Drive shell separation with `max(hoverWeight * 0.65, selectedWeight)`, set a small neutral preview floor near `0.08`, raise hover preview toward `0.62`, selected preview toward `0.95`, reduce inner-atmosphere occlusion as selection rises, and keep the vignette/dissolve that prevents flat-screen rectangles. Use `depthTest: true`, `depthWrite: false`, explicit render order inside the cavity, and no new textures.

- [ ] **Step 4: Adapt BM Tech and Creator to the same contract**

Map existing casing and logic-plane response to explicit hover/selected weights. Use recede weight for depth, scale, and opacity authority rather than setting visibility false during animated briefing. Keep all reduced-motion transforms static.

- [ ] **Step 5: Apply selected camera/object composition in the scene**

At full briefing focus, move the chosen entity toward left-side authority, enlarge it modestly, move the other two deeper and darker, update camera FOV/target without a hard cut, and leave the spectral environment continuous. Use the pose's pure targets so reversing briefing reconstructs neutral exactly.

- [ ] **Step 6: Run focused and full Gateway math tests**

Run: `node --test tests/gateway-entities.test.mjs tests/gateway-choreography.test.mjs tests/gateway-environment.test.mjs tests/gateway-journey.test.mjs tests/gateway-breakthrough.test.mjs`  
Expected: PASS.

- [ ] **Step 7: Commit the milestone**

```bash
git add lib/gateway/entities/visualsEntity.ts lib/gateway/entities/visualsShader.ts lib/gateway/entities/technicalEntity.ts lib/gateway/entities/technicalShader.ts lib/gateway/entities/destinationEntitySystem.ts lib/gateway/scene.ts tests/gateway-entities.test.mjs tests/gateway-choreography.test.mjs
git commit -m "feat: choreograph three-world cinematic focus"
```

---

### Task 7: Responsive visual hierarchy and reduced-motion presentation

**Files:**
- Modify: `app/gateway-prototype/gateway.css`
- Modify: `app/gateway-prototype/page.tsx`
- Modify: `components/gateway/SelectionOverlay.tsx`
- Modify: `components/gateway/BriefingOverlay.tsx`
- Modify: `tests/gateway-markup.test.mjs`

**Interfaces:**
- Consumes: data attributes for phase, selected/preview division, briefing reveal, coarse pointer, and reduced motion.
- Produces: neutral spatial labels, right-side editorial briefing, decision reveal, narrow layout, focus indication, and motion-reduction overrides.

- [ ] **Step 1: Add failing CSS/metadata contract tests**

Assert three division selectors, briefing-region styles, decision hidden/visible states, `:focus-visible`, coarse-pointer rules, `prefers-reduced-motion`, and narrow viewport rules exist. Update metadata from the two-world prototype description to the canonical three-world Gateway description.

- [ ] **Step 2: Run markup tests and verify red**

Run: `node --test tests/gateway-markup.test.mjs`  
Expected: FAIL because current CSS assumes two left/right divisions and legacy copy.

- [ ] **Step 3: Rebuild only the destination-layer CSS**

Keep loader, travel cue, canvas, tunnel colors, and lifecycle stacking intact. Replace binary ratio rules with authored positions for Visual, Creator, and Tech; keep labels compact and avoid equal-column/grid-card treatment. Add right-side briefing typography with staged opacity/transform custom properties and controls that are absent/inert before decision.

At max-width 1023px, reduce label size and spatial offsets while keeping all three selectable. At max-width 640px, stack the briefing copy into a lower/right safe region and prevent entity/label cropping. Under coarse pointer, expose a clear second-tap selection affordance. Under reduced motion, remove long transforms/animations while preserving visible content and controls.

- [ ] **Step 4: Run markup tests and full static checks**

Run: `node --test tests/gateway-markup.test.mjs tests/gateway-presentation.test.mjs`  
Expected: PASS.

- [ ] **Step 5: Commit the milestone**

```bash
git add app/gateway-prototype/gateway.css app/gateway-prototype/page.tsx components/gateway/SelectionOverlay.tsx components/gateway/BriefingOverlay.tsx tests/gateway-markup.test.mjs
git commit -m "feat: style cinematic three-world destination layer"
```

---

### Task 8: Full verification, visual review, performance report, and delivery

**Files:**
- Create: `docs/gateway-three-worlds/verification.md`
- Modify only if verification finds defects: files owned by Tasks 1–7 and their matching tests.

**Interfaces:**
- Consumes: completed feature and browser instrumentation datasets.
- Produces: durable before/after performance and visual/accessibility verification record.

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit 0; existing journey/reverse tests remain green.

- [ ] **Step 2: Start the production-like local build and verify browser health**

Run: `npm run dev` (use Webpack only if the isolated dependency layout requires it).  
Verify `/gateway-prototype` loads, has meaningful content, has no framework error overlay, and produces no WebGL/runtime console errors.

- [ ] **Step 3: Review every approved visual state**

Capture and inspect at 1280×720: deep tunnel, Impossible Core, chamber arrival, neutral three-world chamber, all three hover/focus states, BM Visual briefing mid-transition, all three decision states, and Go Back reverse. Confirm tunnel composition remains perceptually intact and BM Visual project fragments are visibly perceptible on hover and selection.

- [ ] **Step 4: Review input and accessibility modes**

At a coarse/touch-emulated viewport, verify first tap previews and second activation briefs Creator. With reduced motion, verify all three choices, canonical briefing copy, Go Back, and Continue remain available without long camera movement. At a narrow/mobile viewport, verify no awkward entity or typography cropping. Keyboard-test focus preview, activation, announcement, logical decision order, Escape during timed briefing, Go Back focus restoration, and receded-control tab exclusion.

- [ ] **Step 5: Verify navigation contracts**

From decision state, verify ordinary Continue performs commit/exit then reaches the canonical route. Verify keyboard activation, Cmd/Ctrl-click, Shift-click, middle-click, target behavior, download behavior, duplicate activation lock, `bmGatewaySeen`, and location fallback contracts remain correct without altering selection behavior.

- [ ] **Step 6: Record performance before/after and known weaknesses**

Write `docs/gateway-three-worlds/verification.md`. Start the performance section with the exact baseline sentence `Baseline (1280×720 neutral): 26 draw calls; 45,980 triangles; refraction inactive.` Then record the actual final draw-call count, triangle count, and refraction state read from the canvas dataset at the same viewport. Record test/typecheck/lint/build results, reviewed viewports, BM Visual visibility result, navigation/accessibility result, and concrete known remaining weaknesses (write `None observed` only if verification found none).

- [ ] **Step 7: Commit verification fixes and report**

```bash
git add docs/gateway-three-worlds/verification.md
git commit -m "test: complete three-world gateway verification"
```

- [ ] **Step 8: Push and open a pull request without merging**

```bash
git push -u origin feat/bm-gateway-three-worlds
gh pr create --base main --head feat/bm-gateway-three-worlds --title "feat: add three-world Gateway briefing" --body "## Summary
- add the canonical BM Visual, BM Tech, and BMP Creator destination chamber
- add reversible cinematic briefings with explicit Go Back and Continue decisions
- preserve Tunnel Ver 4 journey, navigation, fallback, and reverse-reconstruction contracts

## Verification
See docs/gateway-three-worlds/verification.md for automated results, browser states, accessibility coverage, and the before/after performance comparison.

Human visual review is required before merge."
```

Do not merge. Obtain the Vercel Preview URL from the PR checks/deployment and include it in the delivery report.
