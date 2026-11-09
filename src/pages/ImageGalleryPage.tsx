import { useMemo, useState, type JSX } from "react";
import { products } from "../data/products";
import type { ProductCategoryId } from "../types/content";

type GalleryCategory = ProductCategoryId | "other";
type GalleryFilter = GalleryCategory | "all";
type GalleryImage = {
  id: string;
  category: GalleryCategory;
  src: string;
  srcSet?: string;
  alt: string;
};

const categories: { id: GalleryCategory; label: string }[] = [
  { id: "clocks", label: "Clock" },
  { id: "pins", label: "Pins / Badges" },
  { id: "keyrings", label: "Keyrings" },
  { id: "3d-prints", label: "3D Prints" },
  { id: "plaques", label: "Plaques" },
  { id: "school-furniture", label: "Desk & Chairs" },
  { id: "other", label: "Other" },
];

const untitledProductImages: GalleryImage[] = [
  {
    id: "photo-cabinet-front",
    category: "other",
    src: "/products/other/cabinet-front.webp?v=background-clean-1",
    srcSet: "/products/other/cabinet-front-480.webp?v=background-clean-1 480w, /products/other/cabinet-front-800.webp?v=background-clean-1 800w, /products/other/cabinet-front.webp?v=background-clean-1 1080w",
    alt: "Front view of a wooden twelve-drawer cabinet with engraved values",
  },
  {
    id: "photo-cabinet-angle",
    category: "other",
    src: "/products/other/cabinet-angle.webp?v=background-clean-1",
    srcSet: "/products/other/cabinet-angle-480.webp?v=background-clean-1 480w, /products/other/cabinet-angle-800.webp?v=background-clean-1 800w, /products/other/cabinet-angle.webp?v=background-clean-1 1080w",
    alt: "Angled view of a wooden twelve-drawer cabinet with engraved values",
  },
  {
    id: "photo-peer-counsellor-badges",
    category: "pins",
    src: "/products/pins/peer-counsellor-badges.webp?v=background-clean-1",
    srcSet: "/products/pins/peer-counsellor-badges-480.webp?v=background-clean-1 480w, /products/pins/peer-counsellor-badges.webp?v=background-clean-1 720w",
    alt: "Anchovy Primary School peer counsellor badges",
  },
  {
    id: "photo-lantern-pins",
    category: "pins",
    src: "/products/pins/lantern-pins.webp?v=background-clean-1",
    srcSet: "/products/pins/lantern-pins-480.webp?v=background-clean-1 480w, /products/pins/lantern-pins-800.webp?v=background-clean-1 800w, /products/pins/lantern-pins.webp?v=background-clean-1 1280w",
    alt: "Round wooden lantern pins with engraved lettering",
  },
  {
    id: "photo-business-club-badges",
    category: "pins",
    src: "/products/pins/business-club-badges.webp?v=background-clean-1",
    srcSet: "/products/pins/business-club-badges-480.webp?v=background-clean-1 480w, /products/pins/business-club-badges-800.webp?v=background-clean-1 800w, /products/pins/business-club-badges.webp?v=background-clean-1 960w",
    alt: "Business Club member and leadership badges",
  },
  {
    id: "photo-cornwall-crocz-badge",
    category: "pins",
    src: "/products/pins/cornwall-crocz-badge.webp?v=background-clean-1",
    srcSet: "/products/pins/cornwall-crocz-badge-480.webp?v=background-clean-1 480w, /products/pins/cornwall-crocz-badge-800.webp?v=background-clean-1 800w, /products/pins/cornwall-crocz-badge.webp?v=background-clean-1 1280w",
    alt: "Cornwall College CROCZ swim club badge",
  },
  {
    id: "photo-technical-design-badges",
    category: "pins",
    src: "/products/pins/technical-design-badges.webp?v=background-clean-1",
    srcSet: "/products/pins/technical-design-badges-480.webp?v=background-clean-1 480w, /products/pins/technical-design-badges-800.webp?v=background-clean-1 800w, /products/pins/technical-design-badges.webp?v=background-clean-1 1280w",
    alt: "M.A.H.S Technical Design Society cog-shaped badges",
  },
  {
    id: "photo-prefect-badges",
    category: "pins",
    src: "/products/pins/prefect-badges.webp?v=background-clean-1",
    srcSet: "/products/pins/prefect-badges-480.webp?v=background-clean-1 480w, /products/pins/prefect-badges-800.webp?v=background-clean-1 800w, /products/pins/prefect-badges.webp?v=background-clean-1 1280w",
    alt: "John Rollins Success prefect badges",
  },
];

export function ImageGalleryPage(): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const mixedImages = useMemo(() => {
    const galleryImages: GalleryImage[] = [
      ...products.flatMap((product) =>
        product.image
          ? [
              {
                id: product.id,
                category: product.category,
                src: product.image,
                alt: product.name,
              },
            ]
          : [],
      ),
      ...untitledProductImages,
    ];
    const imagesByCategory = categories.map((category) =>
      galleryImages.filter((image) => image.category === category.id),
    );
    const longestCategory = Math.max(
      0,
      ...imagesByCategory.map((categoryImages) => categoryImages.length),
    );

    return Array.from({ length: longestCategory }, (_, index) =>
      imagesByCategory.flatMap((categoryImages) =>
        categoryImages[index] ? [categoryImages[index]] : [],
      ),
    ).flat();
  }, []);

  const visibleImages =
    activeFilter === "all"
      ? mixedImages
      : mixedImages.filter((image) => image.category === activeFilter);

  return (
    <main className="page-shell">
      <nav
        aria-label="Filter gallery by category"
        className="mb-8 flex flex-wrap gap-2"
      >
        {[
          { id: "all" as const, label: "All" },
          ...categories,
        ].map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveFilter(category.id)}
            aria-pressed={category.id === activeFilter}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition duration-300 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accentSoft ${
              category.id === activeFilter
                ? "border-accentSoft bg-accent/35 text-accentSoft"
                : "border-accentSoft/35 bg-black/60 text-slate-300 hover:border-accentSoft/60 hover:text-white"
            }`}
          >
            {category.label}
          </button>
        ))}
      </nav>

      <div
        key={activeFilter}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4"
      >
        {visibleImages.map((image, index) => (
          <div
            key={image.id}
            className="gallery-filter-enter overflow-hidden rounded-xl"
            style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
          >
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes="(min-width: 1280px) 288px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 640px) calc((100vw - 80px) / 3), calc((100vw - 44px) / 2)"
              alt={image.alt}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
