# TIP-076C/R3 independent rational interval transfer — Builder completion

2026-10-05. **STATUS: PARTIAL — ACTUAL_TRANSFER_PASS, MAIN_REGRESSION_PENDING.**
Root RESEARCH_CORE_V3_076 / ENGINEERING_BUILD. Exact obligation R3: independently
author a fourth bounded mathematical adapter after the complete generic runtime,
admission, provider, persistence, scoring and UI source freeze, then exercise the
same authenticated paired worker/postgrader path without generic edits.

This checkpoint establishes bounded domain implementation and finite unit
controls, not yet actual fourth-domain DB integration acceptance. Main/independent
review and installed-source authority update precede any DB execution.

## Files and source pins

Only permitted installation exceptions and domain-specific new files changed.

| Path | Bytes | SHA-256 |
| --- | ---: | --- |
| `src/modules/research-sandbox/research-core-v3/domains/rational-interval-floor.ts` | 11526 | `e1264a58f82d2cbeb4abca1410355cda9253e8fe679cafa2df86c8c6753992ff` |
| `src/modules/research-sandbox/research-core-v3/domains/installed-adapters.ts` | 641 | `ad940869538941990ecf135c92dbf4591f46cb6119d4477a8be358e2afb4fc9d` |
| `src/modules/research-sandbox/research-evaluation-v3/fixed-campaign-catalog.ts` | 4360 | `9906483ad4a3a5fe3247395c960f67bac34e9da9c2053497f5029fdbf6124423` |
| `tests/unit/research-rational-interval-floor-v3.test.ts` | 10810 | `7fcca18e1e09841e5268b43c94073468880d16f93d1c8857a6f2f22f2ad15b91` |
| `tests/integration/research-rational-interval-transfer-v3.test.ts` | 5473 | `01f965ce6de7c790e4b9233685d67b06ae3009b5a8606885584df33215b86e26` |

Preimplementation and postimplementation direct comparison: **51 frozen runtime
and 12 frozen QA/presentation pins, 63/63 MATCH**. Immutable freeze manifest
`docs/verification/TIP-076_R3_GENERIC_FREEZE.json` SHA
`1c9592bc88e10cfc2efe0ab0ce59a654d95b1f7bfefb075394f25ad97724facf`.
No registry/core/evaluator/provider/worker/transport/persistence/UI generic change.
The initial12 pilot and its source remain unchanged. Frozen shared
`tests/fixtures/research-paired-study-v3.ts` SHA
`5122a34ed7cc3c139dfa4d21b4cc36e30429d302555335cf203ec3ff2c733bac` unchanged.

## Focused implementation scan and decisions

Existing DomainAdapter accepts domain-owned parseInput/alignment/parseCandidate/
check and method cards; generic acceptance already supports INTERVAL_ENCLOSURE.
Installed catalog, reviewed adapter source map and domain-owned UI fixture catalog
are extension seams. No generic scientific switch or second runtime/harness is
needed. Existing paired plan supports at most4 architecture-transfer tasks.

The adapter has one exact input kind RATIONAL_EXPRESSION. Its AST constants are
Q with canonical reduced integer numerator/positive denominator; internal nodes
are ADD/SUB/MUL/DIV with exact left/right children. The candidate includes explicit
sealed inputDigest, canonical lower/upper endpoints and integer floor. This digest
is input binding, not a self-issued source/verifier authority.

Intake independently bounds byte material before JSON/schema/BigInt admission,
walks the entire AST for node/depth/shape before arithmetic, verifies canonical
rationals and bounded well-definedness including composite division-by-zero.
Verification derives the sealed AST afresh, independent of the candidate. It
checks enclosure inequalities and f*d <= n < (f+1)*d for the independently derived
value n/d. Matching model-supplied endpoint floors alone never closes anything.
A valid enclosure spanning a floor boundary stays INCONCLUSIVE, even when the
checker knows the exact value. It never silently narrows the candidate interval.
Negative mathematical floor differs from truncation and is tested explicitly.

Rejected candidates carry INVALID_CANDIDATE/refutation:null: they do not refute
the exact mathematical target. Checked scope contains only the sealed expression,
arithmetic Q and submitted interval/floor certificate; whole/novelty/external
claims use the unchanged generic safety ceiling.

## Declared bounded profile

- Input16384B/candidate4096B, array/key dimension32.
- Expression31nodes/depth6, operand64bits/intermediate256bits.
- Host checker32768operations/1000ms cooperative deadline.
- Canonical-rational intake Euclidean work128steps per operand; verification
  reduction512steps per intermediate, additionally charged to CheckBudget.
