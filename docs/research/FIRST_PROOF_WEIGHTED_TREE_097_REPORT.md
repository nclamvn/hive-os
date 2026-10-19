# TIP097 — a complete weighted-tree result, with an explicit source boundary

Root: FIRST_PROOF_WEIGHTED_TREE_097. Mode: public mathematical reconstruction.
Start 2026-10-10 07:27:53 UTC; hard stop08:57:53 UTC.
Final mathematical disposition: SOURCE_ASSISTED_FULL_WRITTEN_PROOF.
Math/tool checkpoint 2026-10-10 07:36:18 UTC (8min25s); report packaging/checks
finished07:37:44UTC, total9min51s inside the90min ceiling.
The ceiling is an upper bound, not a required burn time. Original independent
first-pass expectation was not met; this is not complete proof of method advantage.

## What was actually achieved

The requested universal implication has a full argument below, including its key
counting lemma. A constructive rule also follows: choose a weight1 vertex if one
exists; otherwise choose the unique bad vertex. No decomposition search is needed
to make that choice once the hypotheses have been established.

This is NOT a fresh independent AI solution: Main's first attempt was incomplete,
and its stronger unconditional bad-root claim was false. It was saved in
`artifacts/research/tip097/FIRST_ATTEMPT.md` before reading the published solution.
The final proof uses its source's branch-dual strategy. The incidence-matrix
derivation below replaces its cut/flow projection treatment by elementary linear
algebra; this is an explanatory reconstruction, not a novelty claim.

