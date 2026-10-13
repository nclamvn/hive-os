# TIP108E critical coupling: hand notes

R1 remains OPEN. The two canonical continuous types are LEFT456/RIGHT123 and
LEFT56/RIGHT1234, with the reflected second type retained. Earlier31 label
classes stay excluded under their proof dependencies. No global K6 closure is
claimed. This note concerns actual interaction, not a collection of samples.

## Prescribed Q244 implication refutation

Main prescribed ONE point, independently checked before execution:

    p=(50,32,50,32,0,0)/31,
    LEFT56, RIGHT1234, a0, b18/31, d32/31, bottomgap1/31.

Thus it lies in the retained domain. Q244's full potential wedge total is
`1-b/2+3b^2/4`; its linear term is `(q-b)/2`, and its hinge-minus-forward-gap
term is `(3-2(q+b))/8`, since1<q+b<2. Consequently

    Q244_before_highpairs=11/8+q/4-b/4-3b^2/4
                         =9495/7688=40/31-425/7688.

The authorized ONE exact run gives full Q244129073/115320, below target by
19727/115320. Both immutable area algorithms agree on

    F=85789/345960, G=85789/57660, actualD=11389/28830>0.

This REFUTES the lower-functional target, not the defect theorem. No smaller
global witness, optimizer or second point was used.

## Which positive terms the shortcut loses

At that same point the right group has relative offsets(b,0,b,0). Its actual
slice hull has integrated area `2-b+b^2`. Only the potential gap2->3 can be
false. It opens at `y0=(1-b)/2`. Triangles1,4 bridge its left/right edges until
y=b. They cover the entire gap until `h=(1+b)/4`, and then the two disjoint
edge pieces have length b-y each. Their UNION correction, not a sum counted
twice, has area

    integral_y0^h (b-1+2y)dy + integral_h^b 2(b-y)dy
      =(3b-1)^2/8=529/7688.

The other potential gaps open only after y=(1+b)/2>b, when all starts have
their label order; they are actual holes. Hence the right group's actual area
is8555/7688, whereas hull-minus-all-wedges is4013/3844.
This positive group correction CANNOT just be added to a whole-union bound:
the left pair covers part of it. The required correction is its portion outside
the other ACTUAL union, or an equivalent exact hole-intersection identity.

The stronger retained actual-hull half-height bound also passes THIS point.
Below height1/2 the group hulls are

    H_L=[5y,1+5y],
    H_R=[q+2y,q+b+1+2y].

Their intersection opens at1/93 and becomes the full left hull at32/93; its
integral is10/31. Total group-hull area2649/961 minus total wedges925/961,
minus this low intersection and the exact high-pair sum1669/14415, gives

    Q_half_actual=19541/14415=40/31+941/14415.

This is hand arithmetic using the SAME prescribed point and the saved pair
integrals, not a second mathematical process. It is NOT a universal calibration.
Similarly the shadow union at this point has loss from actual G at most the
false-hole correction529/7688, so it is at least163643/115320, above target.
Neither stronger function is refuted by the Q244 diagnostic.

## Exact interaction identities retained

For actual group unions U_A,U_B, slice hulls K_A,K_B and actual holes
H_A=K_A\U_A, H_B=K_B\U_B, the exact union length is

    |K_A union K_B|-|H_A\K_B|-|H_B\K_A|-|H_A intersect H_B|.

Replacing H by potential adjacent-gap unions W gives the valid SHADOW bound

    |(K_A\W_A) union (K_B\W_B)| <= |U_A union U_B|.

It retains clipped holes and their cross intersection; subtracting W_A+W_B
independently is weaker and cannot inherit its possible target strength.
Another valid pair of one-sided lower functions is

    G >= G_A + area(U_B\K_A),
    G >= G_B + area(U_A\K_B).

Actual G_A/G_B here must not be replaced by separately attained minima while
maximizing cross coverage independently. Their endpoint hulls and interior
energies are part of the same configuration.

## Small-span structure within the CURRENT critical scope

Every group in the two critical types has consecutive labels. For such a group,
if its offset range s<=1/3, every positive adjacent potential gap is an ACTUAL
hole (up to zero-area endpoint touching). A gap opens only for
`y>(1-delta)/2 >=(1-s)/2`. A third member d labels below can enter it only if
its right endpoint exceeds the lower generating member's right endpoint,
requiring `y<s/d`; a member d labels above analogously needs y<s/d. Both
conditions require `s>d/(d+2)>=1/3`. Therefore no positive bridge exists at
s<=1/3. This claim is NOT extended to nonconsecutive target gaps.

