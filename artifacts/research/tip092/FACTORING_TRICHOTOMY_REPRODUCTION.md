# Main Lemma 1: factor before classify

Date: 2026-10-09. Target unchanged: `K_KT(beta) => K_F(beta)` in R3.
Mode: source-assisted REPRODUCTION_AUDIT, owner-approved alternate organization.
Status: **conditional normalized derivation; not independently certified**.
The earlier G1 lower-obstruction transfer is NOT proved by this note. It is
avoided by using a different, explicitly approved source decomposition.
Original solver/critic, UI verdict UNRESOLVED and predecessor note are preserved.

## 1. Sources and exact dictionary

- Wang–Zahl, arXiv [2502.17655v1](https://arxiv.org/pdf/2502.17655v1),
  printed25–26 Definitions1.3′/4.1/4.4, printed51 Definition6.1/Theorem6.2,
  printed52 Proposition6.3, printed56–60 its proof.
- Guth–Wang–Zahl, [2601.14411v1](https://arxiv.org/pdf/2601.14411v1),
  Lemmas3.7/3.9 and Remark3.6, Proposition5.1/Lemma5.11, Lemma6.4,
  Lemma6.9, Theorem7.3. Printed15 formula(31) visually checked against PDF.

For a finite family U inside a convex domain K, write

\[
 D(U)=\sup_{V\text{ convex}}\frac{\sum_{U_i\subset V}|U_i|}{|V|},\qquad
 C_F(U,K)=\frac{D(U)}{\sum_i|U_i|/|K|}.
\]

Original `C_KT-CW(U)` equals D(U). Original `C_F-CW(U)` equals
`D(U)/sum|U_i|`, so `C_F(U,K)=|K| C_F-CW(U)` for the family in K.
Intersecting test sets with K does not change the supremum; affine normalization
of K makes the Frostman constants agree up to fixed unit-domain constants.
Affine normalization preserves D itself (both volumes acquire the determinant).
`C_F-SW` tests only slabs and is weaker: it is NOT identified with C_F-CW.
Original E/D estimates are NOT identified with K_KT/K_F anywhere in this note.

The geometric Proposition6.3 does not assume E or D. Given
`zeta1 >= zeta2 >= zeta3 > 0` and sufficiently small input eta, it refines T,
then provides at least one of:

1. A: Frostman at every scale in ORIGINAL Definition6.1.
2. B: balanced partitioning covers at tau and rho, tau/rho <= delta^(zeta1/5);
   fine normalized fibers have C_F <= delta^(-zeta2); middle normalized fibers
   have D <= delta^(-zeta2) and cardinality >= delta^zeta2 (rho/tau)^2;
   outer cover has C_F <= delta^(-eta) up to subpower factors.
3. C: planks a x b x 1, a/b <= delta^(zeta2/100), Frostman above AND below
   with error O(delta^(-zeta3)), and local D(W[N_b(W)]) <= delta^(-zeta3).

These are properties of the RETAINED family. We do not first classify a parent
and subsequently assume that its lower obstruction survives refinement.
Proof read through its terminating scale-selection argument: the bad non-flat
alternative forces a smaller width (a factor at least delta^(zeta2/20)); there
are at most 20/zeta2 such repetitions. It is not an unbounded branching search.
Proposition4.6 and the source's cover regularization remain named prerequisites,
not newly independently proved results.

## 2. Accounting conventions

Fix `0 <= beta < gamma <= 1`, assume K_KT(beta), K_F(gamma), and put

\[
 d=\gamma-\beta>0,\quad F_\gamma(r,n)=r^{-2\gamma}(r^2n)^{1-\gamma/2}.
\]

Tubes are essentially distinct: `N <= C delta^(-4)`. Tube volume is comparable
to delta^2; all fixed geometric constants are absorbed by a further arbitrarily
small exponent slack and sufficiently small delta.

Before invoking the cardinality-only Proposition6.3, pigeonhole shading density
so the individual |Y(T)|/|T| are within a fixed factor. Its retained cardinality
then gives retained shading MASS. Without this step cardinality retention would
not justify a multiplicity estimate for the original shaded family.

For each fixed parameter choice, source subpower refinements/logarithms can be
bounded by delta^(-kappa), for any chosen kappa>0 after reducing delta0. Upper
Frostman bounds inflate by at most the inverse retained fraction; upper D bounds
only decrease on subsets. Balanced occupancy must be repigeonholed after shading
 refinements. Let L_A,L_B,L_C record the total finite exponent losses from these
operations, product inequalities and normalized analytic error terms.

No numerical universal coefficient for these losses has been measured or
certified. Claims below with L_i are explicit CONDITIONAL inequalities; assigning
them zero would invalidate this audit. A source-assisted closure must show the
losses are finite multiples of the indicated small parameters, with constants
independent of delta, before choosing the parameter hierarchy.

### Overlapping plank cover: do not assume it is a partition

Original Proposition6.3(C)'s STATEMENT only provides a balanced cover via
Proposition5.1(B); it does not explicitly promise an almost partition. Its actual
construction in §6.1 Step2 uses Proposition4.6, whose covers are subpower-almost
partitioning. Step5 explicitly retains the same bounded-ownership property and
returns to that construction; there are finitely many repetitions. This extra
property must be retained from the construction, not read into the bare statement.

There is a direct labeled-family bridge for a K-almost partitioning cover.
For every original T let m(T)<=K be its number of covering planks. Introduce a
copy indexed (T,W) for each containing W. Split the measurable shading Y(T) into
m(T) disjoint pieces of equal volume, assigning one to each copy. The union of
all pieces is the original union, and their total shaded mass is unchanged:
the labeled family's multiplicity equals the original multiplicity EXACTLY.
Its cardinality is at most K*N; individual densities fall by at most K.
Each W fiber still contains one geometric copy of every original T in T[W], so
its Frostman bound and its tube-packing estimate remain valid. We have not made
an arbitrary ownership partition that could destroy a lower fiber count.
The labeled family now has a genuine partition by W, as needed for the
streamlined Proposition5.1. Its proof uses sums over labels and does not require
distinctness across different fibers; distinctness is used only for the separate
inner packing bound, where it still holds. Source4.2(D) also explicitly permits
multisets for Wolff constants. Debits: input density loses a factor K, and the
F_gamma count factor loses at most K^(1-gamma/2). With subpower K these are
arbitrarily small exponent losses, not zero losses.

This addresses the cover-versus-partition mismatch analytically. The final
reproduction audit must still track the subsequent balanced shading selections
and fixed affine/dilation normalizations through all branches. No machine
checker or second independent analytic reviewer has certified this bridge.

## 3. A: genuinely every-scale Frostman

Use original Theorem6.2 DIRECTLY, because original Definition6.1 permits a nearby
scale rho in [rho0,K rho0). Do not silently substitute the stricter fixed-scale
Definition7.1 of the streamlined paper. Choose zeta1 and input density tolerance
small enough for output exponent gamma/2. It yields U >= c delta^(gamma/2).
Thus

\[
 \frac{\mu}{F_\gamma(\delta,N)}
 \lesssim\delta^{3\gamma/2}(\delta^2N)^{\gamma/2}
 \lesssim\delta^{\gamma/2}.
\]

Here sum|Y| <= C delta^2 N, so dropping lambda is an UPPER bound, not an equality.
For original T, the gain is gamma/2 - L_A. This branch depends on the published
sticky theorem, not on our own independent proof of it.

## 4. B: middle Katz–Tao gain

Let r=tau/rho, n=#middle fiber, X=r^2 n. Source lower cardinality and upper
D give

\[
 \delta^{\zeta_2}\le X\lesssim\delta^{-\zeta_2}.
\]

The exact exponent identity is

\[
 \frac{n^\beta}{F_\gamma(r,n)}
 =r^{2d}X^p,\qquad p=\beta-1+\gamma/2,\quad |p|\le1.
\]

Hence X^p <= C delta^(-zeta2). Generalized K_KT via Lemma3.7, using
Remark3.6 with baseline delta, contributes additionally
delta^(-q-(1-beta)zeta2). Therefore

\[
 \mu_{mid}/F_\gamma(r,n)
 \lesssim\delta^{2d\zeta_1/5-q-(2-\beta)\zeta_2}.
\]

Fine and outer fibers use generalized K_F(gamma), Lemma3.9, contributing
q each and their Frostman errors to power 1-gamma/2. Two applications of
Lemma5.11 provide compatible shadings and the multiplicity product. With balanced
occupancies n_f,n_m,n_o, n_f n_m n_o is comparable to the retained N, and

\[
 F_\gamma(\delta/\tau,n_f)
 F_\gamma(\tau/\rho,n_m)F_\gamma(\rho,n_o)=F_\gamma(\delta,n_fn_mn_o).
\]

Thus the B gain is `2d zeta1/5 - L_B`. Before cover/refinement losses, L_B
contains `3q + (3-beta-gamma/2)zeta2 + (1-gamma/2)eta`.
If repigeonholing removes children, use the source n lower bound BEFORE that
removal or explicitly add its occupancy loss to zeta2; do not keep the original
n lower bound with no debit. This is an upper/lower count sandwich, not the
unjustified retained lower-C_F inference from the predecessor route.

## 5. C: two plank estimates, with boundary cases

Put r=a/b and c=zeta2/100, so r <= delta^c. A shading refinement and balanced
assignment of tubes to covering planks is necessary to apply Proposition5.1.
If retained upper Frostman/local D error exponent is e (initially zeta3 plus
retention losses), outer shading density has exponent at most
`e+2*input_density_exponent+refinement_loss`, by Proposition5.1(2).

For outer planks, local D gives

\[
 \#\mathcal W[N_{\theta b}(W)]\lesssim\delta^{-e}(b/a)\theta,
 \quad M_{out}=C\delta^{-e}b/a.
\]

All such planks lie in N_b(W), so its local D hypothesis applies. For a fine
fiber normalized from W to the unit domain, tube dimensions become
`alpha x B x 1`, alpha=delta/b, B=delta/a, alpha/B=r. Undoing a thickened plank
gives a delta x (theta b/a)delta x 1 box. Essential tube packing bounds its
occupancy by C(theta b/a)^2 <= C(b/a)^2 theta. Hence `M_in=C(b/a)^2`.

When BOTH b and B are below the Lemma6.4 width cutoff, formula(31) gives

\[
 \mu_{out}\lesssim\delta^{-q}\delta^{-e}
 r^{1-\gamma/2}b^{-2\gamma}(b^2N_w)^{1-\gamma/2},
\]

\[
 \mu_{in}\lesssim\delta^{-q}\delta^{-e(1-\gamma/2)}
 r^{1-\gamma}B^{-2\gamma}(B^2n_f)^{1-\gamma/2}.
\]

Multiply: the pure dimensional/count factor is EXACTLY

\[
 r^{3\gamma/2}F_\gamma(\delta,N_wn_f).
\]

Gross C gain is `3gamma zeta2/200`, with analytic small-width loss
`2q+(2-gamma/2)e`, plus product/retention/occupancy losses.

### Width cutoff is not optional

Choose s>0 and split at width delta^s. For narrow b,B <= delta^s, reduce delta0
to meet the fixed b0. Since a,alpha lie in [delta,delta^c], a shading density
delta^l meets the a^eta_Lemma condition if `l <= c eta_Lemma`. Remark3.6 permits
error delta^(-q), not an unjustified scale-independent constant.

For a wide factor, use the separate Lemma6.9 estimate. Its paper leaves the proof
to the reader; an explicit L2 derivation is given below rather than treating this
omission as independent verification. For thickness h in [delta,delta^c],
width w >= delta^s, C_F <= C delta^(-e), density >= delta^l, choose

\[
 E>\max(s,e,l)/c.
\]

Then w>=h^E, C_F<=h^(-E), lambda>=h^E after constant slack, and Lemma6.9
yields U >= h^(8E) >= delta^(8E). Consequently mu <= C delta^(-8E) h w n.
This verifies the RELATIVE-THICKNESS hypotheses rather than applying Lemma6.9
with delta in place of the actual thickness.

For the inner factor its shaded-mass upper bound is r B^2 n_f. Divide by the
desired inner pure factor above to obtain

\[
 r^\gamma B^{2\gamma}(B^2n_f)^{\gamma/2}\le B^\gamma\le1,
\]

using n_f <= C (ab/delta^2)^2 = C r^(-2) B^(-4).

For the outer factor the ratio of abN_w to its desired pure factor is

\[
 (ab^5N_w)^{\gamma/2}.
\]

A conservative b-resolution net for unit segments has O(b^(-5)) cells (three
center coordinates, two long-axis direction coordinates). This deliberately
does not rely on the sharper four-parameter tube convention. Partition into
sufficiently small cells and choose an occupied representative W_0 in each.
Every plank of that cell lies in N_b(W_0): its long segment moves O(b), and its
cross section has radius at most b/sqrt(2), leaving a fixed margin if the cells
are small enough. Rotation about the long axis need not be discretized, since
all these cross sections lie within that radius of the axis of W_0.
Local D bounds each cell size by C delta^(-e) b/a. Therefore
N_w <= C delta^(-e)/(a b^4), and the ratio is
<= C delta^(-e gamma/2) b^(gamma/2) <= C delta^(-e gamma/2).
This argument is for the congruent/comparable rectangular planks of the source,
not arbitrary convex multisets, and uses LOCAL D, not global C_F alone. Fixed
comparability constants require finite chart subdivisions or fixed dilations
whose effects must be debited in the final geometric normalization.

Thus either wide factor also obeys the desired pure bound, with loss at most
`8E+e gamma/2` (outer) or `8E` (inner). Mixed narrow/wide cases multiply those
bounds. The boundary route is explicit; it does not invoke Proposition6.6(A)
with its stronger local factoring hypotheses silently assumed.

### Explicit L2 check of the slab shortcut

Let S consist of congruent h x w x v slabs in a fixed unit ball, with
`w,v >= h^E`, shading density lambda >= h^E, and C_F(S) <= h^(-E).
Set `f=sum 1_Y(S)` and N=#S. For a fixed S_0 and dyadic angle
`theta in [h,1]` between the planes of its two longest axes, any slab S intersecting
S_0 at this angle lies entirely in a convex slab of thickness C*theta about that
plane, intersected with the fixed ball. Reason: at the intersection the normal
distance is O(h), and over diameter O(1) the plane tilt changes distance by
O(theta). Frostman therefore gives at most C*C_F*theta*N such S.
The intersection of the two enclosing full-width plane slabs has volume at most
C*h^2/theta. Consequently each angular bin contributes at most

\[
 \sum_{S_0}\sum_{S\text{ in bin}}|Y(S_0)\cap Y(S)|
 \lesssim C_F N^2h^2.
\]

For the almost-parallel bin theta<=h, use a convex C*h slab, giving at most
C*C_F*h*N neighbors and intersection volume at most C*h. This includes the
diagonal terms and has the same bound. Thus

\[
 \int f^2\lesssim C_F N^2h^2\log(2/h),\qquad
 \int f\asymp\lambda N h w v.
\]

Cauchy–Schwarz gives

\[
 |U|\gtrsim\frac{\lambda^2w^2v^2}{C_F\log(2/h)}
 \gtrsim\frac{h^{7E}}{\log(2/h)}\ge h^{8E}
\]

for sufficiently small h depending on E and the fixed constants. For planks,
v=1 yields the stronger h^(5E)/log bound, but 8E is sufficient here.
The proof uses the actual convex Frostman constant (not just slab constants with
an unstated normalization), equal comparable volumes, bounded diameter, and
positive E. It is an analytic derivation, NOT Lean or a machine proof certificate.

## 6. Parameter order and conditional improvement

For fixed beta<gamma, first choose zeta1 small enough for branch A. Choose
zeta2 small compared with d*zeta1, then c=zeta2/100 and target C gross gain
g_C=3gamma*c/2. Choose s so `16s/c << g_C`; then zeta3, input eta and each
refinement exponent kappa so e,l << s and density conditions for narrow planks
hold. Choose analytic q << min(g_C,2d*zeta1/5,gamma/2). Reduce delta0 LAST.
This is an existence order, not a computed runnable tolerance or measured rate.

If the stated source product/refinement hypotheses and finite loss debits have
been justified, all three branches yield a uniform positive residual g, so
mu <= delta^g F_gamma(delta,N). Since N>=1,

\[
 \frac{F_\gamma(\delta,N)}{F_{\gamma-\nu}(\delta,N)}
 =\delta^{-3\nu}N^{-\nu/2}\le\delta^{-3\nu},
\]

choosing `0<nu<min(g/3,(gamma-beta)/2)` gives K_F(gamma-nu).
Pointwise positive improvement alone would not justify an unbounded iteration.
Instead, the exact epsilon quantifier permits the closed-set argument below;
no uniform iteration count or new runtime campaign is claimed.

### Base K_F(1): direct tube L2 bound

For a fixed delta-tube T_0, tubes meeting it at dyadic axis angle
theta in [delta,1] lie in a convex O(theta) x O(theta) x O(1) tube. Frostman gives
at most C*C_F*theta^2*N such tubes. Their intersections with T_0 have volume
at most C*delta^3/theta. The almost-parallel bin has C*C_F*delta^2*N neighbors
and intersection volume C*delta^2. Consequently

\[
 \int(\sum_T1_{Y(T)})^2\lesssim C_F N^2\delta^3
 \quad\text{and}\quad |U|\gtrsim\lambda^2\delta/C_F.
\]

There is no angular logarithmic loss here: the dyadic sum of theta is bounded.
Using N<=C*delta^(-4) and sum|Y|<=C*N*delta^2 gives

\[
 \mu\lesssim C_F\lambda^{-2}\delta N
 \lesssim C_F\lambda^{-2}F_1(\delta,N).
\]

Thus for requested output epsilon, choose input eta small enough to absorb
the 3eta exponent from C_F and lambda^(-2), and fixed constants. This is a
source-convention, analytic base proof, not an executed finite test.

### Endpoint by closedness, not presumed finite iteration

Let S={gamma in [beta,1]: K_F(gamma) holds}. It is nonempty by the base proof.
It is upward closed: for h>=0,
`F_(gamma+h)/F_gamma = delta^(-3h) N^(-h/2) >= C^(-h/2) delta^(-h)`.
Fix gamma*=inf S. For ANY requested epsilon>0 choose gamma in S with
0<=gamma-gamma*<epsilon/12. Apply K_F(gamma) with output loss epsilon/2.
Since N>=1,

\[
 F_\gamma/F_{\gamma_*}\le\delta^{-3(\gamma-\gamma_*)}
 <\delta^{-\varepsilon/4}.
\]

The chosen assertion supplies its own input eta and delta0; both may depend on
epsilon and the chosen gamma. Combining losses and absorbing constants yields
K_F(gamma*). This proves the needed closedness without claiming a gamma-uniform
eta. If gamma*>beta, the conditional three-branch improvement applies at
gamma* ITSELF and gives an element of S below its infimum, a contradiction.
Therefore gamma*=beta, provided the branch loss/hypothesis audit is complete.
The beta=1 case is the base; beta=0 uses the same closedness argument. This is
an endpoint epsilon proof, not a finite number of rounds reaching zero.

## 7. Honest result of this window

- Definition mismatch corrected; no E/D substitution.
- Alternative geometric trichotomy identified on the retained family itself.
- A/B and narrow-C exponent calculations derived; wide-C hypotheses and ratios
  spelled out rather than ignored.
- Added explicit L2 slab/base estimates and an endpoint closedness argument;
  no uniform improvement assumption or infinite runtime iteration is substituted.
- Residual technical audit: matched balanced shading/occupancy losses and fixed
  geometric normalization constants in the source-to-current family bridge.
- Therefore G1 alternative route is SOURCE-SUPPORTED, not independently closed;
  G2/root remain UNRESOLVED. No new mathematical theorem or full Kakeya proof.
- No solver/critic rerun, API, code/UI/build/database/Git or infrastructure change.
  Frozen092 attempt remains unchanged. Only audit notes/source rendering added.
