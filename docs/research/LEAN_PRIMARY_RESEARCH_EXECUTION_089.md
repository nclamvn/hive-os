# Completion report — TIP089: primary-first research execution

2026-10-09 · LEAN_PRIMARY_RESEARCH_EXECUTION_089.
Mode: ENGINEERING_METHOD_SIMPLIFICATION.
Status: READY_FOR_TRUSTED_DEVELOPER_USE; live application adoption NOT_ESTABLISHED.

## Outcome

Implemented a callable lean execution core and a real CLI entry point. The normal
path invokes the primary provider once. A critic runs only for an identified
mathematical gap or compatible checker finding; it may request one repair, not
an automatic ceremonial rewrite. Compatible exact evidence is checked by the
existing installed adapters. There is no new planner, adversary pool, voting
system, policy registry, dependency or build/test-configuration family.

This implements the chosen correction after TIP088. It is not another benchmark,
a proof of improved solving power, or a silent replacement of historical live
acceptance rules. The existing generic campaign already used solver+host checker;
legacy math-cycle review/classification remains unchanged. Neither authentication
nor source/lease/resource authorization was removed.

## Actual execution policy

1. Retain the primary response and actual usage before adopting its contents.
2. For an exact installed domain, admit its candidate and check the sealed input.
   For prose without a compatible checker, retain an unverified argument instead
   of manufacturing a theorem certificate.
3. If the exact scope is verified, return without critic votes. If the exact
   predicate is refuted, stop that predicate instead of trying to save it.
4. Otherwise select at most three concrete gaps for one focused critic. Keep the
   entire bounded remaining-gap list, including gaps not selected this time.
   Confidence/style metadata is ignored with a warning; it does not destroy a
   usable draft or gate a valid certificate.
5. `NO_CHANGE` ends review without rewriting. Only a specific `REPAIR` response
   with known gap IDs can request one primary-solver repair.
6. Preserve the original draft and failed revisions. A timeout, malformed critic,
   unchanged proposal or rejected revision does not erase the primary result.
7. A repaired argument cannot delete or redefine original pending obligations.
   `addressedGapIds` reports what the model claims to have repaired; it is not
   closure evidence. Metadata-only changes do not count as a revised solution.
8. Check a changed compatible certificate again. Only the existing host receipt
   closes its exact scope. Ordinary prose and reviewer agreement never substitute
   for a supported acceptance mechanism.

Bounded by construction: one primary + at most one critic + at most one repair;
at most two compatible checks. Caller can allow0/1/2 optional calls. One shared
deadline and output allowance are not renewed at each role. Monotonic elapsed
time is checked even when a synchronous provider delays its timer. Retention is
also bounded by the remaining overall deadline; failure prevents adoption.

Host authority/integrity or unexpected reservation/checker failures stop the lane.
They are not mathematical gaps that another AI call can bypass. A bad proposed
witness is distinguished from a genuinely refuted sealed predicate.

## Interfaces and scope of trust

`executeLeanResearch` accepts a trusted problem, provider port, limits and retention
callback. Each provider invocation must correspond to one separately authorized
model request, without hidden retries/subcalls. The host owns the real transport,
streaming byte limit, cancellation and source authority. This interface is not a
sandbox against arbitrary compound or malicious same-process providers.

Results retain primary/selected/revised drafts, exact receipts where applicable,
failures, remaining obligations, call records, usage and elapsed time. Unknown
input/output/call/model fields remain null. There is no invented zero cost or
automatic formal/novelty/global-theorem acceptance.

Installed tool domains reused without modification: positive integer witness or
finite box exhaustion, finite graph certificates, exact rational polynomial
identity, rational interval/floor evidence. Their limits, predicates and scope
ceilings still apply. Arbitrary research proofs and Lean remain unsupported by
these adapters. Recognizing a gap does not prove the gap diagnosis is correct;
ordinary schema/routing checks are not mathematical validation.

## Runnable entry points

```bash
npm run research:check
npm run research:lean
npm run research:lean -- --replay-file tests/fixtures/lean-retained-replay.json
```

The default lean CLI runs five explicitly synthetic controls. The file option
accepts a regular JSON file up to64KiB, without following a final-path symlink.
Input may contain statement, optional installed adapter/input, retained SOLVER
output and optional CRITIC/REPAIR outputs, and the optional-call allowance. Each
retained output is the JSON draft/audit string described in the core prompts.
It cannot inject a verifier receipt, source grant, host configuration or provider.

The CLI reports `RETAINED_OUTPUT_REPLAY`, `freshSolverResult:false`,
`liveTransportInvoked:false` and developer-only source authority. Replayed usage
is UNKNOWN: selecting a recorded response is not a new model inference. The core
itself accepts real observed usage from an independently authorized provider port.
No provider adapter or new execution grant was activated in this task.

