# Checkpoint 06: Dual Entity Selection

## Concept Overview
Evolved the "Collapsed Field" abstract selection into two distinct 3D manifestations:
1. **BM VISUALS**: An orb-like creative sphere (using `SphereGeometry`) located in the lower-left. On hover, the outer shell fractures and dissolves to reveal dreamy, refracted glimpses inside.
2. **BMP TECHNICAL**: A structural monolith pillar (using `BoxGeometry`) located in the upper-right. On hover, the structure resolves into precise metallic segmentations.

## Implementation Details

### `livingMatterSystem.ts`
- Replaced the abstract `PlaneGeometry` meshes with `SphereGeometry(5.5, 64, 64)` and `BoxGeometry(3.5, 14, 3.5, 32, 64, 32)`.
- Re-positioned the attractors to lower-left (`-4.5, 2.0, -16.0`) and upper-right (`4.5, -2.0, -16.0`) to avoid mirroring.
- Injected `aEntityType` vertex attribute to distinguish geometries (0 = environment, 1 = Visuals, 2 = Technical).

### `livingMatterShader.ts`
- **Vertex Shader**: Passed `aEntityType` as `vEntityType`. Added intense noise displacement for the Visuals orb on hover, and strict Y-axis segment quantization for the Technical monolith on hover.
- **Fragment Shader**: Applied specific visual behaviors on hover using `vEntityType`. The Visuals orb dissolves its outer shell based on spatial noise, exposing glowing backfaces. The Technical monolith sharpens its specularity and introduces rigid metallic striations.

### CSS Typography (`gateway.css`)
- Adjusted `gateway-selection__division` absolute positioning to float around the 3D entities.
- **Visuals** typography anchors to the lower-left (`bottom: clamp(...)`, `left: clamp(...)`).
- **Technical** typography anchors to the upper-right (`top: clamp(...)`, `right: clamp(...)`).
- Removed all remnants of grid-based, symmetrical panel layouts.

## Verification
- 73 tests passed.
- Typecheck (`tsc --noEmit`) passed.
- ESLint passed.
- Next.js Turbopack build succeeded.
