import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  arrow?: boolean | string;
  underline?: boolean;
  external?: boolean;
  children: ReactNode;
};

export function TextLink({
  href,
  arrow,
  underline = true,
  external,
  className,
  children,
  ...props
}: TextLinkProps) {
  const isExternal = external ?? /^https?:\/\//.test(href);
  const arrowChar =
    typeof arrow === "string" ? arrow : arrow ? "↗" : null;

  const cls = [
    "bm-link",
    underline ? "bm-link-underline" : "",
    "text-meta-tight",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isExternal) {
    return (
      <a
        href={href}
        className={cls}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        <span>{children}</span>
        {arrowChar ? (
          <span aria-hidden className="bm-link-arrow">
            {arrowChar}
          </span>
        ) : null}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...props}>
      <span>{children}</span>
      {arrowChar ? (
        <span aria-hidden className="bm-link-arrow">
          {arrowChar}
        </span>
      ) : null}
    </Link>
  );
}
