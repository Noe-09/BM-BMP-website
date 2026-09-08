# 16 — Creative breakthrough: the parted chamber

Date: 2026-09-08. Implementation: `0edbf1c916706c0c30640bc59a089f02276b527c`.

## Safety and scope

Repository root: `/Users/noe/Documents/GitHub/BM-BMP-website`.
Branch: `feat/bm-gateway-tunnel-v2`.
Remote: `https://github.com/Noe-09/BM-BMP-website.git`.
Before implementation, the tree was clean and fetch confirmed local and remote both at `4c463ec3521d45e75f469707d2d7c1f2ea08e8a6` (0 ahead / 0 behind).

No main work, merge, PR, push, production-page edit, dependency addition, or deployment was performed. The existing hourly automation remains paused. The previous Vercel preview still represents the previous cinematic pass until this branch is deployed separately.

## Diagnosis

The old environment repeated a rounded mass vocabulary at near, middle, and far distances. The same smooth curvature and pale albedo dominated every chapter. Even the Core's depth exchange was contained within ceramic-looking cavities. More objects or optical intensity could not provide the missing silhouette contrast.

The breakthrough therefore changes the architecture itself: a soft shell reveals an angular interior, the interior breaks into opposing layered sections, and the sections physically part to expose the destination.

## Replaced versus preserved

| System | Result |
| --- | --- |
| Rounded vault/shelf/carved-core assembly and miniature echoes | Replaced in the active scene graph by six tectonic sections, a complementary core pair, and three asymmetric distant structural returns. |
| Geometry | New bevelled polygonal cavity generator, with four physical laminae per fracture section and seven per core half. Each section is merged into one static buffer; no mesh per lamina. |
| Soft shell vocabulary | Retained using the existing vault generator, with newly authored movement that parts the shell vertically and laterally. |
| Far environment field | Added a shallow concave light receiver at 122m. Caustic contours are attached to its local coordinates, seen through actual architecture. |
| Materials and color | Architectural graphite/cut-face response added to the shared environment material family; real bevels and depth sections carry cyan/coral/amber energy. Pearl haze conceals the early architecture, then resolves its depth during rupture. |
| Optical encounters | Same two bounded events and existing refraction capture infrastructure. |
| Normalized journey and controller | Unchanged, including autoplay speed, input gain, idle timing, final pause, and rewind behavior. |
| Camera choreography and chapter mapper | Unchanged. The environment supplies the stronger spatial events. |
| BM Visuals/BMP Technical entities and interaction | Unchanged geometry, shader, reveal, pointer, selection, and navigation implementation. |
| Review tooling | Added .54, .74, .86, .96 buttons to the development-only paused-frame review. |

The retired carved-geometry source remains available for history, but is no longer imported into the active environment.

## Progress ownership and events

`GatewayPrototype` still owns the journey controller, whose target/render progress contract is unchanged. The scene consumes its displayed progress. `deriveBreakthroughFrame(progress)` supplies environment-only values; it cannot mutate navigation or controller state. All transforms are assigned from scratch on every update, and all material parameters reconstruct from progress. Optical energy is consumed from the approved authored velocity-derived cinematic profile. Raw wheel input never enters a shader or optical-energy calculation.

1. **Pearl shell / 0–.18:** quiet luminous opening with submerged architectural hints. Existing smooth boundary surfaces frame the aperture.
2. **Spectral fracture / .18–.50:** the shell parts over a sustained entry. Six oblique wall sections resolve into layered cuts. The early wonder moment is the newly exposed sectional depth around .34.
3. **Black impossible core / .50–.80:** nearly black faces separate from cyan and coral/amber cut walls. Between .54 and .74 the core halves exchange actual depth order while perspective-compensated scale and opposing tilts expose contradictory nested openings. At .74 their yaw difference exceeds 1.5 radians.
4. **White release / .80–.96:** sections rotate and move laterally; the core halves withdraw by 40m each at full release. The dark light field clears while the real aperture widens. At .86 the entities are first clearly readable; by .90 the large walls are peripheral.
5. **Final revelation / .96–1:** original heroes stand in a luminous, open field with quiet distant architectural residue. Final controls retain their existing semantics.

The controller's approximately 26-second authored journey was retained. The deeper entry is made legible through a sustained structural event rather than another global speed reduction.

