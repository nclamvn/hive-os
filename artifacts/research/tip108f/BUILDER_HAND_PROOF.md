# TIP108F — Builder hand coupling notes

Status: WHOLE LEFT456/RIGHT123 target OPEN. This file records analytic
ingredients, not a certificate of the target. The six offsets, the same
bottom gap, and the actual group spans remain coupled. No mathematical
subprocess, sample, box generation, or optimizer has run.

## 1. Omitted-band loss is paid by span imbalance

Let a>=b>=0 and S=a+b<=18/31. For the previously proved omitted-band bound

    T(s)=((s-1/3)_+^2-(s-1/2)_+^2)/2,

one has the whole-span inequality

    T(a)+T(b) <= (a-b)^2/12.

Indeed b<=9/31<1/3, so T(b)=0. At fixed a the right side decreases as S
increases; it suffices to compare T(a) with (2a-18/31)^2/12, except when
a<=1/3, where the claim is immediate. For a in[1/3,1/2], the difference
between this square and (a-1/3)^2/2 is a concave quadratic in a. Its endpoint
values are positive: at1/3 the subtracted term is zero; at1/2 the comparison
is 169/11532>1/72. Thus the difference is nonnegative throughout.

For a>=1/2, T(a)=a/6-5/72. The ratio

    (a/6-5/72)/(2a-18/31)^2

has its maximum at a=101/186, with value31/376<1/12. This follows directly
by differentiating: the derivative has the sign of
5/18-a/3-(18/31)/6. Endpoint values cannot be larger. Hence the claim
holds also on[1/2,18/31]. The same estimate applies a fortiori to the
gap-dependent T_d in MAIN_COUPLING_PROOF.md, since 0<=T_d<=T.

This is a whole-span scalar inequality, but does not by itself bound G.

## 2. A useful nonnegative-coordinate energy inequality

For U,V>=0 define the full outward-envelope energy

    B(U,V)=integral_0^1 max(U-2y,V-y,0) dy,

where the ranges here are <=18/31, so the support lies within[0,1]. Define

    F(U,V)=-U^2/3-7V^2/24+UV/2+B(U,V)+U^2/8.

Then

    F(U,V)>=U^2/24+5V^2/24.

This follows from all three exact envelope regimes:

* 0<=V<=U/2: F=U^2/24-7V^2/24+UV/2. Since U>=2V,
  the last two terms are at least17V^2/24, which is more than needed.
* U/2<=V<=U: F=7U^2/24+17V^2/24-UV/2. After subtracting
  U^2/24+5V^2/24 the remainder is
  U^2/4+V^2/2-UV/2=(U-V)^2/4+V^2/4>=0.
* V>=U: F=5V^2/24-5U^2/24+UV/2. After subtracting the
  claimed floor the remainder is -U^2/4+UV/2>=0,
  because V>=U.

After the reviewed p3=q relaxed-proxy reduction, RIGHT U,V are nonnegative
and the selected inward correction is U^2/8, so this ingredient applies.
For LEFT it applies only when X,Z>=0 and the retained inward term is at
least Z^2/8. It is NOT a license to assume p4=max_LEFT or to remove signed
LEFT extrema. No whole-domain floor follows from this conditional use.

## 3. Exact remaining coupling obligation

The reviewed whole proxy is Q333+B_LEFT+B_RIGHT-T_d(a)-T_d(b), plus the
two selected inward squares. Q333=P+J in the immutable TIP108E algebra
source. The negative switching hinges in J and signed LEFT coordinates
remain obligations. Neither the flat-fan gradient nor the preceding
nonnegative-coordinate inequality licenses endpoint minima for the actual
area or this whole proxy. The target is still to prove this coupled proxy,
or a stronger valid coupling, strictly above1+S/2 for every permitted offset.

### Exact signed LEFT alternatives, not a calibrated reduction

Translate LEFT into[0,a], with both endpoints attained. Write r=a-p4, so
t=q-p4=d+r and 0<=r<t-1. If p4 attains a, X,Z>=0. If p4 attains0,
a=r<t-1; in particular low t<=13/10 forces a<3/10. When p4 is strictly
between the extrema, the two remaining labels must attain the endpoints.
There are exactly the following two signed forms:

    p5=a,p6=0: X=-r,Z=a-r, C_LEFT=a^2/8, B_LEFT=Z^2/4;
    p5=0,p6=a: X=a-r,Z=-r, C_LEFT=0,     B_LEFT=X^2/2.

Ties belong to the adjoining closed cases. These identities retain the
same d,t,a and do not establish that either middle coordinate is extremal
at a minimum. The full switching terms J still depend on these coordinates.

## 4. Stronger energy and a conditional low-t scalar floor

The Contractor's strengthening, verified here in the same three regimes, is

    F(U,V)>=U^2/24+5V^2/24+UV/5.

