# Factory tour

`/factory-tour` is a 360° tour of the workshop. Each stop is a panorama rendered from the real Blender scene of the building, shown on the inside of a sphere with Three.js. Visitors drag to look around and select markers to move from stop to stop. The Blender scene, its textures, and the full-size renders stay outside Git; the site ships only the compressed panoramas, two floor plans, and a poster. Asset details are in [`public/factory-tour/README.md`](../public/factory-tour/README.md).

Changes outside the tour are limited to its route, footer link, home-page tour teaser, and dependency/check wiring.

## Behavior

- The page first shows the poster and guide. The viewer and the first panorama load only after **Enter the factory**.
- Ten stops cover the entrance, reception, CNC router, lathe and laser cutters, back of the workshop, top of the stairs, mezzanine gallery, workshop overlook, meeting room, and 3D printing room.
- Visitors move with the markers in the view, the dots on the floor-plan map, the Upper/Ground buttons, or the guide list with Previous/Next. Markers keep the direction the visitor is facing; the map, floor buttons, and guide turn to each stop's featured view.
- Drag, arrow keys, or touch to look around. Zoom with the +/− buttons, a pinch, the + and − keys, or Ctrl + scroll (plain scroll in fullscreen). Plain scrolling over the view scrolls the page.
- Each stop appears first as a 2560 px panorama, then sharpens to 5120 px. Devices that cannot hold a 5120 px texture, or that ask to save data, stay on the smaller one. Neighbouring stops are preloaded; panoramas that are no longer nearby are released.
- The view turns slowly until the visitor first touches it. Rendering happens only when something changes, and stops while the view is off screen or the tab is hidden. Reduced motion removes the slow turn, glide, and cross-fade.
- Closing or leaving the page releases the renderer, textures, listeners, and markers. If a panorama fails to load, the visitor stays where they are with a warning. If the viewer cannot start, the poster stays with restart and return controls.

## Editing the tour

| File | Change here |
| --- | --- |
| `src/components/factory-tour/tour-stops.ts` | Stops (title, text, position, featured heading) and which stops connect. |
| `src/components/factory-tour/pano-runtime.ts` | Panorama loading, look/zoom controls, markers, transitions, and cleanup. |
| `src/components/factory-tour/FactoryViewer.tsx` | Entry, loading and error states, toolbar, and floor-plan map. |
| `src/pages/FactoryTourPage.tsx` | Guide list and surrounding page. |
| `src/components/factory-tour/factory-tour.css` | Tour-scoped styling and responsive rules. |
| `scripts/render-tour-panoramas.py` | Blender render of every stop. |
| `scripts/build-tour-panoramas.sh` | PNG renders to the shipped WebP files. |

Positions use the Blender scene's own coordinates in metres: x east, y north, z up. The roller door is at the north end (y ≈ 8.5), the ground floor is at z = 0.05, and the mezzanine at z = 2.75. Every panorama is rendered level with north at the centre of the image, so headings are degrees clockwise from north and the same heading faces the same way at every stop.

A connection places a marker at the other stop's spot on the floor. Give it a `via` point when that spot is hidden behind a wall or on another floor, so the marker sits on the doorway or staircase instead.

## Re-rendering

Needs Blender 5.2 or newer, ImageMagick, and the scene archive extracted locally.

```sh
blender -b "<archive>/Blend/Genr8 Building (3)Bevel test.blend" \
  --python scripts/render-tour-panoramas.py -- /tmp/tour-renders "<archive>/Assets"
scripts/build-tour-panoramas.sh /tmp/tour-renders
npm run check:tour
```

To add or move a stop, change it in both `tour-stops.ts` and the `STOPS` list in the render script, then render. Existing PNGs in the output folder are skipped, so delete the ones that should be redone.

The saved scene is arranged for a top-down cutaway animation: the roof, trusses, upper floor, and ceiling lights are hidden from the camera, and the meeting-room furniture, upstairs doors, and 3D printers are switched off. The render script turns these back on for its own session and never saves the .blend. Four `plastered_wall_05` texture files, among others, are referenced by the scene but missing from the archive; no missing-texture colour is visible in the current panoramas.

## Verification

```sh
npm run check:tour
npm run lint
```

`check:tour` builds the site and checks that every stop has both panorama sizes in the right shape and within its size budget, that every connection can be walked both ways, that every stop can be reached from the entrance, and that the viewer is outside the main and tour-preview import graphs.
