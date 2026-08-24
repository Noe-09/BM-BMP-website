# BM Gateway Tunnel Prototype — Design Specification

Date: 2026-08-24
Status: Approved design, prototype only
Scope: BM parent gateway between BM Visuals and BMP Technical

## 1. Purpose

Build a standalone prototype for the future BM parent gateway. The gateway is a short architectural threshold that introduces the BM ecosystem and lets the visitor choose between two divisions:

- **BM Visuals** — Creative / Digital Experience
- **BMP Technical** — Technology / AI Systems

The gateway must not become a third marketing homepage. Its job is to create anticipation, establish that both divisions belong to one BM system, preview the personality of each division, and route the visitor into the selected world.

The prototype must remain isolated from the current BM Visuals production experience until the concept proves itself. BM Visuals remains locked except for real bugs and small metadata maintenance.

## 2. Core Concept

The gateway is a **Physical Tunnel / Corridor** expressed as a **Brutalist Architectural** installation.

Target feeling:

> Museum architecture × fashion set × technology pavilion.

The experience should feel like an architectural brand installation, not a game level, sci-fi lobby, or WebGL showcase.

Core spatial narrative:

**COMPRESSED → DEEP → OPEN → SPLIT**

Core interaction narrative:

**LOAD → ENTER → CHOOSE**

## 3. First-Visit Journey

### 3.1 Loader

The first visit begins on a near-black charcoal frame. The visitor is already inside the hidden entrance chamber; the loader is an overlay, not a separate page.

Primary content:

- `BM`
- `INITIALIZING`
- numeric counter `00 → 100`

Do not show a `%` symbol.

The counter is semi-real. It should reflect scene and critical-resource readiness while being visually smoothed. A minimum display duration of approximately 2.3–2.5 seconds prevents the experience from disappearing instantly on fast machines.

The display may progress through values such as:

`00 → 08 → 19 → 37 → 58 → 76 → 89 → 96 → 100`

but the visible number should animate continuously rather than jump mechanically.

While progress increases, subtle architectural clues emerge behind the overlay:

- one distant vertical light slit,
- a ceiling edge,
- a large concrete mass,
- barely visible floor reflection.

At `100`:

1. `INITIALIZING` disappears.
2. `BM` holds for roughly 200–300 ms.
3. The line `TWO WORLDS. ONE SYSTEM.` appears briefly.
4. The loader transitions directly into the already-mounted tunnel scene.

The loader may offer `SKIP →` after roughly 1.2–1.5 seconds. Skip performs a fast-forward choreography of approximately 700–900 ms rather than teleporting abruptly.

### 3.2 Auto Entry

After the loader, the camera advances automatically for about 1.5–2 seconds.

The BM mark should feel like part of the entrance threshold. It may scale past the camera, disappear behind an architectural plane, or otherwise become part of the spatial transition rather than simply fading out.

The initial corridor is neutral BM territory:

- charcoal / graphite,
- matte concrete,
- blackened-metal joints used sparingly,
- neutral-white architectural slit lighting,
- no Visuals imagery,
- no Technical UI language,
- no HUD, code, or decorative particles.

The user does not control the camera during this opening section.

### 3.3 Control Transfer

The auto movement decelerates into a user-controlled section.

A small prompt appears:

`MOVE FORWARD`

Desktop input:

- mouse wheel,
- trackpad,
- drag if useful.

Mobile input:

- vertical swipe.

Input must drive a damped target-progress system rather than mapping wheel delta directly to camera position. The camera should feel like a controlled architectural dolly with mass.

The user-controlled portion should represent roughly the final 25–35% of the travel distance before the split.

## 4. Corridor Architecture

### 4.1 Geometry

The corridor should be constructed from a small number of large monolithic planes and masses, not detailed environmental assets.

Use approximately 5–7 major architectural masses and keep the overall mesh count small.

