# Factory tour assets

Everything here is rendered from the workshop's Blender scene, which stays outside Git along with its textures and the full-size PNG renders.

| Asset | Size | Use |
| --- | --- | --- |
| `panos/<stop>.webp` | 5120 × 2560 | Sharp 360° panorama for each stop, loaded after the small one. |
| `panos/<stop>-sm.webp` | 2560 × 1280 | First view of each stop, and the only one on low-memory or data-saving devices. |
| `plan-ground.webp`, `plan-upper.webp` | 344 × 720 | Top-down floor plans for the map in the viewer. |
| `preview.webp` | 1400 × 788 | Poster shown before the tour starts and if it cannot start. |

Panoramas are equirectangular, level, with north at the centre. The floor plans cover the rectangle given by `PLAN_BOUNDS` in `src/components/factory-tour/tour-stops.ts`.

To regenerate the panoramas, see [`docs/factory-tour.md`](../../docs/factory-tour.md). Keep the filenames matched to the stop IDs and rerun `npm run check:tour`.
