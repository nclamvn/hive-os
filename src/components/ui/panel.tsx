import type { HTMLAttributes, ReactNode } from "react";

/** White surface, 1px line border, 10px radius, subtle shadow (locked). */
export function Panel({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`border-line bg-surface shadow-panel rounded-panel border ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SectionHeaderProps {
  title: string;
  /** Rendered as a small uppercase eyebrow instead of a title when set. */
  eyebrow?: boolean;
  action?: ReactNode;
  className?: string;
  id?: string;
}

export function SectionHeader({
  title,
  eyebrow = false,
  action,
  className = "",
  id,
}: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`.trim()}>
      <h2
        id={id}
        className={eyebrow ? "text-eyebrow text-ink-muted" : "text-section-title text-ink"}
      >
        {title}
      </h2>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
