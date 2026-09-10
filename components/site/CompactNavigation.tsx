import Link from "next/link";

type NavigationItem = {
  label: { value: string };
  href: { value: string };
};

type CompactNavigationProps = {
  items: readonly NavigationItem[];
};

export function CompactNavigation({ items }: CompactNavigationProps) {
  return (
    <details className="compact-nav" suppressHydrationWarning>
      <summary>
        Menu <span aria-hidden="true">+</span>
      </summary>
      <nav className="compact-nav__links" aria-label="Compact navigation">
        {items.map((item) => (
          <Link key={item.href.value} href={item.href.value}>
            {item.label.value}
          </Link>
        ))}
      </nav>
    </details>
  );
}
