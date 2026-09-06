# 14 — Creative tunnel rebuild

Date: 2026-09-06\
Branch: `feat/bm-gateway-tunnel-v2`\
Starting commit: `8215fc0c6687ba60af6d550519932f3ac8153df6`\
Repository root on this laptop: `/Users/noe/Documents/GitHub/BM-BMP-website`\
Remote: `https://github.com/Noe-09/BM-BMP-website.git`

## Repository and scope

Before implementation, local HEAD and fetched `origin/feat/bm-gateway-tunnel-v2` matched the starting commit: ahead 0, behind 0. The resumed working-tree changes belonged to this pass. No work was performed on `main` and no Windows path was assumed. The later creative-corrective brief explicitly authorized implementation and a commit, superseding the earlier spec-only request.

This checkpoint is the implementation record. The earlier design document in `docs/superpowers/specs/2026-09-05-bm-gateway-impossible-spectral-environment-design.md` is retained as historical direction, not a claim that all proposed module names and parameters shipped verbatim.

No production homepage integration, production-page redesign, dependency addition, push, PR, or merge is included.

## What was replaced

Removed the old living-matter traversal and the separately appearing chamber:

- Near-camera blade planes, repeated manifold sheets and transmission films.
- The line-segment speed-filament system.
- The separate chamber's box baffles, canopy planes, ground plinth, painted deep portal and luminous center seam.
- Elapsed-time environment motion and the scene's second progress-damping layer.

The four superseded environment/matter modules are deleted; their previous versions remain recoverable in Git history. The hero entities and their shaders are not among those removals.

## New spatial concept: a mineral cavity that changes its inside

The environment is an overlapping, authored mineral vault. Broad pearl returns frame cyan and lavender carved volumes; a deep, offset negative space remains the destination. Opening, compression and release happen to the same surfaces instead of switching to a different final backdrop.

Three solid cavity geometries are constructed once from explicit solid-minus-branching-void fields. Three.js marching cubes converts those fields into ordinary static mesh geometry during setup. It does not run in the frame loop, and this is **not** a full-screen raymarch. Analytic field gradients supply the solid normals. Eight additional broad return/optical surfaces use continuous cavity-wall geometry, not primitive planes or floating glass props.

The conceptual systems overlap rather than appearing as eight isolated objects:

| Spatial responsibility | Implementation |
| --- | --- |
| Mineral envelope | Carved primary boundary and broad lower return |
| Mid-distance structure | Offset upper/lower return surfaces |
| Contradictory cavities | Two interleaved carved internal volumes |
| Optical encounters | Two bounded refractive boundary events |
| Deep destination | Three distant, differently shaped returns |
| Mineral light | Shared surface-normal lighting, reflected light fields and lamination |
| Atmosphere | Distance-dependent material haze and chapter background color |
| Chamber residue | Opening transforms of the existing envelope, core and far field |

The opaque, distant and optical materials share the traversal material factory. Neither hero shader imports that factory. Refraction uses a 60%-resolution offscreen capture only during the two optical encounters. There is no particle system, rail system, frame sequence, random placement or wall-clock-driven environment noise.

## Five continuous chapters

| Chapter label | Progress | Spatial behavior |
| --- | --- | --- |
| Origin | 0–0.16 | Oversized cavities make a spacious opening; mineral returns and a distant aperture establish depth. |
| Formation | 0.16–0.34 | The same cavities gather and contract; the first optical encounter accents the boundary. |
| Spectral passage | 0.34–0.58 | The envelope and returns compress around the travel axis. The main envelope distances approach approximately 8–12 m. |
| Impossible core | 0.58–0.78 | Internal volumes exchange actual depth order while the nearer/deeper apparent scale relationship changes. Rotating, branching openings expose different internal walls. |
| Emergence / chamber | 0.78–1 | The internal cavities enlarge, boundary pressure clears and the unchanged hero entities emerge. The deep returns remain. |

Labels are not switches. Overlapping smoothstep envelopes drive all numeric transforms through the boundaries. The core still has real depth-order inversion after its overly dominant near wall was moved deeper during visual review. Camera roll and shake are absent; the small journey drift remains bounded and fades out at emergence.

## Exact progress ownership and navigation separation

