# TIP-041 — All-subgroup block coverage

2026-10-01. Owner continued with “tiếp” after TIP-040. Depends on accepted
TIP-040 and immutable TIP-037/039 input controls. Vibecode Kit v6.2: compressed
SCAN/proof challenge/TIP/BUILD/VERIFY; no architecture, release, paid authority
or human gate change, so no additional approval ceremony. Builders own code;
Contractor owns contract, manifest, diagnostics, verification and handoff.

## Decision and preregistration

Before discovery, three separate contexts challenged this GENERAL finite-abelian
Kneser sufficient criterion. It is stronger in hypotheses than the previous
primitive cyclic proposal: it does not require cyclic D or individual generators.
It is a standard deduction, not a novelty claim. No campaign outcome has yet
been computed. Abstract proof controls are separate from registered root rows.
Source: https://arxiv.org/html/1303.3539v1, DeVos Theorem1; iterative application
in the hypothetical exact-stabilizer quotient is our explicitly stated deduction.

Freeze191 rows, in this order:

1. Exactly all71 TIP-040 inputs in their original order:60 TIP-037 followed by
   all11 TIP-039. No filtering by hits, misses, characters or prior certification.
   Prior sufficient content48b455470ecb38da669d372206841a65fbc34facb0b684763a01b3df5d96fa72;
   source TIP-037 a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c;
   source TIP-039 ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e.
2. Eight additional roots in ascending order
   [199000201,199002721,199003561,199006921,199014481,199031281,199035481,199039681],
   each with the same ascending15 prime shifts
   [3,7,11,19,23,31,43,47,59,67,71,79,83,103,107].
   Rule: first8 ascending primes p1mod840 in[199000000,199100000], chosen by
   primality only, not denominator factors or method outcomes. Main performed
   only this primality selection and repository literal-exposure search, with
   no previous matches in docs/scripts/tests/src. Canonical new-cohort identity
   (string roots/shifts, selection FIRST_8_ASCENDING_PRIMES_P1MOD840_IN_199000000_TO_199100000_PRIMALITY_ONLY):
   0dce735540a95a5087c5d624b8f85faab6e20a009b3071bfdc4ba4b126f9806a.

The120 new rows are unexposed relative to this development run, not a globally
uncontaminated model benchmark, novel primes or previously unverified mathematics.
No new row, shift, allocation policy, fallback or cap increase after outcomes.
Separate old and new cohorts in summaries. Failed science is still reportable.

## R01 — Quantified all-subgroup sufficient theorem

Recheck fixed root p prime1mod840, m<p, T=(p+m)/4 integral, gcd(T,m)=1.
Registered m is prime3mod4 or3q with q prime1mod4. Bound p<=201000000,
T<=100500000; exact sorted distinct prime blocks r_i^e_i, W_total<=26.
G=U(m), t=-1, M=m-1 or2(q-1), BigInt/integer-exact modular arithmetic.

Let covered K be constructible using already spent support J. For unused block
B, define D=<r_i K:i in B> in G/K and W=sum_{i in B}e_i. For EVERY proper
subgroup H<D, including identity and all noncyclic/nonmaximal H, compute
n=|D/H|, d_i(H)=ord(r_i H in D/H), and

    lowerBound(H)=1+sum_{i in B}(min(d_i(H),2e_i+1)-1).

If lowerBound(H)>=n for every proper H, the legal signed B-box fills D.
Proof: if its image S were proper, its exact stabilizer H is proper. In D/H
final image is aperiodic, and every prefix period persists so prefixes are
aperiodic. Projected atom size is exactly min(d_i(H),2e_i+1). Iterative Kneser
forces |S/H|>=lowerBound(H)>=n, contradiction. The hypothetical stabilizer is
used only in this proof, never as a free paid witness subgroup.

Identity-H already implies |D|<=2W+1<=53. An exact atom relative order above
that bound or generated closure exceeding it disproves this criterion only.
It is NOT target absence or an exact full group size from a truncated prefix.
Criterion is sufficient, not necessary: full boxes can fail it and its size cap.
The block need not contain t; coverage of D only extends K to its preimage L.

Only after theorem PASS, construct actual legal block representatives for every
D coset. TS signed-coordinate DP; independent Python positive coprime divisor
pairs uv|T_B. Retain numeric-lex ordered pair per coset and actual residue/vector.
Multiply each representation by each old K representation ONCE: disjoint J/B
coordinates give covered L, with no repeated valuation or free stabilizer budget.
Construction verifies the theorem's predicted complete D before acceptance.

## R02 — Frozen routing, certificates and independent arithmetic

Start K={1}. Preserve TIP-040 ascending eligible individual factors (including
relative order1, consecutive digits[-e,-e+d-1], skipped-factor reconsideration).
Stop immediately if t first covered. When no individual is eligible, enumerate
all multi-factor unused-support blocks: increasing cardinality, then increasing
bitmask on ascending current unused indices. First passing block is consumed;
restart individual selection on the expanded covered K. No block choice by
target membership, observed witness quality, baseline outputs or prior outcomes.
If no block passes, use exactly the old disjoint remaining-support quotient
energy policy. Keep strict LA+LB>|G/K|; do not confuse its > with block theorem >=.

