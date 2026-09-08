# BM Gateway V2 Cinematic Signature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved spectral tunnel into a more authored cinematic journey while preserving deterministic reversible progress, final heroes, geometry generators, and frozen gateway contracts.

**Architecture:** Extend the existing pure journey mapper with a cinematic autoplay multiplier and progress-only rendering envelopes. Reuse existing environment geometry and add only shared-buffer far echoes. Keep environment finishing inside its material/render path so hero shaders and interaction remain untouched.

**Tech Stack:** TypeScript, Three.js r185, GLSL, Next.js 16, Node test runner.

**Spec:** `docs/superpowers/specs/2026-09-07-gateway-cinematic-signature-design.md`

## Global Constraints

- Do not edit `lib/gateway/state.ts`, `lib/gateway/navigation.ts`, `lib/gateway/progress.ts`, `app/page.tsx`, or `lib/gateway/entities/`.
- Do not replace or rebuild environment geometry generators.
- Raw wheel velocity changes target progress only; rendering never consumes raw input velocity.
- Equal normalized progress and quality settings must reconstruct equal environment transforms, uniforms, and finishing parameters in both directions.
- Preserve scroll sensitivity, 850 ms idle suppression, 900 ms resume ramp, final pause, rewind, selection state, and URL semantics.
- Preserve desktop DPR cap 1.5 and coarse-pointer cap 1.25.
- No full-screen raymarch, global RGB split, motion blur, depth of field, particles, rails, portal, or random placement.
- Work in atomic TDD cycles and update `docs/gateway-v2/AUTO-CONTINUE.md` after each stable task.

---

### Task 1: Pure cinematic profile

**Files:**
- Create: `lib/gateway/journey/cinematicProfile.ts`
- Modify: `lib/gateway/journey/controller.ts`
- Modify: `lib/gateway/journey/chapterState.ts`
- Test: `tests/gateway-journey.test.mjs`

**Interfaces:**
- Produces: `cinematicSpeedMultiplier(progress: number): number`.
- Produces: `deriveCinematicFrame(progress: number): CinematicFrame` with `opticalEnergy`, `reveal`, `coreEvent`, `release`, `destination`, `exposure`, `haze`, and `glow`.
- Consumes: the existing `autoplaySpeedMultiplier` as the checked-out baseline.

- [ ] **Step 1: Write failing tests with hand-derived literals**

Add tests asserting profile values at `0, .15, .35, .55, .72, .80, .90, 1`, total target travel `25.877 ± .02` seconds, strict continuity at every stop/event bound, and exact forward/reverse/shuffled reconstruction. Assert `impulseJourney` remains `pixels × .00075` and no visual frame input other than progress exists.

- [ ] **Step 2: Run focused journey tests and verify RED**

Run: `node --test tests/gateway-journey.test.mjs`

Expected: failure because `cinematicProfile.ts`, `cinematicSpeedMultiplier`, and cinematic frame values do not exist.

- [ ] **Step 3: Implement the pure profile**

Use smoothstep interpolation over the spec stops:

```ts
const speedStops = [[0, .70], [.15, .74], [.35, .78], [.55, .86], [.72, 1], [.80, 1], [.90, .64], [1, .58]] as const;

export function deriveCinematicFrame(progress: number) {
  const p = clamp01(progress);
  const authored = cinematicSpeedMultiplier(p);
  return {
    opticalEnergy: clamp01((authored - .58) / .42) * (.76 + .24 * coreEnvelope),
    reveal: compactEnvelope(.26, .36, .44, p),
    coreEvent: compactEnvelope(.60, .75, .82, p),
    release: smoothRange(.80, .98, p),
    destination: compactEnvelope(.26, .56, .90, p),
    exposure: 1 - passageDepth * .16 + release * .12,
    haze: passageDepth * .55 - release * .22,
    glow: opticalEnergy * (.35 + coreEvent * .30),
  };
}
```

Multiply autoplay integration by `cinematicSpeedMultiplier(targetProgress)`. Do not alter `impulseJourney`, render damping, idle timing, seek logic, or endpoint logic.

- [ ] **Step 4: Run focused journey tests and verify GREEN**

Run: `node --test tests/gateway-journey.test.mjs`

- [ ] **Step 5: Update continuation state and commit**

Commit: `feat: author cinematic gateway rhythm`

---

### Task 2: Reversible hero events and restrained density

**Files:**
- Modify: `lib/gateway/environment/spectralEnvironment.ts`
- Modify: `tests/gateway-environment.test.mjs`

**Interfaces:**
- Consumes: `CinematicFrame` from Task 1.
- Produces: `SpectralEnvironment.update(frame, cinematic, cameraZ, fog)` and stable environment metrics.

- [ ] **Step 1: Write failing real-scene tests**

Assert Reveal exposes a deeper destination gap at `.36`; Core increases actual depth disagreement at `.75`; Release expands the existing lateral opening at `.91`; primary geometry object identity and buffer versions are unchanged; far echoes use no more than three shared geometry identities; transforms reconstruct exactly in reverse and shuffled samples; continuity holds around `.26, .36, .44, .60, .75, .80, .82, .90, .91, .98`.

- [ ] **Step 2: Run focused environment tests and verify RED**

Run: `node --test tests/gateway-environment.test.mjs`

Expected: missing cinematic argument/events/echo metrics.

- [ ] **Step 3: Implement event transforms on existing masses**

Apply compact, bounded offsets only:

