# Factory tour

The `/factory-tour` extension is a render-informed approximation of the workshop, with geometry rebuilt in TypeScript and Three.js. It is not a measured survey or an exact replica of the Blender scene. The user-supplied original archive remains outside Git; the site ships only three optimized original textures and a small reference poster. Asset details are in [`public/factory-tour/README.md`](../public/factory-tour/README.md).

Keep deployment on a **VIRTOUR preview**, separate from main/live. Preserve the existing website design; changes outside the tour are limited to its route, footer link, home-page tour teaser, and dependency/check wiring.

## Behavior

- The page initially shows the poster and guide. The Three.js runtime and textures load only after **Enter the factory**.
- Seven stops cover the workshop entrance, CNC work area, machine shop, workbenches, assembly area, mezzanine walkway, and upper rooms. Guide buttons, Previous/Next, and visible scene hotspots select stops.
- Walk mode supports dragging to look, WASD/arrow keys, and a touch movement pad. Ground-floor boundaries keep visitors inside the building and outside machine, bench, rack, and stair footprints. Upper-floor boundaries restrict walking to the side galleries and rear corridor, away from the central void. Floor buttons jump between levels; the spiral staircase is visual geometry rather than a walkable stair simulation.
- Overview provides orbit and scroll/pinch zoom, with the roof hidden automatically. Walk mode has a roof toggle. Fullscreen uses the browser API and reports unavailable/failed requests without blocking the tour.
- Rendering runs on demand for camera changes, movement, transitions, resizing, and orbit damping. It pauses when the canvas leaves the viewport or the tab is hidden; movement clears on focus/visibility loss. Reduced motion shortens camera jumps and disables damping.
- Closing, retrying, or unmounting disposes controls, observers, listeners, geometry, materials, textures, shadows, and the renderer. Missing textures retain the geometry with a warning. Startup/context failure retains the poster with restart and return-to-preview controls.

## Editing the reconstruction

| File | Change here |
| --- | --- |
| `src/components/factory-tour/factory-scene.ts` | Building surfaces, gallery, stair, machinery, benches, racks, materials, lighting, and roof grouping. Static primitives are merged by material. |
| `src/components/factory-tour/tour-layout.ts` | Floor/eye heights, player radius, building bounds, obstacle footprints, and stop text/camera/marker coordinates. |
| `src/components/factory-tour/factory-runtime.ts` | Texture loading, walking speed, camera behavior, rendering, and lifecycle. |
| `src/components/factory-tour/FactoryViewer.tsx` | Entry, status/fallback, and viewer controls. |
| `src/pages/FactoryTourPage.tsx` | Guide, stop selection, and surrounding tour content. |
| `src/components/factory-tour/factory-tour.css` | Tour-scoped styling and responsive rules. |

Coordinates use Y for height and X/Z for the floor. The slab is currently 20 × 28 scene units, with the upper floor at Y = 3.8 and eye height 1.65. These are reconstruction values, not verified physical dimensions. Building dimensions are also embedded in the scene primitives: changing `WORKSHOP` alone does not resize the geometry. Update both files together.

When moving a machine, move all its primitives in `factory-scene.ts`, then update its `[minX, maxX, minZ, maxZ]` ground obstacle in `tour-layout.ts`. Adjust related stop `position`, `target`, and `marker` coordinates. Keep arrival positions inside `canWalkAt`; adjust upper walkway geometry and its boundary rule together if changing the gallery. Stops also generate scene labels and markers, so keep IDs unique and retain the `entrance` and `mezzanine` IDs used by floor/reset controls.

## Verification

Run from the repository root:

```sh
npm run check:tour
npm run lint
```

Both passed on the documented implementation. `check:tour` builds the production manifest, checks safe stop arrivals and walking boundaries, prevents movement tunnelling, checks interrupted jump destinations and hotspot occlusion, verifies geometry disposal and payload budgets, and confirms the runtime is outside the main and preview static import graphs. Review also verified fixes for interrupting jumps, raycasting through a hidden roof, and restart mode synchronization; restart synchronization was checked in source rather than through a browser.

Measured build output:

| Item | Result |
| --- | ---: |
| Meshes / triangles | 25 / 10,352 |
| Poster + three textures | 198,150 bytes |
| Additional tour JavaScript, gzip | 151,188 bytes |
| JavaScript + images | 349,338 bytes |

The combined figure excludes HTTP headers and CSS (tour CSS is approximately 2.5 KB gzip). It is a build measurement, not a browser network capture or frame-rate measurement. Vite reports the runtime chunk above its default 500 KB uncompressed warning threshold; the runtime remains loaded on entry.

Actual browser access is still disabled in Work settings. Browser interaction, mobile behavior, fullscreen, and WebGL rendering have **not** been verified. Before releasing beyond the VIRTOUR preview, exercise entry/cancel/restart, every stop, both floors and boundaries, jump interruption, roof/hotspot selection, keyboard/touch/overview controls, fullscreen, viewport/tab pausing, and texture/WebGL fallbacks in supported desktop and mobile browsers.

To review preserved main scope, inspect both tracked changes and new files:

```sh
git branch --show-current
git diff --stat main
git diff main -- src/App.tsx src/components/layout/SiteFooter.tsx src/pages/HomePage.tsx
git status --short
```

The branch should be `VIRTOUR`. Main comparisons should show only the tour extension/integration and its package/check/documentation assets; inspect the home-page diff for tour teaser copy only. Confirm unrelated pages, shared styles, and existing layout are unchanged. `git diff` omits untracked files, so include `git status` in this review. Do not merge or publish to main/live as part of preview verification.
