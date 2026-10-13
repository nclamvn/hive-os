# Independent existing-product degree-four feasibility proof

Status: FINAL PARTIAL; K6 OPEN. Same all-real G6>=40/31 (F6>=20/93),
TIP116 PUBLIC_DISCOVERY. Owner activation2026-10-13 00:58:12UTC;
unchanged hardstop01:28:12UTC. Hand mathematical subprocess grant0.
Scope/protocol, current active/handoff checkpoint, FULL Vibecode skill and
TIP/report reference read; frozen boundary graph sections1–5 reread for
the complete generator inventory. Only this new critic note is edited.

The skill governs scope/reporting, not mathematical authority. All source,
ties and unbounded placements remain in the graph. No existing bytes,
variables, constraints, gates or code are changed.

## 1. Precise certificate class and full generator inventory

The exact578-variable boundary graph has five unbounded apex coordinates
A1,...,A5 (A6=0) and573 wires in[0,1] on both genuine and assigned-band
graphs. Its inequality generators are exactly:

* 498 LINEAR:80 clip bounds,216 paired-min margins,192 max margins,
  10 flag bounds. All lie in[0,1] whenever assigned clips/flags and
  sorting/max wires are valid bounded band values.
* 90 QUADRATIC:40 positive and40 negative clip margins, plus10 sign
  margins b_k*Delta_k and -(1-b_k)*Delta_k, k=1,...,5.

Here Delta_k=A_(k+1)-A_k. The other533 quadratic constraints are
EQUATIONS, not missing inequality types; there are also216 linear equations.

Consider every finite identity

    G_graph-L = sum_n sigma_n*product_(a in n) g_a
                  + sum_h lambda_h*h,

with SOS coefficients, unrestricted existing-variable supports, and EACH
ENTIRE nonzero summand of degree<=4. Repeated factors are permitted;
this includes the ordinary squarefree truncated preordering. Equation
multipliers may even have arbitrary degree without changing the obstruction.
No derived/new inequality generators or variables are admitted.

The theorem below applies to every finite real L<=3, hence in particular
L=40/31 AND L=0. If L>3, six spatially separated triangles already make
the proposed certificate impossible on genuine graph values G=3.

## 2. Bare negative-clip terms remain bounded

Write q_d=(tau_d-c_d)*(1-tau_d), c_d=(A3-A1)/d, d=1,2,3.
These are pair13's negative margins. On the genuine graph, the assumed
identity makes every preordering term nonnegative, and each is<=3-L.

A bare q_d has an SOS coefficient of degree<=2, so it factors into squared
affine rows ell=u dot A+v dot B+k, where B comprises bounded graph wires.
On any direction a with a3-a1<0, set A=s*a and let s tend to infinity.
Then genuine tau_d=0, q_d=-s*(a3-a1)/d>0 and B stays bounded. If u dot a
were nonzero, q_d*ell^2 would grow cubically. Thus u vanishes on an open
halfspace and is identically0. Every such row, with arbitrary source-aware
wire support, is uniformly bounded whenever B lies in[0,1].

This reproduces the bounded-row argument under the NEW preordering
assumption; it does not assume that a module-only rejection automatically
extends to products.

## 3. Exhaustive factor patterns containing a bad q_d

Since q_d has degree2, every degree<=4 term containing it has exactly
one of these patterns:

1. q_d alone: the bounded SOS rows from section2.
2. q_d times one or two linear generators: the SOS coefficient must be
   a nonnegative CONSTANT. For degree3, SOS degree<=1 is constant (an
   affine nonconstant square would have degree2); degree4 also leaves
   only constants. Linear factors are bounded on the false family below.
3. q_d times one quadratic generator: again the coefficient is a
   nonnegative constant. This includes repetitions and different q_d.

No product with a third quadratic factor or further linear factor fits
degree4. Terms without any bad q_d are nonnegative on the false family.
The remaining issue is therefore the COMPLETE quadratic partner list.

### 3.1 Distinct-pair clip partners have a joint growing cone

For a distinct source pair i,j, its raw crossing is a positive multiple
of ell_ij=A_j-A_i. In the five-real-coordinate gauge, ell_ij and
ell_13=A3-A1 are linearly independent unless the unordered pair is13.
Consequently either required strict sign ell_ij>0 or ell_ij<0 can coexist
with ell_13<0 on a nonempty open cone. This follows from surjectivity of
the two independent linear functionals onto R^2, not from independent
choices of clipping branches on an inconsistent geometry.

Scale a direction in that cone. Then q_d grows as a positive multiple of
s. A partner negative-tail margin also grows linearly on ell_ij<0;
a positive-tail margin grows linearly on ell_ij>0 (its genuine tau=1,
so the margin is c-1). Their product grows as a positive multiple of s^2.
Bounded genuine P<=3-L therefore forces its nonnegative constant
coefficient to be EXACTLY0.

### 3.2 All ten sign-margin partners also have a joint growing cone

Each adjacent Delta_k is linearly independent of ell_13, since pair13 is
nonadjacent. A positive sign margin grows on Delta_k>0 with b_k=1;
a negative sign margin grows on Delta_k<0 with b_k=0. Either sign can
coexist with ell_13<0. For k=1 or2, a positive chosen difference is
compensated by a more negative other difference; the identity
ell_13=Delta1+Delta2 introduces no inconsistency. The other three
adjacent differences are independent coordinates for this purpose.

The product again grows like s^2, forcing its constant coefficient0.
Flag ties are immaterial: the proof uses a strict nonempty cone and the
final false family uses legal actual flags.

