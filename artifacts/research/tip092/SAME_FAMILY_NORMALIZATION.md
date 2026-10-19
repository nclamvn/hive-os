# Branch B: same-family normalization without global recoloring

2026-10-09; owner-routed20min window beginning16:02:46UTC.
Same Main Lemma1 source-assisted reproduction. Supplements the frozen grid/loss
drafts; does not rewrite original solver/critic/UI output or authors' proofs.

## 1. The simplification

Do NOT discard global branches to make enlarged coarse parents essentially
distinct. Keep all original ownership labels and zero-shaded geometric siblings.
Bounded-comparable-multiplicity families admit the generalized analytic estimates
by a LOCAL heavy-color comparison. The color is used only inside an inequality;
it never replaces the family in the incidence graph or in the volume product.

Thus no new simultaneous coloring/pruning algorithm, agent or infrastructure
is needed. The candidate's weighted core remains the only pruning operation.

## 2. Local comparison lemma

Let G be N congruent r-tubes (labels permitted) in a fixed unit domain, with
shading density lambda, and a partition into at most M essentially distinct
classes G_j. M is fixed, independent of the small scales. Choose a class j
carrying at least1/M of TOTAL SHADED MASS, not necessarily the most tubes.
Then

\[
 \mu(G)\le M\mu(G_j),\qquad \lambda(G_j)\ge\lambda(G)/M.
\]

Proof: U(G_j) is a subset of U(G), and N_j<=N, while its shaded mass is at
least the total divided by M. This compares scalar multiplicities without
retaining the color in the global construction.

Write D=Delta_max and p_gamma=1-gamma/2. Upper D is monotone on a subset, so
generalized K_KT(beta), 0<=beta<=1, gives

\[
 \mu(G)\le M a^{-q}D(G)^{1-\beta}N^\beta.
\]

For generalized K_F(gamma), equal tube volumes give

\[
 C_F(G_j)\le(N/N_j)C_F(G),\qquad
 C_F(G_j)^{p_\gamma}F_\gamma(r,N_j)
 \le C_F(G)^{p_\gamma}F_\gamma(r,N).
\]

The N_j powers CANCEL. Hence

\[
 \mu(G)\le M a^{-q}C_F(G)^{p_\gamma}F_\gamma(r,N).
\]

a is the permitted smaller baseline (delta here), subject to the analytic
radius cutoff and density tolerance. Fixed factors M are absorbed with strict
tolerance slack and smaller delta0. Comparable volumes introduce only fixed
comparison constants, or one first encloses them in congruent genuine tubes
as below. No lower count bound on the chosen color is needed: the middle X
bound still uses the ORIGINAL uncolored N. That is the point of this lemma.

For a nominal radius bounded below by a fixed r0, use the earlier elementary
bounded-count argument instead of a small-radius analytic lemma.

## 3. Coherent parent envelopes

Use nested dyadic grids with side lengths comparable to tau and rho, chosen
with rho-grid coarser than tau-grid. For sufficiently small delta,
tau/rho<=delta^(zeta1/5)<1/4. Labels are those of the ORIGINAL partitioning
covers, not recomputed by containment in enlarged parents.

Define, with a fixed large L (e.g. L=16 when cell sides<=tau,rho),

\[
 \widehat T_i=N_{L\tau}(T_i),\qquad
 \widehat R_k=N_{L\rho}(R_k).
\]

If T_i is assigned to R_k, original T_i subset R_k and tau<=rho imply
hat T_i subset hat R_k. A full tau-cell meeting fine shade in T_i lies in
N_(sqrt(3)*tau)(T_i), hence in hat T_i. A rho-cell meeting such tau-cells
lies in N_(sqrt(3)*(tau+rho))(R_k), hence in hat R_k.
At the other dyadic rounding convention, enlarge the fixed L once; no exponent
or scale-dependent increase is needed.

Assigned fine family F_i consists of ALL ORIGINAL fine tubes belonging to i,
including zero-shaded ones. Assigned middle family M_k consists of ALL ORIGINAL
tau-parent labels belonging to k, with envelope geometry hat T_i and zero shade
on inactive labels. It is NOT the family of all tubes newly contained in hat R_k.
Additional geometric containment does not create additional ownership edges.

## 4. Constants and analytic tube conversion

Volumes of envelopes are comparable to the old volumes with factors depending
only on L, since their length is between1 and1+2L for scales<=1.
For every convex V, hat T_i subset V implies T_i subset V. Therefore

\[
 D(\{\widehat T_i:i\in I\})\le C_L D(\{T_i:i\in I\}).
\]

This statement is for each ASSIGNED I, so it retains the source middle D bound.
D is invariant under an invertible affine map because both volumes acquire its
determinant. For fine fibers, all old tubes remain in old T_i, and enlarging the
ambient domain changes C_F by the domain-volume ratio, at most C_L:

