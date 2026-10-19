# K6 — smaller structured SOS feasibility / Khả thi SOS cấu trúc nhỏ

**Outcome: exact global representation reduced; no SOS certificate found. K6 OPEN.**

Owner-authorized continuation began 2026-10-12 16:36:53 UTC, hard stop
17:06:53 UTC. Main stopped new derivation at observed 16:52:28 UTC;
subsequent work is literal review and recording, not a new search grant.
Scope: `SPARSE_SOS_SCOPE_20261012.md`. Predecessor reports remain frozen.

## 1. Kết luận bằng tiếng Việt

Chưa chứng minh được cận toàn cục `G6 >= 40/31` (tương đương
`F6 >= 20/93`). Không có miền con nào được dùng thay cho toàn bài toán.
Lượt này đạt ba kết quả về **khả thi của hướng chứng minh**, không phải
một cận dưới mới:

1. Thay cách chia theo thời điểm giao bằng tích phân biên của 12 cạnh,
   giảm biểu diễn chính xác từ 1.130 xuống 578 biến. Công thức vẫn phủ
   mọi vị trí thực và các mặt tiếp xúc, kể cả các cạnh trùng nhau.
2. Chứng minh một trở ngại đại số chính xác: lớp chứng chỉ bậc hai đã xét
   không thể đạt mục tiêu. Ngay cả cho phép một số thành phần bậc bốn,
   nếu hệ số SOS của mỗi phép cắt chỉ nhìn năm tọa độ gốc và biến cắt
   riêng của nó, lớp đó vẫn không thể thành công. Vì vậy không chạy
   những lớp này để tìm nghiệm một cách vô ích.
3. Chỉ ra vì sao cần rời lớp phép cắt độc lập đã bị loại: ghép thêm biến
   hoặc tích ràng buộc là những khả năng chưa bị bác bỏ. Cụ thể, dùng
   thông tin dấu qua hệ số `b²` loại được phản chứng đối ngẫu hiện có.
   Từ đó chốt một mẫu chứng chỉ đủ điều kiện suy ra kết luận toàn cục
   **nếu tìm được đồng nhất thức**, với ma trận lớn nhất cấp 78.

Mẫu mới vẫn có tới 155.709 hệ số vô hướng ở mức trần tính tĩnh. Chưa có
bộ hệ số thỏa mãn, chưa biết nó có khả thi đại số hay không, và chưa
định lượng chi phí giải/phục hồi hữu tỉ. Hai môi trường Python đã kiểm
ở lượt trước không có bộ giải SDP. Không cài thêm, không chạy SDP,
không tăng bậc hoặc mở chiến dịch mới. Đây là kết quả sàng lọc phương
pháp có chứng cứ; không phải mốc khép K6 hay tuyên bố kết quả mới của
toán học đã được cộng đồng nghiệm thu.

## 2. Exact whole-domain model

Use `A6=0`, `Lj(t)=Aj-j*t`, `Rj(t)=Aj-(j-1)*t`, `0<=t<=1`.
For a boundary ray let `C0` be the measure of heights covered by the
other five intervals and `C1` its first height moment. Then

    G = 3 - sum_j[Aj*C0(Rj)-(j-1)*C1(Rj)]
          + sum_j[Aj*C0(Lj)-j*C1(Lj)].

Each covered-height set is a union of five intervals, whose endpoints
use forty shared clipped crossing forms and five shared binary sign
flags. A clip `tau=clip(c,0,1)` has the exact polynomial graph

    tau>=0, 1-tau>=0,
    (c-tau)*tau>=0, (tau-c)*(1-tau)>=0.

For adjacent difference `Delta=Aj+1-Aj`, the two parallel coverage
occurrences use the SAME interval `[clip(Delta),b]`, with

    b*(1-b)=0, b>=0, 1-b>=0,
    b*Delta>=0, -(1-b)*Delta>=0.

At `Delta=0`, either shared flag is permitted: the coincident left/right
boundary rays have identical coverage sets and cancel. Independent flags
would not be sound. Nonparallel contacts affect only finitely many heights.

Nine paired comparators sort five lower endpoints while preserving their
upper partners, including the upper-root equation at ties. Eight explicit
maximum wires then give the exact union measure and first moment for each
ray. Full interval formulas, tie proofs and constraint inventory are in
`BUILDER_SPARSE_SOS_20261012.md`, sections 1–5. Main and critic reviewed them.

| Exact circuit inventory | Count |
|---|---:|
| Real variables, including five apices | 578 |
| Linear equations | 216 |
| Quadratic equations | 533 |
| Linear inequalities | 498 |
| Quadratic inequalities | 90 |
| Maximum objective/constraint degree | 2 |

This is a graph of the actual global area, not an independent lower
approximation of each triangle, compact-range assumption or chamber cover.

## 3. Exact obstruction and the required coupling

Let `Z=1` with probability `3/4`, `Z=-3` with probability `1/4`,
`Aj=(j-6)Z`, and set every clip variable to zero. Assign parallel flags
their actual signs and every remaining gate its actual min/max value.
All equations vanish pointwise. All nonclip generators are nonnegative
pointwise. Each clip's quadratic generators are `0` and `-c`, where
`c=alpha*Z`, `alpha>0`, so their expectations vanish. The boundary
objective is formally `G=3-5Zb`, giving

    E[G]=-3/4, E[G-40/31]=-253/124 < 0.

The functional is nonnegative on all degree-two SOS, listed quadratic
generators with nonnegative constant coefficients, and products of linear
generators. Thus the specified total-degree-two preordering cannot prove
the target. The assignment deliberately violates actual clipping: it is
NOT a K6 counterexample. Arbitrary extra quadratic generators are not
covered by this obstruction.

