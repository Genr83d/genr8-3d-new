import { useEffect, type JSX } from 'react'
import type { Project } from '../../types/content'
import { CloseIcon } from './icons'

type ProjectModalProps = {
  project: Project
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps): JSX.Element {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} project details`}
        className="surface-card max-h-[90vh] w-full max-w-3xl overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="chip">{project.category}</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">{project.title}</h3>
          </div>
          <button
            type="button"
            aria-label="Close project details"
            className="rounded-md border border-accentSoft/50 p-2 text-accentSoft hover:bg-accentSoft/20"
            onClick={onClose}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
        <img src={project.image} alt={project.title} className="mt-6 h-72 w-full rounded-xl object-cover" />
        <p className="mt-6 text-sm text-slate-300">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-support/40 px-3 py-1 text-xs text-slate-100">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
