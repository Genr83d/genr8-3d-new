import { useMemo, useState, type JSX } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/sections/PageHero";
import { ProjectCard } from "../components/ui/ProjectCard";
import { ProjectModal } from "../components/ui/ProjectModal";
import { SectionHeading } from "../components/ui/SectionHeading";
import {
  projectCategories,
  type ProjectFilter,
  projects,
} from "../data/projects";
import type { Project } from "../types/content";

export function PortfolioPage(): JSX.Element {
  const [activeCategory, setActiveCategory] = useState<ProjectFilter>("All");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Projects built for real-world deployment"
        description="Explore fabrication and digital execution across retail, product teams, education partners, and local businesses."
        actions={
          <>
            <Link to="/contact" className="primary-button">
              Start Your Project
            </Link>
            <Link to="/services" className="secondary-button">
              Service Catalog
            </Link>
          </>
        }
      />

      <section className="section-shell">
        <SectionHeading
          eyebrow="Project Gallery"
          title="Filter by category"
          description="Use category chips to inspect relevant workflow examples."
        />
        <div className="mb-6 flex flex-wrap gap-2">
          {projectCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                category === activeCategory
                  ? "border-accentSoft bg-accent/35 text-accentSoft"
                  : "border-accentSoft/35 bg-black/60 text-slate-300 hover:border-accentSoft/60 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={setActiveProject}
            />
          ))}
        </div>
      </section>

      {activeProject ? (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      ) : null}
    </>
  );
}