The corridor should not be a normal rectangular hallway. Large planes may tilt slightly, around 2–5 degrees, to strengthen perspective without becoming chaotic.

The ceiling starts relatively compressed and opens gradually as the camera moves forward.

### 4.2 Materials

Primary material:

- smooth cast-concrete / mineral surface,
- graphite-charcoal,
- high roughness,
- very low reflection,
- subtle grain only if required.

Secondary material:

- blackened metal,
- used only for joints, thresholds, or structural strips.

Floor:

- slightly darker than walls,
- only enough reflectivity to catch light slits,
- never mirror-like.

Avoid photoreal concrete cracks, grunge, chrome, or excessive texturing.

### 4.3 Lighting

Lighting should define the architecture more than texture does.

Primary light sources are concealed architectural cuts:

- vertical wall slits,
- ceiling cuts,
- floor seams,
- hidden sources behind monoliths.

The early BM corridor uses neutral white light, approximately a 4300K–5000K visual feel.

No visible bulbs, neon tubes, bloom-heavy glow, or cyberpunk color language.

Very light atmospheric haze may be used only if required to reveal light volume. It should never read as fog.

### 4.4 Spatial Moments

The corridor contains four main moments:

1. **Entry Frame** — a large concrete frame establishes the formal threshold into BM.
2. **Light Cut** — a strong architectural light cut briefly resets the visual rhythm.
3. **Central Monolith Reveal** — a large distant central mass initially appears to be the endpoint.
4. **Split Chamber** — the corridor opens around the monolith into two passages.

## 5. Division Identity Leak

The two division identities should begin to appear subtly during approximately the final 10–15% of the approach. The visitor should feel the difference before the labels become explicit.

### BM Visuals side

- softer and broader illumination,
- slightly warmer neutral tone,
- pale mineral or off-white planes,
- gallery / paper-like spatial feeling,
- softer surface expansion.

Do not show project screenshots in the corridor.

### BMP Technical side

- colder neutral light,
- sharper edges,
- more exact subdivisions,
- thinner light cuts,
- more precise structural separation.

Do not use HUDs, dashboards, code rain, circuit-board textures, floating numbers, or generic AI imagery.

Both sides remain part of one BM architectural language.

## 6. Central Monolith

The split chamber is organized around a central monolith representing the parent BM system.

The monolith should carry only:

`BM`

Do not add service lists, statistics, pseudo-technical labels, or unnecessary metadata.

The spatial message is:

> One BM core, two divisions.

## 7. Selection Scene

### 7.1 Neutral State

At the final decision point the camera settles into a balanced composition. After a short visual hold of about 300 ms, division typography appears.

Left:

**BM VISUALS**  
`Creative / Digital Experience`

Right:

**BMP TECHNICAL**  
`Technology / AI Systems`

The default state is visually neutral. Neither division is recommended or emphasized.

The split behaves conceptually as **50 / 50**.

Introductory copy is hidden until preview.

### 7.2 BM Visuals Preview

On pointer hover, keyboard focus, or the equivalent preview state:

- Visuals expands from approximately 50% to 62%,
- Technical compresses to approximately 38%,
- the central monolith shifts slightly,
- the camera biases left very subtly,
- the Visuals passage opens,
- softer light becomes more prominent,
- Technical remains visible but lower in contrast.

Typography scales only slightly, approximately 1.06–1.10×.

Reveal copy line by line:

**BM VISUALS**  
`Creative / Digital Experience`

**Digital identities**  
**with motion, story and distinction.**

`ENTER VISUALS →`

### 7.3 BMP Technical Preview

The inverse preview uses approximately **38 / 62**.

Technical expansion should feel more structural and precise rather than being a perfect mirrored copy of the Visuals animation.

Reveal:

**BMP TECHNICAL**  
`Technology / AI Systems`

**AI systems, product logic**  
**and technical execution.**

`ENTER TECHNICAL →`

### 7.4 Preview Timing

