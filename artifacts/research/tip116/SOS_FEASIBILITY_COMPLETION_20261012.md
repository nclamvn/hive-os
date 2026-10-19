# K6 global SOS — feasibility completion, 2026-10-12

Status: exact representation/size assessed and a minimal degree2 template
rigorously excluded; stronger certificate search NOT EXECUTED; K6 OPEN.
Same finite target G6 >= 40/31 (equivalently F6 >= 20/93), not general Kakeya.
Scope: `SOS_FEASIBILITY_SCOPE_20261012.md`; existing R9 history preserved.

## 1. Exact representation, not a geometric relaxation

Set A6=0 by translation and let Ij(t)=[Aj-jt,Aj-(j-1)t], 0<=t<=1.
For every i<j, d=j-i, retain the affine event forms

    (Aj-Ai)/d, (Aj-Ai)/(d+1), and (Aj-Ai)/(d-1) if d>1.

There are 40 distinct forms. Left/left and right/right crossings have the same
height; parallel edges introduce no isolated event; own edges meet at t=0.
Clip the forms to [0,1], sort, and append endpoints: T0=0,T1,...,T40,T41=1.
Between successive distinct heights all endpoint orders are fixed, so actual
union length is affine. Ties and zero-width slabs are retained harmlessly.

At a height T, sort the six left endpoints as s1<=...<=s6. Equal widths give

    ell(T) = T + sum_(i=1)^5 min(T,s_(i+1)-s_i),
    G6 = (1/2) sum_(k=0)^40 (T_(k+1)-T_k)*(ell_(k+1)+ell_k),
    ell_0 = 0.

This trapezoid identity is exact, not quadrature approximation. Every real
placement, including inverted/disconnected/contact configurations, is covered.

One min gate u=min(a,b) is exactly encoded by a-u>=0,b-u>=0,
(u-a)(u-b)=0, with max=a+b-u. One clip T=clip(c,0,1) is exactly encoded by

    T>=0, 1-T>=0, (c-T)T>=0, (T-c)(1-T)>=0.

For 0<T<1 the last two constraints force c=T; at T=0 they force c<=0;
at T=1 they force c>=1. All internal expressions have rational coefficients.
The lifted feasible set is the graph of the exact circuit, with unique auxiliary
values. No stationarity assumption, old (P), K5-core restriction or chamber tree
enters the equivalence.

## 2. Actual size of the specified circuit

The retained Builder script counts a fixed bitonic64 time-sort padded by24 ones,
with constant-wire pruning, and verifies a12-comparator sort6 by all64 zero-one
words. The sorting-network threshold principle makes the latter a universal
circuit check; it is not enumeration of K6 configurations.

| Item | Count |
|---|---:|
| Independent apex variables | 5 |
| Clipping variables | 40 |
| Time-sort min variables | 388 |
| Union evaluation min variables, 41*(12+5) | 697 |
| Total variables | 1,130 |
| Quadratic equalities | 1,085 |
| Linear inequalities | 2,250 |
| Quadratic inequalities | 80 |

Objective degree2. Counts concern this exact representation, not a minimum-size
theorem. At total SOS degree2 the dense free Gram has order1131,640146 independent
entries and10233288 raw double bytes. This matrix alone is not prohibitive.
At degree4 its order is640146, requiring3278295210528 raw double bytes (2.98TiB)
before multipliers or coefficient matching. That dense formulation is outside
the <=1GiB envelope and was not constructed. Sparse representations have NOT
been cost-qualified by this calculation.

The previous sixth-variable elimination's four core parameters/203 candidates
per fixed core do not make this a single four-variable polynomial problem.
Indeed G6=3 on an open set of separated placements and G6=40/31 at the retained
witness, so G6 cannot equal a single polynomial in the original five variables:
a polynomial equal to3 on an open set would be identically3.

## 3. Low-degree test: an exact obstruction, narrowly scoped

Tested template is the MINIMAL truncated degree2 quadratic module:

    f=G6-40/31 = sigma0 + sum_i lambda_i*g_i + sum_j q_j*h_j,

where sigma0 is a sum of squares of affine polynomials, lambda_i>=0 are constants,
and q_j are constants. The g and h are exactly section1's constraints. This is
NOT the full preordering containing products of different inequalities.

Consider a linear functional L given by averaging two assignments X=+2 and X=-2.
Assign A1=...=A5=-X,A6=0. Every raw crossing is qX,0<=q<=1. Set its clip output
to qX, select time-sort branches by descending coefficient q, and propagate all
gate identities by choosing one of their two inputs. Constant padding wires
retain literal value1 but carry an artificial +infinity ORDER TAG, above every
variable tag. Thus they follow exactly the pruned circuit's fixed routes, while
the variable coefficients are sorted in descending order: T1=X,T40=0.

At every variable-height union evaluation, choose endpoint-sort branches by label
order1,...,6 and choose the GAP input in each min(T,gap) gate. This gives
ell_k=X-4T_k. At the fixed height1, choose label order6,...,1 and again choose gap,
giving ell_41=6-X. Retain ell_0=0 as defined in the model.

