import Image from "next/image";

import { Container } from "@/components/ui/Container";
import type { ProjectCase } from "@/lib/projects/project-cases";

export function CaseHero({ caseStudy }: { caseStudy: ProjectCase }) {
  const { project } = caseStudy;

  return (
    <header
      className="case-hero"
      data-scene-theme={caseStudy.theme}
      aria-labelledby="case-title"
    >
      <div className="case-hero__media" aria-hidden="true">
        <Image
          src={caseStudy.heroAsset.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="case-hero__image"
        />
        <span className="case-hero__veil" />
      </div>

      <Container className="case-hero__inner">
        <div className="case-hero__topline">
          <span>01 / Identity</span>
          <span>{project.year}</span>
        </div>

        <h1 id="case-title" className="case-hero__title">
          {project.title}
        </h1>

        <div className="case-hero__footer">
          <div className="case-hero__meta">
            <p className="case-status">{project.status}</p>
            <ul aria-label="Disciplines">
              {project.disciplines.map((discipline) => (
                <li key={discipline}>{discipline}</li>
              ))}
            </ul>
          </div>
          <p className="case-hero__positioning">{caseStudy.positioning}</p>
          {project.liveUrl ? (
            <a
              className="case-live-link"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="view"
              data-cursor-label="Visit live ↗"
            >
              Visit live site <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
