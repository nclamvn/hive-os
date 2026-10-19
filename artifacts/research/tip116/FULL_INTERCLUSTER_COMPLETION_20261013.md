# K6 — contextual intersection minorant, no global certificate

**PARTIAL; K6 OPEN. No new area floor.** This attempt did not find a
nonnegative identity for the whole target on the existing graph at degree<=4.
It produced and checked a different sharp-calibrated global geometric
minorant, but neither its required quantitative floor nor its legal graph
certificate was established. Feasibility decision: **NO SOLVER RUN**.

Scope FULL_INTERCLUSTER_SCOPE_20261013.md; same TIP116 R116-1/2/3 and
PUBLIC_DISCOVERY, all-real G>=40/31 (F6>=20/93). Activation2026-10-13
11:36:44UTC/cap12:06:44UTC. Main new derivation STOP11:46:58UTC, early
hand exhaustion, not a counterexample to the new minorant's proposed floor.
Builder independent STOP11:41:33; critic11:39:59. Subsequent supplied-formula
review is distinct from restarting independent search. Predecessors frozen.

## 1. What must remain intact

The obligation is still

    P=G-40/31=53/31-Q=53/31-sum15J+R >=0

on the existing490-wire clip/paired-sort/union graph (and the available
area-preserving compactification D), including all orders, ties and clips.
Restoring every intersection in a union identity does not prove this sign.
No hull replacement or discarded negative-ray coverage is used below.
No new graph variables, generators, branch gates or infrastructure are added.

## 2. A contextual candidate retaining the exact error

At a plane point let X_i be the membership indicator of triangle i. These
are analytical indicators, NOT extra variables of the certificate graph.
Use central labels M={3,4}, outer labels O={1,2,5,6}, and define

    Y=X3+X4-X3*X4, k=sum_(i in O) X_i,
    p=Y+(1-X3)*(1-X4)*(k-sum_(i<j in O) X_i*X_j).

Thus the true union is counted exactly where a central triangle covers
the point. Outside that union, p uses the outer singleton-minus-pair
expression. Retain its error EXPLICITLY:

    q=OR(X1,...,X6)-p
     =(1-X3)*(1-X4)
       *(sum_(i<j<k in O) X_i*X_j*X_k-prod_(i in O) X_i).

If Y=1 the error is zero. Otherwise its values at outer multiplicity
0,1,2,3,4 are respectively 0,0,0,1,3. Therefore q>=0 on every Boolean
membership configuration, with no source-order or general-position assumption.
In particular this is a GLOBAL geometric comparison, not a regional claim.

For J_S the actual area of the intersection of triangles in S, integration
gives the exact decomposition

    G=B+E, E=integral q>=0,
    B=3-sum_(|S|=2) J_S
         +sum_(|S|=3, S intersects M) J_S
         -sum_(|S|=4, M subset S) J_S.

There are all15 pairs,16 triples and6 quadruples in this expression.
The omitted four outer triples are accounted for by E, not silently lost.
The full proof target would now require

    P=(B-40/31)+E >=0.

One sufficient route is B>=40/31 together with a legal representation of
the error/payment in the allowed graph degree. **That floor is unproved.**
The terms J_S and E are not admitted as new nonnegative graph generators.

This differs from the rejected fixed-triple or group-hull bound: the
central mask and negative quadruple terms adjust when central sources cover
the point. The previous rejection does not automatically reject this B.

## 3. Sharp contact checked without assuming global minimality

Use the translated retained construction A*=(0,25,36,70,81,106)/31.
Write L_i=A_i-i*t and R_i=A_i-(i-1)*t. For t>=17/31, the two central
intervals intersect and have union [L3,R4] throughout the physical t<=1.

There are four outer triples:125,126,156,256. For125, nonempty triple
intersection requires t>=81/155 (the birth of pair15). Until17/31 it
lies in triangle3: L3<=L2 for t>=11/31, and R3>=R1=0 until18/31.
For t>=17/31, L3<=L2 and R4>=R5 for t>=11/31 put the same triple inside
the central union.

For126, nonempty intersection requires t>=53/93>17/31 (pair16 birth).
Again L3<=L2. For its upper end, R4>=R1 while t<=70/93 and R4>=R6
while t>=18/31. Those ranges overlap and cover its possible lifetime.
Thus it too is contained in the central union. Reflection
`x -> 106/31-6*t-x`, labels `i -> 7-i`, supplies256 and156.

