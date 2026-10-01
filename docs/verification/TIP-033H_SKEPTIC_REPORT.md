# TIP-033H skeptical review

2026-10-01. Reviewer: separate Codex agent/context, same model. This is
counterexample-oriented mathematical and implementation review, not formal
verification, different-model independence, expert acceptance or novelty
certification. AGENTS, applicable handoff updates, H contract and Vibecode
verification instructions were read. The reviewer changed only this report.
No paid call, live DB mutation, worker/campaign, Git or deployment was run.

## Requirement coverage and verdict

Six of six requirements mapped and reviewed; no missing implementation was
identified within the declared offline scope. H01-H04 have code inspection,
actual producer, trace/schema/transport and retained-render tests. H05-H06
have exact proof review, a third independent arithmetic implementation,
fixed TS/Python replay, mutation and interruption tests, and explicit
literature/scope qualifications.

Overall: **READY-with-deferred runtime acceptance**. Parent's guarded
`hiveos_test` integration run must verify real cycle retention and zero
downstream model calls on failures. This reviewer did not run that DB gate
or a live browser/campaign. Passing offline review does not assert that a
new V3 event has already been retained by the user's live cycle.

| Requirement | Offline review result | Boundary |
| --- | --- | --- |
| H01 | PASS | Fresh V3 producer passes; historical V1/V2 retain versions |
| H02 | PASS | Strict pins/completion checks and failure diagnostics; runtime integration deferred |
| H03 | PASS | Real worker callbacks forward sealed evidence to every role; no actual model calls |
| H04 | PASS | Retained-only static math rendering and no rendering-time G execution |
| H05 | PASS | Complete ALL-k decisions on 35 fixed rays only |
| H06 | PASS | Adversarial controls and explicit no-novelty/no-root-proof status |

## V3 evidence boundary

The universal validator checks the exact canonical fixed G packet hash,
without importing its implementation at runtime. Its checker import is
type-only. This is important because retained trace validation is also used
by the UI. Fresh enumeration and Python execution live behind the separate
Node adapter and occur before agents, not during page rendering.

An actual fresh V3 producer succeeded at test root `a` repeated 64 times:
envelope SHA-256
`a9c764be66504da123cd1fd5890dc1bcf64f8a41821633518af2a752a3f71d90`.
G's unchanged wire/output SHA-256 is
`0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9`;
Python source
`4cfbb8c77a2d09c624eb9e2771de2efaea7fbe318d7e617c3ee0b7d57c582fad`.
The target counts are the original 22,060/23,891/1,462/24,538 cores and
2/0/1/2 hit cores.

Seventeen independently rehashed mutations were rejected: omitted,
duplicated or changed target; changed limits or inner/outer scope; PARTIAL
packet; corrupt negative-row hash or witness; actual checker/Python/primary/
output hashes; missing power; downgrade with power still present; expected
checker/Python pin drift. A rehashed wrong-root envelope was rejected when
checked against the expected root. Deep key reordering passed, preserving
JSONB-order-independent validation without loosening content or array order.
An additional low-priority forensic gap was found and closed before freeze:
PARTIAL previously allowed a copied COMPLETE primary digest even though
dispatch stayed blocked. The final schema rejects that combination; a
distinct attempted-prefix digest remains retainable as diagnostic-only.
Direct reviewer mutation recheck passed after the repair.

Baseline, kernel and power UNAVAILABLE each remain representable as valid
diagnostic envelopes, but all three fail the combined PASS predicate.
Trace tests reject calls after failed evidence, permitting only the typed
INTEGRITY_FAILURE termination. Version-marker mismatches, stripped V3 and
rehashed corrupted trace evidence are rejected.

Independent isolated Node fault injections verified:

- Changed checker bytes read: UNAVAILABLE/CHECKER_UNAVAILABLE, actual
  nonmatching checker hash, no accepted packet.
- Checker monotonic deadline: PARTIAL/CHECKER_PARTIAL, no accepted packet,
  no actual Python/output provenance invented.
- Missing fixed Python source and missing Python executable:
  UNAVAILABLE/REPLAY_FAILED, actual script/output hashes null.

These tests changed only isolated process functions/environment temporarily,
not shared repository files. The fixed executable path, isolated Python
flags, output cap and allowlisted child environment remain intact.

Fresh V1/V2 envelopes and mandates have no G power payload or new V3
conclusions. Actual worker callback tests exercise portfolio, planner,
source analyst/challenger, verifier, solver and critic/adversary forwarding.
The V3 panel renders only retained parsed evidence, including all targets,
counts, strict witnesses, source provenance and MathText/KaTeX. Failed power
evidence does not render the completed G counts/witnesses. The q99 rescue is
properly identified as outside G's power-family witness scope, not a newly
replayed V3 power witness. The q99 rescue is also outside the retained V1
baseline: it is separate prior research, not authoritative retained evidence
in either packet. The unchanged V1 baseline instead freshly replays the
p159727681 b1 rescue `m284,s1135,A4,U71,k1`. That retained positive witness
prevents interpreting G's b>=2 family miss as root exclusion.

## Split-support scientific review

For `m=Bq`, full coprime partitions permit odd `d,e` with `gcd(d,e)=1`,
`de|q`, and signed ratio `2^f e/d`; the leftover `r=q/(de)` can share prime
factors with either side. Ratios are not confined to `q^-1,1,q`. The identity
`d^-1=4B(q/d) mod(4Bq-1)` explains why mixed partitions create new wrapped
residues. G's prime-power minimum must not be extended to these partitions.

