# TIP-063 Integration Completion

STATUS: DONE for Integration-owned offline preparation/audit scope. R5 implemented
and tested; R1–R4 depend on Core, R6 on UI, aggregate R7/build on Main. This is
not live activation or theorem acceptance. Sealed TIP SHA256
09872ab878346b9659f960d938511d9965a59f6b6b53fbde2bf73a1149a950c1.

## Files / final SHA256 pins

- Created `src/modules/research-sandbox/math-lrc-proof-unit-audit.ts`:
  d5db654c7e6104a00860af868f7904d55844d6470d42315fd52a49876ba3768d.
- Created `tests/unit/research-lrc-proof-unit-audit.test.ts`:
  b957dc1395360cec658b8daf99b606c96c07eaefab1ab672e458c4f3949320ed.
- Created this completion report. Its final hash is reported separately, avoiding
  a self-referential file pin. No old adapter/kernel/contract/ledger files edited.

## Callable seam / bindings

`prepareLrcProofUnitSolverInput(context, packet?)`,
`prepareLrcProofUnitCriticInput(context, packet?)`, and
`prepareLrcProofUnitAdversaryInput(context, packet?)` admit the exact Core fixed
packet, use its shared canonical DATA formatter, and return deeply frozen inputs
with packet/input digests and strict JSON response schema. Contexts must begin
`offline:`. Full serialized inputs are capped at49152 UTF8 bytes, not characters.
`validatePreparedLrcProofUnitAuditInput` is a pure passive fixed-content guard.

`runOfflineLrcProofUnitAudit({ activation:"TIP-063_OFFLINE_AUDIT", packet?,
contexts:{SOLVER,CRITIC,ADVERSARY}, callbacks:{SOLVER,CRITIC,ADVERSARY} })` invokes
exactly three ordered injected callbacks once each. No implicit callback, role,
admin, provider or context selection; absent packet defaults only for undefined,
not null. Before/after each call, it checks exact admitted packet, original host
references/content and callback identities. The existing generic
`guardedLrcCampaignCall` supplies independent snapshots and frozen defensive
callback inputs; existing `canonicalJson` provides deterministic digest encoding.
There are no old v2 prompt changes or new persistence pathways.

Each strict offline response binds role/context/packet/input, addresses every
named premise and step exactly once, and uses only CONDITIONAL/OPEN/MISSING/
DISPUTED findings. Missing/open/disputed findings cannot obtain
CONDITIONAL_REVIEWED. Honest uncertainty becomes INCONCLUSIVE; rejection remains
REJECTED despite other roles' agreement. Responses are capped at8192 UTF8 bytes,
summary1024 characters, finding reason256 characters. Extra model/provider/
thread/usage/ledger/evidence fields and PROVED dispositions refuse. All findings
are untrusted feedback, not verification of the underlying mathematics.

The separately named PROOF_UNIT_AUDIT report is capped at32768 UTF8 bytes and
mode OFFLINE_INJECTED. Host conclusion is at best CONDITIONAL_REVIEWED within the
p83 common14/32→224 bridge. Global/formal results remain NOT_ESTABLISHED, fresh
forest replay NOT_RUN, packet debts unchanged, historical062 input
NOT_USED_IN_HISTORICAL_062_CASE. `validateLrcProofUnitAuditReport` recomputes exact
role-input bindings, order, contexts, conservative outcome and audit digest;
it performs no IO, checker, callback or model execution. Schema parsing alone is
not admission: callers must use this guard. Hashes do not attest that callbacks
executed or that reviewer prose is mathematically correct.

## Verification / R-ID coverage

- R5:61/61 new unit tests PASS, focused command below,2026-10-04 local10:04:48,
 467ms total. Includes shared full data, deterministic digests, frozen nested
 schema, coherent rehash mutation refusal, malformed/absent activation, missing
 callback/response, strict role/context keys, collisions, null vs undefined,
 unknown/duplicate/missing findings, incorrect input bindings, unsupported
 promotions/accounting, UTF8 limits, callback failure/no retry, external host
 mutation/reference replacement, honest downgrade and passive report guards.
- R3/R7 adjacent protection: four suites138/138 PASS in1.54s at10:04:17:
 61 new plus77 adjacent campaign/integration/adapter tests. These overlap the
 focused run and must not be added together.
- Whole `npx tsc --noEmit`: exit0, zero diagnostics after all current Integration
 changes. Changed-file ESLint: exit0, zero errors/warnings.
- Initial new suite had55 pass/1 fail: multibyte fixture filled only six premise
 reasons and did not actually exceed8192B. Repaired fixture fills both premises
 and steps; this was test sizing, not a relaxed production limit. Initial test
 mock inference gave four assignability diagnostics; explicit callback Record
 fixes test typing. Three unused hash-destructure warnings repaired. Final0.
- Build/browser/DB/model/provider/worker/checker execution by this Builder:
 NOT_RUN. Main owns aggregate acceptance; Core owns scalar checker.

Commands (offline only):

```sh
npx vitest run --project unit tests/unit/research-lrc-proof-unit-audit.test.ts --maxWorkers=1
npx vitest run --project unit tests/unit/research-lrc-proof-unit-audit.test.ts tests/unit/math-lrc-campaign-integration.test.ts tests/unit/math-lrc-campaign-adapters.test.ts tests/unit/math-lrc-campaign.test.ts --maxWorkers=1
npx tsc --noEmit
npx eslint src/modules/research-sandbox/math-lrc-proof-unit-audit.ts tests/unit/research-lrc-proof-unit-audit.test.ts
```

## Decisions / limits / future boundary

Main explicitly approved count/output-bounded injected callbacks without a new
hard wall-clock architecture: arbitrary JavaScript callbacks are cooperative,
not preemptible. No detached Promise.race, timers, fake cancellation guarantee
or relaxed future062 child caps. A rejected callback stops the sequence with no
report or hidden retry/backfill. The module does not persist partial failures.

The current shared response schema permits untrusted prose but cannot use it to
promote host theorem/freshness fields; tests inject false prose to establish
that boundary. Conditional agreement is only structural offline feedback.
`offline:` identifiers are supplied local fixture context labels, never model
threads or evidence of external independent reviewers. Arbitrary callback code
is the caller's explicit trust seam, not an enforced operating-system sandbox.

No scope/architecture deviation. R5's bounded response caps are stricter additive
implementation details within sealed report/input limits. Historical v2 campaign
and ledger5 remain unchanged. Future real transport must gain prospective durable
versioned host packet/attempt/review bindings through existing architecture under
separate approved detailed scope; this module neither implements nor authorizes
that phase. No Git/env/install/migration/browser/live actions were taken.