Since a+b<=18/31, at least one span is<=9/31<1/3. Thus false-gap corrections
can arise in at most ONE group. The other group's holes are exactly its
potential wedges. This narrows the interaction but does not itself bound the
large-group false-hole area outside the opposite actual union.

## Endpoint-retaining proper4 refinement

For actual right endpoint drop Delta=p4-p1 and span b, the proved proper4
envelope inequality E<=4B+2h-1 gives the stronger endpoint-retaining bound

    G_R4 >=5/4+Delta*(1-b)/2-b^2/4
          =[5/4-b/2+b^2/4]+(b+Delta)*(1-b)/2.

This is stronger unless p1 is the maximum and p4 the minimum. It keeps one
endpoint-visibility cost, but it does not constrain whether interior member2
can attain the group's minimum without paying extra envelope/bridge energy.
A coarse bounding box for the right hull still loses precisely that coupling.

For a three-member consecutive group, the analogous valid refinement is

    G3>=1+Delta*(1-s)/2-s^2/8
       =[1-s/2+3s^2/8]+(s+Delta)*(1-s)/2.

Here Delta is last offset minus first. Normalize offsets to `(A,t,C)` with
range1, `E=(A-t)^2+(t-C)^2`, `h=1+C-A`. The negative hull energy obeys
`E<=4B+2h-3/2`, as the following four extrema-position types (and reflected
copies) show. For `(1,t,0)`, the retained consecutive3 hull formulas give
`4B-E=E+1>=3/2`. For `(1,0,C)`, use `B_lower>=1/2` and
`B_upper>=(1-C)^2/4`, leaving a residual1/2. For `(0,1,C)`, use
`B_upper>=(1-C)^2/2`, leaving a residual `1/2+C^2`. Finally `(0,t,1)`
has `E<=2<=2h-3/2`. Substitution into the retained hull-minus-wedge group
formula gives the displayed endpoint-retaining refinement. Ties and s0 follow
by the same closed inequalities/continuity. This is a group bound, not a bound
on cross-group intersection.

## A whole endpoint-exclusive shortcut is false (Main hand refutation)

Removing endpoint1 or6 leaves five consecutive labels, so the retained K5
theorem yields `G>=70/61+max(E1,E6)`, where E denotes ACTUAL exclusive area
outside the other five. A proposed uniform endpoint floor exceeding270/1891
would close the target, but this implication is FALSE.
Main's hand counterexample is

    a=b=9/31, q=41/31,
    LEFT456 offsets(0,a,0), RIGHT123 offsets(q+b,q,q+b).

It has d32/31>1 and S18/31. Within its OWN right group, endpoint1's exclusive
slice length is `min(1-y,(y-b)_+)`; its integrated area is
`(1-b)^2/4=121/961`. Reflection gives the same own-group upper bound for
endpoint6. Adding the opposite group can only REDUCE exclusivity. Thus actual
`max(E1,E6)<=121/961<270/1891`. This is a hand refutation of the proposed
uniform auxiliary floor, NOT an area/defect counterexample. No process evaluated
this second hand configuration and no actual G is claimed for it.
The possibility of retaining a stronger ACTUAL five-member subset area instead
of the global K5 minimum is not refuted, but no such calibrated inequality is
established here.

## Safe outer-envelope correction still lacks a whole floor

Main proposed rigorously oriented improvements to the outer Q functions.
For LEFT56/RIGHT1234, every right upper-envelope expansion is exclusive of
the opposite actual hull below1/2: all left right endpoints are below the
right member4 baseline since d>1 and2y<=1. Every left lower-envelope expansion
below member5 is exclusive of the right hull up to1/4, since d>1 and4y<=1.
All group endpoint-envelope excess above1/2 may also be added, since the high
band uses separate group hulls minus all actual cross-pair caps. The broader
suggestion that ALL hull expansions are exclusive up to1/5 was retracted;
no such assertion is used.

These SAFE corrections alone still do not prove the whole floor. This can be
seen analytically, without another process, on

    a0, b18/31, p_R=(q+b,q,q+b,q), p_L=(0,0),
    1<q<44/31.

Then q<3/2 and q+b in(3/2,2). Write z=q+b. The exact high-pair sum is

    f2(q)+f2(z)+f3(q)+f3(z)+f4(z),
    f2(q)=-q^2/3+5q/6-11/24,
    f2(z)=(2-z)^2/6,
    f3(q)=(q-1)^2/8,
    f3(z)=(3-z)^2/24-(2-z)^2/4,
    f4(z)=(z-3/2)^2/10.

