import type { JSX } from 'react'
import type { ProcessStep } from '../../types/content'

type ProcessFlowProps = {
  steps: ProcessStep[]
}

export function ProcessFlow({ steps }: ProcessFlowProps): JSX.Element {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title} className="surface-card relative overflow-hidden">
          <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-accentSoft/50 bg-accent/20 text-sm font-semibold text-accentSoft">
            {index + 1}
          </div>
          <h3 className="text-lg font-semibold text-white">{step.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{step.description}</p>
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accentSoft to-transparent opacity-70" />
        </li>
      ))}
    </ol>
  )
}
