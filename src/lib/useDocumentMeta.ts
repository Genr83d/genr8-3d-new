import { useEffect } from "react";
import { canonicalUrl } from "../data/siteRoutes";

type DocumentMeta = {
  title: string;
  description: string;
  /** Route path, e.g. "/services/cnc-routing". Used for the canonical URL. */
  path: string;
  noIndex?: boolean;
};

function upsert(selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  apply(element);
}

/**
 * Sets the title, description, canonical URL and share tags for a route.
 *
 * These are updated in place rather than appended: `index.html` already ships a
 * description and canonical as the no-JS fallback, and rendering a second set
 * (which React 19's metadata hoisting would do) leaves crawlers with duplicates.
 */
export function useDocumentMeta({ title, description, path, noIndex = false }: DocumentMeta): void {
  useEffect(() => {
    const url = canonicalUrl(path);

    document.title = title;

    const meta = (attr: "name" | "property", key: string, content: string) =>
      upsert(
        `meta[${attr}="${key}"]`,
        () => {
          const el = document.createElement("meta");
          el.setAttribute(attr, key);
          return el;
        },
        (el) => el.setAttribute("content", content),
      );

    meta("name", "description", description);
    meta("property", "og:title", title);
    meta("property", "og:description", description);
    meta("property", "og:url", url);

    upsert(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        return el;
      },
      (el) => el.setAttribute("href", url),
    );

    if (!noIndex) return;

    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);

    return () => {
      robots.remove();
    };
  }, [title, description, path, noIndex]);
}
