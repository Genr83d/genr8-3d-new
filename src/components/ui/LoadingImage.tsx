import { useState, type JSX, type ReactNode } from 'react'
import { Skeleton } from './Skeleton'

type LoadingImageProps = {
  src: string
  alt: string
  frameClass: string
  className?: string
  fit?: 'cover' | 'contain'
  loading?: 'lazy' | 'eager'
  fallback?: ReactNode
}

/** A new source gets its own load state, including when a modal changes photos. */
export function LoadingImage(props: LoadingImageProps): JSX.Element {
  return <ImageWithState key={props.src} {...props} />
}

function ImageWithState({ src, alt, frameClass, className = '', fit = 'cover', loading = 'lazy', fallback }: LoadingImageProps): JSX.Element {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  if (status === 'error') {
    return <>{fallback ?? (
      <div role="img" aria-label={`${alt} - image unavailable`} className={`flex items-center justify-center bg-slate-900 text-sm text-slate-400 ${frameClass}`}>
        Image unavailable
      </div>
    )}</>
  }

  return (
    <div className={`relative isolate overflow-hidden ${frameClass}`} aria-busy={status === 'loading'}>
      {status === 'loading' && <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        ref={(node) => {
          // Cached images may finish before React attaches the load listener.
          if (node?.complete) setStatus(node.naturalWidth > 0 ? 'loaded' : 'error')
        }}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`absolute inset-0 h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className} ${status === 'loaded' ? 'opacity-100' : 'opacity-0'} motion-safe:transition-opacity motion-safe:duration-300`}
      />
    </div>
  )
}