```ts
vaultX += side * cinematic.reveal * revealOffset;
coreDistance += first ? cinematic.coreEvent * 1.2 : -cinematic.coreEvent * 1.8;
coreRotation += side * cinematic.coreEvent * .14;
openingX += side * cinematic.release * releaseOffset;
```

Add at most three subordinate far echoes as `Mesh(existingFarGeometry, newEnvironmentMaterial)` with fixed transforms, behind and partially occluded by the primary field. Track geometry ownership so shared geometry is disposed once and each new material once.

- [ ] **Step 4: Run focused environment tests and verify GREEN**

Run: `node --test tests/gateway-environment.test.mjs`

- [ ] **Step 5: Update continuation state and commit**

Commit: `feat: stage reversible gateway hero events`

---

### Task 3: Cinematic environment lighting and restrained finish

**Files:**
- Modify: `lib/gateway/environment/spectralMaterial.ts`
- Modify: `lib/gateway/environment/spectralPalette.ts`
- Modify: `lib/gateway/environment/spectralEnvironment.ts`
- Modify: `lib/gateway/scene.ts`
- Test: `tests/gateway-environment.test.mjs`

**Interfaces:**
- Consumes: `CinematicFrame.opticalEnergy`, `destination`, `exposure`, `haze`, and `glow`.
- Produces: environment-only uniforms `uOpticalEnergy`, `uDestination`, `uExposure`, `uHaze`, `uGlow`; hero shaders remain unchanged.

- [ ] **Step 1: Write failing deterministic uniform tests**

For representative progress points, assert all new uniforms are finite, bounded, reconstruct exactly, and differ meaningfully between Origin, Passage, Core, and Emergence. Assert far-field luminance is quieter than midground while the destination rim remains brighter than surrounding far depth at primary-passage samples.

- [ ] **Step 2: Run focused environment tests and verify RED**

Run: `node --test tests/gateway-environment.test.mjs`

Expected: uniforms and depth hierarchy do not exist.

- [ ] **Step 3: Implement shader-level hierarchy**

Drive interference width, reflected-edge energy, graphite recess, deep-destination luminance, haze, and highlight compression from uniforms set directly from displayed progress. Use normal/local coordinates and distance; never finite-difference progress or read wheel data. Use a restrained filmic curve such as:

```glsl
color *= uExposure;
color = color / (color + vec3(.82));
color += spectralEdge * uOpticalEnergy * .08;
color = mix(color, uFogColor, depthHaze * uHaze);
```

Keep coral/amber confined to narrow reflection windows. Do not modify hero materials or scene lights that determine hero appearance.

- [ ] **Step 4: Evaluate optional isolated glow**

Capture baseline paused stills and frame timings first. Retain a half-resolution environment-only glow only if it materially improves event stills, maintains correct depth behind heroes, stays within four fullscreen draws, is disabled for coarse/reduced profiles, and adds no more than 20% median frame time on the same viewport/DPR. Otherwise record it as omitted and keep the crisp shader finish.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `node --test tests/gateway-environment.test.mjs tests/gateway-journey.test.mjs`

- [ ] **Step 6: Update continuation state and commit**

Commit: `feat: add cinematic gateway light hierarchy`

---

### Task 4: Browser, performance, and final checkpoint

**Files:**
- Modify: `docs/gateway-v2/AUTO-CONTINUE.md`
- Create: `docs/gateway-v2/checkpoints/15-cinematic-signature-pass.md`
- Modify tests only if a verified regression requires a test-first fix.

**Interfaces:**
- Consumes the complete cinematic pass.
- Produces a stable final commit and `STATUS: DONE` only when every gate passes.

- [ ] **Step 1: Run full automated verification**

Run:

```bash
node --test tests/*.test.mjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js
node node_modules/next/dist/bin/next build --webpack
git diff 5a09d5e -- lib/gateway/state.ts lib/gateway/navigation.ts lib/gateway/progress.ts app/page.tsx lib/gateway/entities
```

Expected: all commands exit 0 and frozen diff is empty.

- [ ] **Step 2: Run browser journey verification**

At `http://localhost:3107/gateway-prototype`, measure fresh-visit chapter times and exercise forward scrub, reverse scrub, idle resume, final pause, reverse from final, Visuals hover, Technical selection, reduced motion, coarse viewport and resize. Confirm selection/URL survive visual rewind and no error overlay, console error or shader error appears.

- [ ] **Step 3: Inspect campaign stills and transitions**

Capture/inspect Origin, Formation, Reveal `.36`, Passage, Core `.75`, Release `.91`, and Final. Also inspect `.26/.44`, `.60/.82`, and `.80/.98` boundary neighborhoods in forward and reverse order. Reject and iterate if destination clarity, contrast, event readability, or hero dominance fails.

- [ ] **Step 4: Measure performance**

At the same desktop viewport/DPR, compare median frame time, draw calls, submitted triangles, refraction capture size, and approximate render-target memory with baseline checkpoint values. Disable optional glow if it violates the budget.

- [ ] **Step 5: Write checkpoint and finalize continuation state**

Document exact timing before/after, velocity curve, lighting/color, density, events, retained/omitted post stack, performance, reverse verification, WebGL status, files changed, and weaknesses. Set `STATUS: DONE` only after every completion gate passes.

- [ ] **Step 6: Commit final stable checkpoint**

Commit: `docs: checkpoint gateway cinematic signature pass`
