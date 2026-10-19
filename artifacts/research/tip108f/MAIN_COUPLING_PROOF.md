# TIP108F — Coupled whole-domain hand development

The whole LEFT456/RIGHT123 target is OPEN. These are analytic ingredients;
their acceptance does not license a target floor. Every expression refers to
the SAME six offsets and bottom displacement d>1. No mathematical process has
run at this checkpoint.

## Gap-dependent omitted-band correction (independent hand PASS)

The TIP108E outward exclusivity inequalities are separation>=d-3y for BOTH
LEFT lower and RIGHT upper expansions. Therefore these expansions contribute
through y<=min(d/3,1/2), rather than only y<=1/3. At equality endpoint contact
has zero length/area. Above1/2 the unchanged high-band group-hull bound already
retains full envelope expansions. A group's expansion is <=(s-y)_+, so only

    T_d(s)=[(s-d/3)_+^2-(s-1/2)_+^2]/2,  1<d<3/2,
    T_d(s)=0,                              d>=3/2,

must be subtracted from its full outward integral. This is nonnegative and
no larger than the retained T(s). The selected inward corrections remain
outside the opposite actual hull, are separated from same-group outward
expansions by the positive base width, and do not duplicate the high band.

Consequently the following is a valid whole-domain lower function:

    G>=Q333+B_L^-+B_R^+-T_d(a)-T_d(b)
       +(p1-min_Rp)^2/8+(max_Lp-p6)^2/8.

Reflection may choose b=min(a,b)<=9/31, making T_d(b)=0. This improves the
coupled proxy but is NOT its calibration. Source: prior MAIN_THREE_GROUP_CLIPPING.md
and MAIN_OUTWARD_ENVELOPE_CORRECTION.md, with the gap-dependent refinement
checked in the new INDEPENDENT_REVIEW.md. No assumption about actual-area
endpoint minima or positive support from a flat fan is made.

## Stronger envelope support (submitted for independent hand challenge)

For U,V>=0 let B(U,V)=integral max(U-2y,V-y,0)dy on[0,1]. The ranges
are<1, so its full exact three-piece formula is unchanged. Define

    F(U,V)=-U^2/3-7V^2/24+UV/2+B(U,V)+U^2/8.

Then the following stronger polynomial lower bound is valid:

    F(U,V)>=U^2/24+5V^2/24+UV/5.

Subtract the right side in each envelope regime. For V<=U/2 the residual
is 3UV/10-V^2/2>=V^2/10. For U/2<=V<=U it is
U^2/4+V^2/2-7UV/10, a positive definite quadratic (determinant1/400).
For V>=U the residual is -U^2/4+3UV/10>=U^2/20. Ties are continuous;
U=0 or V=0 cause no division. This is an envelope-energy inequality, not a
statement that actual area is minimized at any endpoint.

## A low-t positive-coordinate relaxation (NOT a whole calibration)

Use the reviewed relaxed p3=q reduction, and coordinates from TIP108E:
t=q-p4, U=p1-q, V=p2-q, X=p4-p5, Z=p4-p6. RIGHT U,V lie in[0,b].
In this section ONLY X,Z>=0 and lie in[0,a]; the signed LEFT charts still
must be handled. Reflection selected b<=a and S=a+b<=18/31. Keep the
original containing spans; no assertion of actual-span endpoints follows.

When 1<t<=13/10 set z=3/2-t>=1/5. Every cross argument is<=t+S<2,
so all H_2 terms in J vanish. For 0<=x<=m,

    (x-z)_+^2 <= lambda_m^2*x^2, lambda_m=(m-z)_+/m,

with lambda_0=0. The ratio (x-z)_+/x is increasing. Thus, dropping only
positive H_(3/2) terms and retaining the direction of every negative term,

    J>=-lambda_b^2*V^2/2-lambda_a^2*X^2/2
        -c*((U+X)^2+(V+Z)^2), c=lambda_S^2/10.

Add the stronger F supports on BOTH groups. The LEFT selected inward
square is>=Z^2/8 in this positive chart. The resulting polynomial lower
functional has U derivative at most -t/6+U/12+V/5 and Z derivative at most
-t/6+Z/12+X/5; all omitted cross/hinge derivative terms are nonpositive.
Their respective upper bounds are -t/6+(17/60)b and
-t/6+(17/60)a<=-1/6+51/310=-1/465<0. Therefore U=b,Z=a minimizes
THIS lower polynomial on its containing box. All modified cross arguments
remain>1; this is not an actual-area extremum principle.

