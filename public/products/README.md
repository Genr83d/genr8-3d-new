# Product Gallery Photos

Drop product photos into the matching category folder here, then point the
product entry at it in [`src/data/products.ts`](../../src/data/products.ts).

## Steps

1. Save the photo as `public/products/<category>/<file>.webp`
   (categories: `clocks`, `plaques`, `pins`, `keyrings`, `3d-prints`,
   `school-furniture`).
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

## Filenames the gallery is already expecting

These paths are wired up in `src/data/products.ts` and show the placeholder
tile until the matching file exists:

| Product | File |
| --- | --- |
| Wedding & Anniversary Clock | `clocks/wedding-anniversary-clock.webp` |
| Family Photo Clock | `clocks/family-photo-clock.webp` |
| One Love Jamaica Clock | `clocks/one-love-jamaica-clock.webp` |
| School Anniversary Clock | `clocks/school-anniversary-clock.webp` |
| Recognition & Guest Speaker Clock | `clocks/recognition-clock.webp` |
| Institution & Campus Clock | `clocks/institution-campus-clock.webp` |
| Graduation Photo Keyring | `keyrings/graduation-photo-keyring.webp` |
| House & Mascot Keyring | `keyrings/house-mascot-keyring.webp` |
| School Crest Keyring | `keyrings/school-crest-keyring.webp` |
| Anniversary Keyring | `keyrings/anniversary-keyring.webp` |
| Domed Mascot Bag Tag | `keyrings/domed-mascot-bag-tag.webp` |
| Gift & Novelty Keyring | `keyrings/gift-novelty-keyring.webp` |
| Prefect & Leadership Badge | `pins/prefect-leadership-badge.webp` |
| Committee Role Pin | `pins/committee-role-pin.webp` |
| Sports Club Pin | `pins/sports-club-pin.webp` |
| Club Crest Pin | `pins/club-crest-pin.webp` |
| Round Membership Pin | `pins/round-membership-pin.webp` |
| Logo-Cut Pin | `pins/logo-cut-pin.webp` |
| Working Miniature Lathe | `3d-prints/working-miniature-lathe.webp` |
| Working Engine Model | `3d-prints/working-engine-model.webp` |
| Robotics Chassis & Housings | `3d-prints/robotics-chassis.webp` |
| Custom Automotive Trim | `3d-prints/automotive-trim.webp` |
| RC Body & Chassis | `3d-prints/rc-body-chassis.webp` |
| Rugged Carry Case | `3d-prints/rugged-carry-case.webp` |

## Converting phone photos

ImageMagick handles the resize and `.webp` conversion in one pass:

```bash
convert original.jpg -resize 1400x1400 -quality 82 \
  public/products/clocks/wedding-anniversary-clock.webp
```

## Photo guidelines

- Landscape orientation, roughly 3:2 - cards crop to a fixed height.
- 1200-1600px wide is plenty; keep files under ~300KB.
- Prefer `.webp` (fall back to `.jpg` if needed).
- Shoot on a dark or neutral background to match the site theme.
- Use lowercase, hyphenated filenames: `custom-centre-clock.webp`.
