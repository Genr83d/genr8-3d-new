import type { JSX } from 'react'
import type { Project } from '../../types/content'

type ProjectCardProps = {
  project: Project
  onSelect?: (project: Project) => void
}

export function ProjectCard({ project, onSelect }: ProjectCardProps): JSX.Element {
  const content = (
    <>
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={project.image}
          alt={project.title}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <p className="absolute bottom-3 left-3 chip">{project.category}</p>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{project.title}</h3>
      <p className="mt-2 text-sm text-slate-300">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-support/45 bg-support/20 px-3 py-1 text-xs font-semibold text-slate-100"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  )

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(project)}
        className="surface-card group text-left transition duration-300 hover:-translate-y-0.5 hover:border-accentSoft/70"
      >
        {content}
      </button>
    )
  }

  return <article className="surface-card group">{content}</article>
}
