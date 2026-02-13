import type { CourseCategory } from '../types/content'

export const academyMission =
  'NEXT-GEN Academy trains creators, students, and early-career builders with practical digital fabrication workflows that connect design thinking to production execution.'

export const academyAudience = [
  'Students preparing for technical careers',
  'Educators building hands-on STEM programs',
  'Entrepreneurs launching product ideas',
  'Professionals upskilling in CAD and fabrication',
]

export const courseCategories: CourseCategory[] = [
  {
    id: 'academy-3d-printing',
    title: '3D Printing Foundations',
    level: 'Beginner to Intermediate',
    description:
      'Learn slicer strategy, material behavior, calibration, and failure diagnostics for reliable additive manufacturing.',
    duration: '4-week intensive',
    outcomes: ['Printer setup confidence', 'Tuned print profiles', 'Production-ready part orientation'],
  },
  {
    id: 'academy-cnc-basics',
    title: 'CNC Routing Basics',
    level: 'Beginner',
    description:
      'Move from vectors to toolpaths with safe machine operation, material prep, and post-processing workflows.',
    duration: '3-week workshop',
    outcomes: ['Vector cleanup and nesting', 'Toolpath strategy', 'Safe setup and operation'],
  },
  {
    id: 'academy-cad-modeling',
    title: 'CAD + 3D Modeling',
    level: 'Intermediate',
    description:
      'Develop parametric design skills to produce fabrication-ready geometry and iterative prototype revisions.',
    duration: '5-week cohort',
    outcomes: ['Parametric modeling fluency', 'Tolerance-aware design', 'Manufacturing export pipelines'],
  },
  {
    id: 'academy-laser-lab',
    title: 'Laser Engraving Lab',
    level: 'Beginner to Advanced',
    description:
      'Master vector prep, power/speed tuning, and repeatable engraving setups for product and branding work.',
    duration: '2-week studio lab',
    outcomes: ['Material-specific settings', 'Batch alignment workflows', 'Quality control checklists'],
  },
]

export const academyOutcomes = [
  {
    metric: '250+',
    label: 'Learners Trained',
  },
  {
    metric: '92%',
    label: 'Project Completion Rate',
  },
  {
    metric: '45+',
    label: 'Community Partner Projects',
  },
]
