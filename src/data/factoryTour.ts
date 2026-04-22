export type FactoryTourStop = {
  id: string;
  title: string;
  zone: string;
  description: string;
  highlights: string[];
  visitorFocus: string;
  duration: string;
  labelLines: string[];
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FactoryTourMode = {
  title: string;
  description: string;
};

export const factoryTourStops: FactoryTourStop[] = [
  {
    id: "reception-briefing",
    title: "Reception & Briefing",
    zone: "Arrival",
    description:
      "Set the tone of the visit with a short welcome, orientation, and a quick explanation of how the factory tour flows from concept to dispatch.",
    highlights: ["Check-in desk", "Safety intro", "Tour overview"],
    visitorFocus: "First impression and orientation",
    duration: "2-3 min",
    labelLines: ["Reception", "& Briefing"],
    x: 6,
    y: 8,
    width: 24,
    height: 16,
  },
  {
    id: "design-studio",
    title: "Design Studio",
    zone: "Planning",
    description:
      "Show how ideas become build-ready files with CAD preparation, material planning, and collaborative review before production starts.",
    highlights: ["CAD reviews", "Material planning", "Client sign-off"],
    visitorFocus: "How projects are prepared before fabrication",
    duration: "3-4 min",
    labelLines: ["Design", "Studio"],
    x: 34,
    y: 8,
    width: 24,
    height: 16,
  },
  {
    id: "cnc-routing",
    title: "CNC Routing",
    zone: "Heavy Fabrication",
    description:
      "Feature the scale and precision of your CNC workflow with toolpath simulation, material handling, and machine-ready output.",
    highlights: ["Toolpath simulation", "Sheet setup", "Machine enclosure"],
    visitorFocus: "Precision machining and production scale",
    duration: "4-5 min",
    labelLines: ["CNC", "Routing"],
    x: 62,
    y: 8,
    width: 32,
    height: 20,
  },
  {
    id: "additive-bay",
    title: "3D Print Bay",
    zone: "Rapid Prototyping",
    description:
      "Highlight the additive manufacturing area where prototypes, test parts, and short-run pieces are prepared for review or downstream finishing.",
    highlights: ["Printer wall", "Material shelves", "Live status screens"],
    visitorFocus: "Rapid iteration and prototyping speed",
    duration: "3-4 min",
    labelLines: ["3D Print", "Bay"],
    x: 62,
    y: 34,
    width: 32,
    height: 20,
  },
  {
    id: "laser-finishing",
    title: "Laser & Finishing",
    zone: "Detail Work",
    description:
      "Use this stop to explain fine-detail processing, engraving, cleanup, and surface preparation that bring parts to presentation quality.",
    highlights: ["Laser detailing", "Surface prep", "Branding passes"],
    visitorFocus: "Fine-detail finishing and visual quality",
    duration: "3 min",
    labelLines: ["Laser", "& Finishing"],
    x: 34,
    y: 34,
    width: 24,
    height: 20,
  },
  {
    id: "assembly-qa",
    title: "Assembly & QA",
    zone: "Final Validation",
    description:
      "Demonstrate how components are assembled, checked for fit and tolerances, and signed off before they move to packing.",
    highlights: ["Fit checks", "Tolerance review", "Final sign-off"],
    visitorFocus: "Quality control before release",
    duration: "3 min",
    labelLines: ["Assembly", "& QA"],
    x: 6,
    y: 34,
    width: 24,
    height: 20,
  },
  {
    id: "dispatch",
    title: "Packing & Dispatch",
    zone: "Handover",
    description:
      "Close the tour with packaging, labeling, and dispatch workflows so visitors understand how the project leaves the floor ready for delivery.",
    highlights: ["Protective packing", "Labeling", "Pickup staging"],
    visitorFocus: "How finished work leaves the factory",
    duration: "2-3 min",
    labelLines: ["Packing", "& Dispatch"],
    x: 24,
    y: 58,
    width: 52,
    height: 10,
  },
];

export const factoryTourModes: FactoryTourMode[] = [
  {
    title: "Self-Guided Browsing",
    description:
      "Visitors can click each stop in any order and explore the factory flow at their own pace.",
  },
  {
    title: "Guided Sales Walkthrough",
    description:
      "Your team can use the same map during calls, presentations, and quote reviews to explain the production process.",
  },
  {
    title: "Model-Ready Experience",
    description:
      "The page is prepared for a 3D scene or embed so the floor map and hotspots can evolve into a deeper virtual tour later.",
  },
];

export const factoryTourViewerChecklist = [
  "Optimized GLB or GLTF export for web delivery",
  "Named camera positions that match the tour stops",
  "Compressed textures for faster mobile loading",
  "Optional Sketchfab or Matterport embed link",
];
