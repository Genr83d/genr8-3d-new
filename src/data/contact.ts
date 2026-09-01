/**
 * Single source of truth for how customers reach GENR8-3D.
 *
 * Every rendering of these details must be actionable - `tel:`, `mailto:`, and
 * the WhatsApp deep link - so a phone visitor can tap through instead of
 * copying text by hand.
 */
export const contactDetails = {
  email: "contact@genr83d.com",
  /** Formatted for reading. */
  phoneDisplay: "(876) 801-8972",
  /** E.164, for `tel:` and WhatsApp. */
  phoneE164: "+18768018972",
  whatsappNumber: "18768018972",
  hours: "Mon-Fri: 8:00 AM - 5:00 PM",
  weekend: "Weekends: Closed",
  address: {
    lines: ["Pembrooke Commercial Complex", "Lots 19 & 20 Fairfield", "Montego Bay, St. James"],
    country: "Jamaica",
  },
} as const;

export const mailtoHref = (subject?: string, body?: string): string => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString();

  return `mailto:${contactDetails.email}${query ? `?${query}` : ""}`;
};

export const telHref = `tel:${contactDetails.phoneE164}`;

export const whatsappHref = (message?: string): string =>
  `https://wa.me/${contactDetails.whatsappNumber}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

/**
 * File formats the team can open. Listed wherever we ask a customer to send
 * artwork, so nobody guesses and gets bounced.
 */
export const acceptedFileFormats = [
  "STL",
  "STEP",
  "DXF",
  "SVG",
  "AI",
  "PDF",
  "JPG",
  "PNG",
] as const;
