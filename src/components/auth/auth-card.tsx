import type { ReactNode } from "react";
import { Hexagon } from "lucide-react";

import { PreferencesControls } from "@/components/preferences/preferences-controls";

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
      <div className="w-full max-w-[400px]" data-testid="auth-shell">
        <div
          className="mb-5 flex justify-center"
          data-testid="auth-preferences"
        >
          <PreferencesControls toolbar />
        </div>
        <div
          className="mb-6 flex items-center justify-center gap-2"
          data-testid="auth-brand"
        >
          <Hexagon className="text-navy-800 size-6" aria-hidden="true" />
          <span className="text-section-title text-ink-strong tracking-tight">
            HIVE OS
          </span>
        </div>
        <div
          className="border-line bg-surface shadow-panel rounded-panel border p-6"
          data-testid="auth-panel"
        >
          <h1 className="text-page-title text-ink-strong">{title}</h1>
          {description ? (
            <p className="text-body text-ink-muted mt-1">{description}</p>
          ) : null}
          <div className="mt-5">{children}</div>
        </div>
        {footer ? (
          <div
            className="text-meta text-ink-muted mt-4 text-center"
            data-testid="auth-footer"
          >
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
  defaultValue,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="text-body text-ink border-line focus:border-line-strong h-10 w-full rounded-md border bg-surface-subtle px-3 outline-none"
      />
    </div>
  );
}

function MathBackdrop() {
  return (
    <div className="signin-math-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1440 960" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <pattern id="signin-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="currentColor" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="1440" height="960" fill="url(#signin-grid)" opacity=".34" />
        <g className="signin-graph" fill="none" stroke="currentColor">
          <path d="M80 680H570M292 858V170" strokeWidth="1.3" />
          <path d="M92 733C160 731 187 619 231 506S335 300 419 337 485 490 568 474" strokeWidth="2" />
          <path d="M121 789C248 781 328 760 394 708S502 528 590 291" strokeWidth="1" strokeDasharray="5 7" />
          <path d="M332 648l85-85 85 85-85 85zM417 563v170M332 648h170" strokeWidth="1" />
          <circle cx="417" cy="648" r="164" strokeWidth=".8" />
          <circle cx="417" cy="648" r="4" fill="currentColor" stroke="none" />
          <circle cx="232" cy="506" r="4" fill="currentColor" stroke="none" />
          <path d="M945 187h384M1137 80v330M978 275c52-98 111-98 159 0s107 98 160 0" strokeWidth="1.2" />
          <circle cx="1137" cy="275" r="112" strokeWidth=".8" strokeDasharray="4 8" />
          <path d="M945 703h386M1034 810V571M981 761l110-111 94 68 99-118" strokeWidth="1.1" />
          <circle cx="1091" cy="650" r="4" fill="currentColor" stroke="none" />
          <circle cx="1185" cy="718" r="4" fill="currentColor" stroke="none" />
        </g>
        <g className="signin-formula" fill="currentColor" fontFamily="monospace" fontSize="16">
          <text x="120" y="244">∫ f(x) dx</text>
          <text x="424" y="545">a² + b² = c²</text>
          <text x="1001" y="465">∀ ε &gt; 0</text>
          <text x="1190" y="782">lim x → ∞</text>
        </g>
      </svg>
    </div>
  );
}

export function SignInCard({
  title,
  description,
  kicker,
  children,
  footer,
}: {
  title: string;
  description: string;
  kicker: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="signin-experience">
      <MathBackdrop />
      <div className="signin-preferences" data-testid="auth-preferences">
        <PreferencesControls compact />
      </div>
      <div className="signin-shell" data-testid="auth-shell">
        <div className="signin-brand" data-testid="auth-brand">
          <span className="signin-brand-mark"><Hexagon size={25} strokeWidth={1.5} aria-hidden="true" /></span>
          <span>HIVE <strong>OS</strong></span>
        </div>
        <div className="signin-panel" data-testid="auth-panel">
          <div className="signin-panel-topline"><span />{kicker}<span /></div>
          <h1>{title}</h1>
          <p className="signin-description">{description}</p>
          <div className="signin-panel-form">{children}</div>
        </div>
        {footer ? <div className="signin-footer" data-testid="auth-footer">{footer}</div> : null}
        <p className="signin-copyright">HIVE OS <span>·</span> RESEARCH OPERATING SYSTEM</p>
      </div>
    </main>
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
