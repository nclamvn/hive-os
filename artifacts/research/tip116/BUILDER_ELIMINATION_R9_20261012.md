# TIP116 R9 — exact sixth-triangle elimination

Status: FINAL PARTIAL for K6. Exact elimination and qualified fixed-core
feasibility are established prerequisites, not a K6 value certificate.

Activation2026-10-12 12:53:24 UTC; derivation cutoff13:43:24;
hardstop13:53:24 UTC. Mathematical subprocess grant0. All predecessor
bytes frozen. No natural-order, connected-core, positive-overlap or K5
optimality hypothesis occurs in the elimination below.

## 1. The all-core theorem

For arbitrary real A1,...,A5, let

    I_j(t)=[A_j-j*t,A_j-(j-1)*t], 0<=t<=1,
    U_t=union_{j=1}^5 I_j(t),
    f_A(z)=integral_0^1 |[z-6t,z-5t] outside U_t|dt,
    C_A(z)=1/2-f_A(z), mu(A)=min_z f_A(z).

Then f_A is continuous and piecewise quadratic. It equals1/2 outside

    K=[L,H], L=min_j A_j, H=max_j(A_j+7-j).

For every fixed real core, 0<mu(A)<1/2, and its minimum is attained in
the interior of K. A finite exact certificate needs at most102 knots and
101 interior stationary candidates, hence at most203 candidate values.
Knots, flat pieces, simultaneous contacts and coincident parallel edges
are included; no limiting genericity or stationary-condition transfer is
required. The exact formula and candidate selection follow below.

The actual total union satisfies

    min_z G6(A1,...,A5,z)=G5(A1,...,A5)+mu(A).

This is a genuine elimination of one real variable. It does not prove
that the remaining four translation-normalized core variables have a
particular global minimum.

## 2. Closed hinge formula retaining actual component union

On any open height slab between core endpoint crossings, the ACTUAL U_t
is a disjoint union of components[a(t),b(t)] with affine endpoints. For
any intervals[l,r] and[a,b] of nonnegative length,

    |[l,r] intersect [a,b]|
      =(r-a)_+-(l-a)_+-(r-b)_++(l-b)_+.

Apply this identity with l=z-6t,r=z-5t and sum over actual components.
Touching component endpoints have zero one-dimensional overlap and may
be merged. Thus no pairwise or triple-overlap approximation is used.

Represent every maximal actual nonhorizontal union-boundary segment by

    e(t)=a-v*t, t0<=t<=t1,
    epsilon=+1 for a component LEFT boundary,
    epsilon=-1 for a component RIGHT boundary.

Here v is an integer0,...,5: left boundaries come from L_j=A_j-j*t,
right boundaries from R_j=A_j-(j-1)*t. Define the explicit primitive

    Phi_c(w;t0,t1)
      =[(w-c*t0)_+^2-(w-c*t1)_+^2]/(2c), if c>0,
      =(t1-t0)*w_+,                         if c=0.

This is exactly integral_{t0}^{t1}(w-c*t)_+dt. All c below are
nonnegative, so the c=0 branch handles the only parallel degeneracy
without division by zero. The closed finite formula is

    C_A(z)=sum_segments epsilon *
      [Phi_(5-v)(z-a;t0,t1)-Phi_(6-v)(z-a;t0,t1)],
    mu(A)=1/2-max_{z in K} C_A(z).

The formula uses the boundary of the ACTUAL five-triangle union, not a
chosen pair graph, natural hull or relaxed covering sum. Segment lengths
zero contribute nothing. Identical boundary segments are represented
once with their actual left/right orientation, not counted by labels.

It is a finite sum of quadratic hinges(z-q)_+^2 and possibly linear
hinges(z-A5)_+. Thus continuity and piecewise degree at most2 are direct.
C^1 is NOT asserted at the persistent parallel coincidencez=A5.

## 3. Attainment and strict fixed-core marginal positivity

Positive overlap with any core interval requires, at some height,

    A_j+(5-j)*t <= z <= A_j+(7-j)*t.

All coefficients are nonnegative; outside K there is no positive-area
overlap. At L,H there is also no positive-area overlap. Conversely one
can set z=A5+1/2: the fifth and sixth triangles have a positive lens, so
C_A(z)>0 regardless of the other four triangles. Therefore max C_A>0
and the minimum of f_A cannot lie in the constant outside tails.