\[
 C_F(F_i,\widehat T_i)\le C_L C_F(F_i,T_i).
\]

Affine maps taking hat parents to unit domains preserve lambda and mu exactly.
Their images of assigned children have dimensions comparable to
(delta/tau)x(delta/tau)x1 or (tau/rho)x(tau/rho)x1, with constants depending on
L. Nominal radii are used in F_gamma; replacing them by fixed comparable radii
changes F_gamma by a fixed factor. Three such factors need not multiply to
EXACTLY delta; their product is comparable to delta, which suffices with the
explicit harmless-factor debit. Do not pretend that affine images are literal
Euclidean neighborhoods with identical radii.

To use the genuine-tube analytic lemmas, enclose each normalized comparable
tube in a genuine fixed-length tube with fixed-comparable radius, after one
fixed isotropic shrink to keep the enclosing tubes in the unit ball. Keep its
shade unchanged. Old shape is contained in the new tube and their volumes are
comparable: lambda falls by at most a fixed factor, mu is unchanged, upper D
inflates by at most a fixed factor, and unit-domain C_F does likewise.

These enclosing tubes have bounded comparable multiplicity. Here is the needed
packing reason, rather than a distinctness assertion after arbitrary dilation:
in a narrow parent frame, child long axes are transverse to the parent's short
cross-sectional plane. Under inverse affine normalization, a fixed-comparable
r-neighborhood of a normalized child long axis is contained in a fixed-comparable
old-scale tube. An apparent longitudinal displacement is absorbed along that
axis; its transverse displacement is O(tau*r), the original child radius.
Thus all original children giving comparable enclosing tubes fit in a fixed
multiple of one original-scale tube. Essential tube parameter packing gives
O_L(1) such children, including O_L(1) longitudinal placement bins. For parent
width bounded below, the affine condition number is already bounded, giving
the same conclusion directly. The outer family needs no anisotropic step.

Coordinate check for that transverse assertion: in a narrow original parent of
radius w, the original unit child axis v satisfies |v_horizontal|<=C*w and
|v_vertical|>=c. Write the inverse normalized map as
D=diag(d_h,d_h,d_z), with d_h comparable to w, d_z comparable to1 (L constants
included). For any unit displacement u,

\[
 D u-\frac{d_z u_z}{v_z}v
 =\left(d_h u_h-\frac{d_z u_z}{v_z}v_h,0\right),\qquad
 \|\Pi_{v^\perp}D u\|\le C_Lw.
\]

Therefore a normalized radius r displacement has original transverse size
<=C_L*w*r, exactly the original child scale. Longitudinal size is bounded by
a fixed constant. The normalized reference axis is the image of such a child
axis, so its inverse direction is v. This supplies the claimed fixed-original-
tube enclosure used in the bounded-neighbor packing argument.

The enclosing radius is a FIXED multiple of the nominal radius and that multiple
can be smaller than1 after the isotropic shrink. Therefore use analytic baseline
delta_b=c0*delta, with a fixed c0>0 smaller than all those radius factors. It is
then <= every actual analytic tube radius. Its loss delta_b^(-q) differs from
delta^(-q) by a fixed factor only; strict density slack absorbs the same fixed
change. This corrects the hidden assumption that the unmodified delta would
always be an admissible smaller baseline after normalization.

Connect two enclosing tubes if comparable at the essential-distinctness
threshold. The packing bound gives fixed maximum degree, hence a fixed number
M_L of essentially distinct color classes. Section2 then estimates the WHOLE
assigned family. No color is imposed on the grid/core data.

This uses the same elementary essential-tube packing convention as the source
N<=C*delta^(-4) and the predecessor's inner packing estimates. It is not valid
for arbitrary convex multisets with unbounded identical geometric copies.

## 5. Audit the grid invariants BEFORE applying the comparison lemma

The candidate regularization records both per-cell UNION and SHADED MASS,
with common a1,b1, then common local middle incidence m2 and rho-cell a2,b2.

For completeness, the negligible-cell cut can use a fixed high exponent, e.g.
delta^32. Parent counts and point multiplicities are <=C*delta^(-4), and the
aggregate cell volumes per parent are bounded. Even after the b1 factor in
second-stage mass lifting, a cell-density cut at delta^32 removes at most a
fixed constant times delta^20 fine shaded mass. Initial mass>=c*delta^(2+t),
t<1; its successive subpower fractions dominate that discarded mass for small
delta. All retained density bins and integer multiplicity bins therefore have
O(log(1/delta)) possible values. No uncontrolled minimum of arbitrary measurable
shade volumes enters the harmless-factor ledger.
Cells are disjoint within each grid. All subsequent cuts delete whole
(tau-parent, rho-cell) incidences, hence preserve the first b1 mass relation.

