import type { ReactNode } from "react";

export interface EmptyStateProps {
  /** Primary truthful message, e.g. "No active missions". */
  title: string;
  /** Optional neutral instruction, e.g. "Create a mission to begin". */
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Truthful empty state. Renders explanatory copy only — never placeholder
 * numbers, fake records, or fabricated status.
 */
export function EmptyState({
  title,
  hint,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 px-5 py-10 text-center ${className}`.trim()}
    >
      {icon ? (
        <div className="text-ink-faint mb-1" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <p className="text-body text-ink-muted font-medium">{title}</p>
      {hint ? <p className="text-meta text-ink-muted">{hint}</p> : null}
    </div>
  );
}
