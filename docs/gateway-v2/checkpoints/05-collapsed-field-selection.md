# Checkpoint 05: Collapsed Field Selection (Signature Level C)

## Review Status
**PENDING HUMAN VISUAL REVIEW**

---

## 1. Neutral Composition: Asymmetric Collapsed Field
- Completely dissolves the rejected 50/50 two-panel split, horizontal dividers, and symmetrical baselines.
- Viewport becomes one continuous 3D spatial field (`perspective: 1200px`) embedding two spatially and behaviorally differentiated attractors:
  - **BM VISUALS Attractor**: Positioned in the upper/mid-left quadrant with an elevated baseline, floating on a forward spatial plane surrounded by generous negative space.
  - **BMP TECHNICAL Attractor**: Positioned in the lower/mid-right quadrant with a grounded baseline, weighted and structured along an offset axis.
  - **Hero Field Center**: Occupied by a sculptural non-Euclidean Living Matter manifold with continuous curvature and anisotropic mineral sheen bridging the two poles, eliminating empty dead space.
  - **BM System Anchor**: Minimal, quiet phase coordinate (`.gateway-core-mark`) embedded directly into the living field topology as the origin of reorganization.

---

## 2. BM Visuals Composition (Active State)
- **Physical Rule Set**: RELAXATION, EXPANSION, CONTINUITY, DIFFUSION, OPENNESS.
- Visuals typography moves forward into the foreground (`translate3d(0, 0, 48px) scale(1.03)`), commanding the upper-left spatial plane.
- Living matter unfolds outward, broadening curvature radii and bathing the field in warm ivory/pearl luminescence with increased subsurface scattering.
- Technical recedes into deeper field folds (`translate3d(14px, 12px, -60px) scale(0.92)`), losing spatial priority through optical depth and non-Euclidean curvature rather than a simple 2D opacity fade.

---

## 3. BMP Technical Composition (Active State)
- **Physical Rule Set**: TENSION, ALIGNMENT, STRUCTURE, RESOLUTION, CONTROLLED COMPRESSION.
- Technical typography resolves closer and sharper into the foreground (`translate3d(0, 0, 44px) scale(1.02)`), aligning along a structured axis.
- Living matter self-aligns into quantized planar facets and tensioned diagonal seams with crisp steel-mineral sheen.
- Visuals recedes into broad, unresolved background sheets (`translate3d(-14px, -12px, -60px) scale(0.92)`).

---

## 4. State Switch Transition & Instability Event (Signature Level C)
- Moving between Visuals and Technical is not a crossfade or linear interpolation.
- State transitions trigger an unstable phase event (~350–500ms):
  1. The central singularity releases a radial topological inversion pulse through the Living Matter vertex shader (`uInstability`).
  2. The material flashes with a momentary non-Euclidean chromatic dispersion fringe.
  3. Spatial hierarchy momentarily collapses before re-forming under the new attractor's geometric rule set.

---

## 5. Information Reveal Strategy
- **Neutral State**:
  - Division titles ("BM VISUALS", "BMP TECHNICAL") and discipline descriptors ("Creative / Digital Experience", "Technology / AI Systems") are clearly established.
  - Supporting copy lines and CTAs remain **dormant** (`opacity: 0; pointer-events: none; transform: translateY(0.65rem)`), eliminating the "pricing / comparison table" feel.
- **Active Attractor Reveal**:
  - Visuals active: Line 1 reveals at 240ms, Line 2 at 340ms, and `ENTER VISUALS ↗` CTA at 380ms.
  - Technical active: Line 1 reveals at 200ms, Line 2 at 280ms, and `ENTER TECHNICAL ↗` CTA at 340ms.
  - Receding attractor copy remains dormant.

---

## 6. Reduced-Motion Behavior
- When `prefers-reduced-motion: reduce` is active:
  - The asymmetric spatial layout (upper-left Visuals vs lower-right Technical) is fully preserved.
  - 3D spatial motion, topological displacement oscillations, and instability waves are eliminated.
  - Active attractor contrast is communicated through clear editorial hierarchy and subtle lighting bias without motion spectacle.

---

## 7. Files Changed
- `components/gateway/SelectionOverlay.tsx`: Rebuilt DOM to support the open asymmetric 3D spatial field, phase anchor, and depth-stratified attractors while maintaining full semantic link and keyboard accessibility.
- `app/gateway-prototype/gateway.css`: Rebuilt selection CSS with perspective transforms, asymmetric positioning, neutral state dormancy, and staggered attractor reveals.
- `lib/gateway/matter/livingMatterShader.ts`: Implemented hero center manifold bridge, distinct Visuals expansion / Technical crystallization equations, and side-switch instability wave.
- `lib/gateway/matter/livingMatterSystem.ts`: Sculpted 3D Central Hero Manifold and asymmetric attractor groups for rich center composition at selection depth (`cameraZ = -18`).
- `docs/gateway-v2/checkpoints/05-collapsed-field-selection.md`: Checkpoint documentation.

---

## 8. Frozen Engine Contracts (Strictly Untouched)
- `lib/gateway/state.ts`: UNTOUCHED
- `lib/gateway/navigation.ts`: UNTOUCHED
- `lib/gateway/progress.ts`: UNTOUCHED
- `app/page.tsx`: UNTOUCHED

---

## 9. Verification Results
- **Node Test Suite**: 73 passing, 0 failing (`npm test`)
- **Lint**: 0 errors (`npm run lint`)
- **Typecheck**: 0 errors (`npm run typecheck`)
- **Build**: Next.js 16.3.1 Turbopack build succeeded with all static routes

---

## 10. Known Visual Weakness
- On very narrow mobile viewports (<360px), the vertical distance between the upper-left Visuals attractor and lower-right Technical attractor requires tight padding to prevent overlapping with the center Living Matter core.
