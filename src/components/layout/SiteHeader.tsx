import { useState, type JSX } from "react";
import { Link, NavLink } from "react-router-dom";
import { CloseIcon, MenuIcon } from "../ui/icons";
import { services } from "../../data/services";
import LogoWide from "../../assets/icons/logos/genr8-logo-wide.svg";

const links = [
  { to: "/services", label: "Services" },
  { to: "/products", label: "Products" },
  { to: "/our-work", label: "Our Work" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [submenu, setSubmenu] = useState<string | null>(null);
  const closeMenus = () => { setIsOpen(false); setSubmenu(null); };

  function navigation(mobile: boolean) {
    return (
      <>
        {links.map((link) => (
          <div key={link.to} className="relative"
            onPointerEnter={(event) => {
              if (!mobile && event.pointerType === "mouse") {
                setSubmenu(["Services", "Products"].includes(link.label) ? link.to : null);
              }
            }}
            onPointerLeave={(event) => {
              if (!mobile && event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) {
                setSubmenu((current) => current === link.to ? null : current);
              }
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setSubmenu((current) => current === link.to ? null : current);
              }
            }}>
            <div className="flex items-center gap-1">
              <NavLink to={link.to} onClick={closeMenus}
                className={({ isActive }) => `block py-2 text-sm font-semibold transition ${mobile ? "px-3" : ""} ${isActive ? "text-accentSoft" : "text-slate-300 hover:text-white"}`}>
                {link.label}
              </NavLink>
              {["Services", "Products"].includes(link.label) && (
                <button type="button" className="rounded p-2 text-slate-300 hover:text-white"
                  aria-label={`Toggle ${link.label} menu`} aria-expanded={submenu === link.to}
                  aria-controls={`${mobile ? "mobile" : "desktop"}-${link.label}`}
                  onClick={() => setSubmenu(submenu === link.to ? null : link.to)}>
                  <span aria-hidden="true">▾</span>
                </button>
              )}
            </div>
            {["Services", "Products"].includes(link.label) && (
              <div id={`${mobile ? "mobile" : "desktop"}-${link.label}`} hidden={submenu !== link.to}
                className={`${mobile ? "ml-3" : "absolute left-0 top-full w-72 shadow-xl"} rounded-lg border border-accentSoft/25 bg-black p-4`}>
                {link.label === "Services" ? [
                  { category: "fabrication", label: "Fabrication Services" },
                  { category: "digital", label: "Digital Services" },
                ].map((group) => (
                  <div key={group.category} className="mb-3 last:mb-0">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.label}</p>
                    {services.filter((service) => service.category === group.category).map((service) => (
                      <NavLink key={service.id} to={`/services/${service.slug}`} onClick={closeMenus}
                        className={({ isActive }) => `block rounded py-2 text-sm hover:text-white ${isActive ? "text-accentSoft" : "text-slate-300"}`}>
                        {service.name}
                      </NavLink>
                    ))}
                  </div>
                )) : (
                  <>
                    <Link to="/products" onClick={closeMenus} className="block py-2 text-sm text-slate-300 hover:text-white">Custom Products</Link>
                    <NavLink to="/products/clocks" onClick={closeMenus} className={({ isActive }) => `block py-2 text-sm hover:text-white ${isActive ? "text-accentSoft" : "text-slate-300"}`}>Clock Builder</NavLink>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        <Link to="/contact" className={`primary-button ${mobile ? "mt-2" : ""}`} onClick={closeMenus}>Request a Quote</Link>
      </>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-accentSoft/25 bg-black/80 backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          const panel = event.target instanceof Element ? event.target.closest('[id$="-Services"], [id$="-Products"]') : null;
          const toggle = panel?.previousElementSibling?.querySelector("button");
          if (toggle instanceof HTMLElement) toggle.focus();
          setSubmenu(null);
        }
      }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSubmenu(null); }}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        <Link to="/" onClick={closeMenus} className="inline-flex items-center gap-3" aria-label="GENR8-3D home">
          <img src={LogoWide} alt="GENR8-3D Logo" className="w-28" />
        </Link>
        <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">{navigation(false)}</nav>
        <button type="button" className="rounded-md border border-accentSoft/50 p-2 text-accentSoft lg:hidden"
          onClick={() => { setIsOpen(!isOpen); setSubmenu(null); }} aria-expanded={isOpen} aria-controls="mobile-nav" aria-label="Toggle navigation">
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      {isOpen && (
        <nav id="mobile-nav" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-accentSoft/25 px-4 py-4 lg:hidden" aria-label="Mobile primary">
          <div className="flex flex-col gap-2">{navigation(true)}</div>
        </nav>
      )}
    </header>
  );
}
