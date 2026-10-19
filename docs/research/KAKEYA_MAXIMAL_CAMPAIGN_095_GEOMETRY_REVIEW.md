# TIP095 — focused geometry and inherited-weight review

Scope: C1 of the owner-approved end-to-end reproduction campaign, pinned
OpenAI/math commit `fd4aeeb2ee4fc729c18d98444fed42fd0529eeeb` (Sep23
`maximal3D`). This is a mathematical source-relative reconstruction, not a
novel proof, independent community certification, formal verification, or a
vote about the whole maximal theorem. Prior TIP094/094B notes were not used as
certificates. The source files reviewed afresh were `upstream-critical.tex`,
`upstream-local.tex`, `upstream-stationary.tex`, `upstream-estimates.tex` and
the internal weighted reductions in `upstream-inputs.tex`. References below
are exact source labels and one-based lines of the retained edition.

## C1 verdict

**C1 reconstructed relative to the three stated geometric input theorems
and the BV approximate-differentiability input.** I found no demonstrated
false inference in this dependency path. In particular, I reconstructed
the positive-deficit/canonical-shape constructions, same-family finite
chains, angular loss ledger, and representative/child cost comparison in
Conditional X. This verdict is not the root verdict: external theorem
interfaces and the entropy/projection/closure/maximal-reduction path belong
to Main/C2. Exact external interfaces, not historical audit status, must be
matched there.

The estimates depend on original active-index masses after the extensive
equality restrictions that constructed the stationary configuration.
“Original” does not mean an arbitrary pre-regularization family, and does
not mean only the indices whose shadings carry the current query label.
All refinements keep the original positive weights of retained indices.

## Dependency coverage

| Internal obligation | Source | Reconstruction below |
|---|---|---|
| Critical problem, endpoint bound, equality compactness | critical:213–271, 675–750, 778–872 | §1 |
| Finite cleaning, inherited branching/cost | critical:281–482, 565–622; estimates:50–181 | §1 and §6 |
| Internal weighted geometric reductions | inputs:74–178, 199–289, 359–407, 416–477 | §2 |
| Local packet mass, isotropic cut | local:65–233 | §3 |
| Multilinear planarity, prefix filling, flat delay | local:241–769 | §3 |
| Saturation, anisotropic transfer, positive deficit | local:772–1258 | §4 |
| Derivative capture, compatible cuts, angle packing | stationary:55–432 | §5 |
| Canonical profile and tracked shape | stationary:436–657 | §5 |
| Same-event stationary law and widths | stationary:659–864 | §5 |
| Angular Frostman and positive time dimension | estimates:185–390 | §6 |
| Conditional X reference mass, representative law/cost, cross-entropy | estimates:413–893 | §7 |

No source coverage entry is a proof percentage. The written derivations
and matched interfaces are the evidence for the C1 verdict.

## 1. Critical extremizers and inherited branching

Use the source notation

\[
\mathcal I=\sum_i\omega_i|S_i|,
\quad n=\sum_i\omega_i,
\quad m=\mathcal I/|E|,
\quad k=\mathcal I/n,
\quad \Delta_A=\sup_B n_B/(a^{d-1-A}b^{1+A}).
\]

Here an index belongs to a plank only when its entire affine trace on
the indicated interval belongs. At candidate `A=d−1`, pair-counting
gives

\[
\sum_Q\mu(Q)^2\lesssim n\Delta_{d-1}N^{d+o(1)},
\quad m\le N^{d-1+F(1)+o(1)}\Delta_{d-1}.
\]

Indeed relative slope size `θ` confines the partner to widths `O(θN)`
and gives only `O(1/θ)` possible meetings. The resulting dyadic sum
`Σθ^{d−1}` is logarithmic at `d=1` and bounded otherwise. Repeated
indices are included. Since `Π≥(p−1/2)F`, the candidate is valid;
the endpoint `z=−1` has no other candidate. Width-ratio bounds give
`N^{−(A₂−A₁)}Δ_A₁≤Δ_A₂≤Δ_A₁` and closed upper-interval validity.

Finite cleaning charges a deficient cell once against its *reference*
mass, so cascades cannot increase the total `Lϑ₀μ(Ω)` charge
(`lem:finite-cleaning`, critical:281–309). Probability labels must be
computed before this cleaning against their own pre-label reference
graph; numerator/domain ratios then change by only subpower factors.