Mandatory exact countercontrols remain:

- `p19,m30,q15,s119,A6,U5,k1,Q1`: strict `(5,114,570)`, residue19 below
  the false generalized bound39.
- `p159727681,m198,q99,s791,A3,U11,k6,Q605794`: strict
  `(39982404,31626080838,1741717274106852)`, residue260 below false bound263.

The reviewed ray lemma avoids that false extension. Fix positive coprime
`A,U`, set `m=AUk`, `s=4AUk-1`, and let `Q0` be the least positive integer
congruent to `-U mod A`, with `Q0=1` at `A=1`. Put `h0=(U+Q0)/A`.
Then

`p0(k)=(sQ0-U)/A=4UQ0*k-h0`, with `0<p0<s`.

The canonical bounds follow directly from `U<=m<s` and `1<=Q0<=A`.
Every hit has `p0<=p`, hence `k<=floor((p+h0)/(4UQ0))`. This inequality
is necessary, not sufficient. The necessary AND sufficient test is the
original one: positive `d|Ap+U`, `d=-1 mod4AU`, and
`k=(d+1)/(4AU)>=1`. It gives `Q=(Ap+U)/d=Q0+A*t` and
`p=p0+s*t`, `t>=0`. No raised equation or exchanged core is substituted.
At `A=1`, `p0=s-U`; at `U>A`, the positive representative definition still
works. Generic identities may be non-strict, so strictness and divisibility
are validated separately rather than inferred from the congruence.

Fixing `A,U` retains the ratio partition, not a fixed complete support for
`m`: varying `k` may introduce primes. The 35 rays comprise seven fixed
pairs at the four named targets plus p19. They are not all mixed-core
partitions. This is elementary divisor/Type II algebra, compatible with
[Tao 2011, Proposition 1.2/Remark 1.3](https://arxiv.org/html/1107.1010v2),
not an established novel theorem or uniform root-hitting result.
The [Elsholtz–Tao section 2 source](https://terrytao.wordpress.com/wp-content/uploads/2011/07/egyptian-count13.pdf)
was also opened independently: equations 2.13–2.15 map
`(a,b,c,d)=(U,Q,A,k)`, `e=4UQk-p`; equation 2.20 is the original
normalized condition. This confirms established parametrization, not novelty.

## Exact arithmetic and adversarial measurements

A third independent stdin Python scan enumerated all divisor quotient pairs
for these 35 numerators: 871,256 square-root iterations, 12 hits, all strict.
An independent 198-edge-control set checked canonical residues, `A=1`,
`U>A`, zero bounds, `kMax+1`, and wrapped targets. All passed.
The proposed iteration limit was corrected before freeze from 166,606 to
the exact 166,608 needed by the largest row; this is now the explicit cap.

TS prime-factor divisor generation and Python exhaustive quotient-pair scan
agree on 2,544 controls, 35 rays, 366 divisor rows and 12 strict hits:

- Python source SHA-256:
  `877cbe16fd4a3f58eeae83e9344122151b2d1f15553883c49cc7aa0cce8e6c8b`.
- Whole packet/output SHA-256:
  `d1fb21ec5ae382ddbf26a26e33ebd61b3d0731ef6e319bc386ede5bbad39952a`.
- Ray manifest SHA-256:
  `99469d36791bf21dd8e6ed8d60b493ea5eceba4039c74b6a5279f23fbc50aaab`.

Twelve packet corruptions were rejected: omitted ray/target, negative-row
hash, bound, wrap count, hit k, forged negative, broadened scope, limits,
divisor count, factor and completion status. A forged primary returns
UNAVAILABLE. PARTIAL never compares PASS or invokes a successful replay.

TS six and Python five independent deadline injections retain exact pending
inputs and partial prefixes at control, factor, internal factor, divisor and
finalize phases; TS additionally checked a mid-divisor prefix. At internal
factor expiry both retained seven completed rays and 32 divisor rows with
pending `p131433121,A6,U5,N788598731`. At finalization both retained
35 completed rays/366 rows while remaining PARTIAL, with no complete
global manifest. Scope/output limits remain predeclared and unchanged.

## Technical health and remaining gates

Fresh reviewer targeted unit run: **38 tests / 5 files PASS**, including
V3 schema/trace/UI, historical agent/V2 tests, actual worker transport and
split-support.
The final post-hardening V3-only rerun separately passed 14 tests / 1 file.
The reviewer did not claim a production build, full typecheck,
full lint, integration or browser suite; parent owns those release gates.
Parent reported a final frozen full unit result of 458 tests / 82 files PASS,
typecheck PASS and full lint zero errors/warnings. The guarded test-DB
integration is pending parent at this checkpoint: the first sandbox attempt
failed setup with EPERM, not an arithmetic assertion; the approved isolated
rerun is in progress. Browser tab attachment encountered a CDP timeout, so
static retained-render tests do not stand in for a completed visual/live E2E.
No unresolved mathematical/parser/transport finding within the reviewed
offline slice. D/E/F/G sources, pins and historical scope statements were
not edited by this reviewer.

Research progress here is better provenance and exact target-sensitive
ray classification. It is not a mathematical breakthrough, a solution of
the open problem, expert novelty clearance or proof that all finite ray
misses cover the residual search space. H's ray packet remains standalone;
it is not silently part of V3's fixed G power packet.
