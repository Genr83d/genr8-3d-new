import type { Product, ProductCategory, ProductCategoryId } from "../types/content";

/**
 * Product photos live in `public/products/<category>/` and are referenced by
 * their public path (for example "/products/clocks/mahogany-round.webp").
 * Leave `image` unset until the photo is added and the gallery shows a
 * "photo coming soon" placeholder tile in its place.
 */
export const productCategories: ProductCategory[] = [
  {
    id: "clocks",
    label: "Clocks",
    description:
      "Custom wall clocks cut and engraved in-house, from clean minimal faces to fully personalised centre designs.",
  },
  {
    id: "plaques",
    label: "Plaques",
    description:
      "Award, recognition, and signage plaques in wood and acrylic with crisp engraved detail.",
  },
  {
    id: "pins",
    label: "Pins",
    description:
      "Small-batch lapel and badge pins for teams, events, schools, and brand merchandise.",
  },
  {
    id: "keyrings",
    label: "Keyrings",
    description:
      "Durable personalised keyrings and tags, ideal for giveaways, staff sets, and retail lines.",
  },
];

export const products: Product[] = [
  {
    id: "clock-round-hardwood",
    name: "Round Hardwood Clock",
    category: "clocks",
    description:
      "Classic round face cut from solid hardwood with engraved numerals and a silent sweep movement.",
    tags: ["Hardwood", "Engraved", "Silent Movement"],
    options: ['12" / 16" / 20" diameter', "Roman, Arabic, or minimal markers"],
    leadTime: "5-7 working days",
  },
  {
    id: "clock-custom-centre",
    name: "Custom Centre Clock",
    category: "clocks",
    description:
      "Personalised centre artwork - a logo, monogram, or photo - framed by your choice of wood and number style.",
    tags: ["Personalised", "Logo Ready", "Gift"],
    options: ["Upload your own artwork", "Wood or acrylic face"],
    leadTime: "7-10 working days",
  },
  {
    id: "plaque-award",
    name: "Award Plaque",
    category: "plaques",
    description:
      "Presentation plaque with engraved title, recipient name, and date - supplied ready to mount or stand.",
    tags: ["Awards", "Engraved", "Corporate"],
    options: ["Wall mount or desk stand", "Wood, acrylic, or two-tone"],
    leadTime: "4-6 working days",
  },
  {
    id: "plaque-house-sign",
    name: "House & Office Sign",
    category: "plaques",
    description:
      "Weather-ready name and number signage cut to your dimensions with raised or engraved lettering.",
    tags: ["Signage", "Outdoor", "Custom Size"],
    options: ["Raised or engraved lettering", "Painted or natural finish"],
    leadTime: "5-7 working days",
  },
  {
    id: "pin-lapel-logo",
    name: "Logo Lapel Pin",
    category: "pins",
    description:
      "Your logo reproduced as a compact lapel pin with a butterfly clutch back - built for staff and member sets.",
    tags: ["Branding", "Small Batch", "Staff Sets"],
    options: ["Butterfly or magnetic back", "Single or multi-colour"],
    leadTime: "7-10 working days",
  },
  {
    id: "pin-event-badge",
    name: "Event Badge Pin",
    category: "pins",
    description:
      "Dated commemorative pins for conferences, graduations, and club milestones, produced in matched runs.",
    tags: ["Events", "Commemorative", "Batching"],
    options: ["Sequential numbering available", "Presentation card backing"],
    leadTime: "7-10 working days",
  },
  {
    id: "keyring-personalised",
    name: "Personalised Keyring",
    category: "keyrings",
    description:
      "Name, initial, or date engraved on a hard-wearing tag with a solid split ring and optional chain.",
    tags: ["Personalised", "Gift", "Engraved"],
    options: ["Wood, acrylic, or metal tag", "Split ring or clip"],
    leadTime: "3-5 working days",
  },
  {
    id: "keyring-branded-bulk",
    name: "Branded Bulk Keyring",
    category: "keyrings",
    description:
      "Consistent branded keyrings produced in volume for promotions, fleets, property handovers, and giveaways.",
    tags: ["Promotional", "Volume", "Branding"],
    options: ["Bulk pricing from 25 units", "Custom shape cutting"],
    leadTime: "7-10 working days",
  },
];

export function getCategory(id: ProductCategoryId): ProductCategory | undefined {
  return productCategories.find((category) => category.id === id);
}

export function getCategoryLabel(id: ProductCategoryId): string {
  return getCategory(id)?.label ?? id;
}
