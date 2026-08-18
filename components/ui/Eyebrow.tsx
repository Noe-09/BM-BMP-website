import type { HTMLAttributes } from "react";

type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  as?: "p" | "span" | "div";
};

export function Eyebrow({ as: Tag = "p", className, ...props }: EyebrowProps) {
  return <Tag className={"text-meta text-muted" + (className ? ` ${className}` : "")} {...props} />;
}
