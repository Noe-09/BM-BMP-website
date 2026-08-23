import type { ReactNode } from "react";

import { ProjectTransitionLink } from "@/components/motion/ProjectTransitionLink";
import { getProjectCase } from "@/lib/projects/project-cases";
import type { SelectedProject as Project } from "@/lib/projects/selected-work";

type SelectedProjectProps = {
  project: Project;
  children: ReactNode;
  className?: string;
};

export function SelectedProject({
  project,
  children,
  className = "",
}: SelectedProjectProps) {
  const titleId = `project-${project.slug}-title`;
  const caseStudy = getProjectCase(project.slug);

  return (
    <article
      className={`work-project work-project--${project.theme} ${className}`}
      data-project={project.slug}
      data-scene-theme={project.theme}
      aria-labelledby={titleId}
    >
      <div className="work-project__world" aria-hidden="true" />
      <div className="work-project__inner">
        <header className="work-project__intro">
          <div className="work-project__eyebrow">
            <span>{project.index}</span>
            <span>{project.year}</span>
          </div>

          <h3 id={titleId} className="work-project__title">
            {project.title}
          </h3>

          <div className="work-project__details">
            <p className="work-project__status">{project.status}</p>
            <ul className="work-project__disciplines" aria-label="Disciplines">
              {project.disciplines.map((discipline) => (
                <li key={discipline}>{discipline}</li>
              ))}
            </ul>
            <p className="work-project__description">{project.description}</p>
            {caseStudy ? (
              <div className="work-project__actions">
                <ProjectTransitionLink
                  className="work-project__action work-project__action--case"
                  href={`/work/${project.slug}`}
                  projectSlug={project.slug}
                  data-cursor="view"
                  data-cursor-label="View case →"
                >
                  View case study <span aria-hidden="true">→</span>
                </ProjectTransitionLink>
                {project.liveUrl && project.actionLabel ? (
                  <a
                    className="work-project__live-action"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.actionLabel}: ${project.title} (opens in a new tab)`}
                  >
                    {project.actionLabel} <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </header>

        {children}
      </div>
    </article>
  );
}
