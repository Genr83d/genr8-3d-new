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
import { useDocumentMeta } from "../lib/useDocumentMeta";

export function PortfolioPage(): JSX.Element {
  useDocumentMeta({
    title: "Portfolio | GENR8-3D",
    description:
      "The kinds of fabrication and digital work GENR8-3D takes on, across CNC routing, 3D printing, laser engraving, 3D modeling, and web development.",
    path: "/portfolio",
  });

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
        description="The kinds of fabrication and digital work we take on. Photographs of finished pieces we have made are in the Product Gallery."
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
              aria-pressed={category === activeCategory}
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
