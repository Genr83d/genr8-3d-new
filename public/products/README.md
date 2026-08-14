# Product Gallery Photos

Drop product photos into the matching category folder here, then point the
product entry at it in [`src/data/products.ts`](../../src/data/products.ts).

## Steps

1. Save the photo as `public/products/<category>/<file>.webp`
   (categories: `clocks`, `plaques`, `pins`, `keyrings`).
2. In `src/data/products.ts`, add the `image` field to that product:

   ```ts
   {
     id: "clock-round-hardwood",
     name: "Round Hardwood Clock",
     category: "clocks",
     image: "/products/clocks/round-hardwood.webp",
     ...
   }
   ```

   The path always starts with `/products/` - files in `public/` are served
   from the site root, so no import is needed.

Any product without an `image` renders a "photo coming soon" placeholder tile,
so the gallery stays presentable while photos are outstanding.

## Photo guidelines

- Landscape orientation, roughly 3:2 - cards crop to a fixed height.
- 1200-1600px wide is plenty; keep files under ~300KB.
- Prefer `.webp` (fall back to `.jpg` if needed).
- Shoot on a dark or neutral background to match the site theme.
- Use lowercase, hyphenated filenames: `custom-centre-clock.webp`.
