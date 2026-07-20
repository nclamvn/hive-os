import type { ReactNode } from "react";

type Tone = "neutral" | "success" | "warning" | "danger" | "info";

// Pale tint + thin border, never a saturated fill (locked). Tone is paired
// with the text label so state is never communicated by color alone.
const tones: Record<Tone, string> = {
  neutral: "border-line bg-surface-subtle text-ink-muted",
  success: "border-line bg-success-50 text-success-600",
  warning: "border-line bg-warning-50 text-warning-600",
  danger: "border-line bg-danger-50 text-danger-600",
  info: "border-line bg-violet-50 text-violet-600",
};

export interface StatusBadgeProps {
  tone?: Tone;
  children: ReactNode;
}

export function StatusBadge({ tone = "neutral", children }: StatusBadgeProps) {
  return (
    <span
      className={`text-meta inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
