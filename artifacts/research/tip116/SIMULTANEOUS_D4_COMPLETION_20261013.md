# K6 — simultaneous network cancellation, degree-four feasibility result

**PARTIAL; K6 OPEN.** No certificate of the all-real bound `G>=40/31`
(`F6>=20/93`) was obtained. The degree-four class is not disproved either.
Decision: **NO SOLVER RUN** on the present incomplete assembly.

Scope: `SIMULTANEOUS_D4_SCOPE_20261013.md`; direct owner approval to seek
whole-network cancellation, degree<=4, feasibility first, no infrastructure.
Same TIP116 R116-1/2/3, PUBLIC_DISCOVERY. Activation2026-10-13 11:11:51UTC,
ceiling11:41:51UTC. Main new derivation STOP observed11:22:53UTC, early hand
assembly exhaustion, not expiration of the cap or proof of impossibility.
Builder stopped11:18:18; critic stopped11:18:25. Subsequent literal checking
and recording do not restart mathematical search. Predecessors are preserved.

## 1. The unchanged global obligation

Retain the existing490-wire clipping/paired-sorting/union graph, its original
generators and the previously justified compact domain D. No new output-box
inequality, branch selector, positivity assumption or graph variable is added.

For the six triangle slices `[Aj-j*t,Aj-(j-1)*t]`, `0<=t<=1`, `A6=0`,
the retained objective is `G=3-Q`. Its nonzero ray coefficients are

    R1:3, R2:2, R3:1, L4:1, L5:2, L6:3,
    L1:-2, L2:-1, R5:-1, R6:-2.

The predecessor established the exact full-source representation

    P=53/31-Q=53/31-sum_(i<j) J_ij+R,
    R=integral_(m>=1) C(m-1,2),

where J are actual pair-intersection areas and m is the multiplicity of
all six triangles. R is also the signed sum of existing prefix-overlap
expressions. Qualitative R>=0 alone does not prove P>=0. The attempted
certificate must retain that quantitative full-source obligation.

## 2. What simultaneous cancellation actually establishes

At one existing paired comparator, lower inputs a,b have outputs u,v;
their associated upper inputs alpha,beta have outputs p,q. Abbreviate the
ORIGINAL equations

    eL=u+v-a-b, eU=p+q-alpha-beta,
    hL=(u-a)*(u-b), hP=(p-alpha)*(p-beta),
    hA=(a-u)*(p-beta), hB=(b-u)*(p-alpha).

Introduce a formal coefficient parameter zeta, NOT a graph variable, and put

    z=a+zeta*alpha, w=b+zeta*beta,
    U=u+zeta*p, V=v+zeta*q,
    E=U+V-z-w=eL+zeta*eU,
    H=(U-z)*(U-w)=hL-zeta*(hA+hB)+zeta^2*hP,
    s=z+w, v0=s-U.

The following are exact polynomial identities, including off-graph inputs:

    C_d=U^d+V^d-z^d-w^d,
    C1=E,
    C2=2H+E*(V+v0),
    C3=3sH+E*(V^2+V*v0+v0^2),
    C4=[4*(s^2-z*w)+2H]*H
         +E*(V^3+V^2*v0+V*v0^2+v0^3).

Proof: `V=v0+E` and `U*v0=z*w-H`; use the two-variable power sums and
factor `V^d-v0^d`. Expanded equation multiples have total degree<=d.
In C4, H squared is still a sum of original equation multiples; its
appearance is not being used as a positivity proof.

Extracting coefficients of zeta, with only nonzero constant binomial
divisors, transports every mixed moment `sum l^r*h^s`, r+s<=4. Summing the
local identities through ALL nine comparators cancels intermediate slot
moments additively. No product of successive branch gaps is needed.
Retaining hP makes the argument valid at lower ties; no division by a
discriminant or generic-position assumption occurs.

This answers the prior branch-degree obstruction for this named family
of moment identities. It does NOT yet answer it for the target P.

The result also transports any polynomial Psi in the ray moment sums of
weighted degree<=4, where `sum l^r*h^s` has weight r+s. Factor a monomial
difference one stage at a time; other rays are retained as context.
For example `(M11(R2)-M11(L1))^2` is degree4 and couples rays of signs +2,-2.
These potentials are not restricted to fixed pair-separable sums.

