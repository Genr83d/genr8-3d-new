import type { JSX } from 'react'
import { Link } from 'react-router-dom'

export function SiteFooter(): JSX.Element {
  return (
    <footer className="border-t border-accentSoft/25 bg-black/80">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-10">
        <section>
          <p className="chip">GENR8-3D</p>
          <p className="mt-4 text-sm text-slate-300">
            Precision fabrication, technical design, and digital delivery for teams that need production-ready output.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">Quick Links</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <Link to="/services" className="hover:text-accentSoft">
              Services
            </Link>
            <Link to="/portfolio" className="hover:text-accentSoft">
              Portfolio
            </Link>
            <Link to="/academy" className="hover:text-accentSoft">
              NEXT-GEN Academy
            </Link>
            <Link to="/contact" className="hover:text-accentSoft">
              Quote Request
            </Link>
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">Contact</h2>
          <p className="mt-3 text-sm text-slate-300">Mon-Fri: 8:00 AM - 6:00 PM</p>
          <p className="mt-1 text-sm text-slate-300">Innovation District, Studio Bay 04</p>
          <p className="mt-1 text-sm text-slate-300">hello@genr8-3d.com</p>
        </section>
      </div>
      <p className="border-t border-accentSoft/20 py-4 text-center text-xs text-slate-500">
        (c) {new Date().getFullYear()} GENR8-3D. Built for precision makers.
      </p>
    </footer>
  )
}
