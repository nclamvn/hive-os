# E2E Flake Register

Tests that intermittently rely on retry are tracked here so a persistently
retry-dependent test is not left permanently classified as harmless. Established
under TIP-021A-C (RC-04).

## Policy

- A registered flake stays **P3** while it passes in isolation and on retry.
- **Promotion to P2** if any of: it fails on retry (not just first attempt);
  isolated-run reproduction; observed failure frequency exceeds the threshold
  below; or a deterministic product-code root cause is found.
- Each entry is reviewed by its owner at the review date.

## Entries

### FLAKE-001 — `execution-operations.spec.ts` › EO-01..08 (Manual Bridge loop)

| Field | Value |
|---|---|
| Status | **CLOSED by TIP-022Q on 2026-07-30** |
| Test identity | `tests/e2e/execution-operations.spec.ts:74` › TIP-015 › EO-01..08 completes the governed Manual Bridge operating loop |
| Observed frequency | ~1 in 3 full-suite runs (2 workers); 0 in isolation |
| Suspected mechanism | Shared single app server under concurrent auth + mission write load (workers: 2); first-step assertion (`getByText('Mission entered exploration')`) races a slow server response, not a correctness defect |
| Isolated-run result | PASS (run alone: `npx playwright test tests/e2e/execution-operations.spec.ts` → green) |
| Retry result | PASS on retry (Playwright `retries: 1`); marked flaky, suite exit 0 |
| Owner | Builder (Fable) / Execution surface |
| Expiry / review date | 2026-08-27 (30 days) |
| Promotion threshold to P2 | Fails on retry once, OR reproduces in isolation, OR frequency > 1 in 3 |
| Product-code change | None — no deterministic root cause within TIP-021A-C scope; infrastructural (shared server concurrency) |

Notes: this predates TIP-021A (identity-recovery changes do not touch the
execution surface). If it promotes to P2, the candidate fix is reduced worker
contention or a per-test server, addressed in a dedicated test-infra task rather
than product code.

TIP-022Q reproduced the failure without retry. The action had already completed
and the successful server refresh correctly removed the APPROVED-only form; the
test was racing a transient success message owned by that unmounted form.
The assertion now waits for the stable governed result—the exploration form
becoming unavailable after the Mission leaves APPROVED. Five repeated,
two-worker, no-retry runs passed, followed by the complete 83-scenario suite
passing with retries disabled.
