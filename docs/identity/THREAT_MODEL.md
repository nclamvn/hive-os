# Threat Model — Identity, Workspace, Audit (TIP-003)

Scope: sessions, invitation tokens, cross-workspace access, audit leakage.

## Sessions

- **Risk:** session theft / fixation.
- **Mitigations:** Better Auth manages HTTP-only session cookies; Secure flag
  follows the base-URL protocol (https in production). Sign-out invalidates the
  session (ID-03, ID-23). `BETTER_AUTH_SECRET` signs cookies and is never
  logged or printed (env schema hides values). Auth request rate limiting is on
  by default in production.
- **Residual:** transport security depends on production serving over HTTPS.

## Invitation tokens

- **Risk:** token leakage, replay, privilege escalation.
- **Mitigations:** a 256-bit random token is shown **once** to the inviter;
  only its SHA-256 hash is stored (ID-12). Acceptance validates email match,
  expiry (7-day TTL), status, and single-use via a transactional
  `updateMany(status: PENDING → ACCEPTED)` guard (ID-13, ID-14). Revoked/expired
  invitations create no membership (ID-15). Only Owners may issue Owner
  invitations.
- **Residual:** anyone holding the raw link with a matching email can join;
  links must be shared over a trusted channel.

## Cross-workspace access

- **Risk:** a user reads or mutates another workspace.
- **Mitigations:** server-resolved `WorkspaceContext`; all queries scoped by
  trusted `workspace.id`; browser-supplied IDs are never authorization;
  out-of-workspace/unknown resolve to `NotFound` with no existence leak
  (ID-04, ID-07, ID-08). Permission matrix + last-owner protection enforced
  server-side (ID-09..ID-11).

## Audit leakage & tampering

- **Risk:** secrets in audit payloads; tampering with the record.
- **Mitigations:** strict per-eventType schemas rejecting unknown keys
  (SEC-02, AUD-PAYLOAD-01..05) + fail-closed `assertRedactedPayload()` (ID-18);
  append-only enforced by **two layers** — the least-privileged runtime role
  lacks UPDATE/DELETE on `audit_event` and cannot drop the trigger (SEC-03,
  DB-ROLE-01..07), and database triggers reject UPDATE/DELETE for any
  privileged role (ID-17, evidence `artifacts/tip-003/audit-immutability.txt`
  and `artifacts/tip-003c/db-role-evidence.txt`); audit read limited to
  Owner/Admin.

## Authority races & runtime privilege

- **Risk:** concurrent authority transitions remove the last Owner; an
  over-privileged runtime role bypasses protections.
- **Mitigations:** last-Owner mutations serialize on a `SELECT … FOR UPDATE`
  workspace-authority lock inside the transaction, then re-read and re-validate
  under the lock (SEC-01, C-OWNER-01..03). The application connects as a
  non-superuser role that owns nothing and cannot alter schema or triggers
  (SEC-03).

## Rate limiting

- **Risk:** a misconfiguration silently disables auth rate limiting in
  production.
- **Mitigations:** rate limiting is enabled by default; the env schema
  **rejects startup** when `AUTH_RATE_LIMIT_ENABLED=false` outside
  `NODE_ENV=test` (SEC-04, RATE-01..05). Limits are tunable but default to
  production-safe values.

## Open redirects

- **Risk:** off-site redirect after auth.
- **Mitigations:** sign-in always routes to same-origin `/`; a `next` query
  parameter is not honored as a redirect target (ID-21). Auth `trustedOrigins`
  is the app origin only.

## Deferred / out of scope for TIP-003

Email verification, password reset, MFA, device/session management UI,
IP allow-listing. Tracked for later TIPs.
