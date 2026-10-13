# TIP116 — simultaneous whole-network potential attempt

STATUS: PARTIAL; no all-real certificate of `P=53/31-Q>=0` was found.
K6 remains OPEN. The full new-objective degree-four class is not rejected.
Exact network invariants below are tools, not mathematical root closure.

Scope: `SIMULTANEOUS_D4_SCOPE_20261013.md`, activation2026-10-13 11:11:51UTC,
hardstop11:41:51UTC. Builder independent derivation STOP observed11:18:18UTC:
early hand payment exhaustion, not cap exhaustion. Later literal review and
recording do not restart it. All predecessors remain unchanged.

## 1. Exact committed payment

Same490-variable clip/paired-sort/union graph and available compact domain D.
No natural order, untied branch or extra output-bound generator is assumed.
Retain the proven full-source formulation

    Q_source=sum_all_15_pairs J_ij,
    R=sum_ray c_ray*sum_prefix E,
    P=53/31-sum J_ij+R.

Here R is exactly the actual integral of C(m-1,2) for multiplicity m>=1,
with0 for m=0. Its genuine nonnegativity is not itself an admitted generator
or a proof of P. The signed ray coefficients and full prefix context must
remain in the certificate.

The attempted assembly was a simultaneous source-moment potential, rather
than clearing each routed input independently. It sought a degree<=4 global
potential whose sorting equation telescope leaves a nonnegative prefix and
raw-clipping remainder for P. No such quantitative payment was obtained.

## 2. Association-preserving quadratic invariant

For one existing paired comparator, write lower inputs a,b and outputs u,v;
upper inputs alpha,beta and carried outputs p,q. Define only abbreviations

    eL=u+v-a-b, eU=p+q-alpha-beta,
    hA=(a-u)*(p-beta), hB=(b-u)*(p-alpha).

Exactly, even off the graph,

    u*p+v*q-a*alpha-b*beta
      =v*eU+(alpha+beta-p)*eL-hA-hB.                 (1)

Thus the SAME source-band lower/upper cross moment, not merely the two
independent endpoint moment sums, transports across all nine comparators
by additive degree2 equation multiples. Every routing tie is retained.
Together with the lower/upper square conservation, any common quadratic
band potential transports; no source-label preservation assumption is used.

## 3. Joint moments through degree4, without branch products

Main supplied a stronger simultaneous formula and Builder checked it
literally. Use a formal CONSTANT zeta for coefficient extraction and put

    z=a+zeta*alpha, w=b+zeta*beta,
    U=u+zeta*p, V=v+zeta*q,
    E=U+V-z-w=eL+zeta*eU,
    H=(U-z)*(U-w)=hL-zeta*(hA+hB)+zeta^2*hP,
    hL=(u-a)*(u-b), hP=(p-alpha)*(p-beta),
    s=z+w, v0=s-U.

The power-sum differences C_d=U^d+V^d-z^d-w^d satisfy

    C2=2H+E*(V+v0),
    C3=3sH+E*(V^2+V*v0+v0^2),
    C4=[4*(s^2-z*w)+2H]*H
         +E*(V^3+V^2*v0+V*v0^2+v0^3).              (2)

For E=0, U*v0=z*w-H, which immediately gives each Newton expression;
the displayed E terms are the factorization of V^d-v0^d. Coefficient
extraction in zeta proves conservation of every joint band power sum

    M_rs=sum_band l^r*h^s, r+s<=4,

by existing equation multiples of total expanded degree at most r+s.
Zeta is not a graph variable. The upper-root equation hP remains necessary
at lower ties; conditional equations alone would not justify the zeta^2 term.
No comparator discriminant is divided out and no child weights are multiplied.

## 4. A legal whole-context potential, not a pair-only replacement

Let M_rs^ray be the joint moments on EACH retained ray. For any polynomial
Psi in all these abbreviations with weighted degree<=4 (M_rs has weight r+s),
its value on sorted bands minus its value on original bands is an additive
sum of the existing equations with total degree<=4. This follows by applying
(2) one comparator at a time and factoring each monomial difference. Other
rays' factors are untouched context during that comparator step.

For example, `(M11^R2-M11^L1)^2` has degree4 and couples all bands on two
oppositely signed rays. Such a source-aware potential is not semantically a
sum of two-apex functions. The predecessor's separability rejection does not
exclude it. No new variables or inequalities are introduced by abbreviations.

A COMMON contextual polynomial K multiplying a whole stage telescope stays
legal when its degree plus the displayed moment proof degree is<=4. Merely
giving each stage a different K does not make a clean telescope: for stage
values F0,...,Fn,

    sum_(s=0..n-1) K_s*(F_(s+1)-F_s)
      =K_(n-1)*F_n-K_0*F_0
        -sum_(s=1..n-1)(K_s-K_(s-1))*F_s.           (3)

The last context-change remainder must be paid or cancelled, not discarded.
No sign for it follows from moment conservation.

Degree is actual expanded degree: a second-moment abbreviation has degree2.
Squaring it and multiplying an ORIGINAL quadratic clip generator costs6,
not4. Affine coverage-wire rows squared times that generator cost4 and remain
legal. The attempt does not silently lower the degree of a moment proof.

## 5. Where the whole payment remains missing

The exact union-moment telescope on every ray is

    D_ray=f(H5)-f(l1)
            -sum_(k>=2)[f(S_k)-f(H_(k-1))],
    f(t)=t-t^2/2.

Joint sorting invariants control the SOURCE-band potential but do not by
themselves control these terminal/prefix maxima and gaps. The target weights
have both signs, so an unconditional deletion of the prefix gap terms is
invalid. Real gaps also matter at the sharp graph: R2 has coverage

    [11/62,11/31] union [14/31,45/62] union [25/31,1],

so its two positive-weight gaps cannot be erased in a sharp comparison;
the reflected L5 has the corresponding gaps. This is an assembly check,
not a regional theorem or a replacement acceptance criterion.

No choice of Psi and existing nonnegative terms was found that pays the
prefix/signed-ray remainder and the coupled raw-clipping expression for P.
This is an incomplete coefficient assembly, NOT a proof that all such Psi,
all degree4 identities, or the original K6 inequality are impossible.
There is no complete certificate, qualified coefficient solve, runtime or
exact PSD recovery plan, so this attempt qualifies no execution.

## 6. Scoped outcome and review ledger

**Tiếng Việt:** Chưa khép K6. Phép vận chuyển đồng thời giữ được cả mômen
liên kết đầu dưới–đầu trên qua toàn bộ mạng, không cần nhân trọng số từng
nhánh hay bỏ mặt trùng nhau. Nhưng chưa có thế toàn cục biến phần dư prefix
và các cạnh mang dấu khác nhau thành tổng không âm trong bậc4. Các bất biến
chính xác không được tính là chứng minh cận40/31 hay một mốc đóng bài toán.

Minimal Vibecode uses only the existing Main/Builder/critic hand review.
No independent FULL saved-note review is claimed at creation; later actual
read times and scopes must be recorded. No mathematical subprocess, solver,
sampling, code/build/UI/API/DB/Git writes/install/new agents/variables/gates/
infrastructure/scratch/deletion. Only reads, hand mathematics and this one
new Markdown record. No automatic successor or degree/resource escalation.
