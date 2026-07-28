# Auth Mail Boundary (TIP-021A)

HIVE OS owns identity-recovery mail delivery behind a provider-independent
interface. No provider SDK leaks past it; no raw token, full recovery URL, or
SMTP credential is ever logged.

## Interface

`src/server/auth/mail/types.ts`:

- `AuthMailSender` — `send(AuthMailMessage): Promise<AuthMailDeliveryResult>`
- `AuthMailPurpose` — `VERIFY_EMAIL | RESET_PASSWORD | PASSWORD_CHANGED_NOTICE |
  EXISTING_ACCOUNT_SIGNUP_NOTICE`
- `AuthMailMessage`, `AuthMailDeliveryResult` (carries a `correlationId`)

## Drivers

- **local** (`local-sink.ts`) — captures full messages in memory for dev/test.
  `createLocalMailSink()` throws in production (fail-closed). No route or
  artifact exposes captured mail.
- **smtp** (`smtp.ts`) — generic SMTP via `nodemailer@9.0.3` (pinned). The only
  production-capable driver. Credentials come from the validated environment and
  are never logged; failures are summarised without recipient/token/URL.

Selection: `getAuthMailSender()` reads `MAIL_DRIVER`.

## Dispatch lifecycle

`recovery-mail.ts` dispatches delivery off the response path via `after()` so
there is no account-existence timing oracle; when no request scope exists the
work is detached but **observed** (failures recorded, never silently lost).
Under `NODE_ENV=test` delivery is awaited inline for deterministic capture.

Delivery failures record a `MAIL_DELIVERY_FAILED` security event with a
correlation id, remain retryable via an authorized resend, do not change the
generic response, and never mark an email verified or a password reset. No
persisted outbox stores raw links.

## Environment (fail-closed)

`src/server/env.ts` requires, in production: `MAIL_DRIVER=smtp`, `SMTP_HOST`,
`MAIL_FROM`, and an `https://` `MAIL_BASE_URL` that shares the `BETTER_AUTH_URL`
origin. `AUTH_THROTTLE_SECRET` is mandatory outside tests. These checks are
skipped only during `next build` (`NEXT_PHASE=phase-production-build`), never at
runtime. Config: `MAIL_DRIVER`, `MAIL_FROM`, `MAIL_REPLY_TO`, `MAIL_BASE_URL`,
`SMTP_HOST/PORT/SECURE/USERNAME/PASSWORD`.

## Verified by

Unit IR-30; evidence `mail-boundary-results.txt`.
