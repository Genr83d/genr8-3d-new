import { services } from "./services";

/**
 * Every route that must be reachable by a direct request: opened in a new tab,
 * refreshed, shared through WhatsApp, or fetched by a crawler.
 *
 * This is the single source of truth behind three things that have to agree:
 * the router in `src/App.tsx`, the SPA rewrite in `vercel.json`, and
 * `public/sitemap.xml`. `src/__tests__/hosting.test.ts` fails if they drift.
 *
 * `/admin/clocks` is deliberately absent - it is auth-gated, not public, and is
 * disallowed in `public/robots.txt`.
 */
export const publicRoutes: string[] = [
  "/",
  "/services",
  ...services.map((service) => `/services/${service.slug}`),
  "/clocks",
  "/gallery",
  "/portfolio",
  "/about",
  "/contact",
];

/** Canonical origin. The apex domain 301s here, so links and tags use it. */
export const siteOrigin = "https://www.genr83d.com";

export function canonicalUrl(pathname: string): string {
  return pathname === "/" ? `${siteOrigin}/` : `${siteOrigin}${pathname}`;
}
