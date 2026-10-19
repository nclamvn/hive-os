# TIP116 — triple interaction / source-moment assembly

STATUS: PARTIAL; the all-real K6 target remains OPEN. No identity proving
`Q<=53/31` on the exact490-variable graph was obtained. No new global
area floor or full degree-four impossibility is asserted.

Owner scope: `TRIPLE_COVERAGE_SCOPE_20261013.md`; activation2026-10-13
10:20:47UTC, cap10:50:47UTC. Builder new derivation STOP observed10:31:42UTC:
the hand coefficient assembly was exhausted early, not a resource timeout.
Subsequent work is recording and literal review only. Predecessors unchanged.

## 1. Actual target and named attempted assembly

Use the frozen exact model with `f(s)=s-s^2/2` and
`D_ray=integral_0^1(1-t)*coverage_ray(t)dt`. The signed ray coefficients are

    c_R1=3,c_R2=2,c_R3=1,c_L4=1,c_L5=2,c_L6=3,
    c_L1=-2,c_L2=-1,c_R5=-1,c_R6=-2.

Thus `Q=sum_ray c_ray*D_ray`, `G=3-Q`, and the requested certificate is
`P=53/31-Q>=0`, all orders, faces and source interactions included.
The area-preserving compact domain D is available; no natural order is assumed.

The named attempt was a source-moment telescope: first cancel the sorting
and max equations exactly, then pay the remaining signed whole-prefix
overlap terms with the existing pair/triple clip identities and admissible
source-aware products/SOS of expanded total degree at most4. The cancellation
below succeeds. The nonnegative payment needed to finish it does not.

## 2. Max cancellation without an aggregate bound

For `r=max(a,b)` write `h_r=(r-a)(r-b)`. Polynomially, even off the root,

    f(r)-f(a)=(r-a)*(1-b)+(r-a)^2/2-h_r.

Expansion gives `(r-a)*(1-(r+a)/2)`. If `r-a>=0` and `1-b>=0` are
admitted generators, this proves transformed monotonicity by a degree2
product, a free square, and the max equation. It needs no upper bound on
the OLD aggregate a. This improves the symmetric expression involving both
input bounds, but does not authorize `1-b` when b is a carried routing wire.
True wire bounds are not silently added to the frozen generator inventory.

Also `1/2-f(r)=(1-r)^2/2` is a free-square identity, with no r-bound needed.
Neither observation supplies the sharp ten-ray inequality.

## 3. Exact routing and full-source overlap remainder

For one paired routing comparator, let inputs be alpha,beta and carried
outputs p,q. Put `e=p+q-alpha-beta`, `h=(p-alpha)(p-beta)`. Then

    f(p)+f(q)-f(alpha)-f(beta)
      =-h+e*(1-(q+alpha+beta-p)/2).

This is an exact degree2 polynomial identity, not just a true-graph relation.
It transports the sum of f-values through the entire paired sorter by
existing equation multiples, including tied lower endpoints.

On one ray, after sorting valid bands `[l_k,h_k]` by lower endpoint, set
`H_1=h_1,S_1=l_1`, and for k>=2,
`H_k=max(H_(k-1),h_k)`, `S_k=max(H_(k-1),l_k)`. Define the quadratic
ABBREVIATION (not a new variable or inequality)

    E_k=f(h_k)-f(l_k)-f(H_k)+f(S_k),  E_1=0.

Then the exact existing union-moment formula telescopes to

    D_ray=sum_k[f(h_k)-f(l_k)]-sum_k E_k.

For genuine ordered bands, E_k is the weighted overlap of the new band with
the WHOLE previous union: an earlier interval attaining H_(k-1) starts at or
before l_k and covers every point from l_k to that upper endpoint. It is not
a sum of pairwise overlaps. Equivalently, modulo the two max-root equations,
with p=H_(k-1),

    E_k=f(min(p,h_k))-f(min(p,l_k)).

All cumulative source interactions are retained. Semantic `E_k>=0` is NOT
an admitted generator; its degree-limited expansion would have to be proved.

Let Q_source denote the signed sum of the source-band f-differences after
routing conservation. The whole target becomes exactly

    P=53/31-Q_source+sum_ray c_ray*sum_k E_k.

Both signs of c occur. Dropping all overlap remainders, or merely invoking
their genuine nonnegativity, does not pay this expression. No degree<=4
identity/SOS remainder for this mixed-sign payment was found. The existing
triple expansions already cost degree4; multiplying their displayed proofs
by routing or coverage factors is not an allowed shortcut.

