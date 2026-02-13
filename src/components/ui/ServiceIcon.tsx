import type { JSX } from 'react'
import type { Service } from '../../types/content'
import { CNCIcon, LaserIcon, ModelingIcon, PrinterIcon, WebIcon } from './icons'

type ServiceIconProps = {
  icon: Service['icon']
}

export function ServiceIcon({ icon }: ServiceIconProps): JSX.Element {
  if (icon === 'cnc') return <CNCIcon />
  if (icon === 'print') return <PrinterIcon />
  if (icon === 'laser') return <LaserIcon />
  if (icon === 'model') return <ModelingIcon />
  return <WebIcon />
}
