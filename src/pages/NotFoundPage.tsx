import { useEffect, type JSX } from "react";
import { Link } from "react-router-dom";

/**
 * A single-page app answers unknown URLs with the app shell, so this page is a
 * soft 404. Tagging it `noindex` while it is mounted keeps those URLs out of
 * search results instead of letting them be indexed as real pages.
 */
function useNoIndex(): void {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page Not Found | GENR8-3D";

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;
      meta.remove();
    };
  }, []);
}

export function NotFoundPage(): JSX.Element {
  useNoIndex();

  return (
    <section className="surface-card mt-12 text-center">
      <p className="chip">404</p>
      <h1 className="mt-4 text-3xl font-semibold text-white">Page Not Found</h1>
      <p className="mt-3 text-sm text-slate-300">
        The page you requested does not exist in the GENR8-3D site map. Check the address, or start
        from one of these.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="secondary-button">
          Back Home
        </Link>
        <Link to="/services" className="primary-button">
          Browse Services
        </Link>
        <Link to="/contact" className="secondary-button">
          Contact Us
        </Link>
      </div>
    </section>
  );
}
