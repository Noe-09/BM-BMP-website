import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { CompactNavigation } from "@/components/site/CompactNavigation";
import { NAVIGATION } from "@/content/navigation";

const divisionNavigation = NAVIGATION.items.filter(
  (item) => item.href.value !== "/bm-visual",
);

export function BMVisualHeader() {
  return (
    <header className="site-nav site-nav--flagship bm-visual-nav">
      <Container className="site-nav__inner">
        <Link
          href={NAVIGATION.home.href.value}
          className="site-mark bm-visual-mark"
          aria-label="BMP home"
        >
          <span>{NAVIGATION.home.label.value}</span>
          <span aria-hidden="true">/</span>
          <strong>BM Visual</strong>
        </Link>
        <nav className="site-nav__links" aria-label="Primary navigation">
          {divisionNavigation.map((item) => (
            <Link key={item.href.value} href={item.href.value}>
              {item.label.value}
            </Link>
          ))}
        </nav>
        <CompactNavigation items={divisionNavigation} />
      </Container>
    </header>
  );
}