The residuals are respectively3UV/10-V^2/2>=V^2/10;
U^2/4+V^2/2-7UV/10>=0 (determinant1/400>0); and
-U^2/4+3UV/10>=U^2/20. This strengthening is valid for all U,V>=0.

The following scalar certificate applies ONLY to1<t<=13/10 and X,Z>=0.
It does not settle the signed alternatives or higher t. Reflection chooses
a>=b. Set z=3/2-t>=1/5 and S=a+b. All H_2 terms vanish since t+S<2.
For s>=0 let lambda_s=(s-z)_+/s, with lambda_0=0. For0<=x<=s,
(x-z)_+^2<=lambda_s^2*x^2. Dropping only the positive H_(3/2) terms gives

    J>=-lambda_b^2*V^2/2-lambda_a^2*X^2/2
       -c*((U+X)^2+(V+Z)^2), c=lambda_S^2/10.

Combine this with the stronger F bound for both nonnegative pairs. In the
resulting lower polynomial the U derivative is at most
-t/6+17b/60<0, and its Z derivative is at most
-t/6+17a/60<=-1/6+51/310=-2/930<0. Thus U=b,Z=a minimizes this LOWER
polynomial. This is not an endpoint assertion about G or its original proxy.

The non-middle terms, after the span-imbalance estimate, are at least

    fan(t)-t*S/6-S^2/24,
    fan(t)=13/6-7t/6+t^2/2.

For x in[0,s], the middle self terms satisfy

    5x^2/24+s*x/5-lambda_s^2*x^2/2 >= gamma*x^2,
    gamma=49/120-3481/16200=1567/8100,

because s*x>=x^2 and lambda_s^2<=lambda_S^2<=3481/8100.
Writing v=V+X, the remaining cross term -VX/4 is absorbed using
V^2+X^2>=v^2/2 and VX<=v^2/4. Thus these terms are bounded below by
A*v^2-k*v, where A=1109/32400 and k=(7-5t)/12. Since
2A*(18/31)<1/24<=k, this expression decreases on0<=v<=S; its minimum
is A*S^2-k*S. Finally both arguments in the last negative cross-hinge
cap are <=S, giving a total loss at most(S-z)_+^2/5. Consequently

    G>=fan(t)-(7-3t)*S/12-241*S^2/32400-(S-z)_+^2/5.

The right side decreases in S on the stated interval: its S derivative is
-(7-3t)/12-482*S/32400-2*(S-z)_+/5<0. Put S=18/31. Now S-z>0 throughout
1<=t<=13/10. Completing the t square gives a minimum at

    t=17/18+S/4=304/279,

which lies in that interval. Subtracting1+S/2 gives the exact minimum

    97/216-5S/8-14657*S^2/64800
    =12859/1297350>0 at S=18/31.

Thus this CONDITIONAL whole-offset region has a strict calibrated proxy
floor. The whole LEFT456 class remains OPEN because X,Z>=0 and t<=13/10
have not been licensed on the entire domain.

### Correction history

A transient message expanding the middle-high signed energy incorrectly
added Z^2/8 alongside its actual a^2/8 inward correction. It was withdrawn
immediately before use. The exact energies, with the actual selected clips,
are instead

    middle-high X=-r,Z=a-r: F_LEFT=a^2/24-a*r/3+r^2/8;
    late-high   X=a-r,Z=-r: F_LEFT=5a^2/24-11a*r/12+3r^2/8.

No target floor or mathematical execution was based on the withdrawn form.

## 5. Stronger coefficient and all signed LEFT low-t cases

HAND submission for independent challenge, not yet a whole3+3 certificate.
The preceding nonnegative low-t argument may use eta=11/54 instead of1/5:

    F(U,V)>=U^2/24+5V^2/24+(11/54)*UV.

In its three regimes the residuals are respectively
8UV/27-V^2/2>=5V^2/54;
U^2/4+V^2/2-19UV/27>=0 (determinant7/5832>0);
and -U^2/4+8UV/27>=5U^2/108.
The U and Z derivative upper bounds for the same negative-hinge lower
polynomial become -t/6+(31/108)*b and -t/6+(31/108)*a. The latter is
<= (1-t)/6<0 because a<=18/31. Thus both saturations remain licensed.

The middle self coefficient is now1597/8100 and its sum coefficient is
A=1169/32400. Write M=18/31. The stronger coefficient requires a small endpoint error:
2*A*M=1/24+13/55800. For any k>=(1/24), minimizing A*v^2-k*v on[0,S]
instead of using its value at v=S loses at most

    epsilon=(13/55800)^2/(4*A)=169/449363600<1/1000000.

