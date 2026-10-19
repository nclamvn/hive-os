# TIP116 R9 — independent exact-insertion review

Status: prerequisite E1/E2 hand-checked; PARTIAL / global K6 OPEN.
No global K6 floor or exclusion is claimed.

Owner activation 2026-10-12 12:53:24 UTC; derivation cutoff 13:43:24 UTC;
absolute hard stop 13:53:24 UTC. Mathematical subprocess grant/use: 0.
Only this new critic R9 note and its new completion may change. All
predecessors, including R8, remain frozen.

## 1. Full real-core domain and exact operator

Let A1,...,A5 be arbitrary real apices, with no ordering, connectedness,
stationarity or K5-optimum restriction. At physical height 0<=t<=1 set

    U_t = UNION_(j=1..5) [Aj-j*t, Aj-(j-1)*t],
    I6(z,t) = [z-6*t,z-5*t],
    C(z) = integral_0^1 |I6(z,t) intersection U_t| dt,
    m(z) = 1/2-C(z), mu(U)=inf_z m(z).

The actual union satisfies G6=G5+m(z). It is not a sum of individual
pair overlaps. Define the covered-ray lengths

    Qk(z)=measure{t in [0,1]: z-k*t belongs to U_t}, k=5,6.

For source j put d=z-Aj and m=k-j. If m>0, membership is exactly
m*t<=d<=(m+1)*t. Its height interval is empty for d<0, and otherwise

    [max(0,d/(m+1)), min(1,d/m)],

interpreted as empty if reversed. For m=0, possible only when k=j=5,
the interval is [d,1] for 0<=d<=1 and empty otherwise. On each ray Qk
is the length of the UNION of all five source intervals, not their sum.
Point endpoints do not alter its integral.

The moving-window/Fubini identity gives

    C'(z)=Q5(z)-Q6(z) almost everywhere,
    C(z)=integral_L^z [Q5(s)-Q6(s)] ds, L=min_j Aj.

C is absolutely continuous. The sole persistent parallel moving/core
edge is z-5t versus A5-5t, at z=A5. The chosen boundary membership there
can affect a one-sided derivative, never the integral. Repeated apices,
simultaneous contacts and physical-height endpoints require no genericity.

## 2. Attainment over every core

Insertion has positive overlap with source j only if

    Aj < z < Aj+7-j.

Hence C=0 and m=1/2 outside the compact support interval

    K=[min_j Aj, max_j(Aj+7-j)].

In fact EVERY core permits mu<=1/6: take z=A5+2/3. The adjacent5/6
pair lens at apex distance d in [0,1] equals d-3d^2/4; at d=2/3 it
equals1/3. Adding the other core triangles cannot decrease coverage.
Thus the minimum of the continuous marginal is attained inside K, not
in a discarded tail. No positive-overlap assumption on the core is used.

For completeness mu is strictly positive for each fixed finite core.
At any z, unequal core apices have positive distance from the insertion
apex and cannot meet it for sufficiently small positive t. Core apices
equal to z are labels<=5, whose intervals lie to the right of the new
triangle (the label5 boundary only touches its right edge). There is
therefore a positive early interval on which the inserted triangle's
interior is uncovered. Each m(z)>0; attainment gives fixed-core mu>0.
This is not a quantitative global stability constant or a K6 bound.

## 3. Finite candidate completeness and degeneracies

The ten core endpoint lines have slopes0,-1,...,-5. There are45 line
pairs, four parallel pairs, hence at most41 nonparallel intersections.
The five within-triangle intersections occur at t=0, leaving at most36
interior vertices. Include at most five apex points at t=0 and ten
endpoint points at t=1: at most51 distinct relevant arrangement vertices.
Coincident/parallel edges and simultaneous intersections only collapse
vertices; they cannot add any. Actual union boundary vertices are a subset.

For each maximal actual core union boundary segment e(t)=a-s*t on
alpha<=t<=beta, use the signed moving-window hinges with k=5,6:

    integral_alpha^beta (z-a-(k-s)*t)_+ dt.

If q=k-s>0 this is

    [(z-a-q*alpha)_+^2-(z-a-q*beta)_+^2]/(2q).

If q=0 it is (beta-alpha)(z-a)_+. This occurs only for k=s=5,
a=A5. Left/right union endpoints receive their actual opposite signs.
Unchanged affine segments telescope across artificial slab cuts; maximal
boundary segments avoid such cuts altogether. All knots are therefore
among the two vertex projections v_x+5*v_t and v_x+6*v_t. The parallel
knot A5 is already included by its top apex. There are at most102 knots.

Between consecutive knots C is a quadratic. Its maximum on a bounded
cell lies at an endpoint, or at its interior derivative root if the
quadratic is concave. Linear/convex cells need endpoints; constant cells
also have endpoint maximizers. Identically coincident knots collapse.
The unbounded tails have coverage0 and cannot be the maximum because
coverage>=1/3 somewhere. Thus at most102 knot candidates and101 interior
quadratic candidates suffice: at most203 candidates per FIXED core.
This is an exact finite representation, not sampled evidence.

## 4. Complexity and the remaining full inequality

