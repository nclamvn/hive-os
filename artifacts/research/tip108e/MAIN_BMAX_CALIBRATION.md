# Calibrating the entire B=b branch of the relaxed two-plus-four proxy

HAND analytic certificate submitted for independent challenge. This is NOT
closure of LEFT56/RIGHT1234: the other relaxed branch B=0 remains. Nor does it
close LEFT456/RIGHT123 or globalK6. No mathematical subprocess was used here.

## Reduction and precise domain

The reviewed clipped corrections yield Q244+(p1-q)^2/8+M, with q=min_R p.
Lowering p4 toq minimizes this LOWER functional, not the true union area.
Dropping the member2 candidate from M leaves M2=max(A^2/6,C^2/2), where
A=p1-q,B=p2-q,C=p3-q lie in[0,b]. The reviewed strict B-concavity licenses
B=0 or b. For B=b, weaken M2 to C^2/2. The resulting A-concavity licenses
A=0 or b. The source reductions are in HAND_CRITICAL_NOTES.md and have
already undergone hand challenge. This file calibrates BOTH A endpoints of
the ENTIRE B=b relaxed branch, for arbitrary C in[0,b].

Let a=abs(p6-p5), S=a+b in(18/61,18/31], d=min_R p-max_L p>1.
The reviewed full-pair prune excludes d>=5/3; here retain1<d<5/3.
Write k=q-p5, ell=q-p6. The two left orientations are

    (k,ell)=(d,d+a) or (d+a,d).