For weighted core thresholds M0/(8A), M0/(8B), M0/(8C), total removed weight
is at most3M0/8, even with iterated deletions: each node/group is deleted once.
At least5M0/8 survives. For each retained rho-cell node, remaining coarse mass
is at least c*b2*rho^3; original local middle incidence is at most C*m2, so its
remaining coarse UNION occupies at least c*(b2/m2)*rho^3>=c*a2*rho^3.
The fine UNION then fills at least c*a1 of every active tau-cell. Taking global
unions of physical cells counts overlapping ownership labels only once.

Original n_f(i) and n_m(k) are comparable across parents up to the source's
subpower balanced-cover factors. Total retained fine mass is at least
sigma*N1*delta^2/P, where N1 is the geometrically retained source family.
No fine fiber has more than C*sigma*n_f(i)*delta^2 original shaded mass, nor
one rho-parent more than C*sigma*n_f*n_m*delta^2. Core degree thresholds give:

- all active fine fibers have density >=sigma/P on ORIGINAL n_f(i);
- all active rho-parents have at least n_m(k)/P active tau-children;
- at least N_rho/P rho-parents remain active.

Projection of a fine tube shade with density sigma/P onto its unit long axis
has length>=c*sigma/P. Its full tau-cell neighborhood therefore has volume
>=c*(sigma/P)*tau^2, and its rho-cell neighborhood >=c*(sigma/P)*rho^2.
Middle density on the ORIGINAL assigned children loses at most another P
from the active-child fraction; the outer shade is also sigma/P dense.
All these are concrete positive-density statements, not inference from a union
volume alone or lower-C_F inheritance under arbitrary refinement.

The final normalized fine UNION in each parent is at most C*a1. The middle
UNION inside each rho-parent is at most C*a2; pruning only deletes incidences.
The GLOBAL fine union is at least c*a1*a2 times the outer cell-shade union.
Consequently it is at least the normalized three-factor volume product up to
a fixed/subpower factor. The affine determinants are already accounted for by
normalizing the parent volumes, as in the original equation(6.4).

All grid, ownership, core degree, mass and volume statements concern the same
uncolored families. The comparison lemma estimates their scalar mu without
changing any of those statements. This closes the coloring/lifting compatibility
obligation that was left open in GRID_TRANSFER_CANDIDATE.md.

## 6. Updated B envelope: no imported O(eta) coefficient

Let kappa cover the TOTAL finite product of source balancing/retention factors,
grid bin counts, affine/enclosure/color constants and fixed powers. Source
parameters are fixed first; choose delta0 last so this product<=delta^(-kappa).
Initial sigma>=c*delta^t, initial chosen C_F<=P*delta^(-2t). The explicit grid
argument then gives, conservatively, H=2t+kappa with:

- all fine/middle/outer density tolerances at least delta^H;
- fine C_F<=delta^(-zeta2-H), middle D<=delta^(-zeta2-H);
- middle X lies between delta^(zeta2+H) and delta^(-zeta2-H);
- outer C_F<=delta^(-H), by original balanced inheritance and active-parent
  fraction, followed by envelope/enclosure comparison;
- transferred mass/count/product comparisons cost at most delta^(-H).

Original middle cardinality is never replaced by a color cardinality. Its
lower bound is preserved by using original zero-shaded siblings. Fine/middle
nominal radii multiply with outer radius to delta, up to the FIXED normalization
factor already in the kappa budget.

Thus section4 of LOSS_NORMALIZATION_AUDIT.md gives

\[
 L_B\le3q+3\zeta_2+8(2t+\kappa)+\kappa<G_B/4
\]

under its explicit parameter order with the NEW coefficient2 in the root t
choice. This does NOT assert that the authors' original O(eta) coefficient is2;
it replaces that construction's use with the grid argument and local comparison.
A/C estimates and their separate source prerequisites are unchanged. The
joined improvement and epsilon-closedness then reproduce the Main Lemma1
implication, relative to those named source geometric/analytic prerequisites.

## 7. Scope of closure

The same-family B normalization/lift/count obligation is analytically discharged
by keeping original labels, coherent envelopes and local rather than global
color comparison. G2's explicit reconstruction budget no longer relies on an
unexplained B transfer coefficient. This is a source-assisted mathematical
derivation, not an independently certified theorem, formal Lean proof, new
Kakeya result or demonstrated advantage over another LLM method.

No independent person/model or machine checker has reviewed this new analytic
bridge. Named source premises (notably the factoring trichotomy, sticky result
and generalized incidence/plank estimates) remain premises; none is a consensus
vote. The frozen earlier UI attempt remains UNRESOLVED and is not relabeled.
Any later review finding a defect must reopen the exact step, preserving this
draft and predecessors rather than silently editing them into a success.
