# K6: full-source triple assembly, exact cancellation and sharpness failure

**PARTIAL — K6 OPEN.** No certificate of the sharp all-real bound
`G>=40/31` (equivalently `Q<=53/31`) has been obtained. This attempt
retained all six sources. It did not substitute a local identity or a
regional result for closure. The full new-objective degree4 class remains
unresolved, not disproved.

Owner-approved scope: `TRIPLE_COVERAGE_SCOPE_20261013.md`. Activation
2026-10-13 10:20:47UTC, ceiling10:50:47UTC; Main's new derivation STOP
observed10:40:02UTC, before report writing. Hand mathematics only; no solver,
code, new variables or infrastructure. Predecessor files remain unchanged.

## 1. Exact whole-source cancellation, within the existing graph

Use f(s)=s-s²/2 and the same signed ray coefficients

    c_R1=3,c_R2=2,c_R3=1,c_L4=1,c_L5=2,c_L6=3,
    c_L1=-2,c_L2=-1,c_R5=-1,c_R6=-2.

The objective is `G=3-Q`, `Q=sum c_ray*D_ray`; the compact domain D is
available through the predecessor's global area-preserving reduction.
No source order, genericity or interior assumption is imposed.

For a max gate r=max(a,b), h=(r-a)(r-b), there is an exact polynomial
identity, including off-graph values,

    f(r)-f(a)=(r-a)*(1-b)+(r-a)^2/2-h.                 (1)

If the newly inserted b is an original clipped input, both r-a and1-b
are existing nonnegative generators. Thus (1) is a degree2 product/SOS
certificate and requires NO bound on the old aggregate a. The other useful
free-square identity is `1/2-f(r)=(1-r)^2/2`. Neither proves the target.

For carried upper outputs p,q of a paired sorter, with inputs alpha,beta,
write e=p+q-alpha-beta and h_p=(p-alpha)(p-beta). Exactly,

    f(p)+f(q)-f(alpha)-f(beta)
      =-h_p+e*(1-(q+alpha+beta-p)/2).                 (2)

This transports the sum of moments using existing degree2 equation
multiples; it does not assume that the source label survives sorting.
When b in (1) is a carried output, 1-b is NOT automatically an existing
generator. Equations (1)-(2) must be assembled legitimately, not by
silently inserting output-box inequalities. Ties remain included.

For sorted source bands [l_k,h_k], let H1=h1,S1=l1 and
H_k=max(H_(k-1),h_k), S_k=max(H_(k-1),l_k). The quadratic abbreviation

    E_k=f(h_k)-f(l_k)-f(H_k)+f(S_k), E1=0

is the weighted overlap of the new band with the WHOLE previous union.
Indeed all earlier lower endpoints precede l_k, and an earlier interval
attaining H_(k-1) covers from l_k up to that endpoint when the overlap
is nonempty. This interpretation includes nested and touching bands.
There is no replacement by sums of independent pair overlaps. Exactly,

    D_ray=sum_k[f(h_k)-f(l_k)]-sum_k E_k,
    53/31-Q=53/31-Q_source+sum_ray c_ray*sum_k E_k.    (3)

Sorting conservation (2) returns Q_source to the original source bands.
The last term in (3) has both signs. Neither dropping it nor invoking
E_k>=0 on genuine geometry proves the target. E_k is an abbreviation,
NOT a new inequality generator. No degree<=4 nonnegative payment of (3)
was found. The previous triple clip expansions already cost degree4;
adding routing factors to those displayed proofs exceeds the cap.

## 2. A genuinely global, labelled triple-overlap bound

To avoid merely repeating local clip identities, Main tested this complete
geometric assembly. Write X_i for the membership indicator of triangle i
at a plane point, and S for the active label set. These are analytical
notations, not added graph variables.

Choose ten triples B whose oriented three-cycle vectors are independent
in the cycle space of the complete graph on six labels. Such bases exist,
for example the ten triangles through one fixed vertex. For |S|=m>=1,
the selected cycles contained in S are still independent in the induced
complete graph. Its cycle-space dimension is

    C(m,2)-m+1=C(m-1,2).

This count follows by fixing a spanning tree and assigning one independent
cycle per remaining edge; m=1 has dimension0. Consequently

    1_(m>0) >= sum_i X_i - sum_(i<j) X_i*X_j
                +sum_(T in B) product_(i in T) X_i. (4)

For m>=1 the right side is at most m-C(m,2)+C(m-1,2)=1; for m=0 it is0.
Integration proves the WHOLE-domain bound

    G >= 3 - sum_all_15_pairs area(T_i intersect T_j)
             +sum_(T in B) area(intersection of its three triangles). (5)

Thus (4) genuinely couples selected triple overlaps across all six sources.
It is not the rejected exact decomposition into separate triple functions:
it is a lower bound with a possible coupled deficit. Equality holds iff
the selected cycles within almost every active S span its cycle space.

Membership-indicator degree3 does NOT automatically give a degree3 or4
polynomial certificate on the frozen490-variable graph. Such a translation
would require separate proof. More importantly, the next section rejects
sharpness before any computational translation or allocation is attempted.

## 3. Decisive sharpness failure of the fixed triple-correction assembly

The failure is stronger than just rejecting cycle bases. Consider ANY
constant coefficients lambda_T in the pointwise candidate

    p(X)=sum_i X_i-sum_all_pairs X_i*X_j
           +sum_all_triples lambda_T*product_(i in T) X_i,
    p(X)<=1_(sum X_i>0) for all Boolean membership assignments.          (6)

