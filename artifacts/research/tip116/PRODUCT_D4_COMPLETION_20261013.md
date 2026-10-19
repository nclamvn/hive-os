# K6: existing-inequality products of total degree four

**PARTIAL — K6 OPEN.** Feasibility of the specified full truncated preordering
is settled negatively. No global K6 lower bound or geometric counterexample
has been obtained. Same TIP116 PUBLIC_DISCOVERY, all-real `G6>=40/31`
(`F6>=20/93`); no novelty or general Kakeya claim.

Owner approved products of existing inequalities, total degree at most four,
feasibility before execution and no infrastructure. Activation2026-10-13
00:58:12UTC; ceiling01:28:12UTC. Main new derivation stopped by observed
01:00:06UTC; subsequent work records and reviews the argument. Earlier
578-variable model and no-go proofs remain unchanged.

## 1. The candidate escape, and its obstruction on true geometry

The preceding module proof used the deliberately false assignment family

    A=(T,-100,T+1,-200,T+3/2,0), T<-300,

with every clip genuine except all three pair-13 clips set to zero. For
the denominator-one negative margin `q=(tau-(A3-A1))*(1-tau)`, this gives
`q=-1`. The adjacent sign inequality `s=b1*(A2-A1)>=0` is an existing
quadratic generator. On this family `s=-100-T`, hence

    q*s=T+100 -> minus infinity.

This product has total degree four and does provide the missing growth on
the FALSE family. It therefore escapes the previous bounded-negative-term
argument if considered only at that family.

But its coefficient in a degree-four preordering must be a nonnegative
constant. On genuine configurations with

    Delta1=r, Delta2=-2r, r -> plus infinity,

the actual pair-13 clip is zero and the adjacent flag b1 is one. Both q
and s equal r, so `q*s=r^2`. A nonnegative term in a target certificate
cannot exceed `G_true-40/31<=53/31`. Therefore the coefficient of this
product must be zero. Positive terms cannot cancel this growth on true
geometry; equality terms vanish there.

This does not merely reject that example. The following classification
shows that all potentially helpful quadratic products have the same problem,
or vanish at the false family.

## 2. Exact grammar and complete generator inventory

Consider an identity

    P=G_graph-40/31
      = sum_S sigma_S * product_(g in S) g + sum_h lambda_h*h.

Each `sigma_S` is SOS, and **every whole summand has ordinary polynomial
total degree at most four** in the existing 578 variables. All supports
are unrestricted. Products of existing inequalities are allowed, including
repeated factors (which may alternatively be absorbed into SOS). This is
the full degree-four truncated preordering on these generators. Equation
multipliers may have arbitrary support; allowing higher equation degrees
would not affect the contradiction because all h vanish on the assignments.

The saved graph has exactly:

- 498 LINEAR inequalities: 80 clip bounds, 10 flag bounds, 216 paired-sort
  lower-order inequalities, and 192 prefix-max inequalities. Each takes a
  value in `[0,1]` on genuine graphs AND the false assigned-band graphs.
- 90 QUADRATIC inequalities: 40 positive clip margins, 40 negative clip
  margins, and 10 adjacent sign margins `b_k*Delta_k` and
  `-(1-b_k)*Delta_k`.
- 216 linear and 533 quadratic EQUATIONS. The latter are not additional
  inequality generator types.

The five apex coordinates are unrestricted; the other 573 graph wires
are bounded in `[0,1]`. No unbounded physical endpoint coordinate or
quadratic C1 expression is silently introduced as a new affine wire.

## 3. Exhaust all terms that could be negative on the false family

Only three generators are negative there:

    q_d=(tau_d-(A3-A1)/d)*(1-tau_d)=-1/d, d=1,2,3.

Every equation is zero, all other generators are nonnegative, and the three
same-pair positive clip margins are zero. Consequently a negative certificate
term must contain at least one of these q_d. Degree four permits ONLY the
following factor patterns.

| Pattern containing q_d | Remaining SOS degree | Behavior on the false family |
| --- | --- | --- |
| q_d alone | at most 2 | Bounded, by the recession argument below |
| q_d times one linear inequality | at most 1, hence constant SOS | Bounded |
| q_d times two linear inequalities | 0 | Bounded |
| q_d times one quadratic inequality | 0 | Coefficient forced zero, or product zero |

All other terms are nonnegative. A nonzero SOS polynomial cannot have odd
degree, so the degree-three products have only nonnegative constant weights.

### 3.1 Single-generator terms

The previous bounded-row argument remains valid under this larger grammar:
every true-graph summand is still nonnegative. Each multiplier of q_d is
a sum of squared affine rows `a dot A+b dot B+k`. On any open recession
cone `A3-A1<0`, q_d grows linearly while B stays bounded. The upper bound
53/31 forces every apex coefficient a to vanish; otherwise the term grows
cubically. Thus all such rows, and their SOS multipliers, are uniformly
bounded on the false graph family too. Source/routing support is unrestricted.

### 3.2 Products with bounded linear inequalities

The q_d are constants on the false family; the linear generators are all
bounded in `[0,1]`. Their products with nonnegative constant weights are
therefore bounded. They cannot offset an objective tending to minus infinity.

### 3.3 Products with another quadratic inequality

Their SOS weights are nonnegative constants. If two generators grow linearly
and positively along ANY genuine recession ray, their product grows quadratically.
Its coefficient must then be zero, by bounded true area. Classify the second
quadratic generator exhaustively:

