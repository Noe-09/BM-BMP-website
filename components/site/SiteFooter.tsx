import Link from "next/link";

import { BRAND } from "@/content/brand";
import { NAVIGATION } from "@/content/navigation";
import { Container } from "@/components/ui/Container";

export function SiteFooter() {
  return (
    <footer className="bmp-footer">
      <Container className="bmp-footer__inner">
        <div className="bmp-footer__identity">
          <Link href={NAVIGATION.home.href.value} aria-label="BMP home">
            {BRAND.name.value}
          </Link>
          <p>{BRAND.promise.value}</p>
        </div>
        <nav className="bmp-footer__nav" aria-label="Footer navigation">
          {NAVIGATION.items.map((item) => (
            <Link key={item.href.value} href={item.href.value}>
              {item.label.value}
            </Link>
          ))}
        </nav>
        <p className="bmp-footer__line">{BRAND.shortPositioning.value}</p>
      </Container>
    </footer>
  );
}