All cross differences are below5/3+18/31=209/93<7/3. Thus f4',f5'>=0.
All f_r here are the exact retained HIGH-band pair functions, not full-pair
caps. In the domain: f2'>=-1/6, f3'>=-1/12, abs(f3')<=1/8;
(f2+f3)'<=1/6. These follow from the explicit quadratic pieces.

## Eliminate C while retaining the common arguments

For either A endpoint the C-dependent part is

    b*C/2-f2(k+C)-f3(ell+C).

For ell=k+a, its derivative is at least b/2-1/6-a/4, using f3''<=1/4.
For ell=k-a, put x=ell+C>1. If x+a<3/2 then f2'(x+a)<=f2'(x), giving
the common-argument1/6 upper bound. Otherwise f2'(x+a)<=0 and f3'(x)<=1/8.
Therefore replacing C by0 loses at most

    m(a,b)=b*(1/6+a/4-b/2)_+.

This is an inequality on the whole interval, not an assumption of a C endpoint
minimum. At A=b the C0 face is exactly

    H(a)=1+k/2-a^2/4-b^2/8
         +(2-k-b)_+^2/8-(ell+b-1)^2/8
         -f2(k)-f3(ell)-f2(ell)-f3(k+b)
         -f4(ell+b)-f4(k+b)-f5(ell+b),

with S,d fixed and b=S-a. At A=0 use its analogous exact face, called H00.

## Curvature, including the corrected sign

Set h23=f2+f3, h34=f3+f4. Their piecewise second derivatives are

    h23'' = -5/12, -1/12, 1/12 on (1,3/2),(3/2,2),(2,5/2);
    h34'' = 1/4 below3/2 and -13/60 above3/2.

For (k,ell)=(d,d+a),

    H''=-3/4+(1/4)*1_{d+b<2}-h23''(d+a)-h34''(d+b)<=2/15.

IMPORTANT FAILURE HISTORY: an earlier HAND draft incorrectly assigned a
negative sign to the low hinge's second derivative and claimed concavity.
That claim is FALSE; for d6/5,S1/2,a1/10,b2/5 the second derivative is2/15.
Main withdrew it before acceptance, and the critic independently reproduced
the counterphase. The proof here uses the VALID upper-curvature bound only.
Since the pieces are C1, H-a^2/15 is concave across their seams, giving

    H(a)>=(1-a/S)*H(0)+(a/S)*H(S)-a*b/15.

The opposite orientation has H''<=-1/5. For H00 the two orientations have
H00''<=-11/12 and <=-17/60 respectively. These follow by grouping f2+f3+f5
with f3 in the first orientation, and f2+f4 with f4 in the second; the low
hinge's POSITIVE curvature is included. Thus the same, weaker chord-minus-
ab/15 bound is valid for all four faces. No global true-area concavity is used.

## Pure right-span face: all displacement phases

At a0,b=S the A=b face is H0. Put z=d+S. For S>=1/2:

I. d<=3/2,z<=2:

    H0=281/120-2S/5-7S^2/60+(S-79)*d/60+11d^2/20.

Completing the d square gives

    H0-(1+S/2)>=[4385-6970S-925S^2]/7920
                 >=455/138384, at S18/31.

II. d<=3/2,z>=2:

    H0=301/120-17S/30-3S^2/40+(S/10-89/60)*d+71d^2/120.

Its vertex (89-6S)/71 is below2-S because S<53/65. It is increasing on
this phase, so its minimum is on the continuous phaseI boundary.

III. d>=3/2,z>=2:

    H0=121/120-17S/30-3S^2/40+(31/60+S/10)*d-3d^2/40.

Its d derivative is positive throughout[3/2,5/3], so its minimum is at the
continuous phaseII boundary. These three phases exhaust S>=1/2,d>1.

At the A=0 pure-right face, its difference from H0 is at least

    S/4-3S^2/8+(f4+f5)(d+S)-(f4+f5)(d)>0.

The low/gap difference is S/4, with additional (d+S-2)_+^2/8; f4+f5 is
nondecreasing in the retained range and S<2/3. Thus the same floor applies.

## Pure left-span face: all displacement phases

At aS,b0 both A endpoints coincide. Write HS for the harder orientation
(k,ell)=(d,d+S), h234=f2+f3+f4, h2345=h234+f5. Then

    HS=11/8+S/4-3S^2/8+(1-S)*d/4-h234(d)-h2345(d+S).

For S>=1/2:

I. d<=3/2,z<=2:

    HS=173/120+7S/15-13S^2/30-(7+22S)*d/60+3d^2/20.

Completing the d square gives

    HS-(1+5S/8)>=181/432-65S/216-71S^2/108
                  >=9385/415152, at S18/31.

II. d<=3/2,z>=2:

    HS=71/40+2S/15-7S^2/20-(9/20+S/5)*d+7d^2/30.

Its vertex (27+12S)/28 is below2-S since S<29/40, so its minimum is at
the continuous phaseI boundary.

III. d>=3/2,z>=2:

    HS=47/40+2S/15-7S^2/20+(7/20-S/5)*d-d^2/30.

This is concave in d, so its minimum is at3/2 or5/3. The first boundary is
covered byII; at5/3, subtracting1+5S/8 gives
719/1080-33S/40-7S^2/20>=71309/1037880>1/20>9385/415152.

The opposite left orientation has a face at least HS+S/4. Indeed swapping
k and ell changes only the base/low/gap part and f5(d+S)-f5(d)>=0 in the
high terms. The former difference is S(2d-1)/4+S^2/4 when d+S<=2; when
d+S>=2 its minimum is3S/4-S^2/4, again at least S/4. No opposite extrema
are evaluated at unrelated offsets.

## Large S: calibrated chord minus the actual C loss

For S in[1/2,18/31], m(a,b)<=a/8. In the positive-part-active region,
maximizing the quadratic m-a/8 in a gives an upper bound
(36S^2-132S+49)/1728<0. In the inactive region the inequality is immediate.

Set u=a/S. The two endpoint margins, after including the extra S/8 of HS,
are at least3/1000 and1/50, respectively. Therefore EVERY face, after C loss,
has margin at least

    3/1000+17u/1000-S^2*u*(1-u)/15
    >=3/1000-11u/2000+9u^2/400
    >=959/360000>0.

Here S^2/15<9/400. The last step is an exact completed square. The false
concavity assertion is not needed; its entire possible chord error is charged.

## Small S: do not apply the large-S loss inequality

For S<=1/2, H0-(1+S/2) decreases with S at fixed d: its derivative is at
most -S/4-2/3, using f3'>=-1/12 and f4',f5'>=0. Thus its floor is at least
the S1/2 value535/6336 for every d. The A0 pure-right face dominates it.
Similarly HS-(1+S/2) has derivative at most -d/4-3S/4<0, using
h2345'>=-1/4. At S1/2 the phase bounds give HS-(1+S/2)>=1/6; the opposite
orientation is larger.

Since a<=1/2-b, m<=b*(7/24-3b/4)_+<=49/1728. Also ab/15<=1/240.
The chord and entire C interval therefore have uniform margin

    535/6336-49/1728-1/240=2467/47520>0.

All formulas are continuous at the phase boundaries, at a0,b0 and at S1/2;
all permitted ties are included. Thus the entire relaxed B=b branch would
have G-(1+S/2)>=959/360000 after independent acceptance of this certificate.
This is NOT the full two-plus-four result: B=0/A=b still needs its scalar
calibration. Three-plus-three also remains unclosed. No novelty/formal-proof/
method-advantage/globalK6 claim follows from a relaxed-branch certificate.

Tiếng Việt: chứng chỉ này nhằm đóng cả nhánh B=b của hàm cận đã rút gọn,
không chọn vài cấu hình thật. Lỗi dấu khiến một bản nháp nhận sai tính lõm
đã được giữ lại và sửa bằng cận sai số dây cung; mọi hạng chuyển miền và mất
mát do C đều được tính. Nhánh B=0 cùng kiểu3+3 vẫn chưa đóng, nên chưa được
gọi đây là chứng minh toàn hai kiểu hoặc kết quả K6 toàn cục.

## Scoped acceptance after full independent challenge

The gap-specific reviewer read and re-expanded the complete source, including
all six displacement-phase polynomials, both span regimes, the corrected chord
error, C elimination and every retained boundary. INDEPENDENT_REVIEW.md sectionL
records SCOPED HAND PASS. Thus the ENTIRE relaxed B=b branch's uniform margin
959/360000 is accepted within TIP108E. The complementary B0 certificate was
subsequently independently accepted in sectionM; together with the far strip
they establish the whole critical2+4/reflection D>=959/180000. Three-plus-three,
R1 and globalK6 are not closed by that acceptance. No new execution occurred.
