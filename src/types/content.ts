export type ServiceCategory = 'fabrication' | 'digital' | 'education'

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
  gallery: { src: string; alt: string }[]
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
  leadTime?: string
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
}
