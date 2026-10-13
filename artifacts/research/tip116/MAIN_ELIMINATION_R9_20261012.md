# TIP116 R9 — exact elimination of the sixth triangle, all real cores

Status: exact elimination hand-reviewed; no global K6 lower bound asserted.
Activation12:53:24UTC / derivation cutoff13:43:24 / hardstop13:53:24.
Math subprocesses0. No sampling, code or parameter-cell enumeration.

## 1. Unrestricted problem and exact normalization

Use reversed height t in [0,1], with horizontal coordinate multiplied by6.
For arbitrary real A1,...,A5 define

    U_t = union_(j=1..5) [A_j-j*t, A_j-(j-1)*t],
    J_z(t) = [z-6*t,z-5*t],
    H(A) = integral_0^1 |U_t| dt,
    C_A(z) = integral_0^1 |U_t intersect J_z(t)| dt,
    mu(A) = 1/2 - max_z C_A(z).

No apex order, pair overlap, bottom connectedness, genericity or minimum
hypothesis is imposed. These definitions use the actual union once.
Exactly, min_z G6(A,z)=H(A)+mu(A). Removing common translation leaves
four core variables. The conditional internal all-real K5 theorem gives
H>=70/61, but NONE of the elimination results below depends on that theorem.
If epsilon=H-70/61, whole K6 is epsilon+mu>=270/1891 on every core.
If H>=40/31 the target is automatic since mu>=0; all other cores remain.

## 2. Closed ray-union formula, including the parallel edge

For k=5,6 set Q_k(z)=measure{t in [0,1]: z-k*t lies in U_t}.
For each j set d=z-A_j and m=k-j>=0. The j-th contribution is the
following CLOSED height interval, or the empty set:

    m>0, d>=0:
        [ max(0,d/(m+1)), min(1,d/m) ], if lower<=upper;
    m>0, d<0: empty;
    m=0, 0<=d<=1: [d,1];
    m=0, otherwise: empty.

Then Q_k(z) is the LENGTH OF THE UNION of these five intervals, not their
sum. Proof: ray membership is precisely m*t<=d<=(m+1)*t. The case m=0
is necessary: the sixth right edge is parallel to the fifth left edge.
At z=A5 the selected boundary convention has no effect on the integrals.

Fubini and moving-window differentiation give the exact all-real formula

    C_A'(z)=Q_5(z)-Q_6(z) almost everywhere,
    C_A(z)=integral_L^z [Q_5(s)-Q_6(s)] ds,
    L=min_j A_j.

For fixed t, intersection length with a translated interval is Lipschitz
in z with constant2. Its derivative is the union indicator at the right
endpoint minus that at the left endpoint for almost every z. Integration
in t preserves absolute continuity and the formula above. Persistent
parallel contact can prevent a classical derivative at A5; no derivative
at that single point is needed. Multiple core contacts are not removed.

This operator is constructive using only two unions of at most five
one-dimensional intervals. It needs no old K5 chamber, convex hull proxy,
stationarity, exclusion of inverted cores, or numerical integration.

## 3. Compact attainment, not just an infimum

Put B=max_j(A_j+7-j). Positive overlap with core triangle j requires

    A_j+(5-j)*t < z < A_j+(7-j)*t

for some 0<t<=1. Hence C_A(z)=0 outside [L,B], including its endpoints
up to measure-zero contacts. The continuous function C_A attains its
maximum on this compact interval. That maximum is positive.

In fact z=A5+2/3 overlaps triangle5 by1/3: the adjacent-pair overlap
for separation d in [0,1] is d-3*d^2/4, so d=2/3 gives1/3. Thus
max C_A>=1/3 and mu<=1/6 for EVERY core. This is an upper bound on the
best insertion cost, not the lower bound needed for K6. Exterior tails
have cost1/2 and cannot minimize it.

## 4. Finite exact candidate formula and whole-core completeness

The core has10 affine endpoint lines, of slopes -1,...,-5 and0,...,-4.
Among45 line pairs there are4 parallel pairs. Of41 nonparallel pairs,
five are the two edges of the same triangle and meet at t=0. Thus at
most36 interior pair intersection points, at most5 apex points at t=0,
and at most10 endpoint points at t=1 suffice as a core vertex inventory.
This is an upper bound of51 points. Keep different spatial locations at
equal heights; deduplicate identical points only. Parallel coincident
segments create no further isolated vertices.

Let V include these points that lie in the physical strip. Form

    K = {v+5*t, v+6*t : (v,t) in V},

deduplicated and sorted. It has at most102 values and includes L and B.
Points not on the actual union boundary only create harmless extra knots.

For completeness, decompose the core union into its actual maximal affine
left/right boundary pieces in the strip. For an affine component [a(t),b(t)],
its overlap with J_z is EXACTLY

    (b-z+6t)_+ - (a-z+6t)_+
      - (b-z+5t)_+ + (a-z+5t)_+.

