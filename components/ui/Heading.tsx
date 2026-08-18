import type { ElementType, HTMLAttributes } from "react";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4;
  size?: "display-xl" | "display-l" | "display-m" | "heading";
};

const TagMap: Record<number, ElementType> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
};

export function Heading({
  level = 2,
  size = "heading",
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = TagMap[level] ?? "h2";
  return (
    <Tag
      className={`text-${size}` + (className ? ` ${className}` : "")}
      {...props}
    >
      {children}
    </Tag>
  );
}
