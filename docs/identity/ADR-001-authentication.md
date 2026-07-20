# ADR-001 — Authentication with Better Auth

Status: Accepted (TIP-003). Authorized by Contractor.

## Decision

Use **Better Auth 1.6.23** for authentication and session infrastructure,
integrated with the existing Next.js 16 + Prisma 7 stack.

Better Auth owns: `User`, `Account`, `Session`, `Verification`;
email/password authentication; secure auth endpoints and cookies.

Better Auth does **not** own workspace concepts — the Organization plugin is
deliberately **not used**. HIVE OS retains authority over `Workspace`,
`Membership`, `Invitation`, permissions, and audit.

## Integration

- Prisma adapter (`prismaAdapter(getDb(), { provider: "postgresql" })`).
- The Better Auth core schema is expressed as reviewed Prisma models and
  applied through the repository's deterministic migration workflow (Better
  Auth's adapter does not run migrations).
- `nextCookies()` plugin for App Router cookie handling.
- Server handler mounted at `/api/auth/[...all]`.

## Configuration & controls

- `BETTER_AUTH_SECRET` (mandatory, ≥16 chars, never printed).
- `BETTER_AUTH_URL` (same-origin base; drives `trustedOrigins`).
- `AUTH_ALLOW_SELF_SIGNUP` (default disabled; controls `disableSignUp`).
- `AUTH_RATE_LIMIT_ENABLED` (default enabled; disabled only for automated
  tests via `.env.test` / the E2E server env).
- `requireEmailVerification: false` — no fake verification/reset flow is wired
  in TIP-003 (deferred).

## Consequences

- We do not implement custom password hashing or session cryptography; Better
  Auth owns that responsibility.
- Secure cookies follow the base URL protocol (https → Secure).
- Deferred: email verification and password-reset infrastructure.