1. **A clip margin for a DIFFERENT pair.** Its raw linear form is a positive
   multiple of `A_j-A_i`, linearly independent of `A3-A1` unless the pair
   is 13 itself. This remains true in the gauge A6=0. Two independent
   functionals map the five-dimensional apex space onto R2. Thus one can
   impose `A3-A1<0` and whichever strict sign activates the other clip tail
   simultaneously on an open cone. Both margins then grow linearly, so the
   product coefficient is zero.
2. **An adjacent sign margin.** Every `Delta_k=A_(k+1)-A_k` is independent
   of `A3-A1`, because pair 13 is nonadjacent. Choose its positive or negative
   sign as required while keeping `A3-A1<0`. Again both factors grow positively
   and linearly, forcing the coefficient zero. This includes Delta1 and
   Delta2: the other summand of Delta1+Delta2 can dominate with negative sign.
3. **A negative clip margin for the SAME pair 13.** All their raw forms
   are positive multiples of `A3-A1`; they grow together on its negative
   cone. The coefficient is zero. This also handles a repeated q_d factor.
4. **A positive clip margin for the SAME pair 13.** Its active tail has the
   opposite sign, so the joint-growth argument does not apply. But this
   positive margin is zero on the false family, since its own clip is zero.
   The product therefore contributes zero there regardless of its coefficient.

There are no other quadratic inequality types. Products containing three
quadratic factors, or two quadratic factors and a linear factor, exceed
the approved total degree and are not in this grammar.

## 4. The resulting contradiction

For any proposed finite real coefficient set, every potentially negative
term is either bounded uniformly in T or zero. All other terms are
nonnegative, and all equation terms vanish. Therefore some finite constant
C, depending on the coefficients, satisfies

    RHS(T)>=-C for all T<-300.

The exact boundary omission calculation retained from the preceding proof
gives

    G_false(T)-G_true(T)=(T+1)/8,
    P_false(T)<=53/31+(T+1)/8 -> minus infinity.

The three relevant height intervals are `[1/3,3/8]`, `[3/8,1/2]`, and
`[1/2,1]`, with integrand changes respectively `0`, `T`, and `1-t`.
The other triangles are disjoint from the moving 1/3/5 cluster for T<-300.
All assigned bands remain ordered in `[0,1]`, so sorting/routing/max graph
equations and their bounds really are satisfied.

This contradicts the uniform lower bound on the right-hand side.

**Conclusion:** the full degree-four truncated preordering of the EXISTING
inequalities has no real-coefficient target certificate, even with all 578
variables in its allowed SOS supports. This strictly extends the prior
quadratic-module rejection.

In fact the proof works for ANY finite constant lower bound `G>=L`: replace
53/31 by `3-L`. If L>3 the bound is already impossible on genuine geometry;
otherwise the same boundedness and false-family contradiction apply. Thus
the obstruction is not the sharp value 40/31; it concerns this representation
and degree-four certificate grammar, even for a coarse constant lower bound.

## 5. Decision, limits and verification

**Do not allocate or run an SDP for this class.** Adding more products or
more source-aware supports within its stated degree cannot repair it. No
solver timing/memory exercise is needed for an impossible coefficient identity.

This does NOT refute K6, the exact graph, all SOS mathematics, other geometric
representations, certificates with nonconstant denominators, derived constraints
not in the existing generator list, or higher degrees. Rational COEFFICIENTS
inside the rejected polynomial class are excluded, since real coefficients
are already excluded. None of those alternative grammars is tried here.
No blind degree increase or automatic successor follows from this result.

R116-1 remains OPEN: zero new geometric lower bound. R116-2 has an exact
full-class negative feasibility result; R116-3 has the bounded hand record.
Main checked the complete degree/generator classification. Existing Builder
and critic independently reported agreement; full literal-review records
are recorded here: Main read the critic's full saved proof; the critic's FULL
Main-note review at observed01:01:44UTC accepted the proof, with the coefficient
versus denominator terminology clarified above. Builder reported agreement
with the complete classification before a transport interruption; no separate
completed Builder file or unreported execution is claimed. These are AI hand
checks, not external human review or a formal proof assistant certificate.

Mathematical processes, SDP runs, numerical trials, code/build/install/UI/API/
DB/Git changes, new variables/constraints/gates and infrastructure: **0**.
No scratch copy or deletion; nothing removed. Previous dirty work preserved.
Vibecode was used only for the existing Main/Builder/critic review and record.

## 6. Kết luận tiếng Việt

Đã kiểm đầy đủ cơ chế tích các bất đẳng thức. Một tích cụ thể có thể tạo mức
giảm cần thiết trên họ gán sai clip, nhưng hệ số không âm của nó lại buộc
bằng 0 vì tích đó tăng vô hạn trên hình học thật, trong khi diện tích thật
luôn bị chặn. Phân loại mọi tích được phép cho thấy không có trường hợp bị
bỏ sót ở tổng bậc 4.

**Kết luận: toàn bộ lớp preordering bậc tối đa 4 xây từ các bất đẳng thức
hiện có không thể cho chứng chỉ mục tiêu.** Đây mạnh hơn việc loại một mẫu
SOS nhỏ. Thậm chí trở ngại áp dụng cho mọi cận dưới hằng số, nên không phải
chỉ vì mức 40/31 quá sắc: biểu diễn hiện tại và lớp chứng chỉ bậc 4 không
phù hợp với nhau cho nhiệm vụ này.

Không chạy SDP, không tăng bậc hay thêm hạ tầng. **K6 chưa khép, chưa có cận
dưới mới.** Muốn tiếp tục phải xét lại biểu diễn hình học hoặc chứng minh
một phép giảm miền tương đương; không nên tiếp tục nới hệ số/tích trong
lớp đã bị loại. Tính khả thi của hướng thay thế chưa được xác lập.
