import type { ElementType, HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  bleed?: boolean;
};

export function Container({
  as: Tag = "div",
  bleed = false,
  className,
  children,
  ...props
}: ContainerProps) {
  const cls = bleed ? "w-full" : "bm-container";
  return (
    <Tag className={cls + (className ? ` ${className}` : "")} {...props}>
      {children}
    </Tag>
  );
}
