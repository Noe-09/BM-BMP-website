import Link from "next/link";

import type { TECH } from "@/content/tech";

type TechClosingProps = {
  tech: typeof TECH;
};

export function TechClosing({ tech }: TechClosingProps) {
  return (
    <section
      className="tech-closing"
      aria-labelledby="tech-closing-title"
      data-tech-phase-anchor="close"
      data-tech-copy="SHOW US THE PROCESS THAT SHOULD WORK BETTER."
    >
      <p className="tech-closing__eyebrow">BMP / TECH / NEXT INPUT</p>
      <h2 id="tech-closing-title">{tech.closingHeadline}</h2>
      <p>{tech.closingCopy}</p>
      <Link
        aria-label={tech.action.label}
        className="tech-closing__action"
        href={tech.action.href}
        data-tech-action="TELL US THE PROBLEM"
      >
        {tech.action.label} <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
