import type { JSX, ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  action?: ReactNode
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: SectionHeadingProps): JSX.Element {
  const isCenter = align === 'center'

  return (
    <div
      className={`mb-8 flex flex-col gap-4 ${
        isCenter ? 'items-center text-center' : 'items-start text-left'
      }`}
    >
      {eyebrow ? <p className="chip">{eyebrow}</p> : null}
      <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-slate-300 sm:text-base">{description}</p> : null}
      {action ? <div>{action}</div> : null}
    </div>
  )
}
