import type { ProcessStep, Service } from '../types/content'

export const processSteps: ProcessStep[] = [
  {
    title: 'Request',
    description:
      'Share project requirements, quantity, timeline, and reference files through our intake form or a direct consultation.',
  },
  {
    title: 'Design',
    description:
      'We validate geometry, optimize for manufacturability, and provide a clear quote with milestones before production starts.',
  },
  {
    title: 'Production',
    description:
      'Our CNC, additive, and laser workflows run with documented tolerances, material checks, and in-process quality verification.',
  },
  {
    title: 'Delivery',
    description:
      'You receive final parts, digital deliverables, and optional post-project support for iteration, deployment, or training.',
  },
]

export const services: Service[] = [
  {
    id: 'cnc-routing',
    slug: 'cnc-routing',
    name: 'CNC Routing',
    tagline: 'Large-format precision for wood, plastics, and composite fabrication.',
    shortDescription:
      'High-accuracy 2.5D and 3D routing for signage, fixtures, panels, enclosures, and custom prototypes.',
    fullDescription:
      'GENR8-3D CNC routing services support rapid one-offs through repeatable production runs. We work from CAD, DXF, and vector workflows to produce clean edge quality, reliable hole alignment, and production-ready parts.',
    category: 'fabrication',
    icon: 'cnc',
    useCases: ['Retail fixtures', 'Architectural panels', 'Custom enclosures', 'Template and jig manufacturing'],
    materials: ['Hardwood', 'Plywood', 'HDPE', 'Acrylic', 'Foam board', 'Aluminum composite panel'],
    capabilities: ['3-axis routing', 'Tabbed nesting', 'Pocketing and contour cutting', 'Finishing prep support'],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1400&q=80', alt: 'CNC machine cutting sheet material' },
      { src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=80', alt: 'Finished routed wood display panel' },
    ],
  },
  {
    id: '3d-printing',
    slug: '3d-printing',
    name: '3D Printing',
    tagline: 'Fast additive prototyping and functional part production.',
    shortDescription:
      'From concept models to end-use jigs, we deliver dimensionally stable components with rapid turnarounds.',
    fullDescription:
      'Our 3D printing workflow is built for iteration speed and repeatability. We support engineering prototypes, fit-check parts, and low-volume production with optimized orientation, support strategy, and quality inspection at handoff.',
    category: 'fabrication',
    icon: 'print',
    useCases: ['Product prototyping', 'Functional brackets', 'Assembly fixtures', 'Educational kits'],
    materials: ['PLA', 'PETG', 'ABS', 'TPU (select applications)'],
    capabilities: ['FDM production queueing', 'Strength-oriented slicing profiles', 'Multi-part assembly strategy', 'Surface finishing options'],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=1400&q=80', alt: '3D printer manufacturing a part' },
      { src: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1400&q=80', alt: 'Array of finished 3D printed components' },
    ],
  },
  {
    id: 'laser-engraving',
    slug: 'laser-engraving',
    name: 'Laser Engraving',
    tagline: 'Sharp detail and clean marks for branding, labeling, and personalization.',
    shortDescription:
      'Precision laser operations for custom products, industrial labels, branded packaging, and promotional pieces.',
    fullDescription:
      'GENR8-3D laser engraving services combine accurate vector prep with tuned power profiles to achieve consistent contrast, line quality, and repeatability across batches.',
    category: 'fabrication',
    icon: 'laser',
    useCases: ['Branded merchandise', 'Product serial tags', 'Awards and plaques', 'Custom gifts and accessories'],
    materials: ['Anodized aluminum', 'Acrylic', 'Wood', 'Leather', 'Coated metals'],
    capabilities: ['Raster engraving', 'Vector marking', 'Batch serialization', 'Masking and alignment fixtures'],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1581092588421-8b6ef1f045b4?auto=format&fit=crop&w=1400&q=80', alt: 'Laser machine engraving metal plate' },
      { src: 'https://images.unsplash.com/photo-1582582494700-1f9f6fbd4f2d?auto=format&fit=crop&w=1400&q=80', alt: 'Close-up of engraved branded product' },
    ],
  },
  {
    id: '3d-modeling',
    slug: '3d-modeling',
    name: '3D Modeling',
    tagline: 'Design-ready geometry for fabrication, visualization, and iteration.',
    shortDescription:
      'Parametric and production-focused modeling for prototypes, fixtures, and custom mechanical concepts.',
    fullDescription:
      'Our modeling team translates ideas into clean, manufacturable digital assets. We build from sketches, scan references, or existing drawings and output files optimized for CNC, 3D printing, and presentation.',
    category: 'digital',
    icon: 'model',
    useCases: ['Concept to CAD conversion', 'Reverse-engineered replacements', 'Packaging and mount design', 'Prototype revisions'],
    materials: ['Digital deliverables only'],
    capabilities: ['Parametric CAD', 'Tolerance-aware design', 'Exploded assembly visuals', 'STL/STEP/DXF export pipelines'],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1626908013351-800ddd734b8a?auto=format&fit=crop&w=1400&q=80', alt: '3D modeling software interface with product concept' },
      { src: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=1400&q=80', alt: 'Technical CAD drawing and digital model' },
    ],
  },
  {
    id: 'web-development-hosting',
    slug: 'web-development-hosting',
    name: 'Web Development & Hosting',
    tagline: 'Digital platforms that support fabrication businesses and training pipelines.',
    shortDescription:
      'Modern websites, booking flows, and hosting support for makers, studios, and technical training organizations.',
    fullDescription:
      'Beyond physical production, GENR8-3D delivers high-performance web builds that help teams showcase capabilities, capture leads, and scale operations. We handle UX, frontend implementation, and managed hosting workflows.',
    category: 'digital',
    icon: 'web',
    useCases: ['Service business websites', 'Course enrollment pages', 'Portfolio systems', 'Quote request workflows'],
    materials: ['Digital deliverables only'],
    capabilities: ['Responsive frontend engineering', 'CMS and static content strategies', 'Performance optimization', 'Managed hosting guidance'],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1400&q=80', alt: 'Developer workstation with web UI prototypes' },
      { src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=80', alt: 'Code editor and design system for modern website' },
    ],
  },
]
