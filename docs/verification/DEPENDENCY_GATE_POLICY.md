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

## Current baseline (a ceiling, not a target)

| Metric | Value |
|---|---|
| runtime high/critical | 0 |
| full high | 0 |
| full critical | 0 |
| moderate | 0 |
| risk record | none open; RISK-DEP-001 closed by TIP-023S |
| review date | 2026-08-31 |

TIP-023S replaced the former accepted-risk graph with patched Prisma, PostCSS,
`fast-uri` and both installed `brace-expansion` lines. Fresh full and
runtime audits report zero findings. No advisory was added to the allowlist and
the fail-closed rules above are unchanged.

## Expiry and escalation

`RISK-DEP-001` is closed. The retained 2026-08-31 date is now a zero-baseline
review checkpoint rather than permission to ship a known advisory. The gate
still fails after that date until a fresh reviewed baseline is recorded; it
also fails immediately if any high or critical advisory reappears.
