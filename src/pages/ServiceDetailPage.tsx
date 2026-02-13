import type { JSX } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageHero } from '../components/sections/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServiceIcon } from '../components/ui/ServiceIcon'
import { services } from '../data/services'

export function ServiceDetailPage(): JSX.Element {
  const { slug } = useParams<{ slug: string }>()
  const service = services.find((item) => item.slug === slug)

  if (!service) {
    return (
      <section className="surface-card">
        <h1 className="text-2xl font-semibold text-white">Service Not Found</h1>
        <p className="mt-3 text-sm text-slate-300">The requested service is unavailable or the link is outdated.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/services" className="secondary-button">
            Back to Services
          </Link>
          <Link to="/contact" className="primary-button">
            Request a Quote
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <PageHero
        eyebrow="Service Detail"
        title={service.name}
        description={service.fullDescription}
        actions={
          <>
            <Link to="/contact" className="primary-button">
              Request Quote
            </Link>
            <Link to="/services" className="secondary-button">
              All Services
            </Link>
          </>
        }
      />

      <section className="section-shell grid gap-4 lg:grid-cols-3">
        <article className="surface-card lg:col-span-2">
          <div className="mb-4 inline-flex rounded-lg border border-accentSoft/45 bg-accent/20 p-3">
            <ServiceIcon icon={service.icon} />
          </div>
          <p className="chip">{service.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-200">{service.fullDescription}</p>
        </article>

        <article className="surface-card">
          <h2 className="text-lg font-semibold text-white">Ideal For</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {service.useCases.map((useCase) => (
              <li key={useCase} className="rounded-md border border-accentSoft/30 px-3 py-2">
                {useCase}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section-shell grid gap-4 lg:grid-cols-2">
        <article className="surface-card">
          <SectionHeading title="Materials" />
          <ul className="grid gap-2 sm:grid-cols-2">
            {service.materials.map((material) => (
              <li key={material} className="rounded-md border border-accentSoft/30 px-3 py-2 text-sm text-slate-200">
                {material}
              </li>
            ))}
          </ul>
        </article>
        <article className="surface-card">
          <SectionHeading title="Capabilities" />
          <ul className="grid gap-2 sm:grid-cols-2">
            {service.capabilities.map((capability) => (
              <li key={capability} className="rounded-md border border-accentSoft/30 px-3 py-2 text-sm text-slate-200">
                {capability}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Gallery"
          title={`${service.name} in action`}
          description="Representative output from recent client builds."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {service.gallery.map((item) => (
            <figure key={item.src} className="surface-card p-3">
              <img src={item.src} alt={item.alt} className="h-72 w-full rounded-xl object-cover" loading="lazy" />
              <figcaption className="mt-3 text-xs text-slate-400">{item.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="rounded-2xl border border-accentSoft/35 bg-accent/20 p-6 sm:p-8 lg:flex lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Ready to scope your {service.name.toLowerCase()} project?</h2>
            <p className="mt-2 text-sm text-slate-200">
              Send files, target quantity, and timing. We will return a production-ready plan.
            </p>
          </div>
          <Link to="/contact" className="primary-button mt-4 lg:mt-0">
            Request Quote
          </Link>
        </div>
      </section>
    </>
  )
}
