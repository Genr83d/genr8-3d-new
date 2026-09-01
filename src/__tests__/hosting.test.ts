import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { publicRoutes, siteOrigin } from "../data/siteRoutes";

const root = resolve(import.meta.dirname, "../..");
const readRootFile = (name: string) => readFileSync(resolve(root, name), "utf8");

const vercelConfig = JSON.parse(readRootFile("vercel.json")) as {
  rewrites: { source: string; destination: string }[];
  headers: { source: string; headers: { key: string; value: string }[] }[];
};

describe("vercel SPA fallback", () => {
  const [rewrite, ...extraRewrites] = vercelConfig.rewrites;

  it("declares exactly one fallback to the app shell", () => {
    expect(extraRewrites).toHaveLength(0);
    expect(rewrite.destination).toBe("/index.html");
  });

  // The rewrite `source` uses no path-to-regexp parameters, so Vercel compiles it
  // to this same anchored expression. Matching here therefore means "Vercel serves
  // index.html for this path" - which is what turns a direct request or a refresh
  // from a 404 into a working page.
  const matcher = new RegExp(`^${rewrite.source}$`);

  it.each(publicRoutes)("serves the app shell for a direct request to %s", (route) => {
    expect(matcher.test(route)).toBe(true);
  });

  it.each([
    "/services/cnc-routing/",
    "/some/future/route",
    "/contact?service=cnc-routing".split("?")[0],
  ])("serves the app shell for %s", (route) => {
    expect(matcher.test(route)).toBe(true);
  });

  // A missing file must stay a real 404. Rewriting these to the shell would hand
  // crawlers and browsers a 200 HTML response where a script or image was expected.
  it.each([
    "/assets/index-Dsj6YL0d.js",
    "/assets/index-BM6asljU.css",
    "/assets/does-not-exist.js",
    "/products/clocks/one-love-jamaica-clock.webp",
    "/products/clocks/missing-photo.webp",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/api/anything",
  ])("leaves %s to the filesystem so a miss is a real 404", (path) => {
    expect(matcher.test(path)).toBe(false);
  });

  it("caches hashed build assets immutably", () => {
    const assetHeaders = vercelConfig.headers.find((entry) => entry.source === "/assets/(.*)");
    const cacheControl = assetHeaders?.headers.find((header) => header.key === "Cache-Control");

    expect(cacheControl?.value).toContain("immutable");
  });
});

describe("crawlable route surface", () => {
  it("lists exactly the public routes in sitemap.xml", () => {
    const sitemap = readRootFile("public/sitemap.xml");
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

    expect(locations).toEqual(publicRoutes.map((route) => `${siteOrigin}${route}`));
  });

  it("points robots.txt at the sitemap and keeps the admin route out", () => {
    const robots = readRootFile("public/robots.txt");

    expect(robots).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
    expect(robots).toContain("Disallow: /admin/");
  });

  it("keeps the auth-gated admin route out of the sitemap", () => {
    expect(publicRoutes).not.toContain("/admin/clocks");
  });
});
