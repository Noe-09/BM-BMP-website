import type { HTMLAttributes } from "react";

type GridProps = HTMLAttributes<HTMLDivElement>;

export function Grid({ className, ...props }: GridProps) {
  return (
    <div className={"bm-grid" + (className ? ` ${className}` : "")} {...props} />
  );
}

type GridItemProps = HTMLAttributes<HTMLDivElement> & {
  span?: string;
};

export function GridItem({ span, className, style, ...props }: GridItemProps) {
  const spanStyle = span ? { gridColumn: span } : undefined;
  return (
    <div
      className={className}
      style={{ ...spanStyle, ...style } as React.CSSProperties}
      {...props}
    />
  );
}
