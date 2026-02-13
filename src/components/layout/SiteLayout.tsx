import type { JSX } from 'react'
import { Outlet } from 'react-router-dom'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function SiteLayout(): JSX.Element {
  return (
    <div className="site-wrap">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="page-shell">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
