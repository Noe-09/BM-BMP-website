# BM Gateway Tunnel V2 — Visual Rebuild Design

Date: 2026-08-25
Status: APPROVED DESIGN — implementation not started
Branch: `feat/bm-gateway-tunnel-v2`

## 1. Purpose

V2 is a visual rebuild of the standalone BM Gateway Tunnel prototype. The current V1 engineering foundation is considered structurally successful but visually below the intended BM standard.

The V2 goal is not to imitate Lusion or any other studio. The target is to reach a comparable craft bar through original composition, spatial storytelling, cinematic choreography, restraint, and technical polish.

Core creative principle:

> Design five campaign-ready cinematic frames first, then connect them into one continuous spatial experience.

Every important frame must remain visually strong when animation is paused.

## 2. Scope

V2 keeps the current prototype route architecture and engineering behavior while rebuilding the visual system.

### Locked / preserved

Do not rewrite unless a genuine compatibility bug is discovered:

- gateway state machine
- navigation safety behavior
- session handling (`bmGatewaySeen`)
- keyboard accessibility
- reduced-motion state handling
- WebGL failure fallback
- hard readiness timeout
- semantic real links
- touch/coarse-pointer interaction logic
- current logic tests unless required by a visual-interface change

### Allowed visual rebuild areas

Primary expected rebuild surface:

- `lib/gateway/scene.ts`
- `lib/gateway/choreography.ts`
- `app/gateway-prototype/gateway.css`
- limited visual structure changes in `components/gateway/SelectionOverlay.tsx`
- new Blender procedural tooling/assets

Production `/` must remain untouched during V2.

## 3. Chosen Technical Direction

Chosen approach: **Blender procedural architecture → optimized GLB → raw Three.js runtime + semantic DOM/CSS**.

Three.js is no longer responsible for authoring the entire architecture procedurally in-browser.

Pipeline:

```text
Claude / Blender Python
→ tools/blender/build_gateway_v2.py
→ Blender headless
→ gateway-v2-preview.blend
→ optimized GLB export
→ public/gateway/gateway-v2.glb
→ raw Three.js runtime
→ DOM typography / navigation / accessibility
```

Blender script requirements:

- built-in `bpy` only
- deterministic scene generator
- no external addons required
- semantic object naming
- minimal, art-directable parameter set
- no unnecessary procedural framework

Recommended semantic collections:

```text
BM_GATEWAY
├── GEO_STATIC
├── ENTRY
├── GALLERY
├── CORE
├── VISUALS
├── TECHNICAL
├── LIGHT_GUIDES
└── EXPORT
```

Recommended semantic object names:

- `entry_foreground_slab`
- `entry_overhead`
- `gallery_wall_left`
- `gallery_wall_oblique`
- `gallery_ceiling`
- `gallery_light_cut`
- `core_monolith`
- `visuals_aperture_outer`
- `visuals_aperture_inner`
- `technical_aperture_outer`
- `technical_aperture_inner`
- `technical_aperture_cut`

The runtime should address named objects instead of relying on fragile mesh indices.

## 4. Visual Thesis

Target visual language:

**monolithic editorial architecture**

References in spirit only:

- architectural restraint
- monumental scale
- fashion runway / campaign set discipline
- museum installation
- technology pavilion precision
- BM typography

The result must not look like:

- FPS environment
- Unreal showcase
- sci-fi menu
- cyberpunk tunnel
- generic AI website
- mirrored left/right game portals

Explicit prohibitions:

- neon purple / neon blue
- holograms
- HUDs
- circuit textures
- code rain
- dense particles
- sci-fi doors
- giant machinery
- heavy fog
- fake lens flare
- chrome showroom surfaces
- decorative bloom used to hide weak composition

## 5. Spatial Rhythm

The architecture follows:

```text
VOID
↓
COMPRESSION
↓
DISPLACEMENT
↓
REVEAL
↓
MONOLITH
↓
DIVISION
```

It must not read as one straight rectangular corridor.

Key rule:

> Never show the entire architecture at once.

Architecture should be discovered through occlusion, changing ceiling height, negative space, and controlled framing.

## 6. Geometry Direction

### 6.1 The Void — Entry

Initial frame is almost black and spatially ambiguous.

Geometry:

- one large foreground slab
- low overhead slab
- one narrow vertical opening
- asymmetrical camera placement
- no clear full-room reveal

Suggested initial camera reference:

- `x ≈ -0.35`
- `y ≈ 1.55`
- `z ≈ 12`
- `FOV ≈ 42°`

### 6.2 The Threshold — Compression

The user moves through a deliberately compressed architectural section.

Requirements:

- left/right planes not parallel
- approximate angular offset range: 2–5°
- ceiling compresses from roughly 5.2m toward 3.4–3.8m
- aperture slightly off-center
- no camera shake / FPS behavior

### 6.3 The Cut — Oblique Gallery

This is the first major campaign-quality composition.

Requirements:

- a dominant oblique architectural plane
- foreground occlusion occupying roughly 30–45% of frame where appropriate
- clear foreground / midground / background hierarchy
- one architectural slot reserved for the future dominant light cut
- future monolith should be hinted at, not fully revealed

### 6.4 The Core — Monolith Reveal

The monolith is discovered gradually.

Requirements:

- initially only partial edge/silhouette is visible
- later resolves into full monumental mass
- approximate height: ~6.2m
- approximate width: ~2.0m
- substantial physical depth
- not initially dead-center in the reveal
- final camera may resolve toward centered framing

No baked BM text is required in V2.1 geometry work.

### 6.5 The Divide — Split Chamber

The split is the architectural climax.

Screen balance may be 50/50, but geometry must not be mirrored.

#### Visuals side

Spatial character:

- gallery-like
- broader aperture
- higher/open ceiling
- fewer cuts
- softer, larger surfaces
- more negative space

#### Technical side

Spatial character:

- structural
- more nested planes
- tighter aperture logic
- 2–3 precise architectural cuts
- sharper offsets
- restrained repetition

Technical must not become cyberpunk or circuit-board themed.

## 7. Asymmetry Rule

Visual balance is not geometric symmetry.

Do not build Technical by mirroring or copying Visuals geometry.

Both sides must be authored independently and communicate different spatial philosophies before hover styling is applied.

## 8. Scale Language

Prefer roughly 8–12 meaningful architectural masses over many decorative boxes.

Starting proportion guidance:

- overall depth: ~36–42m
- entry width: ~8–10m
- gallery width: ~9–12m
- compressed ceiling: ~3.4–3.8m
- open ceiling: ~5.5–6.5m
- monolith height: ~6.2m
- monolith width: ~2.0m
- split chamber width: ~16–20m

These are art-direction starting points, not rigid engineering constraints.

## 9. Materials and Lighting Philosophy

V2.1 begins in gray clay only.

Do not use final materials, texture detail, postprocessing, or cinematic lighting to rescue weak geometry.

Later material direction:

- near-black
- graphite
- warm mineral grey
- mineral white
- Visuals leakage: warm ivory / gallery-white quality
- Technical leakage: cold mineral / steel-white quality

Lighting rule:

> One dominant lighting idea per shot.

Examples:

- Entry: almost-black with one seam
- Gallery: one architectural light cut
- Core: controlled back/silhouette light
- Split: broad diffuse Visuals light vs precise Technical cut light

Avoid general-purpose room illumination that simply makes every surface visible.

## 10. Camera Choreography Philosophy

V2 camera is not a simple `cameraZ = lerp()` experience.

The visual path should be designed as key poses / shots:

1. `THE VOID`
2. `THE THRESHOLD`
3. `THE CUT`
4. `THE CORE`
5. `THE DIVIDE`

The final runtime may interpolate between authored poses, but each pose must have a deliberate composition.

Expected camera character:

- restrained architectural dolly
- approximately 40–44° FOV range
- controlled lateral displacement
- very small yaw
- no head bob
- no roll
- no dramatic game-camera acceleration

## 11. Loader V2 Direction

Remove the V1 giant-counter emphasis.

Desired restrained hierarchy:

```text
BM

INITIALIZING                         047
```

The architectural scene should gradually become legible behind the loader.

Desired perceptual reveal:

- early: near-black
- low progress: first seam / plane
- mid progress: spatial depth
- late progress: architecture becomes recognizable
- 100: user realizes the loading screen has always been inside the same space

The loader should transition continuously into the tunnel, not cut to a new scene.

