# TIP109 — Builder: one-component structural hand argument

Status: GLOBAL FINITE K6 ROOT OPEN. The identities below are a candidate
common route to the committed remaining domain, not a calibrated target floor.
Scientific execution ledger:0 mathematical processes,0 seconds charged.

The active target is F6>=20/93 for all real offsets, or an exact smaller
rational point verified by both immutable area methods. At a possible
subtarget minimum, retain the accepted compactness, boundary, component,
two-component exclusion and necessary-stationary reductions. The remaining
one-bottom-component domain has range(p)<=49/31, radial2G=1+range(p),
full-gradient stationarity, both one-sided bottom slopes>=3, and13 strict
apex words formed by disjoint adjacent swaps. These are necessary domains,
not13 polynomial chambers or permission to assume natural apex ordering.

## 1. Exact global hull identity

Put A_j=p_j+j and v_j(t)=A_j-j*t, with slices
I_j(t)=[v_j(t),v_j(t)+t],0<=t<=1. Let H be the integrated global slice hull.
For arbitrary offsets, arbitrary apex order, and all ties,

    hull_length(t)=t+max_j v_j(t)-min_j v_j(t)
      =t+v6(t)-v1(t)+max_j(v_j(t)-v6(t))
                           +max_j(v1(t)-v_j(t)).

Write D_i=A_(i+1)-A_i. Integrating gives the EXACT identity

    H=sum_i D_i-2+B_LEFT+B_RIGHT,
    B_LEFT=integral_0^1 max_j(p1-p_j-(j-1)*y,0)dy,
    B_RIGHT=integral_0^1 max_j(p_j-p6-(6-j)*y,0)dy.

The baseline may be negative at some heights; neither envelope is dropped
or replaced by an unqualified fixed span. Since range(p) can exceed1, the
height1 clamp must be retained in these envelope integrals.

## 2. One restored-gap inequality covering all13 words

Use the FIXED label chain1,2,...,6, not the sorted-apex chain. Its adjacent
potential gap W_i(t) has one of two orientations:

    D_i>=0: forward gap between right_i and left_(i+1),
            width(D_i-2t)_+;
    D_i<0:  reverse gap between right_(i+1) and left_i,
            width-D_i.

Every point outside the union but inside its hull lies in at least one W_i.
Indeed each interval is entirely left or entirely right of such a point.
Both statuses occur, so somewhere in the finite label chain a neighboring
status transition occurs. The corresponding oriented adjacent gap contains
the point. This proof does not require ordered apex labels, pair overlap,
or disjoint potential gaps.

Let N_i=I_(i-1) union I_(i+2), omitting nonexistent end neighbors. Then

    G>=H-sum_i integral_0^1 |W_i(t) minus N_i(t)|dt.       (GEN)

Proof: actual holes lie in the union of W_i minus the ACTUAL triangle union;
their area is at most the sum of those residual areas. Replacing the actual
union by its subset N_i only increases each residual. Equivalently restore
the neighbor-covered portions after subtracting every potential gap. Even
if the same physical portion is restored in several W_i, it merely cancels
the corresponding repeated subtraction; disjoint restoration is not needed.

All neighbor positions are explicit, including inversions. For D_i>0,
frame right_i=0 and put g=D_i-2t>0,E=D_(i-1),F=D_(i+1). The neighbor
intervals in that frame are

    I_(i-1)=[-E,t-E],
    I_(i+2)=[g+F-t,g+F].

For D_i=-epsilon<0, frame left_i=0, so W_i=[-epsilon,0]. The neighbors are

    I_(i-1)=[t-E,2t-E],
    I_(i+2)=[-epsilon+F-2t,-epsilon+F-t].

The clipped intersections with W_i, and their UNION rather than a sum,
are required in(GEN). When E<0 a neighbor lies inside a forward gap;
the natural endpoint-filling formula below would overcount its coverage.

## 3. Compact natural-chain hinge functional

