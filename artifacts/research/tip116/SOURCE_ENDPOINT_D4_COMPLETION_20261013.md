# K6 source-aware degree-four SOS: a full-support impossibility theorem

**Status: PARTIAL — K6 remains OPEN.** The feasibility question below is
settled negatively, not the geometric inequality. No new K6 lower bound.
Same all-real finite target `G6>=40/31`, equivalently `F6>=20/93`, in
PUBLIC_DISCOVERY. No claim about general Kakeya, novelty, Lean or external
mathematical acceptance.

Owner approved source-aware endpoint coefficients, including sources outside
a selected pair, total degree at most four, feasibility before execution,
and no infrastructure. Activation: 2026-10-13 00:44:56 UTC. Ceiling:
01:14:56 UTC. Critic's new derivation stopped 00:51:35; Main independently
checked the full argument and stopped by observed 00:52:39. Later work is
recording/literal review. Earlier notes and the 578-variable graph are frozen.

## 1. The precise class now ruled out

For the existing exact boundary-coverage graph, suppose there is an identity

    G_graph - 40/31 = sigma_0 + sum_g sigma_g*g + sum_h lambda_h*h,

where `sigma` are sums of squares, `g>=0` are the existing inequality
generators and `h=0` the existing graph equations. **Each entire summand**
has total degree at most four. All SOS supports may use **all 578 existing
variables**: every source band, flag, routed endpoint, comparator output
and prefix-coverage wire, as well as all five free apex coordinates.

This is the degree-four *quadratic module*. There is no sparse-support
restriction in the following theorem. In fact arbitrary equation-multiplier
degrees would not repair the obstruction, because every equation vanishes
at the diagnostic assignments.

**Theorem.** No real-coefficient certificate in this class exists.

The theorem does NOT cover a different grammar with products of quadratic
inequality generators, higher-degree SOS multipliers, added constraints,
or another geometric representation. In particular it is NOT a statement
that every degree-four SOS/preordering approach is impossible.

## 2. Source information was genuinely considered, not discarded

The fixed R5 network already compares the lower source-1 and source-3 band
endpoints in its second comparator. Write

    u=clip((A5-A1)/4), v=clip((A5-A3)/2), m=min(u,v), w=u-m.

All are existing wires or affine expressions. If `A3<A1`, then `u<=v`,
so `w=0`. Thus `w^2*g_minus13` is a valid degree-four source-aware term;
it explicitly involves triangle 5, outside pair 13. The earlier false lift
has `u=3/8,v=1/4,w=1/8`, so the previous own-pair/path normal form does
NOT reject this new term. No new gate or input permutation is needed.

Another affine expression using all twelve endpoint-ray unions is

    D=sum_j C0(Lj)-sum_j C0(Rj).

On a true graph `D=0`: exposed left/right component counts balance at almost
every height. Persistent parallel ties are handled by the shared flags;
upper-routing ties do not change the unions. `D^2*g_minus` is another
permitted term, without inserting `D=0` as a new graph equation.

These observations prevent reusing the old restricted proofs incorrectly.
They do not yield a target identity. The argument below allows BOTH masks,
all other source-aware affine masks, and arbitrary cross terms between them.

## 3. Proof for the entire existing-wire class

### 3.1 Bounded true area removes all apex coefficients from the relevant rows

Gauge `A6=0`. Write the graph variables as the five unrestricted coordinates
`A=(A1,...,A5)` and 573 bounded variables `B`. Every component of `B` lies
in `[0,1]` on the true graph: clips and flags, sorted/routed interval
endpoints, minima/maxima and union-prefix outputs. `C0` is an affine
expression in these wires. `C1` is quadratic, NOT a new affine variable;
putting it inside a squared affine row would silently raise the degree.

For pair 13 there are three clip variables, with raw crossings

    c_d=(A3-A1)/d, d=1,2,3,
    g_minus,d=(tau_d-c_d)*(1-tau_d).

Because these generators are quadratic and total degree is at most four,
their SOS multipliers have degree at most two. Each is a finite sum of
squared affine rows

    ell = a dot A + b dot B + k.

Assume the certificate exists. On each true graph its equation terms are
zero and all remaining summands are nonnegative. Six triangles of area
one-half have union area at most three. Hence every individual squared row
satisfies

    0 <= g_minus,d * ell^2 <= G_true-40/31 <= 53/31.

For any direction `v` in the open halfspace `v3-v1<0`, take `A=s*v`,
`s` tending to positive infinity. The true clip is zero and

    g_minus,d = -s*(v3-v1)/d.

All `B` remain bounded, so `ell=s*(a dot v)+O(1)`. If `a dot v` were
nonzero, the displayed nonnegative summand would grow cubically, contradicting
its fixed upper bound. Therefore `a dot v=0` throughout an open halfspace,
which forces `a=0`.

This holds for every row of all three pair-13 negative-tail multipliers,
regardless of source support or routing. Their rows are thus bounded affine
functions of bounded wires alone. In particular each multiplier has some
finite uniform bound `M_d`, depending on its fixed coefficients but not on
the geometric assignment, whenever the wires lie in `[0,1]`.

### 3.2 A false-lift family has unbounded loss but only bounded bad terms

For every real `T<-300`, set

    A=(T,-100,T+1,-200,T+3/2,0).

Use actual clip and flag values EXCEPT set all three pair-13 clips to zero.
Run the mathematical sorting/routing/max operations on those assigned bands;
no computer execution is needed. All bands remain ordered inside `[0,1]`.
Every graph equation is zero and all 573 non-apex wires remain bounded.