`GatewayPrototype.journeyRef` owns one `VisualJourney` value from `lib/gateway/journey/controller.ts`. It is the only owner of `targetProgress` and `renderProgress`. React's `travelProgress` is a published render snapshot, not a separately advanced controller. `scene.ts` consumes that displayed value directly, without another damping step.

- Autoplay speed is `0.055 * smoothstep(0, 1, idleRamp)` normalized progress/second.
- Without previous input, the ramp is fully enabled. After input, autoplay is zero for 850 ms, then ramps over 900 ms.
- Wheel delta mode is normalized to pixels. Each wheel/drag impulse is clamped to ±180 pixels and multiplied by 0.00075.
- Reverse starts from `min(targetProgress, renderProgress)`, removing buffered forward lead immediately. Input clears an active seek and resets the idle clock.
- Render progress exponentially approaches the target with damping 8.5; frame delta is capped at 50 ms. A residual below 0.0005 snaps to the exact target.
- At 1, target and render progress are exactly 1, velocity is zero, and the controller frame loop sleeps. The preserved hero hover renderer remains available.
- Reverse input wakes that loop and can leave 1. Idle autoplay can return to 1 without resetting the journey.
- The semantic MOVE FORWARD action uses an 800 ms deterministic seek; the loader's existing skip duration is passed into the same seek mechanism. Reverse can cancel either seek.
- `deriveJourneyFrame(renderProgress)` maps every chapter transform and material weight deterministically.
- The frozen reducer receives forward-only lifecycle milestones on first completion. Rewind never dispatches a reverse lifecycle event, commits a destination, writes the session marker, calls the router, or changes the URL.
- After a visual rewind from selection, the existing overlay remains mounted but is hidden/inert below 0.985. Preview callbacks ignore automatic blur/leave events during that visual operation. The logical preview remains intact, and a semantic return control remains available. The overlay becomes usable again on return.
- Reduced motion resolves to the settled visual endpoint. Existing session, native link, modifier, keyboard, preview-first, commit-lock and route-fallback contracts are preserved.

The starting checkout did not actually contain the fully reversible, full-length autoplay controller described in the handoff brief. Its auto-entry stopped at the user-travel stage and input ownership ended before final selection. The new pure controller was therefore necessary; the frozen navigation/reducer/progress modules were not rewritten to obtain that behavior.

## Hero integration and readiness

`DualEntitySystem`, Visuals worldform, Visuals preview reveal and Technical monolith implementations are unchanged. Their existing emergence parameter is adapted from the new chapter envelope, and their time argument is derived from progress so an idle final chamber does not continue traversing.

Responsive integration uniformly scales the shared hero parent and keeps its entity plane 12 m from the camera. This fixes a narrow-layout issue found in review: moving the pair farther back to fit had placed the Technical monolith behind a chamber surface. The corrected fit preserves the existing hero geometry, materials and relative arrangement.

The loader timeout now measures a visible attempt, not suspended-tab time. `TunnelCanvas` reports readiness after its first successful tick/render and routes thrown rendering failures to the existing fallback. This prevents a ready but background-suspended preview from being incorrectly timed out.

## Visual review and browser verification

Local live preview: `http://localhost:3107/gateway-prototype`\
Development-only paused review: `http://localhost:3107/gateway-prototype/review`

Port 3000 was taken over by another local app during the pass. Verification moved to this branch's server on 3107; the unrelated server was not stopped.

Captured and inspected Origin, Formation, Spectral Passage, Impossible Core, Emergence and Final Chamber, including intermediate/boundary states at 0.08, 0.16, 0.34, 0.58 and 0.78. The development review exposes all eleven requested representative progress points. Captures were inspected in the task; screenshot binaries are not committed.

Self-rejection iterations included: discarding the early satin/ribbon-like surfaces; replacing primitive-looking loops with thick carved solids; reducing chrome-like glare; opening the origin so it did not resemble the passage; moving an over-dominant core face deeper; and correcting narrow-screen hero occlusion. The final scene no longer uses the previous speed lines, repeated plane manifolds or separately introduced chamber. The artistic target is still subject to human review; passing automated checks is not being presented as proof of a particular studio's visual standard.

Observed in the live browser:

