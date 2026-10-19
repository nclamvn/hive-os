# COMPLETION REPORT — TIP-036 / Primary Builder A

**STATUS: DONE — owned standalone primary implementation and written proof.** Independent replay, skeptical acceptance and whole-repository Contractor acceptance are separate receipts, not asserted from this report alone.

Date: 2026-10-01. Skill: Vibecode Kit v6.2, Builder role. Instructions, durable handoff, TIP and pre-execution D01–D04 decisions were read before implementation. No Next/app code was changed.

## Files changed

Created only:

- `scripts/operations/adaptive-shift-partitions.ts`: exact prime/factor signed-image primary, constructive canonical Type-II witnesses, immutable inputs/resources, finite boundary controls and bounded provenance.
- `scripts/operations/adaptive-shift-audit.ts`: no-argument fixed local CLI; COMPLETE/PARTIAL and retained contradiction diagnostics remain distinct.
- `tests/unit/adaptive-shift-partitions.test.ts`: 18 focused regressions, including an independent divisor-pair oracle within the tests.
- `docs/operations/MATH_PILOT_ADAPTIVE_SHIFT_PARTITIONS_2026-10-01.md`: quantified proof, strict construction, frozen results, negative controls, primary-source comparison and missing root bridge.
- This completion report.

No app, database, history, existing pinned research source, dependency, worker, provider, Git or deployment change by this Builder. Replay files belong to independent Builder B. Existing dirty screenshots, workspace file and Python cache were preserved.

## Requirement coverage

| Requirement | Owned implementation / evidence | Scope ceiling |
| --- | --- | --- |
| R01 | Full coprime divisor criterion and strict identity; signed valuation image includes unused/repeated mass; safe-prime Kneser proof and inverse-boundary classification | Written independently reviewed candidate proof, not formal proof or root theorem |
| R02 | Subgroup, minus-one, neutral factors, tight one-direction and two-direction controls; h7/h11 exhaustive boundary profiles; p19 wrong-domain and historical h1 witness; q15/q99 countercontrols | Historical controls are not new menu rows |
| R03 | Exact interval, four warmups, seven shifts and resource caps; canonical ordered-pair DP; completed-prefix/pending diagnostics; finalization-aware deadline/output accounting | PARTIAL is never PASS |
| R04 | Canonical full-row content and prime/control manifests agreed with independent Python implementation; primary fault/partial controls | Independent source-bound replay acceptance belongs to B/Contractor |
| R05 | Tao/Vaughan and Kneser credited; A19 overlap explicit; unvetted author note and preprint are comparison leads only | No novelty, held-out score or universal-menu claim |
| R06 | Owned tests, lint/type checks and reviewer feedback addressed; files frozen for independent final verification | No live/browser or autonomous campaign acceptance claim |

## Tests and actual results

Final owned run at 19:58 local time:

```text
npx vitest run --project unit tests/unit/adaptive-shift-partitions.test.ts --maxWorkers=1
18 / 18 PASS; one file; 1.02 seconds

npx eslint scripts/operations/adaptive-shift-partitions.ts scripts/operations/adaptive-shift-audit.ts tests/unit/adaptive-shift-partitions.test.ts
PASS, zero diagnostics

npm run typecheck
PASS
```

The fixed CLI is reproduced with `node --import tsx scripts/operations/adaptive-shift-audit.ts`. Import itself performs no experiment. Unknown CLI arguments are rejected. The actual primary completed all **275** eligible interval primes, **1953** rows and **971** hit rows. State insertions: **130625**. Local observed finalization checkpoints were approximately **0.2–0.3 seconds**, output **1419663 bytes**, below every frozen cap. This is arithmetic runtime, not model latency.

The invariant content digest is `ca0edf6ce6ab31d22e801a63db8301039efc20eb3c9d9ee7a613318ef2fcb913`; prime manifest `c0a2a8a449bc9eafb46860ba076e40e67b8a1f13c257ab700776b6e2aa5cfa10`. B independently reported identical invariant/control manifests using 1742040 ordered divisor-pair checks; B's algorithm-specific runtime and packet digest are intentionally different. Consult B's replay receipt for final source-bound verification.

Exactly 272/275 new primes have a hit in the frozen menu. **200023321, 200602081, 200656681** remain uncovered; warmup **131433121** also remains uncovered. These misses are retained, not Erdős–Straus counterexamples. h7 boundary controls: 15 profiles / 12 QNR-applicable / 6 all misses / 3 applicable misses; h11: 495 / 460 / 45 / 10. Both have zero classification mismatches.

## Issues discovered and repaired

- **Deadline finalization:** an initial placement checked time before hashing/serialization and could falsely return COMPLETE after the deadline. Finalization now stamps an observed elapsed checkpoint, reseals byte accounting and rechecks monotonic time; late COMPLETE becomes PARTIAL/FINALIZE. Dedicated injected-clock regression retains all completed rows with exact digests.
- **Partial-prefix loss:** initial group-control construction could lose completed h7 on an h11 interruption. Complete controls are retained incrementally and the pending h is explicit.
- **Earlier stop overwritten:** a late deadline guard initially replaced an existing PRIME_SCAN/ROW/state/output reason with FINALIZE. Only a previously COMPLETE packet is converted; earlier diagnostic provenance is preserved.
- **Canonical orientation:** intermediate pairs remain ordered, never sorted; only the self-inverse final target permits u<=v. The independent divisor-pair oracle verifies exact canonical witnesses.
- **Failed candidate retention:** a typed, bounded contradiction error now clones the exact offending row, and CLI emits an investigation diagnostic with exit 1. A deliberately altered unit row exercises this path; **no actual mathematical contradiction occurred** in the frozen experiment. Such a diagnostic is not a normal COMPLETE packet and cannot pass replay.
- **CLI harness:** `npx tsx` hit sandbox IPC restrictions; standard `node --import tsx` ran normally, without loosening permissions or changing dependencies.

## Source freeze

SHA-256 of final implementation/test bytes:

```text
b01a0d472915a06aa10b69885793621948dbb199102ab19dc8b960bb9b49d6f6  scripts/operations/adaptive-shift-partitions.ts
2e2672b4566c9cb174965b8e6e035058f8159d4b59e42d3ea9b040350cd2d15d  scripts/operations/adaptive-shift-audit.ts
0db847adf6ce308c16c835213415b773eb9ae780e4f0581ebeda106c9abd7263  tests/unit/adaptive-shift-partitions.test.ts
```

## Deviations and decisions

No silent input/resource expansion. D01 keeps p19 outside the noninteger menu domain; D02 credits the already-known mixed bound; D03 adds the approved inverse classification; D04 exhausts only h7/h11 boundary profiles. The approved failed-candidate diagnostic is outside the normal packet schema, preserving its fail-closed COMPLETE invariant. Runtime fields are measurements, excluded from invariant content but included in full packet digests. Diagnostic serialization may complete after a stop without converting it to PASS.

## Suggestions for Contractor

Freeze and independently verify the two implementations plus skeptical proof receipt before packaging. The valuable result is an exact conditional structural reduction and auditable finite partitions, not a claimed open-problem breakthrough. The unresolved root obligation is cross-shift existence of enough nonresidue/directional factor mass. Do not assume infinitude of safe primes or universal success of the seven shifts. A later separately scoped general-prime stabilizer/character analysis may address that bridge; no such expansion was implemented here.
