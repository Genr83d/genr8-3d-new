export type ServiceCategory = 'fabrication' | 'digital' | 'education'

/**
 * Where a picture came from. `stock` images are licensed library photos used to
 * illustrate a process; they are never GENR8-3D client work and are labelled as
 * such wherever they appear. `owned` is our own photography.
 */
export type ImageCredit = 'owned' | 'stock'

export interface Service {
  id: string
  slug: string
  name: string
  tagline: string
  shortDescription: string
  fullDescription: string
  category: ServiceCategory
  icon: 'cnc' | 'print' | 'laser' | 'model' | 'web'
  useCases: string[]
  materials: string[]
  capabilities: string[]
  gallery: { src: string; alt: string; credit: ImageCredit }[]
}

export interface ProcessStep {
  title: string
  description: string
}

export interface CourseCategory {
  id: string
  title: string
  level: string
  description: string
  duration: string
  outcomes: string[]
}

export interface Project {
  id: string
  title: string
  category: 'CNC Routing' | '3D Printing' | 'Laser Engraving' | '3D Modeling' | 'Web Development'
  tags: string[]
  description: string
  image: string
  credit: ImageCredit
}

export type ProductCategoryId =
  | 'clocks'
  | 'plaques'
  | 'pins'
  | 'keyrings'
  | '3d-prints'
  | 'school-furniture'

export interface ProductCategory {
  id: ProductCategoryId
  label: string
  description: string
  /** Public path to the category cover photo, e.g. "/products/clocks/cover.webp". */
  image?: string
}

export interface Product {
  id: string
  name: string
  category: ProductCategoryId
  description: string
  /** Public path to the product photo, e.g. "/products/clocks/mahogany-round.webp". */
  image?: string
  tags: string[]
  options?: string[]
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
}
