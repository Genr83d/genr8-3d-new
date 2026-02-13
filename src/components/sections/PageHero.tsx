import type { JSX, ReactNode } from 'react'

type PageHeroProps = {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}

export function PageHero({ eyebrow, title, description, actions }: PageHeroProps): JSX.Element {
  return (
    <section className="rounded-3xl border border-accentSoft/35 bg-hero-radial p-8 shadow-card sm:p-10 lg:p-14">
      {eyebrow ? <p className="chip">{eyebrow}</p> : null}
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">{description}</p>
      {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  )
}