For a restricted uniform profile `G`, the occupied descendants in each
surviving time block are subsets of the original descendants. Uniform
counts on both endpoints of a gap imply

\[
G(t)-G(s)\ge F(t)-F(s).
\]

If incidence retention is `N^{−e+o(1)}`, the total surviving index
weight is at most the original one (or subpower times it for permitted
routing). Comparing `n'N^{1−G(1)}` with `nN^{1−F(1)−e}` gives
`G(1)−F(1)≤e`. Hence `G'≥F'` a.e., and the increasing, `p`-Lipschitz
integrand gives `0≤Π_G−Π_F≤pe`. This is an all-gap statement, not an
endpoint-density surrogate (`lem:regularization`, critical:339–482;
`lem:profile-cost`, critical:565–622).

Finite-test regularization first freezes a finite mesh and label list.
Its mass loss is independent of resolution at that stage, so a slow
stage diagonal makes it subpower. It does not impose an uncontrolled
rate simultaneously over all shrinking gaps.

For hybrid equalities, lower semicontinuity of convex cost is in the
correct direction. A diagonal realization supplies
`liminf log_N(m/Δ_h₀)≥H+Π_F`; the sharp all-sequence upper bound supplies
the reverse bound. A strict downward cost jump would improve the sharp
score and is therefore impossible. On an extensive graph refinement,
support shrinks, incidence loses only a subpower, and plank masses can
only decrease. The hybrid upper bound sandwiches `m'` and `Δ'` to the
old exponents (`lem:hybrid-equality`, critical:778–872).

The differentiability selection additionally uses the named BV theorem
in `lem:critical-point` (critical:675–750). Coordinatewise monotonicity
of `h−z` allows the density-one approximate derivative to be sandwiched
by comparison points above/below every small displacement; this yields
ordinary total differentiability. The monotone singular variation has
the nonpositive sign, so `h(p,0)>0` forces a positive `h_z` somewhere
in the interior. This input is separate from the geometric theorems.

## 2. Internal reductions of the geometric inputs

These reductions use the *stated* primary inputs; Main must match those
statements to the primary editions.

In `lem:weighted-convex-set` (inputs:74–178), normalize weights by the
convex-clustering constant, test each tube to obtain probabilities at
most one, and Bernoulli-sample the indices. An enclosing John ellipsoid,
then a `δ²` net of boxes, reduces all convex tests to polynomially many
box tests. Exponential moments make every sampled cluster logarithmic;
the lower-tail estimate preserves a constant fraction of expected sample
size. Exact tube repetitions are logarithmic too and may be reduced to
one selected shading without needing to merge shadings. The set theorem
then proves weighted incidence/union control. Small total sample mass
instead uses the pointwise bound.

In `lem:weighted-set` (inputs:199–289), horizontal slices of the enclosing
ellipsoid have affine centers, fixed principal axes, and comparable
maximal area `O(|K|)` because the time diameter is at least one. Thus a
full-time plank contains the traces counted by a convex test and has
area `O(|K|)`. The given plank mass bound implies convex clustering for
thickened traces. Disjoint balls at marked-time centers turn event count
into shading volume and cancel the `δ³` conversion factor. Fixed chart
and density constants are absorbed only after lowering the permitted
density tolerance.

For `cor:weighted-furstenberg` (inputs:359–407), parameter cells with
mass below `δ⁴` have negligible total mass; one dyadic mass level retains
at least a logarithmic fraction. Uniform cell counts then inherit the
weighted Frostman bound with only a logarithmic inflation. Fixed-grid
coloring gives separated representatives, each retaining one original
shading. Subpower shading-cardinality discrepancies are reduced to the
common minimum; the same ratio controls the Frostman inflation.

Multilinear weights (inputs:416–477) extend the stated unweighted
cylinder theorem by repetition, clearing rational denominators, and
monotone rational approximation. Fixed radius enlargement gives cube
counts. Perturbing cap centers by `o(θ)` preserves the determinant
threshold. The internal uses require only polynomial dependence on the
transversality loss, though the source states the exact endpoint power.

## 3. Local mass, common planes, and the initial flat interval

The threshold in `prop:local-bound` (local:65–233) is