Suggested timing:

- architecture expansion: 450–650 ms,
- camera bias: 500–700 ms,
- first intro line: ~160 ms after preview begins,
- second line: +110 ms,
- CTA: +120 ms.

Preview animations must be interruptible. Rapid movement from one division to the other must not queue animations or produce overlapping text states.

Camera motion remains restrained. Avoid meaningful head rotation or game-like look controls. Main expansion comes from architecture rather than camera movement.

## 8. Cursor

Desktop may reuse the existing BM contextual-cursor system.

Preview labels:

- `ENTER VISUALS ↗`
- `ENTER TECHNICAL ↗`

The cursor remains small and secondary. Do not use a large magnetic blob or let the cursor become the main interface.

No custom cursor on touch devices.

## 9. Commit / Exit Transition

Once the user selects a division, transition state becomes committed and further hover/click input is locked.

### BM Visuals commit

1. Cursor label disappears.
2. Technical dims quickly.
3. Visuals copy collapses back toward the division title.
4. Central monolith clears the camera path.
5. Visuals expands from the preview ratio to the full viewport.
6. Camera accelerates through the Visuals passage.
7. Light increases toward the destination frame.
8. Navigation continues into BM Visuals.

The final gateway frame should eventually share visual continuity with the first frame of BM Visuals. Avoid a black cut when possible.

### BMP Technical commit

The same system applies, but the passage remains darker, sharper, and more structural. Geometry may align into more exact planes during the exit.

During the prototype phase, BMP Technical does not require a complete website. The exit may terminate on a simple prototype destination or controlled end-state.

## 10. Repeat Visits

First visit in a browser session:

`FULL LOADER → AUTO ENTRY → USER TRAVEL → SPLIT`

After successful entry, store a session-level flag such as:

`bmGatewaySeen = true`

Returning to the gateway during the same session should use a shortened flow:

`BM flash ~0.4–0.7s → ready scene → split`

Do not force the full loader again on browser Back or normal return navigation.

A new browser session may replay the full sequence.

## 11. Mobile and Tablet

### Mobile

Mobile is not a scaled-down desktop tunnel.

Flow:

`loader → shorter auto push → split → tap preview → enter`

Camera travel is reduced by approximately 30–40%.

Selection is two-step because hover does not exist:

1. Tap a division to preview.
2. Tap the CTA to enter.

A selected division may occupy approximately 65–70% of the viewport while the other remains visible.

No custom cursor or pointer parallax.

### Tablet

Landscape may retain a desktop-like left/right composition.

Portrait may use a more flexible overlay composition while preserving the left/right spatial concept. Typography must not be squeezed merely to maintain a strict 50/50 layout.

### Orientation changes

Do not reload the scene when orientation changes. Resize the renderer, update camera aspect, and recompute overlay layout.

If an orientation change occurs during a complex transition, prioritize stability over perfect continuity and snap to a safe state if required.

## 12. Reduced Motion

`prefers-reduced-motion: reduce` changes the choreography rather than merely slowing it down.

Reduced-motion flow:

`short BM loader → static architectural reveal → split`

Remove or substantially reduce:

- long camera travel,
- camera bias,
- spatial acceleration,
- large architectural movement.

Retain clear selection through contrast, modest width changes, and text reveal.

## 13. WebGL and JavaScript Fallbacks

The WebGL scene is progressive enhancement.

Canvas should be `aria-hidden="true"`.

All essential information and navigation remain in semantic DOM.

If WebGL renderer creation fails, show a premium DOM/CSS split screen with:

- `BM`
- `TWO WORLDS. ONE SYSTEM.`
- BM Visuals title, descriptor, preview copy, and link
- BMP Technical title, descriptor, preview copy, and link

Do not show technical error messaging to the visitor.

If critical scene initialization does not complete within approximately 8–10 seconds, abandon the 3D path and enter the DOM fallback rather than holding the visitor indefinitely near `95–99`.

