import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import { AcademyInquiryForm } from '../components/forms/AcademyInquiryForm'
import { CTASection } from '../components/sections/CTASection'
import { PageHero } from '../components/sections/PageHero'
import { MetricStrip } from '../components/sections/MetricStrip'
import { SectionHeading } from '../components/ui/SectionHeading'
import {
  academyAudience,
  academyMission,
  academyOutcomes,
  courseCategories,
} from '../data/academy'

export function AcademyPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="NEXT-GEN Academy"
        title="Training the next wave of digital fabricators"
        description={academyMission}
        actions={
          <>
            <a href="#academy-form" className="primary-button">
              Enroll Now
            </a>
            <Link to="/contact" className="secondary-button">
              Speak with Team
            </Link>
          </>
        }
      />

      <section className="section-shell grid gap-4 lg:grid-cols-2">
        <article className="surface-card">
          <SectionHeading title="Who It Is For" />
          <ul className="space-y-2 text-sm text-slate-300">
            {academyAudience.map((audience) => (
              <li key={audience} className="rounded-md border border-accentSoft/30 px-3 py-2">
                {audience}
              </li>
            ))}
          </ul>
        </article>
        <article className="surface-card">
          <SectionHeading title="Training Mission" />
          <p className="text-sm leading-relaxed text-slate-300">{academyMission}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Programs combine guided instruction, project-based labs, and portfolio-grade outputs that learners can use immediately.
          </p>
        </article>
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="Course Categories"
          title="Hands-on tracks for design and fabrication"
          description="Each category includes practical build assignments, instructor feedback, and production workflows."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {courseCategories.map((course) => (
            <article key={course.id} className="surface-card">
              <p className="chip">{course.level}</p>
              <h3 className="mt-4 text-xl font-semibold text-white">{course.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{course.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.12em] text-slate-400">Duration: {course.duration}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {course.outcomes.map((outcome) => (
                  <li key={outcome} className="rounded-md border border-accentSoft/30 px-3 py-2">
                    {outcome}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <MetricStrip
        metrics={academyOutcomes.map((outcome) => ({
          label: outcome.label,
          value: outcome.metric,
        }))}
      />

      <section id="academy-form" className="section-shell">
        <AcademyInquiryForm />
      </section>

      <CTASection
        title="Partner with NEXT-GEN Academy"
        description="Need training support for a school, workforce program, or private cohort? We can build a custom curriculum plan."
        primaryLabel="Request Program Details"
        primaryTo="/contact"
        secondaryLabel="See Service Capabilities"
        secondaryTo="/services"
      />
    </>
  )
}
