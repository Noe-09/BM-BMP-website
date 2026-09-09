"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import {
  getPublishedWorkProjects,
  WORK,
  type WorkCategory,
} from "@/content/work";
import { projectRegistry } from "@/lib/projects/selected-work";

const publishedSlugs = new Set(
  getPublishedWorkProjects(WORK.projects).map((project) => project.slug.value),
);
const publishedProjects = projectRegistry.filter((project) =>
  publishedSlugs.has(project.slug),
);

export function WorkProjectIndex() {
  const [activeCategory, setActiveCategory] = useState<WorkCategory | "All">("All");
  const visibleProjects = publishedProjects.filter(
    (project) =>
      activeCategory === "All" || project.categories.includes(activeCategory),
  );

  return (
    <section className="bmp-work-index" aria-label="Published work">
      <Container>
        <div className="bmp-work-filters" aria-label="Filter work by category">
          <button
            type="button"
            aria-pressed={activeCategory === "All"}
            onClick={() => setActiveCategory("All")}
          >
            All
          </button>
          {WORK.categories.value.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="bmp-work-list" aria-live="polite">
          {visibleProjects.map((project) => (
            <article
              key={project.slug}
              className="bmp-work-record"
              data-project-status={project.status}
              data-theme={project.theme}
            >
              <header>
                <p>{project.index}</p>
                <p className="bmp-work-record__status">{project.status}</p>
                <h2>{project.title}</h2>
                <ul aria-label="Category / discipline">
                  {project.categories.map((category) => (
                    <li key={category}>{category}</li>
                  ))}
                </ul>
              </header>

              <figure className="bmp-work-record__media">
                <Image
                  src={project.previewAssets[0].src}
                  alt={project.previewAssets[0].alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 78vw"
                />
              </figure>

              <dl className="bmp-work-record__proof">
                <div>
                  <dt>{WORK.cardFields.value[2]}</dt>
                  <dd>{project.challenge}</dd>
                </div>
                <div>
                  <dt>{WORK.cardFields.value[3]}</dt>
                  <dd>{project.created}</dd>
                </div>
                <div>
                  <dt>{WORK.cardFields.value[5]}</dt>
                  <dd>{project.outcome}</dd>
                </div>
              </dl>

              <div className="bmp-work-record__actions">
                {project.liveUrl ? (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    <span>{WORK.actions.value[0]}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                <Link href={`/work/${project.slug}`}>
                  <span>{WORK.actions.value[1]}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
