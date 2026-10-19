# TIP-072P — Main acceptance: adaptive phase locking

Date2026-10-05. Status DONE within sealed additive OFFLINE scope /
VERIFIED_CONDITIONAL_METHOD_MILESTONE, LRC-ADAPTIVE-PHASE-LOCK-01.
Full production072 remains PARTIAL / NOT_READY_FOR_M1; agentLoop NOT_RUN.

## Outcome

The [written proof](../research/LRC_ADAPTIVE_PHASE_LOCK_2026-10-05.md) replaces
an overly restrictive exact-speed premise with an adaptive common-time phase
condition. Independent integer coordinate lifts do not preserve an exact q,2q
pair; even switching between finitely many nonidentity pairs cannot cover a
full integer orthant. Finite prime-digit boxes remain a separate domain.

For d5,14 moving/15 total, nine divisible speeds have a reduced lower witness
tau at margin1/10. Set tStar=tau/5, U=max ACTUAL DIVISIBLE speed, R=1/(30U).
Select unit exceptions a,b with b≡2a mod5, Delta=b−2a. If Delta0 or
|Delta|R>=||Delta*tStar||, choose a nearest integer n to Delta*tStar
(ties LOWER), adjust base to n/Delta and select a common j/5 shift.
The lower-valid interval is preserved and the pair forbids at most one shift;
three other unit exceptions forbid at most three more. All14 achieve1/15.
The speed-only sufficient condition |Delta|>=15U does not require b=2a.
Lower LRC9 suffices for existence but is not independently reproved here.

General residual and adaptive interval lemmas are separately written and
reviewed, not inferred from samples. Lower coordinates must remain invariant
under every subsequent shift. Gate failure is UNKNOWN, not LRC refutation;
a small-defect example actually has witnesses even though this gate fails.

A concrete infinite family is proved for ALL integers z>=0:
divisibles5,10,...,45, exceptions1,2+1245z,3,7,11.
The mathematical-only addendum strengthens its prescribed witness margin
to8/83, strictly above1/15 by37/1245. Forz>=1:
n=25z−floor((z+5)/10), t_z=n/(1245z), T_z=t_z+1/5;
z0 usesT0=11/50. The bound follows the two rounding-parameter regions,
|t_z−1/50|<=1/12450, Lipschitz lower control and a fixed exception interval.
z1 attains8/83. Sharpness is ONLY for this prescribed witness construction,
not a tuple's best loneliness over every time or a literature novelty claim.

This is a SUBfamily, not a whole independent congruence branch. Growing a
divisible coordinate within the same residues can destroy both sufficient
gates. Synchronization restricted to the original modular grid cannot newly
close a branch declared NO_GRID there. No actual retained improper class,
global LRC14/15,14-total1/14 target, formal/external/novelty or generic
strict-slack claim was accepted.

## Contract, implementation and review

Vibecode Kit separated Contractor, one implementation Builder and an independent
mathematical/consequential reviewer. Main wrote no product code. Current AGENTS,
handoff, full skill/references and installed Next.js guides were read.
A focused scan and bounded contract were used; no architecture/UI approval was
needed because existing runtime/API/schema/worker stayed untouched.

Sealed TIP SHA b3359a453810750e0a66f72b6f4201b301e3114ba3bc65abed40a7e13d764992.
Approved mathematical-only addendum SHA
31e421eccbdb639298d2f912427543b4be97ef536def810b0177ef1c18505f10.
The addendum changes no product field, fixed case, representation or quota.
gcd1 is not a theorem premise; valid nonprimitive input was correctly allowed.

The new Python helper is fixed14/d5/e5/r2, exact stdlib Fraction and bounded
actual inputs only. Its CLI has SIX fixed cases and no supplied paths/speeds/
claimed verdict admission. No old arithmetic imports or application lane.
Five successful cases retain full original and aligned matrices; the UNKNOWN
case retains original matrix and separately observed full witness. Every
context, lower witness, label, residual, rounding, BAD union, GOOD index, chosen
time and all coordinates remains present:770 matrix entries plus54 lower ones.

Main read the entire frozen script/tests, Builder completion and independent
review, and checked source/proof/test/report pins. Separate Main Fraction scratch
reconstructed all770 entries and contexts. Its prescribed witness values match
11/50,11/50,148/675,149/675,274/1245 with full minima
1/10,1/10,13/135,1/15,8/83. Negative-defect endpoint equality is GOOD.
Main separately calibrated seven z samples and10000 z values; finite loops
are NOT the basis of the infinite-family proof.

[Independent review](TIP-072P_INDEPENDENT_REVIEW.md) accepted the proof/addendum and independently rebuilt the
entire actual body. Its final36/36 tests and27 own consequential controls PASS;
no remaining P0/P1 in the sealed scope. Ten coherently rehashed corruptions were
caught by its own whole-body comparison, NOT a new product admission API.
An early run during Builder edits correctly failed a stale source pin; the
final frozen36/36 run supersedes it, without erasing that development failure.
Its completion is mathematical/local execution evidence, not signed host/
interpreter/runtime attestation, scientific admission or actual agent M1.

## Main actual verification

All six flags explicitly false: RESEARCH_WORKER_ENABLED, MATH_PILOT_QUEUE_ENABLED,
LRC_CAMPAIGN_LOCAL_ENABLED, RESEARCH_OPENAI_ENABLED,
RESEARCH_CODEX_LOCAL_ENABLED, SANDBOX_DOCKER_ENABLED.