If JavaScript fails or is disabled, server-rendered links to both destinations must remain available.

Navigation always takes priority over animation. If an enhanced exit fails, perform normal navigation to the valid destination.

## 14. Technical Strategy

Prototype stack:

- Next.js
- TypeScript
- raw Three.js
- DOM/CSS overlays

Do not add React Three Fiber, Drei, GSAP, Lenis, Blender assets, or post-processing libraries for prototype V1 unless a demonstrated technical blocker makes them necessary.

The current project already includes Three.js, so raw Three.js adds the least new complexity.

### Rendering responsibilities

Three.js handles:

- corridor geometry,
- central monolith,
- camera,
- lighting,
- split architecture,
- architectural hover expansion,
- entry / exit spatial movement.

DOM/CSS handles:

- loader,
- counter,
- typography,
- descriptions,
- CTA,
- semantic links,
- keyboard focus,
- responsive overlay layout,
- accessibility,
- fallback UI.

## 15. Component Boundaries

Conceptual architecture:

```text
GatewayPrototype
│
├── LoaderOverlay
├── TunnelCanvas
│   ├── CameraRig
│   ├── EntryChamber
│   ├── Corridor
│   ├── LightCut
│   ├── CentralMonolith
│   └── SplitArchitecture
├── ProgressController
├── SelectionOverlay
│   ├── VisualsChoice
│   └── TechnicalChoice
├── GatewayCursor
└── AccessibilityFallback
```

Keep responsibilities isolated. Do not build the entire scene, state machine, overlay, and navigation into one giant client component.

## 16. State Model

Use one explicit top-level interaction state:

```text
LOADING
  ↓
READY
  ↓
AUTO_ENTRY
  ↓
USER_TRAVEL
  ↓
SPLIT
  ↓
PREVIEW_VISUALS | PREVIEW_TECHNICAL
  ↓
COMMIT
  ↓
EXIT
```

All rendering layers derive from this shared state.

Do not let Three.js and DOM maintain independent notions of the active division.

A shared `selectionBias` may represent preview direction:

- `-1` = Visuals
- `0` = Neutral
- `+1` = Technical

Three.js uses it for architecture, light, monolith shift, and camera bias. DOM uses it for layout ratio, typography, copy visibility, CTA, and cursor label.

## 17. Camera Progress Model

Do not map wheel input directly to camera coordinates.

Use three conceptual values:

- `inputProgress`
- `targetProgress`
- `renderedProgress`

Input updates the target. Each frame damps rendered progress toward the target. Auto-entry and manual travel should use the same progress/controller architecture instead of separate camera systems.

Clamp progress so scroll spam cannot move through geometry, overshoot the decision point, or skip the split state.

## 18. Geometry and Performance Budget

Build the corridor procedurally from primitive geometry where possible:

- `BoxGeometry`
- `PlaneGeometry`
- transformed primitives

Do not require a Blender scene for prototype V1.

Aim for approximately 10–20 meaningful meshes rather than hundreds of decorative objects.

Avoid large textures. Concrete character should come primarily from geometry, roughness, and lighting.

Lighting should remain modest:

- light ambient / hemisphere contribution,
- a small number of controlled architectural light sources,
- emissive slit planes where useful,
- shadows only when they materially improve depth.

Do not add prototype-V1 post effects:

- bloom,
- SSAO,
- chromatic aberration,
- depth of field,
- film-grain shader.

The scene must look convincing through fundamentals first.

### Runtime targets

Desktop:

- visually stable near-60fps motion on a reasonable modern machine,
- no obvious jank during auto-entry,
- immediate-feeling hover response,
- no canvas memory leak after navigation/back.

Mobile:

- stable interaction is more important than visual fidelity,
- cap DPR approximately 1–1.5 where appropriate,
- reduce lights / shadows if needed,
- avoid sustained heavy rendering at a static split screen.