\[
T(\kappa,a,b)=mN^{-\Pi(\kappa)}K^{-H}a^{d-1-H}b^{1+H}.
\]

A packet lies in boundedly many isotropic matrix parents of side `b/K`:
endpoint comparison bounds both slope/intercept spreads by `O(b/K)`.
Every original matrix has one fixed grid parent, so keeping all its
selected blocks in that parent does not duplicate its weight per block.
At resolution `N'=Nb/(Ka)`, filling a selected block gives `b/a` bins,
packet support `O((b/a)²)`, and packet incidence `M b/a`; its lower
aggregate multiplicity is therefore `M a/b`. Parent supports are
counted separately, never assumed to have bounded overlap.

An arbitrary new plank pulls back to widths `aA,aB`; its raw parameter
is at most `a^dΔ_h₀`. The filled profile has deleted cost `Π(κ)` and
outer scale length `1−χ`, where `χ=log_N a+log_N(K/b)≤κ`. The sharp
upper bound equals exactly `T a/b`. A fixed excessive packet mass
contradicts this, including the zero-effective-resolution endpoint,
where the full-box bound replaces the positive-resolution argument.
Deficiency cleaning preserves the lower packet *active weight* because
each assigned index-block has the same event count in exponent.

The slack ratio is

\[
k^2m/n\ge N^{q+H+\Pi(1)-2\alpha-o(1)}
\ge N^{H+(p-2)\alpha-o(1)}.
\]

At block scale `K`, multilinear cube counting bounds bad-ball incidence
by `N^εK^{C}(n/(k²m))^{1/2}`. Small fixed `κ` therefore removes a
power-small fraction. The remaining rich directions lie near one
plane *chosen once for the index-block*. Light caps and almost-parallel
neighbors are negligible using the original cap-mass bound. Neighbors
retain their whole original shading on the block; no independence of
neighbor direction and encounter time is used (`loc:short-block-plane`,
local:285–394).

In `lem:prefix-extension` (local:498–686), record-prefix hypotheses give
time Frostman exponent `s`; raw cap mass divided by the displayed
neighbor normalization gives conditional angular exponent
`a_ang=H+(p−1/2)γ`. A ball in planar line-parameter space forces both
direction size `r` and encounter-time size `N^{o(1)}r`: separation from
the reference controls the derivative of `−c/v`. Integrating the
conditional angular estimate over that time interval gives joint
Frostman exponent `t=s+a_ang`, not a product-law assumption.

The planar input gives union-cell count `N^{−F(κ)}K^{1+μ}` with
`μ=min(1,(s+t)/2,t)`. Plate density is consequently
`ρ≥N^{−F(κ)}K^{μ−1}`. The independently proved plate Nikodym bound
uses the symmetric `AA*` kernel
`O(1/[K²(1+dist(y,plane_x))])`, Schur integration `O(log K)`, and
therefore *squared* density loss. Filling increases incidence by
`N^{F(κ)}` but support by at most `N^{2F(κ)+2κ(1−μ)}`. Comparison
with removed temporal cost gives the necessary inequality

\[
\Pi(\kappa)\le F(\kappa)+2\kappa(1-\mu).
\]

The flat-delay contradiction (local:688–769) uses record minima of
`F(u)−(e+ε)u`, with `e=liminf F(u)/u`. The cap covering first gives
`H+(p−1/2)e≤1`. For `e=0`, `μ=1` and any fixed positive
`F(κ)` contradicts `Π≥(p−1/2)F`; no lower bound on `F(κ)/κ` is
needed. For `e>0`, the strict gain is
`(2(p−1/2)−3)e+H=(2p−4)e+H>0` when the maximum term is active.
Thus every equality has a genuine initial zero-deficit interval.

## 4. Positive deficit and anisotropic normalization

On a flat prefix, the weighted set estimate captures planks of density
at least `mN^{−ε}`. Comparing with the local threshold yields

\[
(q+H)\log_N a+H\log_N(K/b)\le\varepsilon+o(1).
\]

As tolerance decreases these are plates of widths `1,K` and inherited
mass `mK` in exponent (`loc:flat-saturation`, local:772–824).