- First-visit autoplay reached logical `split`, visual progress `1.00000`, without scroll input.
- Visuals hover opened the preserved split-shell reveal.
- Reverse wheel input changed visual progress from `1.00000` to `0.87715` while logical phase stayed `preview`, logical selection stayed `visuals`, and the gateway URL did not change. Hidden selection controls left the accessibility tree and MOVE FORWARD became available.
- Idle autoplay returned to `1.00000` with the logical preview preserved.
- Ordinary Technical activation completed the animated commit and reached `/gateway-prototype/technical`.
- BACK TO GATEWAY used the short returning-visitor path.
- Keyboard Enter on ENTER VISUALS followed the native link to `/`.
- At 390×844, both corrected hero silhouettes were visible and both CTA bounds remained inside the viewport. The temporary viewport override was reset. This is responsive layout testing, not a claim of testing a physical touch device.
- The final scene-review tab reported no warning/error console messages.

## Verification

- Pure controller and chapter tests were run before the WebGL environment implementation.
- Full suite: **86 tests passed**.
- Pure reconstruction covers `0.00, 0.08, 0.16, 0.25, 0.34, 0.46, 0.58, 0.68, 0.78, 0.90, 1.00`, reverse sampling, endpoint pause/resume, boundary continuity and responsive hero depth.
- Real scene tests cover exact transform reconstruction, core depth-order inversion, bounded optical visibility, persistent final geometry, finite normalized mesh data, static geometry buffers and complete/idempotent disposal.
- Typecheck: `tsc --noEmit` passed.
- Lint: full-repository ESLint passed.
- Production build: `next build --webpack` passed. Webpack was used because the local Turbopack development path had a process-spawn/runtime problem; no bundler or dependency migration was made.
- Built-server smoke check: `/gateway-prototype` returned HTTP 200 and the development-only `/gateway-prototype/review` returned HTTP 404.
- Frozen-file diff against the starting commit is empty for `state.ts`, `navigation.ts`, `progress.ts`, `app/page.tsx`, and the complete `lib/gateway/entities/` directory.

The development review is guarded by `NODE_ENV`; it is not a public production control surface. Runtime canvas counters include both the main and optional refraction pass. Geometry is generated once; the tests bound the allocated environment below 400,000 triangles. These are workload checks, not measured GPU frame-time claims.

The observed formation frame at 0.25 reported 19 draw calls and 605,062 submitted triangles across the capture and main passes. This is why the optical encounters remain bounded rather than running throughout the journey.

## Remaining limitations

- Lighting/reflection is art-directed and analytic, not physically complete indirect illumination. Some grazing surfaces still have a smooth ceramic quality, and close silhouettes can reveal meshing resolution.
- The deep field is deliberately quiet; it is less detailed than the main carved structures. More depth contrast may be desirable after a human art-direction review.
- The optical capture adds a second render during its bounded encounters. Low-end phone GPU frame times and a Safari/physical-touch matrix have not been measured. Coarse-pointer and reduced-motion contracts are covered by the pure/existing tests, not a new physical-device certification.
- The hero preview appearance itself is inherited. This pass does not claim to improve its existing project-texture visibility or redesign either hero.

## Changed files

Added:

- `lib/gateway/journey/controller.ts`
- `lib/gateway/journey/chapterState.ts`
- `lib/gateway/journey/framing.ts`
- `lib/gateway/environment/carvedGeometry.ts`
- `lib/gateway/environment/spectralGeometry.ts`
- `lib/gateway/environment/spectralMaterial.ts`
- `lib/gateway/environment/spectralEnvironment.ts`
- `components/gateway/GatewaySceneReview.tsx`
- `app/gateway-prototype/review/page.tsx`
- `tests/gateway-journey.test.mjs`
- `tests/gateway-environment.test.mjs`
- The historical implementation spec and this checkpoint.

Modified: `lib/gateway/scene.ts`, `lib/gateway/choreography.ts`, `components/gateway/GatewayPrototype.tsx`, `components/gateway/TunnelCanvas.tsx`, `app/gateway-prototype/gateway.css`, `tests/gateway-markup.test.mjs`.

Deleted: `lib/gateway/matter/livingMatterSystem.ts`, `lib/gateway/matter/livingMatterShader.ts`, `lib/gateway/environment/chamberEnvironment.ts`, `lib/gateway/environment/chamberShader.ts`.

Generated `next-env.d.ts` and `tsconfig.tsbuildinfo` changes are excluded from the commit.
