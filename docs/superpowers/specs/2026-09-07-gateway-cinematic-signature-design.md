# BM Gateway V2 — cinematic signature design

## Status and baseline

Design for review; implementation has not started. The user approved progress-derived optical energy, explicitly excluding raw wheel velocity from rendering.

Repository: `/Users/noe/Documents/GitHub/BM-BMP-website`. Branch: `feat/bm-gateway-tunnel-v2`. Clean baseline: `5a09d5ea64fcf7015f5743378ac13ac122622705`, matching origin at verification.

The current world, its geometry generators, both hero entities, and frozen state/navigation/progress contracts remain the foundation. This pass changes choreography and rendering, not the environment concept or site design.

## Approach and alternatives

Recommended: reuse existing masses and geometry, strengthen their progress-authored relationships and material lighting, then add a small environment-only finishing stage. This can deliver readable reveal/core/release compositions without changing hero appearance.

Material-only treatment is cheaper but risks repeating the previous pass's limitation: the same scene with different color. A full-scene bloom/composer stack offers more effects but adds render-target cost and would also grade the approved heroes. Neither is the primary approach.

## Exact progress and energy ownership

- `GatewayPrototype` continues to own its single journey ref: target and displayed progress.
- Wheel/trackpad input continues through `impulseJourney`; preserve the current delta normalization, clamp, gain, and reverse cancellation. No wheel-derived uniform or optical accumulator.
- `stepJourney` alone integrates autoplay into target progress. Preserve render damping, 850 ms idle suppression, 900 ms resume ramp, seek cancellation, and endpoint behavior.
- Target progress evaluates the autoplay speed curve for integration. Displayed progress evaluates the same curve for rendering. These are two evaluations of one pure function, not separate clocks or state owners.
- A pure cinematic-frame mapper consumes displayed progress. Event envelopes, light hierarchy, haze, exposure, and optical energy depend only on this input.
- Optical energy normalizes the authored speed over its configured range, with a smooth progress-authored Core envelope. It does not use current autoplay velocity, elapsed time, input timestamps, or finite-difference frame velocity. This keeps energy identical while paused, reversing, or waiting for autoplay to resume.
- Exact visual reconstruction applies to the environment at equal progress and equal viewport/quality settings. Preserved hero hover behavior remains dependent on its existing pointer/selection inputs; do not rewrite it to satisfy an environment-only invariant.
- At progress 1 autoplay pauses exactly. Reverse input leaves 1 through the existing controller. Logical selection and browser history are unaffected.
- Existing chapter labels and frozen navigation milestones are not retimed. Cinematic event windows are rendering envelopes, not product states.

## Autoplay rhythm

Interpret “current speed” relative to the checked-out version, including the previous polish profile. Preserve that curve as the baseline and multiply it by this smoothstep-interpolated relative profile:

| Progress | Relative multiplier |
| --- | --- |
| 0.00 | 0.70 |
| 0.15 | 0.74 |
| 0.35 | 0.78 |
| 0.55 | 0.86 |
| 0.72 | 1.00 |
| 0.80 | 1.00 |
| 0.90 | 0.64 |
| 1.00 | 0.58 |

Velocity is `0.055 × baselineMultiplier(p) × cinematicMultiplier(p)` progress units per second, multiplied by the existing idle-resume envelope only when integrating autoplay.

Numerical integration at 100,000 midpoint samples gives a baseline target-travel duration of 20.303 seconds and proposed duration of 25.877 seconds: +27.46%. These exclude loader, user input, and displayed-progress settling. Browser measurement must separately report actual displayed travel duration. The endpoint multiplier remains positive so travel reaches 1 rather than asymptotically approaching it.

## Three spatial events

All events use smooth compact envelopes with zero slope at their bounds. Preserve primary geometry buffers and restrained camera behavior.

1. **Reveal, p=0.26–0.44, key still near 0.36.** Offset the existing overlapping vault/shelf relationships just enough to uncover a deeper, smaller illuminated cavity edge. Maintain an open travel axis. Reveal must be legible through silhouette and occlusion, not a bright flash.
2. **Impossible Core, p=0.60–0.82, key still near 0.75.** Reauthor the existing two carved masses' depth disagreement, rotation and relative scale to peak later. A closer surface reads as boundary while the deeper cavity appears continuous across it. Keep one clear aperture through the increased overlap; do not merely raise saturation.
3. **Release, p=0.80–0.98, key still near 0.91.** Coordinate the existing opening transforms into a stronger withdrawal of lateral pressure. Midground contrast relaxes while distant architecture remains visible. Keep the existing hero-emergence visibility and integration contract; do not delay or redesign the heroes.

Use modest transform offsets on existing systems, not wholesale rearrangement. The three stills must remain recognizable as the same approved world.

## Destination and spatial density

Replace uniform pale far-field haze during passage with darker, quieter graphite depth. Pick out an existing distant partial cavity rim with pearl/cyan luminance. Perspective, partial occlusion and compressed scale define the destination; no portal mesh or circular light sign.

