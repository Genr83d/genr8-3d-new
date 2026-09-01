import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// `@testing-library/react` only self-registers cleanup when Vitest globals are
// on. Tests here import their helpers explicitly, so unmount between cases to
// stop one render leaking into the next assertion.
afterEach(() => {
  cleanup();
});
