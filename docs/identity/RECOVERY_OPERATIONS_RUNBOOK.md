# Recovery Operations Runbook (TIP-021A)

## Production configuration

Required environment (see `.env.example`):

- `MAIL_DRIVER=smtp`
- `SMTP_HOST`, `SMTP_PORT` (default 587, or 465 with `SMTP_SECURE=true`),
  `SMTP_USERNAME`, `SMTP_PASSWORD`
- `MAIL_FROM` (and optional `MAIL_REPLY_TO`)
- `MAIL_BASE_URL` — `https://`, same origin as `BETTER_AUTH_URL`
- `AUTH_THROTTLE_SECRET` — `openssl rand -base64 32`

Startup fails closed if identity recovery would run without a usable production
mail driver or throttle secret. Never set `MAIL_DRIVER=local` in production.

## Provider failure behaviour

Mail delivery runs after the response. Failures are recorded as
`mail.delivery_failed` (correlation id, no recipient/token/URL), do not change
the generic user-facing response, and never mark an email verified or a password
reset. Recovery is retryable through an authorized resend. Investigate by
correlation id in `identity_security_event` plus SMTP provider logs.

## Throttling

Per destination: 3 requests / 15 min and 10 / 24 h, for verification and reset
independently. Counters live in `auth_throttle_counter` (keyed by HMAC digest)
and expire. Prune opportunistically with
`pruneExpiredThrottleCounters()`. A `429` reveals rate-limiting but not account
existence.

## Local / test boundary

`MAIL_DRIVER=local` (dev/test only) captures messages in memory; the sink is
never available in production and exposes no route. Integration/e2e read
captured mail out-of-band; e2e verifies users via `markEmailVerified`.

## Operational checks

- Migration status: `npx prisma migrate deploy` then `prisma migrate status`.
- Ledger immutability: `artifacts/tip-021a/security-event-immutability.txt`.
- Token-at-rest: `artifacts/tip-021a/reset-token-storage.txt`.
- Fresh/upgrade DB: `fresh-migration-results.txt`,
  `upgrade-migration-results.txt`.

## Related

`EMAIL_VERIFICATION_POLICY.md`, `PASSWORD_RECOVERY_POLICY.md`,
`AUTH_MAIL_BOUNDARY.md`, `IDENTITY_SECURITY_EVENTS.md`,
`RECOVERY_THREAT_MODEL.md`.
