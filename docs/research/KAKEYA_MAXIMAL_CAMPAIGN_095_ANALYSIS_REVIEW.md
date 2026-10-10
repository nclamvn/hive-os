# TIP095 C2 — analytic chain review

Scope: source-relative reproduction, pinned OpenAI/math manuscript commit
`fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb`. Reviewer work began after the
owner-approved campaign start2026-10-10 01:48:06UTC. This note is mathematical
evidence for Main's integration, not a standalone whole-paper certificate.

## Result and remaining interface

The analytic implication from the exact inputs below to critical vanishing and
the maximal reduction has been reconstructed. No invalid source inference was
established in this reviewed implication. This is conditional on C1 establishing
the stationary/critical geometric inputs on the SAME weighted event graph, and
on Main matching the quantitative Ren–Wang input to its primary theorem. It must
not be promoted to the root verdict while either input remains unresolved.

I read the complete retained sections `upstream-entropy.tex` (678lines),
`upstream-projections.tex` (923lines), `upstream-pinning.tex` (598lines), and
`upstream-closure.tex` (645lines). I also inspected finite cleaning and
regularization in `upstream-critical.tex`275–559, the critical definition and
temporal integrand145–212, stationary output700–777, angular statement185–202
and conditional-X statement409–438 in `upstream-estimates.tex`. The earlier
094B note was consulted after reading the relevant original arguments; its
verdict was not used as a proof premise.

### Inputs that C2 actually needs

1. **Critical setup/canonical realization.** If critical vanishing fails near
   p=2, there is a realizing stationary equality with
   p>2, q∈[0,1), d=2−q, 0<h≤1−q, x=1−q−h<1;
   τ∈(0,1), ℓ=1−τ; β∈(0,1), s0=1−β>0;
   B*=h+ℓ(pβ−D(q,β)), w=h_z+ℓD_q(q,β)∈(0,1].
   This uses an actual interior critical point, not a freely chosen tuple.
2. **Same event probability.** Atoms are collapsed pairs (i,I1), each with
   original weight ω_i. Conditional on i the retained pairs are equally
   weighted. The matrix is determined by i; the index prior is consequently
   proportional to ω_i times its retained pair count, not uniform over indices.
3. **Stationary assignments and local bounds.** On every tested scale c,
   the same original active indices have packet owners, disjoint on each
   time block; packet active mass is at least
   n_c=Δ_h N^{(B*+τ)c+dw(1−c)} in exponent. Their four widths are
   L_X=N^{−ρ−wc}, L_Y=L_X/Θ_c, L_U=L_X/R_c,
   L_V=L_X/(R_cΘ_c), where R_c=N^{−ℓc}, Θ_c=N^{−τc}, ρ=1−w.
   The local matrix-cell bound has homogeneity d=x+y and controls larger
   as well as smaller offset cells on every permitted side.
4. **Within-index branching and angular bounds.** Occupied I_c blocks
   contain N^{s0ℓ(b−c)+o(1)} occupied I_b blocks; normals on i in I_c
   range over Θ_cN^{o(1)}. Angular law has positive fixed exponent γ,
   including conditioning on typical nondeficient e_c cells. These bounds,
   packet lower bounds and original active reference masses persist under
   the prescribed extensive regular refinements. Positive γ can be decreased
   to a value in (0,1] when a projection lemma needs that parameter range.
5. **Conditional X.** For c∈(0,1), positive offset a<w(1−c), fixed extra
   precision σ and sufficiently small fixed Δ,
   limsup H_N([X_{e_{c+σ}}]_{c,a+Δ}|Q(c,a),e_{c+σ})≤xΔ.
   The N limit precedes Δ and σ limits; the conclusion applies to the
   extensive refinements just used, with original reference masses.
6. **Regularization.** Finite conditional probability tests have at most
   N^C children per domain; domains may be numerous. Already homogenized
   cell AND domain partitions remain in the cleaning list. All tested
   depths can be realized by a slow diagonal with loss/error o(b), chosen
   before the queried offset. Mere mean-entropy convergence is insufficient.
