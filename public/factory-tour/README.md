# Factory tour assets

These optimized WebP derivatives come from the original workshop reference archive supplied by the user. The original archive, Blender scene, and full-resolution source files remain outside Git. The interactive scene rebuilds the geometry in code as a render-informed approximation; it does not load the original Blender scene.

| Asset | Dimensions | Bytes | Use |
| --- | --- | ---: | --- |
| `preview.webp` | 1400 × 788 | 53,242 | Small reference-render poster for entry, loading, and fallback states. |
| `concrete.webp` | 1024 × 1024 | 34,908 | Original concrete texture, tinted green on the workshop floor. |
| `plaster.webp` | 1024 × 1024 | 100,016 | Original plaster texture for masonry, gallery surfaces, and cream/teal walls. |
| `wood.webp` | 512 × 512 | 9,984 | Original wood texture for worktops, doors, rails, and timber details. |

Total: **198,150 bytes**. Textures use sRGB color and repeat wrapping; concrete repeats 5 × 7 and plaster/wood 2 × 2. They load after the visitor enters the tour. The poster appears before entry. Texture failures fall back to colored materials with a warning.

Keep replacements at these public filenames or update `factory-runtime.ts` and `FactoryViewer.tsx`. Optimize replacements for web use and rerun `npm run check:tour` to check the image and full-tour payload budgets. See [`docs/factory-tour.md`](../../docs/factory-tour.md) for scene editing and verification.
