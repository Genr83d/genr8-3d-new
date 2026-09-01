import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QuoteForm } from "../components/forms/QuoteForm";
import { conditionalFieldsFor, initialQuoteValues, validateQuote } from "../lib/quoteFields";

function renderForm(search = "") {
  return render(
    <MemoryRouter initialEntries={[`/contact${search}`]}>
      <QuoteForm />
    </MemoryRouter>,
  );
}

// Never let a test reach the live enquiry inbox.
const okResponse = { ok: true } as Response;
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(okResponse);
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function fillMinimum(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Name/), "Simone Clarke");
  await user.selectOptions(screen.getByLabelText(/^Service needed/), "cnc-routing");
  await user.type(screen.getByLabelText(/^Project details/), "Reception signage, 1.2m wide.");
}

describe("service preselect", () => {
  it("preselects the service a visitor arrived from", () => {
    renderForm("?service=laser-engraving");

    expect((screen.getByLabelText(/^Service needed/) as HTMLSelectElement).value).toBe(
      "laser-engraving",
    );
  });

  it("falls back to no selection for an unknown slug", () => {
    renderForm("?service=not-a-service");

    expect((screen.getByLabelText(/^Service needed/) as HTMLSelectElement).value).toBe("");
  });
});

describe("conditional fields", () => {
  it("asks fabrication customers about material and dimensions", async () => {
    const user = userEvent.setup();
    renderForm();

    expect(screen.queryByLabelText(/Material preference/)).toBeNull();

    await user.selectOptions(screen.getByLabelText(/^Service needed/), "cnc-routing");

    expect(screen.getByLabelText(/Material preference/)).toBeTruthy();
    expect(screen.getByLabelText(/Size \/ dimensions/)).toBeTruthy();
    expect(screen.queryByLabelText(/Current website/)).toBeNull();
  });

  it("asks web customers about their current site instead", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByLabelText(/^Service needed/), "web-development-hosting");

    expect(screen.getByLabelText(/Current website/)).toBeTruthy();
    expect(screen.queryByLabelText(/Material preference/)).toBeNull();
  });

  it("maps each service to its own question set", () => {
    expect(conditionalFieldsFor("3d-printing")).toContain("material");
    expect(conditionalFieldsFor("3d-modeling")).toEqual(["referenceFiles"]);
    expect(conditionalFieldsFor("")).toEqual([]);
  });
});

describe("contact method", () => {
  it("accepts an email address on its own", () => {
    const errors = validateQuote({
      ...initialQuoteValues,
      name: "A",
      service: "cnc-routing",
      details: "d",
      email: "someone@example.com",
    });

    expect(errors.email).toBeUndefined();
    expect(errors.phone).toBeUndefined();
  });

  it("accepts a phone number on its own", () => {
    const errors = validateQuote({
      ...initialQuoteValues,
      name: "A",
      service: "cnc-routing",
      details: "d",
      phone: "876 801 8972",
    });

    expect(errors.email).toBeUndefined();
    expect(errors.phone).toBeUndefined();
  });

  it("requires at least one of the two", () => {
    const errors = validateQuote({
      ...initialQuoteValues,
      name: "A",
      service: "cnc-routing",
      details: "d",
    });

    expect(errors.email).toMatch(/at least one way to reach you/i);
  });
});

describe("validation feedback", () => {
  it("moves focus to the first invalid field and announces the problems", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /Submit Quote Request/ }));

    expect(document.activeElement).toBe(screen.getByLabelText(/^Name/));
    expect(fetchMock).not.toHaveBeenCalled();

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/problems with this form/i);
  });

  it("clears a field error once the visitor fixes it", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /Submit Quote Request/ }));
    await screen.findByRole("alert");

    await user.type(screen.getByLabelText(/^Name/), "Simone");

    await waitFor(() => {
      expect(screen.queryByText(/Enter your name so we know/)).toBeNull();
    });
  });
});

describe("submission", () => {
  it("sends the request and confirms without promising a response time", async () => {
    const user = userEvent.setup();
    renderForm();

    await fillMinimum(user);
    await user.type(screen.getByLabelText(/^Email/), "simone@example.com");
    await user.click(screen.getByRole("button", { name: /Submit Quote Request/ }));

    expect(await screen.findByText(/your quote request is in/i)).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.service).toBe("CNC Routing");
    expect(body.name).toBe("Simone Clarke");

    // No turnaround has been confirmed by the business, so none is claimed.
    expect(document.body.textContent).not.toMatch(/\d+\s*(hours|hrs|business days)/i);
  });

  it("labels the budget with an explicit currency", async () => {
    const user = userEvent.setup();
    renderForm();

    await fillMinimum(user);
    await user.type(screen.getByLabelText(/^Email/), "simone@example.com");
    await user.selectOptions(screen.getByLabelText(/Budget currency/), "USD");
    await user.type(screen.getByLabelText(/Budget amount/), "1500");
    await user.click(screen.getByRole("button", { name: /Submit Quote Request/ }));

    await screen.findByText(/your quote request is in/i);
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.budget).toBe("USD 1500");
  });

  it("does not fire twice when the button is double-clicked", async () => {
    const user = userEvent.setup();
    let resolve: (value: Response) => void = () => {};
    fetchMock.mockImplementation(
      () =>
        new Promise<Response>((r) => {
          resolve = r;
        }),
    );
    renderForm();

    await fillMinimum(user);
    await user.type(screen.getByLabelText(/^Email/), "simone@example.com");

    const submit = screen.getByRole("button", { name: /Submit Quote Request/ });
    await user.click(submit);
    await user.click(submit);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    resolve(okResponse);
  });

  it("surfaces a failure with a direct way to reach the business", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue({ ok: false } as Response);
    renderForm();

    await fillMinimum(user);
    await user.type(screen.getByLabelText(/^Email/), "simone@example.com");
    await user.click(screen.getByRole("button", { name: /Submit Quote Request/ }));

    const alerts = await screen.findAllByRole("alert");
    expect(alerts.some((node) => /could not send your request/i.test(node.textContent ?? ""))).toBe(
      true,
    );
    expect(screen.getAllByRole("link", { name: /contact@genr83d.com/ }).length).toBeGreaterThan(0);
  });
});

describe("file handling", () => {
  it("offers a real way to send files instead of a control that does nothing", () => {
    renderForm();

    expect(document.querySelector('input[type="file"]')).toBeNull();
    expect(screen.getByRole("link", { name: /Email contact@genr83d.com/ })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Send on WhatsApp/ })).toBeTruthy();
  });
});
