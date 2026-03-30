import type { JSX } from "react";
import { Link } from "react-router-dom";
import LogoWide from "../../assets/icons/logos/genr8-logo-wide.svg";
import FacebookIcon from "../../assets/icons/social/facebook.svg";
import LinkedInIcon from "../../assets/icons/social/linkedin.svg";
import InstagramIcon from "../../assets/icons/social/instagram.svg";
import WhatsAppIcon from "../../assets/icons/social/whatsapp.svg";

export function SiteFooter(): JSX.Element {
  return (
    <footer className="border-t border-accentSoft/25 bg-black/80">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-10">
        <section>
          <img src={LogoWide} alt="GENR8-3D Logo" className="w-32" />
          <p className="mt-4 text-sm text-slate-300">
            Precision fabrication, technical design, and digital delivery for
            teams that need production-ready output.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://wa.me/18768018972"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <img
                src={WhatsAppIcon}
                alt="WhatsApp"
                className="h-5 w-5 brightness-0 invert opacity-50 transition-opacity hover:opacity-100"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/genr8-3d/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img
                src={LinkedInIcon}
                alt="LinkedIn"
                className="h-5 w-5 brightness-0 invert opacity-50 transition-opacity hover:opacity-100"
              />
            </a>
            <a
              href="https://www.instagram.com/genr8_3d/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img
                src={InstagramIcon}
                alt="Instagram"
                className="h-5 w-5 brightness-0 invert opacity-50 transition-opacity hover:opacity-100"
              />
            </a>
            <a
              href="https://www.facebook.com/Genr8-3d-111518620711772"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <img
                src={FacebookIcon}
                alt="Facebook"
                className="h-5 w-5 brightness-0 invert opacity-50 transition-opacity hover:opacity-100"
              />
            </a>
          </div>
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
            <a
              href="https://portfolio-website-7hf.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accentSoft"
            >
              External Portfolio
            </a>
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
