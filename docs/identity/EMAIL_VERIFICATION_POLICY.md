# Email Verification Policy (TIP-021A)

Credential accounts must confirm their email before they can hold an
authenticated session.

## Configuration (Better Auth 1.6.23)

- `emailAndPassword.requireEmailVerification: true`
- `emailVerification.sendOnSignUp: true`, `sendOnSignIn: false`
- `emailVerification.autoSignInAfterVerification: false`
- `emailVerification.expiresIn: 3600` (1 hour)

Source: `src/server/auth/index.ts`.

## Token storage

Email-verification tokens are **stateless signed JWTs**
(`createEmailVerificationToken`) — they are never written to the `verification`
table, so a raw verification token cannot be recovered from PostgreSQL. Password
reset uses a stored token whose identifier is hashed (see
`PASSWORD_RECOVERY_POLICY.md`). `verification.storeIdentifier: "hashed"` applies
SHA-256 at rest to any stored recovery identifier.

## Behaviour

1. Sign-up creates an unverified user and sends a verification message; no
   session is created.
2. An unverified credential user cannot sign in (`requireEmailVerification`).
3. Successful verification does **not** create a session; the user returns to
   sign-in (`autoSignInAfterVerification: false`).
4. Invalid, expired, or already-consumed links fail truthfully at
   `/verify-email` without exposing token internals.
5. Verification is single-use.
6. An unverified user may request another message from the sign-in
   verification-required state or `/verify-email`; resends are throttled (see
   `IDENTITY_SECURITY_EVENTS.md` and the destination throttle).
7. Callbacks stay same-origin (`trustedOrigins`, `MAIL_BASE_URL`).

## Existing users

No existing user is silently marked verified. Rows already `emailVerified=true`
remain valid; existing `emailVerified=false` credential users must complete the
real flow. Tests choose verification explicitly (e.g. e2e `markEmailVerified`).

## Anti-enumeration

Sign-up funnels both new and duplicate emails to the same neutral
`/check-email` outcome. Resend confirmations are always neutral.

## Verified by

Unit `identity-recovery.test.ts`; integration `identity-recovery.test.ts`
(IR-01..IR-09); e2e `identity-recovery.spec.ts` (IR-03).
