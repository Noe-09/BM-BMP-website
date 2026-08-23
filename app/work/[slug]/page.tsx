import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCasePage } from "@/components/case/ProjectCasePage";
import { getProjectCase, getProjectCaseSlugs } from "@/lib/projects/project-cases";
import "../../case.css";

type ProjectCaseRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectCaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectCaseRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getProjectCase(slug);
  if (!caseStudy) notFound();

  return {
    title: caseStudy.project.title,
    description: caseStudy.seoDescription,
    openGraph: {
      title: `${caseStudy.project.title} — BM Visuals`,
      description: caseStudy.seoDescription,
      type: "website",
    },
  };
}

export default async function ProjectCaseRoute({ params }: ProjectCaseRouteProps) {
  const { slug } = await params;
  const caseStudy = getProjectCase(slug);
  if (!caseStudy) notFound();

  return <ProjectCasePage caseStudy={caseStudy} />;
}
