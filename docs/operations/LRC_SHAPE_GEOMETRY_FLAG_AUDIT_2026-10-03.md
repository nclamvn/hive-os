# Universal shape and geometry: reviewed arguments, exact substeps

Source https://arxiv.org/html/2609.02604v2 §§3.1,3.5,3.6. This is an audit/reproduction,
not a novelty claim. n13/14 moving speeds means14/15 total runners. Real-domain
arguments below are mathematical review, NOT formal Lean or external acceptance.
Exact arithmetic validates identities and inequalities; controls alone do not
prove a universal statement. Whole LRC reproduction remains NOT_ESTABLISHED.

## Shape on the entire positive normalized domain

Write q(u)=1+2u-u², a(u)=q(u)u^(-2/n), w(u)=u²/q(u) and
H(u)=(sum w(u_i))product a(u_i), with0<u_i<=1,maxu_i=1.
Set S=(product v_i)^(1/n), F_n=sqrt(H), R_n=n/F_n. In particular
S²F_n²=product q_i * sum(v_i²/q_i). Direct scale cancellation gives
R_n²=n²/H. A minimum exists:
a(u)>=1, one w(1)=1/2, and H>=a(u_i)/2 diverges whenever any coordinate
approaches0. Compactness of the remaining sublevel set gives attainment.
No boundary where u_i=0 can supply an omitted lower minimum.

Fix an INTERIOR coordinate, retaining another coordinate equal1. Thus maxu=1
persists throughout its variation. Put C=sum of other w values,
0<C<=(n-1)/2. The relevant one-variable objective phi=a(C+w) has
(n/2)u^(1+2/n)phi'=-beta, beta=C D-(n-1)u²,
D=1-(n-2)u+(n-1)u². Let alpha be D's smaller root.
beta(0)>0,beta(alpha)<0. For C<1 its quadratic leading term is negative,
one root negative and one positive; C=1 gives a decreasing linear polynomial.
For C>1 it is convex and beta(1)=2C-(n-1)<=0, so the second root is>=1.
Even at the limiting equality C=(n-1)/2, that second root is the boundary1,
not another interior minimum. Hence every interior critical coordinate lies
in(0,alpha), and phi decreases then increases on(0,1).

At criticality set A=C+w=sum w. Since (n-1)q+D=n(1+u), beta=0 is equivalent
to f(u)=qD/[n u²(1+u)]=1/A. All denominators are positive; D>0 on(0,alpha).
If N=qD,V=n u²(1+u), exact coefficient arithmetic gives
N'V-NV'=-n*u*P_n(u), where ascending coefficients of P_n are
[2,-(n-7),-2(n-4),-(4n-6),2(n-1),n-1].
For13 use alpha<103/1000; for14 alpha<1/10. Dropping positive terms and
bounding each negative term at this rational upper endpoint proves P_n>0
throughout(0,alpha). Therefore f is strictly decreasing there. A is shared
by every coordinate, so ALL interior coordinates of every global minimizer
have the same value t. This is the universal reduction, not empirical sampling.

The derivative of a has opposite sign to D. D has two distinct roots in(0,1),
since its low root is bracketed, its vertex is negative and D(1)=2>0.
a decreases to alpha, increases to the larger root, then decreases to a(1)=2.
Thus its global infimum is min(a(alpha),2). Alpha13 in(.102,.103),alpha14
in(.092,.093), strict signs checked exactly. Since q is strictly increasing
on(0,1), a(alpha)>q(L)/U^(2/n). Raising to positive power n yields the exact
comparison q(L)^n/U²>(8/5)^n, proving a(u)>8/5 everywhere.

Let k be the number of coordinates equal1 at a global minimizer. ALL k>=2
are covered: H>=(k/2)2^k(8/5)^(n-k), with strictness if any interior coordinate
exists. At k=n the displayed expression is exact; it is nevertheless strictly
above the target. Consecutive bounds have ratio5(k+1)/(4k)>1; exact all k2..n
rows provide another complete arithmetic check. They exceed T13=(2600/101)²
or T14=784. There is no assumption that only one maximum can occur.