The map in `lem:anisotropic` (local:836–1021) is, in fine units,
`(r,z_n,z_t)↦(θr,z_n,θz_t)`. A plate whose thin axis is within `θ`
of the chosen normal has bounded thin width after this map, length
`Kθ` and time `Kθ`. Thus incidence/support yields multiplicity
`m/θ`. Endpoint extrapolation bounds the matrix parents' normal
spread by `(K₁/K+θK₁)N^{o(1)}≤θK₁N^{o(1)}` because `θ≥K⁻¹`.
One derived index joins all its selected fine blocks in each larger
block/bin/parent; there are only subpower many such charts per original
index/larger-block. That is the routing premise needed for all-gap
profile preservation.

For an arbitrary pulled-back rectangle, `AB≲ab/θ` and `B≲b/θ`.
Since `0≤x'≤y'`, its mass is at most
`C(AB)^{x'}B^{y'−x'}≲Cθ^{−y'}a^{x'}b^{y'}`. This proves the
anisotropic parameter bound without pretending all rectangles are
axis-aligned. Deleting the initial flat range `λ=log_N(1/θ)` costs
zero, so the remaining prefix cost is unchanged.

The positive-deficit argument (`lem:positive-deficit`, local:1034–1258)
fixes the global slab label on each index before choosing local plates.
With small endpoint deficit, the weighted set theorem captures nearly
maximally elongated global slabs. Their shape inequality is

\[
(q+h_0)A+h_0(1-B)+(H-h_0)+\Pi(1)\le e_1+o(1).
\]

At the same central queries, original own-slab multiplicity is at least
`mN^{−e₁−α−o(1)}` and local plate multiplicity at least `mN^{−o(1)}`.
These are *query thresholds*, not event-retention costs. Fine multilinear
planarity and separated rich pairs compare the actual direction-plane
normals, hence their spatial thin axes. The displayed error
`N^{−1+O(e₁/h₀)+c*/10}+N^{−9c*/10+ξ/2}+N^{−ξ/2}` is smaller than
`θ=N^{−ξ/4}` after fixed choices. Consequently the anisotropic lower
bound is really `m/θ`, with no extra `N^{−e₁−α}` factor.

Its hybrid upper bound is `mθ^{H−1−h₀}`. Relative to `m/θ` this
has strict gain `θ^{H−h₀}`. All fixed small-deficit choices are
independent of `H−h₀`; only the realizing resolution must be chosen
after that positive gap and the particular flat scale. Hybrid endpoints
therefore have a uniform positive deficit as `h₀↑h`, and compactness
gives an exact equality with positive endpoint deficit.

## 5. Compatible canonical construction and stationary output

Decreasing `p` in an exact equality gives `α≤v=−h_p`, hence `v>0`.
Perturbed greedy packet capture at any prefix gives, after fixing the
perturbation before its resolution and letting tolerance be smaller,

