/**
 * Shape and per-service field rules for the quote request form.
 *
 * Kept out of the component so the rules can be unit tested and so the form file
 * only exports a component (react-refresh).
 */
export type QuoteFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  preferredContact: string;
  service: string;
  details: string;
  quantity: string;
  dimensions: string;
  material: string;
  deadline: string;
  deliveryLocation: string;
  budgetAmount: string;
  budgetCurrency: string;
  currentWebsite: string;
  referenceFiles: string;
};

export type QuoteFieldName = keyof QuoteFormValues;

export const initialQuoteValues: QuoteFormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  preferredContact: "email",
  service: "",
  details: "",
  quantity: "",
  dimensions: "",
  material: "",
  deadline: "",
  deliveryLocation: "",
  budgetAmount: "",
  budgetCurrency: "JMD",
  currentWebsite: "",
  referenceFiles: "",
};

/**
 * Which optional fields are worth asking about for a given service. Asking a web
 * development customer for a material, or a CNC customer for their current
 * website, only adds friction - so each service sees just the questions that
 * change its quote.
 */
export function conditionalFieldsFor(serviceSlug: string): QuoteFieldName[] {
  switch (serviceSlug) {
    case "cnc-routing":
    case "3d-printing":
    case "laser-engraving":
      return ["quantity", "dimensions", "material", "deliveryLocation"];
    case "3d-modeling":
      return ["referenceFiles"];
    case "web-development-hosting":
      return ["currentWebsite"];
    default:
      return [];
  }
}

/** Submit order, so focus lands on the first invalid field as it reads on screen. */
export const quoteFieldOrder: QuoteFieldName[] = [
  "name",
  "email",
  "phone",
  "service",
  "details",
];

/**
 * A quote needs a name, a service, a description, and one way to reply. Requiring
 * both an email address and a phone number turns people away for no gain.
 */
export function validateQuote(
  values: QuoteFormValues,
): Partial<Record<QuoteFieldName, string>> {
  const errors: Partial<Record<QuoteFieldName, string>> = {};

  if (!values.name.trim()) errors.name = "Enter your name so we know who to reply to.";

  const hasEmail = Boolean(values.email.trim());
  const hasPhone = Boolean(values.phone.trim());

  if (!hasEmail && !hasPhone) {
    errors.email = "Give us at least one way to reach you - an email address or a phone number.";
  } else {
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (hasPhone && values.phone.replace(/\D/g, "").length < 7) {
      errors.phone = "Enter a phone number we can reach you on.";
    }
  }

  if (!values.service) errors.service = "Select the service you need.";
  if (!values.details.trim()) errors.details = "Describe what you want made so we can scope it.";

  return errors;
}
