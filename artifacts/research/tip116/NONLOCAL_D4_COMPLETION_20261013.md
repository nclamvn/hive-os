# K6: nonadjacent degree-four SOS support — exact feasibility rejection

Status: **PARTIAL; K6 OPEN.** No new global lower bound or SOS certificate.
Target remains the all-real finite problem `G6 >= 40/31` (`F6 >= 20/93`),
not general Kakeya. PUBLIC_DISCOVERY. Predecessors remain unchanged.

Owner approved nonadjacent SOS support expansion, total degree at most four,
feasibility before execution, no infrastructure. Scope activated
2026-10-12 23:53:36 UTC, ceiling 2026-10-13 00:23:36 UTC. Main stopped new
derivation by the observed clock 00:02:59 UTC on the scoped rejection below.
Subsequent activity is recording and literal review. Mathematical subprocesses,
SDP runs, installations, builds, UI/API/DB/Git writes and deletions: zero.

## 1. A concrete expansion, not a dense unspecified SOS

Use the preceding exact 578-variable boundary-coverage graph. Its paired
sorting network starts with the disjoint comparators `(0,3),(1,4)`. Earlier
notes specified the network but not the initial source-label permutation.
Complete that labeling as follows: put each displayed source pair into one
of those comparators, and fill remaining input slots in increasing source
order. This changes neither the five source bands nor their union, and adds
no variables, constraints or gates. It does not assert that an old named
wire already had this completed meaning.

| Ray | First compared source pair(s) | Nonadjacent target pair(s) |
| --- | --- | --- |
| R2 | (1,3) | 13 |
| L2 | (1,4) | 14 |
| R3 | (1,5), (2,4) | 15, 24 |
| L3 | (1,6), (2,5) | 16, 25 |
| R4 | (2,6), (3,5) | 26, 35 |
| L4 | (3,6) | 36 |
| R5 | (4,6) | 46 |

For `i<k<j`, the two lower endpoints on Rk are
`clip((Ak-Ai)/(k-i))` and `clip((Aj-Ak)/(j-k+1))`; on Lk their
denominators are `k-i+1` and `j-k`. Let their existing comparator outputs
be the minimum `r_ij` and maximum `v_ij`. If `Aj<Ai`, at least one input
is zero, so `r_ij=0`, including boundary/tie cases. These are genuine
nonadjacent couplings within the same graph.

The tested expanded class allows each quadratic clip generator's SOS rows
to be affine in all five apex coordinates, all five adjacent sign flags,
ALL THREE clips of its own nonadjacent pair, and its selected `r_ij,v_ij`.
A squared affine row times a quadratic generator has total degree four.
This includes cross terms between those variables, not just separate squares
of the newly added wires. Equation multiples can be arbitrary within the
approved degree limit. The rejection below actually permits arbitrary-degree
equation multiples and arbitrary other nonnegative certificate terms, as
long as no further term involving an erroneous pair-13 clip generator is
introduced outside the specified SOS support.

This is a specific small-support expansion. It is NOT the class of all
affine rows in all 578 variables, nor all degree-four preorderings.

## 2. Necessary normal form of the three pair-13 negative-tail multipliers

Write `x=A2-A1`, `y=A3-A2`. On R2 the selected outputs are

    r = min(clip(x), clip(y/2)),
    v = max(clip(x), clip(y/2)).

The three pair-13 crossings are `c=(x+y)/d`, `d in {1,2,3}`. Their
negative-tail generator is `g_minus=(tau-c)*(1-tau)`.
Suppose a global certificate exists. On every true graph assignment all
its nonnegative summands individually satisfy

    0 <= g_minus * ell^2 <= P = G - 40/31 <= 53/31.

This uses only the sum of six individual triangle areas, `G<=3`. Equality
terms vanish. Factor each degree-two SOS into squared affine rows `ell`.

* On an open cone with `x+y<0`, scale all apex coordinates to infinity.
  All graph wires in a row are bounded; `g_minus` grows linearly. Thus the
  apex-linear part of every row vanishes identically.
* Fix `x=a` with `0<a<1`, and let `y` tend to minus infinity. Then the
  own-pair clips are all zero, `r=0`, `v=a`, and `(b1,b2)=(1,0)`.
  Boundedness for every `a` kills the coefficient of `v`. Varying the other
  three flag signs independently kills their coefficients and leaves
  `beta1 + constant = 0`.
* Let `x` tend to minus infinity while fixing `0<y<2`. This gives
  `beta2 + constant = 0`.
* Let both `x,y` tend to minus infinity. This gives `constant=0`, hence
  also `beta1=beta2=0`.

Consequently every such negative-tail row must have the form

    ell = gamma1*tau_13,1 + gamma2*tau_13,2
          + gamma3*tau_13,3 + rho*r.

