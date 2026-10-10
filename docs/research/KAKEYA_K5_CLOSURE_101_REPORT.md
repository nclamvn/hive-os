# TIP101 — Complete K5 stationary certificate

Status: CLOSED_COMPUTER_ASSISTED_FINITE_MODEL; external mathematical review pending.
Root: the translated five-triangle model C_T(5)=14/61, PUBLIC_DISCOVERY.
This is not the unrestricted planar or higher-dimensional Kakeya conjecture.
Owner-routed start2026-10-10 09:13:23UTC; unchanged hardstop10:13:23UTC.
TIP098 local result, TIP099 incomplete cover and TIP100 reductions are preserved.

## Exact statement and reduction

For j=1,...,5 let

    T_j(x_j)=conv{(x_j,0),(x_j+1/5,0),(x_j+j/5,1)}.

The computer-assisted theorem is that every real offset vector has union area
>=14/61, using the written analytic proofs here/TIP100 and replayed certificates.
The known offsets (79/305,47/305,10/61,12/305,0) attain14/61, checked by both
unchanged TIP098 exact area algorithms. They provide the upper bound, not the
lower-bound proof or a blind test.

TIP100's all-offset missing-edge theorem gives area>=17/74 whenever any pair
intersection has zero area, including touching. Its analytic proof and60 rational
triple certificates are recorded in KAKEYA_RESIDUAL_STRUCTURAL_100_REPORT.md.
Since17/74-14/61=1/4514, a global minimum lies in strict K5. Fix x5=0: the closed
pair polytope is compact, its boundary is excluded, and continuity attains a
minimum. No assumption of convexity or positive-semidefinite area Hessians is used.

Translate apices to A1=0, where A_j=5x_j+j before translation. Strict K5 is exactly

    0<A_j-A_i<j-i+1,  i<j.

In particular 0<A2<A3<A4<A5<5. Write v=A/A5, so v1=0<v2<v3<v4<v5=1.
This is the full feasible shape space, not the source-witness scaling ray.

## Why internal faces require full, not restricted, stationarity

At t=1-y the scaled horizontal intervals are

    I_j(A,t)=[A_j-jt,A_j-(j-1)t], 0<=t<=1.

Area is one fifth of the integral of their union length. For fixed strict K5 A,
the ten endpoint values are distinct except at finitely many t. Nonparallel lines
meet at most once. The only potentially persistently coincident endpoint lines
belong to adjacent labels and require equal apices, excluded by strict ordering.
The t=0 own-apex coincidences have measure zero.

For all other t the endpoint order is locally constant, and union length is
affine in the four free apices. Its derivative coefficients are uniformly bounded:
changing an interval's translation by delta changes symmetric-difference length
by at most2|delta|. Dominated convergence therefore differentiates the integral.
For A_n->A, endpoint order converges at almost every t, so the same domination
also proves continuity of the gradient. Area is C1 throughout strict K5, including
triple-concurrence and bottom-envelope walls.

Thus every global minimum has ZERO FULL FOUR-VARIABLE GRADIENT. On any incident
open polynomial chamber the polynomial and its gradient extend to the boundary
and agree with area and its gradient. Recursive minimization of each chamber face
is unnecessary here. This replaces TIP099's expensive all-face enumeration with
a proved regularity argument; it does not simply omit faces.

## Exact coarse geometry and the cone polynomial

Consider the ten lines A_j-jt and A_j-(j-1)t on 0<=t<=A5. Their slopes are fixed.
Parameter-dependent combinatorial changes in the clipped line arrangement occur
only at triple concurrence, parallel coincidence, or a crossing on t=0/A5.
At t=0, strict apex ordering excludes distinct-label coincidences. At t=A5,
0<A_j-A_i<A5 makes every possible nonzero integer-multiple crossing condition
impossible; adjacent parallel coincidence would require A_i=A_j. Structural
same-triangle apex coincidences are fixed, not extra parameter walls.

