# Checkpoint 15 — cinematic signature pass

Date: 2026-09-07  
Branch: `feat/bm-gateway-tunnel-v2`  
Implementation baseline: `5a09d5ea64fcf7015f5743378ac13ac122622705`

## Outcome

The approved spectral world now has a stronger beginning/build/peak/release rhythm without replacing its geometry vocabulary or either final entity. The pass adds a slower authored journey, three progress-authored spatial events, a darker deep axis, subordinate shared-buffer architecture, and an environment-only filmic light hierarchy.

Rendering remains a pure reconstruction of displayed normalized progress. Raw wheel/trackpad input changes target progress through the existing impulse path and never enters a shader, cinematic frame, event envelope, or finishing parameter.

## Autoplay duration and velocity

The checked-out pre-pass target-travel curve integrated to **20.303 seconds**. The cinematic curve integrates to **25.877 seconds**, an increase of **27.46%**. A fresh browser run measured **26.032 seconds** from displayed progress first leaving zero to exact progress 1, including render-progress settling.

Browser chapter marks from that run:

| Displayed progress | Elapsed from first movement |
| --- | ---: |
| 0.15 | 3.917 s |
| 0.35 | 10.183 s |
| 0.55 | 15.366 s |
| 0.72 | 18.699 s |
| 0.80 | 20.149 s |
| 1.00 | 26.032 s |

Autoplay velocity is `0.055 × existingEntryMultiplier(p) × cinematicMultiplier(p) × idleResumeEnvelope`. The new cinematic multiplier uses smooth interpolation:

| Progress | Multiplier relative to the checked-out curve |
| --- | ---: |
| 0.00 | 0.70 |
| 0.15 | 0.74 |
| 0.35 | 0.78 |
| 0.55 | 0.86 |
| 0.72 | 1.00 |
| 0.80 | 1.00 |
| 0.90 | 0.64 |
| 1.00 | 0.58 |

The existing input gain (`clamp ±180 × 0.00075`), damping, 850 ms idle hold, 900 ms resume ramp, seek behavior, and exact final pause remain unchanged.

## Deterministic optical energy

`deriveCinematicFrame(progress)` is the sole cinematic rendering mapper. It derives Reveal, Core, Release, destination, optical energy, background depth, exposure, haze, and glow from clamped progress alone.

Optical energy normalizes the authored cinematic speed curve and applies a progress-authored Core envelope. It does not read autoplay state, current controller velocity, timestamps, frame deltas, input deltas, or finite differences. Forward, reverse, and shuffled progress samples reproduce identical environment transforms and material uniforms.

A canvas-only screenshot round trip from progress 0.68 → 0.90 → 0.68 differed by 35 of 810,240 pixels (0.0043%), limited to rasterization noise. The pure scene tests require exact structural equality.

## Three hero events

1. **Reveal — 0.26–0.44, peak 0.36.** Existing outer vaults separate to reveal nested, progressively smaller far cavities and a luminous distant rim. The destination reads through negative space rather than as a portal.
2. **Impossible Core — 0.60–0.82, peak 0.75.** Existing carved core masses increase their contradictory depth/rotation relationship. Graphite background depth, teal rims, violet silhouettes, and pearl edges create the highest-contrast still while the central route remains readable.
3. **Release — 0.80–0.98.** The existing lateral boundaries withdraw more decisively, density relaxes, and the final entities resolve against persistent distant architecture.

All event envelopes are compact smooth functions of progress. There are no cutscenes, timers, direction flags, or one-way animation state.

## Spatial density and destination

Three subordinate far echoes reuse the three existing far-field geometry buffers. They use fixed authored transforms, separate environment materials, small scales, and partial occlusion. They add nested cavity depth without particles, random props, rails, beams, sticks, repeated rectangular frames, or transparent overdraw.

Geometry creation remains static. The environment contains 14 meshes, 11 unique geometry buffers, 324,035 allocated triangles, and 367,043 triangles if every environment mesh were submitted once. Shared buffers are disposed once; every material is disposed.

## Lighting and color choreography

- Origin remains mineral white, pearl, and pale lavender.
- Formation introduces cyan/teal reflected windows and lavender interference.
- Passage moves into graphite depth, deep teal, restrained cobalt/violet, and a small distant pearl/cyan rim.
- Core uses the deepest silhouette hierarchy, strongest optical energy, narrow pearl edges, and selective warm reflection rather than a warm surface wash.
- Emergence returns to pearl/mineral light while retaining cyan, lavender, and warm residue.

