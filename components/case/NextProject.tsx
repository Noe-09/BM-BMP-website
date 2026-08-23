import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { ProjectTransitionLink } from "@/components/motion/ProjectTransitionLink";
import type { ProjectCase } from "@/lib/projects/project-cases";

export function NextProject({ nextCase }: { nextCase: ProjectCase }) {
  return (
    <section
      className={`next-world next-world--${nextCase.caseVariant}`}
      data-scene-theme={nextCase.theme}
      aria-labelledby="next-world-title"
    >
      <Container className="next-world__inner">
        <p>Next world</p>
        <ProjectTransitionLink
          href={`/work/${nextCase.project.slug}`}
          projectSlug={nextCase.project.slug}
          className="next-world__link"
          data-cursor="view"
          data-cursor-label="Next world →"
        >
          <span id="next-world-title">{nextCase.project.title}</span>
          <span
            className="next-world__media"
            data-project-transition-source={nextCase.project.slug}
            aria-hidden="true"
          >
            <Image
              src={nextCase.heroAsset.src}
              alt=""
              fill
              sizes="(max-width: 767px) 86vw, 58vw"
            />
          </span>
          <span className="next-world__arrow" aria-hidden="true">→</span>
        </ProjectTransitionLink>
      </Container>
    </section>
  );
}
