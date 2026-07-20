import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

// Pale tint + thin border + a tone dot, never a saturated fill (locked).
// The label text is ink for AA contrast; the dot (decorative, non-text) and
// the label together convey state so it is never color-alone.
const tones: Record<Tone, { bg: string; dot: string }> = {
  neutral: { bg: "bg-surface-subtle", dot: "bg-ink-faint" },
  success: { bg: "bg-success-50", dot: "bg-success-600" },
  warning: { bg: "bg-warning-50", dot: "bg-warning-600" },
  danger: { bg: "bg-danger-50", dot: "bg-danger-600" },
  info: { bg: "bg-violet-50", dot: "bg-violet-600" },
};

export interface StatusBadgeProps {
  tone?: Tone;
  children: ReactNode;
}

export function StatusBadge({ tone = "neutral", children }: StatusBadgeProps) {
  const { bg, dot } = tones[tone];
  return (
    <span
      className={`text-meta text-ink border-line inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-medium ${bg}`}
    >
      <span className={`size-1.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      {children}
    </span>
  );
}
