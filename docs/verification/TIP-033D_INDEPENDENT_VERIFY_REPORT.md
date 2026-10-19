# TIP-033D Contractor independent verification

2026-10-01. Vibecode Kit v6.2: Builder implementation, Contractor fresh checks,
separate skeptic mathematical/adversarial review. Scope is fixed-target local
research, not publication or a conjecture solution.

## Certified arithmetic verdict: PASS

The fixed CLI was run independently:

```text
node --import tsx scripts/operations/certified-two-core-audit.ts
```

TS and isolated Python agree exactly:1185 certified prime nodes,388 criterion
entries (384 distinct integers),54 candidate-ell decisions,zero unresolved,
15 strict construction witnesses /14 distinct denominator tuples. All exponent
tails for the four targets are decided in the precise exponent-one subclass.
Artifact and full decision digests match the Builder report and research note.

The Contractor read both checkers and the prior tail proof. The separate
skeptic independently justified the per-q gcd Lucas argument and exhaustiveness
of divisor enumeration. Fourteen direct adversarial TS mutations were rejected,
including duplicate/composite prime nodes, omitted factor decisions, fake empty
negative results, cutoff contraction and unresolved COMPLETE. A valid alternate
Lucas base was accepted correctly; byte provenance is separately enforced by
the fixed loader's artifact hash. This is not independent foundational/formal
certification or a novelty finding.

## Repair found during independent review

Initial generator placed candidate enumeration/finalization outside its
RuntimeError handlers. A real SIGALRM could therefore exit without a PARTIAL
record. Builder repaired the whole-target boundary, without changing the
COMPLETE artifact. Independent skeptic injected actual SIGALRM in target prime
certification, criterion factorization, early/mid candidate enumeration,
candidate factorization and finalization. All produced explicit PARTIAL with
exact interrupted input/phase, pending tasks and disabled timers. No COMPLETE
fallback occurred. Monotone expiry also returned PARTIAL. In-memory normal
regeneration remained byte-identical. Finding CLOSED.

Current generator SHA256:
`908168b400a3fb70c3ccdf5f720c26b11459b49c1ec78b8d6e4ebc596061a0c8`.

## Product-path repairs associated with the live scenario

The real worker composition initially dropped mixed-core evidence at both source
roles and appended a static V1 solver mandate. Builder repaired the forwarding
and version-aware mandate. Two real-composition unit regressions mock only
job/model boundaries and exercise every role under V1 and V2. Existing injected
kernel tests had not detected this composition defect; those tests alone were
not evidence of correct actual-worker transport.

A live launch on an old root then hit the permanent command identity guard.
The application action previously let IDEMPOTENCY_CONFLICT crash the page and
silently ignored stable FAILED outcomes. The UI now returns explicit bilingual
feedback, preserves the selected mission and directs fresh autonomous tests to
a fresh OPEN root. Key, actor checks, root admission and history are unchanged;
there is no automatic retry. Six action regressions cover expected failures,
unknown errors, authorization boundaries and successful revalidation.

## Scope boundaries

- Complete decisions cover four named targets, `m=2^a*ell`, ell odd prime
  exponent ONE only. They do not cover higher odd-prime exponents or all primes.
- Exact strict tuples do not establish new overall conjecture coverage,
  minimum denominators, novelty or a formal theorem.
- TIP-033D target decisions are separate from the collision-kernel V2 packet;
  do not claim that the live V2 envelope contains them.
- No paid API, Git commit/push, deployment or publication was authorized here.
- Unrelated screenshot changes, pnpm-workspace.yaml and pycache were preserved.

Research details and exact target table:
`docs/operations/MATH_PILOT_CERTIFIED_TWO_CORE_TAIL_2026-10-01.md`.

## Actual local subscription execution: retained V2 scenario

Fresh OPEN root `9cc36477-fb4a-4630-849f-e080dd1079ae` was created through
the authenticated browser in mission `31943653-4a30-462a-af11-ecd99f9ebfa2`.
No human steering/acceptance attestation was submitted. Its model attempt is
PARTIAL: a conditional fixed-core residue criterion, not universal coverage.
The separate root critic/adversary review is INCONCLUSIVE. These executed via
the existing authorized service actor and Codex subscription, not a paid API.

Cycle `b91ed2e5-2ac8-4950-a37c-0809904d2110` / job
`81f3fa3d-5c24-4b3a-88f6-a918fd132cc4` is terminal: STOPPED /
VERIFICATION_REJECTED; job SUCCEEDED. Independent final SELECT confirmed one
completed round, four started calls and 95,899 observed tokens. The configured
bound was one round, seven calls and 200,000 observed tokens; token threshold
is checked between calls, not a mid-call hard token ceiling.

