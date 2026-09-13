import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { NAVIGATION } from "@/content/navigation";
import { SERVICES } from "@/content/services";

export function BMVisualFooter() {
  return (
    <footer className="footer bm-rule bm-visual-footer">
      <Container className="footer-inner">
        <div>
          <Link href={NAVIGATION.studio.href.value} aria-label="BMP studio">
            <strong>BMP / BM Visual</strong>
          </Link>
          <p>Creative and visual division of BMP</p>
        </div>
        <nav className="footer-links" aria-label="BMP footer navigation">
          {NAVIGATION.items.map((item) => (
            <Link key={item.href.value} href={item.href.value}>
              {item.label.value}
            </Link>
          ))}
        </nav>
        <p>{SERVICES.visual.headline.value}</p>
      </Container>
    </footer>
  );
}