Therefore homogeneous triple/parallel walls suffice. After A5=1, their52 primitive
normals include42 cutting the open ordered simplex;10 do not cut its interior.
Unrelated intersection-height swaps do not change boundary incidence. Within a
coarse chamber the polygon boundary vertices are affine in A, and shoelace area
is quadratic. Continuity extends the polynomial to its closure.

For t>=A5 the intervals are connected with length5t-A5. Define

    Q(A)=integral_0^A5 union_length(I_j(A,t))dt - (3/2)A5^2.

Q is a homogeneous quadratic on each coarse shape chamber. Producer integration
uses a generic exact fine subchamber; polynomial uniqueness extends the resulting
15 coefficients to the whole coarse chamber. Generic perturbation must preserve
all coarse signs and avoid distinct fine event-height equalities. Finite evaluation
checks alone are not the degree theorem.

The upper hull of A_j-jt has a decreasing label chain; the lower hull has an
increasing label chain. Their combinatorics change only on the same triple walls.
At the actual bottom t=1 let a maximize A_j-j and b minimize it. Define tails

    U(A)=integral_1^A5 max_j[A_j-(j-1)t]dt,
    V(A)=integral_1^A5 max_j[A5-A_j-(5-j)t]dt

when A5>1, with both zero for A5<=1. For a feasible bottom label, following its
envelope chain from t=1 to its zero terminal line yields the exact quadratic tail.
Strict K5 ensures connected union from t=1 onward. Hence

    5*area = 5/2 - A5 + Q(A) - U(A) - V(A).

All Cartesian upper/lower chain pairs a<b are enumerated, NOT only the interleaved
phases seen at a cell center. Crossings between unrelated upper/lower switches can
change their order without changing coarse shape signs. Cartesian enumeration is
essential to avoid that omission. Bottom-label feasibility inequalities exclude
nonexistent Cartesian combinations without deleting an admissible minimizer.

TIP100 proves every global minimum has every bottom-max label smaller than every
bottom-min label. Briefly, scale variation gives area=half actual bottom width.
Immediately to the right in scale, tied maxima choose the largest label and tied
minima the smallest. If a>b, d=v_a-v_b>0 and radial derivative zero forces negative
quadratic coefficient, contradicting local minimality. Thus a<b even at ties.

## Complete shape coverage, including boundaries

The saved native producer contains2632 cells and1527 distinct rational vertices
for all42 walls. The independent checker constructs ACTUAL convex hull facets
from vertex triples, rather than assuming producer edge or facet completeness.
Every hull vertex satisfies the simplex and its sign constraints. Distinct sign
words have disjoint interiors. Exact volumes of all2632 inner hulls sum to1/6,
the volume of the ordered simplex, with13182 actual facets.

Their finite union is closed. If it omitted a simplex point, its relative-open
complement would contain interior points and have positive volume, contradicting
the volume equality. Thus it covers the ENTIRE simplex, including all lower-
dimensional boundaries. The simplex collision boundary itself cannot minimize
because TIP100 already excludes non-strict K5. Internal wall faces are handled by
the C1/full-gradient argument above, not by a volume-fraction success claim.

Durable replay: artifacts/research/tip101/MAIN_FULL_SHAPE_VERIFICATION.json.
The original full volume check printed an overlarge stdout result and was
truncated; its per-cell ledger was not persisted. Main invocation6 rechecks the
SAVED cover and persists every rational cell volume. No cover generation was
repeated. This packaging error is retained rather than hidden.

## Stationary systems and the accepted finite result

For each exact quadratic p, solve H*z=-linear over rational numbers. Inconsistent
systems have no stationary point. For a consistent singular system, all solutions
p0+ker(H) have identical value, since H*p0=-linear. A value>=14/61 is safe whether
or not the affine solution set meets the chamber. A smaller value must be shown
infeasible against closed shape signs and bottom-extremum inequalities together
with strict K5 constraints. A feasible smaller point must be checked by BOTH
TIP098 area paths before it can refute the target.

Full producer result, Main invocation5,53.381352958s:

| Classification | Cases |
|---|---:|
| Stationary value>=14/61 |3998|
| Below-target stationary set infeasible |4530|
| Inconsistent stationary equations |130|
| TOTAL |8658|

There are667 distinct quadratics,2632 cells and94 below-target singular systems.
No singular active-vertex enumeration was needed. Independent acceptance proved
an invariant CLOSED inequality with constant -2 for every one of these94 systems:
its normal annihilates the full stationary nullspace, so no point on the entire
stationary affine set can satisfy that inequality. This is a direct exact proof
of infeasibility, not a sample or a producer status label. No smaller witness exists
among the necessary stationary cases.

The completed table, independent arithmetic/derivation/inventory acceptance and
preceding proofs close the finite root. Suppose a smaller global minimum existed.
The boundary-gap/compactness theorem puts it in strict K5; its shape lies in the
closure of a verified cell. Choose an incident bottom phase. Its extrema have a<b
by the scale argument, so its polynomial is included in the Cartesian inventory.
C1 regularity forces its full gradient to vanish. The table either proves its
stationary value>=14/61 or excludes its stationary affine set, a contradiction.
Thus all real offsets have area>=14/61. The exact source witness attains equality,
proving C_T(5)=14/61 in this finite model.

## Independent acceptance and technical health

Main invocation7 independently verified the entire saved certificate in
52.986041791s, without importing the producer's stationary or polynomial solver.
It regenerated walls/envelopes, rederived ALL2632 cone polynomials by endpoint
coverage-count integration, and reconstructed all8658 area quadratics and their
stationary systems. Complete nullspace rank and exact stationary values were
checked. Counts:4436 unique below-target points infeasible,94 singular below-
target affine sets infeasible by constant contradictions,3998 safe values
(including60 singular systems),130 inconsistent systems;667 distinct quadratics.
Every cell and every Cartesian a<b pair occurs exactly once. No UNRESOLVED case.
Durable output: MAIN_INDEPENDENT_STATIONARY_VERIFICATION.json, with all94
contradiction records. This is separate algorithmic replay, NOT an independent
human referee or a second mathematical-solver agent's vote.

Main invocation8 checked the exact source witness with both unchanged area paths,
certificate accounting and six Python AST parses in0.019905s. Fresh Main scoped
engineering suite40/40 controls PASS0.686s (process0.843s). Builder's added16
acceptance controls also passed0.531s; reruns are not additional distinct tests.
Native compilation: one successful compile; no Next/application build or type-
checking claim is relevant to this scoped stdlib/native mathematical artifact.

Requirement coverage: R1/R2/R3 all3/3 discharged for this finite-model campaign.
Technical scenarios40PASS/0FAIL; mathematical cases8658closed/0open under the
written reduction. OVERALL: READY finite computer-assisted dossier, deferred
external mathematical review and novelty assessment. No failure is silently
deferred inside the finite certificate.

## Resource and preservation checkpoint

Main calls1-4 pre-interruption: wall inventory0.00948s;20-plane pilot and independent
volume0.6781s; single full cover plus original volume7.9794s;20-cell stationary
pilot0.423212s (intentional PARTIAL/PILOT_CELL_LIMIT_NOT_GLOBAL).
Call5 is the full stationary run above. Call6 is saved-cover volume replay7.649426s.
All eight Main mathematical calls now used. Including full independent replay,
final witness check and fresh Main development suite, measured computation below
125s, within600s total and180s per invocation. Stationary producer runs: one20cell
cost pilot and one full run; independent acceptance is replay, not a second search.
One successful native compile; Builder original24 distinct controls passed, own
validation below3s including the16 added controls;40 distinct controls overall.
No new grant, counter reset, random/grid search or scientific agent swarm.

Existing repository has many unrelated dirty files; they are preserved. No product,
UI, auth, DB, API, Git, deployment, installation, Next build, scratch project copy,
new distDir or Docker mutation. Only small scoped research files and append-only
checkpoints. Artifact bytes before binary cleanup12254755, below64MiB. Native
binary cleanup is recorded at terminal.