## Browser review

Inspected paused frames at 0, .08, .16, .25, .34, .46, .58, .68, .74, .78, .86, .90, and 1; sampled all authored boundaries in pure tests. Saved five representative frames with the review progress visible:

- [Origin](../reviews/breakthrough/origin.png)
- [Spectral fracture](../reviews/breakthrough/fracture.png)
- [Impossible core](../reviews/breakthrough/core.png)
- [White release](../reviews/breakthrough/release.png)
- [Final revelation](../reviews/breakthrough/final.png)

The first review was rejected internally: a shell crossed the destination sightline and the architectural faces were too flat. Corrections changed shell withdrawal direction, opened the main apertures, built solid stepped sections, localized the reflected light, reduced broad engraving, and cleared the final chamber more decisively. The final reviewed sequence has distinct silhouette and contrast states rather than a uniformly pale smooth tunnel.

Browser verification on local Chromium:

- Normal autoplay: approximately 26.103 seconds from first sampled movement to exact `1`, followed by a verified 1.2-second stationary pause.
- One reverse wheel impulse: `1 → .865`, preserving Visuals selection and URL.
- One forward wheel impulse: `.865 → .99946` within 650ms, subsequently settling at exact `1`.
- Four reverse impulses: `1 → .46229`; logical preview stayed Visuals and the URL stayed unchanged.
- Idle resume: returned from that rewind to exact `1` with the same preview and URL.
- Both original hover/reveal behaviors inspected. Technical link reached `/gateway-prototype/technical`; Visuals link reached `/`.
- Reduced-motion media query verified true: ready scene at exact `1`, split selection state, no error overlay.
- 393×852 mobile viewport at DPR3: Core and final pair inspected, both heroes visible. This preset reported `pointer:coarse=false`, so it is a framing check rather than certification of physical touch hardware.
- No application console errors, shader compilation errors, WebGL errors, or framework error overlays observed. Console contained React development/HMR notices only.

## Determinism and performance

The tests snapshot every numeric/material uniform, position, rotation, scale, and visibility after forward, reverse, and shuffled progress samples. They verify actual core depth inversion, the shell opening, release separation, bounded optical encounters, final hero ray clearance, finite geometry, unit normals, unchanged buffers across updates, and one-time disposal of shared resources.

| Measure | Result |
| --- | --- |
| Scene environment meshes | 16, including two bounded optical meshes |
| Unique environment geometry buffers | 14 |
| Allocated environment triangles | 62,660 |
| All environment meshes submitted once | 62,972 triangles |
| Core at .68, capture + main | 29 draws / 82,936 triangles |
| Final, including heroes | 26 draws / 45,980 triangles |
| 180-frame Core sample, 1280×633 | Median 16.7ms, p95 16.8ms, zero intervals over 25ms |
| Additional render targets | None |

For context, checkpoint 15 recorded 324,035 allocated environment triangles, a Core sample of 25 draws / 691,078 triangles, and final 26 draws / 350,531 triangles. These are scene samples rather than a controlled GPU benchmark. The new Core uses four more draws in the sampled optical state but substantially fewer triangles. Frame timing remains vsync-limited; no unsupported GPU-speed claim is made.

## Automated verification

- `node --test tests/*.test.mjs`: **98 passed, 0 failed**.
- `tsc --noEmit --incremental false`: passed.
- `eslint .`: passed.
- `next build --webpack`: passed, all static routes generated.
- `git diff --check`: passed.
- Frozen diff against `4c463ec`: empty for `app/page.tsx`, `lib/gateway/state.ts`, `navigation.ts`, `progress.ts`, and `entities/**`.
- Additional preserved-path audit: empty for journey controller, chapter mapper, camera choreography, and `GatewayPrototype.tsx`.

## Remaining limitations

Broad architectural faces use analytic reflection and local shading, not physically traced illumination or true volumetrics. Their large-scale softness can still read as computer-rendered in a static close-up. The stepped structural vocabulary is deliberately dominant in the Core; final artistic acceptance remains a visual review judgment, not something the test count proves. No physical Safari/low-end phone thermal or sustained GPU test was performed. No new deployed preview was created in this pass.

Implementation and required local verification are complete. `AUTO-CONTINUE.md` is DONE; the final documentation commit follows the implementation commit referenced above.