7. **External quantitative planar theorem.** Ren–Wang's nice configuration
   with t-Frostman base cells and s-Frostman incident tube fibers, each
   having M comparable members, has at least
   c Mδ^{−min{t,(s+t)/2,1}+ε} distinct tubes, permitting a fixed positive
   power tolerance on both Frostman constants. C2 below derives robust
   projections and pinning from THIS input; it does not invoke a separate
   unverified radial-projection theorem or cite a bootstrap as a black box.

## 1. Entropy limits and finite conditional laws

### Gap differentiation

For the nonnegative superadditive gap kernel K(s,t), define
m(s,t)=inf over partition sums of K. Inserting a partition point decreases
a sum, while concatenating partitions gives the other inequality, so m is
additive and 0≤m(s,t)≤C(t−s). Thus m has density φ∈[0,C]. E=K−m is
nonnegative/superadditive with zero infimum of partition sums. Choose a
partition whose E-sum is arbitrarily small and apply Vitali to centered
intervals with E(I)>ε|I|. Disjoint selected intervals have E-sum bounded
by the partition's E-sum. The exceptional set has measure zero. At a
Lebesgue point of φ the resulting expansion is uniform over ALL
subintervals in [a−Cb,a+Cb], not just a derivative at one endpoint.

Rectangular layers are bounded below by K_S(d1,d2) and above by
K_S(a0,d2)−K_S(a0,d1). The uniform gap expansion makes both first-order
values equal. Subtracting two rectangular formulas is legitimate with
the same o(b) error control, including unequal nuisance depths.

### Extra labels: no O(σ)/b shortcut

The increment measure of F_σ(a)=I(Q_a;e_{c+σ}|e_c) is nonnegative,
has bounded density and total mass O(σ). For nested extra labels its
increment measures are ordered. Their decreasing densities converge to
zero almost everywhere, not only in mean.

The containing-gap bound uses specific deterministic relationships:
A together with L1 determines the coarser full observation R; T together
with L1 determines (A,Z), all up to bounded overlap. Consequently

    I(Z;L2|A,L1) ≤ I(T;L2|R,L1)+O(1)
                  ≤ I(T;L2|R,L0)+O(1).

The second inequality uses L0⊂L1⊂L2 and the chain rule. It is NOT
monotonicity of mutual information under arbitrary nuisance conditioning.
With the full starting cell retained and b≪min{ℓ,τ}σ, unknown-coordinate
frame errors fit inside the ending widths. O(1) overlap costs vanish in
the N limit before division by b. The correct order is N→∞, then b→0
at fixed σ, then σ→0.

### Counts, not just mean entropy

After choosing a finite label class of mass ρ0, clean L partitions with
cutoff θ0=ρ0/(2L). Each deficient original cell is charged at most once;
the retained mass is at least ρ0/2. For a surviving tested cell C inside
domain B, both retained/original mass ratios belong to [θ0,1], hence

    μ'(C|B)/μ(C|B) ∈ [θ0,θ0^{-1}].

Earlier homogenized exponents survive; an arbitrary unhomogenized mean
entropy need not survive. All offsets on a finite prescribed grid, all
required joint/domain tests and parameter laws are regularized together.
At stage n fix b_n first, accuracy o(b_n), offset spacing o(b_n), and
finite depth meshes with maximum gap tending to zero. Choose N_n only
after this finite list so log(retention/cleaning cost)=o(b_n log N_n)
and b_n log N_n→∞. No uniform differentiability rate in a is needed:
the gap expansion is uniform over the O(b_n) neighborhood of each
generic a, including its nearest grid point a_n.

Staggered base offsets a+(1−k_i)b make the distinct-speed refinement
intervals disjoint. Their coefficients are ordered conditional rates j_i,
not unconditional coordinate dimensions. For tied middle speeds,

    R(u)=a1 uX+v1 uV+
       rY(uY−uU)+m1 uU       if uY≥uU,
       rU(uU−uY)+m1 uY       if uU≥uY.

