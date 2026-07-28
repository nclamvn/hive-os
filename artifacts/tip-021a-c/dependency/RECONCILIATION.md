# Dependency Audit Reconciliation (TIP-021A-C, RC-03)

Machine-readable evidence: `audit-ef9abfd.json`, `audit-omit-dev-ef9abfd.json`,
`audit-68bebda.json`, `audit-omit-dev-68bebda.json`, `ls-all-ef9abfd.txt`,
`ls-all-68bebda.txt`. No registry credentials or secrets are stored.

## Headline

| Metric | ef9abfd (base) | 68bebda (TIP-021A) |
|---|---|---|
| `npm audit` (all) | 12 (9 high, 3 moderate) | 12 (9 high, 3 moderate) |
| `npm audit --omit=dev` (runtime+build) | 3 (0 high, 3 moderate) | 3 (0 high, 3 moderate) |

**TIP-021A introduced zero new advisories.** The set is identical at both
commits; the newly added mail dependency `nodemailer` was pinned to `9.0.3`,
which has no advisories. **Zero high/critical in the runtime+build graph.**

## X-Ray discrepancy

The Local RC X-Ray (2026-07-24) recorded `npm vulnerabilities: 0`. The 12
findings are the **same dependency tree** re-evaluated against a **later
advisory database** (advisories for `brace-expansion` and `valibot` were
published/updated after 2026-07-24). This is an advisory-DB change, not a code
or dependency change. The historical report is not rewritten.

## Reconciliation table

| Advisory (package) | Severity | Chain (root) | @ef9abfd | @68bebda | Class | Patched version | Breaking upgrade | Exploitability in HIVE OS | Disposition |
|---|---|---|---|---|---|---|---|---|---|
| brace-expansion | high | eslint / @typescript-eslint | yes | yes | dev-only | needs eslint 10 | yes (eslint 10) | none (lint toolchain, not shipped) | HOLD → isolated TIP |
| minimatch | high | eslint chain | yes | yes | dev-only | needs eslint 10 | yes | none | HOLD → isolated TIP |
| eslint | high | eslint | yes | yes | dev-only | eslint 10 | yes | none | HOLD → isolated TIP |
| eslint-config-next | high | eslint | yes | yes | dev-only | eslint 10 | yes | none | HOLD → isolated TIP |
| eslint-plugin-import | high | eslint | yes | yes | dev-only | eslint 10 | yes | none | HOLD → isolated TIP |
| eslint-plugin-jsx-a11y | high | eslint | yes | yes | dev-only | eslint 10 | yes | none | HOLD → isolated TIP |
| eslint-plugin-react | high | eslint | yes | yes | dev-only | eslint 10 | yes | none | HOLD → isolated TIP |
| @eslint/config-array | high | eslint | yes | yes | dev-only | eslint 10 | yes | none | HOLD → isolated TIP |
| @eslint/eslintrc | high | eslint | yes | yes | dev-only | eslint 10 | yes | none | HOLD → isolated TIP |
| valibot | moderate | prisma → @prisma/dev | yes | yes | build/tooling | prisma 7.9.1 | minor (out of pinned range) | none (flatten() narrow DoS, CLI only) | MONITORED |
| prisma | moderate | prisma (CLI) | yes | yes | build/tooling | prisma 7.9.1 | minor | none | MONITORED |
| @prisma/dev | moderate | prisma → @prisma/dev | yes | yes | build/tooling | prisma 7.9.1 | minor | none | MONITORED |

`npm audit fix` (non-force) reports no non-breaking remediation; the only offered
fix is `eslint@10` (breaking) via `--force`, which is out of scope
(BROAD_DEPENDENCY_UPGRADES forbidden; do not force to produce a zero count).

## Disposition

- **Runtime high/critical:** none. Not a blocker.
- **Build-time high/critical:** none.
- **Dev-only high (9, eslint chain):** no non-breaking fix exists (requires the
  eslint 10 major). Per policy the Builder cannot accept the risk and does not
  force an upgrade or a cross-major transitive override into the lint toolchain
  that every quality gate depends on. **HOLD** — proposed isolated dependency
  TIP below.
- **Moderate (3, prisma/valibot tooling):** monitored; fix only via a prisma
  minor bump that is out of the pinned range and out of this closure's scope.

## OBL-DEP-001 → PARTIALLY_CLOSED

Reconciled with current machine-readable evidence: runtime+build graph is clean
of high/critical; all 9 highs are dev-only and pre-existing at `ef9abfd`; 3
moderates are build/tooling-only and monitored. The dev-only highs remain open
under a proposed isolated TIP.

### Proposed isolated TIP (Owner authorization required)

`TIP-DEPS-001 — ESLint 10 toolchain upgrade`: upgrade `eslint`/`eslint-config-next`
and the plugin stack to advisory-clean majors, in a dependency-only commit, and
re-run the full quality matrix. Optionally bump `prisma` 7.9.0→7.9.1 to clear
the valibot moderate. Kept separate so a breaking dev-tooling upgrade never
mixes with product behaviour.
