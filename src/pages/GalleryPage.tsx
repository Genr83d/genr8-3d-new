import { useMemo, useState, type JSX } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/sections/PageHero";
import { CTASection } from "../components/sections/CTASection";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ProductCard } from "../components/ui/ProductCard";
import { ProductCategoryIcon } from "../components/ui/ProductImage";
import { ProductModal } from "../components/ui/ProductModal";
import { productCategories, products } from "../data/products";
import type { Product, ProductCategoryId } from "../types/content";

type GalleryFilter = ProductCategoryId | "all";

const filters: { id: GalleryFilter; label: string }[] = [
  { id: "all", label: "All" },
  ...productCategories.map((category) => ({
    id: category.id as GalleryFilter,
    label: category.label,
  })),
];

export function GalleryPage(): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const visibleCategories = useMemo(() => {
    if (activeFilter === "all") return productCategories;
    return productCategories.filter((category) => category.id === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <PageHero
        eyebrow="Product Gallery"
        title="Products we make in-house"
        description="Clocks, plaques, pins, and keyrings cut, engraved, and finished on our own machines. Every piece can be personalised, branded, and produced in batches."
        actions={
          <>
            <Link to="/contact" className="primary-button">
              Request a Product
            </Link>
            <Link to="/services" className="secondary-button">
              View Services
            </Link>
          </>
        }
      />

      <section className="section-shell">
        <SectionHeading
          eyebrow="Browse"
          title="Pick a product line"
          description="Filter the gallery by category, then open any product for options and lead times."
        />
        <div className="mb-10 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={filter.id === activeFilter}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                filter.id === activeFilter
                  ? "border-accentSoft bg-accent/35 text-accentSoft"
                  : "border-accentSoft/35 bg-black/60 text-slate-300 hover:border-accentSoft/60 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-14">
          {visibleCategories.map((category) => {
            const items = products.filter(
              (product) => product.category === category.id,
            );

            return (
              <div key={category.id} id={category.id}>
                <div className="mb-6 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-xl border border-accentSoft/35 bg-black/60 p-2">
                      <ProductCategoryIcon
                        category={category.id}
                        className="h-6 w-6 text-accentSoft"
                      />
                    </span>
                    <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                      {category.label}
                    </h2>
                    <span className="rounded-full border border-accentSoft/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {items.length} {items.length === 1 ? "design" : "designs"}
                    </span>
                  </div>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
                    {category.description}
                  </p>
                </div>

                {items.length ? (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={setActiveProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="surface-card text-sm text-slate-300">
                    New {category.label.toLowerCase()} are being photographed
                    now.{" "}
                    <Link to="/contact" className="text-accentSoft underline">
                      Contact us
                    </Link>{" "}
                    for current designs and pricing.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <CTASection
        title="Want one of these in your own branding?"
        description="Send us your logo, wording, or artwork and we will quote a single piece or a full production run."
        primaryLabel="Start Quote Request"
        primaryTo="/contact"
        secondaryLabel="Design a Clock"
        secondaryTo="/clocks"
      />

      {activeProduct ? (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      ) : null}
    </>
  );
}