Uniform occupied cell exponents and this entropy identity give the
actual law P(O_u=o|E0,J0,L)=D^{−R(u)+o(1)}, D=N^b. Ratios of joint
and nuisance probabilities give pair Frostman dimensions. Increasingly
fine depth meshes extend ball upper bounds to all intermediate radii.

In the tied case, simultaneous label refinement multiplies both time
and angular widths by D^{−u}. There are at most D^{s0u+o(1)} joint
square cells, because each time block uses only subpower angular cells;
every square has probability at most D^{−s0u+o(1)} by time branching.
Conditional homogenization then forces probability D^{−s0u+o(1)} on
each occupied square. Separate marginal upper bounds alone do NOT
prove this lower bound; the range and count hypotheses are essential.

## 2. Robust projections, pinning and the information transfer

### Robust projections from the planar theorem

Suppose an independent point–label product has hit probability at least
δ^{2κ}, while each label allows at most Cδ^{−u} target intervals and
u<h_pr=min{t,(s+t)/2,1}. Partition slopes into δ-cells, keep a
maximizing representative test in each, and pigeonhole their label
masses. The retained uniform slope cells have Frostman constant
O(log(1/δ)δ^{−3κ}). Pigeonhole the positive point degrees and then
restricted point-cell masses. The base has t-Frostman constant
O(log^3(1/δ)δ^{−3κ}); incident fibers have s-Frostman constant
O(log^2(1/δ)δ^{−5κ}) and cardinality comparable to M.
The tube upper bound is C nδ^{−u}; the planar lower bound is
c Mδ^{−h_pr+ε}, with M≥δ^{2κ}n/O(log(1/δ)).
Choose ε=(h_pr−u)/4 and κ small compared with both the exponent gap
and the primary theorem's tolerance. This contradicts the upper bound.
Keeping the entire label is important: repeated slopes may prescribe
different translations/target sets; no loss of that information is used.

### Product pinning

The pinning proof is finite-scale and does not assume that independent
time and angular Frostman marginals make their product Frostman.

If a line neighborhood of width δ carries δ^{η0} mass on a positive
fraction of indices, both coordinate marginal bounds force the line
away from both coordinate directions by δ^{O(η0)}. Inside that cluster,
after removing |Δt|<δ^{Kη0}, the product is k(Δt)^2 with error
O(δ^{1−O(η0)}), and derivative ≥δ^{O(η0)} on both separated branches.
Its output interval preimage has time length ≤rδ^{−O(η0)}, including
r=δ. The lost cluster/initial-index mass and both marginal domination
costs fit the prescribed ε allowance when η0 is chosen first small
enough. The approximation error is paid, not discarded.

Otherwise a slow finite-depth diagonal removes a vanishing fraction of
indices and obtains a positive line-neighborhood exponent, hence an
initial ray exponent σ>0. For the ray-improvement lemma:

- In an occupied square J of side δ^{d1}, its normalized measure is
  s-Frostman through δ_J=δ^{d2−d1}; this uses BOTH child upper bounds
  and the parent lower bound.
- Remove pairs closer than δ^λ. Old symmetry supplies σ-Frostman
  reverse rays from each second point to its anchors. Replacing that
  second point by J's center changes direction by less than δ_J when
  d1−λ>d2−d1.
- Robust projection with exponents (s,σ) excludes the directions whose
  heavy projection bins carry too much mass. First remove exceptional
  anchor directions at power-small total pair cost; then remove heavy-bin
  points for each nonexceptional (anchor,J) at power-small total cost.
  These are distinct removals. Exceptionality depends on anchor and J,
  not on the particular second point, so neither removal falsely assumes
  product independence of the old relation.
