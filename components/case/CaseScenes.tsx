import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import type {
  ProjectCase,
  ProjectCaseSection,
} from "@/lib/projects/project-cases";

function SceneHeading({ id, lines }: { id: string; lines: string[] }) {
  return (
    <h2 id={id} className="case-scene__title">
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </h2>
  );
}

function CaseMedia({
  src,
  alt,
  className = "",
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
}) {
  return (
    <figure className={`case-media ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} />
    </figure>
  );
}

function IdeaScene({
  caseStudy,
  section,
}: {
  caseStudy: ProjectCase;
  section: ProjectCaseSection;
}) {
  return (
    <section
      id={`${caseStudy.project.slug}-idea`}
      className="case-scene case-scene--idea"
      data-scene-theme={caseStudy.theme}
      aria-labelledby={`${caseStudy.project.slug}-idea-title`}
    >
      <Container>
        <p className="case-scene__eyebrow">{section.eyebrow}</p>
        <h2 id={`${caseStudy.project.slug}-idea-title`} className="case-thesis">
          {caseStudy.thesis.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        {section.body ? <p className="case-scene__copy">{section.body}</p> : null}
        <div className="case-idea__media">
          {section.assets?.map((asset, index) => (
            <CaseMedia
              key={asset.src}
              src={asset.src}
              alt={asset.alt}
              className={`case-idea__asset case-idea__asset--${index + 1}`}
              sizes="(max-width: 767px) 88vw, 52vw"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ExperienceScene({
  caseStudy,
  section,
}: {
  caseStudy: ProjectCase;
  section: ProjectCaseSection;
}) {
  if (section.items?.length) {
    return (
      <section
        className="case-scene case-scene--experience"
        data-scene-theme={caseStudy.theme}
        aria-labelledby={`${caseStudy.project.slug}-experience-title`}
      >
        <Container>
          <p className="case-scene__eyebrow">{section.eyebrow}</p>
          <SceneHeading
            id={`${caseStudy.project.slug}-experience-title`}
            lines={section.heading}
          />
          <div className="case-breakdown">
            {section.items.map((item) => (
              <article className="case-breakdown__item" key={item.index}>
                <div className="case-breakdown__copy">
                  <span>{item.index}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
                {item.asset ? (
                  <CaseMedia
                    src={item.asset.src}
                    alt={item.asset.alt}
                    sizes="(max-width: 767px) 92vw, 66vw"
                  />
                ) : null}
              </article>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="case-scene case-scene--experience case-scene--compact"
      data-scene-theme={caseStudy.theme}
      aria-labelledby={`${caseStudy.project.slug}-experience-title`}
    >
      <Container>
        <p className="case-scene__eyebrow">{section.eyebrow}</p>
        <SceneHeading
          id={`${caseStudy.project.slug}-experience-title`}
          lines={section.heading}
        />
        {section.body ? <p className="case-scene__copy">{section.body}</p> : null}
        <div className="case-showcase">
          {section.assets?.map((asset, index) => (
            <CaseMedia
              key={asset.src}
              src={asset.src}
              alt={asset.alt}
              className={`case-showcase__asset case-showcase__asset--${index + 1}`}
              sizes="(max-width: 767px) 92vw, 62vw"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureScene({
  caseStudy,
  section,
}: {
  caseStudy: ProjectCase;
  section: ProjectCaseSection;
}) {
  return (
    <section
      className={`case-scene case-scene--${section.id}`}
      data-scene-theme={caseStudy.theme}
      aria-labelledby={`${caseStudy.project.slug}-${section.id}-title`}
    >
      <Container>
        <p className="case-scene__eyebrow">{section.eyebrow}</p>
        <SceneHeading
          id={`${caseStudy.project.slug}-${section.id}-title`}
          lines={section.heading}
        />
        {section.body ? <p className="case-scene__copy">{section.body}</p> : null}
        <div className={`case-feature case-feature--${section.id}`}>
          {section.assets?.map((asset, index) => (
            <CaseMedia
              key={asset.src}
              src={asset.src}
              alt={asset.alt}
              className={`case-feature__asset case-feature__asset--${index + 1}`}
              sizes={section.id === "responsive" ? "(max-width: 767px) 70vw, 24vw" : "(max-width: 767px) 92vw, 58vw"}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function LiveScene({
  caseStudy,
  section,
}: {
  caseStudy: ProjectCase;
  section: ProjectCaseSection;
}) {
  return (
    <section
      className="case-scene case-scene--live"
      data-scene-theme={caseStudy.theme}
      aria-labelledby={`${caseStudy.project.slug}-live-title`}
    >
      <Container>
        <p className="case-scene__eyebrow">{section.eyebrow}</p>
        <SceneHeading id={`${caseStudy.project.slug}-live-title`} lines={section.heading} />
        {caseStudy.project.liveUrl ? (
          <a
            className="case-live-cta"
            href={caseStudy.project.liveUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="view"
            data-cursor-label="Visit live ↗"
          >
            Visit {caseStudy.project.title} <span aria-hidden="true">↗</span>
          </a>
        ) : null}
        <p className="case-commercial">
          Have a project? <Link href="/contact">Start a conversation ↗</Link>
        </p>
      </Container>
    </section>
  );
}

export function CaseScenes({ caseStudy }: { caseStudy: ProjectCase }) {
  return (
    <div className="case-scenes">
      {caseStudy.sections.map((section) => {
        if (section.id === "idea") {
          return <IdeaScene caseStudy={caseStudy} section={section} key={section.id} />;
        }
        if (section.id === "experience") {
          return (
            <ExperienceScene caseStudy={caseStudy} section={section} key={section.id} />
          );
        }
        if (section.id === "live") {
          return <LiveScene caseStudy={caseStudy} section={section} key={section.id} />;
        }
        return <FeatureScene caseStudy={caseStudy} section={section} key={section.id} />;
      })}
    </div>
  );
}
