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
      "Printed acrylic pins and badges cut to any shape - prefect and leadership badges, club membership pins, committee roles, and charm drops, made in matched batches for whole clubs and year groups.",
  },
  {
    id: "keyrings",
    label: "Keyrings",
    description:
      "Full-colour printed acrylic keyrings cut to any shape - graduation sets, school houses, crests, milestones, and gift lines, produced from single pieces to full year-group runs.",
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
    id: "pin-prefect-badge",
    name: "Prefect & Leadership Badge",
    category: "pins",
    description:
      "Name-bar badges carrying each leadership title, finished with a hanging school crest charm - supplied as a full prefect body set.",
    image: "/products/pins/prefect-leadership-badge.webp",
    tags: ["Prefect Body", "Role Titles", "Charm Drop"],
    options: [
      "A different title per badge in one run",
      "Hanging crest charm on chain",
      "Pin or clutch back",
    ],
    leadTime: "7-10 working days",
  },
  {
    id: "pin-committee-role",
    name: "Committee Role Pin",
    category: "pins",
    description:
      "Society pins cut to the shape of the club's own artwork, with every executive role printed on its own version alongside the member run.",
    image: "/products/pins/committee-role-pin.webp",
    tags: ["Custom Shape", "Executive Roles", "Societies"],
    options: [
      "President through to member in one order",
      "Cut to your club artwork",
      "Matching charm drop",
    ],
    leadTime: "10-14 working days",
  },
  {
    id: "pin-sports-club",
    name: "Sports Club Pin",
    category: "pins",
    description:
      "Two-piece team pin pairing a club name bar with a sport-specific figure charm, split across executive and member tiers.",
    image: "/products/pins/sports-club-pin.webp",
    tags: ["Sports Teams", "Two-Piece", "Member Tiers"],
    options: ["Executive and member versions", "Figure charm drawn to your sport"],
    leadTime: "10-14 working days",
  },
  {
    id: "pin-club-crest",
    name: "Club Crest Pin",
    category: "pins",
    description:
      "Shield-shaped club pin with a high-gloss domed face, built to hold colour and detail on a uniform blazer.",
    image: "/products/pins/club-crest-pin.webp",
    tags: ["Clubs", "Domed Finish", "Uniform"],
    options: ["Crest shape cut to your badge", "Gloss dome or flat finish"],
    leadTime: "7-10 working days",
  },
  {
    id: "pin-round-membership",
    name: "Round Membership Pin",
    category: "pins",
    description:
      "Classic round membership pin for bands, choirs, and school societies - the simplest option for large annual runs.",
    image: "/products/pins/round-membership-pin.webp",
    tags: ["Membership", "Round Dome", "Batch Runs"],
    options: ["Standard round sizes", "Volume pricing for annual intakes"],
    leadTime: "5-7 working days",
  },
  {
    id: "pin-logo-cut",
    name: "Logo-Cut Pin",
    category: "pins",
    description:
      "Pin cut to the exact outline of your logo, so the badge reads as the mark itself rather than artwork dropped into a disc.",
    image: "/products/pins/logo-cut-pin.webp",
    tags: ["Custom Cut", "Logo Shape", "Studios"],
    options: ["Cut to your supplied artwork", "Artwork prepared for cutting if needed"],
    leadTime: "7-10 working days",
  },
  {
    id: "keyring-graduation-photo",
    name: "Graduation Photo Keyring",
    category: "keyrings",
    description:
      "Each student's photo, title, and graduating year printed into clear acrylic - produced as individual keepsakes or a full class set.",
    image: "/products/keyrings/graduation-photo-keyring.webp",
    tags: ["Graduation", "Photo Print", "Class Sets"],
    options: [
      "Square, round, or shield shapes",
      "Individual name and title per student",
      "Priced per unit on class runs",
    ],
    leadTime: "7-10 working days",
  },
  {
    id: "keyring-house-mascot",
    name: "House & Mascot Keyring",
    category: "keyrings",
    description:
      "Full-colour house mascots printed on round acrylic with the house name around the edge - one design per house, supplied as matched sets.",
    image: "/products/keyrings/house-mascot-keyring.webp",
    tags: ["School Houses", "Full Colour", "Matched Sets"],
    options: ["A design per house in your colours", "Mascot artwork drawn to order"],
    leadTime: "7-10 working days",
  },
  {
    id: "keyring-school-crest",
    name: "School Crest Keyring",
    category: "keyrings",
    description:
      "Crest and lettering keyrings cut to the outline of the badge itself rather than dropped into a standard disc.",
    image: "/products/keyrings/school-crest-keyring.webp",
    tags: ["Crest", "Custom Cut", "Schools"],
    options: ["Cut to your badge outline", "Shield, letterform, or free-form shapes"],
    leadTime: "7-10 working days",
  },
  {
    id: "keyring-anniversary",
    name: "Anniversary Keyring",
    category: "keyrings",
    description:
      "Commemorative milestone keyring with metallic print, made for reunions, foundation years, and institutional anniversaries.",
    image: "/products/keyrings/anniversary-keyring.webp",
    tags: ["Milestone", "Commemorative", "Metallic Print"],
    options: ["Metallic gold or silver backing", "Volume runs for reunion committees"],
    leadTime: "7-10 working days",
  },
  {
    id: "keyring-domed-bag-tag",
    name: "Domed Mascot Bag Tag",
    category: "keyrings",
    description:
      "The same house artwork finished with a raised resin dome and chain, sized to hang from a backpack zip or bag strap.",
    image: "/products/keyrings/domed-mascot-bag-tag.webp",
    tags: ["Domed Finish", "Bag Tag", "School Houses"],
    options: ["Raised resin dome finish", "Chain and split ring fitted"],
    leadTime: "7-10 working days",
  },
  {
    id: "keyring-gift-novelty",
    name: "Gift & Novelty Keyring",
    category: "keyrings",
    description:
      "Ready-made gift designs in coloured acrylic for Mother's Day, Father's Day, and everyday retail - or your own wording on the same shapes.",
    image: "/products/keyrings/gift-novelty-keyring.webp",
    tags: ["Gifts", "Seasonal", "Retail"],
    options: ["Stock gift designs", "Your wording or artwork on request"],
    leadTime: "5-7 working days",
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
