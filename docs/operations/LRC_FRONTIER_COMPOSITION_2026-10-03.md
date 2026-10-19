# TIP-049 — unresolved frontier continuation

## Research purpose and boundary

The target is reliable progress on the retained Allikvere modular subproblem,
not more unconstrained execution. TIP-048 already checks the known union-bound
prune in Allikvere's [paper, section 4.3](https://arxiv.org/html/2609.02604v2).
TIP-049 changes bookkeeping and continuation, not that mathematical lemma.
It is neither a new theorem nor an external certification of the 14-runner LRC.

The immutable parent report is raw SHA-256
`40ad2047e804b4ea741d55869eb79c25f089de3951175bc612426bcd9b9772a1`,
content digest `97fa7dfa80beab4e03c2cc9264d5ab02eb3c8ac05b44d6fa8c6b9f73131d5cac`.
Its four FULL domains each contain 7^13 = 96,889,010,407 ordered digit tuples.
The ANCHORED domains overlap their corresponding FULL domains and stay intact;
they must not be added as unique new coverage.

## Exact composition argument

Let the already verified prefix tree partition a fixed domain D into established
leaves and unresolved leaves. Select distinct unresolved leaves V_1,...,V_m.
Prefix-tree validation proves these are disjoint subdomains. Derive the child
domain by fixing precisely the original prefix axes to their assigned singleton
digits, leaving every later axis and all source/coordinate/premise data unchanged.
Thus each child domain is equal to V_i, not merely a convenient subset.

Independently validate every child certificate and its exact domain cardinality.
Replacing V_i by that child's partition preserves a partition of D. Established
old leaves are not removed, and unselected unresolved leaves are not silently
dropped. No flattened combined certificate or larger original node limit is
needed: the composition proof links separately bounded certificates.

For each fixed parent, write C for classified tuples and U for unresolved tuples.
With child counts C_i and U_i, and |V_i| = C_i + U_i, the exact updates are:

    C_new = C_base + sum C_i
    U_new = U_base - sum |V_i| + sum U_i = U_base - sum C_i

Witness, conditional-GCD and checked grid/gcd-survivor counts are added separately.
COMPLETE is derived only from U_new = 0. A child COMPLETE certificate does not
make its parent COMPLETE unless every other unresolved region is also closed.
The lower-LRC12 premise remains unreplayed, including after any conditional-GCD
closure. A grid/gcd survivor is not exclusion of all continuous LRC times.

Child nodes retain the original thirteen-axis coordinate order. Their prefixes
are NOT appended to the target prefix. If a child unresolved prefix is shorter
than its fixed target prefix, its lifted domain uses the longer compatible prefix;
otherwise its own prefix already describes the original domain. Reconstructed
remaining-frontier cardinalities must sum exactly to U_new.

## Sealed routing experiment

The frozen TIP contract selects exactly two original unresolved leaves per FULL
row. The deepest, lexicographically smallest leaf is a closure-control job. The
largest-cardinality, lexicographically smallest distinct leaf is a strategic-mass
job. This balances a cheap continuation control with meaningful remaining mass.
The same eight jobs, order and old per-certificate limits are locked before BUILD.

A Builder ran a nonwriting feasibility computation during SCAN. This prior
exposure is disclosed: the retained continuation is not a blind benchmark.
Selection is still the deterministic policy above; no scope or resource tuning
after the outputs is allowed. Actual retained results require the new composition
checker and Main acceptance and are recorded separately below when available.

The local coordinator follows choose → execute trusted tool → independently
replay → compose → stop. This is a computational tool-agent loop, not a newly
launched HIVE LLM/provider campaign. It makes partial data usable as remaining
work without granting proof-success authority to an incomplete certificate.

## Resource and trust boundary

Original TIP-048 caps remain 20,000 nodes, 20 million work units, 10 seconds
observed checking time and 16 MiB per certificate. The separate TIP-049 packet
has 64 MiB and aggregate 30-second pure admission limits; independent wrapper
40 seconds/1 MiB stdout; retained report 128 MiB; entire collector 120 seconds.
These are cooperative observed deadlines, not hard synchronous JS preemption.
Any invalid or late result stops before successful retention; no missing job is
replaced by a fabricated result.

Independent Python executes only literal, hash-pinned local checker source
bytes, including the immutable TIP-048 arithmetic checker. Input JSON cannot
supply Python, paths, imports or executable fragments. Hashes and unsigned local
receipts rely on trusted local storage/collection; they are not externally signed
execution attestations, formal proofs or fully context-independent model review.

