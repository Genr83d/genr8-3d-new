import type { JSX } from "react";
import { PageHero } from "../components/sections/PageHero";
import { QuoteForm } from "../components/forms/QuoteForm";

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

        <aside className="surface-card">
          <h2 className="text-xl font-semibold text-white">
            Business Information
          </h2>
          <dl className="mt-4 space-y-4 text-sm text-slate-300">
            <div>
              <dt className="font-semibold text-white">Hours</dt>
              <dd>Mon-Fri: 8:00 AM - 5:00 PM</dd>
              {/* <dd>Sat: 10:00 AM - 2:00 PM (By appointment)</dd> */}
              <dd>Weekends: Closed</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Location</dt>
              <dd>Pembrooke Commercial Complex</dd>
              <dd>Lots 19 & 20 Fairfield</dd>
              <dd>Montego Bay, St. James</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Direct Contact</dt>
              <dd>contact@genr83d.com</dd>
              <dd>(876) 801-8972</dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  );
}
