"""
BM Gateway V2 Graybox Generator
Deterministic architectural scene generator for gateway tunnel V2.
Uses Blender built-in bpy only.
"""

import bpy
import math
from mathutils import Vector, Euler

# ============================================================================
# PARAMETERS
# ============================================================================

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

# Collection names
COLLECTIONS = [
    "BM_GATEWAY",
    "GEO_STATIC",
    "ENTRY",
    "GALLERY",
    "CORE",
    "VISUALS",
    "TECHNICAL",
    "LIGHT_GUIDES",
    "EXPORT",
]

# Required semantic objects
REQUIRED_OBJECTS = [
    "entry_foreground_slab",
    "entry_overhead",
    "gallery_wall_left",
    "gallery_wall_oblique",
    "gallery_ceiling",
    "gallery_light_cut",
    "core_monolith",
    "visuals_root",
    "visuals_aperture_outer",
    "visuals_aperture_inner",
    "technical_root",
    "technical_aperture_outer",
    "technical_aperture_inner",
    "technical_aperture_cut",
]

# Camera names
CAMERAS = [
    "CAM_ENTRY",
    "CAM_THRESHOLD",
    "CAM_GALLERY",
    "CAM_CORE",
    "CAM_SPLIT",
]

# ============================================================================
# SCENE SETUP
# ============================================================================