- Joint pruning deletes every nonempty anchor–J section with mass below
  δ^λμ(J), simultaneously on both legs and all tested levels. Each
  anchor–cell is charged once against its original μ(J). Cascade cost is
  at most δ^λ per level/leg. Every subrelation satisfying all thresholds
  survives each deletion, so the terminal relation is the largest valid
  one and is symmetric.
- The local output-ball upper bound, divided by this surviving-section
  lower bound, gives
  Q(d2)≤Cδ^{σ_m(d2−d1)−Cλ}Q(d1).
  Sections meeting the fine output ball lie in an enlarged parent ball
  coverable by δ^{−O(λ)} parent balls. This factor is included in Cλ.
  Choose the finite ladder and d0 first, λ afterward smaller than every
  fixed margin, and only then δ small. A slow sequence of finite depth
  meshes gives all radii without comparing subpower errors to an
  uncontrolled shrinking ladder step.

For product output the gradient is (Δϑ,Δt), the swapped ray direction,
with size ≥δ^λ; its extra projection-bin and Taylor costs are again
δ^{−O(λ)}. Finite iterations improve σ toward s, then one product step
gives exponent >s−ε/2. Anchors with section mass at least1/2 are retained
and their sections normalized; both single-event marginals are bounded
by a fixed multiple of the original law. The construction uses only
the initial index/parameter measure and is fixed before querying offset.

### No hidden independence in rate transfer

The label alphabet at a gap b has entropy O(1+b log N) under ordinary
or biased couplings. If f(a)=I(J0(a);L0,L1|E0), its monotonicity yields

    ∫ I(Jf;L0,L1|E0,J0)/log D da ≤ C(b+1/log N).

Choose summable b_n and 1/log N_n. Tonelli then gives o(log D) pair
information at almost every offset, also after nearest-grid replacement.
This uses a pair law fixed while offset is integrated. Subsequences
required by pinning preserve the estimate. Countably many rational
strict-violation tests give a common full-measure set.

More precisely, for each rational strict-margin/loss tuple select ONE
sequence of finite couplings and its pinning subsequence before querying
a. Its fixed rational ζ may be selected from the offset-independent
(I,E0) parameter measures. The information integral estimate is uniform
over this chosen law sequence, and summability survives the subsequence.
Arbitrary finite choices of clusters/relations at each stage do not
require intersecting the exceptional sets of all conceivable couplings:
only the countably many already selected experiment families are used.
The all-grid conditional laws survive their subsequences. For dependence
on c, the final numerical failure set of the rate inequalities is
measurable; proving that each good c has a null offset section suffices
for Fubini, without requiring a jointly measurable selector of couplings
as a function of c.

For biased first marginal ν≤D^{εζ}μ, discard bases with
ν(B)<D^{−εζ}μ(B); their ν-mass is ≤D^{−εζ}. Remaining conditional
matrix laws satisfy ν(.|B)≤D^{2εζ}μ(.|B). Apply robust projection in
EVERY ORIGINAL nuisance fiber, integrate under the original matrix
law, and only THEN apply this whole-law domination. One never asserts
Frostman bounds on the biased nuisance fibers.

The same-index coupling has probability1 of the target-support event,
whereas the independent product of its conditional matrix/label
marginals has probability at most δ^κ. Replacing the matrix by Jf's
representative only requires fixed enlargement. Relative entropy
therefore demands at least κζ log D information at each good base,
contradicting the o(log D) bound. Available pinned slope exponents
approach s0 with arbitrarily small losses; strict exponent margins are
chosen BEFORE those losses and their fixed depth ζ.

This proves the stated distinct constraints a1≥y1, u1≥v1,
v1>0⇒y1≥min{1,s0+v1}, and a1<1⇒u1≤(a1−s0)_+.
For tied speeds it proves m1≤1+(a1−s0)_+ and
v1≤(a1−s0)_+ when a1<1. Zero-dimensional pairs are handled without
invoking a theorem that requires t>0.

## 3. Strong traces and weak-star demands

