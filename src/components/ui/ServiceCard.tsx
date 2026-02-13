import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import type { Service } from '../../types/content'
import { ArrowRightIcon } from './icons'
import { ServiceIcon } from './ServiceIcon'

type ServiceCardProps = {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps): JSX.Element {
  return (
    <article className="surface-card group flex h-full flex-col justify-between transition duration-300 hover:-translate-y-0.5 hover:border-accentSoft/70">
      <div>
        <div className="mb-5 inline-flex rounded-lg border border-accentSoft/45 bg-accent/20 p-3">
          <ServiceIcon icon={service.icon} />
        </div>
        <h3 className="text-xl font-semibold text-white">{service.name}</h3>
        <p className="mt-2 text-sm text-slate-300">{service.shortDescription}</p>
      </div>
      <Link
        to={`/services/${service.slug}`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accentSoft transition group-hover:text-white"
      >
        View Service
        <ArrowRightIcon />
      </Link>
    </article>
  )
}
