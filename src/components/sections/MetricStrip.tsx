import type { JSX } from 'react'

type Metric = {
  label: string
  value: string
}

type MetricStripProps = {
  metrics: Metric[]
}

export function MetricStrip({ metrics }: MetricStripProps): JSX.Element {
  return (
    <section className="section-shell">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="surface-card relative overflow-hidden">
            <p className="text-3xl font-semibold text-white">{metric.value}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.12em] text-slate-400">{metric.label}</p>
            <div className="absolute inset-x-6 top-0 h-px animate-pulseline bg-gradient-to-r from-transparent via-accentSoft to-transparent" />
          </article>
        ))}
      </div>
    </section>
  )
}
