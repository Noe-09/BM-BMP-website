import Link from "next/link";

import type { TECH } from "@/content/tech";

type TechClosingProps = {
  tech: typeof TECH;
};

export function TechClosing({ tech }: TechClosingProps) {
  return (
    <section aria-labelledby="tech-closing-title">
      <h2 id="tech-closing-title">{tech.closingHeadline}</h2>
      <p>{tech.closingCopy}</p>
      <Link href={tech.action.href}>{tech.action.label}</Link>
    </section>
  );
}
