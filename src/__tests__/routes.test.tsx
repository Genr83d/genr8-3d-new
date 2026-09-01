import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "../App";
import { publicRoutes } from "../data/siteRoutes";
import { services } from "../data/services";

// `/clocks` is lazy and pulls in Firebase Auth/Firestore at import time. The
// smoke test only cares that the route resolves to its page, so the SDK is
// stubbed rather than reaching the network.
vi.mock("../lib/firebase", () => ({
  auth: { currentUser: null, onAuthStateChanged: () => () => {} },
  db: {},
}));
// Keep the real module shape (constructors, enums) and stub only the calls that
// would otherwise reach the network or need a live app instance.
vi.mock("firebase/auth", async (importOriginal) => ({
  ...(await importOriginal<typeof import("firebase/auth")>()),
  onAuthStateChanged: () => () => {},
}));
vi.mock("firebase/firestore", async (importOriginal) => ({
  ...(await importOriginal<typeof import("firebase/firestore")>()),
  collection: vi.fn(),
  doc: vi.fn(),
  onSnapshot: () => () => {},
}));

/**
 * The heading a direct request to each route must produce. Adding a route to
 * `publicRoutes` without adding it here fails the suite, so the manifest and
 * the router cannot drift apart silently.
 */
const expectedHeadings: Record<string, string | RegExp> = {
  "/": /Build Smarter with GENR8-3D/i,
  "/services": /Fabrication, design, and digital services/i,
  "/clocks": /Configure your wooden wall clock/i,
  "/gallery": /Products we make in-house/i,
  "/portfolio": /Projects built for real-world deployment/i,
  "/about": /A modern maker studio/i,
  "/contact": /Start your next build with GENR8-3D/i,
  ...Object.fromEntries(
    services.map((service) => [`/services/${service.slug}`, service.name]),
  ),
};

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("public routes", () => {
  it("covers every route in the sitemap manifest", () => {
    for (const route of publicRoutes) {
      expect(
        expectedHeadings[route],
        `No expected heading declared for "${route}". Add one when you add a route.`,
      ).toBeDefined();
    }
  });

  it.each(publicRoutes)("renders a page at %s", async (route) => {
    renderAt(route);

    const heading = await screen.findByRole("heading", {
      level: 1,
      name: expectedHeadings[route],
    });

    expect(heading).toBeTruthy();
    expect(screen.queryByText(/Page Not Found/i)).toBeNull();
  });
});

describe("unknown routes", () => {
  it.each(["/nonexistent-xyz", "/services/not-a-real-service", "/deep/unknown/path"])(
    "renders the branded 404 at %s",
    async (route) => {
      renderAt(route);

      expect(await screen.findByText(/Page Not Found/i)).toBeTruthy();
    },
  );

  it("marks the 404 noindex so soft 404s stay out of search results", async () => {
    renderAt("/nonexistent-xyz");
    await screen.findByText(/Page Not Found/i);

    expect(document.querySelector('meta[name="robots"][content="noindex"]')).toBeTruthy();
  });
});
