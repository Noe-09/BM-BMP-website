import type { ReactNode } from "react";

type EmptyStateProps = {
  label: string;
  children?: ReactNode;
};

export function EmptyState({ label, children }: EmptyStateProps) {
  return (
    <div className="bmp-empty-state">
      <p>{label}</p>
      {children}
    </div>
  );
}
