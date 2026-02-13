import type { JSX } from "react";
import { Link } from "react-router-dom";

export function SiteFooter(): JSX.Element {
  return (
    <footer className="border-t border-accentSoft/25 bg-black/80">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-10">
        <section>
          <p className="chip">GENR8-3D</p>
          <p className="mt-4 text-sm text-slate-300">
            Precision fabrication, technical design, and digital delivery for
            teams that need production-ready output.
          </p>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
            Quick Links
          </h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-300">
            <Link to="/services" className="hover:text-accentSoft">
              Services
            </Link>
            <Link to="/portfolio" className="hover:text-accentSoft">
              Portfolio
            </Link>
            <a
              href="https://next-gen-academy.genr83d.com/"
              className="hover:text-accentSoft"
            >
              NEXT-GEN Academy
            </a>
            <Link to="/contact" className="hover:text-accentSoft">
              Quote Request
            </Link>
          </div>
        </section>
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
            Contact
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Mon-Fri: 8:00 AM - 5:00 PM
          </p>
          <p className="mt-1 text-sm text-slate-300">contact@genr83d.com</p>
          {/* <p className="mt-1 text-sm text-slate-300">
            Pembrooke Commercial Complex, Lots 19 & 20 Fairfield, Montego Bay,
            St. James
          </p> */}
          <address className="mt-1 text-sm text-slate-300 not-italic">
            Pembrooke Commercial Complex
            <br />
            Lots 19 & 20 Fairfield
            <br />
            Montego Bay, St. James
            <br />
            Jamaica
          </address>
        </section>
      </div>
      <p className="border-t border-accentSoft/20 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} GENR8-3D. All rights reserved.
      </p>
    </footer>
  );
}