There is also a stronger restricted-class obstruction. Suppose the SOS
multiplier of each negative-tail clip generator has affine rows depending
only on `(A1,...,A5,tau)`; exclude products of a clip quadratic with another
generator. On the true graph, `G<=3`, so each nonnegative certificate term
is bounded above by `53/31`. Along every open negative-c ray, `tau=0`
and the negative-tail generator grows without bound. Boundedness forces
each affine row to have zero A-coefficients and zero constant, hence its
SOS is a nonnegative constant times `tau²`. At the diagnostic atoms those
terms vanish. Positive-tail clip generators are already zero. All other
SOS/nonclip terms have nonnegative expectation and every equality term
vanishes, contradicting the negative target expectation. Extra free SOS
or equality terms elsewhere do not rescue this specified class.

For an adjacent raw crossing `c=alpha*Delta`, the shared flag permits the
small multiplier `b²`, giving

    E[(tau-c)*(1-tau)*b²] = -3*alpha/4.

It escapes that obstruction. This is a reason to retain cross-wire sign
information, NOT evidence that a complete certificate exists. On the true
graph this particular term vanishes; its role is to exclude inconsistent
lift assignments. See Builder sections 6–8 and critic sections 8–10.

## 4. Concrete candidate, not an SDP result

Seek ONE global coefficient identity for `P=G-40/31`, consisting of
SOS, inequality times SOS, the specified inequality pair products, and
equation times unrestricted multipliers. Every block uses the SAME
original variables and shared wire symbols. No independently optimized
block answers may be assembled as a proof.

| Block family | Number | Parent variable ceiling | Free SOS Gram order | Other multipliers |
|---|---:|---:|---:|---|
| Clip, with all five A and five flags | 40 | 11 | 78 | Four SOS Grams of order 12 each |
| Paired interval sort, with all A | 108 | 13 | 14 | Affine for linear equations; constants otherwise |
| Prefix maximum, with all A | 96 | 8 | 9 | Constants, plus one inequality pair product |
| Parallel sign, with all A | 5 | 6 | 7 | Constants |

Only clip-parent terms reach total degree four. This localized choice is
motivated by the proved degree-two obstruction and sign interaction, not
an automatic dense degree escalation. The same certificate would prove
the whole bound if an exact identity with PSD/nonnegative coefficients
were produced. Completeness, running intersection and convergence are
NOT asserted. Unbounded apices and a sharp zero prohibit importing a
generic compact/strict-positivity theorem without its hypotheses.

Exact static ceilings, independently hand-counted by Main and Builder:

- 409 PSD matrices; maximum order 78.
- 155,709 scalar unknowns, including 632 nonnegative scalar coefficients
  and 3,557 unrestricted equality-multiplier coefficients.
- At most 70,400 coefficient rows before deduplication.
- At most 192,375 sparse operator incidences before aggregation; target
  right-hand-side occurrences separately at most 241.
- Raw dense storage for all PSD matrices: 2,364,712 bytes, about 2.26 MiB.
- Raw 64-bit row/column/value triplets: at most 4,617,000 bytes.
- A dense coefficient matrix would take 87,695,308,800 bytes: do not form it.

These are deliberately specified-template ceilings, not solver memory,
runtime, nonzero rank, independent row counts or a solved feasibility test.
Factorization, exact coefficient recovery and PSD certification remain
unqualified. No large matrix was allocated and no SDP was executed.

The sharp placement `(-106,-81,-70,-36,-25,0)/31` imposes mandatory zero
conditions on nonnegative certificate summands. They are consistency
checks only; adding them does not constitute a new K6 lower bound.

## 5. Evidence, limits and next decision

The one authorized tiny standard-library process was executed by Builder,
exit zero, clock observed 16:45:03 UTC. It checks the five-wire sorting
network on all 32 binary words and rational diagnostic arithmetic. Main
read the entire script; critic also hand-reviewed the sorting network.
This is not a full graph replay, sampled K6 verification or solver run.
No second mathematical process was run. Peak memory was not instrumented;
the tiny workload was selected under the intended 64 MiB ceiling.

Primary methodological references checked for scope, not used as a
shortcut to certificate existence:

- Waki et al., structured sparsity: https://epubs.siam.org/doi/10.1137/050623802
- Lasserre, sparse convergence assumptions: https://epubs.siam.org/doi/abs/10.1137/05064504X

No package installation, build, browser/UI/API/DB change, Git commit/push,
scratch project, deletion or new infrastructure. Nothing needed cleanup.
Minimal Vibecode Builder/critic review influenced scope and reporting;
it is not independent external mathematical acceptance or Lean checking.

**Decision:** reject the proved-impossible degree-two and independent-clip
grammars. Retain the coupled boundary template only as an unproved candidate.
Representation size is now bounded, but actual SDP execution and certificate
existence are not qualified. Do not blindly increase degree or repeat earlier
searches. The next substantive obligation is to obtain exact shared
coefficient consistency/PSD evidence for this coupled template or to reject
it; constructing more gates or another subdomain proof would not satisfy it.
No automatic successor or execution grant follows from this note.

**English bottom line:** We reduced the exact global area circuit and proved
why two tempting certificate classes cannot work. A smaller coupled SOS
template survives those particular obstructions, but it has not been solved.
No global K6 certificate, new lower bound, novelty claim or whole closure.

### Final literal review

Builder read the entire Main completion at observed16:54:07UTC and accepted
the proof scopes/counts with no blocking correction. Critic read it at
observed16:54:05UTC and accepted the mathematical content, requesting one
scope clarification: sign flags are a concrete escape, not the uniquely
necessary extension of the excluded class. That Vietnamese wording is
corrected above. Earlier critic review accepted Builder's full model and
mixed-template counts. These are independent AI hand reviews within this
team, not an external expert or proof-assistant certificate.
