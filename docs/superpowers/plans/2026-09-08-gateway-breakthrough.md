# Gateway breakthrough implementation spec and plan

**Goal:** Replace the rounded mineral corridor with a pearl shell that fractures into an impossible black architectural chamber and tears open into the final entity field.

**Architecture:** Existing displayed normalized progress owns reconstruction. A pure environment-only chapter score feeds static authored geometry transforms and material uniforms. The controller, camera choreography, hero implementation, and product state remain unchanged.

**Baseline:** 4c463ec3521d45e75f469707d2d7c1f2ea08e8a6. Clean feature branch, matching origin, verified before edits.

## Diagnosis and replacement boundaries

The current scene uses nine rounded boundaries and three echoes of that same silhouette. Even its carved cavities are smooth; limited depth exchange, predominantly pale albedo, modest dark grading, and repeated large curvature make every chapter look like the same ceramic world. Changing speed or spectral uniforms cannot fix that silhouette problem.

Keep the two-shell vocabulary only for Origin and final peripheral continuity. Replace the remaining rounded masses and miniature echoes with thick, bevelled tectonic slices, oblique polygonal apertures, and asymmetric distant structural returns. Replace environment shading with separate pearl and graphite architectural responses in a shared material family. Preserve the existing two bounded refraction encounters and capture infrastructure. No new dependency or post-processing target.

Frozen: app/page.tsx, lib/gateway/state.ts, navigation.ts, progress.ts, entities/**. Journey controller, chapter mapper, autoplay curve, GatewayPrototype, camera motion, and final semantic interaction do not need edits.

## Authored experience

1. **0–.18 / Pearl Shell:** luminous asymmetrical cavity, broad pearlescent lips. The quiet distant opening establishes depth.
2. **.18–.50 / Spectral Fracture:** six solid sections peel from a shared polygonal negative space, crossing obliquely at different depths. At .34 the shell opens and reveals a sharply sliced architecture inside. Near edges cross frame; midground carries the composition; the distant void stays visible.
3. **.50–.80 / Black Impossible Core:** the field becomes nearly black. Two complementary angular cavity halves exchange depth order while inverse scaling maintains their apparent opening. At .68–.74 a formerly continuous opening separates into mutually contradictory layers. Graphite faces, selective cyan/coral/amber bevels, and hard pearl edges replace pastel mass.
4. **.80–.96 / White Release:** architectural leaves rotate and separate laterally; the central slit widens physically as the dark field gives way to pearl light. Final entities appear through this opening rather than through a blanket opacity fade.
5. **.96–1 / Final Revelation:** unobstructed hero field, quiet structural residue at the perimeter and far distance. Existing entity framing, hover/reveal, and selection remain authoritative.

All event envelopes use smoothstep on progress. Optical energy continues to derive from the existing authored velocity curve. No accumulated rotations, random placement, wall-clock shader inputs, or raw wheel visual effects.

## Tasks

- [x] Add `lib/gateway/environment/breakthroughState.ts`: pure chapter/event score. Verify finite bounded output, strict reverse equality, boundary continuity, and dark/release contrast in `tests/gateway-breakthrough.test.mjs`.
- [x] Add `architecturalGeometry.ts`: static bevelled polygonal cavity sections. Re-author `spectralEnvironment.ts` with two pearl boundaries, six architectural slices, a complementary core pair, distant returns, and bounded optics. Shared buffers where appropriate; dispose each unique buffer once.
- [x] Re-author `spectralMaterial.ts` and chapter swatches: pearl shell versus graphite architectural faces, bevel-edge energy, engraved spatial lamination, restrained atmosphere. Feed the new dark/release field into `scene.ts` without changing entity lights/logic.
- [x] Replace obsolete geometry-specific environment tests with assertions for depth exchange, physical release clearance, deterministic transforms/uniforms, finite normals, static buffers, disposal, and a <100,000 triangle environment budget.
- [x] Browser inspect .00, .08, .16, .25, .34, .46, .58, .68, .78, .90, 1 plus exact hero-event peaks. Reject unreadable silhouettes, prop soup, empty core, and final occlusion; revise composition as necessary.
- [x] Verify normal autoplay, forward/reverse wheel, idle resume, final pause/rewind, original hero interactions, console/WebGL, mobile framing, and measured draw/triangle counts. Run tests, typecheck, lint, build, and frozen diff audit.
- [x] Write checkpoint 16 and update AUTO-CONTINUE. Commit stable completed pass; do not push, merge, create PR, or reactivate the paused automation.

## Verification gates

Tests inspect actual scene transforms after sequential and shuffled progress sampling. The new core must reverse the sign of the paired depth difference. The release must move the architecture outside the central hero sightlines. Static geometry buffers must not change across updates. Browser screenshots, not test success alone, decide visual acceptance. Timing remains the approved ~26-second authored controller; deeper entry is made legible through events spanning .18–.50, not another global slowdown.
