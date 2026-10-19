# VERIFY REPORT — TIP-023S Security and Dependency Closure

Status: `READY WITH EXTERNAL DEFERRED`

Status addendum (2026-08-04): TIP-023S-R1 closes `OBL-DEP-002` with strict
deprecation gates and closes `OBL-FND-001` through green GitHub Actions run
`30891944749`. This report retains its original TIP-023S conclusion below.

Verified: `2026-08-04`

## Requirement coverage

| Requirement | Result | Evidence |
| --- | --- | --- |
| S-01 runtime high/critical closure | PASS | Runtime audit: 0 high, 0 critical, 0 total |
| S-02 full-tree high/critical closure | PASS | Full audit: 0 high, 0 critical, 0 total |
| S-03 moderate review | PASS | Full and runtime moderate count: 0 |
| S-04 aligned Prisma line | PASS | Client, adapter and CLI all 7.9.1 |
| S-05 minimal compatible patch | PASS | Next and ESLint majors/minors retained; only bounded patch/transitive updates |
| S-06 preserve fail-closed policy | PASS | DEC-012 unchanged; zero ceiling; 8/8 policy tests |
| S-07 retained evidence | PASS | TIP, Completion Report, Verify Report, baseline and decision ledger |

Coverage: **7/7 implemented, 100%**.

## Scenario results

| Criterion | Result |
| --- | --- |
| Runtime audit has zero high/critical | PASS |
| Full audit has zero high/critical | PASS |
| Dependency policy passes without allowlist expansion | PASS |
| Clean lockfile install resolves secure versions | PASS |
| Static, unit and integration regression | PASS |
| Full standalone Playwright regression | PASS, 85/85 |
| Production startup and migration rehearsal | PASS |
| Container build, non-root and secret-file contract | PASS |

Acceptance coverage: **8/8 PASS, 100%**.

## Technical health

| Gate | Result |
| --- | --- |
| `npm ci` | PASS; 587 installed, 588 audited |
| Full dependency audit | PASS; 0 total |
| Runtime dependency audit | PASS; 0 total |
| Retained audit replay | PASS; policy accepts both stored JSON files |
| Dependency policy | PASS; high/critical/moderate ceilings all 0 |
| TypeScript | PASS; 0 errors |
| ESLint | PASS; 0 warnings/errors |
| Production build | PASS |
| Unit | 28 files, 164/164 PASS |
| Integration | 23 files, 157/157 PASS |
| Full E2E | 85/85 PASS, final run without retry |
| Accessibility regression | PASS; DS-11 serious/critical = 0 |
| Production startup | 8/8 PASS |
| Database rehearsal | PASS; 22 migrations, 6 durable RLS tables |
| Container | PASS; UID 1001; no `.env`; 92,455,877 bytes |
| Contractor manifest | PASS after final renewal |

Total functional test scenarios: **406/406 PASS** (164 unit + 157 integration
+ 85 E2E). Policy scenarios are included in the unit total.

## Security conclusion

- `fast-uri` resolves to 3.1.5.
- `brace-expansion` resolves to 1.1.18 and 5.0.9 for the two compatible lines.
- Prisma client, adapter and CLI resolve to 7.9.1; transitive Valibot resolves
  to 1.4.2.
- PostCSS resolves to 8.5.25 across Next, Tailwind and Vite.
- No new advisory is accepted, suppressed or added to the baseline allowlist.
- Production `npm start` uses the fail-closed standalone server. The E2E-only
  launcher modifies only a temporary generated entrypoint and is never the
  production command.

## Deferred items

- `P2 / monitored`: existing pg concurrent-query deprecation (`OBL-DEP-002`).
- `P0 / external`: remote CI reproducibility remains blocked by GitHub Actions
  billing (`OBL-FND-001`).

## Overall status

**READY WITH EXTERNAL DEFERRED**

TIP-023S is locally complete. The dependency regression is closed with zero
known audit findings and all authorized local gates pass. This does not claim
remote CI, staging or production release readiness.
