# K6 after exact elimination — Main global-bound attempt

Status: STOP / PARTIAL; no new global lower bound. Same R116-1, all-real
finite K6, PUBLIC_DISCOVERY. This is not a general Kakeya result.
Owner continuation observed 2026-10-12 13:09:49 UTC. Retained derivation
cutoff 13:43:24 and hardstop 13:53:24 UTC; mathematical subprocess grant 0.
Earlier R9 elimination evidence and completion remain unchanged.

## 1. Exact objective, not a restriction to optimal K5 cores

For `I_j(t)=[A_j-jt,A_j-(j-1)t]`, `0<=t<=1`, let `H` be the actual
first-five union area and `mu` the minimum added area of triangle six.
The remaining theorem is

    H(A)+mu(A) >= 40/31 for every real five-core A.

The fixed-core finite candidate theorem from the preceding R9 stage does
not bound these candidates simultaneously as the core varies. No inference
from its at-most-203 candidates to at-most-203 global regions is made.

## 2. Actual exterior union, with both sides coupled

Fix the sixth apex z and shear its interval to `[0,t]`. Put
`d_m=z-A_(6-m)`, `m=1,...,5`. Each other interval becomes

    [-d_m+m*t, -d_m+(m+1)*t].

Reflect the portion left of zero and translate the portion right of t
back to zero. Their exact distance intervals are

    L_m(t)=[(d_m-(m+1)*t)_+, (d_m-m*t)_+],
    R_m(t)=[((m-1)*t-d_m)_+, (m*t-d_m)_+].

Degenerate intervals have zero length. These formulas include negative
d_m, large d_m, all contacts and all disconnected arrangements. They
follow by intersecting the original interval with `(-infinity,0]` and
`[t,infinity)` respectively, before measuring it. Therefore

    G6(A,z)=1/2 + integral_0^1 (|UNION_m L_m(t)|+|UNION_m R_m(t)|) dt.

The desired sufficient-and-necessary uniform statement is that this last
integral is at least `49/62` for ALL five real d_m. The same d_m controls
left-side escape, right-side escape, mutual overlap and detached gaps;
optimizing those separately discards the needed coupling. Neither summing
individual escaping widths nor taking only their maximum gives the exact
union. I have not obtained a valid simultaneous lower comparison at 49/62.
This identity is bookkeeping for the existing objective, not new closure.

## 3. Exact dynamic overlap alternative, with its unpaid term explicit

At fixed height define pair overlaps

    w_ij(t)=(t-|A_j-A_i-(j-i)*t|)_+.

The full union length is `6t-M(t)`, where M(t) is the maximum spanning
tree weight on these six vertices. To see this without any source-order
assumption, sort the six left endpoints. The adjacent path has edge
weights `(t-gap)_+`, whose sum is `6t-union_length`. For each weight
threshold, any non-neighbor edge exceeding the threshold connects two
points already connected along that sorted path. The threshold components
thus agree; the path realizes the maximum tree weight. Ties and zero
weights cause no change in the identity.

Consequently the target is equivalently

    integral_0^1 M(t) dt <= 53/31.

A bound on each FIXED tree's integrated weight is not an upper bound on
this integral of a time-dependent maximum. In particular five adjacent
pair-lens caps of 1/3 do not justify replacing M by that fixed tree. At
the retained sharp placement, the actual dynamic overlap is 53/31,
strictly above 5/3 by 4/93. No quantitative switching-payment inequality
has been established here. Thus this reformulation also remains unclosed.

## 4. Tested sufficient shortcuts and their exact limitations

Builder's direct first-five calculation at
`A*=(0,25,36,70,81,106)/31` gives `H=1114/961`. Under the corrected
conditional internal K5 baseline, `epsilon=H-70/61=684/58621>0` and
`c=270/1891`. The feasible sixth apex adds `126/961=c-epsilon`.
Hence every proposed uniform calibration `mu>=c-a*epsilon`, `a<1`,
is false: the minimum insertion cost is no larger than that feasible
cost. At a=1 this is simply the original unproved target. This refutes
that stronger calibration, not K6 or a shape-dependent bound. Main read
the complete Builder calculation and separate critic check in this run.

