import { useEffect, type JSX } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/content'
import { getCategoryLabel } from '../../data/products'
import { CloseIcon } from './icons'
import { ProductImage } from './ProductImage'

type ProductModalProps = {
  product: Product
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps): JSX.Element {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} product details`}
        className="surface-card max-h-[90vh] w-full max-w-3xl overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="chip">{getCategoryLabel(product.category)}</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">{product.name}</h3>
          </div>
          <button
            type="button"
            aria-label="Close product details"
            className="rounded-md border border-accentSoft/50 p-2 text-accentSoft hover:bg-accentSoft/20"
            onClick={onClose}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl">
          <ProductImage
            src={product.image}
            alt={product.name}
            category={product.category}
            heightClass="h-72"
          />
        </div>

        <p className="mt-6 text-sm text-slate-300">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-support/40 px-3 py-1 text-xs text-slate-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {product.options?.length ? (
          <div className="mt-6">
            <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
              Options
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
              {product.options.map((option) => (
                <li key={option} className="flex gap-2">
                  <span aria-hidden="true" className="text-accentSoft">
                    &bull;
                  </span>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {product.leadTime ? (
          <p className="mt-6 text-sm text-slate-400">
            Typical lead time:{' '}
            <span className="font-semibold text-slate-200">{product.leadTime}</span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/contact" className="primary-button" onClick={onClose}>
            Request This Product
          </Link>
          {product.category === 'clocks' ? (
            <Link to="/clocks" className="secondary-button" onClick={onClose}>
              Design Your Own Clock
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}