### 3.3 Same-pair clip partners

Every SAME-pair negative margin grows on ell_13<0, so q_d*q_e has
coefficient0. This includes q_d squared. The SAME-pair positive margins
require ell_13>0 to grow and cannot be killed by that cone. They need not
be killed: all pair13 clips are0 on the false family, so every such
positive margin is0 there. Their products with a bad q_d vanish there.

This exhausts all80 clip and10 sign quadratic partners. No potentially
unbounded negative quadratic-product contribution survives the test family.

## 4. False family and contradiction

For every T<-300, assign

    A=(T,-100,T+1,-200,T+3/2,0).

Keep all clips and flags genuine except pair13's three clips, assigned0.
Evaluate all paired-sort, routing and max gates as actual operations on
these bounded bands, taking any legal tied-upper routing. All equations
are0, all non-apex wires remain in[0,1], and every inequality except
q_d=-1/d is nonnegative. Pair13 positive margins are0.

By sections2–3, bare bad q_d terms are uniformly bounded below; terms
with one/two linear factors are also bounded below; quadratic partners
either have coefficient0 or contain the zero same-pair positive margin.
Every other term is nonnegative. Since the identity has finitely many
fixed real coefficients, its entire RHS has a finite lower bound -C
independent of T. Arbitrary equation multiples vanish pointwise.

The exact source-aware boundary omission is the frozen calculation in
NONLOCAL_D4_COMPLETION_20261013.md section3, rechecked in the source-aware
completion: triangle5 still covers both hidden ends on[1/3,3/8]; on
[3/8,1/2] only L3 remains covered, giving change R1=T; on[1/2,1]
neither L1 nor R3 is covered, giving change1-t. Sources2,4,6 stay disjoint
from the cluster throughout the family. Contacts have zero height measure.
Therefore

    G_false-G_true=(T+1)/8,
    G_false-L<=3-L+(T+1)/8 -> minus infinity.

This contradicts RHS>=-C. Hence the FULL degree<=4 truncated preordering
of the existing inequalities has no real-coefficient target identity,
even with unrestricted578-variable SOS supports and arbitrary existing
equation multipliers. Repeated products do not escape.

## 5. The proposed escape and why it fails here

The legitimate degree4 product q_1*(b1*Delta1) evaluates to T+100 on
the false family, and would have the right unbounded negative growth.
But on a genuine ray Delta1=s,Delta2=-2s, q_1=s and b1*Delta1=s;
the product is s^2. Its nonnegative constant coefficient must therefore
be0 in any bounded-area certificate. The potential escape is considered
explicitly, not omitted because it was outside the previous module.

The result even rejects a certificate of G>=0 in this fixed truncation.
It identifies a representation/truncation limitation, not a difficulty
specific to the sharp constant40/31 and not an actual negative-area
placement. The exact graph is valid; deliberately wrong clips are used
only to test a hypothetical polynomial identity.

No conclusion about higher-degree certificates, different representations,
derived inequalities or general SOS is proved. No blind next degree or
new architecture is tried or automatically authorized. K6 remains OPEN,
zero new global lower bound or actual-minimum class closure. Do not run
an SDP for this rejected degree4 existing-generator preordering.

## 6. Completion and observed times

Own new-derivation STOP was observed00:59:43UTC, following the complete
generator read and joint-cone/factor audit, before01:28:12. Subsequent
work is recording and literal review only. Not cap exhaustion.

Mathematical processes, SDP/numeric trials, code, installs, new agents,
variables, gates, constraints, UI/API/DB/Git/build/infra/scratch/deletions:0.
Created only this new critic note. Frozen predecessor bytes remain untouched.
One ordinary malformed Markdown patch hunk was retried successfully; it
was not a mathematical process or solver start. Final reviews follow below.

Kết luận: lớp tiền thứ tự SOS cắt bậc4 dùng TOÀN BỘ bất đẳng thức hiện
có đã bị loại chính xác, kể cả các tích lặp. Không chạy SDP cho lớp này.
Đây không phải phản ví dụ K6 và không loại mọi chứng chỉ SOS. K6 vẫn MỞ;
chưa có cận dưới mới hoặc lượt nghiên cứu tiếp theo được tự động mở.

## 7. Final literal review

FULL Main PRODUCT_D4_COMPLETION_20261013.md was read by observed
01:01:44UTC. The complete generator list, factor-degree audit, genuine
joint cones, repeated-factor cases, same-pair-positive exception, false
family and extension to every finite L are ACCEPTED as scoped. Requested
wording correction: the theorem excludes rational coefficients INSIDE
this class too; 'does not refute rational certificates' should explicitly
refer to OTHER grammars/all rational certificates generally.

Main reported its FULL read and acceptance of this critic note after01:01
and its own new-math STOP01:00:06UTC. A completed Builder note or full
literal read of Main's final file is not claimed here unless actually
provided. These are independent AI hand checks, not formal/external review.
Own STOP remains00:59:43; subsequent work is recording/literal review only.

At observed01:02:45UTC, Main's repaired section5 was reread: rational
COEFFICIENTS inside the class are explicitly excluded, while certificates
with nonconstant denominators and other grammars remain outside this
polynomial theorem. The correction is resolved. The separate reported
Builder agreement is not inflated into a saved-file/full-review claim.
Final acceptance; no further work, no automatic successor and no cap
exhaustion. K6 remains OPEN with zero new geometric lower bound.
