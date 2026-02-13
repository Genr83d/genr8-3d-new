import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/sections/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'

const values = [
  {
    title: 'Innovation',
    detail: 'We continuously refine tooling, workflows, and digital systems to increase build quality and speed.',
  },
  {
    title: 'Quality',
    detail: 'Every project is delivered with practical production standards and transparent checkpoints.',
  },
  {
    title: 'Education',
    detail: 'Knowledge sharing is built into our work through mentorship, training, and client enablement.',
  },
  {
    title: 'Community',
    detail: 'We support local creators, schools, and startups with access to modern fabrication pathways.',
  },
]

export function AboutPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="About GENR8-3D"
        title="A modern maker studio built for precision and momentum"
        description="GENR8-3D started as a local fabrication lab and evolved into a full-service production partner that combines physical manufacturing with digital delivery and training."
        actions={
          <>
            <Link to="/contact" className="primary-button">
              Work With Us
            </Link>
            <Link to="/academy" className="secondary-button">
              Explore Academy
            </Link>
          </>
        }
      />

      <section className="section-shell grid gap-4 lg:grid-cols-2">
        <article className="surface-card">
          <SectionHeading title="Our Story" />
          <p className="small-muted">
            We built GENR8-3D to close the gap between ideas and manufacturable output. The studio operates at the intersection of engineering discipline and creative prototyping, helping teams deliver confidently from first revision to final run.
          </p>
        </article>
        <article className="surface-card">
          <SectionHeading title="Capabilities & Equipment" />
          <p className="small-muted">
            Our environment includes CNC routing systems, additive manufacturing stations, laser engraving tools, and collaborative design workstations. This integrated setup lets us execute mixed-mode projects without handoff friction.
          </p>
        </article>
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Core Values"
          title="How we operate"
          description="Our standards stay consistent across client services and NEXT-GEN Academy programs."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {values.map((value) => (
            <article key={value.title} className="surface-card">
              <h3 className="text-xl font-semibold text-white">{value.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{value.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell rounded-2xl border border-accentSoft/35 bg-accent/20 p-8">
        <h2 className="text-2xl font-semibold text-white">Local roots. Production mindset. Education pipeline.</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          From small business prototypes to classroom cohorts, we help ideas become tangible output with clear systems and modern tools.
        </p>
      </section>
    </>
  )
}