The invariant absolute coordinate V permits fixing its threshold
λ=ρ+(w−1)c+a. Later labels and earlier-observed coordinates determine
the earlier conditioning up to bounded overlap. The unknown-V frame
errors are smaller than the ending cells for r≪min{ℓ,τ}σ. Conditional
V entropy, then its rate, is nonincreasing in c along fixed λ.

If α=1−w>0, h(r,a)=v1(r+a/α,a) has monotone a-sections. Their
one-sided limits converge strongly by dominated convergence; undoing
the shear adds an L1 translation tending to zero. Fubini provides ONE
full-measure offset set through which every sequence has that strong
limit. Stripe averages have the same strong limit. For w=1, generic
offset slices are bounded monotone functions of c; Helly plus dominated
convergence gives strong subsequential L1 compactness on every compact J.

The stationary masses give

    H(c,0)=log_N(n/n_c)+s0ℓc,
    ∂cH(c,0)=dw−B*−τ+s0ℓ.

Local cell homogeneity gives H(c,a)≥H(c,0)+da. Hence RIGHT stripe
averages of g=∂aH are ≥d; LEFT stripe averages are ≤d when available.
These are not pointwise bounds on generic slices of g.

Entropy demand is ∂cH≥s0ℓ+wg−M. Uniform convergence H(.,a)→H(.,0)
and a common Lipschitz bound give ∂cH(.,a) weak-star convergence to
the displayed constant through generic offsets, by integration by parts
and L1 approximation. Thus every weak-star limit of
Q=M−w(g−d), for slices or stripes, is ≥T*=τ+B* almost everywhere.
The boundedness permits all nonnegative L1 tests, including indicators
of measurable limiting-rate sets.

## 4. Five closure cases

Put b+=(β−q)_+ and use a1≤x<1 on the RIGHT only. Then
(a1−s0)_+≤b+. The common identity is

    Q=(M−rg)+rd+(r−w)(g−d).

Only after averaging can one use the right g-stripe when r≤w, or
the left g-stripe when r≥w. D≤min{q,β/2}; for q<(1/2−η)β,
D=q, D_q=1 and w>ℓ. Fix η≤min{1/32,(p_min−2)/16} BEFORE
constructing the stationary parameters.

| Case | Upper stripe limit for Q | Strict gap below T* |
| --- | --- | --- |
| Distinct, w≥τ/2, right | U1=τd/2+2ℓb+ | q<β: ≥h+τq/2+ℓ((p−2)β+q); q≥β: ≥h+τq/2+ℓ(p−1/2)β |
| Distinct, w<τ/2, τ<2ℓ, right | U2=τ(1−q)+(1+ℓ)b+ | q<β: ≥h+(ℓ(p−3/2)−2η)β>0; q≥β: ≥h+τq+ℓ(p−1/2)β |
| Distinct, w<τ/2, τ≥2ℓ, left | U3=τd/2+ℓβ | ≥h+τq/2+ℓ(p−3/2)β>0 |
| Tied, q≥(1/2−η)β, right | U4=1/2+3b+/2 | q<β: ≥h+((p−2)/2−3η/2)β>0; q≥β: ≥h+(p−1/2)β/2 |
| Tied, q<(1/2−η)β, right | Slice weak limits force ḡ≤d−K0/w, K0=h+(p−1)β/2>0 | Contradicts right stripe average g≥d |

The third case's localization is substantive: on {v1>0},
g≥2min{1,s0+v1}+2v1. For v*≥δ, the zero-v1 bad set has measure
≤δ^{-1}||v1−v*||1. Strong left trace and stripe averaging therefore
pass that inequality to ḡ on {v*>0}. Since ḡ≤d≤2, v*≤β/2.
Then M−τg/2≤2ℓv1 and the stripe identity gives U3. Weak
convergence of v1 alone would not establish this.

