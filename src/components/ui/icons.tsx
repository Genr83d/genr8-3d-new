import type { JSX } from 'react'

const common = 'h-6 w-6 text-accentSoft'

type IconProps = {
  className?: string
}

export function CNCIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 4h14v5H5z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 9v8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 17h6l-1 3h-4z" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="6.5" r="0.8" fill="currentColor" />
      <circle cx="16" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  )
}

export function PrinterIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="3" width="14" height="5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="4" y="8" width="16" height="10" stroke="currentColor" strokeWidth="1.4" />
      <rect x="8" y="13" width="8" height="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="10.5" r="0.9" fill="currentColor" />
    </svg>
  )
}

export function LaserIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="6" width="18" height="11" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 6V4h8v2" stroke="currentColor" strokeWidth="1.4" />
      <path d="m12 11-2.5 4h5z" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function ModelingIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="m12 3 7 4v10l-7 4-7-4V7z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 12 5 8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 12v9" stroke="currentColor" strokeWidth="1.4" />
      <path d="m12 12 7-4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function WebIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="4" width="18" height="15" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 8h18" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="6" cy="6" r="0.7" fill="currentColor" />
      <circle cx="8.5" cy="6" r="0.7" fill="currentColor" />
      <path d="m9 14 2-2-2-2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13 16h3" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function ClockIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 7v5l3.5 2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function PlaqueIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="3" width="16" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7" y="6" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9.5 10h5M9.5 13h5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function PinIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="9" r="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 14.5V21" stroke="currentColor" strokeWidth="1.4" />
      <path d="m10.5 19.5 1.5 2 1.5-2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function KeyringIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="m10.4 10.4 2.6 2.6" stroke="currentColor" strokeWidth="1.4" />
      <rect
        x="11.5"
        y="11.5"
        width="9"
        height="6.5"
        rx="1.5"
        transform="rotate(45 11.5 11.5)"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  )
}

export function ImagePlaceholderIcon({ className = common }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8.5" cy="10" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function ArrowRightIcon({ className = 'h-4 w-4' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 10h12" stroke="currentColor" strokeWidth="1.5" />
      <path d="m11 6 4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function MenuIcon({ className = 'h-5 w-5' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function CloseIcon({ className = 'h-5 w-5' }: IconProps): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6 18 18M18 6 6 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
