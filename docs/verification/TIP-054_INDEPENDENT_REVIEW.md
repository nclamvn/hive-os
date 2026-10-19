# TIP-054 independent universal shape / geometry / flag audit

Status: PASS_WITH_SCOPE_LIMITS. Universal written mathematics, pure consumer,
isolated fresh replay, adversarial rehashing and retained UI semantics reviewed.
No consequential open finding. This is scoped reproduction acceptance, not
closure of full LRC14/15 or a claim of novel research.

Read sealed TIP-054, AGENTS/current durable handoff and primary
[Allikvere v2 §§3.1, 3.5, 3.6](https://arxiv.org/html/2609.02604v2).
No author/archive executable, model campaign or database was invoked. This is
a separately instructed same-model mathematical review, not external academic
acceptance or proof-assistant verification.

## Universal shape argument: reviewed, not inferred from samples

Normalize a positive simplex point by its maximum, obtaining positive ui<=1
with some ui=1. Scale cancels from R: R_n²=n²/H. Every a(ui)>=1 and the sum
of w has a term w(1)=1/2. Thus H>=a(ui)/2 tends to infinity as any coordinate
tends to zero, while H is continuous on each of the finitely many faces where
some coordinate equals one. This proves a minimum exists away from zero.

Varying an interior coordinate leaves another fixed maximal coordinate at one.
Its C=sum of the other w values is strictly positive and <=(n-1)/2, because
w increases from zero to1/2 on (0,1]. The source derivative identity is correct:
beta=(n-1)(C-1)u²-C(n-2)u+C and the sign of phi' is minus beta.

- 0<C<1: beta strictly decreases on u>0, starts positive and is negative
  at the smaller D root alpha, so has exactly one positive root in (0,alpha).
- C=1: beta is linear, with positive root1/(n-2) in (0,alpha).
- 1<C<=(n-1)/2: beta is convex, beta0>0, beta(alpha)<0 and beta1<=0.
  There are two roots; the first lies before alpha and the second is >=1.
  At the upper C endpoint the second is exactly1, outside the open domain.
  Thus every interior minimizer coordinate lies at the same type of critical
  point in (0,alpha); no C=1 or endpoint case is omitted.

At a critical point C*D=(n-1)u² and (n-1)q+D=n(1+u), so
f(u)=qD/[n u²(1+u)]=1/A with the SAME A=sum w for all coordinates. Division is
legal because u<alpha gives D>0. Deriving the numerator of f' independently
gives -n*u*P_n with coefficient vectors:

- n13: [2,-6,-18,-46,24,12], twice the source's P13.
- n14: [2,-7,-20,-50,26,13].

Dropping the positive terms and bounding negative powers at U=.103/.1 gives
strict lower bounds570386279/500000000 and21/20 respectively. Hence f is
strictly decreasing on the whole relevant interval, not just tested points,
and all interior coordinates of any minimizer share one value t.

The derivative of a has sign -D. D has two distinct roots in (0,1), so a first
decreases to alpha, increases to a local maximum, then decreases to a1=2.
Independently checked rational brackets for alpha are (.102,.103) and(.092,.093).
The exact comparisons q(L)^n>(8/5)^n*U² prove a(alpha)>8/5. Therefore a>8/5
on its FULL domain, not only at alpha controls.

For k>=2 maximal coordinates, H>target follows from Bk=(k/2)2^k(8/5)^(n-k).
The ratio B(k+1)/Bk=5(k+1)/(4k)>1 covers every integer k2..n, including the
all-ones case. At k2, independent exact comparisons exceed targets
6760000/10201 (n13) and784 (n14). Full branch count is12+13=25.

For k1, the remaining coordinates equal t in (0,alpha). Independent algebra
factors the logarithmic-derivative numerator as
2(n-1)(1-t)*[-1+(n-5)t+(2n-5)t²+(n-1)(2n-3)t³]. The prefactor is positive;
the cubic is strictly increasing on the positive axis. Its sole positive root
is bracketed by .0849/.0850 (n13) and .0782/.0783 (n14), both below alpha.
Increasing numerator factors at L and the denominator at U give a strict lower
bound on the minimum H. The rational comparisons raised to powers13 and7,
denominator exponents24 and13, respectively, independently pass. Powers are
applied to positive quantities, preserving order. Thus R13<101/200 and R14<1/2
are universal sublemma conclusions; these do not require lower LRC assumptions.

## Geometry and conditional composition

The section of the crosspolytope by v-perp has no original vertex when every
vi>0. A section vertex must intersect an edge: if its smallest containing
original face had dimension>=2, cutting by one hyperplane would leave a
positive-dimensional local section and it would not be a section vertex.
Same-sign edges miss the hyperplane; all opposite-sign pair edges yield the
listed ±(vj ei-vi ej)/(vi+vj). This is a complete universal vertex description,
not a finite list of sample velocities.

At EVERY such vertex the ellipsoid support inequality is exactly equivalent to
(u+v)²-q(u)v²-q(v)u²=2uv(1-u)(1-v)>=0 on the normalized positive box. Convexity
extends it to the entire section; support functions then prove E subset D.
An independent negative control u2,v1/2 makes that difference negative, showing
why unnormalized coordinates cannot use the box assertion.

For primitive integer v, projected Z^n is the dual of the integral lattice in
v-perp. The latter has covolume ||v||: a primitive integral basis together with
a Bezout vector of dot product1 has determinant1 and perpendicular height
1/||v||. Duality gives projected Euclidean covolume1/||v||. This is written
lattice reasoning, not certification by a few determinant controls.

Positive Q makes the Schur complement legal. In an orthonormal H basis U,
det(U^T Q U)=detQ*(vtilde^T Q^-1 vtilde). Passing to the ellipsoid norm multiplies
Euclidean covolume by det(U^T Q U)^(-1/2), giving covol_E²=1/(S²F²) for primitive
v. The nonorthonormal rational basis Ai=ei-(vi/vn)en gives equivalent identities
detG=||v||²/vn² and detC=productq*sum vi²/qi /vn².

For a NONprimitive integer vector with gcd g, the same projected lattice is
generated by its primitive normalization: the formula is g²/(S²F²), not the
primitive formula. Scaling v by2 leaves projection and ellipsoid unchanged,
while the incorrectly applied primitive formula is smaller by a factor4.
This is a necessary admission premise, not an LRC counterexample.

Composing these geometry statements, the previously audited KZ minimum and
the conditional lower-LRC/prefix/KZ-basis argument gives SF<=K^(-1/2), then
product vi<(r_n/(n sqrtK))^n. Strictness comes from the strict shape bound;
the squared product bound is (r_n/n)^(2n)/K^n. This composed flag statement
remains conditional on lower LRC through12 / accepted LRC13 and geometric
association with the actual projected lattice. It is not full LRC14/15 proof.

## Independent exact controls actually executed

Separate stdlib Fraction polynomial multiplication/differentiation verified
derivative coefficients, positive lower polynomials, alpha brackets, a-minimum
powered comparisons, both cubic factorizations/brackets and strict H bounds.
Separate Gaussian elimination verified G/C determinants and covolume identity
for four controls: n13 ones/range, n14 ones/range. detG respectively13,63/13,
14,145/28; all detC positive and matched the complete closed formula.
Nonprimitive scaling by2 demonstrated the factor4 mismatch; outside-box
inclusion failed as expected. These are arithmetic controls corroborating the
WRITTEN universal bridges, not substitutes for them or archived terminals.

## Consumer, fresh replay and adversarial checks

Read the final pure module, subprocess helper, Python, collector CLI, retained
report, new panel and all three new test files. The pure consumer reconstructs
the complete fixed body: coefficients, brackets, strict margins, all25 k rows,
four determinant controls, primitive rejection and conditional flag quantities.
Unknown or promoted claims cannot pass merely by recomputing hashes. Pure GET
imports no filesystem, subprocess, old validator or network/model invocation.

Both TS and independent stdlib Python expand the bivariate support LHS before
comparing it with the factorization; they derive univariate derivative identities
and exact Gaussian determinants separately. Stored `interiorDerivative` means
the coefficient of C, -D, not the entire scaled derivative. This is now explicitly
documented and the consumer/test bind the full expression C*(-D)+(n-1)u²=-beta.
Its validity for all C follows from the written coefficient identity, not the
three illustrative C controls.

Fresh collector verifies the immutable TIP053 raw digest AND its actual retained
validator. This is dependency validation, not a new independent TIP053 replay.
It then verifies the new Python source pin and executes exactly one isolated
`python3 -I -S -B -c` child, shellfalse, minimal environment, bounded stdin/stdout,
timeout/kill on failure and no stderr acceptance. Child budget is capped by5s
and the remaining original10s collector budget. Final admission also checks the
outer deadline. JS work is cooperative bounded fixed work, not preempted by a
wall-clock interrupt; it is not represented as hard real-time scheduling.
Create-only `wx` prevents replacement of retained evidence. Unsigned receipts
remain a trusted-local assertion, not cryptographic execution attestation.

Actual reviewer commands/results after Core precision repair:

- `NODE_ENV=test node --import tsx scripts/operations/allikvere-shape-geometry-audit.ts`
  PASS, no write. Two observed fresh runs each49ms Python,22383stdout bytes,
  SHA256 `de47169460cbf25c8bde0f7a90acdd1e5d1bc7b304e39ae16de0d664ac756922`.
  This independently regenerated output; no author/archive execution was used.
  The direct `tsx` CLI first hit sandbox IPC EPERM; the equivalent Node import
  invocation succeeded without escalation, so no replay remains blocked.
- Focused new pure/replay/panel tests:3files,49/49PASS,1.60s. Includes actual
  Python, resource/drift/error checks, immutable create-only EEXIST preservation,
  coherent semantic faults, VI/EN server render and unchanged23OPEN parent gates.
- Additional separately written inline reviewer attack: baseline admitted,
 22/22 coherently rehashed semantic alterations rejected. Faults cover interior/f
  derivative/cubic coefficients, alpha/critical brackets, zero threshold,13to7
  power, missing k/dimension, nonprimitive control, determinant, squared flag,
  lower/KZ premise, unconditional flag, source/dependency, global/formal/control
  promotion, support coefficients, missing root case and incorrect gcd scale.
  Each attack updated stdout bytes/hash AND report digest, not just one checksum.
- Separate primitive/nonprimitive/nonpositive and normalized/outside-box controls
  PASS. Closed-box zero endpoints in the pair-identity helper are valid algebraic
  extensions; the actual positive geometry application rejects zero velocities.
- Read retained VI/EN panel semantics: all-case bounds, written geometry versus
  finite controls and conditional flag clearly separated. Historical/global
  snapshots are not silently promoted; no formal/novelty/agent-run claim appears.

Three review precision improvements are resolved: minimal-face/relative-interior
section argument in Main note; actual bivariate LHS expansion; explicit full-beta
derivative binding. No mathematical source-argument counterexample or remaining
consequential implementation defect found. Only this report was edited by the
reviewer; no product, manifest, handoff or prior evidence was modified.

## Reviewed fingerprints and coverage

R1-R3:3/3reviewed requirements PASS_WITH_SCOPE_LIMITS. R4 semantic/source/static
render checks PASS; actual browser acceptance belongs to Main. R5 focused49/49
PASS by reviewer; whole-repository acceptance is not inferred from this run.

- Sealed TIP054: `cbb5b532dfb1e56b4d14328d9c57a24d15db124e8f97a049200a01a4bbb54efc`.
- Pure module: `1b64b9b0506db6a4ba51abfab89eda89322e950b1ae6f2b696160fad525e63eb`.
- Fresh helper: `a4b64b5489f2d48066078924bf4012cff138e1c571412bea38dffbc5836d8845`.
- Python: `980b3a4fde31f2af71692f506e32ba4ceeec6324ea87662b19d8173d0cbf614a`.
- CLI: `41635e7787d5977c75b65b59707f7f06581d93cde20d5410adbd539bd783ded9`.
- New retained raw: `b29cd15b4520e74943e12c194765155a1238857ae39c2ab473119e9309c808fd`.
- Immutable TIP053 raw: `e17d97fa1d4a8f05e899e06cfb2da24fb439376fe25b6783eb9c10da650ab8f6`.
- Pure test: `d5c8ebcd7e5d118a0ab3b078aec042fb78aac35aa4a51d44ccce5261ec7825ee`.
- Replay test: `21c31e5b538044a3c044a61c56c281c22714c8be9fe38ab7fdcd370f7b730f5f`.
- Panel: `f4571fa31003e9ba0340ccc92478468bd19fb47c1e17ece5e81ac1c5d58a5214`.
- Panel test: `2377496849a131219df4645bdfbd69bc7acbe1707fd2b0a36feead17592123cb`.
- Main mathematical note: `824680945a640429a2b5bb9273cffb00a647e981a643582836d2471672750953`.

## NOT_RUN / acceptance boundary

No browser, repository build/lint/typecheck, full unit suite, DB integration,
model/provider/agent campaign, author archive, novelty or formal/external proof
acceptance by this reviewer. Main performs product acceptance separately.
All 23 frozen global APPLICATION obligations remain OPEN even if these bounded
universal sublemmas are accepted; this is meaningful reproduction progress,
not a new discovery or closure of the whole theorem.