Main actually launched the retained-file CLI: it returned one SOLVER-stage replay,
one exact substitution check, `EXACT_SCOPE_VERIFIED` for the positive tuple
(2,1) in2x+3y=7, and no critic. This is a synthetic known-witness engineering
control, not a fresh mathematical discovery or evidence of benchmark superiority.

## Files changed

Created:

- `src/modules/research-sandbox/lean-execution.ts`:135-line orchestration and
  small data/port contracts.
- `scripts/research/lean.mts`:65-line synthetic/retained-output replay CLI.
- `tests/unit/lean-execution.test.ts`:37 focused behavioral controls.
- `tests/fixtures/lean-retained-replay.json`:small labelled known-witness input.

Additive changes to pre-existing working files:

- `package.json`:one `research:lean` command; prior edits preserved.
- `scripts/research/check.mjs`:fifth real CLI smoke under the existing120s total.
- `tsconfig.research.json`, `vitest.research.config.ts`:new reachable source/test
  in the existing scoped configuration, no new config family.
- `tests/unit/research-development.test.ts`:five-stage expectations and negative
  coverage for the new smoke.
- `README.md`:commands and explicit no-live/no-proof acceptance limits.

Contractor added the approved TIP, this single completion report and append-only
commitment/handoff checkpoints. No application UI, server, DB, account, environment,
dependency, source bundle, historical verifier or scientific evidence was rewritten.

## Verification report

Requirement coverage: R1–R7 implemented7/7 (100%) in the approved developer scope;
missing0/deferred0 within that scope. Live adoption is excluded, not quietly
counted as implemented.

| Requirement | Executed evidence | Result |
|---|---|---|
| R1 primary-first | one-call no-gap path; checked certificate skips reviews; immutable original retained | PASS |
| R2 specific review | exact failed-check gap; unknown/decorative IDs; generic approval; NO_CHANGE; targeted repair | PASS |
| R3 tool scope | exact witness; terminal exact refutation; missing certificate; unsupported scope; no injected host grant | PASS |
| R4 resilience | critic/repair timeout/error/malformed/unchanged/rejected revision;3+3 gaps; host+3 gaps; metadata-only and same-ID retarget negatives | PASS |
| R5 limits/telemetry | optional budgets0/1/2; cumulative bytes; abort; synchronous overrun; retention deadline; malformed/null usage; terminal host failure | PASS |
| R6 runnable integration | full research:check; original permutation CLI; five lean controls; actual retained-file CLI | PASS |
| R7 preservation |207 existing protected core/campaign/legacy/pilot source/evidence files compared unchanged | PASS |

Main final `npm run research:check`: exit0,3960.5ms. Syntax PASS; actual strict
scoped TypeScript0errors;3 test files/101 distinct controls PASS (37 new lean +64
existing developer controls). The count is101 distinct controls, not the sum of
repeated Builder/Main reruns. Both actual CLI smokes PASS. Main separately launched the
retained-file command, exit0/~151ms. Focused ESLint five changed source/test files:
exit0/0diagnostics. No full Next application build/typecheck/E2E is claimed.

Builder validation combined<30s; Main checks and lint combined well below30s.
Each validation was below120s, combined below the600s ceiling. Early ordinary
implementation/type/fixture defects were repaired before final acceptance.
Main semantic review additionally caught and corrected automatic rewrites,
unsupported-checker criticism, host-failure routing, gap truncation, decorative
metadata gating, metadata-only gap washing and same-ID retargeting. These findings
were resolved inside R1–R7 rather than adding a process layer or expanding scope.

## Limits, decisions and closure

No research-model/API dispatch, paid API, new scientific campaign, DB write, UI
change, build, install, Git, deployment or source reseal. Existing server/UI stays
as it was. No scratch directory, project copy, new distDir or Docker work was
created; nothing material required deletion. Dirty user changes were preserved.
Original TIP088 reports/attempts and protected oldp139/R3 authority remain intact.

Vibecode was used for a focused scan, one small Builder implementation and Main
verification. RRI/extra approval ceremonies were omitted because the Owner had
already selected this precise simplification. Ordinary types/tests were run early;
they do not issue research grants or prove mathematics.

Closed: the primary-first callable developer core, bounded targeted criticism,
existing exact-tool integration and executable regression controls.
Not established: live UI/worker adoption, formal theorem checking, improved solving
power/cost on new research tasks, or whole-product investment ROI.

Next routing, not an automatic grant: connect an explicitly authorized real provider
and product entry point to this already-tested core while preserving authenticated
execution boundaries, then measure it on a separately approved fixed task. Do not
add another swarm/gate framework or rerun old benchmarks without authorization.
