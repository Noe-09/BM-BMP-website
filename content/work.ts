import {
  approvedCopy,
  hasContentValue,
  structuredData,
  type AssetReference,
  type ContentField,
} from "./types.ts";
import { projectRegistry } from "../lib/projects/selected-work.ts";

const SOURCE = "canonical-docx:work";

export const PROJECT_STATUSES = [
  "Client Work",
  "Concept",
  "Demo",
  "Experiment",
  "Owned Product",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const WORK_CATEGORIES = [
  "Brand & Visual",
  "Web & Digital Experience",
  "Systems & Automation",
  "Products by BMP",
  "Experiments",
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type WorkProject = {
  name: ContentField<string>;
  slug: ContentField<string>;
  status: ContentField<ProjectStatus>;
  categories: ContentField<WorkCategory[]>;
  challenge: ContentField<string>;
  created: ContentField<string>;
  heroAssets: ContentField<AssetReference[]>;
  outcome: ContentField<string>;
  caseStudy: {
    challenge: ContentField<string>;
    direction: ContentField<string>;
    built: ContentField<string>;
    significance: ContentField<string>;
    next: ContentField<string>;
  };
  publication: {
    status: "verified" | "draft";
    source: string;
  };
};

const requiredProjectFields = (
  project: WorkProject,
): ContentField<unknown>[] => [
  project.name,
  project.slug,
  project.status,
  project.categories,
  project.challenge,
  project.created,
  project.heroAssets,
  project.outcome,
  project.caseStudy.challenge,
  project.caseStudy.direction,
  project.caseStudy.built,
  project.caseStudy.significance,
  project.caseStudy.next,
];

export function getPublishedWorkProjects(
  projects: WorkProject[],
): WorkProject[] {
  return projects.filter(
    (project) =>
      project.publication.status === "verified" &&
      requiredProjectFields(project).every(hasContentValue) &&
      hasContentValue(project.heroAssets) &&
      project.heroAssets.value.length > 0 &&
      project.heroAssets.value.every((asset) => asset.status === "verified"),
  );
}

const VERIFIED_REPOSITORY_SOURCE =
  "verified-repository:project-registry@2026-09-09";

const verifiedRepositoryProjects: WorkProject[] = projectRegistry.map((project) => ({
  name: approvedCopy(project.title, VERIFIED_REPOSITORY_SOURCE),
  slug: structuredData(project.slug, VERIFIED_REPOSITORY_SOURCE),
  status: structuredData(project.status, project.publication.source),
  categories: structuredData(project.categories, VERIFIED_REPOSITORY_SOURCE),
  challenge: approvedCopy(project.challenge, VERIFIED_REPOSITORY_SOURCE),
  created: approvedCopy(project.created, VERIFIED_REPOSITORY_SOURCE),
  heroAssets: structuredData(
    project.previewAssets.slice(0, 3).map((asset) => ({
      ...asset,
      kind: "image" as const,
      status: "verified" as const,
    })),
    project.publication.source,
  ),
  outcome: approvedCopy(project.outcome, VERIFIED_REPOSITORY_SOURCE),
  caseStudy: {
    challenge: approvedCopy(project.caseStudy.challenge, VERIFIED_REPOSITORY_SOURCE),
    direction: approvedCopy(project.caseStudy.direction, VERIFIED_REPOSITORY_SOURCE),
    built: approvedCopy(project.caseStudy.built, VERIFIED_REPOSITORY_SOURCE),
    significance: approvedCopy(
      project.caseStudy.significance,
      VERIFIED_REPOSITORY_SOURCE,
    ),
    next: approvedCopy(project.caseStudy.next, VERIFIED_REPOSITORY_SOURCE),
  },
  publication: {
    status: project.publication.status,
    source: project.publication.source,
  },
}));

export const WORK = {
  headline: approvedCopy("Things we have designed, built, and explored.", SOURCE),
  intro: approvedCopy(
    "A selection of brand concepts, digital experiences, systems, and products that show how BMP approaches real problems through design and technology.",
    SOURCE,
  ),
  categories: approvedCopy(WORK_CATEGORIES, SOURCE),
  cardFields: approvedCopy(
    [
      "Project name",
      "Category / discipline",
      "One-sentence challenge",
      "What BMP created",
      "1–3 hero visuals",
      "Outcome / intended improvement",
    ] as const,
    SOURCE,
  ),
  actions: approvedCopy(["View project", "See process"] as const, SOURCE),
  caseSections: approvedCopy(
    [
      "The challenge",
      "The direction",
      "What we built",
      "Why it matters",
      "Next",
    ] as const,
    SOURCE,
  ),
  projects: verifiedRepositoryProjects,
} as const;
