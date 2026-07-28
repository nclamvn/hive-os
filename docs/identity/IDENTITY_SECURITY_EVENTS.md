# Identity Security Events (TIP-021A)

Pre-authentication recovery events do not belong to any workspace, so they live
in a dedicated append-only ledger separate from the workspace `AuditEvent` log.

## Model — `identity_security_event`

Fields: `id`, `userId?`, `eventType`, `outcome`, `correlationId`, `ipDigest?`,
`userAgentDigest?`, `payload`, `createdAt`. Schema: `prisma/schema.prisma`.

Event types: `email_verification.{requested,completed,rejected}`,
`password_reset.{requested,completed,rejected}`, `password.changed`,
`sessions.revoked`, `mail.delivery_failed` (enum
`IdentitySecurityEventType`).

## Append-only enforcement

Two layers, as with `audit_event`:

1. **Privilege** — the runtime role `hiveos_app` holds `SELECT, INSERT` only
   (no `UPDATE/DELETE/TRUNCATE`). `scripts/db/app-role.sql`.
2. **Trigger** — `identity_security_event_no_update` / `_no_delete` reject
   `UPDATE`/`DELETE` for any role.
   `prisma/migrations/20260728120000_identity_recovery/migration.sql`.

Evidence: `artifacts/tip-021a/security-event-immutability.txt` (grants =
`INSERT, SELECT`; both triggers present; runtime `UPDATE` → permission denied).

## Payload discipline

`src/server/auth/security-events.ts` validates every payload against a strict
per-event-type Zod schema (unknown keys rejected) and a defensive scan that
rejects any value resembling an email address or URL. Payloads never contain an
email, password, raw token, recovery URL, session token, or secret. For an
unknown-account request `userId` is null. IP and user-agent are stored only as
keyed HMAC digests (`digest.ts`), never in plaintext.

Recording failures are contained — a ledger write never breaks an auth flow.

This TIP exposes no public security-event UI.

## Verified by

Unit `identity-recovery.test.ts` (IR-32); integration `identity-recovery.test.ts`
(IR-31, IR-33 — append-only under runtime role, no email in payloads).
