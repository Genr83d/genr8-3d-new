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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
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
        primaryLabel="Build Custom Scope"
        primaryTo="/contact"
        secondaryLabel="View Portfolio"
        secondaryTo="/portfolio"
      />
    </>
  )
}
