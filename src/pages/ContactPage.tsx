import type { JSX } from 'react'
import { PageHero } from '../components/sections/PageHero'
import { QuoteForm } from '../components/forms/QuoteForm'

export function ContactPage(): JSX.Element {
  return (
    <>
      <PageHero
        eyebrow="Contact / Quote"
        title="Start your next build with GENR8-3D"
        description="Share project scope, files, and timeline. We will respond with recommendations, production approach, and quote details."
      />

      <section className="section-shell grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuoteForm />
        </div>

        <aside className="surface-card h-fit">
          <h2 className="text-xl font-semibold text-white">Business Information</h2>
          <dl className="mt-4 space-y-4 text-sm text-slate-300">
            <div>
              <dt className="font-semibold text-white">Hours</dt>
              <dd>Mon-Fri: 8:00 AM - 6:00 PM</dd>
              <dd>Sat: 10:00 AM - 2:00 PM (By appointment)</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Studio</dt>
              <dd>Innovation District, Building C</dd>
              <dd>Suite 404, Your City, ST 00000</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Direct Contact</dt>
              <dd>hello@genr8-3d.com</dd>
              <dd>(000) 000-0000</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  )
}
