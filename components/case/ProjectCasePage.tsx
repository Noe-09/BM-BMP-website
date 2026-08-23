import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { getNextProjectCase, type ProjectCase } from "@/lib/projects/project-cases";

import { CaseHero } from "./CaseHero";
import { CaseScenes } from "./CaseScenes";
import { NextProject } from "./NextProject";

export function ProjectCasePage({ caseStudy }: { caseStudy: ProjectCase }) {
  const nextCase = getNextProjectCase(caseStudy.project.slug);

  return (
    <main className={`case-page case-page--${caseStudy.caseVariant}`}>
      <header className="case-nav">
        <Container className="case-nav__inner">
          <Link href="/" className="site-mark" aria-label="BM Visuals home">
            BM VISUALS
          </Link>
          <nav aria-label="Case study navigation">
            <Link href="/#work">Selected work</Link>
            <Link href="/contact">Start a project ↗</Link>
          </nav>
        </Container>
      </header>

      <article>
        <CaseHero caseStudy={caseStudy} />
        <CaseScenes caseStudy={caseStudy} />
        {nextCase ? <NextProject nextCase={nextCase} /> : null}
      </article>

      <footer className="case-footer">
        <Container className="case-footer__inner">
          <strong>BM Visuals</strong>
          <span>Digital experience division of BM</span>
          <Link href="/#work">All selected work ↑</Link>
        </Container>
      </footer>
    </main>
  );
}