The other high pairs have zero area on this regime. Adding the safe full
right-upper energy b^2/2 and high-band right-lower energy(b-1/2)^2/2 gives

    Q_safe=47/30+3q^2/20-7(1+b)q/60-8b/15+23b^2/120.

At the q1 closure its target margin is-3/961. At the ADMISSIBLE exact value
q311/310 the margin is-15841/5766000. The scaled offsets are then
`(491,311,491,311,0,0)/310`, d311/310>1 and S18/31. No actual area or defect
was computed or claimed for this second HAND construction. This refutes only
the target floor for this particular safely-corrected lower function.

The missing lower-envelope expansion can be clipped more accurately against
the opposite hull. In this family below1/2 it is the interval
`[q+2y,q+b+y]`, while the left hull is `[5y,1+5y]`. Its contribution outside
the LEFT side of that hull is

    integral_0^(1/2) min((3y-q)_+,(b-y)_+) dy
      =(3b-q)_+^2/24-(b-1/2)_+^2/2

on this regime. It already exceeds the corrected-Q negative margin near q1;
there is also a RIGHT-side forward-gap-filling contribution. Thus this failure
does NOT refute actual-hull/shadow calibration. It shows why only pre-guaranteed
outer-exclusive envelope tails omit material common-q hole/gap coupling.
No family computation, offset navigation or branch collection followed it.

## Whole LEFT56/RIGHT1234 clipped lower-envelope correction

This HAND ingredient applies to arbitrary offsets of the whole critical 2+4
type, not only the preceding family. Gauge min(p5,p6)=0, max(p5,p6)=a.
Let t=p1-p2 and c=p1-a-1. All right offsets exceed a+1, so c>t;
c>0 and c<=(d+S-1)<44/31<2. The ACTUAL left hull lies in the box
`[5y,a+1+5y]`. When t>0, the right lower-envelope expansion below its
member1 baseline contains `Xi(y)=[p2+2y,p1+y]` for 0<y<t.

Xi's portion RIGHT of the enclosing left box has length
`min(t-y,(c-4y)_+)`. Since c>t, subtracting the missing triangular part from
the full Xi triangle gives the exact integrated value

    C_right=t^2/2-(4t-c)_+^2/24.

The last nonzero height is at most c/4<1/2, hence this entire contribution is
in the low band where it is exclusive of the opposite ACTUAL hull. Xi's
portion LEFT of the box has length `min((3y-p2)_+,(t-y)_+)`, with opening
p2/3, crossing p1/4 and closing t. Its full integrated area is

    C_left=(3t-p2)_+^2/24.

The two portions are disjoint. The high-band portion of C_left is contained
in the right lower-envelope excess that already enters the separate-hulls
high-band lower bound. Therefore the valid aggregate replacement is

    C2=t_+^2/2-(4t-c)_+^2/24+(3t-p2)_+^2/24.

For t<=0 all three terms vanish. C2 REPLACES, and must NOT be added alongside,
the right lower-envelope high-band energy. A valid improved Q244 adds C2,
the full right UPPER-envelope energy (safe below1/2 and counted above1/2),
other high-band envelope energies, and the safe low left-lower energy.
This is a clipped actual envelope expansion outside an enclosing opposite
hull, not an unconditionally added in-group false-gap correction. The
potential-wedge subtractions and high cross-pair subtractions remain present.

For the hand zigzag family t=b,c=q+b-1,p2=q, C2 simplifies to
`b^2/2-[(3b-q+1)_+^2-(3b-q)_+^2]/24`. On the previously used regime
3b>q, adding C2 and the full right-upper energy b^2/2 gives

    Q_coupled=7/5+3q^2/20-(2+7b)q/60-17b/60+23b^2/120.

This repairs that particular corrected-functional failure. It is NOT a
proof that the same whole-domain lower function exceeds its target for
arbitrary p3,p4,p5,p6. No endpoint reduction or convexity of the complete
coupled expression is inferred. Main's hand review accepted the correction
orientation, explicitly requiring replacement rather than double addition.
Independent critic subsequently accepted this orientation and corrected the
strictness: c can equal d+S-1, for instance a0 and p1 at the right maximum.
The final strict bound c<44/31, required for the low-band localization, remains
valid. This dated correction changes no claimed inequality or process count.

## General clipped lower correction and a licensed functional reduction