Near optical encounters receive the strongest angle-dependent energy. Midground receives the main spectral response. Far/echo systems receive quieter energy, stronger depth treatment, and a spatially delayed palette sample. The background darkens only as supporting depth; material interference, local cavity response, rim light, luminance, and distance haze carry the composition.

## Finishing stack

Retained environment-only finishing:

- progress-authored exposure;
- highlight compression in the spectral material;
- distance/progress haze;
- energy-dependent refraction offset;
- narrow analytic spectral edge glow;
- deep-destination rim luminance;
- graphite far-field shadow response.

Optional half-resolution blur/bloom was evaluated and deliberately omitted. It softened the nested silhouettes that give the events their identity, would add render targets and fullscreen passes, and was not needed for the requested light hierarchy. Hero shaders and the lights that define hero appearance remain unchanged.

## Performance

The previous checkpoint recorded **19 draws / 605,062 submitted triangles** during an optical Formation frame. The cinematic Core optical frame records **25 draws / 691,078 submitted triangles**. The increase is exactly the three opaque far echoes submitted in both the capture and main passes: +6 draws and +86,016 triangles (+14.22%).

At a 1280×633 headless browser canvas, a 180-frame Core sample recorded **16.7 ms median and 16.7 ms p95**, with no missed 60 Hz frames. This is a vsync-bounded laptop observation, not a low-end phone GPU benchmark.

The pre-existing optical capture remains at 60% linear resolution. At the measured canvas size that is approximately 768×380, or roughly 2.23 MiB for estimated RGBA8 color plus 32-bit depth. No cinematic render target or fullscreen post-processing pass was added. DPR limits remain 1.5 desktop and 1.25 coarse pointer.

## Browser verification

- Fresh autoplay reached exact displayed progress 1 and logical split in 26.032 seconds.
- Final progress remained exactly 1 across a 1.2-second pause.
- Four reverse wheel impulses moved displayed progress from 1 to 0.460 while logical Visuals preview and the gateway URL remained unchanged.
- Existing idle resume returned the same preview state to exact progress 1.
- Reverse from final moved immediately to 0.865; one forward impulse immediately returned to 1.
- BM Visuals hover displayed the preserved split-shell worldform and associated content.
- BMP Technical hover displayed the preserved monolith and associated content.
- Ordinary Technical activation reached `/gateway-prototype/technical`; browser back returned to the gateway.
- Reduced-motion emulation resolved directly to the settled final chamber without an error overlay.
- A 393×852 mobile viewport retained both heroes and their division identities. The available browser device preset did not expose a true `(pointer: coarse)` state; coarse input behavior is covered by the existing deterministic interaction and CSS tests, not claimed as physical-device certification.
- Exact Reveal (0.36011), Core (0.75065), Release (0.91007), final states, and transition points were captured and inspected.
- Browser error collection returned no page, shader, WebGL, or runtime console errors. Console output contained only React development information and HMR lifecycle logs.

## Automated verification

- Full suite: **97 tests passed, 0 failed**.
- TypeScript: `tsc --noEmit --incremental false` passed.
- ESLint: full repository passed.
- Production: `next build --webpack` passed and generated all expected routes.
- Frozen diff from `5a09d5e` is empty for `lib/gateway/state.ts`, `lib/gateway/navigation.ts`, `lib/gateway/progress.ts`, `app/page.tsx`, and `lib/gateway/entities/`.
- Worktree was clean after the build and browser checks.

## Changed implementation files

- `lib/gateway/journey/cinematicProfile.ts` (new)
- `lib/gateway/journey/controller.ts`
- `lib/gateway/environment/spectralEnvironment.ts`
- `lib/gateway/environment/spectralMaterial.ts`
- `lib/gateway/scene.ts`
- `tests/gateway-journey.test.mjs`
- `tests/gateway-environment.test.mjs`

Design, implementation plan, `AUTO-CONTINUE.md`, and this checkpoint are the only documentation changes.

## Known weaknesses

- Some close grazing surfaces retain the approved smooth ceramic quality and can expose meshing resolution.
- Warm Core accents remain intentionally subtle; the hierarchy relies more on graphite/teal/violet/pearl contrast than obvious amber.
- The nested far echoes are most legible near the Reveal and Core; in the final chamber they read as quiet residue rather than independent objects.
- Physical Safari, low-end phone GPU, and genuine coarse-pointer hardware were not tested.
- Browser frame timing was vsync-limited, so it demonstrates no dropped frames on this laptop rather than a precise GPU cost delta.

## Completion

The cinematic signature pass is complete on its feature branch. No merge, pull request, push, or unrelated page work was performed.