Translation permits A1=0, leaving FOUR unrestricted core variables.
On a fixed joint endpoint/contact/order chamber, vertex projections are
affine in these apices. Coverage is quadratic jointly in (A,z); its z^2
coefficient is constant, while the linear coefficient in z is affine in
A. A nonflat interior derivative root is consequently affine in A.
Candidate substitution yields quadratic core value branches on their
affine validity/contact chambers.

The bound203 is per fixed core, NOT the number of chambers of the full
four-variable problem. Changes in vertex presence, boundary exposure,
knot order and candidate validity remain. One can avoid comparing which
candidate wins when proving a LOWER bound: prove G5+1/2-C_candidate>=40/31
for EVERY admissible candidate branch. That still requires the entire
four-variable coupled branch family; no such bound has been established.

The exact target after elimination remains

    G5(A)+mu(U_A)>=40/31 for EVERY real five-triangle core.

No restriction to K5 minimizers is admissible. A conditional K5 baseline
alone does not pay the remaining insertion deficit. The prerequisite
formula, attainment and fixed-core count are not root closure, a reduced
dimension proof, a complexity-performance promise or a new runtime gate.

## 5. Reads and resources

Required AGENTS, commitment protocol, active/latest handoff, original
TIP116, R9 scope and full latest R8 report were read. Complete local
Vibecode Kit and TIP/report reference govern only minimal scope, existing
team reuse and truthful completion labels, not mathematical evidence.

No mathematical subprocess/seconds/failed starts: 0/0/0. No arithmetic
code, sampling, enumeration, optimizer, LP, replay, UI/API/Git mutation,
build/install, infrastructure, new agent, scratch copy or deletion. Only
ordinary source/clock reads and new permitted Markdown were used.
Actual stop and full saved-source literal review times remain to be
recorded; no unobserved event is asserted.

## 6. Full literal review and feasibility verdict

FULL Main R9 draft was read at observed 13:02:08 UTC. Its opposite-oriented
hinge formula agrees with the moving-window identity. Exact all-core
operator, attainment, finite candidate completeness and quadratic branch
reduction were accepted. Targeted frozen K5 source excerpts subsequently
confirmed the restricted positive-pair domain and existential, nonnumeric
stability caveat; this was not a fresh verification of the whole K5 proof.

FULL Builder sections1--8 were read at 13:03:25 UTC; its added complete
core-continuity paragraph was read at 13:04:37. The fixed-core formula,
degenerate cases, general-n count and quadratic/polyhedral reduction were
hand-checked. Its conservative topology/knot-order inventory

    630+72+4+5151 = 5857

is sufficient BEFORE candidate-eligibility domains. It is not the actual
number of certificates/chambers or a runtime estimate. The parallel
comparisons may be kept redundantly; their intercept orders also follow
indirectly from the nonparallel crossing-time comparisons with0.

The added uniform symmetric-difference estimate gives continuity of mu
across all core faces by taking infima. Requested notation is f_{A'}(z),
not f_A'(z), to distinguish a changed core from a derivative. The K5
epsilon statement should explicitly say epsilon>=0 only if the retained
conditional internal all-real K5 theorem is invoked; a construction alone
does not supply that lower bound. These are clarification requests, not
an E1/E2 blocking gap.

Clear E2 decision: exact fixed-core elimination is feasible and complete;
the symbolic four-variable reduction is established. Full four-variable
certificate/production cost is NOT qualified by the fixed-core bound.
It is not proved infeasible, and no computation or infrastructure is
authorized. No whole-core domination follows from the two-ray identity
alone. The coupled G5+mu floor remains unproved.

One overbroad ordinary source search produced truncated output; it was
narrowed to Markdown-only K5 excerpts. No old fixture/sample output was
used as mathematical evidence, and no mathematical process was run.

## 7. Derivation stop

Following Main's closing/review routing, critic NEW DERIVATION STOP was
observed 13:05:03 UTC. Only literal repairs and final report/record review
follow. This is completion of the requested exact-reduction prerequisite,
not K6 closure, cap exhaustion, or proof of route infeasibility. Original
cutoff13:43:24 and hardstop13:53:24 remain unchanged.

FULL repaired Builder final proof and completion were read at observed
13:06:46 UTC. Notation, redundant parallel comparisons and conditional K5
wording repairs were accepted. The added expression-size bound is valid:
ten core edges gain at most two fragments per each of at most36 interior
pair crossings, so at most82 arrangement fragments; the actual maximal
union boundary is a subset/coarsening. Every fragment contributes at most
four squared/linear hinge terms, yielding328 before aggregation. Multiple
contacts are overcounted, not omitted. These are conservative expression
bounds, not sharp counts or global production-cost evidence.

FULL final bilingual R9 report and final Main note including section6
were read at observed 13:08:02 UTC. No blocking correction: exact E1/E2
prerequisite completion, OPEN K6, conditional K5 scope, independent hand
review limits and unqualified global production are all stated correctly.
No new mathematics followed the derivation stop. Final recording
checkpoint observed 2026-10-12 13:08:47 UTC; no later unseen
terminal checkpoint review is claimed.