Indeed the exact loss is (2*A*S-k)_+^2/(4*A), which has the displayed
uniform bound. Thus the repaired proof gives

    L(t,S)=fan(t)-(7-3t)*S/12-181*S^2/32400-(S-z)_+^2/5,
    G>=L(t,S)-epsilon when X,Z>=0 and1<t<=13/10.

L still decreases in S. At M=18/31 it has the exact identity

    L(t,M)-(1+M/2)
    =13669/1297350+(3/10)*(t-304/279)^2.                 (1)

All comparisons below are to this LOWER polynomial, not assertions that
the original area is minimized at nonnegative extrema.

### Middle-high LEFT: p5=a,p6=m>=0

For the comparison path it is sufficient that all LEFT offsets remain in
the containing[0,a] and max_LEFT=a remains attained. Its minimum need not
continue to attain0. Set alpha=a-m<=a. Here X=-r,Z=alpha-r with
0<=r<=alpha and t=d+r. Compare its polynomial and exact left energy with
the nonnegative formal pair X'=0,Z'=alpha, retaining the same t,U,V,a,b.
Their difference is

    r*((7-3t)/12-alpha/3+(U+V)/4)+r^2/8 >=0,

because(7-3t)/12-alpha/3>=31/120-6/31>0. Each negative hinge cap is no
larger than for the formal pair: X_+=0, (U-r)_+<=U, and
V+alpha-r<=V+alpha. The nonnegative lower polynomial can subsequently
increase its formal Z from alpha to a using its already proved nonpositive
Z derivative. Thus this signed case inherits the floor in(1) minus epsilon,
with the ORIGINAL
containing a,b,S,T_d(a). No change of actual d or target span is used.

### Late-high LEFT: p5=m>=0,p6=a

Set alpha=a-m<=a. Here X=alpha-r,Z=-r with0<=r<=alpha. Compare to the
formal nonnegative pair X'=alpha-r,Z'=0,
using only its Z'^2/8 inward contribution, which is zero. The actual inward
contribution is also zero. All negative hinge caps improve or stay equal:
X is unchanged and (V-r)_+<=V. The exact polynomial-plus-energy loss is

    r*(t/6+U/4-alpha/2+r/6)
    >=r*(t/6-M/2+r/6),                                 (2)

where M=18/31. The same t and all member arguments are retained. Since
d>1, r<t-1. Minimizing the right side of (2) over0<=r<=t-1 gives

    (t-1)*(2t-1-3M)/6,      1<=t<=M+2/3,
    -(3M-t)^2/24,           M+2/3<=t<=13/10.

In the first interval, add this loss to (1), and subtract epsilon for the
proxy conclusion. The unshifted exact quadratic is

    (19/30)*t^2-(16/15+13M/20)*t
      +53/60+M/60-6661*M^2/32400.

Its minimum occurs at1343/1178, within the stated interval, and equals

    1897/3651800>0.

For direct arithmetic audit, at M=18/31 its constant is
1661/1860-6661/96100 and the square-completion subtraction is
1803649/2191080. Their difference is5691/10955400=1897/3651800.
In the second interval the derivative of the completed-square expression
is(3/5)*(t-304/279)+(3M-t)/12>0. Thus its minimum is at the shared
boundary and cannot be smaller than the first-interval floor.

### p4 attains the current LEFT minimum

The current actual LEFT range is r=a-p4=t-d<t-1<=3/10, even when the
ORIGINAL containing a is larger because p4 was previously raised. Raising
p4 only until it first reaches min(p5,p6) is licensed for the FULL
outward-energy proxy, not merely at a presumed area minimum.
Hold q,a,p5,p6 and all RIGHT offsets fixed. Its p4 derivative is

    -1/2-X/2+[f2'(p2-p4)+f3'(p1-p4)
               +(3/2-(p1-p4))_+/3]+h,
    h=max(X_+,Z_+/2).

The bracket is<=1/3 by the reviewed high-band derivatives. Since
h-X/2<=r/2 for three offsets whose current actual range is r,
the derivative is<=-1/6+r/2<0, including one-sided seams. The group
maximum remains a at p5 or p6, so the inward selected square is constant.
The containing span and T_d(a) remain valid even if the actual minimum
ceases to be0 along this comparison. The target containing S=a+b stays
fixed. At the stopping point a middle-high or late-high closed case above
applies (or p4=a if both other offsets attain a). The comparison lowers t
while it stays in(1,13/10]. This accounts also for the minimum-attainment
loss along a higher-t comparison path; it does not recenter or shrink the
target S.

The six extrema possibilities and their ties are therefore accounted for
in the low-t domain. Subject to independent acceptance of this hand
submission and the retained p3=q proxy reduction, this establishes

    G>1+S/2 for1<t<=13/10,

with the conservative uniform margin
1897/3651800-epsilon>499/1000000>0. It DOES NOT establish
the target for t>13/10 or the entire LEFT456 class. No subprocess was used.