No Lean verification, external mathematical referee, authenticated HIVE E2E,
blind FrontierMath score, method-vs-LLM causal advantage or exhaustive novelty
search is claimed. The finite source-aware model is distinct from full Kakeya.
Source context: https://dualverse.ai/station/math/discretized-kakeya-needle/ .
The witness was public and known in advance; its discovery is not credited to HIVE.
The new output relative to TIP098-100 is universal optimality in THIS model rather
than a local minimum, finite random check or conditional scaling family.

## Reproduction and evidence fingerprints

The saved cover is sufficient; do not regenerate it just to verify this dossier:

    python3 -B artifacts/research/tip101/coverage_check.py artifacts/research/tip101/MAIN_FULL_SHAPE_COVER.json --out NEW_VOLUME.json --seconds 60
    python3 -B artifacts/research/tip101/acceptance_check.py artifacts/research/tip101/MAIN_FULL_SHAPE_COVER.json artifacts/research/tip101/MAIN_FULL_STATIONARY_CERTIFICATE.json --out NEW_ACCEPTANCE.json --seconds 180

These are reproduction instructions, not an automatically authorized next run.
No new campaign is active after closure. Generated binaries must be rebuilt from
retained source if tiny native controls are explicitly rerun; do not install tools.

SHA256 fingerprints (integrity identifiers, NOT substitutes for proof):

| Artifact | SHA256 |
|---|---|
|MAIN_FULL_SHAPE_COVER.json|3097a3df15e02f5d299811bc9edbaab453211fdffd1559aedfa50b7e40a78c4a|
|MAIN_FULL_SHAPE_VERIFICATION.json|53a9117c71a0645974249c18acde6efc7006603084ab2e20e82222eb16674fe2|
|MAIN_FULL_STATIONARY_CERTIFICATE.json|95d41c6565ccd683bab2376463b402fa3f7170b99bf3daa881c3b15b0878707c|
|MAIN_INDEPENDENT_STATIONARY_VERIFICATION.json|6b8468c50770066ba31075ac8741bce59529a1b0eaf99a5f87eafcd517b91fca|
|coverage.cpp|d4cb94198571c5d2970fe0d32190e9cb30c9cf785562ad1c527812d008912ef6|
|shape_walls.py|b7dc6f82542bbafe345ecae974fee72b89982845ceb4d066e7e9b8c57bb91ec5|
|stationary.py|be967dae8fb6df29681657824ca3802ca647b7d4ad1852a8fb02fabad70bd5d2|
|coverage_check.py|e8405e97671f20cda9dc82e0c836eb9fd5f4fac3d6b6f3e4ff4cad4bf2bd1ab3|
|acceptance_check.py|2e864c581397ee904efcc328f587fa833e52bc2ca4cb8594547fd161d016c801|

## Terminal — 2026-10-10 09:56:05UTC

Root CLOSED_COMPUTER_ASSISTED_FINITE_MODEL,42min42s from original campaign start,
including the disconnected-stream interruption; no wall-clock reset.8/8 Main
mathematical invocations consumed, compute below125s. No unfinished finite case.
External mathematical review/novelty/formalization remain outside this acceptance.
Promotion from candidate to closure follows the completed independent replay,
not test counts or fingerprints. Both intentionally partial pilots are preserved.

Removed ONLY the owned82,528-byte `artifacts/research/tip101/coverage_native` binary.
Its `coverage.cpp` source and complete evidence remain, recoverable by recompilation.
No user data or predecessor files deleted; no scratchproject/distDir/Docker cleanup
required. Two report/checkpoint patches had context mismatches and made no changes;
corrected patches applied. These were packaging issues, not mathematical failures.

STOP: campaign complete. Proposed next routing is external review of this finite
proof and literature/novelty assessment, not automatic n6/fullKakeya/LRC work,
another benchmark, UI changes or another agent campaign. No causal superiority
claim about HIVE versus one strong LLM has been measured here.