Add at most three partial far-field echoes, sharing existing geometry buffers, with fixed authored transforms and opaque materials. Keep them behind the primary masses, partially occluded, and subordinate. No random placement, particles, rails, repeated frames or new transparent layers. Remove echoes that do not improve paused-frame depth. Shared buffer disposal must happen exactly once.

Nested material detail follows local cavity coordinates and normal orientation. It must not turn into screen-space bands or a flat background gradient.

## Light and color hierarchy

Environment shader lighting is independent of the existing scene lights used by heroes. Modify environment-only uniforms and analytic reflected lighting; preserve hero lights and hero shaders.

- Origin: pearl/mineral white, pale lavender, quiet depth.
- Formation: cyan/teal reflected windows and lavender optical edges.
- Passage: graphite recesses, deep teal, localized cobalt/violet response. Preserve a small luminous deep destination against darker depth.
- Core: strongest silhouette contrast; narrow pearl edges; teal/cobalt/violet internal reflections; selective coral/amber, not a broad warm wash.
- Emergence: return to bright pearl with cyan/lavender and small warm residue, never blank beige.

Near optical encounters have stronger angle-dependent interference but remain accents. Midground carries the main light composition. Far structures are darker, less saturated and use a deterministic progress offset rather than temporal smoothing.

## Finishing stage and hero isolation

Start with environment-only filmic highlight compression, authored exposure and depth haze. Avoid grading the whole scene, which would change approved hero appearance.

Evaluate a small spatial-only glow stage: render environment color to a target, extract only high-luminance accents, use two separable half-resolution blur passes, and composite at low strength. No temporal history, motion blur, depth of field, global RGB split, grain, or lens flare. Glow must be visually justified by side-by-side captures; omit it if it only softens the scene.

Render heroes after the environment finishing stage, without clearing its depth. Environment-only optics use the ungraded opaque environment capture; avoid sampling a color-converted image as though it were linear. Apply display conversion once per output path. Verify the depth handoff, resize, context failure, resource disposal and final hover behavior explicitly.

If implementing this isolated compositing path would compromise depth correctness or hero appearance, retain the shader-level filmic/haze finish and omit glow. Do not substitute a full-screen raymarch or indiscriminate whole-scene grading.

## Performance and failure handling

Preserve desktop DPR cap 1.5 and coarse-pointer cap 1.25. Glow is disabled for coarse-pointer and reduced-motion profiles; retain identical event transforms and progression. Quality choice is explicit and stable, not based on recent wheel activity or per-frame timing history.

Budgets: no more than three extra architecture draws; no additional transparent geometry; glow, if retained, adds at most four fullscreen draws. Measure total draws across all passes rather than reporting only the final render. Report actual triangles, capture dimensions, render-target memory estimate and frame-time comparison at the same viewport/DPR. Target no more than 20% median frame-time overhead versus baseline on the test laptop; disable optional glow if it exceeds the budget. Do not present laptop results as phone GPU verification.

Allocate render targets only on initialization/resize, dispose resources on teardown, and preserve the existing semantic fallback on genuine WebGL failure. Optional effects failure should fall back to the direct rendering path where safe; it must not block division navigation.

## Verification and acceptance

Before WebGL edits, write failing tests for the new duration/profile, pure optical-energy sampling, event envelopes and boundary continuity. Retain existing controller, navigation and state regressions.

Sample forward, reverse and shuffled progress at 0, .08, .15, .16, .25, .34, .35, .36, .44, .46, .55, .58, .60, .68, .72, .75, .78, .80, .82, .90, .91, .98 and 1. At identical progress, environment transforms/material uniforms/post parameters must reconstruct exactly. Test numerical continuity around all curve and event bounds. Check primary geometry identities and buffer versions remain unchanged.

Browser gates: fresh-visit autoplay duration; immediate forward scrub; reverse through all events; idle resume; endpoint pause; reverse from endpoint with selection/URL preserved; Visuals hover reveal; Technical selection; reduced motion; coarse pointer; resize; no console or shader/WebGL errors. Inspect five chapters, all three hero events and their transitions in both directions. Keep neutral pointer/selection fixed for deterministic screenshot comparisons.

Reject the visual result if it is only slower/more colorful, hides the destination, becomes uniformly dark, or reads as props, rainbow, excessive bloom or a generic sci-fi tunnel. Three event stills must be strong compositions at paused progress, not frames rescued by camera motion. Quality judgment and known weaknesses must be reported honestly even when tests pass.

Run the full tests, typecheck, lint and production build. Final report includes measured timing, velocity curve, lighting/color, density, hero events, retained/omitted post effects, performance impact, reverse verification, WebGL status and known weaknesses. Stop after this pass; no unrelated edits, merge or deployment.

## Intended code boundaries

Existing: journey controller, chapter-state mapper, environment material/palette/environment assembly, scene render orchestration, their tests. Add small pure cinematic-profile and optional finishing modules only where they clarify ownership. `TunnelCanvas` may pass existing quality information if required without changing its external props.

Do not edit `state.ts`, `navigation.ts`, frozen `progress.ts`, `GatewayPrototype` selection/navigation logic, hero entity implementations, geometry generators, or unrelated site pages.
