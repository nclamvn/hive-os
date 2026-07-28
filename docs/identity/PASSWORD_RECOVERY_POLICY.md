# Password Recovery Policy (TIP-021A)

## Configuration (Better Auth 1.6.23)

- `emailAndPassword.sendResetPassword` + `onPasswordReset`
- `emailAndPassword.revokeSessionsOnPasswordReset: true`
- `emailAndPassword.resetPasswordTokenExpiresIn: 1800` (30 minutes)
- `minPasswordLength: 12`, `maxPasswordLength: 128` (length only — no arbitrary
  composition rules)

Source: `src/server/auth/index.ts`.

## Token storage

A reset request stores a `verification` row with
`identifier = "reset-password:<token>"` and `value = <userId>`. With
`verification.storeIdentifier: "hashed"`, the identifier is stored as a
SHA-256/base64url hash — the **raw token is never in the database**. Evidence:
`artifacts/tip-021a/reset-token-storage.txt` (0 rows contain the plaintext
`reset-password:` prefix). The token travels only inside the outbound email
link and the user's submission.

## Behaviour

1. A reset request returns the **same** neutral response whether or not the
   account exists (no enumeration).
2. An existing account receives one reset message, subject to destination
   throttling; an unknown account produces no message.
3. A valid token permits exactly one reset; it is single-use and consumed
   atomically (concurrent attempts yield at most one success).
4. Expired or already-consumed tokens are rejected.
5. After a successful reset the old password stops working and the new one
   works.
6. All existing sessions are revoked on reset; the reset browser receives no
   implicit session.
7. A password-changed notice is sent.
8. Redirects stay same-origin/allowlisted.

## Verified by

Integration `identity-recovery.test.ts` (IR-13..IR-28); unit
`identity-recovery.test.ts` (config invariants). Evidence:
`session-revocation.txt`, `anti-enumeration-results.txt`,
`reset-token-storage.txt`.