\[
(F(\kappa)-v\chi)\dot p+
\left(h_z\chi+\int_0^\kappa\mathcal D_q(q,F')-\mathfrak a\right)
\dot z\ge0.
\]

In particular the two signs of `dot p` supply cuts on both sides of
`χ=F(κ)/v` (`lem:derivative-capture`, stationary:55–159).

In a finite chain, spatial cell widths multiply and logarithmic aspect
loss adds. If old outer length is `L=1−χ_old`, cumulative shape changes
by `L(a',u')`; physical time remains the same. Selecting the smaller
side gives `Δχ≤ΔF/v`. Later cuts use coarser nested physical blocks.
Every filled later event therefore comes from an original occupied
earlier index-block pair. Pullback restores all preceding selected
events of the hit pair; later ownership is constant on it, so this
restoration does not invalidate later memberships. Deficiency cleaning
against each earlier packet's original event mass preserves its active
weight, because count per index-block is homogeneous. This resolves
same-family pullback, not merely existence of unrelated saturated
families (`lem:nested-cuts`, stationary:191–312).

An additional pullback stress test is that a later cumulative cell
exponent `χ_new` can exceed an earlier physical block exponent
`κ_old`. It is unnecessary to rule that out: **undo the transformations
one immediate step at a time in reverse order**, not by mapping final
events directly to the oldest token grid. For step `r`, its *own* cut
has `χ_r≤κ_r`, so the aligned `I_r` tokens on an index do not merge
after that step's filling/rebinning. Let each occupied token have
pre-cut event count `A_r=N^{a_r+o(1)}` and post-cut filled count
`B_r=N^{κ_r−χ_r+o(1)}`; both are common in exponent. If a subsequent
selection retains fraction `σ=N^{−o(1)}` of that immediate post-cut
graph, the inherited weight of its hit tokens is at least
`σN^{−o(1)}` times the full token weight, since each hit token supplies
at most `B_r` events. Restoring every pre-cut selected event on each
hit token therefore retains the same subpower fraction of pre-cut
incidence `A_r` times token weight. The restored graph is now a subset
of the *previous* post-cut graph, where `χ_{r−1}≤κ_{r−1}` again lets
one undo the previous step. Finite composition preserves extensivity.
The possible many-to-one collision of the oldest token grid at the
final resolution is never used in this comparison. Restored events
retain all later memberships because later physical ownership blocks
are coarser nested blocks and the ownership decision is constant on
each earlier index-block. Include every original packet-label partition
in the final finite deficiency cleaning; common event counts on its
physical block convert retained packet event mass back to retained
assigned active-index mass. No one-to-one identity across nonadjacent
resolutions is assumed.

For adjacent packets at angle `θ≫a/b`, disjoint larger-packet index
sets fit in enclosing widths `(θb,b)`; their number is at most
`N^{O(mesh)}θ^x(b/a)^x`. Each intersection fits in `(a,a/θ)`.
Dividing by smaller saturation gives the fraction

\[
N^{O(\mathrm{mesh})+o(1)}(a/(\theta b))^{y-x},
\qquad y-x=q+2h>0.
\]

Thus orientation tolerances add as angles along a finite chain; the
smallest aspect exponent, not the sum of aspect exponents, controls
the result. The anisotropic inner model at running minimum
`D*=min_{τ≤s≤κ}(s−F(s)/v)` has normalized delay
`(τ−D*)/(κ−D*)`, deficit `F(κ)/(κ−D*)`, and matching lower/upper
exponent `mN^{D*}` (`lem:angle-packing`, stationary:330–432).

For canonical rigidity (`prop:canonical`, stationary:436–583), a new
record minimum of `s−F(s)/v` gives an inner equality of deficit exactly
`v`; if there were no new minimum, a positive-deficit inner equality
would have zero delay, contrary to flat delay. The infimum `τ*` over
deficit-`v` delays is positive: if delays approached zero, a compact
limit would have a flat interval; a late member's fixed record prefix
there has `s=1−h/4, γ=0, μ=1` and positive `F_j(κ_j)`, contradicting
`Π>F`. Its positive gap is fixed only after choosing that member, which
is sufficient; no uniform lower bound on those values is assumed.

At the first passage of `g(s)=s−F(s)/v` below `D'∈(0,τ)`, both inner
and outer equalities have deficit `v`. The inner/outer delay inequalities
are

\[
\tau-D'\ge\tau_*(s-D'),\qquad
D'\ge\tau_*(1-s+D').
\]

The outer cut has `χ=F(s)/v`: outer deficit at most `v` forces the
upper inequality on `χ`, and reverse derivative capture attains it.
First-passage values strictly below `D'` occur arbitrarily soon after
`s`; therefore `F` increases arbitrarily soon after `s`, so the outer
delay is the *exact* displayed value. For profiles with delays tending
to `τ*`, the two passage inequalities force
`s→1−(1−τ*)D'/τ*`. Compactness then gives

\[
F(\kappa)=\beta(\kappa-\tau)_+,
\quad \ell=1-\tau,\quad \beta=v/\ell\le1.
\]

On this profile outer cuts with `χ=b'` reproduce the same canonical
profile. Both signs of `dot z` together with arbitrarily large negative
`dot p/dot z` force `Δχ=Δb'` and choices on either side of
`Δa=wΔb'`, where `w=h_z+ℓD_q(q,β)∈(0,1]`. Alternating the two
choices when the running `a` lies above/below its desired value tracks
`a=wb'` with at most one mesh increment of error. There is no assumed
convex combination of unrelated packet families
(`lem:stationary-shape`, stationary:597–657).

Set `ρ=1−w`, `B*=h+ℓP(β)`, reverse `c=1−b'`, and use the collapsed
law with one atom of inherited weight `ω_i` per occupied initial
`I₁` pair. Uniform pre-collapse event counts make this law equivalent
in exponent to the old event law, not to uniform line count. The
stationary outputs (`prop:stationary-data`, stationary:727–864) are