This section applies ONLY when every D_i>=0. Such a label-chain gap has
no reversed disjoint transition: right_(i+1)-left_i=D_i>=0. At any actual
hole the label statuses therefore have a UNIQUE transition from intervals
left of the hole to intervals right of it. Thus natural-chain actual
residual gaps are disjoint, and the restored-gap identity with the ACTUAL
union is exact. This does not justify deleting the12 inverted words.

For an interior natural gap, the two neighbor-covered portions fill its
opposite ends. Hence its residual is

    h_i(t)=[D_i-2t-(t-E)_+-(t-F)_+]_+,
    E=D_(i-1),F=D_(i+1).

The actual hole residual is no larger. Integrating this nonnegative upper
residual to infinity, rather than stopping at1, remains a valid UPPER bound
for the actual hole area. This avoids assuming D_i<=2. It does not count
physical coverage outside the triangle height.

Write m=min(E,F),M=max(E,F). The exact infinite-height residual integral is

    Phi_i=D_i^2/4-(D_i-2m)_+^2/12-(D_i+m-3M)_+^2/24.

For an end gap, with only the existing neighbor E, it is

    Phi_end=D_i^2/4-(D_i-2E)_+^2/12.

To verify the interior formula, if D<=2m no neighbor reaches the gap
before it closes. If D>2m but D+m<=3M, only the first neighbor matters,
and its restored area is(D-2m)^2/12. In the remaining case both matter:
the first fills until t=M, their combined fill becomes2t-E-F, and it
meets the decreasing gap at T=(D+E+F)/4. Direct integration gives restored
area(D-E-F)^2/8+(E-F)^2/4, equal to the displayed single-neighbor term
plus(D+m-3M)^2/24. The formulas agree on their switch boundaries.

Consequently the natural-chain WHOLE lower functional is

    G>=H-sum_i Phi_i.                                   (NAT)

It retains actual envelope clamps, arbitrary positive gaps, and both
neighbor fill phases. It has NOT been calibrated to G>=40/31.

## 4. Exact sharpness at the retained rational construction

This is HAND arithmetic at the already accepted TIP105 construction, not
a new diagnostic process, navigation point, or global minimum assertion.
For p=(49,43,23,26,6,0)/31,

    D=(25,11,34,11,25)/31.

Both exact outer-envelope integrals equal1037/3844. For LEFT the active
selected hull vertices are1,3,5,6, with crossing heights6/31,17/62,13/31.
Their energy is

    (p1-p3)^2/4+(p3-p5)^2/4+(p5-p6)^2/2
    =169/961+289/3844+18/961=1037/3844.

Other envelope members lie below those lines. Reflection gives RIGHT.
Thus H=3765/1922. The five un-restored wedge areas sum1324/1922.
Central double-neighbor restoration is18/961; the two outer single-neighbor
restorations total3/(2*961). Their sum39/1922 supplies exactly the gap
between raw H-minus-wedges and the accepted union value:

    H-sum Phi_i=(3765-1324+39)/1922=40/31.

Sharpness makes(NAT) a relevant candidate root inequality, but a value at
the construction does not establish it on the whole natural-order continuum.

## 5. Clamped envelope support and failed shortcuts

Selecting LEFT envelope labels1,3,5,6 gives the globally valid lower bound

    B_LEFT>=max_(0<=alpha<=beta<=gamma<=1)
       [alpha*(p5-p6)+beta*(p3-p5)+gamma*(p1-p3)
        -alpha^2/2-beta^2-gamma^2].

This is the exact envelope of those selected lines; pooling and both endpoint
clamps are part of the variational maximum. Its unconstrained quadratic
sum is NOT a global lower bound. At the construction its three unconstrained
cuts are correctly ordered and inside[0,1], so equality holds. The reflected
selected RIGHT support is analogous.

Global convexity cannot be assumed even for(NAT). At p=(0,e,0,0,0,0) with
0<e<1/3, all neighbor-restoration hinges are inactive. Its value is exactly
7/4-3e^2/8: H=3+e^2/8 and sum_i D_i^2/4=5/4+e^2/2. This has negative
curvature and is not an actual subtarget counterexample.

