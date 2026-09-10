import { Container } from "@/components/ui/Container";
import { WORK } from "@/content/work";
import type { ProjectCase } from "@/lib/projects/project-cases";

export function CanonicalCaseSummary({ caseStudy }: { caseStudy: ProjectCase }) {
  const copy = [
    caseStudy.project.caseStudy.challenge,
    caseStudy.project.caseStudy.direction,
    caseStudy.project.caseStudy.built,
    caseStudy.project.caseStudy.significance,
    caseStudy.project.caseStudy.next,
  ];

  return (
    <section className="case-summary" aria-label="Case study summary">
      <Container>
        <ol>
          {WORK.caseSections.value.map((heading, index) => (
            <li key={heading}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{heading}</h2>
              <p>{copy[index]}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
