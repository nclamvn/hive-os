# FrontierMath — first public method comparison

2026-10-09 · TIP-086 · FRONTIERMATH_PUBLIC_METHOD_COMPARISON_086.
**Result: observed tie. Method advantage NOT ESTABLISHED.**
Scoped evaluation E1–E5 completed; not a whole-product or benchmark acceptance.

## What was actually tested

Owner routed from the closed LRC presentation to measuring method advantage.
Three public Tier2 examples from [Epoch's sample collection](https://epoch.ai/frontiermath/tiers-1-4/benchmark-problems#tier-2)
were frozen before dispatch: recursive permutations, degree19 polynomial, and
prime-field continuous extensions. No failed case was replaced.

Pre-dispatch TIP SHA256:
`fe6413b19b5cad0fe4174c0bfdcad8ad1e642f48f26717f81e91842d2f8ae750`.
Predecessor closed085 digest is preserved in TIP086. No old p139/R3 obligation,
attempt, source grant, resource budget or acceptance label was reset.

- **A:** one fresh context, solve → self-check → final submission.
- **B:** fresh solver → fresh separate-context critic → solver repair/final.
- Three mathematical requests per arm, same inherited settings, no model
  override. A is a strong self-checking baseline, NOT merely one short answer.
- Both got the same problem statements, ≤2400 words/request instruction,
  ≤3 optional stdlib Python calls/≤60s each/≤180s aggregate and ten active
  minutes/arm. Restrictions were instructions, not a hostile-code sandbox.
- Main provided no answers, official solutions or judging feedback to solvers.
  B critic saw B's complete mathematical draft only. A received only generic
  self-check/finalization prompts, not the critic or the other arm.
- A shared fresh assessor saw final mathematical submissions anonymized as
  **U=B, V=A**; no method labels, intermediate review or official solutions.
  Main also independently reviewed the full final texts and ran exact checks.

All mathematical requests/responses and actual computation outputs remain in
this Codex conversation. This report retains their outcomes and essential
arguments, not a new transcript/database framework. One budget acknowledgment
to B carried no mathematical feedback and did not trigger an additional turn.

Main had seen public answers, previous PERM/POLY material and PADIC's reference
solution. Solvers got only statements in fresh contexts; all reported recognizing
standard methods but not remembering these exact instances. Training exposure
cannot be excluded or measured. This is **not blind** or official FrontierMath.

## Frozen assessment and paired outcomes

R=requested output with qualifiers, P=logical argument, V=exact/reproducible
arithmetic, S=statement/scope fidelity. Each dimension0–2, as frozen in TIP.
Scores are descriptive, not mathematical evidence or an official grading scale.

| Case | A direct/self-check | B solve/critique/repair | R/P/V/S each arm |
|---|---|---|---|
| PERM | Supported as stated | Supported as stated | 2/2/2/2 |
| POLY | Supported as stated | Supported as stated | 2/2/2/2 |
| PADIC | Statement defect identified; conditional result supported | Same | 2/2/2/2 |

Both received24/24 rubric points. **This does not mean three valid original
problems were solved:** two were supported as stated, and the third was correctly
diagnosed as inconsistent under its literal all-integer-index reading, with an
explicitly conditional solution. Both already reached these conclusions on
their first request. Neither subsequent workflow repaired an essential error.

A self-review found no substantive correction. B critic independently confirmed
the reasoning; its two suggestions were stating the n≥1 domain explicitly and
calling a positive integer the magnitude of the negative numerator. B also made
clear that irreducibility of the P1×P1 closure does not assert nonsingularity
there. These are useful exposition checks, **not demonstrated mathematical
failure recovery or a win over A**.

The shared assessor found no essential logical defect in either final packet,
graded all six paired submissions separately, and used one stdlib arithmetic
command. This is separate-context AI review, not different-model, statistically
independent, external-expert or Lean verification. Agreement was not used in
place of the proofs.

## Mathematical evidence, not just matching numbers

### PERM

Both submissions use maximum-Cartesian-tree postorder. For i and i+1, the LCA
is the maximum letter in their input interval. An output inverse descent occurs
precisely when the reversed input pair is separated by a greater letter. In the
uniform restricted subsequence {i,…,n}, subtract the particular oriented adjacent
block probability1/(n-i+1) from1/2. Linearity gives

\[
E_n=(n+1)/2-H_n.
\]

Both supply integral/logarithm bounds placing H(10^12) strictly between27.5
and28.5, which yields floor499999999972. A and B use different elementary upper
bounds; neither assumes the transformed permutation is uniform or the indicators
independent. Main's separate exact Fraction calculation, with an80-term atanh
series for log10 and an explicit positive remainder, confirmed sufficient
harmonic bounds. Finite arithmetic supports the floor, not the all-n LCA proof.

### POLY

Both construct p(x)=2T19(x/2), or its explicit Dickson recurrence polynomial.
The ascending coefficients are

`[0,-19,0,285,0,-1254,0,2508,0,-2717,0,1729,0,-665,0,152,0,-19,0,1]`.

For θk=2πk/19, k1…9, their root-of-unity parametrizations establish

\[
p(x)-p(y)=(x-y)\prod_{k=1}^9
\left(x^2+y^2-2\cos\theta_k\,xy-4\sin^2\theta_k\right).
\]

A proves quadratic irreducibility by the discriminant's simple zeros at±2;
B uses the nonsingular ordinary projective conic determinant. Both account for
distinct factors and the P1×P1 closures, with no omitted boundary divisor.
This is construction/existence, not an unnecessary uniqueness classification.
Exact recurrence gives p(19)=1876572071974094803391179.

Main reused the existing Poly19 verifier with these submitted coefficients.
Actual exit0: `VERIFIED_POLY19_CYCLOTOMIC_CONSTRUCTION`, exact identity/distinct
parameters/nondegenerate quadratics true, ten components/nine nonlinear **under
documented written lemmas**, 95,721 exact operations, internal0.017712959s.
It does not machine-formalize the cyclotomic/irreducibility/projective lemmas.
Candidate bytes digest908a528a1ca6850d9f8be88f8c28cbbda12714f9c94024793c9c711ebe97d951;
the digest identifies input bytes and is not evidence of truth.

### PADIC — a real source-fidelity finding

At n=3, the recurrence forces

\[
a_{-1}=-751233911324/370639957\notin\mathbb Z.
\]

The numerator magnitude is2026 times the denominator plus317358442. Thus the
source's description of an integer-valued sequence on every integer index is
incompatible with its data if the recurrence applies on all Z. If it applies only
for n≥4, negative values are instead unspecified. Neither arm silently repaired
this premise. **The requested prime is undefined for the literal nonexistent
bi-infinite integer sequence.** This is a finding about the displayed sample,
not a claim that the entire benchmark or its intended mathematical question fails.

Under the explicitly named forward-sequence or unique rational-backward
interpretation, both prove the prime is9811. Let M be the companion matrix and
v=(0,1,2,3). The vectors v,Mv,M²v,M³v form a basis over every Qp: A proves the
Hankel determinant odd; B computes the nonzero rational integer determinant
`-707644712824053070603130239680703075`.

Continuity at fixed integer arguments forces M^(p^k)→I on that basis, hence the
characteristic polynomial must reduce to(t−1)^4. All possible primes must divide
the four coefficient differences, whose gcd is9811. This cyclicity argument
handles mode cancellation, including primes dividing the integral determinant;
invertibility over Qp, not over Fp, is the relevant condition. Trial division
establishes primality and9811≡4mod7, excluding every other prime.

At9811, Cayley–Hamilton gives(M−I)^4≡0, so M^p≡I modp. Matrix binomial induction
gives M^(p^k)≡I modp^k and uniform continuity on integer powers. The recurrence's
constant term is a p-adic unit, so inverse powers are integral over Zp and the
rational negative terms agree with the continuous completion. They do not become
ordinary integers.

Main's independent stdlib arithmetic reproduced the negative term, determinant,
coefficient gcd and the unipotent matrix-power congruence. An auxiliary check at
p11 illustrates the danger of finite evidence: a(11^k) is0 mod11, yet checks
mod121 give88,99,77,99,…, not0. These samples do not prove continuity or its
failure by themselves; the basis/characteristic-polynomial argument supplies
the universal necessity.

## Actual resource observations and limits

| Observation | A | B |
|---|---:|---:|
| Mathematical requests | 3, same context | 3, including fresh critic |
| Python computations | 1 | 3: solver2, critic1 |
| Reported internal Python seconds | ≈0.00054 | ≈0.001133+0.0000313+0.000027 |
| Final clock reading UTC | 07:32:57 | 07:33:41 |

Shared pre-dispatch observation was07:26:12UTC. These final clock readings are
6m45/7m29 after that observation; they are **not full generation-end or isolated
inference latency measurements**. Both finals were frozen before assessor
dispatch, and before Main's07:36:32 observation. Exact active sampling/queue
durations were not independently instrumented; the ten-minute cap was instructed,
not a measured hard wall cancellation. Do not infer speed superiority.

Backend model identifier, reasoning-token consumption, exact input/output token
usage and seeds are unavailable here. Same inherited settings and equal allocated
request/tool/output/time limits **do not prove token- or compute-matched arms**.
Word limits are instructions, not transport-enforced token ceilings. This
observability gap is a limitation of the experiment, not a new infrastructure
task or permission to call a paid API.

## Technical verification and acceptance

Main actual `npm run research:check`: exit0, syntaxPASS, focused typesPASS with
zero diagnostics, two files/63testsPASS, existing arithmetic-only CLI smokePASS;
internal2776.7ms. This developer replay is explicitly synthetic/under-lemma and
not the fresh solver result or a proof verifier. Build, lint, whole-app typecheck,
integration, browser E2E and Lean were NOT RUN; no product code changed.

E1 fixed source/statements/rubric/envelope: PASS.
E2 six arm requests/results/limits and observable deviations retained: PASS with
token/active-wall observability limitations disclosed above.
E3 shared anonymized mathematical assessment and Main exact checks: PASS,
ordinary non-formal reviewed proof plus scoped exact replay only.
E4 paired outcomes/critique/no-win/resource limitations: PASS.
E5 truthful completion and product boundary: PASS.

The experiment is Codex-assisted orchestration. It did **not** run through HIVE's
authenticated application agent queue or adopt records into its database. The
existing LRC UI/server was left unchanged. These results cannot be presented as
autonomous product E2E, novel research, blind ability or an official score.

## Decision and stop

The strong direct/self-check baseline already solved the two consistent samples
and detected the third's defective premise. Additional independent critique did
not improve correctness on this set, and used more arithmetic calls. It would be
false to claim HIVE superiority or to enlarge the run until a win appears.

The useful outcome is a real comparison exposing a ceiling/selection problem:
these public examples do not discriminate the two workflows for this model.
Further evidence would require a prospectively fixed, less exposed batch and
observable resource usage; failures must remain in the denominator. Route
independent critique selectively to concrete uncertainty rather than requiring
every successful solution to traverse a larger swarm. Do not change the method
or launch another batch from this report alone.

Vibecode was used as one TIP and this one completion, with delegated mathematical
work and scoped verification. No new product framework/checker/parser/UI,
API/install/build/DB/Git/oldroot/R3 effect, scratch/project copy/new distDir,
Docker use or material deletion. Existing dirty changes preserved.
**STOP at the public pilot report, before08:02UTC; no next campaign authorized.**
