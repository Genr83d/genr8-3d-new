/**
 * Regenerates `public/sitemap.xml` from the route manifest.
 *
 * The manifest lives in TypeScript (`src/data/siteRoutes.ts`) and derives service
 * routes from `src/data/services.ts`, so rather than pull a TS loader into the
 * build this reads the slugs directly. `src/__tests__/hosting.test.ts` compares
 * the committed XML against the real manifest, so a drift fails the test suite.
 *
 * Usage: npm run sitemap
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://www.genr83d.com";

const servicesSource = readFileSync(resolve(root, "src/data/services.ts"), "utf8");
const slugs = [...servicesSource.matchAll(/^\s{4}slug:\s*"([^"]+)"/gm)].map((match) => match[1]);

if (slugs.length === 0) {
  throw new Error("No service slugs found in src/data/services.ts");
}

const routes = [
  "/",
  "/services",
  ...slugs.map((slug) => `/services/${slug}`),
  "/clocks",
  "/gallery",
  "/portfolio",
  "/about",
  "/contact",
];

const urls = routes
  .map((route) => `  <url>\n    <loc>${origin}${route === "/" ? "/" : route}</loc>\n  </url>`)
  .join("\n");

writeFileSync(
  resolve(root, "public/sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

console.log(`Wrote public/sitemap.xml with ${routes.length} routes.`);