A sorted-apex extension of unique-hole partition was proposed and withdrawn
independently by Main and Builder. For consecutive sorted labels a,b with
r=b-a and positive apex separation D, backward non-overlap is absent only
if D-(r-1)t>=0. Disjoint adjacent swaps can produce r=2 or3, so r>=-1
does not imply the required wall order. For example p=(3/2,0,3/2,0,3/4,3/4)
has range3/2, closed connected bottom and apex word(2,1,4,3,5,6), but its
1-to4 sorted-chain edge has D=3/2 and a reversed gap1/2 at height1.
This refutes the claimed automatic wall order, NOT the remaining theorem;
the point is not claimed to satisfy every necessary minimum condition.

## 6. Hand refutation of an unconditional nearest-neighbor target floor

At the same point p=(3/2,0,3/2,0,3/4,3/4), the fixed-label gaps are
D=(-1/2,5/2,-1/2,7/4,1). The exact hull energy is
H=9/4+1+3/32=107/32. Here LEFT is the line3/2-y throughout[0,1],
and RIGHT is(3/4-3y)_+, explaining both envelope integrals.

The five immediate-neighbor residual integrals in(GEN) are exactly

    (1/2,89/96,3/8,61/96,1/4), sum43/16.

For edge2, both helpers are inside the forward gap initially, then overlap,
cover it, and finally separate again. Its residual bands are

    [0,3/8]:5/2-4t; [3/8,1/2]:1; [1/2,2/3]:4-6t;
    [2/3,3/4]:0; [3/4,1]:2t-3/2.

Their integrals are21/32,1/8,1/12,0,1/16, totaling89/96.
For edge4 the bands are

    [0,5/12]:7/4-3t; [5/12,5/8]:1/2;
    [5/8,7/8]:7/4-2t; [7/8,1]:0,

with integrals15/32,5/48,1/16,0, totaling61/96. Inverted edge1
has no helper filling its constant gap; inverted edge3 has restored area1/8;
edge5 closes before its helper arrives. Thus(GEN)'s lower functional is
21/32, strictly below40/31.

This is a HAND functional falsifier, not an actual-area evaluation or root
counterexample. In particular the point's one-sided bottom slope is0, so it
is outside the retained necessary-minimum domain. It refutes only the
unconditional(GEN) target floor on connected range-bounded13-word points.
It neither refutes a floor restricted to all necessary minimum conditions
nor proves impossibility of the root theorem. A future all-word argument
must retain farther coverage/multiplicity or use the missing stationary
conditions; the unconditional nearest-neighbor calibration is withdrawn.

## 7. Exact convex restoration conjugate (natural chain only)

For D,E,F>=0, write R=D^2/4-Phi for the infinite-height restoration.
It has the unified EXACT representation

    R(D,E,F)=max_(u,v>=0)
      [(D-2E)u+(D-2F)v-3u^2-2uv-3v^2].

The strictly concave maximization has three possible active sets. If both
coordinates vanish, D<=2min(E,F) and R=0. If only u is positive,
u=(D-2E)/6 and R=(D-2E)^2/12; its complementary inequality is
D+E<=3F. Exchange E,F for the other single-coordinate case. If both are
positive, u=(D-3E+F)/8,v=(D+E-3F)/8, and

    R=(D-E-F)^2/8+(E-F)^2/4.

These positivity and complementary inequalities reproduce all cases in
Section3 and agree at their boundaries. Therefore R is a globally convex,
continuously differentiable function of(D,E,F), including ties. End
restoration is the analogous one-coordinate maximization. This concerns
the correctly oriented NAT bound only; it does not change the signed GEN
failure or license natural apex ordering.

Together with Section5, the selected hull and active restorations can be
written as unconstrained quadratic energies MINUS their weighted squared
projection deficits. Thus a potential single calibration is: the positive
witness-centered quadratic slack must dominate the SUM of all hull-cut
pooling/clamp deficits and restoration nonnegativity deficits, uniformly
on the retained domain. This domination is NOT established. Dropping any
deficit is exactly the previously forbidden unconstrained/local-quadratic
shortcut. Nor does convexity of R imply convexity of NAT, whose negative
raw-wedge quadratic remains present.