\[
R_c=N^{-\ell c},\quad\Theta_c=N^{-\tau c},
\quad n_c=\Delta_hN^{(B_*+\tau)c+dw(1-c)},
\]

\[
(L_X,L_Y,L_U,L_V)=
(N^{-\rho-wc},\ L_X\Theta_c^{-1},\ L_XR_c^{-1},\
 L_X(R_c\Theta_c)^{-1}).
\]

Each index has one packet owner on its physical block. Between `I_c`
and finer `I_b`, its occupied descendants number
`N^{ℓ(1−β)(b−c)+o(1)}`. Its normals in `I_c` span
`Θ_cN^{o(1)}`. Changing event normal or time center costs the exact
width-ratio shears, hence only a subpower expansion. Packet mass
follows by direct substitution into the local threshold; ownership
and lower masses survive the same prescribed cleaning list.

## 6. Angular Frostman: one restriction, two consequences

Two-budget cleaning (`lem:estimate-cleaning`, estimates:50–181) is
essential. Original packet/time/chart partitions are charged against
original mass with cutoff `N^{−E−ε_N}`. Newly computed labels are
charged against their own pre-label restricted graph with cutoff
`N^{−ε_N}`. The two total charges are separately `o(M)` of the
selected label-class mass. This preserves old packet lower masses
without claiming new conditional labels were computed on the old law.

When selecting finer events, register each hit `(i,J)` token of weight
`ω_i` *before* completing its block and before chart-portion pruning.
Common original event counts imply token retention at least the original
event fraction. Keep every predicate-dependent chart tag; completion
cannot change a predicate constant on that tagged token. Subsequent
chart deficiency is measured against the restricted completed token
graph, whereas packet references remain original.

For `lem:angular-frostman` (estimates:185–390), let `g=b−c`,
`θ=N^{−τb}`, `K'=N^{b−ℓc}`, and `S=n_bN^{−τb}`. In B_b outer
parents, the original local bound is

