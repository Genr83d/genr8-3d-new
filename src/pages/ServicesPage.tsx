import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/sections/PageHero'
import { CTASection } from '../components/sections/CTASection'
import { ProcessFlow } from '../components/ui/ProcessFlow'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ServiceCard } from '../components/ui/ServiceCard'
import { processSteps, services } from '../data/services'

export function ServicesPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Main Services"
        title="Fabrication, design, and digital services under one workflow"
        description="Select a specialized service or combine multiple capabilities into a single production track with unified quality control."
        actions={
          <>
            <Link to="/contact" className="primary-button">
              Request a Quote
            </Link>
            <a href="#service-list" className="secondary-button">
              Browse Services
            </a>
          </>
        }
      />

      <section id="service-list" className="section-shell">
        <SectionHeading
          eyebrow="Service Catalog"
          title="Choose the capability that matches your project"
          description="Each service includes dedicated details on use cases, material constraints, and production guidance."
        />
        {[
          { category: "fabrication", title: "Fabrication Services", description: "CNC routing, 3D printing, and laser engraving for physical parts and finished pieces." },
          { category: "digital", title: "Digital Services", description: "3D modeling, web development, and hosting for your designs and online presence." },
        ].map((group) => (
          <div key={group.category} className="mb-8">
            <h2 className="mb-2 text-2xl font-semibold text-white">{group.title}</h2>
            <p className="mb-4 text-sm text-slate-300">{group.description}</p>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {services.filter((service) => service.category === group.category).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        ))}
        <div className="surface-card">
          <h2 className="text-2xl font-semibold text-white">Custom Products</h2>
          <p className="mt-2 text-sm text-slate-300">Order personalised clocks, plaques, gifts, and more, or create your own clock with our Clock Builder.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/products" className="secondary-button">Browse Products</Link>
            <Link to="/products/clocks" className="secondary-button">Clock Builder</Link>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Execution Model"
          title="How projects move through GENR8-3D"
          description="A clear four-step process keeps communication clean and output predictable."
        />
        <ProcessFlow steps={processSteps} />
      </section>

      <CTASection
        title="Need a blended service package?"
        description="Many projects combine modeling, fabrication, and digital delivery. We can scope them as one integrated quote."
        primaryLabel="Request a Quote"
        primaryTo="/contact"
        secondaryLabel="View Our Work"
        secondaryTo="/our-work"
      />
    </>
  )
}