Let k=(7-5t)/12 and alpha_s=5/24-lambda_s^2/2-c. The remaining positive
chart lower function is the common-offset scalar plus ONE two-variable
quadratic:

    fan(t)-t*S/6+(a^2+b^2)/24-a*b/4-c*(a^2+b^2)-T_d(a)
    +alpha_b*V^2+alpha_a*X^2-V*X/4
    +(b/5-k-2c*a)*V+(a/5-k-2c*b)*X,

    fan(t)=13/6-7t/6+t^2/2,
    0<=V<=b, 0<=X<=a.

This scalar/two-variable expression has NOT yet been proved>1+S/2.
The t>13/10 range, signed LEFT charts, containing-span calibration and all
switches are still obligations. No numerical minimization or samples ran.

### Source repair: full envelope must be reduced directly

TIP108E licensed the p3=q reduction for weakened M3, not automatically for
full B_RIGHT. Restoring full B after that weakened reduction would be invalid.
For the full envelope the p3 derivative is directly

    -max((p1-p3)_+/2,(p2-p3)_+).

It is minus the length of heights where either line is positive. Combine it
with Q333's (p2-p3)/2. Each of the two active branches and the zero branch
is>=-b/2 (the first gives(p2-p1)/2 when p1>p3). The other Q terms give
at least1/6 by the retained exact-pair bracket bound. Hence the FULL proxy
has derivative>=1/6-b/2>=2/93>0. Its LEFT terms/T_d/inward terms do not
depend on p3. Lowering to q preserves original q,d,a,b and the containing
box. This repairs the source qualification without adding M3 alongside B.
The critic independently checked the direct derivative argument.

## Whole low-t nonnegative LEFT chart calibration (submitted for challenge)

Start with the preceding two-variable lower function. Young's inequality
gives -VX/4>=-(V^2+X^2)/8, and bV>=V^2,aX>=X^2. Therefore its middle
part is at least

    beta_b*V^2+beta_a*X^2-k*(V+X)-2c*(aV+bX),
    beta_s=17/60-lambda_s^2/2-c.

Since z>=1/5 and s<=S<=18/31, lambda_s,lambda_S<=59/90. Thus

    beta_s>=17/60-(3/5)*(59/90)^2=86/3375>1/40.

Set eta=1/40 and v=V+X<=S. Then V^2+X^2>=v^2/2, aV+bX<=2ab,
and k>=1/24>eta*S. The function k(S-v)+eta*v^2/2 decreases on[0,S],
so the middle part is bounded below by

    -k*S-4c*a*b+S^2/80.

Use the Builder's whole-span bound T_d(a)<=T(a)<=(a-b)^2/12. Combining
(a^2+b^2)/24-ab/4=-S^2/24+(a-b)^2/12 pays this entire loss. Finally
a^2+b^2+4ab=S^2+2ab<=3S^2/2, so the resulting complete positive-chart
bound is

    G>=fan(t)+(3t-7)*S/12-7*S^2/240
        -(3/20)*(t+S-3/2)_+^2.

Subtract1+S/2. The right side strictly decreases with S throughout
1<t<=13/10,0<=S<=18/31. At S=18/31 the hinge is active throughout,
and the exact difference is

    (7/20)*(t-1387/1302)^2 +9271/2421720.

Indeed the constant before square completion is92491/230640 and the
linear coefficient is-1387/1860; their completed-square difference is
(9711555-9618845)/24217200=9271/2421720. Thus this ENTIRE chart, not
selected offsets or endpoint samples, has G-(1+S/2)>=9271/2421720>0.

This is submitted, not yet independently accepted. It covers ONLY the
nonnegative LEFT chart (p4=maxLEFT), t=d in(1,13/10]. The two signed LEFT
charts, the larger common-offset regime and therefore whole R1 remain OPEN.
No mathematical process was used in this derivation or its rational arithmetic.

## Positive LEFT chart: all larger gaps (independent hand PASS)

For X,Z,U,V>=0 write w=U+Z,v=V+X, with both<=S. Envelope/inward energies
are independent of t; -T_t(a) has nonnegative derivative. For t>=3/2 all
H_(3/2) switches in J are active, and direct expansion gives

    derivative(P+J_(3/2))=13/30-t/15-w/30-7v/60.

In derivative J_2, +(t+U+X-2)_+/2 cancels the negative
-(t+U-2)_+/2, and +(t+V+Z-2)_+/2 cancels -(t+Z-2)_+/2.
The remaining positive terms may be discarded, yielding

    derivative J_2>=-(t+v-2)_+/2-(t+w-2)_+/6
                   >=-(2/3)*(t+S-2)_+.

Hence derivative full proxy>=13/30-t/15-3S/20-(2/3)*(t+S-2)_+.
This decreases in t,S; at t=7/4,S=18/31 its value is17/1860>0.

### Transition13/10<=t<=3/2

