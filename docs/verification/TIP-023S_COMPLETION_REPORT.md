# COMPLETION REPORT — TIP-023S

**STATUS:** DONE

> Status addendum (2026-08-04): the two deferred items below are superseded by
> TIP-023S-R1. The pg defect is closed locally; GitHub Actions is awaiting a new
> run after the Owner-reported billing correction.

## Files changed

### Created

- `docs/contractor/tips/TIP-023S_SECURITY_DEPENDENCY_CLOSURE.md` — authorized
  scope and acceptance contract.
- `scripts/build/prepare-standalone-assets.mjs` — makes the Next standalone
  artifact self-contained with public and static assets.
- `scripts/test/start-e2e-standalone.mjs` — test-only launcher that preserves
  the isolated E2E environment without weakening production startup.
- `docs/verification/TIP-023S_COMPLETION_REPORT.md` — Builder evidence.
- `docs/verification/TIP-023S_VERIFY_REPORT.md` — quantitative verification.
- `docs/verification/TIP-023S_AUDIT_FULL.json` and
  `docs/verification/TIP-023S_AUDIT_RUNTIME.json` — retained registry evidence.

### Modified

- `package.json`, `package-lock.json` — aligned Prisma 7.9.1, PostCSS 8.5.25,
  patched transitive dependencies and corrected standalone start/build scripts.
- `docs/verification/dependency-risk-baseline.json` and
  `docs/verification/DEPENDENCY_GATE_POLICY.md` — zero-finding baseline and
  closure of the prior accepted risk without weakening DEC-012.
- `tests/unit/dependency-policy.test.ts` — zero-baseline fail-closed fixtures.
- `playwright.config.ts`, `tests/e2e/env.ts` — standalone E2E launcher and
  collision-resistant port 3108.
- `src/app/globals.css` — WCAG AA contrast correction for the Projection label.
- Contractor decision, task-graph, handoff and renewable manifest ledgers.

## Test results

- Acceptance criteria: **8/8 PASS**.
- Clean install: 587 packages installed, 588 audited, zero findings.
- Full audit: 0 total; runtime audit: 0 total.
- Dependency policy: PASS; policy unit scenarios: 8/8 PASS.
- TypeScript: PASS, 0 errors.
- ESLint: PASS, 0 warnings/errors.
- Production build: PASS.
- Unit: 28 files, 164/164 PASS.
- Integration: 23 files, 157/157 PASS.
- Full E2E: 85/85 PASS, no retry required in the final run.
- Production startup contract: 8/8 PASS.
- TIP-023E database rehearsal: PASS; 22 fresh migrations, six durable RLS
  tables and retained legacy projection counts.
- Container: PASS; image `hiveos:tip-023s`, UID 1001, 92,455,877 bytes, no
  `.env` file found.

## Issues discovered

1. **P0 fixed — dependency regression:** new `fast-uri` and
   `brace-expansion` advisories failed DEC-012. Patched without allowlisting.
2. **P0 fixed — E2E server contract:** `next start` is unsupported with the
   configured standalone output. Build and test now use the documented minimal
   standalone server contract.
3. **P1 fixed — E2E isolation:** port 3000 was occupied by another local RtR
   container, causing Playwright to probe the wrong application. Default E2E
   port is now 3108 and remains externally overridable.
4. **P1 fixed — accessibility:** Projection label contrast was 2.92:1 on the
   light surface. It now uses the compliant muted-ink token; axe passes.
5. **P2 monitored — pg deprecation:** concurrent `client.query()` warning
   remains the pre-existing `OBL-DEP-002`; no failure or semantic regression.
6. **External blocker unchanged:** GitHub Actions billing still prevents remote
   reproducibility (`OBL-FND-001`).

## Deviations from specification

- The authorized dependency closure exposed two quality-harness defects and
  one accessibility defect. They were fixed because the acceptance contract
  explicitly required full E2E and container gates. No domain, schema,
  authorization or product workflow changed.
- Next.js stayed at 16.2.11. The vulnerable PostCSS edge was removed by the
  smaller transitive patch, avoiding an unnecessary framework-minor upgrade.

## Suggestions for Contractor

- Keep TIP-023G next in the Enterprise Core sequence only after remote CI can
  reproduce this commit or the existing local-only exception is explicitly
  retained.
- Close `OBL-DEP-002` in a separate bounded pg concurrency TIP before pg 9.
