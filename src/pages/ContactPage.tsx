import type { JSX } from "react";
import { PageHero } from "../components/sections/PageHero";
import { QuoteChecklist } from "../components/sections/QuoteChecklist";
import { QuoteForm } from "../components/forms/QuoteForm";
import { contactDetails, mailtoHref, telHref, whatsappHref } from "../data/contact";
import FacebookIcon from "../assets/icons/social/facebook.svg";
import LinkedInIcon from "../assets/icons/social/linkedin.svg";
import InstagramIcon from "../assets/icons/social/instagram.svg";
import WhatsAppIcon from "../assets/icons/social/whatsapp.svg";

const socials = [
  { href: whatsappHref(), label: "WhatsApp", icon: WhatsAppIcon },
  { href: "https://www.linkedin.com/company/genr8-3d/", label: "LinkedIn", icon: LinkedInIcon },
  { href: "https://www.instagram.com/genr8_3d/", label: "Instagram", icon: InstagramIcon },
  {
    href: "https://www.facebook.com/Genr8-3d-111518620711772",
    label: "Facebook",
    icon: FacebookIcon,
  },
];
import { useDocumentMeta } from "../lib/useDocumentMeta";

export function ContactPage(): JSX.Element {
  useDocumentMeta({
    title: "Request a Quote | GENR8-3D",
    description:
      "Send GENR8-3D your project details for a quote on CNC routing, 3D printing, laser engraving, 3D modeling, custom products, or web development.",
    path: "/contact",
  });

  return (
    <>
      <PageHero
        eyebrow="Contact / Quote"
        title="Start your next build with GENR8-3D"
        description="Tell us what you need made and how you want it delivered. We will come back with the production approach and a quote."
        actions={
          <>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="primary-button">
              Message us on WhatsApp
            </a>
            <a href={telHref} className="secondary-button">
              Call {contactDetails.phoneDisplay}
            </a>
          </>
        }
      />

      <section className="section-shell grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <QuoteForm />
        </div>

        <div className="flex flex-col gap-4">
          <aside className="surface-card">
            <h2 className="text-xl font-semibold text-white">Business Information</h2>
            <dl className="mt-4 space-y-4 text-sm text-slate-300">
              <div>
                <dt className="font-semibold text-white">Hours</dt>
                <dd>{contactDetails.hours}</dd>
                <dd>{contactDetails.weekend}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Location</dt>
                {contactDetails.address.lines.map((line) => (
                  <dd key={line}>{line}</dd>
                ))}
                <dd>{contactDetails.address.country}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Direct Contact</dt>
                <dd>
                  <a className="hover:text-accentSoft" href={mailtoHref()}>
                    {contactDetails.email}
                  </a>
                </dd>
                <dd>
                  <a className="hover:text-accentSoft" href={telHref}>
                    {contactDetails.phoneDisplay}
                  </a>
                </dd>
                <dd>
                  <a
                    className="hover:text-accentSoft"
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp {contactDetails.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Socials</dt>
                <dd className="mt-2 flex gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                    >
                      <img
                        src={social.icon}
                        alt=""
                        className="h-5 w-5 brightness-0 invert opacity-50 transition-opacity hover:opacity-100"
                      />
                    </a>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          <QuoteChecklist />
        </div>
      </section>
    </>
  );
}