In the last case w>1/2. Extract strong v* plus weak-star other rates
along ANY sequence of generic positive offsets. On {v*>0}, localization
of a1−v1≥s0 yields
T*≤U0+(w−1/2)(d−ḡ), U0=1/2+(β−q)/2. On {v*=0},
M̄≤U0 yields T*≤U0+w(d−ḡ). Both give the SAME fixed positive
gap ḡ≤d−K0/w. If arbitrarily small generic slices violated its
half-gap bound against a fixed positive L1 test, extracting a subsequence
would contradict this universal weak-limit bound. Thus all sufficiently
small generic slices obey the half-gap inequality; stripe averaging
contradicts g≥d. This is valid for w=1 and does not presume an actual
single trace in that endpoint case.

Every regime is excluded, yielding h(p,0)=0 for p>2 arbitrarily close
to2 under the critical realization input.

## 5. Maximal reduction and shading-density bookkeeping

Separated spatial slopes at mesh N^{-1} give original/subfamily plank
clustering Δ0≤C by endpoint comparison and planar packing. If the
discrete inequality failed uniformly, select exactly
k≈Nθ marked bins per line, θ=max{N^{-1},λ}=N^{−α+o(1)}.
Extensive regularization retains nkN^{−o(1)} events. Its active index
mass is ≤n and its events per index ≤k, so the retained regular degree
is kN^{−o(1)} and F(1)=α. A violating cell count gives multiplicity
≥N^{pα+ξ−o(1)}, whereas h(p,0)=0 gives ≤N^{pα+o(1)}. Therefore

    #A ≥ c N^{−ξ} nN max{N^{-1},λ}^{p+1}.

No dense-shading hypothesis was substituted for the original λ. For
the enlarged cylinders, λ density yields at least c max{1,λN}
marked bins. A separated directional net and bounded-overlap spatial
center groups give

    σ{K_N 1_E>λ} ≤ C N^ξ |E| max{N^{-1},λ}^{−(p+1)}.

For λ≥N^{-1}, λ^3σ≤C N^{p−2+ξ}|E|. Layer cake pays one log N;
the small λ range contributes at most4πN^{-3}, absorbed because every
nonempty fine-cube union has |E|≥N^{-3}.

For ||f||3=1, cell averages satisfy 0≤F_N≤N, ||F_N||3≤1.
Enlarging each original tube gives K_δf≤64K_NF_N. Values below
N^{-1} contribute ≤N^{-1}; the remaining O(log N) disjoint dyadic
levels obey Hölder's finite-sum bound. The total loss is

    ||K_δf||3 ≤ C N^{(p−2+ξ)/3}(1+log N).

With ξ=κ the logarithm is absorbed by N^{2κ/3}, producing
δ^{−(p−2)/3−κ}. Choose p with (p−2)/3<ε/2 and κ=ε/2 for
the claimed δ^{−ε} estimate. Cylinder integrals are continuous in
center/direction by L^{3/2} indicator convergence and Hölder, so their
suprema over rational centers are measurable; complex f is covered
through |f|. Translation groups and constants are uniform.

## Integration disposition

C2's reviewed internal implication is discharged relative to inputs1–7.
Its nontrivial safeguards are essential premises, not optional prose:
pre-offset finite regularization, retained original weighted law,
nondeficient conditional cells, both lower and upper tied square masses,
fixed-depth marginal domination, strong velocity localization and common
generic-slice weak-limit gap. Replacing any of these by mean entropy,
finite samples, or an arbitrary restriction would reopen the implication.

Main must use C1's actual proof/adjudication of inputs1–5 and the primary
external theorem match for input7 before deciding the full root status.
This review gives no novelty, method-superiority, community endorsement,
Lean certificate, or assurance about unrelated source paths.

No model/API/product/UI/code/build/install/DB/Git action was used by this
reviewer. Only mathematical source/notes were read and this owned note was
written. No scratch project, dependency environment, distDir or Docker
artifact was created; nothing was removed.

Reviewer handoff2026-10-10 01:57UTC, within the campaign envelope. This is
an analytic implication review, not acceptance of the unreviewed geometric
inputs or independent formal verification of the entire manuscript.
