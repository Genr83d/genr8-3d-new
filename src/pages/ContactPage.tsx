import type { JSX } from "react";
import { PageHero } from "../components/sections/PageHero";
import { QuoteForm } from "../components/forms/QuoteForm";
import FacebookIcon from "../assets/icons/social/facebook.svg";
import LinkedInIcon from "../assets/icons/social/linkedin.svg";
import InstagramIcon from "../assets/icons/social/instagram.svg";
import WhatsAppIcon from "../assets/icons/social/whatsapp.svg";

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
            <div>
              <dt className="font-semibold text-white">Socials</dt>
              <dd className="mt-2 flex gap-3">
                <a
                  href="https://wa.me/18768018972"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <img
                    src={WhatsAppIcon}
                    alt="WhatsApp"
                    className="h-5 w-5 brightness-0 invert opacity-50 transition-opacity hover:opacity-100"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/genr8-3d/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <img
                    src={LinkedInIcon}
                    alt="LinkedIn"
                    className="h-5 w-5 brightness-0 invert opacity-50 transition-opacity hover:opacity-100"
                  />
                </a>
                <a
                  href="https://www.instagram.com/genr8_3d/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <img
                    src={InstagramIcon}
                    alt="Instagram"
                    className="h-5 w-5 brightness-0 invert opacity-50 transition-opacity hover:opacity-100"
                  />
                </a>
                <a
                  href="https://www.facebook.com/Genr8-3d-111518620711772"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <img
                    src={FacebookIcon}
                    alt="Facebook"
                    className="h-5 w-5 brightness-0 invert opacity-50 transition-opacity hover:opacity-100"
                  />
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </>
  );
}
