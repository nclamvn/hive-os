# TIP-020 — Governance Reconciliation & Remote Reproducibility

Status: `PART A COMPLETE — OBL-FND-001 CLOSED — RC PACKAGING OPEN`

> Closure addendum (2026-08-04): `OBL-FND-001` is CLOSED. GitHub Actions run
> `30891944749` passed all quality steps on exact SHA
> `e7fe2155363f3567ce9670b087407b8795b8f906`; DEC-009 is expired and the
> `PASS_PROVISIONAL` suffixes are removed. The broader Remote RC packaging work
> in Part B (branch protection confirmation, signed tag, SBOM and retained build
> artifacts) remains open and is not implied by this obligation closure. The
> original reconciliation record below is retained as historical context.

Owner authorization: `2026-07-28 — Part A ratified`
Owner approval: `RECORDED`

- Part A — Governance reconciliation: `PASS / COMPLETE`
- Part B — Remote reproducibility (RRC-1): `OPEN / BLOCKED_EXTERNAL (OBL-FND-001)`

Ratification note: DEC-009 and DEC-010 are `APPROVED` (2026-07-28). The split
gate ledger in `docs/CODEX_CHAT_HANDOFF.md` is `LOCKED`. TIP-020 as a whole is
**not** complete: Part B (RRC-1 remote reproducible RC) stays open until the
Owner clears billing (`OBL-FND-001`) and remote CI runs green on the reviewed
commit. The Builder did not self-approve any record.

## Why this is the next TIP, not a new feature

HIVE OS is not short of kernels. It has eight core modules, ~273 tests, 13
migrations, and a signed Local RC. The binding constraints are no longer
architecture or feature count; they are:

1. Remote reproducibility outside the Builder machine is unproven.
2. There is no real production operation.
3. No real customer has received measured value.
4. No proprietary data/workflow moat has formed yet.

There is also a live governance contradiction the product must resolve before
anything else, because it contradicts the product's own thesis: the X-Ray shows
`G3: HOLD`, yet TIP-005…TIP-019 all completed and `G6` is `PASS local`. A system
that sells "governed truth" cannot itself carry a "gate held but we continued"
history with no authorized Decision and exception record. The exception exists
today only as scattered prose in `CODEX_CHAT_HANDOFF.md`; it must become an
authorized Decision.

## Task

Reconcile the governance history and prove the release candidate is reproducible
on a clean remote runner without any local machine state.

## Part A — Governance reconciliation (LOCAL, no cost, no external dependency)

- Record `DEC-009 LOCAL-ONLY CONTINUATION EXCEPTION` in `10_DECISIONS_LOG.md`.
  **APPROVED 2026-07-28.**
- Record `DEC-010` locking the split gate model (never a bare `G3: PASS` while
  remote reproducibility is unproven). **APPROVED 2026-07-28.**
- `DEC-011` (still `PROPOSED`) proposes promoting founding decisions
  `DEC-005…DEC-008` from `PROPOSED` to `LOCKED`; it was not part of the TIP-020A
  ratification and awaits separate Owner authorization.
- Rewrite the gate ledger onto a split axis so status is truthful:

```text
G3-LOCAL:     PASS
G3-REMOTE:    BLOCKED_EXTERNAL   (OBL-FND-001)

G4-LOCAL:     PASS_PROVISIONAL
G5-LOCAL:     PASS_PROVISIONAL
G6-LOCAL-RC:  PASS_PROVISIONAL
```

- `PASS_PROVISIONAL` holds until remote CI runs green on the RC commit; at that
  point the provisional suffix is removed and DEC-009 expires.

### Part A restrictions

- Do not claim a Remote RC.
- No production deployment.
- No public release.
- Every post-G3 gate stays `PASS_PROVISIONAL` until remote CI is green.
- Expires the moment `OBL-FND-001` is closed.

## Part B — Remote reproducibility (BLOCKED_EXTERNAL until Owner clears billing)

- Resolve the GitHub Actions billing blocker (`OBL-FND-001`) — Owner-only.
- Run the full workflow on the exact RC commit.
- Enable branch protection on `main` with required checks before merge.
- Create a signed RC tag.
- Generate an SBOM and dependency inventory.
- Store build artifact, migration manifest, and test report.
- Prove: clean checkout → install → migrate → test → build, with no local state.

### Gate

```text
RRC-1 — REMOTE REPRODUCIBLE RC
```

Passes only when a clean runner recreates the same product without relying on
local machine state.

## Acceptance scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| GR-01 | Owner approves DEC-009 | Decisions log shows APPROVED with Owner + date |
| GR-02 | Owner ratifies DEC-005…008 via DEC-010 | Founding decisions read LOCKED |
| GR-03 | Gate ledger is read after reconciliation | Split LOCAL/REMOTE axis; no bare `HOLD` beside completed work |
| GR-04 | Billing cleared, workflow rerun on RC commit | All required checks pass on the reviewed commit |
| GR-05 | Clean runner rebuild | install → migrate → test → build pass with no local state |
| GR-06 | Signed RC tag + SBOM produced | Tag verifies; SBOM and dependency inventory stored |
| GR-07 | OBL-FND-001 closed | `PASS_PROVISIONAL` suffixes removed; DEC-009 marked expired |

## Sequencing after this TIP

TIP-021 Production Readiness → TIP-022 Real-World Pilot (narrow wedge:
Governed Engineering Change & Verification Dossier) → TIP-023 Evidence
Connectors → TIP-024 Governed AI Copilot → TIP-025 Productization. Do not add
new kernels, marketplaces, providers, or autonomous multi-agent surfaces until a
real pilot proves ROI; the architecture is currently ahead of market evidence.
