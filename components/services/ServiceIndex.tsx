import Link from "next/link";

import { Container } from "@/components/ui/Container";

type ServiceIndexProps = {
  name: string;
  groups: readonly string[];
  action: {
    label: string;
    href: string;
  };
  tone: "visual" | "tech";
};

export function ServiceIndex({ name, groups, action, tone }: ServiceIndexProps) {
  return (
    <section
      className="bmp-service-index"
      data-tone={tone}
      aria-label={`${name} services`}
    >
      <Container>
        <ol>
          {groups.map((group, index) => (
            <li key={group}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{group}</strong>
            </li>
          ))}
        </ol>
        <Link href={action.href} className="bmp-service-index__action">
          <span>{action.label}</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </Container>
    </section>
  );
}
