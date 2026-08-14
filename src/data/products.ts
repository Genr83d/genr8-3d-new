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
      "GEN-TIME personalised wall clocks: solid hardwood faces, raised numerals, luminous hands, and a resin-domed centre carrying your photo, crest, or artwork.",
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
  {
    id: "school-furniture",
    label: "School Furniture",
    description:
      "Hard-wearing classroom furniture built to order for schools, training rooms, and learning centres.",
  },
];

export const products: Product[] = [
  {
    id: "clock-wedding-anniversary",
    name: "Wedding & Anniversary Clock",
    category: "clocks",
    description:
      "Names and date engraved into a solid hardwood face, finished with raised numerals, luminous hands, and mounted keepsake pieces chosen around the couple.",
    image: "/products/clocks/wedding-anniversary-clock.webp",
    tags: ["Wedding", "Engraved Names", "Keepsake"],
    options: [
      "Names, date, and motif engraved to order",
      "Mounted 3D keepsake accents",
      "Cedar, Mahogany, or Blue Mahoe",
    ],
    leadTime: "7-10 working days",
  },
  {
    id: "clock-family-photo",
    name: "Family Photo Clock",
    category: "clocks",
    description:
      "Your photograph and family name set into a decorative resin-domed centre, framed by raised numerals on a hardwood face.",
    image: "/products/clocks/family-photo-clock.webp",
    tags: ["Photo Centre", "Family Name", "Gift"],
    options: ["Send us your photo and wording", "Choice of centre frame artwork"],
    leadTime: "7-10 working days",
  },
  {
    id: "clock-one-love",
    name: "One Love Jamaica Clock",
    category: "clocks",
    description:
      "Island-themed design with the Jamaica map under a glossy resin dome and hand-painted engraved numerals in green and black.",
    image: "/products/clocks/one-love-jamaica-clock.webp",
    tags: ["Jamaican", "Resin Dome", "Gift Shop"],
    options: ["Painted engraved numerals", "Retail and gift-shop quantities"],
    leadTime: "5-7 working days",
  },
  {
    id: "clock-school-anniversary",
    name: "School Anniversary Clock",
    category: "clocks",
    description:
      "Milestone clock carrying a school crest and anniversary artwork under a resin dome, cut from dark hardwood with raised white numerals.",
    image: "/products/clocks/school-anniversary-clock.webp",
    tags: ["Schools", "Crest", "Milestone"],
    options: ["Crest and anniversary artwork supplied by you", "Matched batches for committees"],
    leadTime: "10-14 working days",
  },
  {
    id: "clock-recognition",
    name: "Recognition & Guest Speaker Clock",
    category: "clocks",
    description:
      "Presentation clock with crest, event title, and recipient name printed into the centre, set off by an engraved border and classic serif numerals.",
    image: "/products/clocks/recognition-clock.webp",
    tags: ["Awards", "Events", "Presentation"],
    options: ["Recipient name and event details", "Engraved decorative border"],
    leadTime: "7-10 working days",
  },
  {
    id: "clock-institution",
    name: "Institution & Campus Clock",
    category: "clocks",
    description:
      "Organisation clock combining campus photography and logo in the domed centre - built for reception areas, staff gifts, and alumni sets.",
    image: "/products/clocks/institution-campus-clock.webp",
    tags: ["Institutions", "Photo Centre", "Bulk Orders"],
    options: ["Logo and photography layout", "Boxed and ready to present"],
    leadTime: "10-14 working days",
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
  {
    id: "furniture-student-desk",
    name: "Student Desk & Chair Set",
    category: "school-furniture",
    description:
      "Single-student desk and matching chair built for daily classroom use, with a sealed writing surface and steady frame.",
    tags: ["Classroom", "Hard-wearing", "Bulk Orders"],
    options: ["Primary or secondary sizing", "Book shelf under the desktop"],
    leadTime: "10-15 working days",
  },
  {
    id: "furniture-classroom-table",
    name: "Classroom & Exam Table",
    category: "school-furniture",
    description:
      "Shared tables cut to your room dimensions for group work, labs, and exam layouts, with rounded safety edges.",
    tags: ["Custom Size", "Group Seating", "Rounded Edges"],
    options: ["2, 4, or 6 seater lengths", "Fixed or stackable frame"],
    leadTime: "10-15 working days",
  },
  {
    id: "furniture-storage-unit",
    name: "Storage & Cubby Unit",
    category: "school-furniture",
    description:
      "Open cubby and shelving units for bags, supplies, and learning materials, finished to match your classroom set.",
    tags: ["Storage", "Modular", "Schools"],
    options: ["Wall-mounted or free-standing", "Labelled or open compartments"],
    leadTime: "12-18 working days",
  },
];

export function getCategory(id: ProductCategoryId): ProductCategory | undefined {
  return productCategories.find((category) => category.id === id);
}

export function getCategoryLabel(id: ProductCategoryId): string {
  return getCategory(id)?.label ?? id;
}