The separate critic also produced an actual integrated counter to the
UNRESTRICTED adjacent-apex sorting rule: at

    A=(16/7,16/7,14/3,4,134/21,134/21),

swapping A3 and A4 increases the whole union area by 4/189. Main read
the complete piecewise union proof, including the symbolic parameter
range, at 13:27:31 UTC. Direct endpoint checks and integration agree.
This configuration has bottom range 5/3 > 49/31 and is NOT a retained
competing minimum. It does not rule out a minimum-aware comparison, and
does not justify assuming such a comparison. No retained inverted class
is excluded by this counterexample.

### 4.1 Stronger exact obstruction inside the retained geometric range

The critic then varied the separation of the SAME two exterior fans and
obtained

    A=(44/21,44/21,32/7,4,136/21,136/21).

Its bottom coordinates `p_j=A_j-j` are
`(23/21,2/21,33/21,0,31/21,10/21)`. Thus the bottom is strictly connected,
its largest sorted gap is 13/21, and its range is `r=11/7<49/31`.
The only positive adjacent-apex inversion is 3/4, with `u=4/7`.
Main directly checked the complete actual half-union formulas in the
critic's section 4.1: their integrals are 307/294 before and 923/882
after swapping this pair. Consequently

    G_old=921/441, G_swap=923/441, G_old-G_swap=-2/441.

This ALSO refutes the geometry-only averaged premise (P) preserved as
unproved in R4. That premise includes retained range, connected bottom,
nonadjacent apex comparisons and their contact faces. In the notation
of the frozen exact R4 identity,

    G_old-G_swap=integral_B S-R_u, 0<=R_u<=3u^2/4=108/441.

Hence this actual example satisfies `integral_B S<=106/441`, whereas
(P) requires

    u(5-r)/12+u^2/3=120/441.

Its failure margin is therefore at least `14/441=2/63`.

This is not solely an apex-tie artifact. Set `e=1/100000` and move
`(A1,A2,A5,A6)` by `(-e,+e,-e,+e)`, keeping A3 and A4 fixed. Range r
and inversion u are unchanged; the bottom remains strictly connected;
the apex word is strictly `(1,2,4,3,5,6)`. Translating each triangle by
e changes its indicator on area at most 2e, so each whole union changes
by at most 8e, and the difference of the two areas by at most 16e.
Therefore the swap still increases actual area by at least
`2/441-16e>0`, and (P) still fails by at least `2/63-16e>0`.

Crucial scope: these placements are NOT competing whole-six global
minima; their area is far above 40/31. Thus they do not refute an inequality
assuming complete six-triangle global optimality, the exact R4 identity,
the R9 elimination theorem, or K6. They do definitively bar reusing
geometry-only (P) to fill the missing global proof. Frozen R4 records
remain unchanged; this later correction supersedes their OPEN status for
that precise broad predicate only.

The old twelve inversion continua, all required faces, and whole-proof
assembly are not discharged. Full-six minimality cannot be replaced by
two-coordinate balance, a scalar core excess, or an unproved profile
Monge inequality. No new necessary condition is counted as progress.

## 5. Research boundary

Relevant primary-source lookup refreshed the finite-model context:
https://dualverse.ai/station/math/discretized-kakeya-needle/ . No missing
all-real K6 inequality was obtained from that lookup; it was not a novelty
audit. No downloaded/executed external code or full enumeration was used.

Only hand mathematics, source/clock/status reads and scoped Markdown.
No mathematical subprocess, optimizer, sample, LP, replay, infrastructure,
UI/app/DB/API/Git mutation, build, install, new agent or scratch directory.
Existing Builder and critic are the roles prescribed by TIP116; their
agreement is not formal verification or external mathematical acceptance.

Main new-derivation stop recorded at the observed 13:34:09 UTC clock;
subsequent work is literal recording/review, not new proof development.
Reason: definite failure of the attempted uniform geometry-only exchange
route, with no valid exterior/dynamic-overlap domination obtained. This
is an early failed-route stop, NOT exhaustion of the retained time cap,
not a claim that every possible proof route is impossible, and not an
automatic successor grant. Whole K6 remains OPEN; no new lower bound or
global domain closure is claimed.