## 6. All signed higher-t placements reduce to calibrated boundaries

HAND submission. After the reviewed FULL-envelope p3=q reduction, U,V>=0.
Hold q,a,p5,p6 and RIGHT offsets fixed, with max_LEFT=a attained. Raise
p4 while it is below a. The exact full-proxy derivative is the expression
displayed above. For t=q-p4>=13/10, both RIGHT arguments t+U,t+V are
>=13/10. On the exact high-band pieces, f2'(D)<=0 for allD>=13/10, and

    g3(D)=f3'(D)+(3/2-D)_+/3 <=17/120 for D>=13/10.

Below3/2 this is1/4-D/12; between3/2 and2 it is f3'<=1/8;
above2 it is negative for our D<7/3. Moreover for ANY signed X,Z formed
by three offsets in the containing[0,a],

    h-X/2=max(X_+,Z_+/2)-X/2<=a/2.

The branches are X/2, (Z-X)/2, and -X/2, all bounded by a/2 through
the respective pairwise offset differences. Consequently

    derivative_p4 proxy <=-1/2+a/2+17/120
                        <=-43/120+9/31=-253/3720<0.

Continue until t=13/10 or p4=a, whichever occurs first. The maximum a
continues to be attained by another LEFT member until the endpoint; q and
d=q-a stay fixed, so T_d(a) stays fixed. The selected inward LEFT square
also stays fixed. If the original minimum0 ceases to be attained, the
original containing interval and target S remain unchanged; Section5 was
explicitly strengthened to cover that case.

At t=13/10 the all-signed low-t certificate of Section5 applies. At p4=a
one has X,Z>=0 and t=d<7/4, so the Contractor's independently reviewed
whole positive-chart calibration applies. No actual-area endpoint assertion
is used: this is a monotone comparison of the full valid LOWER proxy.

Subject to independent acceptance of Sections5-6 and the Contractor's
positive-chart proof, these two boundary alternatives exhaust the whole
remaining3+3 domain. The repaired conservative low-t margin is499/1000000
in G units. This is a candidate WHOLE proof, not yet an accepted closure.

### Endpoint-error correction history

The first Section5 draft reused the Section4 monotonic-v endpoint step after
strengthening eta. Hand re-audit found2*A*M>1/24 by13/55800; therefore
that uncharged step was withdrawn before acceptance. The explicit uniform
epsilon above repairs every Section5 scalar floor. The exact displayed
square-completion minima for L remain algebraically unchanged, but all
proxy conclusions subtract epsilon. No subprocess or accepted result used
the withdrawn uncharged step.

Tiếng Việt: các bất đẳng thức trên là thành phần giải tích có phạm vi ghi rõ.
Chưa chứng minh cận đạt đích trên toàn miền3+3; không thay thế việc kiểm soát
các tọa độ có dấu và mọi bản lề bằng một họ con hay cấu hình phẳng.

## Scientific execution ledger

Mathematical processes:0. Mathematical time charged:0 seconds.
Only instruction/source reads and this hand-note edit have occurred.

## Terminal scoped acceptance — 2026-10-11, TIP108F

After rereading the repaired source, the independent AI hand critic returned
WHOLE3+3 HAND PASS. The Contractor independently reviewed the source and
rational arithmetic and accepted the scoped result. Scientific work stopped
at that acceptance; no further diagnostic, theorem, or successor is authorized.

For every retained LEFT456/RIGHT123 configuration, including arbitrary
internal offsets, tied extrema, switch boundaries, and lost minimum attainment
along comparison paths, the accepted proof gives

    G-(1+S/2)>=mu,
    mu=1897/3651800-169/449363600>499/1000000,
    D=2G-(2+S)>=2mu>499/500000>0.

The low-t proof above and the Contractor's independently accepted positive
LEFT chart jointly supply this uniform margin; the signed high-t derivative
reduces to those calibrated boundaries. The earlier candidate and correction
history remain preserved above. This is a universal analytic inequality on
the committed retained3+3 domain, NOT a formal proof-assistant verification,
novelty claim, global K6 theorem, or A-B unbounded-mode result.

Together with the retained predecessor proofs, the34 necessary near-two-group
label classes are now excluded under their stated reduction dependencies.
The one-bottom-component13 order domains and global all-real K6 lower bound
remain OPEN. No actual smaller-area witness was produced.

Tiếng Việt: đã nghiệm thu bằng kiểm tra giải tích độc lập phạm vi toàn miền
3+3 còn lại, không phải chỉ vài cấu hình. D>499/500000 trên miền cam kết.
Kết quả không chốt định lý K6 toàn cục:13 miền thứ tự của trường hợp một
thành phần đáy vẫn mở. Không chạy phép toán khoa học hay phát sinh hạ tầng.