Fresh actual process executed the inspected pinned Python bytes under-I/-S/-B
with only those six OFF variables, empty stdin and5s parent timeout.
Source pre/post SHA matched. Main independently reconstructed and compared the
COMPLETE canonical mathematical body, including all context/matrix/scope fields:
exit0, empty stderr, COMPLETE_CANONICAL_MATCH,20,211B stdout including newline,
88,553 charged steps,6.334166ms arithmetic. Metrics are local observations;
they are excluded from deterministic semantic hash, not performance promises.
Semantic digest32f7111e4059850f48d09ea122a5d6cbc4f46ca3250ce426b95055672bef3a1b.
5s/2M/32KiB/256-bit ceilings unchanged, no omitted fields or budget reset.
This source consistency check is not production executable closure.

Main isolated Python unittest:36/36 methods PASS,1.327s, exit0.
Includes full independent certificates, sign/ties/closed radius, false premises,
subclass hooks, metadata/input/component/output/resource refusals,30 actual flag
fault processes and finite z samples. Subtests/repeated checks are not added to
the method total. AST syntax2/2 PASS without cache writes.
There is no installed Python static-lint/type checker used or claimed.

Existing46 named Vitest unit selectors:1917/1917 PASS, exit0,
start08:40:45 local,63.34s; selectors unchanged from072O.
Whole typecheck (incremental false) and whole lint: exit0/no diagnostics.
These repository checks are TS/ESLint, not Python static typing.
git diff --check: exit0.
Build SKIP: no Next.js/TS/UI/assets/config/dependency edits; rebuilding the
unchanged application would not validate this Python research-only addition.
Prior072O build PASS remains historical, not a new build result.
Owned local dev31111 stayed running at127.0.0.1:3001; no restart or browser E2E.

Reproduce new diagnostic/tests with the six OFF assignments, followed by:
- /opt/homebrew/bin/python3 -I -S -B scripts/research/lrc-adaptive-phase-lock-replay.py
- /opt/homebrew/bin/python3 -I -S -B tests/research/test_lrc_adaptive_phase_lock.py

## Quantified scoped acceptance and preservation

| Criterion | Result | Accepted evidence |
|---|---|---|
| P1 | PASS | Full integer-lift quantifiers, pair obstruction, concrete same-residue control |
| P2 | PASS | Reviewed all-real residual lemma with strict BAD and unit premises |
| P3 | PASS | Adaptive interval theorem, fixed corollary and infinite-family8/83 addendum |
| P4 | PASS | UNKNOWN/observed-witness split, no whole-branch or global promotions |
| P5 | PASS | Complete actual fixed replay,36 new Python tests, unchanged bounds |
| P6 | PASS | Independent frozen review, Main QA and append-only preservation |

Implemented6/sealed6=100% OFFLINE coverage; missing0, acceptance failures0.
The expected UNKNOWN case passes its intended scenario; it is not a failed AC.
These numbers are NOT a project-completeness or production-readiness score.
Existing1463-file fingerprints: only manifest/handoff append;8 new assigned
files, no removals or old product/test changes. Original368014B handoff prefix
SHA cbbac742404d9845d38f2c884f983f2782cee2f03ae0535754efca1393fe34aa preserved.
Manifest118 entries SHA6e818805c730087fc67d14d006512bf2c32a260000e8503c063e157f5c03f72a;
prior116-entry prefix SHA95ad08688176bb50ba780dae2d499dc1d307a2f1517c6c48723fe4faea98d987 preserved.
HEAD4d108227498d3578c9ac3fe60305c10da5aa905b / branch
codex/tip-023a-organization-graph unchanged; all dirty prior work preserved.

## Frozen references and next boundaries

Proof SHA7c33eed92c999d18e1acfcda8748c5f88d2cbb6316166f68422c797b49182be6.
Python SHAde32c661d4d7c06fd4964c2e202f998de253ab4fe07bec50e053cd1e532ad622.
Tests SHAf3b7953503a22928a15f373536bfc202681a4fb87c5abc61779c77139ac49c39.
Builder report SHA8a8855dde6e0d8cbb6073d43f001503d2e2399939c5043eb8d93e1ab3ce64db3.
Independent review SHA baa040c55ef96648e9964e51e339450dd7ef318f8d1a45719ed657c685170553.

Next research: partition remaining parameter regions and choose structural
relations/phase routes for those regions; do not infer full coverage from this
subfamily or keep testing one congruence representative. Any new branch
elimination needs a proved family predicate and completeness evidence.

Production072B reviewed CAS/current lease/native provenance/executable closure,
authorized phased durable replay, pre-critic independent replay and exact human
G2 before ONE fresh M1 then STOP remain pending. Private root remains untouched/
unauthorized. Full072 PARTIAL/NOT_READY_FOR_M1, agentLoop NOT_RUN, authority false.
No DB/session/API/provider/model/Codex-child/private-root/scientific-case/job/M1/
campaign/archive/schema/migration/envfile/install/Gitwrite/commit/push/billing/
deployment. Old registry37/sourceceiling42/ledger7/history/refutations/064FAILED
orUNKNOWN and old predicates untouched. Mathematical progress and closed
autonomous E2E remain distinct deliverables.

