import type { JSX } from 'react'
import type { Product } from '../../types/content'
import { getCategoryLabel } from '../../data/products'
import { ProductImage } from './ProductImage'

type ProductCardProps = {
  product: Product
  onSelect: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="surface-card group text-left transition duration-300 hover:-translate-y-0.5 hover:border-accentSoft/70"
    >
      <div className="relative overflow-hidden rounded-xl">
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
          frameClass="aspect-square"
          className="transition duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <p className="absolute bottom-3 left-3 chip">{getCategoryLabel(product.category)}</p>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{product.name}</h3>
      <p className="mt-2 text-sm text-slate-300">{product.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-support/45 bg-support/20 px-3 py-1 text-xs font-semibold text-slate-100"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
