import type { JSX } from 'react'
export type TourIconName = 'play' | 'close' | 'expand' | 'roof' | 'reset' | 'up' | 'down' | 'left' | 'right' | 'walk' | 'overview'
const paths: Record<TourIconName, string> = {
  play: 'm9 5 11 7-11 7V5Z', close: 'm6 6 12 12M6 18 18 6',
  expand: 'M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6',
  roof: 'm3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7', reset: 'M3 10a9 9 0 1 1 2 8M3 4v6h6',
  up: 'm6 15 6-6 6 6', down: 'm6 9 6 6 6-6', left: 'm15 6-6 6 6 6', right: 'm9 6 6 6-6 6',
  walk: 'M13 4h.01M10 8l3-1 2 5 4 1M8 22l3-7 2-3m0 10 2-7-4-4-3 3-3-1',
  overview: 'm12 3 10 6-10 6L2 9l10-6Zm-8 11 8 5 8-5M4 18l8 5 8-5',
}
export function TourIcon({ name, className = '' }: { name: TourIconName; className?: string }): JSX.Element {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>
}