def reset_scene():
    """Clean slate: remove all default objects."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

    # Remove default collections
    for col in list(bpy.data.collections):
        bpy.data.collections.remove(col)

    print("Scene reset complete")

def create_collections():
    """Create semantic collection hierarchy."""
    scene = bpy.context.scene

    for col_name in COLLECTIONS:
        col = bpy.data.collections.new(col_name)
        scene.collection.children.link(col)

    print(f"Created {len(COLLECTIONS)} collections")

def get_collection(name):
    """Get collection by name."""
    return bpy.data.collections.get(name)

# ============================================================================
# MATERIALS
# ============================================================================

def create_materials():
    """Create neutral clay materials for graybox."""
    # Main graphite/mineral clay
    mat_clay = bpy.data.materials.new(name="MAT_Clay")
    mat_clay.use_nodes = True
    nodes = mat_clay.node_tree.nodes
    nodes.clear()

    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.18, 0.18, 0.19, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.95
    bsdf.inputs['Metallic'].default_value = 0.0

    output = nodes.new('ShaderNodeOutputMaterial')
    mat_clay.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    # Pale guide material for light cut
    mat_guide = bpy.data.materials.new(name="MAT_LightGuide")
    mat_guide.use_nodes = True
    nodes = mat_guide.node_tree.nodes
    nodes.clear()

    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Base Color'].default_value = (0.45, 0.45, 0.46, 1.0)
    bsdf.inputs['Roughness'].default_value = 0.92
    bsdf.inputs['Metallic'].default_value = 0.0

    output = nodes.new('ShaderNodeOutputMaterial')
    mat_guide.node_tree.links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    print("Created 2 materials: MAT_Clay, MAT_LightGuide")

    return mat_clay, mat_guide

# ============================================================================
# GEOMETRY HELPERS
# ============================================================================

def create_plane_mesh(name, width, height, collection_name, material):
    """Create a simple plane mesh."""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)

    # Create vertices for a plane
    verts = [
        (-width/2, -height/2, 0),
        (width/2, -height/2, 0),
        (width/2, height/2, 0),
        (-width/2, height/2, 0),
    ]
    faces = [(0, 1, 2, 3)]

    mesh.from_pydata(verts, [], faces)
    mesh.update()

    # Assign material
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)

    # Link to collection
    col = get_collection(collection_name)
    col.objects.link(obj)

    return obj

def create_box_mesh(name, width, height, depth, collection_name, material):
    """Create a box mesh."""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)

    # Create box vertices
    w, h, d = width/2, height/2, depth/2
    verts = [
        (-w, -d, -h), (w, -d, -h), (w, d, -h), (-w, d, -h),  # bottom
        (-w, -d, h), (w, -d, h), (w, d, h), (-w, d, h),      # top
    ]
    faces = [
        (0, 1, 2, 3), (4, 7, 6, 5),  # bottom, top
        (0, 4, 5, 1), (1, 5, 6, 2),  # front, right
        (2, 6, 7, 3), (3, 7, 4, 0),  # back, left
    ]

    mesh.from_pydata(verts, [], faces)
    mesh.update()

    # Assign material
    if obj.data.materials:
        obj.data.materials[0] = material
    else:
        obj.data.materials.append(material)

    # Link to collection
    col = get_collection(collection_name)
    col.objects.link(obj)

    return obj

# ============================================================================
# ARCHITECTURAL GEOMETRY
# ============================================================================

def build_entry(mat_clay):
    """Build entry architecture: VOID composition."""
    p = PARAMS

    # Massive foreground slab (occupies significant frame)
    slab = create_plane_mesh(
        "entry_foreground_slab",
        width=p["entry_width"] * 1.4,
        height=p["open_ceiling"] * 0.85,
        collection_name="ENTRY",
        material=mat_clay
    )
    slab.location = Vector((-1.2, 14.0, p["open_ceiling"] * 0.42))
    slab.rotation_euler = Euler((math.radians(90), 0, math.radians(-8)), 'XYZ')

    # Low overhead compression
    overhead = create_plane_mesh(
        "entry_overhead",
        width=p["entry_width"],
        height=6.0,
        collection_name="ENTRY",
        material=mat_clay
    )
    overhead.location = Vector((0, 11.0, p["compressed_ceiling"] + 0.4))
    overhead.rotation_euler = Euler((math.radians(8), 0, 0), 'XYZ')

    print("Built ENTRY architecture")

def build_gallery(mat_clay, mat_guide):
    """Build gallery architecture: COMPRESSION + CUT."""
    p = PARAMS

    # Left wall with slight angle
    wall_left = create_plane_mesh(
        "gallery_wall_left",
        width=12.0,
        height=p["compressed_ceiling"],
        collection_name="GALLERY",
        material=mat_clay
    )
    wall_left.location = Vector((-p["gallery_width"]/2 + 0.3, 5.0, p["compressed_ceiling"]/2))
    wall_left.rotation_euler = Euler((0, 0, math.radians(90 + p["gallery_left_angle_deg"])), 'XYZ')

    # Dominant oblique plane (THE CUT composition)
    wall_oblique = create_plane_mesh(
        "gallery_wall_oblique",
        width=8.5,
        height=p["open_ceiling"] * 0.9,
        collection_name="GALLERY",
        material=mat_clay
    )
    wall_oblique.location = Vector((2.8, 1.5, p["open_ceiling"] * 0.45))
    wall_oblique.rotation_euler = Euler((math.radians(82), 0, math.radians(-35)), 'XYZ')

    # Gallery ceiling (transitioning height)
    ceiling = create_plane_mesh(
        "gallery_ceiling",
        width=p["gallery_width"],
        height=10.0,
        collection_name="GALLERY",
        material=mat_clay
    )
    ceiling.location = Vector((0.2, 4.0, p["compressed_ceiling"] + 0.2))
    ceiling.rotation_euler = Euler((math.radians(-4), 0, 0), 'XYZ')

    # Light cut guide (architectural slot for future light blade)
    light_cut = create_plane_mesh(
        "gallery_light_cut",
        width=0.35,
        height=7.0,
        collection_name="LIGHT_GUIDES",
        material=mat_guide
    )
    light_cut.location = Vector((1.2, 0.8, p["open_ceiling"] * 0.5))
    light_cut.rotation_euler = Euler((math.radians(88), 0, math.radians(12)), 'XYZ')

    print("Built GALLERY architecture")

def build_core(mat_clay):
    """Build core architecture: MONOLITH REVEAL."""
    p = PARAMS

    # Central monolith (massive, slightly offset initial discovery)
    monolith = create_box_mesh(
        "core_monolith",
        width=p["monolith_width"],
        height=p["monolith_height"],
        depth=p["monolith_depth"],
        collection_name="CORE",
        material=mat_clay
    )
    monolith.location = Vector((0.15, -8.0, p["monolith_height"]/2))

    print("Built CORE architecture")

def build_visuals(mat_clay):
    """Build VISUALS side: gallery philosophy."""
    p = PARAMS

    # Visuals root (organizational parent)
    root = bpy.data.objects.new("visuals_root", None)
    root.empty_display_type = 'PLAIN_AXES'
    root.empty_display_size = 0.5
    root.location = Vector((-p["split_width"]/2 + 2.0, -16.0, 0))
    get_collection("VISUALS").objects.link(root)

    # Broad outer aperture
    aperture_outer = create_plane_mesh(
        "visuals_aperture_outer",
        width=7.5,
        height=p["open_ceiling"] * 0.95,
        collection_name="VISUALS",
        material=mat_clay
    )
    aperture_outer.location = Vector((-p["split_width"]/2 + 3.5, -18.5, p["open_ceiling"] * 0.48))
    aperture_outer.rotation_euler = Euler((0, math.radians(88), 0), 'XYZ')

    # Inner frame (softer, larger negative space)
    aperture_inner = create_plane_mesh(
        "visuals_aperture_inner",
        width=6.0,
        height=p["open_ceiling"] * 0.7,
        collection_name="VISUALS",
        material=mat_clay
    )
    aperture_inner.location = Vector((-p["split_width"]/2 + 5.2, -20.0, p["open_ceiling"] * 0.42))
    aperture_inner.rotation_euler = Euler((0, math.radians(84), math.radians(-3)), 'XYZ')

    print("Built VISUALS architecture")

def build_technical(mat_clay):
    """Build TECHNICAL side: structural philosophy (NOT mirrored)."""
    p = PARAMS

    # Technical root (organizational parent)
    root = bpy.data.objects.new("technical_root", None)
    root.empty_display_type = 'PLAIN_AXES'
    root.empty_display_size = 0.5
    root.location = Vector((p["split_width"]/2 - 2.0, -16.0, 0))
    get_collection("TECHNICAL").objects.link(root)

    # Tighter outer aperture
    aperture_outer = create_plane_mesh(
        "technical_aperture_outer",
        width=6.2,
        height=p["open_ceiling"] * 0.85,
        collection_name="TECHNICAL",
        material=mat_clay
    )
    aperture_outer.location = Vector((p["split_width"]/2 - 3.8, -18.0, p["open_ceiling"] * 0.45))
    aperture_outer.rotation_euler = Euler((0, math.radians(-86), 0), 'XYZ')

    # Nested inner plane (tighter aperture logic)
    aperture_inner = create_plane_mesh(
        "technical_aperture_inner",
        width=5.0,
        height=p["open_ceiling"] * 0.68,
        collection_name="TECHNICAL",
        material=mat_clay
    )
    aperture_inner.location = Vector((p["split_width"]/2 - 5.5, -19.2, p["open_ceiling"] * 0.40))
    aperture_inner.rotation_euler = Euler((0, math.radians(-88), math.radians(2)), 'XYZ')

    # Structural cut (precise offset)
    aperture_cut = create_plane_mesh(
        "technical_aperture_cut",
        width=4.2,
        height=2.8,
        collection_name="TECHNICAL",
        material=mat_clay
    )
    aperture_cut.location = Vector((p["split_width"]/2 - 4.0, -20.5, p["open_ceiling"] * 0.25))
    aperture_cut.rotation_euler = Euler((math.radians(8), math.radians(-85), math.radians(5)), 'XYZ')

    print("Built TECHNICAL architecture")

# ============================================================================
# CAMERAS
# ============================================================================

def create_camera(name, location, rotation_euler, fov_deg=42):
    """Create a camera with specific composition."""
    cam_data = bpy.data.cameras.new(name)
    cam_data.lens_unit = 'FOV'
    cam_data.angle = math.radians(fov_deg)

    cam_obj = bpy.data.objects.new(name, cam_data)
    cam_obj.location = location
    cam_obj.rotation_euler = rotation_euler

    # Link to scene
    bpy.context.scene.collection.objects.link(cam_obj)

    return cam_obj

def build_cameras():
    """Create five review cameras with deliberate composition."""

    # CAM_ENTRY: THE VOID - asymmetric, spatially ambiguous
    cam_entry = create_camera(
        "CAM_ENTRY",
        location=Vector((-0.35, 12.0, 1.55)),
        rotation_euler=Euler((math.radians(90), 0, math.radians(-178)), 'XYZ'),
        fov_deg=42
    )

    # CAM_THRESHOLD: COMPRESSION - moving through compressed architecture
    cam_threshold = create_camera(
        "CAM_THRESHOLD",
        location=Vector((0.4, 8.0, 1.8)),
        rotation_euler=Euler((math.radians(88), 0, math.radians(-175)), 'XYZ'),
        fov_deg=42
    )

    # CAM_GALLERY: THE CUT - dominant oblique foreground, campaign still
    cam_gallery = create_camera(
        "CAM_GALLERY",
        location=Vector((-1.8, 3.2, 2.0)),
        rotation_euler=Euler((math.radians(85), 0, math.radians(-168)), 'XYZ'),
        fov_deg=41
    )

    # CAM_CORE: MONOLITH REVEAL - edge/silhouette, gradual discovery
    cam_core = create_camera(
        "CAM_CORE",
        location=Vector((0.8, -4.0, 2.2)),
        rotation_euler=Euler((math.radians(88), 0, math.radians(-182)), 'XYZ'),
        fov_deg=42
    )

    # CAM_SPLIT: THE DIVIDE - architectural climax, asymmetric balance
    cam_split = create_camera(
        "CAM_SPLIT",
        location=Vector((0.0, -14.0, 3.0)),
        rotation_euler=Euler((math.radians(95), 0, math.radians(-180)), 'XYZ'),
        fov_deg=43
    )

    print(f"Created {len(CAMERAS)} review cameras")

    return [cam_entry, cam_threshold, cam_gallery, cam_core, cam_split]

# ============================================================================
# LIGHTING
# ============================================================================

def setup_lighting():
    """Setup minimal preview lighting to read form only."""
    # Neutral world
    world = bpy.data.worlds.new("World_Neutral")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs[0].default_value = (0.05, 0.05, 0.05, 1.0)
    world.node_tree.nodes["Background"].inputs[1].default_value = 0.3
    bpy.context.scene.world = world

    # Simple key light
    light_data = bpy.data.lights.new(name="KEY_Light", type='AREA')
    light_data.energy = 150
    light_data.size = 4.0
    light_obj = bpy.data.objects.new("KEY_Light", light_data)
    light_obj.location = Vector((5.0, 0, 8.0))
    light_obj.rotation_euler = Euler((math.radians(45), 0, math.radians(135)), 'XYZ')
    bpy.context.scene.collection.objects.link(light_obj)

    # Subtle fill
    fill_data = bpy.data.lights.new(name="FILL_Light", type='AREA')
    fill_data.energy = 60
    fill_data.size = 6.0
    fill_obj = bpy.data.objects.new("FILL_Light", fill_data)
    fill_obj.location = Vector((-6.0, -10.0, 5.0))
    fill_obj.rotation_euler = Euler((math.radians(60), 0, math.radians(-45)), 'XYZ')
    bpy.context.scene.collection.objects.link(fill_obj)

    print("Setup preview lighting")

# ============================================================================
# RENDERING
# ============================================================================

def setup_render():
    """Configure render settings for preview."""
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = 128
    scene.render.resolution_x = 1440
    scene.render.resolution_y = 900
    scene.render.film_transparent = False

    # Use GPU if available
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'CUDA'
    prefs.get_devices()
    for device in prefs.devices:
        device.use = True
    scene.cycles.device = 'GPU'

    print("Render settings configured: 1440x900, 128 samples")

def render_camera(camera, output_path):
    """Render from specific camera."""
    scene = bpy.context.scene
    scene.camera = camera
    scene.render.filepath = output_path
    bpy.ops.render.render(write_still=True)
    print(f"Rendered: {output_path}")

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    """Main execution flow."""
    print("=" * 70)
    print("BM GATEWAY V2 GRAYBOX GENERATOR")
    print("=" * 70)

    # Setup
    reset_scene()
    create_collections()
    mat_clay, mat_guide = create_materials()

    # Build architecture
    print("\n--- Building Architecture ---")
    build_entry(mat_clay)
    build_gallery(mat_clay, mat_guide)
    build_core(mat_clay)
    build_visuals(mat_clay)
    build_technical(mat_clay)

    # Setup cameras and lighting
    print("\n--- Setting Up Cameras & Lighting ---")
    cameras = build_cameras()
    setup_lighting()

    # Save blend file
    blend_path = "gateway-v2-preview.blend"
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"\nSaved: {blend_path}")

    # Render preview frames
    print("\n--- Rendering Preview Frames ---")
    setup_render()

    render_outputs = [
        ("CAM_ENTRY", "renders/01-entry.png"),
        ("CAM_THRESHOLD", "renders/02-threshold.png"),
        ("CAM_GALLERY", "renders/03-gallery.png"),
        ("CAM_CORE", "renders/04-core.png"),
        ("CAM_SPLIT", "renders/05-split.png"),
    ]

    for cam_name, output_path in render_outputs:
        cam = bpy.data.objects.get(cam_name)
        if cam:
            render_camera(cam, output_path)

    # Print deterministic scene summary
    print("\n" + "=" * 70)
    print("DETERMINISTIC SCENE SUMMARY")
    print("=" * 70)

    print("\nCollections:")
    for col_name in COLLECTIONS:
        print(f"  - {col_name}")

    print("\nRequired Semantic Objects:")
    for obj_name in REQUIRED_OBJECTS:
        obj = bpy.data.objects.get(obj_name)
        if obj:
            loc = obj.location
            print(f"  ✓ {obj_name:30s} at ({loc.x:6.2f}, {loc.y:6.2f}, {loc.z:6.2f})")
        else:
            print(f"  ✗ {obj_name} MISSING")

    print("\nReview Cameras:")
    for cam_name in CAMERAS:
        cam = bpy.data.objects.get(cam_name)
        if cam:
            loc = cam.location
            fov = math.degrees(cam.data.angle)
            print(f"  ✓ {cam_name:20s} at ({loc.x:6.2f}, {loc.y:6.2f}, {loc.z:6.2f}) FOV={fov:.1f}°")
        else:
            print(f"  ✗ {cam_name} MISSING")

    print("\nParameters:")
    for key, value in PARAMS.items():
        print(f"  {key:30s} = {value}")

    print("\n" + "=" * 70)
    print("GATEWAY V2 GRAYBOX GENERATION COMPLETE")
    print("=" * 70)

if __name__ == "__main__":
    main()