For k=1, the other n-1 coordinates share t in(0,alpha), and
H(t)=(1+2t+(2n-3)t²)q(t)^(n-2)/t^(2(n-1)/n).
Writing A(t)=1+2t+(2n-3)t², the log derivative numerator is
n*t*[A'q+(n-2)Aq']-2(n-1)Aq
=2(n-1)(1-t)*Cubic(t),
Cubic(t)=-1+(n-5)t+(2n-5)t²+(n-1)(2n-3)t³.
Its derivative is positive on positive t. Exact signs bracket its unique root:
13:(849/10000,85/1000);14:(782/10000,783/10000), both below alpha.
The minimum in this branch is there. Increasing numerator factors at L and
decreasing inverse power bounded at U yield a rigorous lower bound for H.
For13 exponent24/13, compare [A(L)q(L)^11]^13/U^24>T13^13;
for14 exponent13/7, compare [A(L)q(L)^12]^7/U^13>784^7.
All are positive rational powers/integers, so raising powers preserves strict
inequality. No floating-point evaluation or hidden logarithm admission.
Combining both branches proves R13<101/200 and R14<1/2 over ALL normalized
positive points. This sublemma is unconditional on lower LRC cases.

## Ellipsoid inclusion and covolume

For positive integer v, let H=v-perp, P orthogonal projection,
D=P[-1,1]^n,E=P Q^(1/2)B2, u_i=v_i/maxv,qi=q(u_i)>0.
The support functions on H are h_D(y)=sum|y_i| and
h_E(y)=sqrt(sumqi y_i²). On the section of the l1 unit ball by H, every vertex
is an intersection with an original edge: take the minimal containing face,
whose relative interior contains the point. If its dimension is>=2, intersecting
with a single noncontaining hyperplane leaves
at least dimension1 near that point, so it cannot be a vertex. Signed axes
are not on H because all vi>0. Same-sign edges never cross; every opposite-sign
pair does, at +/-(v_j e_i-v_i e_j)/(v_i+v_j).
The quadratic form is convex, so checking ALL section vertices suffices.

For every normalized pair0<u,v<=1 the exact polynomial identity is
(u+v)²-q(u)v²-q(v)u²=2uv(1-u)(1-v)>=0.
This proves the support comparison and E subset D universally. The maxbox
hypothesis matters: an abstract invalid pairu2,v1/2 gives negative difference-1
and ratio29/25>1. This is a hypothesis control, NOT an LRC counterexample.

For primitive integer v, L=Z^n intersect H has Euclidean covolume||v||.
Indeed primitivity supplies integer z with v dot z=1; a basis of L together
with z is a basis of Z^n (quotient map v dot identifies the integer quotient).
Its height above H is1/||v||, so Euclidean volume1 gives the result.
For h in H, integer pairing with every Pz is equivalent to h inZ^n; hence
(PZ^n)^*=L and projected lattice covolume is1/||v||. Positivity/rationality of
v gives a genuine rank n-1 lattice; this standard duality step is written math.

Let U be orthonormal columns for H. The metric with E as unit ball is
(U^T Q U)^-1. With O=[U,v/||v||] orthogonal, Schur complement gives
det(U^TQU)=detQ*(sumv_i²/qi)/||v||². All matrices are positive definite,
so inverses and positive determinant roots are legitimate. Thus
covol_E²=1/[productqi*sumv_i²/qi]=1/(S²F_n²).
No arbitrary floating orthonormal basis is needed to test identities.

Rational control basis columns A_i=e_i-(v_i/v_n)e_n has
G=A^T A,C=A^TQA. Rank-one determinant formulas give
detG=||v||²/v_n²,detC=productqi*(sumv_i²/qi)/v_n².
Exact Gaussian determinant replay for retained controls corroborates these
identities, not their universality. detG/(||v||²detC) is the primitive covolume².
For nonprimitive gcd g, the actual lattice depends on v/g, giving
covol_E²=g²/(S²F²). Doubling v leaves its lattice/ellipsoid unchanged but
halves the naive1/(SF) expression; primitive admission must reject that use.

## Conditional flag composition and remaining work

The already checked abstract KZ bound gives product t_i>=K_n. Applying it to
an actual counterexample lattice requires lower-case LRC and KZ existence/
Gram–Schmidt correspondence. Reviewed inclusion supports the prefix rounding;
covolume identity then gives SF<=K_n^(-1/2). Universal shape gives
product v_i<(r_n/(n sqrtK_n))^n. Retain an exact squared positive upper bound
(r_n/n)^(2n)/K_n^n; squaring is legitimate for positive products/constants.
Reference immutable TIP053 evidence as RETAINED, not a fresh rerun of its
6144 vertices by the new Python collector. No new speed witness or model job.

Lower LRC through12 and established LRC13 still NOT_ESTABLISHED locally;
full modular generation, lifts and terminal properness remain unverified.
The reviewed analytic sublemmas meaningfully remove hidden assumptions from
the local argument, but do not establish the entire14/15 theorem. Frozen
original23 APPLICATION statuses are unchanged; new scoped statuses identify
which universal arguments have now been independently reviewed.