Problem source: [First Proof second-batch prob-006](https://github.com/1stproof/batch-2/blob/main/batch-2-raw-outputs/Batch2Problems/problems.json).
Published solution by Joshua Evan Greene and Duncan McCoy:
[human-solution.tex](https://github.com/1stproof/batch-2/blob/main/batch-2-human-solution/problem-06/human-solution.tex).
Read TeX, not the PDF. Git blob read and independently rehashed:
`a8a74da284b5c0b53a65093eebc7ad8dc9fad890` (25827 source bytes).
The URL's main branch can change; the blob identifies the actual version inspected.
The initial source-selection pass exposed unrelated Epoch sample solutions;
they were not this target. This was not a hidden benchmark or official submission.

## The theorem and the constructive output

Let Q have positive integer diagonal weights, off-diagonal -1 on the edges of a
finite tree, and zero elsewhere. Assume Q is positive definite, and exactly one
vertex r satisfies w(r)<d(r). Then some basis vector e_u is irreducible: it cannot
equal a+b with nonzero integer a,b and a^TQb>=0.

In fact:

\[
\boxed{\text{if every weight is at least 2, }e_r\text{ is irreducible}.}
\]

Positive definiteness already implies each integer weight is positive. If a
weight is1, that basis vector is irreducible: nonzero integral vectors have
positive integer squared norms, so a nonnegative-product splitting would give
\(1=\|a\|^2+\|b\|^2+2a\cdot b\ge2\). Thus it remains to prove the boxed case.

### 1. A self-contained forest identity

Consider a weighted branch tree S with no bad vertices. Mark s with
\(w(s)>d_S(s)\). Form a multigraph G by adding a ground vertex0 and
\(\delta_i=w(i)-d_S(i)\) distinguishable ground edges at vertex i.
At least one ground edge exists, so G is connected. Fix a particular edge
\(e=(s,0)\). Let C be its oriented incidence matrix with the ground column removed.
The branch matrix is \(B=C^TC\), hence positive definite.

For each spanning two-component forest F of G, let A_F be its component not
containing0. Let \(\tau\) count spanning trees. For every real column z,

\[
\boxed{z^TB^{-1}z={1\over\tau}
 \sum_F\left(\sum_{i\in A_F}z_i\right)^2.}\tag{1}
\]

Here is a direct derivation, rather than an unchecked projection citation.
Cauchy–Binet gives
\(\det(C^TC)=\sum_{|R|=n}\det(C_R)^2=\tau\): an n-edge reduced incidence
minor is zero unless those edges are a spanning tree, and then its determinant
is±1. The latter follows by deleting a leaf and its incident edge repeatedly.
For \(t\ge0\), append row \(\sqrt t\,z^T\) to C. Its Gram determinant is

\[
\det(B+tzz^T)=\det B(1+t z^TB^{-1}z).
\]

Its coefficient of t under Cauchy–Binet is
\(\sum_{|F|=n-1}\det([C_F;z^T])^2\).
Only spanning two-component forests have rank n−1. For such a forest, the
cofactor vector of C_F is±the indicator of A_F: its kernel is spanned by that
indicator, and deleting any column in A_F gives determinant±1 by leaf elimination
on its two trees. Thus the augmented determinant is
\(\pm\sum_{i\in A_F}z_i\). Comparing coefficients proves(1), including parallel
edge multiplicities and zero contributions from cyclic edge subsets.

### 2. Why a marked dual element is the shortest relevant one

The branch lattice is \(\mathbb Z^n\) with Gram matrix B. Its dual consists of
\(B^{-1}z\) for integer z. Write

\[
\lambda=B^{-1}e_s,\qquad g=\|\lambda\|_B^2=(B^{-1})_{ss}.
\]

Specializing(1) to z=e_s gives

\[
g={\tau_e\over\tau},\qquad 0<g\le1,\tag{2}
\]

because a forest separates s from0 exactly when adjoining the fixed edge e
gives a spanning tree containing e. Distinct parallel copies remain distinct.

For any integer z with z_s≠0, extend it by \(z_0=-\sum_{i\ne0}z_i\).
For a spanning tree R containing e, the components H_j of R−s satisfy
\(\sum_j z(H_j)=-z_s\ne0\). Select a component of nonzero sum and delete its
unique edge to s. The resulting forest has nonzero integer cut sum in(1).
This assignment is injective:

- if e is absent from the resulting forest, restore e to recover R;
- if e is present, s and0 lie in the same component. The other component H is
  connected inside the original tree S. There is at most one edge from s to H,
  since two such edges and the path in H would create a cycle in S. That edge
  restores R uniquely.

Hence at least \(\tau_e\) forest terms in(1) are nonzero integers squared. Therefore

\[
z_s\ne0\quad\Longrightarrow\quad z^TB^{-1}z\ge g.\tag{3}
\]

If \(\lambda=p+q\) with nonzero dual vectors, at least one has nonzero pairing
with s since \(\lambda\cdot s=1\). By(3) its norm is at least g, while the
other has positive norm. A nonnegative mutual product would contradict
\(\|\lambda\|^2=g\). Thus λ is irreducible in the dual lattice.

If λ is integral in the branch lattice, g is a positive integer. Equation(2)
forces g=1. Then every spanning tree of G contains e, so e is a bridge.
Because S is connected, any second ground edge would make a cycle containing e
via the unique S-path between their endpoints. Consequently e is the sole
ground edge: δ_s=1 and every other δ_i=0. If S is a singleton, w(s)=1.
Otherwise S has a leaf u≠s and w(u)=d_S(u)=1. That vertex remains a leaf when
the branch is reattached to r. Thus an integral λ forces a weight1 vertex.

### 3. Joining all branches, without a missing global implication

Delete r from T. Its branches S_i have matrices B_i, attachment vertices s_i
and dual vectors \(\lambda_i=B_i^{-1}e_{s_i}\). Every vertex in a branch is good;
at s_i the branch degree is one less than its original degree. Section2 applies
to every branch. Embedded branch spaces are mutually orthogonal. Define

\[
h=e_r+\sum_i\lambda_i,\qquad
\gamma=\|h\|^2=w(r)-\sum_i g_i>0.
\]

h is orthogonal to all branch spaces. Its norm is strictly positive by positive
definiteness; this is the usual Schur-complement calculation, not a new assumption.

Suppose e_r=a+b is a proposed nonnegative-product decomposition and let k be
the integer coefficient of e_r in a. Its orthogonal components are

\[
a=k h+\sum_i c_i,\quad b=(1-k)h+\sum_i d_i,\quad
c_i=a_i-k\lambda_i,\quad d_i=b_i-(1-k)\lambda_i.
\]

The branch coordinates a_i,b_i are integer vectors. Thus c_i,d_i are in their
branch dual lattices, and \(c_i+d_i=-\lambda_i\). Dual irreducibility yields
\(c_i\cdot d_i\le0\), with equality only if one is zero. Meanwhile
\(\gamma k(1-k)\le0\) because k is an integer. Therefore

\[
0\le a\cdot b=\gamma k(1-k)+\sum_i c_i\cdot d_i\le0.
\]

Every term is zero: k∈{0,1}, and each c_i is either0 or−λ_i. Exchange a,b so
k=0. Since a≠0, at least one c_i=−λ_i is nonzero; its ordinary branch coordinates
are integral because a is integral. Section2 then forces a weight1 vertex,
contrary to the boxed case's assumption. Hence no such splitting exists. This
completes the universal proof and the constructive selection rule.

## What the tool proves — and what it does not

The new independent stdlib checker uses exact rational arithmetic. For a fixed
instance and vertex u it checks the COMPLETE decomposition box, not only0–1 subsets.
Indeed, set \(t=2a-e_u\). Then

\[
t^TQt=w(u)-4a^TQ(e_u-a),\qquad
t_i^2\le w(u)(Q^{-1})_{ii}.
\]

The second inequality is Cauchy–Schwarz in the Q-inner product. Exact inverse
diagonals supply a finite integer box containing every possible decomposition.
Every point is tested or the entire instance is refused. There is no truncated
search labeled complete. Positive definiteness is checked via exact LDL and
independent leading minors. This certifies the listed finite instances ONLY;
the universal proof is the argument above, not these runs.

Main inspected the source before final acceptance: correct affine shift, integer
parity bounds, nonzero summands, exact products, complete boxes, refusal before
oversized search, and explicit 55-second CLI timeout. This is not formal assurance
of Python, the operating system, or the universal argument.

## Failed approaches retained and method value

The star [2,1,3,3], root first, has root Schur complement1/3 and root splitting
\(e_0=(e_0+e_1)+(-e_1)\) with product0 and both norms1. The unconditional
bad-root shortcut is false, although its norm1 leaf solves the actual problem.
The checker independently replays this exact failure. An admissible chain
[2,1,3] also has a decomposition of e_2 involving coordinates(−1,−2,0), showing
why binary subset testing is insufficient. Main's initial branch inequality was
left OPEN; the final dual lemma supplies its missing justification instead of
using a continuous bound that did not imply the needed integer inequality.

The useful output is a full source-assisted proof, explicit failed-route witness,
and a reusable finite checker with a proven complete-search bound. The structural
rule makes repeated instance selection inexpensive: a scan for weight1 or the
bad vertex, after premise checking, replaces exponential decomposition search.
No product performance measurement or new theorem/algorithm originality follows.

We did NOT run a fair independent solver A/B on this problem. No causal advantage
over a strong LLM, token/cost savings, human-effort reduction or investment payoff
has been established. TIP096's tie remains unchanged. A fallible written proof
and exact finite replays are stronger artifacts than an unsupported confident
answer, but that is not by itself an experimental superiority result.

## Acceptance, actual resources and stop

Main ran the final source directly, rather than accepting the Builder's report:

1. Invocation7: `python3 -B artifacts/research/tip097/check_weighted_tree.py --self-test`
   exit0, reported0.008814875s,26 distinct controls PASS. Ten decomposition examples
   (six root-admissible) exhaust452 box points; ten refusal controls and one direct
   identity; four forest graphs and one genuine source-cycle injection collision.
   Internal66 scalar identities and140 cut/recovery evaluations are subchecks,
   not extra independent controls. Four graphs are finite tests, not universal proof.
2. Invocation8: same script `--candidate-sample`, exit0, reported0.260063750s.
   187 labeled inputs:160 PD/root-admissible fully checked,27 non-PD refusals;
   7438 complete box points, zero final-selector contradictions. This fixed family
   is NOT all trees through any size; overlaps/relabelings are not independent evidence.

Global invocation allowance8/8 consumed, including one earlier fixture refusal.
No ninth rerun. Original complete Builder outputs remain unchanged. Final long
stdout was truncated by tool display; Main retained an explicitly labeled compact
transcription in `artifacts/research/tip097/MAIN_VERIFICATION.json`, not fictitious
full raw stdout. Main inspected the actual assertions, mathematical bounds and
visible final status/counters. Scoped tracked-document whitespace check PASS.
Syntax was exercised by both successful actual-source runs; no app build/typecheck
was needed for this standalone stdlib tool, and none is claimed.
Final compact JSON parsed with jq and expected counters checked PASS; new owned
notes/script trailing-whitespace scan found no matches. These are technical
format checks, not additional mathematical controls.

| Commitment | Actual disposition |
|---|---|
| R1 first complete proof before source | PARTIAL: full initial attempt retained, but it was mathematically incomplete and contained a false stronger route. No autonomous first-pass proof. |
| R2 universal root implication | Full written proof reconstructed WITH source assistance; not human/formally certified. |
| R3 independent finite checker and source comparison | Implemented, inspected, actually run within envelope; finite scope only. |
| R4 integrated honest report | Complete, including failure/exposure/unknowns and unachieved advantage. |

Coverage:3/4 obligations complete, R1 partial; do not turn source assistance into
a first-pass success. Overall PARTIAL_FOR_AUTONOMOUS_SOLUTION_AND_VALUE_CLAIM;
SOURCE_ASSISTED_FULL_WRITTEN_PROOF_AND_FINITE_TOOL_COMPLETE. Source comparison
matches the branch-dual/counting route and all root premises. The alternative
matrix derivation is fully written above; external primitivity/flow citations
are not needed in that derivation. No independent mathematical referee was run.

One implementation Builder, Main mathematical work; no default swarm/critic.
Actual model backend, tokens/compute/cache/subscription cost and human effort are
UNKNOWN/unmeasured. No manually called paid API. No real HIVE UI/worker E2E was run.
No product/UI/auth/DB/runtime changes, build/install/Next.js output/Git/deploy/Docker/
project copy. Public network reads only. No scratch/distDir created or removal.
Existing unrelated dirty files and predecessor history are preserved. TIP096's
charter digest remained86d21f29b48881d9983d7986f37e32c8a07dea2dc6a2d2da0997415b62745f37.
Checker digestf33edcfc4380ba636e3eb2e6b76be4236893bae9a31f525bebcf2e415301155d;
first attemptbf7022e04646096e0c6e9122ac742b6e692b212223158a22521c7d3eb6772f77.

STOP this campaign. The universal written result is substantive, but scientific
flexibility/source use must not wash out the unmet first-pass objective. A future
fair comparison needs a newly authorized task and matched independent primary
contexts before solution exposure; it cannot be retroactively inferred here.
No new problem, resource allowance, live grant, UI integration or discovery is
automatically authorized by this report. The irreversible source exposure means
spending the remaining90min would not repair this experiment's causal limitation.
