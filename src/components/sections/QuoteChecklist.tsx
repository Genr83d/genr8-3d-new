import type { JSX } from "react";

/**
 * Answers the question a first-time visitor actually has before they start
 * typing: what do you need from me? Everything here is procedural - it promises
 * no price, turnaround or capability.
 */
const checklist = [
  {
    title: "What you want made",
    detail: "The part, product, or sign - what it is for and where it will be used.",
  },
  {
    title: "Quantity",
    detail: "One prototype or a production run. It changes the process we recommend.",
  },
  {
    title: "Size and units",
    detail: "Overall dimensions in mm or inches, and which faces or edges matter most.",
  },
  {
    title: "Material or finish",
    detail: "A preference if you have one. If not, tell us the use and we will advise.",
  },
  {
    title: "Date you need it",
    detail: "A target date lets us tell you honestly whether it is workable.",
  },
  {
    title: "Delivery or collection",
    detail: "Where the finished work needs to end up.",
  },
  {
    title: "Any files you have",
    detail: "Drawings, sketches, a logo, photos of a broken part - anything is a head start.",
  },
];

export function QuoteChecklist(): JSX.Element {
  return (
    <section className="surface-card" aria-labelledby="quote-checklist-title">
      <h2 id="quote-checklist-title" className="text-xl font-semibold text-white">
        What we need to quote your project
      </h2>
      <p className="mt-2 text-sm text-slate-300">
        You do not need all of it to get started - send what you have and we will ask about the
        rest.
      </p>
      <ul className="mt-5 space-y-4">
        {checklist.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span aria-hidden="true" className="mt-1 text-accentSoft">
              &#9656;
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-sm text-slate-300">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
