import type { JSX } from 'react'
import type { Testimonial } from '../../types/content'

type TestimonialCardProps = {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps): JSX.Element {
  return (
    <article className="surface-card h-full">
      <p className="text-sm leading-relaxed text-slate-100">"{testimonial.quote}"</p>
      <div className="mt-6 border-t border-accentSoft/30 pt-4">
        <p className="text-sm font-semibold text-white">{testimonial.name}</p>
        <p className="text-xs text-slate-400">
          {testimonial.role}, {testimonial.company}
        </p>
      </div>
    </article>
  )
}
