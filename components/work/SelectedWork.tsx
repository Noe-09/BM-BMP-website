import { selectedProjects } from "@/lib/projects/selected-work";

import { EditorialProject } from "./variants/EditorialProject";
import { LiquidProject } from "./variants/LiquidProject";
import { LookbookProject } from "./variants/LookbookProject";
import { SpatialProject } from "./variants/SpatialProject";

const projectComponents = {
  lookbook: LookbookProject,
  liquid: LiquidProject,
  editorial: EditorialProject,
  spatial: SpatialProject,
} as const;

export function SelectedWork() {
  return (
    <section id="work" className="selected-work" aria-labelledby="selected-work-title">
      <div className="selected-work__entry" data-scene-theme="fabric">
        <p>02 / Selected Work</p>
        <h2 id="selected-work-title">Four projects. Four visual worlds.</h2>
        <span>2026 — 04 projects</span>
      </div>

      <div className="selected-work__scenes">
        {selectedProjects.map((project) => {
          const ProjectComponent = projectComponents[project.interactionVariant];
          return <ProjectComponent project={project} key={project.slug} />;
        })}
      </div>
    </section>
  );
}
