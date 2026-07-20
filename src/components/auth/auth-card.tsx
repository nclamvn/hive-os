import type { ReactNode } from "react";
import { Hexagon } from "lucide-react";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Hexagon className="text-navy-800 size-6" aria-hidden="true" />
          <span className="text-section-title text-ink-strong tracking-tight">
            HIVE OS
          </span>
        </div>
        <div className="border-line bg-surface shadow-panel rounded-panel border p-6">
          <h1 className="text-page-title text-ink-strong">{title}</h1>
          {description ? (
            <p className="text-body text-ink-muted mt-1">{description}</p>
          ) : null}
          <div className="mt-5">{children}</div>
        </div>
        {footer ? (
          <div className="text-meta text-ink-muted mt-4 text-center">
            {footer}
          </div>
        ) : null}
      </div>
    </main>
  );
}

export function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="text-meta text-ink mb-1 block font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="text-body text-ink border-line focus:border-line-strong h-10 w-full rounded-md border bg-surface-subtle px-3 outline-none"
      />
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="text-meta text-danger-600 bg-danger-50 border-line mb-3 rounded-md border px-3 py-2"
    >
      {message}
    </p>
  );
}
