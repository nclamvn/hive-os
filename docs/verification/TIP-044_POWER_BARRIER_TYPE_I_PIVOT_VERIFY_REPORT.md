# TIP-044 Contractor verification

2026-10-03. **READY_WITH_DEFERRED —5/5 requirements,5/5 acceptance scenarios,
zero missing items within the frozen local proof/control slice.**
Research-only acceptance, not product BUILD. Original Erdős242 remains
**NOT_ESTABLISHED**; no solution, novelty, universal coverage or product E2E.

## Frozen scope and requirement accounting

Contract SHA256:
`2e7bd3aba80bcc5a9bc3e747f4cf8b85be25aad22c4cc42e71ec8036349896c7`.
Contract/current manifest frozen at2026-10-03 01:42:35UTC before finite replay.
Theoretical findings and named expected outcomes were known beforehand. This
is post-hypothesis scope freezing, not preregistered discovery or hold-out data.

| Requirement / acceptance | Evidence | Result |
|---|---|---|
| REQ-044-1 / AC1 | Infinite CRT families; exact available-budget restriction; full-shift positive control retained | Proof and four-context arithmetic agree |
| REQ-044-2 / AC2 | .832e bound and coherent quotient-size necessary condition; p401 paid-order control | No full-order or impossibility shortcut |
| REQ-044-3 / AC3 | Classical Type I proof, actual factor allocations, strict identity, prime-T taxonomy | Proof/source match; no novelty claim |
| REQ-044-4 / AC4 | Independent finite A/B/S/Main computations, known controls only | 36/31 primes,60 budget rows, five controls agree |
| REQ-044-5 / AC5 | A/B complete,S5/5 scopedPASS; docs/54 pins/86 entries/founding preservation and handoff | PASS with six broader gates deferred |

Vibecode Kit requires separate primary, replay and skeptical contexts; it
influenced the proof-first scope, fixed controls and independent validation.
Main wrote contract/research/verification/handoff, not product code. Contexts
share host/model family and are not external experts or independent models.
The PDF skill supported reading actual mathematical source statements rather
than treating a 2026 paper's conjecture as a solved universal result.

## Mathematical acceptance and attribution

For p=2521 modulo9240, least nonresidue11 and h9mod11 when11|T force
ord_h(11)=2mod4. A signed single-11 budget at most4 can hit only with order2
or6. Prime divisors of12 or1332 eligible3mod4 give only3, incompatible with
h9mod11. Available budget may be actual valuation or allocated copies: merely
forcing11^4|T does NOT exclude accidental higher valuation. Other factors,
shifts, paid corrections and Type I are outside this local no-go.