Every gate equality is zero at both assignments. The two quadratic clip
inequalities are zero because c=T. All linear inequalities have nonnegative
L-value: variable-height operands have mean0; clip bounds have means0 and1;
at height1 endpoint means are correctly sorted and consecutive gaps have mean1.
Since L is an average of two real assignments, L(square)>=0 for every polynomial.

The trapezoid objective telescopes exactly:

    G_lifted = -3X^2/2 + X^2 + 3 = 3-X^2/2,
    L(G_lifted)=1, and L(f)=-9/31.

Applying L to any identity of the tested template would give L(f)>=0, a
contradiction. Thus THAT degree2 certificate template cannot prove the target.
The assignments are NOT feasible K6 geometries: clipping/order inequalities
need hold only in expectation here. This is not a counterexample to K6.

Important limitation: the valid product T*(1-T) has negative L for nonzero q.
Adding this redundant quadratic inequality, or allowing products in a degree2
preordering, excludes this obstruction. Therefore the test does NOT exclude all
degree2 SOS approaches, strengthened relaxations, sparse SOS or higher degree.

## 4. Tools, verification and bounded outcome

The system and bundled Python interpreters were inspected. Neither contains
cvxpy/scipy/sympy/scs/clarabel/mosek/cvxopt; the bundle has numpy2.3.5 only from
this list. No installation, paid API, browser/DB/product change or SDP execution.
This does not assert no solver could exist elsewhere on the Mac.

Exact graph review and the tiny rational obstruction replay are recorded below.
No numerical near-solution, epsilon bound or PSD tolerance is
accepted as mathematical proof. Numerical-to-rational SOS recovery itself needs
conditions; strict feasibility in the relevant recovery theorem is not automatic
at a sharp zero. Primary references: [Parrilo, semialgebraic SDP hierarchy](https://www.mit.edu/~parrilo/pubs/files/SDPrelax_abstract.html)
and [Peyrl–Parrilo, rational SOS recovery](https://old.control.ee.ethz.ch/publications/2008/3087.html).

### Verification record / completion criteria

- Main read the complete Builder/critic notes and the retained Python source.
- Main independently reran the script at observed13:58:16UTC: exit0,
  process wall0.05960175s. It checks1085 pointwise zero equations and2330
  nonnegative expected margins with Fraction arithmetic, obtaining -9/31 and
  the explicit strengthened-constraint violation -4. All64 sort6 words pass;
  count388 and the final1130-variable inventory agree.
- These checks substantiate the displayed finite dual construction; the general
  no-certificate implication is the linear-functional argument in section3.
  Repeating Builder's script alone is not independent mathematical validation;
  Main/critic separately reviewed the argument. No external or formal review.
- S1 exact full-domain graph: accepted by scoped hand review. S2 actual specified
  size: accepted. S3 low-degree feasibility: minimal degree2 template excluded
  analytically; numerical/strengthened degree2 search NOT RUN, dense degree4
  refused before allocation. S4 scope/exactness review: accepted; there is no
  positive K6 certificate to verify.
- SDP searches0; tiny counting/environment/replay processes5 (Builder4, Main1),
  all exit0. No K6 parameter sampling, random search or arrangement enumeration.
- `git diff --check` passed; this is file hygiene, not mathematical evidence.
  No app build/type/test run was relevant; product code was not changed.
- Main new derivation STOP13:59:02UTC, before14:18:12 hardstop. Remaining work
  is literal review/checkpoint recording only. No automatic stronger trial.
- Critic read the full Main completion, Builder addendum and replay source;
  accepted the mathematical scope with the padding-tag clarification now included.
  Critic derivation stop13:59:02UTC; Builder stop13:59:11UTC.

Files: this completion, the scope, Builder/critic notes, one146-line standard-
library calculation script, and append-only active/handoff checkpoints. No new
dependency, infrastructure, scratch tree or distDir. Nothing deleted.

## Tiếng Việt — kết luận đúng phạm vi

Đã chốt một biểu diễn đại số CHÍNH XÁC trên toàn không gian K6, gồm cả biên và
tiếp xúc. Nhưng năm tham số gốc trở thành1130 biến trong biểu diễn này. SOS bậc4
dạng đặc cần gần3TiB chỉ cho một ma trận; không được chạy. Phép thử đại số bậc2
loại được mẫu chứng chỉ đơn giản nhất bằng giá trị đối ngẫu chính xác -9/31,
không phải bằng kết luận của bộ giải số. Mẫu mạnh hơn có tích bất đẳng thức chưa
được thử và không bị kết quả này loại bỏ.

K6 VẪN MỞ: không có cận dưới mới, không có chứng chỉ toàn cục, không tuyên bố
đột phá hay tính mới. Giá trị của lượt này là xác định cụ thể một cách biểu diễn
và lý do không nên chạy SDP đặc/bậc2 tối giản một cách mù quáng. Không tự nâng
bậc, cài bộ giải, tạo hạ tầng hay mở chiến dịch khác sau lượt đánh giá này.
