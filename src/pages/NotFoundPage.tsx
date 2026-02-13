import type { JSX } from 'react'
import { Link } from 'react-router-dom'

export function NotFoundPage(): JSX.Element {
  return (
    <section className="surface-card mt-12 text-center">
      <p className="chip">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-white">Page Not Found</h1>
      <p className="mt-3 text-sm text-slate-300">The page you requested does not exist in the GENR8-3D site map.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/" className="secondary-button">
          Back Home
        </Link>
        <Link to="/services" className="primary-button">
          Browse Services
        </Link>
      </div>
    </section>
  )
}
