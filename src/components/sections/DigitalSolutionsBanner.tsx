import type { JSX } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "../ui/icons";

export function DigitalSolutionsBanner(): JSX.Element {
  return (
    <div className="mb-8 rounded-3xl border border-accentSoft/50 bg-gradient-to-r from-accent/40 via-black/70 to-support/30 p-8 shadow-glow sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
      <div>
        <p className="chip">GENR8-3D Digital Solutions</p>
        <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
          Outgrown spreadsheets and off-the-shelf tools?
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-lg">
          We build custom software, business automation, school and enterprise
          management systems, and dashboards around the way your organization runs.
        </p>
      </div>
      <Link to="/digital-solutions" className="primary-button-lg mt-6 gap-2 lg:mt-0 lg:shrink-0">
        Explore Digital Solutions
        <ArrowRightIcon className="h-5 w-5" />
      </Link>
    </div>
  );
}
