import type { JSX } from "react";
import { PageHero } from "../components/sections/PageHero";
import { CTASection } from "../components/sections/CTASection";
import { ProcessFlow } from "../components/ui/ProcessFlow";
import { SectionHeading } from "../components/ui/SectionHeading";
import {
  DIGITAL_SOLUTIONS_URL,
  digitalOfferings,
  digitalProcessSteps,
  schoolPlatformFeatures,
} from "../data/digitalSolutions";

export function DigitalSolutionsPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="GENR8-3D Digital Solutions"
        title="We build the systems that power businesses"
        description="For schools, businesses, and organizations that have outgrown spreadsheets and off-the-shelf tools. Custom software, automation, and management systems designed around how you actually work."
        actions={
          <>
            <a
              href={DIGITAL_SOLUTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button-lg"
            >
              Visit GENR8-3D Digital Solutions ↗
            </a>
            <a href="#what-we-build" className="secondary-button">
              See what we build
            </a>
          </>
        }
      />

      <section id="what-we-build" className="section-shell">
        <SectionHeading
          eyebrow="What We Build"
          title="Software shaped around your organization"
          description="From a single workflow to a full management platform, every system is built for the people who use it every day."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {digitalOfferings.map((offering) => (
            <article key={offering.title} className="surface-card">
              <h3 className="text-lg font-semibold text-white">{offering.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{offering.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="surface-card grid gap-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="chip">Featured Product</p>
            <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
              School Management Platform
            </h2>
            <p className="mt-3 text-sm text-slate-300 sm:text-[1rem]">
              A complete platform for running a school, from the classroom to
              the front office. See the live demo on our Digital Solutions site.
            </p>
            <a
              href={DIGITAL_SOLUTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button mt-6"
            >
              See the platform ↗
            </a>
          </div>
          <ul className="space-y-2 text-sm text-slate-200">
            {schoolPlatformFeatures.map((feature) => (
              <li key={feature} className="rounded-md border border-accentSoft/30 px-3 py-2">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-shell">
        <SectionHeading
          eyebrow="How We Work"
          title="From how you run today to the system you need"
          description="A clear four-step process with your team involved from start to finish."
        />
        <ProcessFlow steps={digitalProcessSteps} />
      </section>

      <CTASection
        title="Tell us how your organization runs. We'll build around it."
        description="Explore our full range of digital solutions, see live demos, and get in touch with the team."
        primaryLabel="Visit Digital Solutions ↗"
        primaryTo={DIGITAL_SOLUTIONS_URL}
        secondaryLabel="Talk to Us"
        secondaryTo="/contact"
      />
    </>
  );
}