For RIGHT member j=2,3,4, put k=j-1 and t=p1-pj. The same box clipping
argument gives a safe replacement candidate

    C_j=t_+^2/(2k)-(4t-kc)_+^2/[8k(4-k)]
                   +((4-k)t-kpj)_+^2/[8k(4-k)].

The first two terms integrate the portion right of the opposite enclosing box;
the last integrates its portion left of that box. Localization and replacing,
not double-adding, the high right-lower envelope have the same proof as C2.
Each candidate is valid, so their maximum is valid. Because c>t whenever t>0,
the first two terms alone are at least t^2/8. Choosing j at the right minimum
q (or using0 when p1=q) yields the useful entire-domain correction

    C_lower >= (p1-q)^2/8.

The full right upper-envelope energy is at least

    M=max((p1-p4)_+^2/6,(p2-p4)_+^2/4,(p3-p4)_+^2/2).

Consequently the universally valid proxy

    Q_proxy=Q244+(p1-q)^2/8+M

discards all other available envelope corrections but retains the same q,
all six offsets, potential wedges and exact high-pair functions. The two added
energies account for different lower/upper envelope sides, so are not counted
twice. This does NOT establish the target floor for Q_proxy.

One genuine reduction for THIS lower functional, not for the actual union, is
available. Fix q,p1,p2,p3,p5,p6 and move p4 down toward q. In each of M's
three branches, the p4 derivative of Q_proxy is at least1/3-b/2>0. Indeed
Q244 contributes

    1-(1+p4-p3)/2-f2'(p4-p6),

and f2'(D)<=1/6 for D>1. The three possible derivatives of M are respectively
`-(p1-p4)_+/3`, `-(p2-p4)_+/2`, `-(p3-p4)_+`. Substitution, using the
common right range b, gives the displayed lower derivative bound in every
active branch. The bound extends through M's switches by continuity and
one-sided derivatives. Hence p4=q minimizes this proxy when the other
variables and their containing span box are fixed. Lowering p4 keeps every
offset in that box, so this is a licensed minimization of a relaxed functional;
it does NOT assert that true area is minimized at p4=q.

After this reduction, let A=p1-q, B=p2-q, C=p3-q, k0=q-p5 and ell=q-p6.
With a=abs(p6-p5), the exact proxy is

    1+k0/2-a^2/4
    -[(B-A)^2+(C-B)^2+C^2]/4
    +(2-k0-A)_+^2/8-(ell+A-1)^2/8+A^2/8
    +max(A^2/6,B^2/4,C^2/2)
    -f2(k0+C)-f2(ell)-f3(k0+B)-f3(ell+C)
    -f4(k0+A)-f4(ell+B)-f5(ell+A).

Here min(k0,ell)=d>1, abs(k0-ell)=a, and A,B,C lie in[0,b]. This retains
the common-gap coupling explicitly. Its remaining calibrated minimum is
UNPROVED. In particular the positive p3 curvature after wedge/upper-energy
cancellation prevents an endpoint-only reduction. Concavity of the sum of
high-pair functions when ALL their arguments move together does not imply
concavity when A,B,C move separately. No branch enumeration or computed
minimization was performed for this proxy.

### Further licensed reductions for a deliberately weaker proxy

Drop the member2 upper-envelope candidate, retaining
`M2=max((p1-p4)_+^2/6,(p3-p4)_+^2/2)`. The p4 derivative proof still applies.
After p4=q the only B dependence is

    -[(B-A)^2+(C-B)^2]/4-f3(k0+B)-f4(ell+B).

Its second derivative is at most `-1+5/12+3/10=-17/60<0`, using the exact
high-band pieces below D5/2. All seams are C1. Thus B=0 or b minimizes this
weaker lower functional over the entire containing B interval.

For B=0, A=b minimizes the functional. One whole-domain derivative bound is
`-(1-a)/4+A/12+4/155<0`: the low hinge contributes at most-(1-a)/4,
wedges plus lower correction contribute-A/4, the M2 derivative is at mostA/3,
and f4'(D)>=-4/155, f5'(D)>=0 for D<75/31. Using a+A<=18/31 proves the
strict sign. Main supplied a simpler bound after the valid far-gap pruning
d<5/3: all cross D<5/3+18/31<7/3, so f4',f5'>=0, and the derivative is
at most `-A/6-(ell-1)/4<0`. Either argument licenses the lower-functional
reduction without an assumption about the true minimizer.

For B=b, weaken M2 further to C^2/2. Then the A second derivative is

    -1/2+(1/4)*1_{k0+A<2}-f4''(k0+A)-f5''(ell+A).