For each fixed z, triangles whose apex equals z have label at most5;
their left endpoint is at least z-5t, so their interiors do not cover
the sixth interval[z-6t,z-5t]. The finitely many other apices are a
positive distance from z and have no intersection with the sixth triangle
for all sufficiently small positive heights. Consequently f_A(z)>0.
Continuity and compactness of K now give mu(A)>0 and attainment. This is
fixed-core positivity, not a uniform lower bound over all possible cores.

The eliminated value also behaves directly on core faces. Moving a core
apex by d changes that triangle's area by symmetric difference at most
2*|d|. Hence for two arbitrary cores A,A', uniformly over all real z,

    |f_A(z)-f_{A'}(z)| <=2*sum_j |A_j-A'_j|,
    |mu(A)-mu(A')| <=2*sum_j |A_j-A'_j|.

The second inequality follows by taking infima, not by transferring a
generic stationary condition. Thus the value is continuous even when the
number of components, knots or maximizing intervals changes. The exact
direct formula still supplies the candidates on each singular face.

## 4. At most102 knots and203 candidate values, including faces

There are ten core sloping endpoint lines. Among their45 unordered pairs,
four are parallel(L_j,R_(j+1)); their intercepts may also coincide.
Five other pairs are each triangle's own L_j/R_j and meet only at t=0.
Hence at most36 nonparallel core intersections occur at0<t<1. Add at
most five top apices and ten bottom endpoints: there are at most51
potential vertices of the actual union boundary in the strip.

The knots in section2 belong only to

    x_vertex+5*t_vertex, x_vertex+6*t_vertex.

This count is not the count obtained by splitting every boundary at every
unrelated crossing height. Such artificial cuts telescope: for an
unchanged affine segment the upper primitive of the earlier slab cancels
the lower primitive of the next slab with identical slope and sign.
The same observation applies if a label representative is changed along
an identical coincident line. Genuine switches, component merges/splits,
and births/deaths end boundary segments at actual edge intersections.
Coincident parallel edges create no additional vertex: their segment
endpoints are existing apices, bottom endpoints or nonparallel crossings.
An isolated multiple contact is one geometric point, even if several
pair events coincide. These statements are direct boundary bookkeeping,
not perturbation of a local minimum.

The zero-slope term is the actual L5 boundary and has its knot at A5,
already a top vertex projection. Thus there are at most102 distinct
knots. L and H occur among the top/bottom projections, so they are
included. Hidden vertices or canceled coefficients may be retained as
harmless superfluous knots, and duplicate knots are collapsed.

Sort the knots in K as q1<...<qk, with q1=L,qk=H, k<=102. On each
bounded interval(q_l,q_(l+1)), expand the exact formula as

    C_A(z)=a_l*z^2+b_l*z+c_l.

Its maximum over the closed interval occurs at an endpoint or, if
a_l<0, at z_l=-b_l/(2a_l) when q_l<z_l<q_(l+1). For a_l>=0 only
endpoints are needed. If a_l=b_l=0 the entire interval is flat, and its
endpoints already supply its value; the full argmin certificate may
retain the whole closed flat interval when it wins. Roots at knots are
already included. Therefore define

    Z_A={all q_l} union
      {-b_l/(2a_l):a_l<0 and q_l<-b_l/(2a_l)<q_(l+1)}.

Then the completely finite elimination is

    mu(A)=1/2-max_{z in Z_A} C_A(z), |Z_A|<=2k-1<=203.

All evaluation and feasibility tests are real arithmetic and comparisons;
no polynomial root of degree above1 is needed for the eliminated variable.
The ceiling102/203 is proved, not claimed sharp/attainable for a particular
core. Actual certificate size is the data-dependent k plus its feasible
concave-piece vertices, often smaller.

## 5. Equivalent two-union derivative formula

This supplies another exact construction, not a monotonicity assumption.
For k=5,6 let

    Q_k(z)=measure{t in[0,1]:z-k*t belongs to U_t}.

For a core label j set d=z-A_j,m=k-j>=0. Its contributing height set
is empty if d<0. If m>0 and d>=0 it is

    [max(0,d/(m+1)), min(1,d/m)]

when the upper endpoint is at least the lower one. If m=0, it is
[d,1] for0<=d<=1 and empty otherwise. At isolated endpoint cases any
closed/open convention is immaterial for integrals. Q_k is the length
of the ACTUAL UNION of these five height intervals, not their sum.

Differentiating a sliding interval against the fixed U_t gives, for
almost every z,

    C_A'(z)=Q_5(z)-Q_6(z),
    C_A(z)=integral_L^z [Q_5(s)-Q_6(s)]ds.

The latter formula follows from absolute continuity and C_A(L)=0.
Persistent parallel coverage atz=A5 may give a derivative jump; it does
not invalidate the almost-everywhere identity or its integral. No claim
that Q5-Q6 is monotone or has a unique root is made.

## 6. Fixed-core versus parametric complexity

For a given core the whole task is small and finite: at most36 interior
crossing times,51 possible geometric vertices,102 knots,203 values.
A further expression-size bound is at most82 sloping boundary segments:
the ten original edge segments are split by at most36 interior pair
intersections, each splitting at most two of the original segments.
Multiple contacts and coincident lines only reduce this bound. Each
boundary segment contributes at most four truncated-power terms, so at
most328 terms suffice before coefficient aggregation and cancellation.
A direct construction sorts the ten endpoints on at most37 height slabs,
merges actual components, telescopes unchanged segments, then sorts the
knots and inspects the quadratics. All degeneracies are finite and handled
by the same rules. No asymptotic optimal-runtime or bit-complexity claim
is needed for these explicit fixed-five bounds. In a general n-core
version the same count gives at most2n^2+1 vertices,4n^2+2 knots and
8n^2+3 candidates; naive slab reconstruction costs O(n^3 log n) real
operations, and sorting/processing the resulting knot list O(n^2 log n).
These are construction bounds, not claims that the ceilings are attained.

The core parameters are different. Translation permits A5=0, leaving
FOUR real core variables. Each potential crossing height is affine in
those variables, with fixed nonzero integer denominators. Every projected
vertex knot is likewise affine. A sufficient polyhedral partition fixes
core crossing-time order and whether times lie in[0,1], the four parallel
intercept comparisons, and the order of the potential102 knots.

A conservative inventory is

    choose(36,2)+2*36+4+choose(102,2)=5857

affine comparison hyperplanes before removing duplicates or irrelevant
events. Here the first630 compare pairs of36 potential non-own,
nonparallel crossing times, and the next72 compare each such time with0
and1. Equivalently these are all comparisons in the38-element time list
{0,1,tau1,...,tau36}, except the constant comparison0=1, which is not a
hyperplane. Every pair of distinct apex intercepts appears as a nonparallel
crossing time at0; hence these comparisons also fix the initial endpoint
order. The four parallel comparisons are conservatively retained; their
intercept orders can also be recovered indirectly from nonparallel
tau=0 comparisons, so this inventory need not be minimal. Slopes and
own-triangle endpoint orders are fixed. Thus the complete sequence of sorted core endpoints,
component topology and boundary segment eligibility is fixed. The final
5151 compare all pairs of102 affine projected-vertex knot forms, including
those whose vertex may be outside the strip; retaining these irrelevant
forms only over-refines the partition. Support endpoints are among them.

This5857 inventory concerns core topology and knot order, NOT all later
stationary-candidate feasibility domains or certificates. Each candidate
adds at most its two affine interval-eligibility constraints. Identically
zero comparisons and repeated hyperplanes are discarded. Full-dimensional
chambers in four variables are at most
sum_{d=0}^4 choose(5857,d); all their lower-dimensional faces also need
coverage. This is a large combinatorial UPPER bound, not an enumeration,
an attainable count, or an authorized computation. On faces simultaneous
events and coincident lines are treated directly by sections2–4.

On any fixed actual combinatorial face, the coefficient a_l of z^2 is a
constant rational number: all slopes in the hinge primitives are fixed.
b_l is affine in the core parameters and c_l is quadratic. The c=0
primitive coefficient is a visible segment duration, hence affine, and
preserves these degrees. Therefore every feasible interior maximizing
z_l is AFFINE in the four core variables, and every candidate coverage
value is QUADRATIC in those variables. Knot candidates also have quadratic
values. Their feasibility conditions are affine. G5 is quadratic on the
same core geometry face, by integrating its affine component widths
between affine crossing times.

Thus a possible complete symbolic certificate is a finite collection of
quadratic lower bounds on polyhedral core domains. It need not compare
which candidate wins: the whole K6 inequality is equivalent to

    G5(A)+1/2-C_A(z_candidate) >=40/31

for EVERY feasible candidate on EVERY core domain and face. Negative or
zero core apex gaps, disconnected cores, parallel coincidences, exposed
contacts and flat candidate pieces are all part of that collection.
Reducing dimension and degree does not establish these inequalities.

## 7. Feasibility decision and remaining root obligation

Fixed-core elimination is algebraically feasible and proved above; it
requires no optimizer or numerical search. The resulting all-core problem
is not a203-point global search: the candidate coordinates and values
vary over four continuous variables and many original faces. A complete
global quadratic-domain certificate is still absent, and exhaustive
symbolic chamber work is neither carried out nor authorized here.

No restriction to K5 minimizers is valid. The elimination theorem is
independent of the earlier conditional internal K5 lower-bound chain.
If that corrected TIP101/103 chain is invoked, it supplies G5>=70/61
and hence epsilon=G5-70/61>=0 for arbitrary real cores under those
retained certificate assumptions. A construction at70/61 alone does
NOT supply this lower theorem or a stability constant. The reduced target
epsilon+mu>=270/1891 is just the algebraic rearrangement of
G5+mu>=40/31; no numerical global stability coefficient is invented here.

The existing2632-cell K5 cover treats only strict positive pair-overlap
cores, after excluding other cores for the K5 target. Its outside-core
bound rescales to G5>=85/74, which is BELOW40/31. Thus that exclusion
cannot be imported to discard outside cores in the K6 reduced problem.
The present all-core formula covers them, but a new joint G5+mu
certificate would still be required there. The old strict-core cover is
not a ready-made complete partition of the new all-core parameter space.

The strongest delivered output is exact all-core one-variable elimination
with finite candidate feasibility, plus an honest description of the
remaining four-variable quadratic certificate. K6/root remains OPEN.

## 8. Workflow and resource record

AGENTS, research protocol, latest active/handoff, new R9 scope and the full
local Vibecode Kit plus TIP/report reference were read before task work.
An aggregate truncated handoff read was repaired by rereading its latest
checkpoint separately. The skill supplies only minimal proof/review and
truthful completion discipline, not mathematical evidence.

Math subprocesses0; seconds0; failed starts0. No arithmetic code, samples,
enumeration, optimizer, LP, UI/API/Git writes, build/install, new agent,
infrastructure, assets, scratch copies or deletion. Only new own R9
Markdown is edited. Review and actual stop timestamps follow when observed.

## 9. Literal review and final stop

Independent critic FULL sections1–8 review was observed13:03:25 UTC;
the added continuity paragraph was FULL read13:04:37. Accepted scope:
exact all-core elimination, attainment, degeneracies,102/203 candidate
ceiling and conservative PRE-eligibility5857 inventory, not a whole K6
lower bound. Main FULL read was observed13:04:06. The f_{A'} notation,
redundant parallel-wall wording and retained conditional K5 theorem
distinction were corrected in response. A small expression-size82/328
bound was separately routed for final literal confirmation.

Critic FULL repaired proof/completion read observed13:06:46 accepted all
wording repairs and the82-fragment/328-term expression-size bound. This
is not a sharp count or whole-production qualification. Builder FULL
Main/critic source-note reread was observed13:06:39, literal review only;
the equivalent opposite-oriented hinge formula and no-closure scope agree.
Builder FULL bilingual final report read observed13:07:20 agreed with
E1/E2 prerequisite acceptance, unqualified whole-production cost and K6
OPEN. This is a final literal check, not additional mathematical work.

Builder NEW derivation STOP was observed13:05:32 UTC after Main's
completion routing and wording repairs. This is early completion of the
requested prerequisite formula/feasibility decision, not time exhaustion
or a mathematical refutation. Original13:43:24 cutoff and13:53:24 hardstop
remain unchanged. Only literal review and recording follow. Fixed-core
symbolic elimination is qualified; complete whole-K6 production is NOT
qualified by an affordable certified cost or global quadratic-domain proof.
No execution grant or automatic next run follows.
