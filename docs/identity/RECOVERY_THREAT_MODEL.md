# Recovery Threat Model (TIP-021A)

Extends `docs/identity/THREAT_MODEL.md` for email verification and password
recovery.

| Threat | Mitigation |
|---|---|
| Account enumeration via sign-up | New and duplicate emails share one neutral `/check-email` outcome |
| Account enumeration via reset request | `requestPasswordReset` returns the same response for existing/unknown accounts; unknown → no mail |
| Account enumeration via resend | Neutral confirmation regardless of account state |
| Account enumeration via timing | Mail dispatched off the response path (`after()`), not awaited inline in production |
| Reset-token theft from DB | Identifier stored SHA-256-hashed (`storeIdentifier: hashed`); raw token never persisted |
| Verification-token theft from DB | Stateless JWT — never written to the database |
| Token replay / reuse | Single-use, atomic consume; expired tokens rejected (verify 1 h, reset 30 min) |
| Concurrent token use | Atomic consume yields at most one success (IR-24) |
| Session persistence after reset | `revokeSessionsOnPasswordReset`; reset creates no implicit session |
| Off-site callback redirect | Same-origin `trustedOrigins`; production `MAIL_BASE_URL` must be https and share the auth origin |
| Mail bombing / brute force | Better Auth IP rate limiting + per-endpoint `customRules` + destination throttle (3/15 min, 10/24 h) |
| Throttle bypass via race | Atomic `INSERT ... ON CONFLICT DO UPDATE ... RETURNING` counter |
| PII in throttle/audit | Email/IP/user-agent stored only as keyed HMAC digests; strict event payloads |
| Ledger tampering | Append-only privilege + database triggers |
| Local mail in production | Env fail-closed: production requires SMTP; local sink throws in production |
| Secret leakage | SMTP credentials and `AUTH_THROTTLE_SECRET` never logged or bundled client-side |

## Residual risks

- Transport security assumes production HTTPS.
- Recovery links must be delivered over a trusted mail channel.
- The duplicate-signup courtesy notice (`EXISTING_ACCOUNT_SIGNUP_NOTICE`) is
  defined but not yet dispatched; the anti-enumeration UX is fully implemented.
- Pre-existing dependency advisories in the eslint/prisma transitive chains
  remain (out of scope; unrelated to recovery). See `mail-boundary-results.txt`.
