import type { JSX } from 'react'

export function Skeleton({ className = '' }: { className?: string }): JSX.Element {
  return <div aria-hidden="true" className={`rounded-lg bg-slate-700/40 motion-safe:animate-pulse ${className}`} />
}

export function ContentSkeleton({ label = 'Loading content', rows = 3 }: { label?: string; rows?: number }): JSX.Element {
  return (
    <div role="status" className="space-y-3 py-3">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className={`h-4 ${index === rows - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  )
}

export function PageSkeleton({ pathname = '/' }: { pathname?: string }): JSX.Element {
  const isForm = pathname === '/contact' || pathname === '/products/clocks' || pathname === '/admin/clocks'
  const isDetail = pathname.startsWith('/services/') || pathname === '/about'

  return (
    <div role="status" className="space-y-12">
      <span className="sr-only">Loading page</span>
      <div className="rounded-3xl border border-accentSoft/35 p-8 sm:p-10 lg:p-14">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="mt-4 h-12 w-3/4 max-w-xl" />
        <Skeleton className="mt-5 h-4 w-full max-w-2xl" />
        <Skeleton className="mt-3 h-4 w-2/3 max-w-lg" />
        <div className="mt-8 flex gap-3">
          <Skeleton className="h-11 w-36" />
          <Skeleton className="h-11 w-28" />
        </div>
      </div>
      <div className={`grid gap-6 ${isForm || isDetail ? 'lg:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
        {Array.from({ length: isForm || isDetail ? 2 : 3 }, (_, index) => (
          <div key={index} className="surface-card space-y-6">
            <Skeleton className={isForm ? 'h-10 w-1/2' : 'h-52 w-full rounded-xl'} />
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className={isForm ? 'h-12 w-full' : 'h-4 w-full'} />
            <Skeleton className={isForm ? 'h-12 w-full' : 'h-4 w-3/4'} />
            <Skeleton className="h-10 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}
