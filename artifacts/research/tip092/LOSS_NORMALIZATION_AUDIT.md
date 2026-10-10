# Main Lemma 1 — loss and normalization audit

2026-10-09; owner-approved window15:31–16:01UTC, <=30min.
Target: source-assisted reproduction of K_KT(beta) => K_F(beta) in R3.
Not a new result, full Kakeya verification, Lean certificate or blind benchmark.
This supplements, does not overwrite, FACTORING_TRICHOTOMY_REPRODUCTION.md.

## 1. What is borrowed and what is checked

**Named source prerequisites, not independently re-proved here:**

- Wang–Zahl [2502.17655v1](https://arxiv.org/pdf/2502.17655v1):
  Proposition4.6; Proposition6.3 and its construction§6.1; Theorem6.2;
  the two-scale shading construction in printed53 Step2, equation(6.4).
- Guth–Wang–Zahl [2601.14411v1](https://arxiv.org/pdf/2601.14411v1):
  Lemmas3.7/3.9 with Remark3.6; Proposition5.1 and its proof;
  Lemma6.4 with its final Remark3.6 analogue.

The definition dictionary, branch exponent identities, explicit slab/base L2
calculations, overlap handling, fixed geometric comparisons, parameter order
and endpoint argument are checked analytically in these audit notes. They have
not been checked by a separate person, an independent model or a proof assistant.

Let N=#T, lambda=sum|Y(T)|/sum|T|, mu=sum|Y(T)|/|unionY|, and

\[
 p_\gamma=1-\gamma/2,\quad
 F_\gamma(r,n)=r^{2-3\gamma}n^{p_\gamma},\quad
 0\le\beta<\gamma\le1,\quad d=\gamma-\beta.
\]

Tubes are essentially distinct in the source convention, inside a fixed unit
domain: N<=C*delta^(-4). This is needed; arbitrary labeled duplicate tubes are
NOT valid inputs to K_F or the inner packing bound. The special duplicated
family used in C below is passed only to the convex multiplicity product.

## 2. Initial mass and harmless-factor bookkeeping

Assume root C_F<=delta^(-t), lambda>=delta^t, with t selected in section8.
Discard tubes whose individual density is below lambda/2; they carry at most
half the total shaded mass. Dyadically pigeonhole the remaining densities.
The chosen family T_0 has individual density comparable to sigma>=lambda/2,
retains a subpower fraction of shaded mass, and has

\[
 N_0\ge P^{-1}\delta^t N,\qquad
 C_F(T_0)\le C P\delta^{-2t}.
\]

Reason for the extra t: an individual shading is at most full tube volume, so
mass retention alone gives a cardinality fraction lambda/P, not 1/P.
Geometry Proposition6.3 next retains a subpower fraction of N_0. Since the
densities are comparable sigma, this ALSO retains a subpower fraction of shaded
mass. It is legitimate to transfer multiplicity back using Lemma5.5.

Here P represents harmless factors, not a zero loss. For FIXED geometric and
analytic parameters, the source relation A<=subpower B means: for every k>0,
A<=C_k delta^(-k)B (original printed23). A finite product of these factors,
their fixed powers, fixed affine constants, logarithms and the finite source
iterations is still subpower. Put ALL factors used in a branch into one product
P_total(delta). Choose delta0 LAST so P_total<=delta^(-kappa).

Do not move actual delta^(-t), delta^(-zeta2), delta^(-zeta3) terms into P_total.
Those losses are displayed separately below. The source iteration bound20/zeta2
and the stage count1/eta_source are fixed before delta tends to zero; there is
no claim uniform in a stage count that grows like a power of delta^(-1).

## 3. B's shading bridge: use the source construction, not a false equivalence

A balanced partitioning cover is not, by definition, a uniform shaded family
at every scale. The former draft's direct invocation of Lemma5.11 therefore
needs a bridge. We use the ACTUAL original Step2 on printed53: regularize local
union densities on tau-balls, define the induced tau shading, repeat on rho-balls,
and lift the refinements to the original fine shading. This construction is
before any application of E/D and does not depend on assuming E=D=K_KT/K_F.

Its stated outputs include density delta^O(eta) on fine, middle and outer
normalized pairs, and the compatible volume product(6.4):

\[
 U_{fine,total}\ \ge P^{-1}\,U_{out}
 \inf_{T_\rho}U_{mid,T_\rho}\inf_{T_\tau}U_{in,T_\tau}.
\]

These are volumes in their OWN normalized unit domains. The factor of |T_rho|
and the determinants of the changes of variables are accounted for by that
normalization, not added a second time. Printed53 equation(6.4) visually checked.

**Finite source coefficient:** let C_B>=2 bound the finitely many linear-in-t
exponent losses of this fixed two-level construction, its density/cardinality
selections and inverse retained fractions. The printed delta^O(eta) is used in
its usual sense: a finite coefficient independent of delta and of sufficiently
small input eta. C_B may depend on the fixed source/geometric parameters.
There is no numerical value certified for C_B, and we do NOT set it to zero.
The final allowed input t is given explicitly in terms of C_B in section8.
This is a source-assisted use of a quantitative prerequisite, not a new
independent proof of its O(eta) constants.

Why this only costs linear input exponents, rather than a fixed zeta2 density:
the tube-to-tube shading transfer uses the fact that a dense shading of one
fine tube induces a comparably dense neighborhood in its containing coarse
tube (streamlined printed14 proof of Lemma5.11). It does not use the quadratic
C_F^(-1)*lambda^2 convex-factor density bound. Replacing it with that quadratic
bound would incorrectly force zeta2 into the analytic density tolerance.

Count pruning can be made explicit. If each original parent has n children and
a selected child set has relative size f, remove parents with fewer than f*n/2
selected children. At most half the selected children are lost. Pigeonhole the
remaining occupancies, costing a logarithm. If individual shade densities were
first made comparable, this also retains a logarithmic fraction of their mass.
There are only two prescribed parent levels. The input lower densities
delta^O(t) thus give inverse fractions delta^(-C_B*t) times subpower factors,
not an unexplained fixed exponent loss. Upper D is monotone under subsets;
C_F inflates by at most the inverse cardinality fraction. This justifies adding
the same budget to Frostman errors and lower occupancy bounds.

Set H=C_B*t+kappa, enlarging C_B to cover the finite linear input losses and
P_total to cover all harmless factors. A conservative matched envelope is:

- all three normalized shading densities >=delta^H;
- fine C_F<=delta^(-zeta2-H), middle D<=delta^(-zeta2-H);
- delta^(zeta2+H) <= (tau/rho)^2*n_mid <=delta^(-zeta2-H);
- outer C_F<=delta^(-H), using balanced upward inheritance from T_0;
- count comparisons and transfer back to the original pair cost at most
  delta^(-H) in addition to the displayed volume/product factors.

These bounds concern the compatible refined construction, NOT lower-C_F
inheritance from a large arbitrary refinement. Alternatively, keep zero shading
on deleted geometric siblings and use original upper D/count bounds, but one
must then debit the active-parent fraction. The envelope already includes it.

## 4. Analytic scale check and B budget

Remark3.6 allows a smaller baseline delta below the actual tube radius r. It
does NOT remove the condition that r is sufficiently small for the underlying
analytic estimate. Split each factor:

- r<=r_0(beta,gamma,q): use generalized K_KT or K_F with baseline delta,
  shading density >=delta^H; require H<=their input density tolerances.
- r>r_0: essential distinctness gives n<=C*r_0^(-4). Thus mu<=n is bounded,
  and F_gamma(r,n)>=c(r_0)>0. The K_F comparison follows by absorbing the fixed
  constant into delta^(-q). The generalized K_KT comparison also follows because
  D>=c*n*r_0^2. No application of a small-radius theorem at r=1 occurs.

For the middle factor write r=tau/rho, X=r^2*n and
v=beta-1+gamma/2. Since |v|<=1,

\[
 \frac{n^\beta}{F_\gamma(r,n)}=r^{2d}X^v
 \le C\delta^{2d\zeta_1/5-(\zeta_2+H)}.
\]

The middle analytic D term contributes at most zeta2+H; the fine C_F term
at most zeta2+H; the outer C_F term at most H. Three analytic q losses, three
lambda-to-volume conversions, and the count/mass comparison give the safe bound

\[
 \mu(T,Y)\le C\delta^{G_B-L_B}F_\gamma(\delta,N),\qquad
 G_B=2d\zeta_1/5,\quad L_B\le3q+3\zeta_2+8H+\kappa.
\]

Identity used for balanced counts:
`F_gamma(delta/tau,n_f) F_gamma(tau/rho,n_m) F_gamma(rho,n_o)
 = F_gamma(delta,n_f*n_m*n_o)`.
No lambda is canceled as though every shade were full. The 8H deliberately
covers four analytic/density terms and four transfer/count terms; the displayed
middle power is bounded by zeta2+H regardless of its sign.

## 5. C's ownership, mass and count ledger

From the CONSTRUCTION of Proposition6.3, keep its subpower balanced and almost
partitioning plank cover W, not just the abbreviated statement. Each tube has
m(T)<=K owners, K subpower. Split its shading into m(T) disjoint equal-volume
pieces, one for each labeled copy (T,W). The union and shaded mass are unchanged,
so mu of the labeled family equals original mu exactly. Its cardinality
N_dup<=K*N. Every W fiber contains ONE copy of each original tube it contained,
so its original C_F and inner essential-distinctness packing remain available.

Use the convex Proposition5.1 on this labeled partition. Its sum/incidence proof
permits labels; do not feed the globally duplicated family into K_F. Input
density is at least sigma/K. With C_F(fibers)<=C*delta^(-zeta3), the coarse shade
has density >=P^(-1)*delta^zeta3*(sigma/K)^2.

Let n_W be ORIGINAL fiber counts, which are balanced up to a subpower factor.
The proposition's retained shade has at least P^(-1)*sigma*N tube-volume mass,
and any one W contains at most sigma*n_W tube-volume mass. Hence the surviving
W' has a subpower fraction of the original W: compare
`#W'*max n_W >= P^(-1)*N` and `#W*max n_W <=P*N_dup<=P*K*N`.
Consequently C_F(W') inflates only by a subpower factor.

For inner estimation keep the ORIGINAL fiber geometry, assigning zero shade to
removed copies. Its C_F has not changed. The retained total mass and original
total cardinality imply there exists a surviving W with fine shade density
>=sigma/P. Proposition5.1's proof gives the same inner multiplicity up to
subpower factors for all nonempty fibers, so this good-density fiber may be used
in the global product. This does not require a density claim on every untouched
fiber. Finally `#W'*n_W_good <=P*N_dup<=P*K*N`; this is the count debit.

Absorb all of these subpower factors into P_total and set

\[
 e=\zeta_3+\kappa,\qquad
 \ell=\zeta_3+2t+4\kappa.
\]

Both outer and inner C_F are <=delta^(-e), local D remains <=delta^(-e),
inner density is >=delta^(t+kappa), outer density >=delta^ell. Transfer and count
comparison add at most kappa to the final exponent (P_total includes fixed powers).

## 6. C's fixed geometric constants

Use the source's congruent/comparable a x b x 1 planks and John normalization.
Original printed47 confirms normalized fine dimensions comparable to
alpha x B x 1, alpha=delta/b, B=delta/a. Ratios and volumes are only comparable,
not literal Euclidean equalities; determinants preserve mu, lambda and D and
transform C_F by the unit-domain normalization described in the predecessor.

Set c=zeta2/200. Original flatness gives a/b<=delta^(2c); after fixed geometric
constants and sufficiently small delta, the effective ratio r<=delta^c.
Actual outer thickness and fine alpha lie between C^(-1)*delta and delta^c.
The lower constant only changes L2 estimates by a fixed multiplicative factor.

For outer occupancy, local D controls the number of planks in a theta*b x b x 1
thickened plank by C*delta^(-e)*(b/a)*theta. Hence M_out=C*delta^(-e)*b/a.
For the inner factor undo the affine map; the thickened plank contains tubes
in a delta x (theta*b/a)*delta x 1 box. The source's tube packing bound yields
at most C*(theta*b/a)^2 <=C*(b/a)^2*theta. Thus M_in=C*(b/a)^2.

Fixed dilations do not justify silently assuming local D at every larger radius.
They CAN be handled by finite charts: planks inside N_(C*b)(W) have centers and
long-axis directions in bounded C*b parameter ranges. Subdivide at a sufficiently
small b-resolution and the roll angle at a sufficiently small FIXED resolution.
Each occupied cell has a representative V in W, and every plank of the cell is
contained in N_b(V). The number of cells is O_C(1). Local D of a union is at
most the sum of the local D bounds of these cells. This extends the given local
bound to a fixed larger neighborhood with an O_C(1) factor, not a power of delta.

For a GLOBAL count use three b-resolution center coordinates, two b-resolution
long-axis coordinates, and a fixed-resolution roll angle. There are O(b^(-5))
cells, each inside N_b(V) of its representative. Local D bounds each cell size
by C*delta^(-e)*b/a, so

\[
 N_w\le C\delta^{-e}/(a b^4).
\]

This replaces the predecessor's unnecessary restriction that roll never needs
discretizing; for comparable templates a finite roll subdivision is appropriate.
Essential tube packing inside W also gives
`n_f<=C*(ab/delta^2)^2=C*r^(-2)*B^(-4)`.

## 7. C's narrow/wide estimate and A

Split each width at delta^s. Narrow widths <=C*delta^s eventually satisfy the
fixed Lemma6.4 cutoff b0. Let eta_P(q,gamma)>0 be its density tolerance including
the Remark3.6 analogue. If ell<=c*eta_P, the actual thickness h<=delta^c obeys
lambda>=delta^ell>=h^eta_P, so the hypothesis is satisfied.

The two narrow pure factors are

\[
 R_o=r^{1-\gamma/2}b^{-2\gamma}(b^2N_w)^{p_\gamma},\qquad
 R_i=r^{1-\gamma}B^{-2\gamma}(B^2n_f)^{p_\gamma}.
\]

Their product is `r^(3gamma/2)*F_gamma(delta,N_w*n_f)`, up to fixed constants.
Outer narrow analytic loss is q+e; inner narrow loss <=q+e.

For a wide factor choose E=2s/c, with e,ell<=s. Its thickness h<=delta^c and
width >=delta^s satisfy width>=h^E, C_F<=h^(-E), lambda>=h^E after fixed slack.
The explicit slab L2 proof in the predecessor gives U>=C*delta^(8E).
The inner shaded-mass bound divided by R_i is <=C*B^gamma<=C.
The outer bound divided by R_o is
`(a*b^5*N_w)^(gamma/2)<=C*delta^(-e*gamma/2)*b^(gamma/2)`.
Thus outer wide loss is <=8E+e/2, and inner wide loss <=8E.
All four combinations (narrow/narrow, narrow/wide, wide/narrow, wide/wide) obey

\[
 \mu(T,Y)\le C\delta^{G_C-L_C}F_\gamma(\delta,N),\quad
 G_C=3\gamma c/2,\quad L_C\le2q+3e+\kappa+32s/c.
\]

The upper bound sums both narrow and wide errors, so it is deliberately larger
than needed for any one combination. No application of Lemma6.4 outside its
width/density domain is hidden here.

For A use ORIGINAL Theorem6.2 with output gamma/2 and its original every-scale
Definition6.1, not an assumed identity with streamlined Definition7.1. Then
U>=C*delta^(gamma/2) and N<=C*delta^(-4) give

\[
 \mu/F_\gamma(\delta,N)\le C\delta^{\gamma/2}.
\]

Initial mass transfer is subpower; A has G_A=gamma/2 and L_A<=kappa.

## 8. Explicit parameter order — no zero-loss assumption

For fixed beta<gamma choose:

1. zeta1>0 sufficiently small for sticky output gamma/2, and zeta1<=1/10.
   Put G_B=2d*zeta1/5 and G_A=gamma/2.
2. 0<zeta2<=min(zeta1/2,G_B/100). Set c=zeta2/200,
   G_C=3gamma*c/2, and G=min(G_A,G_B,G_C)>0.
3. 0<q<=G/100. Let a_*>0 be the minimum of the generalized K_KT(beta),
   generalized K_F(gamma), and plank density tolerances at this q.
4. 0<s<=min(c*G/1024,c*a_*/32).
5. 0<zeta3<=min(zeta2/2,s/32). The geometric Proposition6.3 now supplies
   a fixed eta_source>0 and finite source constants. Fix C_B>=2 as above.
6. Choose positive root t with
   `C_B*t <= min(G/4096,s/128,a_*/32,eta_source/32)`.
   Also require t<=the sticky density tolerance/32.
7. Choose positive kappa<=min(t/16,G/4096,s/128,eta_source/32).
   Then choose delta0 to absorb the TOTAL subpower/constant factors, meet all
   source radius cutoffs and C*delta^s<=b0. Delta0 is chosen LAST.

In particular 2t+kappa<eta_source, so the initial Frostman input really meets
the trichotomy condition. H=C_B*t+kappa<=min(G/2048,s/64,a_*/16).
e=zeta3+kappa<s/16, ell=zeta3+2t+4kappa<s/8, so the density and wide-slab
conditions stated above are satisfied.

Direct bounds:

- `L_A<=G/4096 <G_A/4`.
- `L_B<=3G/100 +3G_B/100 +8G/2048+G/4096 <G_B/4`.
- `L_C<=2G/100 +3s/16+G/4096+G/32 <G_C/4`, since s<=c*G/1024 and c<=1.

This is a nonempty quantified choice, with actual t-dependent losses retained.
No numerical execution tolerance, machine-calibrated C_B or practical iteration
count is asserted. The source-assisted mathematical use of its finite O(eta)
constant is explicit: t is chosen AFTER that constant, not before or as zero.

## 9. Joined implication and endpoint

Every retained source branch therefore has a residual exponent at least 3G/4.
After the remaining fixed slack it is safe to write

\[
 \mu(T,Y)\le\delta^{G/2}F_\gamma(\delta,N).
\]

Since `F_gamma/F_(gamma-nu)<=delta^(-3nu)` for N>=1, choose
`nu=min((gamma-beta)/4,G/24)>0` to obtain K_F(gamma-nu), relative to the stated
source prerequisites and the matched transfer envelope in section3.

K_F(1)'s explicit tube L2 proof and epsilon-closedness are in the predecessor:
S={gamma in [beta,1]:K_F(gamma)} is nonempty and upward closed. For any requested
epsilon>0, choose gamma in S within epsilon/12 of inf S and use output epsilon/2;
the F_gamma/F_inf ratio costs at most epsilon/4. Thus K_F(inf S) holds.
If inf S>beta, the improvement just proved at inf S contradicts minimality.
Consequently K_F(beta) follows from K_KT(beta). Beta=1 is the base case.

This endpoint argument does not prove monotonicity of the source's particular
nu(gamma,beta), and does not need it. It proves the exact Main Lemma1 implication,
not all assertions of source Lemma8.1 or Main Lemma2.

## 10. Acceptance boundary

The branch algebra, boundary cases and parameter choice are now joined rather
than left with unnamed L_A/L_B/L_C terms. Remaining trust is explicitly in the
named published geometric/analytic prerequisites and, in B, the original
two-scale shading construction's finite O(eta) envelope. This session did not
independently re-prove that construction's smoothing/lifting estimates or compute
its numerical coefficient. Therefore a fully independent certificate is NOT
established. A reader requiring each of those estimates to be rebuilt from first
principles must keep that precise B transfer obligation open.

Frozen old solver/critic/UI verdict UNRESOLVED remains unchanged. This audit is
source-assisted proof evidence, not a newly run model answer or a UI checker pass.
No LLM/API/code/build/DB/Git/infrastructure changes; no scratch or cleanup needed.
