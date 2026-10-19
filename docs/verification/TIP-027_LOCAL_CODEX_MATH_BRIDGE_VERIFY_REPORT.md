# TIP-027 local bridge verification

Date: 2026-09-28. Scope: local development and isolated test databases.

| Check | Result |
| --- | --- |
| Browser → server action → distinct durable job → local worker | PASS |
| ChatGPT subscription login, without API key | PASS |
| Proof calibration retained with argument, token usage and SHA-256 digest | PASS; awaiting human assessment |
| Counterexample calibration retained with candidate `2`, usage and digest | PASS; awaiting human assessment |
| Failed initial attempt retained terminally rather than replayed | PASS |
| Independent reviewer / calibration pass / open case | NOT DONE; gate correctly remains locked |

The result is a real model invocation in a local test workflow, **not** an
independently checked theorem proof. Session token accounting is not an API
price or an enforceable dollar budget. Automated verification: 222 unit,
175 strict integration and 102 browser E2E tests passed; typecheck, lint and
production build passed. The local readiness preflight confirmed the Codex
migration, forced RLS and ChatGPT subscription login. Its live-open-problem
verdict remains false.

Browser captures: `artifacts/tip-027/math-pilot-live.png` shows the locked
gate; `artifacts/tip-027/counterexample-live.png` shows the retained model
attempt and explicit absence of mathematical assessment.
