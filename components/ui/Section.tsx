import type { HTMLAttributes } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  size?: "sm" | "md" | "lg";
  bleed?: boolean;
  rule?: boolean | "strong";
};

const sizeClass: Record<NonNullable<SectionProps["size"]>, string> = {
  sm: "bm-section-sm",
  md: "bm-section-md",
  lg: "bm-section-lg",
};

export function Section({
  size = "md",
  bleed = false,
  rule = false,
  className,
  children,
  ...props
}: SectionProps) {
  const classes = [
    bleed ? "w-full" : "bm-container",
    sizeClass[size],
    rule === "strong" ? "bm-rule-strong" : rule ? "bm-rule" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} {...props}>
      {children}
    </section>
  );
}