All inequalities except the three modified negative-tail clip generators
are nonnegative. The modified positive-tail generators are zero. The only
negative generators are constants

    g_minus,d=-1/d, d=1,2,3.

Thus for ANY proposed finite coefficient set, the certificate right-hand
side is bounded below uniformly in `T`:

    RHS(T) >= -C, where C=M_1+M_2/2+M_3/3 < infinity.

All other terms are nonnegative or vanish. They need not themselves be
bounded. This distinction is important: their possible positive growth
cannot compensate for a left-hand side tending to minus infinity.

Now examine the objective. Triangles 1,3,5 form a cluster with apices
`T,T+1,T+3/2`; triangles 2,4,6 are far from it for all heights in `[0,1]`.
Suppressing pair-13 coverage changes the boundary integrand as follows:

| Height | Change relative to the genuine coverage graph |
| --- | --- |
| [1/3,3/8] | 0: triangle 5 still covers both affected endpoints |
| [3/8,1/2] | `R1=T`: triangle 5 covers L3 but not R1 |
| [1/2,1] | `R3-L1=1-t`: neither endpoint remains covered by triangle 5 |

Contacts have zero height measure. The exact difference is therefore

    G_false(T)-G_true(T)=(T+1)/8,
    P_false(T)<=53/31+(T+1)/8 -> minus infinity.

This contradicts `RHS(T)>=-C`. For example one may choose `T` below both
`-300` and `-1-8*(C+53/31)`. No numerical coefficient estimate is required:
the contradiction is valid for every finite real coefficient set.

This proves the theorem. The family violates actual clipping deliberately;
it is not a geometric counterexample to K6 or a flaw in the exact graph.

## 4. What the result changes

The previous rejection concerned a selected own-pair/path support. The new
one covers the FULL existing-wire degree-four quadratic module. Adding more
source labels or coverage wires to its affine SOS rows cannot fix the issue.
Consequently **do not allocate an SDP for this class**, even after further
support expansion. No memory/time benchmark can rescue an infeasible identity.

The mechanism is a mismatch in growth, not simply missing source information:
true-area boundedness forces the relevant SOS coefficients to lose unbounded
apex dependence; the false graph's area loss nevertheless grows with the
separation of a cluster. Source-aware bounded masks can detect particular
false examples but cannot cover this entire family within that certificate grammar.

A degree-four product of TWO existing quadratic inequalities can escape
this argument because its second factor may grow with the cluster separation.
That is a preordering-type certificate, not an SOS multiplier of degree two
over the unrestricted polynomial variables. No such larger class has been
qualified or run in this turn, and no claim of its sufficiency is made.
The approved degree limit has not been increased.

## 5. Outcome and review

- R116-1 whole K6 certificate: **OPEN**, zero new global lower bound.
- R116-2 scoped feasibility: exact full-support module rejection above.
- R116-3: bounded hand derivation and preserved EN/VI record.
- Mathematical processes, SDP runs, numerical trials, code changes, builds,
  installations, UI/API/DB/Git writes, new variables/gates/constraints: **0**.
- No scratch/project copy or deletion; nothing removed.
- Existing dirty research files were preserved. No commit or push requested.

The existing critic produced the full-support argument; Main read its full
note and independently checked the recession bound, false-family integrals,
bounded-wire assumption and exact scope. This is AI hand review, not external
human or formal verification. Builder's transport disconnected repeatedly,
then recovered for a FULL literal read of critic section 5, completed at
observed 00:52:51 UTC: ACCEPT, no flaw found in the bounded-wire recession
argument, false family or module-versus-preordering scope. This is a review
of that proof, not a claim that interrupted turns or an SDP completed.
The critic's FULL Main-note review at observed 00:54:04 UTC accepted the
mathematics and scoped limits; its clarification about detecting particular
false examples rather than every example is incorporated above.
Vibecode was kept to the existing Main/Builder/critic hand-review protocol, with no
new product workflow or infrastructure.

Detailed chronological critic record:
`CRITIC_SOURCE_ENDPOINT_D4_20261013.md`, especially section 5.

## 6. Kết luận tiếng Việt

**Đã loại được toàn bộ lớp chứng chỉ đang xét, không chỉ một mẫu hệ số nhỏ.**
Dù cho phép hệ số SOS sử dụng toàn bộ 578 biến hiện có — gồm thông tin nguồn
che từng đầu mút và các tam giác ngoài cặp — lớp quadratic module với từng
số hạng bậc tối đa 4 vẫn không thể chứng minh mục tiêu trên đồ thị này.

Lý do: diện tích thật luôn bị chặn, nên các hệ số SOS liên quan không được
tăng theo tọa độ đỉnh. Trong khi đó có một họ gán sai clip làm biểu thức
diện tích giảm vô hạn; các hệ số chỉ còn phụ thuộc biến che phủ bị chặn không
thể bù mức giảm ấy. Đây là chứng minh bất khả thi của một cấu trúc chứng chỉ,
**không phải phản ví dụ hình học và không phải chứng minh K6**.

Quyết định: không tiếp tục nới hỗ trợ hệ số hoặc chạy SDP trong lớp đã loại.
Nếu vẫn giữ bậc 4, muốn thử tiếp phải thay cấu trúc chứng chỉ, chẳng hạn xét
tích của các bất đẳng thức sẵn có. Khả thi của hướng đó chưa được xác lập.
K6 vẫn mở; chưa có cận dưới mới hay tuyên bố kết quả nghiên cứu mới.