It is strictly negative on all pieces: at most-1/4 below D3/2, at most-9/20
between D3/2 and2, and at most-1/5 above2. Again all seams are C1. Thus A=0
or b minimizes this deliberately weaker functional. The original maximum
M2 need NOT be concave, and no such assertion is used.

These reductions retain three COMPLETE lower-functional endpoint branches:
B0/Ab with M2, Bb/A0 with C energy, and Bb/Ab with C energy. Arbitrary
C,d,a,b and both left orientations remain. They are not a selected collection
of actual geometries, nor a proof that true-area minima are on those faces.

### Complete C elimination inequalities

The high-band sum obeys `f2(D)+f3(D)<=3/40` for D>1 in the retained range:
on D=1+x through3/2 it is `1/24+x/6-5x^2/24`, maximized at x2/5;
the remaining pieces are decreasing and do not exceed that value.
Also `abs(f3')<=1/8`, and the separate maxima are f2<=1/16,f3<=1/20.
Consequently, for abs(k0-ell)=a,

    f2(k0+C)+f3(ell+C)<=min(3/40+a/8,9/80).

For B0/Ab, dropping the nonnegative remaining upper-energy surplus gives the
ENTIRE-C lower bound

    1+k0/2-a^2/4-b^2/8
    +(2-k0-b)_+^2/8-(ell+b-1)^2/8
    -f2(ell)-f3(k0)-f4(k0+b)-f4(ell)-f5(ell+b)
    -min(3/40+a/8,9/80).

For the two Bb branches, their C dependent part is
`b*C/2-f2(k0+C)-f3(ell+C)`. Its derivative is bounded below by
`b/2-1/6-a/4`. For ell=k0+a this follows from f3''<=1/4 and the
common-argument derivative bound `(f2+f3)'<=1/6`. For ell=k0-a, put
x=ell+C>1. If x+a<3/2, f2'(x+a)<=f2'(x), giving the same1/6 bound;
if x+a>=3/2, f2'(x+a)<=0 and f3'(x)<=1/8. Thus the entire C interval
can be eliminated at a loss of at most

    m(a,b)=b*(1/6+a/4-b/2)_+.

This establishes scalar continuous lower functions, not their target floors.
The common d, the two left orientations, arbitrary a+b<=18/31 and their
hinge boundaries STILL require calibrated inequalities. In particular neither
the passing a0/C0 phase nor a presumed transfer of all span to b licenses a
whole-domain conclusion.

## Withdrawn loose-pair hand idea

Builder briefly proposed a51/40 floor from triangles1,4,5 by using flat-base
pair intersections as universal caps. This was immediately withdrawn before
any execution or proof claim: the generic pair maximum for label gap r is
1/(r+2), not1/[2(r+1)]. With internal pair1/4 cap1/5 and separated cross
pair1/5 cap3/20, this elementary route gives only23/20. It closes no retained
critical domain. The failure is preserved here; it is not a new search route.

## Ledger and current status

ONE authorized mathematical process: fixed_q244_control.py, actual internal
0.005862833990249783s, conservativecharge3s/75; failures0. No additional point,
functional numerical check, optimization, box generation or old-source edit.
The small-span and endpoint-refinement lemmas are HAND ingredients proposed
for independent challenge, not closure of the whole critical types.

Tiếng Việt: Q244 đã bị bác bỏ tại một điểm hợp lệ nhưng D thực tế vẫn dương.
Các hàm cận mạnh hơn có tương tác khe hở tại chính điểm đó không bị bác bỏ;
chưa chứng minh chúng đạt cận trên toàn hai kiểu liên tục còn lại.

## Subsequent scoped closure and terminal residual

The later B0_SCALAR_CALIBRATION.md and Main's B=b scalar proof, including the
corrected SEMIconcavity argument rather than the withdrawn concavity sign,
received independent hand PASS. They close WHOLE critical2+4 and its4+2
reflection with D>=959/180000. Earlier pending statements above are retained
as dated proof-development history, not current claims that2+4 is still open.

The3+3 type remains OPEN. Main's valid coupled clipping proxy retains every
offset, common q, actual spans and the omitted middle-band charge T(s).
No whole target floor was obtained here for its arbitrary signed left extrema
and cross-hole coupling. A proposed small-group coordinate reduction or
semiconcavity error does not prove a sufficient lower floor. No new point,
optimizer, branch collection or mathematical process was used to replace that
missing implication. Global finite K6 and the separate one-bottom domain also
remain OPEN. Scientific work stopped on this named remaining calibration gap,
not on budget exhaustion or a proof of impossibility.