## 12. Split / Typography Direction

Remove the visual impression of a two-column landing-page UI.

Typography should feel like architectural signage belonging to the space.

Neutral split should read spatially around the BM core rather than as a bordered left/right web layout.

Desktop interaction remains conceptually:

- neutral: 50/50
- Visuals preview: ~62/38
- Technical preview: ~38/62

Mobile/coarse remains conceptually:

- selected ownership around 68/32
- first tap previews
- CTA enters

But the visual mechanism should be architectural opening/separation, not simply CSS column width changes.

Visuals preview character:

- aperture opens
- broader surfaces
- softer flood / gallery quality

Technical preview character:

- structural separation
- precise cuts
- colder, sharper illumination

The two previews must not be mirror animations.

## 13. Freeze-Frame Acceptance System

The central quality gate for V2 is still-image strength.

V2.1A must generate at least:

```text
renders/
├── 01-entry.png
├── 02-threshold.png
├── 03-gallery.png
├── 04-core.png
└── 05-split.png
```

Recommended camera names:

- `CAM_ENTRY`
- `CAM_THRESHOLD`
- `CAM_GALLERY`
- `CAM_CORE`
- `CAM_SPLIT`

Gray-clay render only.

Reject a frame if:

- it resembles a game level
- the entire room is visible
- composition is overly symmetrical
- many small boxes substitute for strong masses
- ceiling remains constant everywhere
- monolith appears too early
- split resembles sci-fi doors
- the frame only becomes attractive after effects are added

Pass condition:

> The gray-clay still already looks intentional enough to function as an architectural campaign image.

## 14. Sectioned Claude Workflow / API Budget Strategy

Claude must not receive one large rebuild prompt.

Use short, hard-bounded sections with a fresh chat where practical.

Canonical sequence:

```text
V2.0 — Audit + Freeze
V2.1A — Blender script + first graybox
V2.1B — Composition corrections only
V2.1C — Naming + deterministic export
V2.2 — Camera choreography
V2.3 — Materials + lighting
V2.4 — Loader reveal integration
V2.5 — Split chamber + hover architecture
V2.6 — Mobile / performance / final polish
```

Every prompt must include a hard stop such as:

> Only complete this section. Do not start the next section.

Do not use open-ended instructions such as “continue improving until excellent”.

Checkpoint files may be saved under:

```text
docs/gateway-v2/checkpoints/
```

Each new Claude session should read only the relevant short checkpoint plus the minimum required source files.

## 15. Model Budget Strategy

Recommended use:

- Sonnet-class model for audit, integration, export plumbing, cleanup, mobile/performance
- strongest Opus-class model for architecture composition, camera choreography, lighting/material art direction, and difficult visual decisions

The expensive model should be used primarily where visual judgment materially affects quality.

## 16. V2.1A Output Contract

The first Blender implementation section must only produce the graybox foundation.

Expected outputs:

```text
tools/blender/build_gateway_v2.py
gateway-v2-preview.blend
renders/01-entry.png
renders/02-threshold.png
renders/03-gallery.png
renders/04-core.png
renders/05-split.png
```

No final GLB export is required until geometry review passes.

If Blender is unavailable or its CLI cannot be resolved, stop and report the blocker. Do not silently fall back to rebuilding the scene in Three.js.

## 17. Success Criteria

V2 succeeds when:

1. Five core freeze frames are visually strong without motion.
2. The environment reads as architectural brand installation rather than game level.
3. Loader, tunnel, core reveal, and split feel like one continuous world.
4. Visuals and Technical feel distinct before and during preview without becoming literal themed environments.
5. Interaction logic remains as reliable and accessible as V1.
6. Runtime remains practical for desktop and mobile.
7. The work reaches a top-tier interactive-studio craft bar through original BM art direction rather than imitation.

## 18. Non-goals

V2 does not include:

- replacing production `/`
- real BMP Technical content/site
- sound design
- shader spectacle for its own sake
- decorative particle systems
- production routing integration
- copying Lusion assets, layouts, code, scenes, typography, or identifiable animation motifs

## 19. Implementation Gate

This document defines the approved V2 visual direction. Implementation begins only after this written spec is reviewed and accepted, then converted into a sectioned execution plan/prompts.