- Products admit operand bit-sums before multiplication allocation; sums admit
  max operand bits+1 before addition. Conservative refusal is intentional: a
  representable result may still be refused when these bounds do not certify the
  intermediate. No unlimited BigInt or hard RSS/process containment claim.
- Static method cards EXACT_RATIONAL_ENCLOSURE and RATIONAL_BOUNDARY_REFINEMENT
  retain the same sealed target; no domain-specific worker branch.

## Actual QA commands/results

Commands used /usr/local/bin/node; parent /opt/homebrew/bin/python3 -I -B invokes
each with stdin DEVNULL and subprocess timeout120s. No integration setup, migration
or database process ran in this checkpoint.

1. `node node_modules/vitest/vitest.mjs run --project unit tests/unit/research-rational-interval-floor-v3.test.ts`
   **45/45 PASS**, tests37ms, Vitest290ms. Initial scoped ESLint had one unused
   test-only Json import warning, zero errors; removed in the owned unit file.
   Reduction cap refined from512 universally to128 intake/512 charged checking,
   preserving the declared admission intent before final source pin.
2. Final regression command adds unchanged `research-core-v3.test.ts` and
   `research-evaluation-v3.test.ts`: **176/176 PASS** across3 files (45new+79core+
   52evaluator), tests679ms, Vitest917ms, exit0. Repeated runs are not extra controls.
3. `node node_modules/typescript/bin/tsc --noEmit --incremental false`: exit0,
   whole repository typecheck. No incremental artifact write requested.
4. Scoped ESLint over the five owned/exception source/test paths: exit0,
   **zero errors/zero warnings**.

The 45new named controls cover exact negative floor, all four rational operators,
negative divisor sign, valid integer singleton, genuine straddle, next-integer
upper boundary, false enclosure even with agreeing endpoint floors, wrong floor,
wrong input digest, division by composite zero, canonical representation refusals,
unknown operator/array alias, extra fields, byte/node/depth/bit/intermediate/operation/
deadline admission, exact maximum31node tree, retained candidate bytes, serialized
receipt rejection, contract drift, generic request/catalog privacy, no-refutation
scope and all63 frozen pins. These are finite engineering controls, not formal
proof of arbitrary hostile JS/resource containment.

## Prepared actual paired transfer (NOT_RUN)

The new integration test calls the **unchanged runStudy helper** with4 preregistered
public engineering controls and2arms each, preserving denominator8:

| Sealed value/control | Candidate condition | Expected scientific result |
| --- | --- | --- |
| -7/3 VALID | [-5/2,-9/4], floor-3 | VERIFIED |
| -8/3 FALSE_ENCLOSURE | [-2,-3/2], floor-3 | REJECTED/INVALID_CANDIDATE |
| -10/3 WRONG_FLOOR | [-7/2,-13/4], floor-3 | REJECTED/INVALID_CANDIDATE |
| -11/3 STRADDLE | [-4,-3], floor-4 | INCONCLUSIVE |

Both arms use identical preregistered common ceilings. maxRounds1 prevents repeated
candidate retries from changing the intended control; UNKNOWN usage stays unknown.
Expected grader counts2ACCEPTED/4REJECTED/2INCONCLUSIVE are **expectations only**, not
claimed observations. The same helper uses actual authenticated command admission,
exact owned outbox/job claims, worker original-byte retention, host verifier and
independent separately reserved paired postgrader. No source scientific switch,
duplicate scheduler or second runStudy helper was added.

Main approved an additional NEWdomain integration-only observation assertion:
read each exact campaign through authenticated getCampaignEvidenceObservation
after grading. Assert permanent postgrade reservation/actions/START/retained events,
positive checker/read charges and zero postgrader provider calls/tokens; assert arm
spent unchanged and retained grade/source/candidate/checker seals exact. Initial
integration3926B SHA58ce1eb4879e117b02af856ab5880e811e904428129076fef12983344662abf7
was reviewed but never executed; current5473B pin above incorporates this improvement.
No frozen helper or generic code changed.

The domain-owned fixed catalog adds one valid negative-floor UI profile; public
projection exposes its contract but not private candidate bytes/reference answers.
Controlled public profiles are not blinded benchmark tasks.

## Remaining acceptance and STOP

Pending: independent hostile review, Main installed54source authority update,
serial isolated DB slot, actual8arm transfer and shared generic integration after
installation; optional UI fourth-profile traversal through the same frozen driver.
Source/tests held at this checkpoint for review. DB/call/cost outcomes remain
NOT_RUN/UNKNOWN; no user benefit, model superiority, mathematical discovery or
general Olympiad/open-problem competence claimed. R12b real-user study NOT_RUN.