A COMMON contextual polynomial K may multiply a telescope when its degree
plus the moment degree is<=4. Stage-dependent coefficients leave a remainder:

    sum_(s=0..n-1) K_s*(F_(s+1)-F_s)
      =K_(n-1)*F_n-K_0*F_0
       -sum_(s=1..n-1)(K_s-K_(s-1))*F_s.

That remainder has no automatic sign. No proposed certificate is allowed
to drop it. Squaring a degree2 moment and multiplying a quadratic clip
generator costs6; the moment abbreviation cannot hide that cost.

## 3. Why the quantitative target is still unpaid

For sorted intervals [l_k,h_k], retain the existing maxima
`H1=h1`, `S1=l1`, `Hk=max(H_(k-1),h_k)`, `Sk=max(H_(k-1),l_k)`.
With `f(t)=t-t^2/2`, their whole-union moment is exactly

    D_ray=f(H5)-f(l1)
          -sum_(k=2..5)[f(S_k)-f(H_(k-1))].

The terminal maximum, first minimum and whole-prefix gaps remain.
Conservation of additive source moments does not cancel their signed
contribution to Q. Dropping all gaps is not a sharp comparison: at the
retained sharp configuration `A*=(-106,-81,-70,-36,-25,0)/31`, R2 covers

    [11/62,11/31] union [14/31,45/62] union [25/31,1].

It has two genuine gaps and coefficient +2; its reflected L5 also has +2.
Negative ray coefficients must also be controlled. This is a check of the
proposed assembly, not a finite substitute for the all-real obligation.

No common contextual potential and original nonnegative terms were found
whose remaining terms give an exact degree<=4 certificate of the whole P.
Equation transport gives expressions equal to zero, not the missing
nonnegative lower bound. Neither an exact coefficient identity, a justified
sparse coefficient system with a feasible solve/recovery cost, nor a
proof rejecting the full degree-four class was obtained.

Accordingly no SDP, larger degree, branch enumeration or new infrastructure
is authorized by these identities. R116-1 remains OPEN. No new area floor
or claim that the remaining problem is smaller by a measured percentage.

## 4. Kết quả và quyết định — tiếng Việt

**Chưa khép K6, chưa có cận dưới mới.** Lượt này tìm được phép triệt tiêu
đồng thời cho các mômen liên kết đầu dưới–đầu trên trên toàn mạng sắp xếp.
Các phương trình được cộng trực tiếp trong bậc4; không phải nhân trọng số
qua từng nhánh và không bỏ qua các trường hợp đầu mút trùng nhau.

Tuy nhiên, đây là đồng nhất thức đại số, không phải chứng chỉ không âm cho
diện tích. Phần cực trị, khe hở của toàn bộ tiền tố và các cạnh khác dấu
vẫn chưa được khống chế đồng thời. Bất đẳng thức cần chứng minh vẫn là
`53/31-sum15J+R>=0`; chỉ biết R không âm hoặc bảo toàn mômen là chưa đủ.

Vì chưa có phép ghép đầy đủ, quyết định khả thi là **không chạy bộ giải**.
Không tuyên bố toàn bộ lớp SOS bậc4 bất khả thi, không coi công thức mạng
là một milestone đóng bài toán và không tự chuyển sang lượt nghiên cứu mới.

## 5. Verification and resource record

Main read the full saved Builder and critic notes. Both independently
checked the displayed C2--C4 identities and retained tie equations. The
Builder's illustrative R2/L5 phrase was corrected to R2/L1: reflected R2
and L5 have the same sign, not opposite signs. The algebra did not change.
Final saved Main review is recorded only after an actual full read.

Minimal Vibecode used the existing Main/Builder/critic, as TIP116 requires;
it supplied scoped review, not mathematical authority or more product gates.
R116-2 scoped hand challenge performed; no global proof exists to accept.
R116-3 records the attempt and its EN/VI limits. No formal-kernel, external
human review, novelty or general Kakeya claim is made.

Mathematical subprocesses/solver/samples/enumeration/product code/build/UI/
API/DB/Git writes/install/new agents/variables/gates/infra/scratch/deletions:0.
Only source reads, hand algebra and Markdown records. No automatic successor.

Final saved-text review: critic FULL Main §§1--5 read/check observed
11:24:05UTC, ACCEPT within the declared scopes, no blocking correction.
This accepts the exact identities and incomplete disposition, not K6 closure.
Main repository `git diff --check` passed at observed11:24:11UTC and again
at11:24:44UTC after both checkpoint appends. This is documentation hygiene,
not an executed mathematical checker or evidence for the inequality.