No sign restriction on the lambda_T is needed for the argument.
At the retained sharp placement, use the translated gauge

    A*=(0,25,36,70,81,106)/31.

The following FOUR exact membership sets each occur on positive-area open
sets. Strict interior witness points (t,x) are:

| Exact active set | t | x |
|---|---:|---:|
| {2,3,4} | 19/20 | -27/25 |
| {3,4,5} | 19/20 | -1861/1550 |
| {2,3,5} | 11/20 | 1/50 |
| {2,4,5} | 11/20 | 77/775 |

For the first row, at t=19/20 the relevant intervals are

    I2=[-339/310,-89/620],
    I3=[-1047/620,-229/310],
    I4=[-239/155,-367/620].

The value -27/25 is strictly inside all three. It is left of I1, whose
left endpoint is -19/20, and right of I5 and I6, whose right endpoints
are respectively -184/155 and -165/124. Thus it is exactly {2,3,4}.

For the third row, at t=11/20, I2,I3,I5 contain1/50 strictly. I1 ends
at0, while I4 and I6 begin at9/155 and37/310 respectively, both greater
than1/50. This gives exactly {2,3,5}. The reflection

    x -> 106/31-6*t-x, labels j -> 7-j

preserves the sharp arrangement and gives the other two rows exactly.
All comparisons are strict, so these points certify open neighborhoods,
not a numerical sampling claim. The sharp construction lies in compact D
after restoring A6=0; the common translation does not change memberships
or area.

If the integral of the pointwise minorant (6) equalled the sharp area,
its nonnegative deficit would vanish on each of these open sets. On an
exact three-element set S, p=3-3+lambda_S=lambda_S. Therefore

    lambda_234=lambda_345=lambda_235=lambda_245=1.

But on the Boolean set {2,3,4,5}, the same candidate then gives

    p=4-6+(1+1+1+1)=2>1,

contradicting (6). No such pointwise fixed-triple correction can attain
the sharp area. In particular NO cycle basis in (4) can be sharp: those
four triangular boundary vectors form the dependent tetrahedron boundary.

This is a complete failure of the NAMED assembly, not a local condition
or a counterexample to K6. It does not reject quartic labelled intersection
terms, variable context-dependent coefficients, altered pair coefficients,
or full source-aware degree4 certificates on the original graph. Adding
a fourth-order correction could remove this particular contradiction but
would still require a complete global identity; none is asserted here.

Correction history: an intermediate message proposed x=-11/10 for the
first row. Independent literal review correctly rejected it: that point
is left of I2. The saved proof uses the repaired strict point -27/25.
No conclusion relies on the rejected coordinate.

## 4. Other feasibility observations, not additional closure claims

A symmetric pointwise minorant p(M) depending only on the overlap count
cannot be sharp at degree<=4 either: every multiplicity1,...,6 occurs on
an open set at A*. Sharp contact would force p(1)=...=p(6)=1 and p(0)=0,
requiring degree at least6. Exact points and checks are retained in the
critic note. This indicator-degree obstruction is not a graph-degree
impossibility theorem.

Builder additionally checked that exact sums of functions of at most
three apex coordinates cannot equal the full area, using a nonzero fourth
mixed difference on a box wholly inside D. This only rules out a semantic
triple-separable equality, not a triple lower bound with coupled remainder
or source-aware wires. It is secondary to the full-source attempt above.

## 5. Feasibility decision and Vietnamese outcome

**NO GO for running the rejected fixed-triple assembly.** It cannot be
sharp regardless of numerical optimization, so a solver run would not
repair it. For the broader degree4 source-aware graph class, there is
still neither a full identity nor a full impossibility proof. No coupled
coefficient system with qualified solve/recovery cost was produced.

**Chưa khép K6; không có cận dưới sắc mới.** Lượt này đã thử một cách
ghép có hiệu lực trên toàn miền: chọn phần giao ba theo cơ sở chu trình
của sáu nguồn. Kiểm tra đúng tại cấu hình đạt cận sắc chứng minh rằng
cách ghép với trọng số cố định này không thể đạt40/31, kể cả khi không
hạn chế dấu của các hệ số ba. Vì vậy không chạy bộ giải cho lớp đã bị loại.

Phép hủy các cổng max/sắp xếp giữ được phần phủ chồng đầy đủ, nhưng
chưa có phần bù không âm cho tổng mang dấu trong (3). Những đồng nhất
thức này không được tính là hoàn tất. Bậc4 toàn nguồn vẫn mở; không
tăng bậc, không thêm hạ tầng, không tự mở lượt nghiên cứu kế tiếp.

## 6. Review and resources

Minimal Vibecode is used for the existing Main/Builder/critic review only.
Builder new derivation STOP10:31:42UTC, critic10:31:34UTC; later checks
were literal review of Main-supplied expressions, not independent resumed
search. Critic fully read Builder sections1–5 at10:33:35UTC and its appended
section6 at10:35:10UTC. Main has read both saved notes fully. Final Main
saved-text review of sections1–6 completed at observed10:40:18UTC:
ACCEPT, no blocking correction. This accepts the exact cancellations,
corrected witness proof, restricted assembly rejection and incomplete
outcome; it does NOT accept a K6 proof. Repository `git diff --check`
passed. No global K6 certificate exists to accept.

Mathematical subprocesses/SDP/numerical search/product code/build/UI/API/DB/
Git writes/install/new agents/variables/gates/infrastructure/scratch/deletions:0.
Ordinary reads, hand derivations and Markdown records only. No claim of
external-human review, Lean verification, novelty or general Kakeya closure.