No assumption about coefficient rationality was used. This excludes real
coefficients too, if the following false-lift test contradicts the identity.

## 3. An exact outside-index three-triangle obstruction

Set

    (A1,A2,A3,A4,A5,A6) = (-32,-100,-31,-200,-61/2,0).

Take all clips and flags at their actual values EXCEPT replace all three
pair-13 clips by zero. Evaluate every sorting and max gate exactly on
these assigned bands. All graph equalities hold. All inequalities other
than the three pair-13 negative-tail generators are nonnegative. For pair
13 the positive-tail generators are zero, since their own tau is zero.
Moreover `r=0,v=1`: source 2 lies far outside the active cluster. The
normal form above makes every incorrectly signed weighted term zero.
Every right-hand certificate term is therefore nonnegative and every
equation term zero, regardless of the coefficients on the other blocks.

But the formal area is negative. Here is a direct boundary calculation,
without a solver, numerical fit or chamber enumeration. Write `T=-32`;
the active triangle apices 1,3,5 are `T,T+1,T+3/2`. Triangles 2,4,6 are
disjoint from that cluster for all heights `0<=t<=1`.

For pair 13, on `1/3<t<1/2`, the covered boundary endpoints are L3,R1;
on `1/2<t<1`, they are L1,R3. Removing their pair-13 coverage changes
the area only when the third triangle does not already cover that endpoint.

| Height interval | Coverage by triangle 5 | Change in boundary integrand |
| --- | --- | --- |
| [1/3,3/8] | Both L3 and R1 | 0 |
| [3/8,1/2] | L3 but not R1 | `R1=T` |
| [1/2,1] | Neither L1 nor R3 | `R3-L1=1-t` |

Endpoint equalities have measure zero and do not alter the integrals. Thus

    G_false - G_true = T/8 + 1/8 = -31/8.

Since `G_true<=3`, we already have `G_false<=-7/8 < 40/31`, contradicting
the proposed identity. This proves the specified expanded support class
cannot certify the target. The construction is deliberately NOT a feasible
clipped geometry and is NOT a counterexample to K6.

The decisive issue is not just adjacent versus nonadjacent pairs: triangle
5 changes which pair-13 boundary terms survive, although its index is outside
the pair and triangle 2 is far away. A multiplier knowing only the pair and
an index-intermediate path loses that interaction.

## 4. Feasibility decision and exact limits

**Do not allocate or run an SDP for this class.** Its coefficient feasibility
is exactly false, so timing/memory estimates cannot rescue it. No degree
increase or solver experiment was performed. The valid 578-variable global
geometric representation is not refuted.

Adding arbitrary other coverage wires to the pair-13 multiplier has NOT
been ruled out. In particular, a class recording outside-index third-source
coverage may escape this proof. No exact global identity or execution cost
qualification for that broader class was obtained in this turn. Escaping
this witness alone would not establish its feasibility or prove K6.

The result is an exact pruning of a specified proof approach, not a positive
K6 milestone, a new area bound, a novelty claim or a formal Lean certificate.
No product code or infrastructure was added. Nothing was removed.

Independent AI hand review (not external mathematical or formal acceptance):
Builder FULL Main-note review observed 00:03:55 UTC accepted the source
permutations, normal form, false-lift boundary integral and scoped limits.
Critic FULL Main/Builder-note review likewise found no blocking mathematical
error; its new derivation stopped at 00:03:51 UTC. Builder stopped at
00:03:41 UTC. Their separate notes are `BUILDER_NONLOCAL_D4_20261013.md`
and `CRITIC_NONLOCAL_D4_20261013.md`. Both are permitted hand-only reviews,
not solver certificates or independent human acceptance.

## 5. Kết luận tiếng Việt

Đã thử mở rộng hệ số SOS để nối đủ 10 cặp tam giác không kề nhau, dùng
biến min/max sẵn có và giữ tổng bậc tối đa 4. Tuy nhiên, đã chứng minh bằng
đại số chính xác rằng mẫu hỗ trợ này vẫn không thể cho chứng chỉ toàn cục:
nó không giữ được ảnh hưởng của tam giác thứ ba nằm ngoài khoảng chỉ số
của cặp đang xét. Vì thế không chạy SDP cho mẫu đã bị bác bỏ.

**K6 chưa khép; chưa có cận dưới mới.** Kết luận chỉ loại mẫu đã chỉ rõ,
không loại mọi chứng chỉ bậc 4 hay mọi cách dùng 578 biến hiện có. Mở rộng
tiếp phải giữ được việc nguồn thứ ba che từng đầu mút; chưa có chứng chỉ
hay đánh giá chi phí đủ để tuyên bố hướng rộng hơn khả thi.
