# TIP-023S — Security and Dependency Closure

## Header

- TIP-ID: `TIP-023S`
- Project: HIVE OS Enterprise Core
- Modules: Dependency Policy, Build Toolchain, Production Runtime
- Depends on: TIP-020B0, TIP-021C-A, TIP-023F-R2
- Priority: P0 release gate
- Status: `COMPLETED AND LOCALLY VERIFIED — 2026-08-04`

## Owner direction

Close the fresh dependency-audit regression with controlled updates and rerun
the complete local quality gates before any later enterprise-scale work.

## Requirements

1. Remove every runtime high or critical advisory.
2. Remove every full-tree high or critical advisory where a non-breaking patch
   is available; do not add a new risk acceptance merely to pass the gate.
3. Review every remaining moderate finding and retain its exact disposition.
4. Keep Prisma runtime, adapter and CLI versions aligned.
5. Prefer the smallest compatible patch set; do not perform an unrelated major
   framework, lint or application-architecture upgrade.
6. Preserve the existing deterministic dependency-policy fail-closed rules.
7. Retain full and runtime audit evidence and quantitative verification results.

## Acceptance criteria

- `npm audit --omit=dev --json` reports zero high and zero critical findings.
- `npm audit --json` reports zero high and zero critical findings.
- `npm run check:dependency-policy` passes without broadening an accepted-risk
  ceiling or adding the new advisories to the allowlist.
- A clean lockfile install resolves patched `fast-uri`, `brace-expansion`,
  Prisma and PostCSS versions deterministically.
- Typecheck, lint, production build, unit and integration suites pass.
- Full Playwright E2E, production-startup contract and container contract pass.
- No application schema, authorization, domain or UI contract changes.

## Constraints

- Existing modified visual artifacts are outside scope and must remain intact.
- Do not use `npm audit fix --force`.
- Do not suppress audit output or weaken `DEC-012`.
- Do not claim remote reproducibility while GitHub Actions remains externally
  blocked.

## Reports

- `docs/verification/TIP-023S_COMPLETION_REPORT.md`
- `docs/verification/TIP-023S_VERIFY_REPORT.md`
