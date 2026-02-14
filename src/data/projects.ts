import type { Project } from "../types/content";
import CncImg from "../assets/images/cnc.webp";

export const projectCategories = [
  "All",
  "CNC Routing",
  "3D Printing",
  "Laser Engraving",
  "3D Modeling",
  "Web Development",
] as const;

export type ProjectFilter = (typeof projectCategories)[number];

export const projects: Project[] = [
  {
    id: "precision-cutting-01",
    title: "Precision Cutting",
    category: "CNC Routing",
    tags: ["Signage", "Carpentry", "Acrylic"],
    description:
      "High-accuracy, repeatable cuts for flat sheet materials including wood, plastics, MDF, and composites.",
    image: CncImg,
  },
  {
    id: "additive-manufacturing-02",
    title: "Rapid Additive Manufacturing",
    category: "3D Printing",
    tags: ["Rapid Prototyping", "Functional Testing", "SLS"],
    description:
      "Fast, cost-effective production of complex geometries and custom parts using industrial-grade additive technologies.",
    image:
      "https://images.unsplash.com/photo-1611505908502-5b67e53e3a76?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "brand-plates-03",
    title: "Serialized Product Nameplates",
    category: "Laser Engraving",
    tags: ["Batching", "Asset Tagging", "Industrial"],
    description:
      "Engraved durable asset tags with serialized IDs and brand marks for production equipment.",
    image:
      "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "concept-to-cad-04",
    title: "Concept Sketch to Manufacturable CAD",
    category: "3D Modeling",
    tags: ["Parametric", "Tolerance Planning", "DFM"],
    description:
      "Translated hand sketches into manufacturable CAD for rapid prototype and CNC-ready output.",
    image:
      "https://images.unsplash.com/photo-1698296725423-9ede5de2d624?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "academy-site-05",
    title: "NEXT-GEN Enrollment Platform",
    category: "Web Development",
    tags: ["Responsive UI", "Lead Capture", "Hosting"],
    description:
      "Built a high-performance enrollment site with course funnel tracking and managed deployment.",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1000&q=80",
  },
];