The global verdict remains NOT_ESTABLISHED. Full terminal closure, all level-1
orbits, other primes, lower-LRC12 replay and analytic prime-product coverage remain
open. Even complete closure of these four selected parents cannot settle all five
obligations. A subsequent mathematical attack should exploit structural information
in the remaining frontier and published methods, not merely repeat larger limits.

## Retained batch and independent Main checks

The explicit local collector completed in36279ms and retained5847016bytes in a
new `retained-frontier-report.json`. Raw SHA-256:
`a609fcf1fdd6c7d225568d1d830b6a09d069a8657fec7f5bc422f4d588865268`;
content digest `e1f1825b817e21b1672e64e025a1c4790d4e1518b94a9e1ab866cb757604f420`.
Plan digest `3c32a869d5dbc4f01c561229e3f73b0312c16e473a83ee9fd1288c2450783d40`
matches Main's pre-execution admission. All four closure controls are COMPLETE;
all four strategic-mass jobs and all four composed parents remain PARTIAL.

| Ordered parent | Old witness tuples | Verified increment | New witness tuples | Unresolved tuples | Frontier regions |
| --- | ---: | ---: | ---: | ---: | ---: |
| tight0 | 137649330 | 122506223 | 260155553 | 96628854854 | 62 |
| tight1 | 160170710 | 155968960 | 316139670 | 96572870737 | 55 |
| tight2 | 71093610 | 88949847 | 160043457 | 96728966950 | 64 |
| gw0 | 95497374 | 123548257 | 219045631 | 96669964776 | 54 |

All new classified labels are grid-witness regions; conditional-GCD and checked
survivor counts remain zero in these FULL compositions. More frontier regions
means a finer exact remaining partition, not more remaining tuple mass. The
increment490973287 sums row-domain assignments, not unique velocities, unit-orbit
classes, global theorem coverage or mathematical novelty. Most of every FULL
domain is still unresolved. ANCHORED artifacts and their conditional labels are
unchanged and are not added to these counts.

Main reran the actual pinned Python composition over all8 base and8 child
certificates and matched exact summary/output digest. A separately written
diagnostic reconstructed the remaining prefix regions and checked all6823 pairs
for disjointness, exact count conservation and frontier identity. Explicit sets
of folded grid times independently reconstructed all10 closure-control bound
leaves. Four actual-packet certificate/evidence/job/plan/packet-rehashed defects
(duplicate replacement, undeclared narrowing, cross-parent root and impossible
cover bound) were refused by both TypeScript and Python. These are development
acceptance controls, not a blind benchmark or external attestation.

### Proposed next structural route, not additional retained coverage

Allikvere's paper already discusses unit orbits (Remark 2.3). The following
specialization is an elementary derived routing observation, not a novelty claim.
For p=199, parent level 2 and target level 14, write H=398 and M=2786=7H.
The six units s=1+Ht for t in {0,2,3,4,5,6} fix every residue modulo H.
On a lift v_i=r_i+H d_i they act in the same thirteen coordinates by

    d'_i = (1-t)d_i + t r_i (mod 7).

This is a bijection of each complete seven-digit axis because 1-t is nonzero
modulo7. Multiplication by s permutes grid times and preserves the bad predicate:
bad(sv,j)=bad(v,sj), with both products interpreted modulo M. Consequently it
preserves grid-witness existence; as s is coprime to14 it also preserves every
divisor-of14 gcd condition. Folding j with M-j is compatible with the action.

The digit d_i congruent to r_i modulo7 is a fixed point; equivalently, the lifted
coordinate is divisible by7 since H is congruent to -1 modulo7. The other six
digits form one orbit. This gives a reasoned routing distinction between the
fixed, divisor-bearing slice and the six interchangeable nonfixed first-axis
slices, instead of treating all equal-sized tasks as mathematically equivalent.
It does NOT normalize away repeated coordinates or alter the frozen eight jobs.

Main independently checked all6 folded-time permutations, all2184 digit-axis
identities/bijections and6084624 exact bad-predicate identities over the four
retained ordered parents. This is a diagnostic, not a transport certificate or
new retained classification. Transporting COVER_BOUND leaves requires a new
sealed checker and exact union/overlap accounting: transformed proven regions
can overlap old regions or one another. No factor-six multiplier is admitted.
That certificate-backed reuse is a promising next experiment before allocating
more brute-force work, and can be generalized to suitable coprime lift factors.
