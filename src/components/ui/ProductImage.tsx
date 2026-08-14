import { useState, type JSX } from 'react'
import type { ProductCategoryId } from '../../types/content'
import {
  ClockIcon,
  ImagePlaceholderIcon,
  KeyringIcon,
  PinIcon,
  PlaqueIcon,
  SchoolFurnitureIcon,
} from './icons'

type ProductCategoryIconProps = {
  category: ProductCategoryId
  className?: string
}

export function ProductCategoryIcon({ category, className }: ProductCategoryIconProps): JSX.Element {
  if (category === 'clocks') return <ClockIcon className={className} />
  if (category === 'plaques') return <PlaqueIcon className={className} />
  if (category === 'pins') return <PinIcon className={className} />
  if (category === 'keyrings') return <KeyringIcon className={className} />
  return <SchoolFurnitureIcon className={className} />
}

type ProductImageProps = {
  src?: string
  alt: string
  category: ProductCategoryId
  /** Tailwind height classes for the frame, e.g. "h-56". */
  heightClass?: string
  className?: string
}

/**
 * Renders a product photo, or a branded placeholder tile while the photo is
 * still outstanding, so the gallery stays presentable before shoot day.
 * A photo that fails to load (not uploaded yet, renamed, wrong extension)
 * falls back to the same placeholder rather than a broken image.
 */
export function ProductImage({
  src,
  alt,
  category,
  heightClass = 'h-56',
  className = '',
}: ProductImageProps): JSX.Element {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${heightClass} w-full object-cover ${className}`}
        loading="lazy"
        onError={() => setFailedSrc(src)}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={`${alt} - photo coming soon`}
      className={`${heightClass} flex w-full flex-col items-center justify-center gap-3 bg-lab-grid bg-[size:22px_22px] bg-black/70 ${className}`}
    >
      <div className="flex items-center gap-2 text-accentSoft">
        <ProductCategoryIcon category={category} className="h-8 w-8" />
        <ImagePlaceholderIcon className="h-8 w-8 text-accentSoft/60" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        Photo coming soon
      </p>
    </div>
  )
}
