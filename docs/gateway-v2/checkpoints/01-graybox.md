# V2.1 Graybox

## Generator

- `tools/blender/build_gateway_v2.py`
- Blender executable: `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe`
- Blender version: 5.2.0 LTS (build fbe6228777e7)

## Renders

- `renders/01-entry.png` (946K)
- `renders/02-threshold.png` (1.1M)
- `renders/03-gallery.png` (884K)
- `renders/04-core.png` (1012K)
- `renders/05-split.png` (796K)

## Geometry parameters

```python
PARAMS = {
    "overall_depth": 40.0,
    "entry_width": 9.0,
    "gallery_width": 10.5,
    "compressed_ceiling": 3.6,
    "open_ceiling": 6.0,
    "gallery_left_angle_deg": 3.0,
    "gallery_right_angle_deg": -5.0,
    "monolith_height": 6.2,
    "monolith_width": 2.0,
    "monolith_depth": 2.6,
    "split_width": 18.0,
}
```

## Semantic scene

### Collections (9)
- BM_GATEWAY
- GEO_STATIC
- ENTRY
- GALLERY
- CORE
- VISUALS
- TECHNICAL
- LIGHT_GUIDES
- EXPORT

### Required semantic objects (14)

**Entry:**
- `entry_foreground_slab` at (-1.20, 14.00, 2.52)
- `entry_overhead` at (0.00, 11.00, 4.00)

**Gallery:**
- `gallery_wall_left` at (-4.95, 5.00, 1.80)
- `gallery_wall_oblique` at (2.80, 1.50, 2.70)
- `gallery_ceiling` at (0.20, 4.00, 3.80)
- `gallery_light_cut` at (1.20, 0.80, 3.00)

**Core:**
- `core_monolith` at (0.15, -8.00, 3.10)

**Visuals:**
- `visuals_root` at (-7.00, -16.00, 0.00)
- `visuals_aperture_outer` at (-5.50, -18.50, 2.88)
- `visuals_aperture_inner` at (-3.80, -20.00, 2.52)

**Technical:**
- `technical_root` at (7.00, -16.00, 0.00)
- `technical_aperture_outer` at (5.20, -18.00, 2.70)
- `technical_aperture_inner` at (3.50, -19.20, 2.40)
- `technical_aperture_cut` at (5.00, -20.50, 1.50)

### Review cameras (5)

- `CAM_ENTRY` at (-0.35, 12.00, 1.55) FOV=42.0°
- `CAM_THRESHOLD` at (0.40, 8.00, 1.80) FOV=42.0°
- `CAM_GALLERY` at (-1.80, 3.20, 2.00) FOV=41.0°
- `CAM_CORE` at (0.80, -4.00, 2.20) FOV=42.0°
- `CAM_SPLIT` at (0.00, -14.00, 3.00) FOV=43.0°

## Determinism verification

Second run produced identical:
- Collection structure: ✓
- Semantic object names: ✓
- Object transforms: ✓
- Camera transforms: ✓
- Camera FOV values: ✓

## Self-review

### Strongest frame
**03-gallery.png (THE CUT)** — The oblique foreground plane creates strong compositional depth with clear foreground/midground/background hierarchy. The light cut guide placement successfully reserves architectural space for future lighting. Asymmetric framing avoids centered symmetry.

### Weakest frame
**02-threshold.png (COMPRESSION)** — While the compressed ceiling and non-parallel walls are present, the composition reads slightly more pedestrian than the other shots. The architectural compression intent is structurally correct but could benefit from stronger camera angle or additional foreground occlusion in refinement.

### Composition concerns for human review

1. **Entry slab scale**: The foreground slab occupies substantial frame space and creates spatial ambiguity as intended, but verify it doesn't read as accidentally cropping the view rather than deliberate architectural framing.

2. **Monolith discovery timing**: The core monolith is positioned slightly off-center for gradual discovery. Confirm the offset reads as intentional reveal choreography rather than misalignment.

3. **Visuals vs Technical asymmetry**: Technical side uses tighter apertures and nested cuts while Visuals uses broader planes and larger negative space. Verify this geometric distinction is legible in neutral graybox without relying on future lighting/materials to establish the difference.

4. **Overall scale perception**: Using ~40m depth with 6.2m monolith height. Confirm the space reads as monumental architecture rather than interior corridor scale.

5. **FOV range**: Using 41-43° range (mostly 42°). This avoids game-camera wide-angle distortion but verify it provides sufficient architectural context without feeling constrained.

## Review status

**PENDING HUMAN REVIEW**