There is a specific obstruction to freezing all conjugate variables as one
sharp dual: after fixing the hull cuts and restoration multipliers, the
remaining expression in D retains the strictly concave term-sum D_i^2/4.
The witness is not a vertex of the natural order/range polytope, even on
its active range facet. Such a frozen dual cannot have its minimum there.
This explains why the parameter-dependent projection deficits cannot simply
be omitted. It is not a proof against other duals, necessary-stationary
arguments, or the target theorem.

Natural ordering also removes one otherwise important clamp: D_i>=0 implies
p_i-p_(i+1)<=1, hence every endpoint ratio(p1-p_j)/(j-1) and
(p_j-p6)/(6-j) is at most1. Both actual hull envelopes therefore vanish by
y=1. The selected chain cuts each satisfy their upper bound1 automatically;
nonnegativity and isotonic pooling still matter. This simplification is NOT
valid for all13 words and does not turn the unconstrained selected energies
into global lower bounds.

## 8. Exact farther restoration as a convex partial minimization

This section applies to natural D>=0 with a closed connected bottom. It
retains ALL distant coverage, rather than proposing more neighbor samples.
For cut i put

    c_i(t)=L_i(t)+R_i(t),
    L_i=max(0,max_(a<i)[(i-a)t-sum_(j=a)^(i-1)D_j]),
    R_i=max(0,max_(b>i+1)[(b-i-1)t-sum_(j=i+1)^(b-1)D_j]).

The exact cut gap is q_i=[D_i-2t-c_i(t)]_+. This follows by minimizing
the contiguous-subarray sum of D_j-t over every subarray containing i,
then subtracting another t. All side-envelope intercepts S_k are
nonnegative contiguous sums of D. A missing side contributes identically0.

For a single side define J(T,S)=integral_0^T max(0,max_k[k*t-S_k])dt.
J is jointly convex and C1 on T>=0,S_k>=0. A direct finite-piece proof is
available without selecting a hull path globally: on ANY actual active
increasing-slope path0=k0<k1<...<km, S0=0, let
tau_h=(S_(k_h)-S_(k_(h-1)))/(k_h-k_(h-1)). The active path has
0<=tau1<=...<=taum<=T. Integrating on its actual pieces gives

    J=k_m*T^2/2-S_(k_m)*T
        +sum_h (S_(k_h)-S_(k_(h-1)))^2/[2(k_h-k_(h-1))]
      =sum_h (k_h-k_(h-1))*(T-tau_h)^2/2.

Each piece is a positive-semidefinite quadratic in(T,S). Actual envelope
paths are selected by linear inequalities, not assumed fixed. At switches,
the derivative in T is the continuous envelope value and each derivative
in S_k is minus its active interval length. Vanishing intervals at pooled,
zero or terminal cuts therefore make the pieces C1. Distinct slopes cannot
tie on a positive-length interval. Along a line segment in this convex
domain, piecewise nonnegative second derivatives and matching first
derivatives imply convexity, including degenerate limits. The empty path
has J=0. This proof uses S_k>=0; arbitrary signed intercepts are not added.

Let I_i(T,D) be the sum of the two side J values. It is jointly convex in
(T,D) for D>=0. Because c_i is continuous and nondecreasing, q_i vanishes
at the unique solution D_i=2T+c_i(T), with T=0 when D_i=0. Direct
integration, or the derivative of the following strictly convex function
in T, gives the EXACT infinite-height restoration identity

    R_exact_i=D_i^2/4-integral_0^infinity q_i(t)dt
      =min_(T>=0) [(T-D_i/2)^2+I_i(T,D)].

Consequently R_exact_i is jointly convex by partial minimization of a
jointly convex function. Bottom connectedness ensures q_i vanishes by1,
so its infinite-height integral equals its actual removed area. Thus

    G=H-sum_i D_i^2/4+sum_i R_exact_i.