No live models/API, old historical research/p139 attempt5 evidence, source37
reseal, user-data writes, schema mutations, Git writes/billing/deploy or new grants.
Stop before actual DB execution until Main explicitly releases reviewed authority
and the serial QA slot. No architecture deviation; only admitted domain/catalog
extension and independently authored domain-specific test material.

## Append-only actual transfer acceptance checkpoint

The NOT_RUN descriptions above are the initial source-ready checkpoint, not the
current outcome. Main independently read all five sources/tests and compared all
63freeze pins, ran new45PASS and all13files277PASS/1.03s, whole tsc and scoped lint
exit0. Independent runtime Builder hostile review found no P0/P1. Main installed
the reviewed54source authority and released the serial isolated DB slot.

Main source-review report `docs/verification/TIP-076_R3_MAIN_SOURCE_REVIEW.md`
SHA348fbb977999e7a8c53285786a3feb9746ccbb188b49fba67e6143793c837cd4;
canonical installed bundle digest
36253790ee53049edfd21552d07b9df8ba443cf306a62a50a556f08c00771b81.
Actual fourth checker byte pin is the e1264a58...11526B source above. All51+12
freeze pins compared after the run remain63/63MATCH.

Normal integration setup always calls migrations and app-role setup. Main
explicitly approved an invocation-only override to avoid those forbidden effects:
installed Vitest startVitest("test",[exactnewtest],options,viteOverrides) with
config:false/root:cwd/run:true/watch:false/environment:node/include:exactnewtest/
setupFiles:[]/fileParallelism:false/maxWorkers:1 and the existing @:src alias.
dotenv .env.test quiet:true; both DATABASE_URL and DATABASE_MIGRATION_URL checked
BEFORE Vitest for literal localhost/127.0.0.1:5433/hiveos_test. NODE_ENV=test plus
only previously approved localQA MATH_PILOT_QUEUE_ENABLED and
RESEARCH_CODEX_LOCAL_ENABLED true. No config/harness/source file was changed.
Parent /opt/homebrew/bin/python3 -I -B bounded subprocess120s/stdinDEVNULL;
child /usr/local/bin/node -e installed API. No migration/app-role/truncation ran.

**Actual ONE integration test PASS**, tests4.24s/Vitest5.56s/external5.800028s,
exit0, setup0ms. No failure/retry or omitted case. It exercised all4controls×2arms,
denominator8, with original-byte controlled return through the frozen runStudy
helper and real authenticated worker/independent evaluator. Each of8 campaigns
retained exactlyone STARTED event; helper checked actual controlled invocation log
count equals STARTED count. Thus8 actual CONTROLLED test invocations, no live model.
Grader counts asserted: **2ACCEPTED_EXACT_SCOPE / 4REJECTED / 2INCONCLUSIVE**.
Both arms retained UNKNOWN token usage/accountingINCOMPLETE and transfer-only
NOT_ELIGIBLE_ARCHITECTURE_TRANSFER_ONLY; no unknown value converted into zero.
Each bad candidate refutation:null. Actual price/model-version efficacy UNKNOWN.

Fresh authenticated after-grade observations passed each exact retained grade,
source/checker/candidate binding, postgrade1reservation+1START+1retained event,
positive checker/read reservation charges and0postgrader calls/tokens. Main arm
spent remained EXACTLY equal to the authenticated pre-grade snapshot. These0
postgrader provider calls are explicit allowed pool values, not imputed missing
arm usage. No serialized historical receipt was adopted as fresh host authority.

Programmatic Vitest output did not expose the helper's console observation line;
durable QA audit data remains retained. This report does not invent campaign IDs,
exact observed checker operation counts, actual active time or actual model price.
Main may read the exact owned retained study observation for further data receipts.
The serial DB slot was released immediately after completion; no further own DB
queries or reruns were made in this checkpoint.

Main's suggested documentation issue about a universal512gcd guard was checked
against unchanged e126 source: line30 actually uses `(budget ? 512 : 128)`.
Initial report's explicit128intake/512checking statement is accurate; no source
edit or pin change was made to resolve that mistaken review concern.

**Current STOP:** source/tests and freeze held. Main shared generic regression,
final independent acceptance and any fourth-profile compiled UI test remain
Contractor work, not additional Builder DB authorization. R3 finite engineering
transfer is now observed; broad mathematical capability, method superiority,
new discovery, formal proof and real-user benefit remain unestablished.
