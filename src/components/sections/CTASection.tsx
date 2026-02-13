import type { JSX } from "react";
import { Link } from "react-router-dom";

type CTASectionProps = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel?: string;
  secondaryTo?: string;
};

export function CTASection({
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}: CTASectionProps): JSX.Element {
  return (
    <section className="section-shell">
      <div className="rounded-3xl border border-accentSoft/35 bg-gradient-to-r from-accent/30 via-black/70 to-support/20 p-8 shadow-card sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
            {description}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
          {primaryTo.startsWith("http") ? (
            <a href={primaryTo} target="_blank" className="primary-button">
              {primaryLabel}
            </a>
          ) : (
            <Link to={primaryTo} className="primary-button">
              {primaryLabel}
            </Link>
          )}
          {secondaryLabel && secondaryTo ? (
            secondaryTo.startsWith("http") ? (
              <a
                href={secondaryTo}
                target="_blank"
                className="secondary-button"
              >
                {secondaryLabel}
              </a>
            ) : (
              <Link to={secondaryTo} className="secondary-button">
                {secondaryLabel}
              </Link>
            )
          ) : null}
        </div>
      </div>
    </section>
  );
}