\[
n_W\le S N^{-\ell gP(\beta)}(K')^{-h}a_1^xb_1^yN^{o(1)}.
\]

Selecting one violating angular bin on each bad index/I_c costs
`E=γτg`. Registering/completing hit `I_b` tokens and cleaning gives
surviving packet mass `SN^{τb−E−o(1)}`. This is the original packet
mass times the one restriction loss, not a second independent choice.
The routed uniform child profile has all-gap deficit increments at
least the old ones, endpoint increase at most `E`, and therefore cost
increase at most `pE`.

Anisotropic normalization has resolution `N_new=N^{ℓg}` and original
plank parameter at most
`SN^{−ℓgP(β)}(K')^{−h}θ^{−y}`. Its sharp bound without losses is
exactly `SN^{τb}`; losses place it within `(p+1)E` of the packet
lower bound. The normalized endpoint deficit is at least `β`, since
each selected time tree is a subtree before filling.

At fixed small `t*>0`, differentiability gives
`0≤h(p−t*,z)−h≤(v+β)t*/2`. Increasing `h` does not increase
the plank parameter, and changing `p` subtracts `t*` times the
deficit. Thus the same models gain at least
`ℓg(β−v)t*/2` in original logarithmic units. Choosing

\[
\gamma<\ell(\beta-v)t_*/[8(p+1)\tau]
\]

makes this strictly exceed `(p+1)γτg`. A positive-probability or
subpower-probability bad-fiber subsequence is impossible. Testing finitely
many gaps first then diagonalizing provides the angular conditional
law. Subpower many coarse bins per index/I_c and deficiency cleaning
allow conditioning on typical `e_c` bins without another polynomial
loss. If `β=1`, an index/I_c has only subpower many `I₁` atoms, one
angular bin at `b=1` has subpower mass, and the fixed-gap Frostman
bound contradicts it. Thus `0<β<1`, so the outgoing time exponent
is genuinely positive.

## 7. Conditional X: reference masses are not the event law

For `lem:conditional-X` (estimates:413–893), fix admissible
`0<a<w(1−c)` and small `Δ`, then set

\[
g=(a+\Delta)/w,
\quad D_0=N^g,\quad D=N^\Delta,
\quad Z'=N^{\tau g},\quad S'=n_b/Z'.
\]

The source admissibility guarantees `c<b<1`, `τg>Δ`, and the
finer-frame time/angular errors strictly smaller than the extra `X`
precision. An anisotropic I_c normalization and isotropic matrix
parents make the queried `Q(c,a)` cell diameter exactly
`N^{−ρg−a}=N^{−g+Δ}=D/D₀`. A B_b packet has geometric plate dimensions
`1×Z'×Z'` in D₀ fine units and assigned mass `S'Z'` in exponent.
Bounded time/normal shears are permitted; four rectangular coordinate
widths need not remain coordinatewise unchanged by those shears.

Define `n_C` using *all original active I_c indices* in the chart cell,
even if they never have the finer label. Pullback of arbitrary rectangles
gives `Δ₀≤S'D₀^{−B*}`. Original indices partition within each chart,
so this is not a selected-event probability bound.

Suppose failed queries satisfy
`n(C∩P)<n_CD^{−x}N^{−ε}` on an extensive set. Both `C` and the
packet owner are constant on tagged `(i,chart,I_b)` tuples. Complete
hit tuples before chart pruning, preserving the failed predicate and
packet mass. Choose a common frequency

\[
\mathsf w(C,J)/n_C=N^{-r+o(1)}.
\]

There are polynomially many `(chart,C,J)` tests even though the number
of original weighted indices is arbitrary. Ratios below `N^{−A−3}`
contribute only `N^{−3}n`; original token weight is at least
`nN^{−o(1)}`. One subpower ratio level is extensive. Its deficiency
references are the selected `w(C,J)`, not the larger sum of `n_C`.
Thus ratio, packet masses and child time-tree tests coexist.

Replace each occupied `C` by its center of weight `n_C`, with the
union of registered times. At every representative event, child weight
is `N^{−r+o(1)}n_C`. This compares the *normalized event laws* by
subpower factors; it does not equate index weights or assume identical
temporal supports before regularization. Since every old line in `C`
lies within a coarse cell of its center throughout the whole I_c,

\[
\Delta_{\rm rep,h}\le S'D_0^{-B_*}D^dN^{o(1)}.
\]

The delicate cost argument is valid in the source's stated order
(estimates:684–738). Interpolated children have

\[
F_{\rm ch}(\kappa)=
\beta(\kappa-(\tau g-\Delta))_+,
\quad0\le\kappa\le g-\Delta,
\]

so cost `ℓgP(β)`. If representative excess is extensive, first restrict
and regularize representatives and then **keep that graph fixed**.
Pull back its event restriction using the frequency-law comparison.
Extensive child regularization preserves the child profile, while
every surviving child subtree remains inside its fixed representative
time tree. For each tested gap and a surviving child block, uniform
representative descendant count is at least the child's descendant
count. Therefore

\[
G_{\rm rep}(t)-G_{\rm rep}(s)
\le F_{\rm ch}(t)-F_{\rm ch}(s),
\quad G_{\rm rep}'\le F_{\rm ch}'\quad\text{a.e.}
\]

Increasing `P` then gives representative cost at most `ℓgP(β)`.
This resolves the concern about different children occupying disjoint
branches: the comparison is inside a particular *surviving* child
block after the representative has been frozen, not between aggregate
endpoint counts. The critical upper bound at D₀/D is consequently

\[
[S'D_0^{-B_*}D^d](D_0/D)^hN^{\ell gP(\beta)}
=S'D^{d-h}.
\]

A packet hashes to at most `N^{o(1)}Z'/D` spatial cells per coarse
time, so its child mass at a typical hashed cell is at least
`S'DN^{−ε/4}`. Failed query cells instead contribute at most
`n_CD^{−x}N^{−ε}` each, and the representative bound makes their
sum at most

\[
S'D^{d-h-x}N^{-3\epsilon/4}
=S'DN^{-3\epsilon/4},
\]

using `d−h−x=1`. The contradiction proves typical reference mass
`n(C∩P)≥n_CD^{−x−o(1)}`. Representative exceptions transfer to child
events because non-extensive fixed-margin exceptions are power-small
and the event laws differ by only subpowers.

Finally, full-time packet containment puts reference indices near the
queried normal position at its actual time without requiring their
shadings to visit that time. For the finer center `L=e_{c+σ}`, exact
moving-frame identity gives relative errors
`N^{−τg}`, `N^{−τσ}`, `N^{−ℓσ}`, and `N^{−σ}`, all smaller than
`N^{−Δ}` by fixed admissibility. The full reference histogram on
`(C,L)` therefore has mass at least `D^{−x−o(1)}` in a subpower
enlargement of every good query bin. Convolve by that enlargement and
mix with the uniform law on the `N^{Δ+o(1)}` possible bins. This
positive reference law has good-event surprise at most
`(xΔ+o(1))log N` and all-event surprise `O(log N)`. Vanishing bad
probability contributes `o(log N)`. Relative entropy gives

\[
H_N([X_L]_{c,a+\Delta}\mid C,L)\le x\Delta+o(1).
\]

Removing auxiliary chart conditioning costs only `o(log N)`:
given `Q(c,a),L`, the coarse `e_c,I_c` are determined and that Q cell
meets only boundedly many matrix parents; any remaining routing is
subpower. No packet-owner or I_b label is conditioned upon in the
histogram. Thus the exact outgoing bound is

\[
\limsup H_N([X_{e_{c+\sigma}}]_{c,a+\Delta}
\mid Q(c,a),e_{c+\sigma})\le x\Delta.
\]

It is an entropy increment upper bound. It is *not* by itself a
pointwise Frostman law; C2 must retain the later joint-cell/domain
regularizations when turning entropy into conditional mass laws.

## Integration handoff and limits of this review

C2 may use the following on one shared weighted stationary sequence,
for finite tests first and countable diagonals afterward: canonical
`τ,ℓ,β,w` with `0<τ,ℓ<1`, `0<β<1`, `0<w≤1`; the four packet widths;
inherited original local plank upper bounds; assigned active masses
`n_c`; fixed index/block ownership; positive time exponent `1−β`;
angular Frostman exponent `γ>0`; and Conditional X's precise
`Q(c,a),e_{c+σ}` conditioning. No independence of matrix, event frame,
encounter time, or query shading has been introduced.

External matching is delegated to Main, not assumed accomplished by
this note. In particular the current proof uses set density tolerance,
quantitative planar Frostman tolerance with the retained shading count,
multilinear transversality at shrinking angular scales, and the named
BV theorem. Beyond those interfaces, this C1 review leaves no identified
internal obligation open. C2/root acceptance still requires its own
written entropy, projection, regime-closure and maximal-reduction
derivations; this report does not assert those results.

No source edits, product changes, API/UI/build/DB/Git operations, scratch
copy, dependency installation, or deletion were performed. Only this
mathematical review note was added.

## Integrated-report seam check

Main requested a second, targeted reading of integrated sections 3–6,
seams A–C, and the C1→C2 interface. Those statements agree with the
reconstruction above subject to two precise language corrections sent
to Main: a restriction with fixed polynomial loss `E>0` is not itself
“extensive” (use the general retention hypothesis, with extensive as
`E=0`), and seam A restores the **previously selected pre-cut events**
of a hit token, never events outside the graph on which the immediate
cut was performed.

For arbitrary positive inherited weights, the immediate-step proof can
be written without a cardinality assumption. If `T_r` is the sum of
token weights, common pre/post counts give
`I_pre=A_rT_rN^{o(1)}` and `I_post=B_rT_rN^{o(1)}`. A selected post
incidence fraction `σ=N^{−o(1)}` hits token weight at least
`σT_rN^{−o(1)}`, because each hit token supplies at most
`B_rN^{o(1)}` events. Restoring its selected pre-cut events yields at
least `σI_preN^{−o(1)}` incidence. This uses no lower bound on an
individual `ω_i`, no uniform law over indices, and no bijection
between nonadjacent resolutions. After undoing each step, the graph is
again a subset of the previous immediate post-cut graph, so the proof
iterates. Packet membership survives because ownership depends on the
index and its later coarser physical block. Original active mass in
Conditional X remains distinct from both these selected child masses
and the collapsed event probability law.

No incorrect geometry-to-analysis statement or circular geometric closure
was identified in that integrated seam reading. This statement is not a
vote for the root disposition and does not re-review the C2 analysis.
