"""Render the factory tour's 360° panoramas from the workshop Blender scene.

    blender -b "/path/to/Genr8 Building (3)Bevel test.blend" \
        --python scripts/render-tour-panoramas.py -- /path/to/output-folder [/path/to/Genr8 Building/Assets]

Needs Blender 5.2 or newer. Nothing is saved back to the .blend: the visibility
changes below exist only for this render session. Writes one 5120 x 2560 PNG per
stop; convert them with scripts/build-tour-panoramas.sh.

Keep STOPS in step with src/components/factory-tour/tour-stops.ts (x, y in metres).
"""
import math, os, sys, time
import bpy

STOPS = [
    ("entrance", 1.6, 7.3, 0), ("reception", -3.0, 7.3, 0), ("cnc", -0.5, 1.5, 0),
    ("machines", 0.8, -1.5, 0), ("back", -0.5, -6.0, 0),
    ("landing", -1.75, 6.2, 1), ("gallery", -1.75, 1.5, 1), ("walkway", 1.5, -2.2, 1),
    ("meeting", -1.6, -3.6, 1), ("printers", 2.2, -5.5, 1),
]
EYE_Z = {0: 1.6, 1: 4.35}  # ground floor is at z = 0.05, the mezzanine at z = 2.75
# The saved scene is set up for a top-down cutaway: these collections only cast light and
# shadow, and these furnishings are switched off. The tour needs them all on camera.
CAMERA_HIDDEN = {"Roof", "Triangle_Truss", "Support", "2ND Floor", "CeilingLight", "Celing Light 2"}
RENDER_HIDDEN = ("Table", "Chair", "First floor doors", "Some doors", "3d printer", "3d printer.001", "3d printer.002")

args = sys.argv[sys.argv.index("--") + 1:]
out_dir = args[0]
scene = bpy.context.scene
if len(args) > 1:
    bpy.ops.file.find_missing_files(directory=args[1])  # textures saved with Windows paths

def show(layer_collection):
    if layer_collection.name in CAMERA_HIDDEN: layer_collection.indirect_only = False
    if layer_collection.name == "Sidewalk": layer_collection.holdout = False
    for child in layer_collection.children: show(child)
show(bpy.context.view_layer.layer_collection)
for name in RENDER_HIDDEN:
    if name in bpy.data.collections: bpy.data.collections[name].hide_render = False

scene.render.engine = "CYCLES"
preferences = bpy.context.preferences.addons["cycles"].preferences
for backend in ("OPTIX", "CUDA", "HIP", "METAL", "ONEAPI"):
    try:
        preferences.compute_device_type = backend; preferences.get_devices()
        for device in preferences.devices: device.use = device.type != "CPU"
        if any(device.use for device in preferences.devices): scene.cycles.device = "GPU"; break
    except Exception: pass
scene.cycles.samples = 64; scene.cycles.use_adaptive_sampling = True; scene.cycles.adaptive_threshold = 0.02
scene.cycles.use_denoising = True; scene.cycles.texture_limit_render = "2048"
scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 5120, 2560, 100
scene.render.use_border = False; scene.render.use_compositing = False; scene.render.use_sequencer = False
scene.render.image_settings.file_format = "PNG"; scene.render.image_settings.color_mode = "RGB"

for stop_id, x, y, floor in STOPS:
    path = os.path.join(out_dir, stop_id + ".png")
    if os.path.exists(path): continue  # resume an interrupted run
    data = bpy.data.cameras.new("tour_" + stop_id)
    data.type = "PANO"; data.panorama_type = "EQUIRECTANGULAR"; data.clip_start = 0.02
    camera = bpy.data.objects.new("tour_" + stop_id, data)
    scene.collection.objects.link(camera)
    camera.location = (x, y, EYE_Z[floor])
    camera.rotation_euler = (math.pi / 2, 0, 0)  # level, with north (+Y) at the centre of the image
    scene.camera = camera; scene.render.filepath = path
    started = time.time(); bpy.ops.render.render(write_still=True)
    print("RENDERED", stop_id, round(time.time() - started, 1), "s", flush=True)