## 4. Precise failure of a triple-only shortcut

This is secondary to the source-aware attempt, NOT a rejection of its full
certificate class. An exact identity whose genuine-geometry summands each
depend on at most THREE apex coordinates cannot represent P. Arbitrary
equation multiples vanish on genuine geometry and do not change this fact.

Vary A1..A4 independently between low `(0,2,4,6)` and high
`(-4,-7/2,-3,-5/2)`, with fixed A5=2,A6=0. The entire coordinate box has
sheared projection hull contained in `[-4,6]`, hence lies inside compact D.
Every high triangle lies at x<=-5/2; every low triangle lies at x>=-1.
The four low triangles have empty common intersection.

With O the fixed union of triangles5,6, the fourth mixed indicator difference
(high minus low in each of the four coordinates) is

    -(1-indicator_O)*product_(i=1..4)(indicator_HIGH_i-indicator_LOW_i).

Because high and low supports are disjoint, this integrates to minus the
area of the four-high common intersection outside O. The rectangle

    49/100<=t<=51/100, -22/5<=x<=-41/10

is strictly inside all four high triangles and outside O, of area3/500.
Thus the fourth mixed difference of G is at most `-3/500`, not zero.
Every function missing one of these four coordinates has mixed difference0.
This rejects a finite exact sum of semantic at-most-three-coordinate terms,
including a clip-pair/triple-only potential assembly with equation cancellation.

It does NOT reject small syntactic wire blocks: their evaluated values may
depend on all six sources. It does NOT reject triple bounds plus a genuinely
coupled remainder, the full new-objective degree4 class, or actual K6.
The missing mixed-sign source-aware remainder in section3 is not eliminated
by this shortcut failure.

## 5. Outcome and resource ledger

Exact max/routing/source-moment cancellations were independently hand-checked
by the existing critic in messages. The fourth-mixed shortcut rejection was
also independently accepted in its stated narrow scope. No FULL literal read
of this saved note is claimed at creation; later reviews must be recorded
with their actual observed times.

No certificate, quantitative full payment, or qualified solver allocation.
The full new-objective degree-four class remains unresolved, not disproved.
No old positional-objective recession theorem is transferred to this model.

Minimal Vibecode: existing Builder/Main/critic hand review only. Mathematical
subprocesses, solver/numerical search, code, build, UI/API/DB/Git writes,
installs, new agents/variables/gates/infrastructure, scratch and deletions:0.
Only ordinary reads, hand algebra and this one new Markdown record.

**Tiếng Việt:** Chưa khép K6. Phép hủy các cổng và công thức overlap toàn
nguồn là chính xác, nhưng tổng overlap mang dấu hỗn hợp chưa có chứng chỉ
không âm trong bậc4. Cách ghép chỉ bằng các hàm của tối đa ba tọa độ bị
loại; điều đó không loại mọi chứng chỉ có tương tác đủ sáu nguồn. Cận toàn
cục40/31 và toàn bộ nghĩa vụ gốc vẫn mở; không chạy solver hay mở rộng bậc.

## 6. Subsequent literal checks, not resumed derivation

Critic FULL literal read of sections1–5 completed at observed10:33:35UTC:
ACCEPT, no blocking correction; scope is the exact cancellations, limited
shortcut rejection and truthful incomplete outcome, not a K6 certificate.

Main subsequently supplied a cycle-basis candidate. Builder checked its
stated pointwise inequality: choose ten triangles whose oriented cycles are
independent in the K6 cycle space. For an active source subset S of size k,
the selected cycles contained in S remain independent in the K_S cycle
space, so their number is at most `(k-1)*(k-2)/2` for k>=1. Therefore

    indicator_union >= sum_i X_i - sum_pairs X_i*X_j
                       + sum_selected_triples X_i*X_j*X_k.

For k>=1 the RHS is at most `k-C(k,2)+C(k-1,2)=1`; for k=0 it is0.
Integration gives a genuine global geometric lower bound using fifteen
pair overlaps and ten selected triple intersections. Equality requires the
selected cycles inside each active S to span its full cycle space.

Only this candidate's lower-bound direction was accepted in the review
message. Sharp equality, a uniform minimum of that lower expression at
40/31, and a degree<=4 expansion on the frozen490-variable graph have NOT
been established here. Membership-indicator degree3 is not an automatic
polynomial certificate degree on the clip/coverage graph. This check of a
Main-supplied candidate does not restart the Builder's independent search
or change its10:31:42 derivation STOP.
