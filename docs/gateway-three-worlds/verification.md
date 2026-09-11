# BM Gateway — Three Worlds Verification

Verified locally on 2026-09-11 from branch `feat/bm-gateway-three-worlds`.

## Automated verification

- `node --test --test-concurrency=1 tests/*.test.mjs`: 142 passed, 0 failed.
- `tsc --noEmit`: passed.
- `eslint .`: passed with 0 errors and 0 warnings.
- `next build --webpack`: passed; all 12 app routes and four static case-study paths generated successfully.
- Gateway journey, chapter, environment, breakthrough, state, briefing, navigation, markup, and presentation regression suites all passed.

The default local Turbopack build did not advance beyond “Creating an optimized production build” in this manually provisioned worktree. The dependency installer had reported a skipped native `unrs-resolver` build. The stalled process was stopped and the supported Next.js Webpack build completed in 2.6 seconds. This is recorded as an environment-specific limitation for the preview deployment to validate independently.

## Performance

Baseline (1280×720 neutral): 26 draw calls; 45,980 triangles; refraction inactive.

Final (1280×720 neutral): 36 draw calls; 47,280 triangles; refraction inactive. This stays within the approved final-chamber ceiling of 38 draw calls and 65,000 triangles.

At a settled destination decision, the scene reported 34 draw calls and 45,948 triangles. At 390×844, the Creator decision reported 22 draw calls and 37,736 triangles. The preserved Impossible Core at master progress `0.68` reported 29 draw calls and 82,936 triangles with refraction active; that temporary double-pass event is part of the approved Tunnel Ver 4 and is outside the neutral-chamber target.

## Visual review

The following states were captured and inspected at 1280×720 in headless Chromium with WebGL enabled:

- passage/deep tunnel at master progress `0.46`;
- Impossible Core at master progress `0.68`;
- chamber arrival and neutral three-world chamber;
- BM Visual, BMP Creator, and BM Tech hover previews;
- Creator briefing at mid-transition;
- BM Visual, BMP Creator, and BM Tech final decision compositions;
- Go Back reversal to the neutral chamber.

Tunnel Ver 4 retains its existing geometry, palette, event sequence, darkness, refraction event, and normalized journey behavior. BM Visual’s existing Fabriclism/Aurelia/Haven preview system is perceptible during hover and selection while remaining mostly obscured at neutral. The selected worlds occupy the left visual field without awkward desktop cropping; receded peers move outward and into depth so the right editorial copy remains readable.

The narrow review used a 390×844 touch-emulated viewport. All three neutral identities remained selectable, the Creator briefing content and decision controls stayed within the viewport, and the final control bottom was 828px within the 844px viewport.

## Interaction and accessibility review

- Pointer hover and keyboard focus reveal only the canonical one-line destination headline.
- Touch first activation leaves the Gateway in `preview`; a second activation enters `briefing`.
- Destination selection focuses the semantic briefing heading.
- Escape during timed briefing reverses only briefing progress and restores focus to the previously selected destination.
- At decision, Tab reaches `GO BACK` and then the real `CONTINUE →` anchor in logical order.
- Go Back reconstructed the neutral chamber without rewinding master journey progress.
- Reduced-motion mode reached Creator decision quickly while retaining the canonical description, Go Back, and `/creator` Continue link.
- A forced WebGL initialization failure exposed three useful canonical fallback links: `/bm-visual`, `/bm-tech`, and `/creator`.
- An ordinary enhanced Continue completed the exit and reached `/bm-tech`; `bmGatewaySeen` was set to `1`; no runtime or WebGL console errors were observed.
- Automated navigation tests cover keyboard/native activation, modified clicks, middle/right clicks, explicit target/download behavior, reduced motion, enhancement availability, duplicate commit locking, and pathname fallback.

## Known weaknesses

- The local default Turbopack production build could not be used because the manually installed dependency tree omitted a native resolver build. The clean Webpack production build and Vercel preview check are the authoritative build validations for this branch.
- Browser performance counts were collected in headless Chromium using software WebGL. They verify scene budget structure, not frame timing on representative physical GPUs.
- Final visual approval remains required before merge, as requested in the feature brief.