Integrate each term over its boundary piece's height interval [alpha,beta].
For endpoint e(t)=a0-s*t and k=5 or6, set c=k-s>=0. Its hinge integral is

    ((a0+c*beta-z)_+^2-(a0+c*alpha-z)_+^2)/(2*c), c>0;
    (beta-alpha)*(a0-z)_+, c=0.

The zero case is precisely core L5 with k=5; its knot A5 is in K.
Artificial slab cuts at an unchanged affine boundary cancel between
adjacent pieces. Genuine piece endpoints lie in V. This proves C_A is
continuous and quadratic on every open interval between consecutive K
values, with no generic-position assumption. It also proves completeness
when vertices coincide, intervals touch, components merge/split, or core
endpoint lines coincide persistently. Nothing is extrapolated beyond t=1.

Write C_A(z)=a_i*z^2+b_i*z+c_i on a bounded knot interval (k_i,k_(i+1)).
Let Z(A) contain all knots, plus -b_i/(2*a_i) when a_i<0 and this point
lies strictly inside that interval. Convex/linear pieces maximize at an
endpoint; a constant piece has its value at both endpoints. Thus

    mu(A) = 1/2 - max_(z in Z(A)) C_A(z),
    |Z(A)| <= 102+101 = 203.

Extra knots outside [L,B] have zero coverage and do not affect the maximum.
The formula holds for EVERY real core. It is not a finite sample, a
restricted-core theorem or a statement about only stationary cores.
For rational A all knot/candidate positions and values can be rational:
all divisions above and the relevant quadratic-vertex division are exact.

## 5. What this does and does not remove from whole K6

The former fifth free position variable is minimized exactly, not replaced
by a necessary equation. But <=203 is a FIXED-core candidate count, not a
global count of four-variable branches. Across core parameters, actual
boundary incidence and ordering of affine knot forms change.

On a domain where those data are fixed, H and C are quadratic jointly in
the core coordinates and z; the coefficient of z^2 is a constant rational
number. Every interior quadratic maximum has z affine in the core
coordinates. Every knot candidate is affine too. Substitution gives an
exact QUADRATIC candidate for H+1/2-C in four core coordinates, with
affine domain/eligibility constraints. Flat and original boundary cases
are covered by knot branches and their actual incident faces.

To prove the floor there is no need to compare candidate winners: it
suffices to prove EVERY admissible candidate value >=40/31. Conversely
one feasible candidate value below40/31 is an actual K6 counterexample
candidate, requiring exact area validation. Proving only the winning
branch near the known witness would be insufficient.

The K5 cover cannot simply be plugged in: its2632 shape cells apply to
strict positive-pair-overlap cores after its own minimum reduction.
A K6 core need not satisfy that reduction. The old outside-core bound,
scaled here to85/74, is below40/31, so it does not eliminate those cores.
The existential K5 stability constant also supplies no numeric bound
strong enough for the new epsilon+mu tradeoff.

Fixed-core elimination is therefore constructively finite and small in
candidate count. Whole-core certificate size, actual feasible branch
count, and production cost are NOT established by that fact. No new
enumerator or checker is built to conceal this unresolved issue.

## 6. Feasibility verdict and completion

Builder's full saved proof was read13:04:06UTC. Its sufficient global
comparison inventory is C(36,2)+72+4+C(102,2)=5857 affine walls before
deduplication and before candidate eligibility: crossing-time ordering,
time clipping, parallel intercepts, and ordering all potential knot forms.
The constant comparison0=1 is not a wall. This does NOT count actual
chambers or certify a production runtime. With four variables the general
arrangement upper bound is sum_(d=0..4) C(5857,d), plus face handling;
it is a loose upper bound, not evidence that all those chambers occur.

The important positive result is a complete all-real-core exact operator
and affine-candidate/quadratic-value reduction. The important negative
feasibility finding is that fixed-core candidate complexity does not
bound the full parametric certificate by203, and the existing restricted
K5 shape cover cannot close the missing cases by substitution. Full
production is NOT QUALIFIED here, not proved impossible. No whole-core
value inequality follows from the ray formula alone.

Main NEW DERIVATION STOP observed13:05:07UTC. Requested first-stage
formula and feasibility assessment are complete at the stated hand-review
scope. Subsequent work is literal review/recording only; no automatic
enumeration, runtime grant or new campaign. The global K6 milestone is
still OPEN. This is early completion of the approved first stage, not
cap exhaustion or a claim to have solved K6.

Independent critic FULL Main review13:02:08UTC accepted E1/E2 scope.
Critic FULL Builder review13:03:25, continuity addendum13:04:37 accepted
the exact formula/count and conservative comparison bound; its explicit
K5 premise/notation corrections are being preserved in the Builder note.
