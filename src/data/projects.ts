import type { Project } from '../types/content'

export const projectCategories = [
  'All',
  'CNC Routing',
  '3D Printing',
  'Laser Engraving',
  '3D Modeling',
  'Web Development',
] as const

export type ProjectFilter = (typeof projectCategories)[number]

export const projects: Project[] = [
  {
    id: 'retail-fixture-01',
    title: 'Modular Retail Fixture System',
    category: 'CNC Routing',
    tags: ['Plywood', 'Rapid Assembly', 'Production Batch'],
    description: 'Designed and routed a flat-pack fixture kit for local retail rollouts with repeatable hole alignment.',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'robotics-enclosure-02',
    title: 'Robotics Sensor Enclosure',
    category: '3D Printing',
    tags: ['PETG', 'Functional Prototype', 'Iteration'],
    description: 'Produced heat-resistant enclosure iterations to validate fit, cable routing, and mounting constraints.',
    image: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'brand-plates-03',
    title: 'Serialized Product Nameplates',
    category: 'Laser Engraving',
    tags: ['Batching', 'Asset Tagging', 'Industrial'],
    description: 'Engraved durable asset tags with serialized IDs and brand marks for production equipment.',
    image: 'https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'concept-to-cad-04',
    title: 'Concept Sketch to Manufacturable CAD',
    category: '3D Modeling',
    tags: ['Parametric', 'Tolerance Planning', 'DFM'],
    description: 'Translated hand sketches into manufacturable CAD for rapid prototype and CNC-ready output.',
    image: 'https://images.unsplash.com/photo-1581092334447-f0f8f1c0f6ff?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'academy-site-05',
    title: 'NEXT-GEN Enrollment Platform',
    category: 'Web Development',
    tags: ['Responsive UI', 'Lead Capture', 'Hosting'],
    description: 'Built a high-performance enrollment site with course funnel tracking and managed deployment.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'event-signage-06',
    title: 'Event Wayfinding Signage',
    category: 'CNC Routing',
    tags: ['Acrylic', 'Fast Turnaround', 'Finishing'],
    description: 'Delivered routed and engraved signage set with quick install-ready hardware prep.',
    image: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1000&q=80',
  },
]