The identity is sharp everywhere on the natural closed-bottom domain and
keeps farther coverage, all hull/envelope switches, and touching limits.
It DOES NOT prove convexity of G or the target floor: the negative raw-chain
quadratic remains. Even the exact union at small nonmonotone perturbations
of the flat configuration can have negative curvature. Nor does this
natural-chain formula license deleting the12 inverted apex words.

The resulting natural-chart obligation is precise: calibrate this convex
envelope/restoration energy against the negative chain energy on the whole
retained domain, OR exclude every other necessary stationary configuration.
A frozen path, a local positive Hessian, or monotone cut merging does not
supply that missing implication.

The exact identity also cancels the raw-square terms if the closure heights
are retained as variables:

    G=min_(T_i>=0)
      [H-sum_i D_i*T_i+sum_i T_i^2+sum_i I_i(T_i,D)].

This is not jointly convex by assertion. A possible stationary-energy proof
would insert the constrained variational cuts of H and I, use full-gradient
visibility balance to cancel the remaining linear D coefficients, and
calibrate the resulting timing energy with ALL ordering and pooling
constraints. No globally feasible sharp dual or lower timing-energy bound
has been established. This proposed route is preserved as an open implication,
not a complete stationary reduction or permission to omit any active pattern.

Equivalently set P=B_LEFT+B_RIGHT+sum_i R_exact_i. P is convex and C1
on the natural positive-D domain, and

    G=sum_i D_i-2-sum_i D_i^2/4+P(D).

A genuine unconstrained natural-order minimum must therefore satisfy
grad P(D)=D/2-1. If bottom connectedness is STRICT and persists in a
neighborhood, nonnegative one-sided second variations of
P(D)-sum D_i^2/4 are necessary in every direction. At a bottom contact
tau_i=1, this second-variation transfer is NOT automatic for directions
that split the bottom. These equations preserve full gradient stationarity
rather than substituting radial balance alone. They do not imply that a
Hessian from one incident phase is positive semidefinite on all directions,
nor that all fixed points belong to the accepted region C.
Classifying their admissible values outside C remains the missing whole
stationary implication. Convexity of P by itself is insufficient because
the subtracted quadratic has positive curvature.

Boundary correction13:11UTC, prompted by Main: at tau_i=1 the infinite-hole
formula equals actual area at the point, but a perturbation can create an
extra tail beyond height1. Every cut line has decreasing slope at most-2;
a perturbation of size h can therefore produce only O(h) extra width over
O(h) extra height, hence an O(h^2) tail. Values and first derivatives agree,
so the full-gradient and timing balances below transfer. Second derivatives
need the retained tail correction or a direction in which connectedness
persists. The earlier unconditional all-direction second-variation wording
is withdrawn; no stationary exclusion relied on it.

## 9. Exact stationary timing balance and acyclic restoration flow

Main supplied the full natural hull-cone representation. For completeness,
with delta_i=1-D_i it is

    B_LEFT=max_(alpha1>=...>=alpha5>=0)
      [sum_i delta_i*alpha_i-sum_i alpha_i^2/2],
    B_RIGHT=max_(0<=beta1<=...<=beta5)
      [sum_i delta_i*beta_i-sum_i beta_i^2/2].

The optimizers are the nonnegative decreasing/increasing isotonic projections.
No upper cap is needed because delta_i<=1. Put s=alpha+beta. Then
sum s=sum delta+range(p), by the zero-height envelope values. Using Section8
at its unique minimizing T_i, full-gradient stationarity gives

    1=s_j+T_j+M_j,
    M_j=-sum_(i!=j) partial I_i(T_i,D)/partial D_j >=0.

This includes the off-central derivatives; omitting them would be false.
For each cut i the sum of these off-central flow amounts is exactly
c_i(T_i). On an active side interval its slope k counts the k neighbor D
coordinates in its intercept; consequently the sum of negative derivatives
is integral_0^T_i[k_LEFT(t)+k_RIGHT(t)]dt=c_i(T_i), since c_i(0)=0.
Summing the balance equations and using D_i=2T_i+c_i(T_i) therefore yields
the EXACT necessary stationary identity

    sum_i T_i=range(p).

