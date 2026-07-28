# Dependency Gate Policy (TIP-020B0, DEC-012)

The remote CI dependency gate runs under an explicit, non-zero-target policy so
that "make the number zero" never becomes the objective. Authoritative decision:
`DEC-012` and risk record `RISK-DEP-001` in
`docs/contractor/10_DECISIONS_LOG.md`. Machine-readable baseline:
`dependency-risk-baseline.json`. Enforcer: `scripts/ci/check-dependency-policy.mjs`.

## Why runtime and dev-only risk differ

An advisory in a package that ships to the **production runtime** is exploitable
by real traffic. An advisory in a **dev/build-only** package (linters, the
Prisma CLI, test tooling) never reaches a running deployment. We therefore
distinguish `npm audit` (full graph) from `npm audit --omit=dev`
(runtime + build graph). Both are always generated and stored — dev-only risk is
never silently ignored; it is classified, capped, and time-boxed.

## Gate rules (CI fails on any of these)

- Any **runtime** (`--omit=dev`) **high or critical**.
- Any **critical** anywhere in the full graph.
- **Dev-only high count exceeds** the approved baseline (`fullHigh`).
- A **new high advisory** whose ID is not in the baseline `knownAdvisoryIds`.
- The **risk record has expired** (`expiresAt` in the past).
- **Audit evidence cannot be generated** or is malformed.

Moderate findings do not fail the gate but must remain visible in the output.

## Current accepted baseline (a ceiling, not a target)

| Metric | Value |
|---|---|
| runtime high/critical | 0 |
| full high | 9 (dev-only, ESLint chain) |
| full critical | 0 |
| moderate | 3 (prisma/valibot tooling) |
| risk record | RISK-DEP-001 |
| expiry | 2026-08-31 or before Production Release |

The 9 highs share root advisory `GHSA-mh99-v99m-4gvg` (brace-expansion/minimatch)
reached only through the ESLint toolchain. They are identical at the base commit
`ef9abfd`; TIP-021A introduced none (nodemailer pinned to the clean 9.0.3).

## Expiry and escalation

When `RISK-DEP-001` expires (2026-08-31 or the first Production Release), the
gate fails until the dev-only highs are remediated. Remediation is the proposed
**TIP-DEPS-001** (ESLint 10 upgrade), which becomes **mandatory** at that point
and requires its own Owner authorization. It is not authorized now: a breaking
lint-stack major upgrade must not be done merely to zero the count while there is
no runtime exposure and remote reproducibility is the larger constraint.
