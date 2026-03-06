import { useState, type JSX } from "react";
import { Link, NavLink } from "react-router-dom";
import { CloseIcon, MenuIcon } from "../ui/icons";
import LogoWide from "../../assets/icons/logos/genr8-logo-wide.svg";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/clocks", label: "Clocks" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const ACADEMY_URL = "https://next-gen-academy.genr83d.com";

export function SiteHeader(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-accentSoft/25 bg-black/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-3"
          aria-label="GENR8-3D home"
        >
          <img src={LogoWide} alt="GENR8-3D Logo" className="w-28" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-accentSoft" : "text-slate-300 hover:text-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href={ACADEMY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            NEXT-GEN Academy
          </a>
          <Link to="/contact" className="primary-button">
            Get a Quote
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-md border border-accentSoft/50 p-2 text-accentSoft lg:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isOpen ? (
        <nav
          id="mobile-nav"
          className="border-t border-accentSoft/25 px-4 py-4 lg:hidden"
          aria-label="Mobile primary"
        >
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-semibold ${
                    isActive
                      ? "bg-accent/35 text-accentSoft"
                      : "text-slate-200 hover:bg-accent/20"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <a
              href={ACADEMY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-accent/20"
              onClick={() => setIsOpen(false)}
            >
              NEXT-GEN Academy
            </a>
            <Link
              to="/contact"
              className="primary-button mt-2"
              onClick={() => setIsOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
