import Link from "next/link";

import { NAVIGATION } from "@/content/navigation";
import { Container } from "@/components/ui/Container";
import { CompactNavigation } from "@/components/site/CompactNavigation";

export function SiteHeader() {
  return (
    <header className="bmp-header">
      <Container className="bmp-header__inner">
        <Link
          href={NAVIGATION.home.href.value}
          className="bmp-header__mark"
          aria-label="BMP home"
        >
          {NAVIGATION.home.label.value}
        </Link>
        <nav className="bmp-header__nav" aria-label="Primary navigation">
          {NAVIGATION.items.map((item, index) => (
            <Link
              key={item.href.value}
              href={item.href.value}
              className={index === NAVIGATION.items.length - 1 ? "bmp-header__action" : undefined}
            >
              {item.label.value}
            </Link>
          ))}
        </nav>
        <CompactNavigation items={NAVIGATION.items} />
      </Container>
    </header>
  );
}