Canonical cosets are minimum numeric element of gK. Capped D closure uses
identity, ascending numeric frontier, ascending block factor generators, positive
generator multiplication, recording discovered distinct canonical cosets. A
truncated prefix stops at2W+2, explicitly LOWER_BOUND_ONLY. Exact order-bound
rejection retains the first ascending atom witnessing it; no exact D is claimed.
Fully closed D is sorted numerically. Enumerate the COMPLETE subgroup lattice
inside D only, canonical sort by subgroup size then numeric-lex member list;
retain ALL proper subgroups and their checks, even when one inequality fails.
Max4096 subgroups per attempt is a resource guard, not a theorem about the count.

Record every attempted block's current K/unused binding, support/mask/W/bound,
exact orders or capped closure evidence, complete subgroup list/checks when
computed, decision and all first successful construction records. Retain all
individual/block stages, covered reps, consumed/unused allocations and every
remaining energy attempt. Block/half reps are numeric-lex ordered(u,v); final
inversion negates the WHOLE vector, with raw reps and orientation retained.
First certificate stopping/unevaluated partitions are explicit.

Statuses distinguish single-chain, block-containing-chain, energy and
NOT_CERTIFIED; CHAIN mechanism records whether any consumed stage used a block.
These are constructive certificates, not globally minimum denominators.
Every certificate checks the root-bound pair and strict Type-II tuple:
u,v coprime,uv*k=T,u+v=m*A, sorted(T,Apuk,Apvk),4xyz=p(xy+xz+yz), exactly two
p-divisible denominators. Noncertification never means MISS/root exclusion.

Independent Python hardcodes frozen inputs, rechecks primality/factors and
all subgroup/order/inequality/allocation/representation/tuple invariants without
importing TS decisions. Independently implemented arithmetic and alternative
subgroup joins versus generator closure must reconstruct the complete lattice.
Use fresh isolated execution of verified pinned source bytes, full semantic
comparison, not supplied matching JSON or digest-only acceptance. Scoped checks
alone cannot prove lattice/frequency/representative completeness or canonicality.
An abstract proof regression seam is never fixed-root/witness admission.

## R03 — Measurement and resource boundaries

After ALL new-method decisions, separately compare old71 against immutable
TIP-040 baseline and old independently exhaustive truth. Report gained/lost
certifications, known hits/misses still NOT_CERTIFIED, status mechanisms and cost.
Run a separate independent complete divisor-pair truth diagnostic on the new120
ONLY after generation, with its own60s/50Mpair/50Mwork/8MiB caps; report hit
recovery and any false certificates, not overall NOT_CERTIFIED-as-miss accuracy.
Do not run old method on new inputs and claim equal-budget superiority: no such
two-arm live-model comparison is authorized or established in this slice.

Frozen per producer/replay60monotonic seconds,191rows,2Mstate insertions,
50Mgroup/modular work,50M independent pair checks,8MiB output,
maxSmallGroupElements53,maxSubgroupsPerAttempt4096. The larger output envelope
is declared BEFORE execution for191 detailed rows/lattices, not a repair after
failure. Minimum lowered envelope32768 preserves all input identities.
Account for closure/canonicalization/subgroup joins/order checks, construction,
hashes/sealing/output and wrapper reads/process/receipt. Subgroup/state/work/time/
output cap exhaustion gives atomic ordered PARTIAL pending ROW or FINALIZE,
not a falsely completed NOT_CERTIFIED row. PARTIAL never PASS; no cap widening.
Enumerate only small generated quotient D, proper-half maps and constructively
covered K; no ambient-unit scan or target-box truth used in eligibility. Eligible
block extraction is explicitly counted; no claim it is cheaper than full images.
Record inert import, synchronous checkpoint, trusted collector/Python binary
and externally signed attestation limits honestly.

## R04 — Adversarial and proof controls

Test all-subgroup completeness, including identity, nonmaximal and noncyclic H.
U15 repeated order2 atoms plus residue2 passes identity/maximal-only but fails
proper H={1,11}; U40 control passes cyclic-only but fails noncyclic H. These
abstract profiles can have prime products outside root bounds: proof seams
must not promote them to campaign rows or strict root witnesses. Positive
joint-coverage and noncyclic controls, target outside D, known full-image failure
of the sufficient cap, disjoint lift/orientation/restart and equality distinctions.
Fully rehash lattice omissions, forged subgroup membership/order/index/bounds,
closure-prefix exactness, reused allocations, reps/lifts/tuples/status/provenance,
resources/pending and first-success attacks. Coherent scoped forgery must be
rejected by actual fresh execution. No synthetic diagnostic is a math refutation.

## R05 — Deliverables and acceptance ceiling

New block-coverage primary/audit, independent Python/checker/fixed-source replay,
two unit files, research note, separate Builder reports, skeptical report,
Contractor report and appended handoff. Preserve ALL35 TIP-036–040 source/test
pins and founding/current contracts; add this contract to current manifest
before BUILD. Contractor fully reads final sources/proofs/reports and runs
actual replay, whole-unit/type/full-lint/manifest/preservation/adversarial gates.
Quantify requirements5/5, missing/deferred, scenarios and failure history.

No app/Next/UI/DB/history, agent admission, queue/worker/model/provider/API,
dependency/schema, Git/push/deploy/publication changes. No product E2E claim.
Root-wide factor supply, novelty/formal/external mathematical review, governed
tool integration and uncontaminated equal-budget model evaluation remain deferred.
Finite extra-input certification is not a research breakthrough or proof of
the unbounded Erdős242 claim. A measured lack of gain must remain visible.