Pause or reduce rendering when the document is hidden.

## 19. Accessibility

Keyboard interaction:

- Tab / focus BM Visuals → Visuals preview
- Tab / focus BMP Technical → Technical preview
- Enter → commit selected division
- Escape from preview → neutral split, if appropriate

Focus indicators must remain visibly accessible while matching the art direction.

Screen-reader content should remain simple and semantic:

- BM heading
- short BM explanation
- BM Visuals link and description
- BMP Technical link and description

The canvas carries no unique required information.

## 20. Interaction Edge Cases

The prototype must explicitly test:

### Rapid preview switching

Visuals → Technical → Visuals in quick succession must:

- interrupt cleanly,
- never queue stale animations,
- never overlap copy,
- never accumulate camera drift.

### Scroll spam

Heavy repeated wheel input must:

- remain clamped,
- preserve damped movement,
- not skip state boundaries,
- not pass through geometry.

### Click spam

After the first valid commit:

- lock additional selection input,
- prevent duplicate navigation,
- prevent competing exit transitions.

### Back navigation

Browser Back after entering a division should return to the shortened return-visit gateway state rather than replaying the full first-visit loader.

## 21. Visual Prohibitions

Do not introduce:

- neon blue/purple,
- holograms,
- floating dashboards,
- code rain,
- circuit-board textures,
- dense particles,
- sci-fi doors,
- rotating mechanical machinery,
- glowing BM logo,
- fake lens flares,
- heavy fog,
- grungy cracked concrete,
- generic cyberpunk language,
- game HUD conventions.

## 22. Failure Criteria

The prototype fails creatively if it reads primarily as:

- an FPS lobby,
- a sci-fi game menu,
- an Unreal Engine environment demo,
- a generic technology-company intro.

If that happens, revisit FOV, camera speed, light, material, geometry, and typography before adding more effects.

The prototype also fails if normal first-use time before meaningful interaction regularly exceeds approximately 5–6 seconds on a normal machine without a clear technical reason.

## 23. QA Frames

Capture and inspect at minimum:

1. Loader around `50`
2. Tunnel after auto-entry
3. Neutral split
4. Visuals preview
5. Technical preview
6. Mobile neutral split
7. Mobile preview

Each freeze-frame should remain visually strong without relying on motion to hide weak composition.

## 24. Prototype Success Criteria

Prototype V1 is successful when the answer is yes to all of the following:

1. Does the loader create anticipation without feeling like a copy of the reference?
2. Does loader → tunnel feel like one continuous space?
3. Does the corridor feel premium and architectural rather than game-like?
4. Is the 50/50 split understandable without long instructions?
5. Does 50/50 → 62/38 preview make the two divisions feel meaningfully different?
6. Does click-through make BM Visuals and BMP Technical feel like one BM ecosystem?

If the prototype reaches roughly **8.5–9/10** against these criteria, stop prototype polishing and move focus to BMP Technical proof/features.

Do not chase a 9.8/10 gateway while the Technical division still lacks substance.

## 25. Explicit Non-Goals for Prototype V1

Do not build:

- the full BMP Technical website,
- production BM parent routing,
- project previews inside the tunnel,
- sound design,
- CMS integration,
- settings panels,
- analytics dashboards,
- particles or decorative effects for their own sake,
- full production shared-page transitions,
- large new 3D dependency stacks.

Prototype V1 exists only to validate the gateway concept, spatial choreography, selection behavior, and division transition language.

## 26. Isolation / Route Strategy

Implement the eventual prototype on a dedicated route such as `/gateway-prototype` or an equivalent isolated branch route.

Do not replace the current BM Visuals `/` route during prototype validation.

The BM Visuals destination should point to the current Visuals experience. The BMP Technical side may use a controlled placeholder destination until the Technical site exists.

Only after the gateway proves the success criteria and BMP Technical has sufficient substance should a separate production-integration design be approved.