Flow is not arbitrary. If an active side prefix of cut i contains edge j
and has length k, its intercept S is a contiguous sum crossing cut j.
The exact closure formula for cut j implies S>=(k+1)*T_j. For this side
prefix to be active by T_i one needs k*T_i>S. A nonzero contribution to
M_j from cut i thus requires T_i>(1+1/k)*T_j>T_j. In particular a
maximal-T cut has no incoming M_j. Ties cause no positive-length flow.
This is an acyclic later-closure-to-earlier-closure constraint that retains
all farther prefixes, not an arbitrary nonnegative-flow relaxation.

At the known construction the cut heights are
T=(12,11/2,14,11/2,12)/31, summing49/31. This is hand use of an existing
construction, not another sample. The remaining natural stationary task is
to prove sum T>=49/31 from ALL projection, closure, flow and one-sided
conditions, or prove the target by another whole calibrated inequality.
Neither the sum identity nor acyclicity alone supplies that inequality.

A concise SUFFICIENT sharp coupling inequality would be
M_total<=8*range(p)/49 on all relevant natural necessary minima. Indeed
sum delta<=range(p), and summing balance with sum T=range(p) gives
5=sum delta+2*range(p)+M_total<=3*range(p)+M_total. Such a bound would
force range(p)>=49/31. At the retained construction M_total=8/31, so its
constant is sharp there. This bound is UNPROVED, not an assumed relaxation
or a new theorem. Generic nonnegative/DAG flow cannot replace the actual
prefix-closure and projection conditions, and this predicate by itself
does not treat the12 inverted words.

The timing floor cannot be strengthened to a statement using only natural
order, range, connectedness and bottom slopes. A HAND counter to that
weakened statement is the family

    p=(1+epsilon,2epsilon,1,epsilon,1-epsilon,0),
    D=(epsilon,2-2epsilon,epsilon,2-2epsilon,epsilon),
    T=(epsilon/2,1/2,epsilon/2,1/2,epsilon/2), 0<epsilon<1/2.

For each even cut the three-edge cross interval has sum2 and closure1/2;
the adjacent and other cross intervals close no earlier. Each odd cut
closes at its own adjacent value epsilon/2. At epsilon=1/3, range(p)=4/3
is within[79/61,49/31], natural apices are strict, bottom is strictly
connected, unique extrema6/1 have slope6, but sum T=3/2<49/31.
It is NOT stationary: sum T-range(p)=1/6, already violating the necessary
full-gradient sum identity. No actual area at this point was executed or
claimed smaller. The counter refutes only dropping the full balance from
the timing-floor argument; it does not refute the committed theorem.

## Remaining exact obligation (final formulation)

A calibration retaining all necessary conditions, or a complete
necessary-stationary value argument, is still needed across all13 continua
and relevant boundaries. The unconditional neighbor-GEN target floor is
withdrawn by Section6; its failure is not a failure on the full minimum domain.
The compact(NAT) hinge functional has a sharp anchor but requires a global
clamped-envelope inequality; it cannot be certified by its local polynomial,
unconstrained cut energy, global convexity, or the13-word count. No smaller
rational area point or universal root floor has been established here.

Tiếng Việt: đã viết một cận chung có hướng đúng cho mọi thứ tự còn lại,
giữ cả khe thuận/ngược và phần được tam giác lân cận lấp. Họ thứ tự tự nhiên
có công thức bản lề gọn và đạt đúng giá trị tại cấu hình đã biết, nhưng chưa
chứng minh cận đạt đích trên toàn miền. Không bỏ12 thứ tự đảo kề hay tự coi
đếm thứ tự, kiểm số, đa thức cục bộ là chứng minh K6 toàn cục.

## Execution ledger

Mathematical processes0; mathematical time0 seconds. No sampling, optimizer,
box/chamber generation, compile, install, API, application, UI, or Git action.
Four ordinary source-read requests failed (including one request for two
not-yet-created review notes);
one overly broad read-only text search was subsequently narrowed to Markdown.
These are not mathematical executions and changed no files.
