import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getNextProjectCase, type ProjectCase } from "@/lib/projects/project-cases";

import { CanonicalCaseSummary } from "./CanonicalCaseSummary";
import { CaseHero } from "./CaseHero";
import { CaseScenes } from "./CaseScenes";
import { NextProject } from "./NextProject";

export function ProjectCasePage({ caseStudy }: { caseStudy: ProjectCase }) {
  const nextCase = getNextProjectCase(caseStudy.project.slug);

  return (
    <div className={`case-page case-page--${caseStudy.caseVariant}`}>
      <SiteHeader />
      <main>
        <article>
          <CaseHero caseStudy={caseStudy} />
          <CanonicalCaseSummary caseStudy={caseStudy} />
          <CaseScenes caseStudy={caseStudy} />
          {nextCase ? <NextProject nextCase={nextCase} /> : null}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