Consequently any point of outer multiplicity>=3 is centrally covered,
up to irrelevant boundaries; E(A*)=0 and B(A*)=G(A*)=40/31.
This proves contact, NOT that B cannot be smaller elsewhere.

The candidate also avoids the previous uniform-family failure. If
`A_j=(j-6)c`, interval endpoints at a fixed height vary affinely with j.
An intersection of two extreme labels is contained in every intermediate
label's interval. Every outer triple spans both central labels, so E=0
on this whole family. In particular B=G=4/3 at c=2/3, rather than the
rejected proxy49/81. This is a consistency check, not all-real closure.

## 4. Exact degree guard and unresolved feasibility

Although p is of Boolean indicator degree4, this is not the degree of a
polynomial certificate in the original490 variables. The intersection
areas above depend on clipped, ranked geometry; a degree-preserving
expansion in the existing graph equations/generators has not been supplied.

There is also a specific guard against a direct indicator-only shortcut.
The exact q displayed above has sixfold coefficient

    coefficient_(X1*X2*X3*X4*X5*X6)(q)=-1.

Every function on the Boolean cube has a unique multilinear representative
(successive evaluation at0 and1 gives uniqueness). Multilinear reduction
of a polynomial of ordinary total degree<=4 cannot introduce a monomial
of degree6. Hence this exact error has NO degree<=4 indicator-only
polynomial representation. Directly calling the whole pointwise identity
degree4 because p has that degree is invalid.

This restricted fact is NOT an impossibility theorem for the original
coverage-wire graph: its variables differ, integration changes the
representation, and its exact area objective is already quadratic.
No transfer of the Boolean obstruction to the full graph is claimed.

Two separate gaps therefore remain: the all-real quantitative bound on B
(or another joint nonnegative payment of B-40/31+E), and an explicit
allowed degree<=4 coefficient identity using only the existing graph.
No qualified sparse coefficient system, solve/recovery cost or full-degree
feasibility proof was obtained. No solver, new degree or infrastructure run.
The preserved exact decomposition alone is not a root milestone.

## 5. Kết quả — tiếng Việt

**Chưa khép K6 và chưa có cận dưới mới.** Ứng viên mới dùng hợp của hai
tam giác giữa làm mặt nạ. Phía ngoài mặt nạ, chặn singleton-trừ-giao-đôi
được ghép với một sai số chính xác không âm; giao nhiều nguồn không bị
giấu hoặc cộng trùng như ở ứng viên bị loại trước đó.

Phép so sánh đúng trên toàn miền và có dấu bằng tại cấu hình40/31. Nó
cũng trả lại đúng4/3 trên ví dụ cách đều đã làm hỏng chặn trước. Tuy nhiên
chưa chứng minh được rằng B luôn>=40/31. Hơn nữa, bậc4 của đa thức chỉ
báo không bảo đảm bậc4 của chứng chỉ trên hệ490 biến: sai số chỉ báo chính
xác còn hạng bậc6, và phép chuyển sang các phương trình hiện có chưa có.

Vì vậy **chưa đủ điều kiện chạy solver**. Không tuyên bố ứng viên B sai,
không bác bỏ toàn bộ SOS bậc4, không coi công thức đúng hay kiểm tra tại
cấu hình đặc biệt là hoàn tất. Lượt này chưa đạt phần đầu ra cốt lõi:
một chứng chỉ không âm cho toàn bộ G-40/31.

## 6. Verification and scope

Main read the full current Builder and critic notes. Both literally checked
the supplied central-mask expansion and sharp-contact geometry; critic
recorded that check11:43:29UTC and the Boolean degree guard11:46:11UTC.
They had stopped independent derivation before those supplied checks.
Critic FULL saved Main-text read/check of sections1-6 at11:50:02UTC:
ACCEPT, no blocking correction. This accepts the exact comparison/contact
and scoped degree guard, NOT the missing B floor, joint P payment or
original-graph D4 certificate. Independent STOP remains unchanged.

Minimal Vibecode/TIP116 reused the existing Builder and critic, adding no
product process. R116-1 OPEN; R116-2 hand challenge and R116-3 EN/VI record
do not imply a percentage of mathematical closure. No new theorem about
the global optimum, novelty, general Kakeya, formal-kernel or external
human acceptance is claimed. No automatic successor or resource escalation.

Reads/hand mathematics/Markdown only. Mathematical subprocesses/solver/
sampling/enumeration/product code/build/UI/API/DB/Git writes/install/new
agents/variables/gates/infra/scratch/deletions:0.