Event 3 MIXED_CORE_EVIDENCE precedes event 4 CALL_STARTED (planner). Both
source-pinned Python replays passed, retained as V2 rather than inferred from
a separate workbench. Actual roles: PLANNER, SOURCE_ANALYST,
SOURCE_CHALLENGER, VERIFIER. The verifier rejected the chosen A<=107 finite
survey because its relationship to the promised higher-exponent normalized
mixed-core obligation was not established. No cycle solver, critic or
adversary call occurred after rejection; the second structural branch remains
UNRUN, not refuted. Composition unit regressions, not this live run, cover
transport to those downstream roles.

Final event-chain digest:
`3083cfddcc8f3feadd77d9ced3102c4cb20a7d1b7ec18ab5b72be18cffc0608f`.
V2 packet stays
`e4d7b0a4c03ab08c80a6d8a032dc9c8f4d117dd611ac61d981ffd25eb2820cf4`;
this scenario does not import the separate TIP-033D target certificate.

Browser showed the selected root, V2 PASS/PASS disclosure, source findings,
terminal rejection and its explicit reason. Viewed screenshots:
`/tmp/hive-tip033-v2-retained-2026-10-01.jpg` (earlier in-progress evidence)
and `/tmp/hive-tip033-v2-final-2026-10-01.jpg` (terminal rejection).

## Presentation, performance and final checks

Added a GET case selector that retains missionId and filters only already
authorized/loaded cases and their cycle history. Calibration still uses ALL
authorized loaded cases. Invalid/repeated/cross-mission IDs fail closed.
The selected-case URL and selected option were independently verified in the
browser. A full-history selector navigation reached a server 200, but large
history/CDP stalls prevented a clean all-history round-trip assertion; do not
claim exhaustive browser coverage of the selector. Direct selected-case
navigation displayed the correct result. A later same-case GET was also
attempted; CDP timeout means it is not additional acceptance evidence.

Auto-refresh now waits 15 seconds after transition completion and shares an
in-flight lock with manual refresh. It stops scheduling when hidden/idle or
unmounted; already dispatched requests cannot be canceled. No request-start
timestamp is represented as confirmed data freshness. Nine scheduler and ten
case-selection unit regressions pass. The selector reduces validation/rendered
DOM, not the original take100/take20 loader or DB read payload. Full-history
performance/pagination remains an explicit gap. Heavy concurrent full-history
polls produced live authorization transaction expirations; authorization and
the 5-second transaction timeout were NOT weakened.

Fresh final Contractor checks: 402/402 unit tests in 75 files; full typecheck,
full ESLint (zero errors/warnings), and diff-check PASS. Strict integration
math-pilot + math-formal-gate: 9/9 PASS in guarded hiveos_test. One earlier
concurrent-load run timed out at the existing transaction bound; the isolated
failing test and then the complete two-file single-worker run both passed
without timeout changes. No production build or whole-app E2E suite claimed.

Worker was stopped with SIGINT and confirmed exit 0. Loopback demo 3001 was
restarted with MATH_PILOT_QUEUE_ENABLED=false and RESEARCH_OPENAI_ENABLED=false;
Codex-local mode remains available, but no further cycle is running. Three
pre-existing non-research command.failed jobs were left untouched.

Current contractor manifest SHA checks all PASS. After the successful terminal
screenshot, browser control stalled again during a same-case GET/recovery.
The server logged selected-case 200 responses (18.9s then 7.3s) and a concurrent
full-history 500/P2028. The retained screenshot is the verified terminal view,
not proof that the final tab remains responsive. This remaining operational
gap must be investigated before claiming a production-quality live monitor.

## Next mathematical method, written not retained as an agent event

`docs/operations/MATH_PILOT_NORMALIZED_CORE_FINITE_BOUND_2026-10-01.md`
derives a finite bound for ALL normalized cores, not only odd exponent one.
For p=1 mod4 it gives m<=floor((p+3)(p+7)/48). A separate skeptic reviewed
the algebra. This is a written derivation, not a Lean result, novelty finding,
completed general-core enumeration or retained live model result. It makes
higher-exponent targets finite in principle, but their factorization and
completeness certificates are still UNCOMPUTED. Next tasks must address that
precise target obligation rather than repeat the rejected first-gate survey.
