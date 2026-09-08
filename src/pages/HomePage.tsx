import type { JSX } from "react";
import { Link } from "react-router-dom";
import { services } from "../data/services";
import { projects } from "../data/projects";
import { testimonials } from "../data/testimonials";
import { SectionHeading } from "../components/ui/SectionHeading";
import { ServiceCard } from "../components/ui/ServiceCard";
import { ProjectCard } from "../components/ui/ProjectCard";
import { TestimonialCard } from "../components/ui/TestimonialCard";
import { PageHero } from "../components/sections/PageHero";
import { CTASection } from "../components/sections/CTASection";
import { MetricStrip } from "../components/sections/MetricStrip";

const whyItems = [
  {
    title: "Precision-Driven Workflow",
    description:
      "Engineering-minded process controls from design validation to final production handoff.",
  },
  {
    title: "Fast Iteration Cycles",
    description:
      "Short lead times for prototypes and clear production scaling paths when volumes increase.",
  },
  {
    title: "Local Build + Modern Stack",
    description:
      "Hands-on fabrication paired with digital delivery, web presence, and technical training support.",
  },
];

export function HomePage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Advanced Fabrication Studio"
        title="Build Smarter with GENR8-3D"
        description="Precision CNC routing, additive manufacturing, laser workflows, and technical design for teams that need quality output without production friction."
        actions={
          <>
            <Link to="/contact" className="primary-button">
              Request a Quote
            </Link>
            <Link to="/services" className="secondary-button">
              View Services
            </Link>
          </>
        }
      />

      <MetricStrip
        metrics={[
          { label: "Projects Delivered", value: "540+" },
          { label: "Average Prototype Turnaround", value: "72 hrs" },
          { label: "Core Services", value: "5" },
          { label: "Client Satisfaction", value: "98%" },
        ]}
      />

      <section className="section-shell">
        <SectionHeading
          eyebrow="Core Services"
          title="Integrated fabrication and digital execution"
          description="From concept modeling to production parts and deployment-ready web platforms."
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
          eyebrow="Why GENR8-3D"
          title="Built for speed, accuracy, and practical outcomes"
          description="We align technical decisions with business constraints so your project moves from idea to usable output faster."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {whyItems.map((item) => (
            <article key={item.title} className="surface-card">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Featured Work"
          title="Recent projects from our production floor"
          description="A mix of fabrication, design, and digital delivery engagements across industries."
          action={
            <Link to="/our-work" className="secondary-button">
              View Our Work
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Client Feedback"
          title="Teams trust GENR8-3D for reliable execution"
          description="Partnerships built on quality output, transparent communication, and practical engineering support."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <CTASection
        title="Ready to move your project into production?"
        description="Share your goals, files, and timeline. We will map the right process and return a clear quote."
        primaryLabel="Request a Quote"
        primaryTo="/contact"
        secondaryLabel="See Full Services"
        secondaryTo="/services"
      />
    </>
  );
}