Let z=3/2-t and define K as the difference between the true H_(3/2)
derivative and the preceding all-active affine expression:

    K=(z-U)_+/3+2*(z-v)_+/3+(z-Z)_+/3
      -(z-V)_+-(z-X)_+-(z-U-X)_+/5-(z-V-Z)_+/5.

At fixed U,Z, each of its V/X partial derivatives is>=1/3 while v<z,
and>=0 after v>=z. For example the V partial is
-2*1_{v<z}/3+1_{V<z}+1_{V+Z<z}/5. Integrating a monotone path from
V=X=0 proves

    K>=-4z/3+(2/15)*((z-U)_++(z-Z)_+)+min(v,z)/3.

Drop the positive remainder. The same J_2 cancellation still applies.
Over0<=v<=S, -7v/60+min(v,z)/3 has its minimum at0 or S. Replace
S by M=18/31, weakening the w, v and high-switch bounds. Since z<=1/5,
z/3-7M/60<=1/15-21/310=-1/930<0. Thus the full derivative is at least

    14t/15-16/15-3M/20-(2/3)*(t+M-2)_+.

This increases in t (slope14/15 or4/15); at t=13/10 it is277/4650>0.
At ties use one-sided derivatives; the proxy is continuous/C1 across the
switches. No actual-area monotonicity is asserted.

Both derivative certificates received independent hand PASS. Consequently
the SAME full positive-chart proxy is increasing throughout13/10<=t<7/4.
Combine its value at13/10 with the accepted low-t floor. The WHOLE
nonnegative LEFT chart now has G-(1+S/2)>=9271/2421720>0 for1<d<7/4.
Signed LEFT charts remain pending here, not discarded by this extension.

## Signed large-t coordinate reduction (submitted, not yet accepted)

After full p3=q, hold the original containing LEFT interval[0,a], attained
maximum a, q=a+d and RIGHT offsets fixed. If p4<a, raise p4 toward a.
The maximum stays attained at p5 or p6 until the endpoint. Thus the selected
inward correction (a-p6)^2/8 and original omitted-band loss T_d(a) stay fixed,
even if the actual minimum ceases to be0. Set t=q-p4, X=p4-p5, Z=p4-p6.

The exact derivative of the full coupled proxy in p4 is

    -1/2-X/2+f2'(t+V)+v3(t+U)+h,
    h=max(X_+,Z_+/2), v3(D)=f3'(D)+(3/2-D)_+/3.

For t>=13/10, all these cross arguments are>=13/10. Exact pair pieces give
f2'<=0 and v3<=17/120. In each active envelope branch h-X/2<=a/2:
the branches respectively give X/2, (Z-X)/2=(p5-p6)/2, or -X/2.
Therefore the full-proxy derivative is

    <=-43/120+a/2<=-43/120+9/31=-253/3720<0.

Raise p4 only until t=13/10 or p4=a. The latter gives the independently
closed positive LEFT chart t=d<7/4. The former needs a COMPLETE low-t
certificate valid also when the minimum of the original containing interval
is no longer attained. This source/path qualification is essential; the
Builder is supplying that extended low-t certificate. Without it, the
large-t reduction alone does not close the whole3+3 type.

## Final whole-scope acceptance and scientific STOP

The subsequently completed Builder Sections5-6 explicitly supply the missing
containing-interval low-t certificate. Main has read them completely and
independently checked their energy coefficients, signed comparisons, both
r-minimization regimes and rational square completions. Independent hand review
also accepted the WHOLE repaired certificate. Final source checkpoint files
were completed2026-10-11 07:44:56UTC, before the08:19:25UTC hard stop.
The terminal documentation was finalized later, without further mathematics.

The stronger11/54 envelope coefficient makes a middle endpoint derivative
slightly positive; its exact maximum excess13/55800 is NOT ignored. The
proved deficit epsilon=169/449363600 is subtracted from every affected
positive/signed low-t floor. The exact final weakest margin is

    mu=1897/3651800-169/449363600>499/1000000,
    G-(1+S/2)>=mu, D>=2mu>499/500000>0.

This closes ALL LEFT456/RIGHT123 in the committed d/S domain, every offset,
orientation, tie and switching/path-stop boundary. Together with retained
33 exclusions, all34 near-two-component label classes are excluded within
their existing dependencies. No one-bottom13/globalK6/generalKakeya closure,
formal kernel or external referee review, novelty, or A/B advantage is claimed.
Earlier pending statements in this development log are historical, not the
final status. Scientific work STOPPED on scoped acceptance. Main mathematical
subprocesses0; aggregate Main/Builder/critic processes0 and time0s. No new
research target or unused allowance is automatically authorized.