Distinct family p41161mod101640 has p10mod11, leastQNR11, least APprime23,
T11mod121, exactv11=1, image{1,11,21} misses22. Both progression gcds are1;
[Dirichlet Theorem18.1](https://math.mit.edu/classes/18.785/2019fa/LectureNotes18.pdf)
makes them infinite. Finite tests do not prove infinitude.

The chosen Burgess/Linnik bounds give h<=C_e p^(.832e); onlye1 implies
eventual h<p by this exponent argument. A failed upper bound is not a
mathematical impossibility; fixedq/e least progression primes remain bounded
over finitely many classes. For coherent inert cosets, q0^(d/2)<=T is necessary
with **quotient** orderd, not full order. Actual split correction remains
necessary. p401 demonstrates full30 versus quotient6.

The Type I construction is attributed to
[Elsholtz–Tao v6 Prop2.3/(2.6)–(2.8)](https://arxiv.org/html/1107.1010v6).
Legal ad|T,h|4a²d+1 gives c=T/ad and b=(pa+c)/h=cv−a, hence
T<bcd<abdp, exact4xyz=p(xy+xz+yz), exactlyONEp-divisible denominator.
Allocations alpha+delta<=valuation; the quadratic exponent does not spend
support twice. A modular root must be realized by an actual a|T/d.
For primeT=r,h>3, this branch iff4r=-1modh, restricted TypeII iff r=-1modh;
disjoint but not exhaustive. The research note contains full proofs.

Main checked original statements, not entire analytic proofs: Burgess as
quoted in [Banks–Guo v1 Intro(1.1)](https://arxiv.org/html/1511.05523v1),
[Xylouris published Theorem1.1,p66](https://www.impan.pl/shop/publication/transaction/download/product/83078),
Elsholtz–Tao parametrization, Dirichlet, Pollack's nonresidue supply, and
Chamberland2026's TypeII equivalence/conjecture distinction. No exhaustive
prior-art clearance, withdrawn-source reliance or GRH addition.

## Actual independent finite checks

All101 integers2521+9240t and101 integers41161+101640t,t0..100 were
primality checked:36 and31 primes respectively, all67 leastQNR11. All31
second-family primes satisfy h23/exactv11=1/the single-atom miss.

The registered15 primes h3mod4<=127,h!=11 give60 budget rows. Four hits
are all h3, incompatible with h9mod11. Only h31 is compatible in this finite
set; its four budgets all miss. This does not extrapolate finite counts.

Five known controls were separately replayed. Four registered positive
triples have strict integer identities and exactly1/2/2/2 p-divisible entries:
(5,10,130), (41,942,38622), (108,1604,10827), (638,55462,804199).
The three prime-T controls give TypeI/TypeII counts(1,0),(0,0),(0,1).
p401 actual signed2² image{1,2,4,8,16} pays the quotient lift; p2521 uses
u2,v29,k11 without allocating the11 atom. Finite harnesses also evaluated
both branches at the same two composite-T controls; auxiliary legal TypeI
allocations are replay facts, not new inputs, discovery or campaign yield.

| Context | Logical work | Observed elapsed | Attribution |
|---|---:|---:|---|
| A |142570|7.719ms|separate ephemeral Node primary |
| B |81191|30ms|final separate stdlib Python replay; prior29ms |
| S |143115|7.71ms|separate skeptical arithmetic |
| Main |79965|7.061ms|separate ephemeral Node check |

These counters use different algorithms/instrumentation, not equal-work speed
scores or CPU attestations. Each finite envelope is60s/5Mlogical work/64KiB;
cooperative local checks are not hard interpreter preemption.

Main scientific record:
`9e791e408004d797f23e179497545b3d0d982b73fb006051fae2d0679994378e`.
B retained full executable Python in its report; Main independently extracted
and reran it with env-i/PATH=/usr/bin:/bin/python3-I-S-B: COMPLETE,81191work,
31ms, actual11608bytes equal declared bytes. Scientific digest
`96538c53b9584bfbc31b4353212074f8ae9d6b6baf3fb53d787a975469e01354`;
source (terminating LF included)
`c1d33f1fbed52bb8a33df3de4fd8322100bcc07b82b1a7dde51bfc9a2876e6e8`.
Records have different schemas; semantic agreement does not imply equal hashes.
Main also actually replayed all three tighter-envelope injections on that
retained source: work1→WORK_LIMIT at1, time0→TIME_LIMIT at0,
output100→FINAL_ENVELOPE_LIMIT at81191, all exit1/INCOMPLETE. None admits
a completed scientific result after a resource stop.

Fault history is retained: B's first harness wrongly asserted pmod11=2 in
both distinct families; corrected second-family10 only, without input tuning.
S first encountered shell newline syntax, then negative JS remainder caused
a bounded5M stop; corrected exponent normalization, no cap/input/math change.
Its later consumer parser syntax error/broken pipe was corrected before the
fresh successful byte-pinned replay; no failed consumer counted as acceptance.
Main's clean-env Python replay emitted Darwin temp-path fallback warning;
stdout was COMPLETE and bytes matched. These are harness faults, not theorem
counterexamples. No failed run was counted as a passing independent replay.

## Preservation / technical scope

Fresh Main installed-runner commands:

```sh
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js .
```

Both exit0, no dependency installation. Unit/integration/full827 suite was
NOT rerun in this docs-only slice. TIP043's827/827 in107files is historical.
No Next build, auth/provider/DB/UI/browser E2E acceptance is claimed.

Main hash checked54 prior source/test pins from TIP036–043, all unchanged;
all85 old current-manifest lines remain, all86 current paths hash-match.
Current SHA256:
`23550c673a88c96046a259fe309d8c3c2046c0817629f4a375a7acee09395bf1`.
Founding manifest is exact HEAD bytes, SHA256
`2a2dafa24464338de9c60091cd039ea2705537a670ec6b4e49a9b0a196f8c4b4`;
legacy archived names are not a fresh all-current-path founding verification.
Unrelated70 screenshot changes, untracked workspaceYAML/cache preserved.
No source/test/runtime/DB/Git/provider mutation.

All six new documents pass explicit trailing-whitespace/terminating-LF checks;
all five repository-local document references exist. Ten display blocks
(six research,four A completion) parse with installed KaTeX,
throwOnError=true,trust=false. Tracked manifest/handoff whitespace is checked
at final closure. No claim these markdown formulas render in the product UI.

S independently accepts5/5 within scope; no blocking proof/source/arithmetic
defect. Final note's added replay counts/resource/health paragraph is an
evidence-only update, not a changed hypothesis or mathematical predicate.

## Deferred gates and justified next move

Six broader gates: universal root existence, novelty, formal/external review,
governed agent/tool/UI admission, uncontaminated equal-budget live models,
and product E2E. The next mathematical question is actual divisor realization
for a root-bound TypeI norm pair or a paid TypeII target correction. A free
quadratic residue root, primitive-root span or many unrelated small primes
is insufficient. A rigorous mechanism limitation is useful research direction
control, not the requested original-problem breakthrough.
