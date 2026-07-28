"use client";

import { type ReactNode, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Accessible auth field primitives shared by recovery forms: a password field
 * with an accessible show/hide toggle and pre-submission requirement text, plus
 * a polite status live region. Tokens and sensitive details are never rendered.
 */

export function PasswordField({
  id,
  label,
  autoComplete,
  requirementText,
}: {
  id: string;
  label: string;
  autoComplete: string;
  requirementText?: string;
}) {
  const [visible, setVisible] = useState(false);
  const hintId = useId();
  return (
    <div className="mb-3">
      <label htmlFor={id} className="text-meta text-ink mb-1 block font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          aria-describedby={requirementText ? hintId : undefined}
          className="text-body text-ink border-line focus:border-line-strong h-10 w-full rounded-md border bg-surface-subtle px-3 pr-11 outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          className="text-ink-muted hover:text-ink absolute inset-y-0 right-0 flex w-10 items-center justify-center"
        >
          {/* Accessible name via visually-hidden text (not aria-label) so form
              label queries never collide with the "Password" field label. */}
          <span className="sr-only">
            {visible ? "Hide password" : "Show password"}
          </span>
          {visible ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {requirementText ? (
        <p id={hintId} className="text-meta text-ink-muted mt-1">
          {requirementText}
        </p>
      ) : null}
    </div>
  );
}

/** Polite live region for neutral, non-enumerating confirmations. */
export function FormStatus({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className="text-meta text-ink border-line bg-surface-subtle mb-3 rounded-md border px-3 py-2"
    >
      {children}
    </p>
  );
}
