# TIP116 R9 continuation — independent all-core critic

Status: PARTIAL; the all-real inequality `H+mu>=40/31` remains OPEN.
Direct owner continuation observed13:09:49UTC, following the frozen R9
exact-elimination first stage. Original derivation cutoff13:43:24UTC and
hardstop13:53:24UTC are retained; no clock or grant reset. Mathematical
subprocesses0. Only this new scoped note is edited.

The complete exact-elimination result is a prerequisite, not the missing
joint value bound. Arbitrary five-core apices remain in scope, including
all contact and zero-overlap faces; the core is not restricted to a K5
minimizer. Vibecode scope/completion discipline is used, not as mathematical
evidence.

## 1. A precisely limited proper-subunion obstruction

Suppose a proposed universal pointwise lower certificate consists only of
nonnegative geometry-independent weights `w_S(t)` on nonempty PROPER
subunion indicators, with

    sum_S w_S(t) 1_(union_(j in S) I_j(t))(x)
        <= 1_(union_(j=1..6) I_j(t))(x).

Height-dependent weights are allowed. At any fixed positive height one
can choose real apices so all six intervals contain the same point.
Consequently `sum_S w_S(t)<=1` is necessary for universality.

At the accepted sharp placement

    A*=(0,25,36,70,81,106)/31,

all six intervals are disjoint for `0<t<11/62`. Every adjacent apex gap
is at least11/31, so a label-distance-m pair cannot overlap before
`11m/[31(m+1)]>=11/62`. Each proper subunion therefore has length at
most5t there, while the full union has length6t. On all other heights the
weighted subunion length is at most the full union length. Thus the
integrated certificate is at most

    40/31 - integral_0^(11/62) t dt = 40/31 - 121/7688.

Separately valid lower bounds on those weighted proper-subunion areas
cannot overcome this strict loss. This excludes this SPECIFIC universal
nonnegative proper-subunion mechanism, not signed weights, geometry-
dependent weights, exact overlap corrections, or integral inequalities.
It is not a K6 counterexample or a whole-route impossibility theorem.

## 2. Exact overlap bookkeeping, not a fixed-tree substitution

At a fixed height, equal-length intervals admit the exact identity

    full union length = 6t - maximum_spanning_tree(sum edge overlap).

The spatially sorted neighbor path realizes the maximum; thresholding
the overlap weights gives the same connected components as that path.
But integrating a timewise maximum is not the maximum of integrated
fixed-tree weights. In particular the fixed adjacent-tree upper bound
5/3 does not establish the required dynamic bound53/31. Spatial neighbor
switching and all actual contact contributions remain unpaid.

I also checked the fourth-order Bonferroni lower expression, retaining
its status as a lower expression rather than the actual union. For the
symbolic placement `A_j=4j/5`, j1..6, it integrates to84/125, below40/31,
although the actual area is7/5. For a subset with extreme label span m,
intersection length is `(t-m*|4/5-t|)_+`; its integral is the same span-m
pair lens `L_m`. The combined pair/triple/quadruple coefficient is
`-1+(m-1)-choose(m-1,2)`, yielding

    3 - 5L_1 - 2L_4 - 3L_5,
    L_1=8/25, L_4=41/250, L_5=2/15.

This only demonstrates that truncating the exact intersection correction
at order4 is insufficient. An initial message incorrectly said the sharp
witness has multiplicity at most4. That assertion is WITHDRAWN: all six
sharp intervals intersect near t=7/10. No such multiplicity restriction
is used here. Quintuple and sixfold terms must be retained.

## 3. Independent literal check of Builder's sufficient scalar route

FULL `BUILDER_GLOBAL_AFTER_ELIMINATION_20261012.md` was read in this
continuation. I independently checked its direct first-five hull/gap
calculation at the accepted sharp apices. In height y=31t, the upper
envelope integrals total3517/4, the lower total-2887/4, hence hull1601.
The four actual prefix-gap integrals are311/2,121/4,271,121/4, totaling487.
Thus `H=1114/961` and `epsilon=H-70/61=684/58621>0`.

Under the conditional internal K5 baseline, the proposed uniform scalar
calibration `mu>=c-a*epsilon`, `c=270/1891`, is sufficient for the sharp
floor when0<=a<1. But the feasible sixth apex has marginal126/961,
so `mu<=126/961=c-epsilon<c-a*epsilon`. This refutes every such slope;
insertion optimality is not assumed. It is not a K6 counterexample.
At a=1 the proposed statement is precisely the original open target;
the failure gives no obstruction to a shape-dependent exact calibration.

Builder's sheared fan expression also checks: the m-th exterior interval
is `[-d_m+m*t,-d_m+(m+1)*t]`. For d_m>=0 its escaping width is
`min(t,m*abs(t-d_m/m))`, on the left before d_m/m and on the right after.
This is a SINGLE interval's escaping width, not the union of the five
escaping pieces; same-side overlap and genuine gaps cannot be dropped.

## 4. Selected ALL-real integrated-exchange predicate is false

Parent proposed testing whether swapping ANY adjacent inverted apex pair
never increases the integrated actual union for six triangles. Unlike the
older pointwise controls, the following is an exact INTEGRATED counter to
that bare all-real predicate:

    A=(16/7,16/7,14/3,4,134/21,134/21).

Swap only A3 and A4. Here u=A3-A4=2/3. The union of triangles1/2 is one
interval of width2t, and likewise triangles5/6. In the co-moving symmetric
frame centered at `c(t)=13/3-3t`, put `w=1/3`, `D=43/21=12/7+w`.
The two exterior fan intervals are

    [-D+t,-D+3t], [D-3t,D-t].

The original inverted pair is `[-w-t,-w]` and `[w,w+t]`. The swapped pair
has positive-half interval `[w-t,w]` when t<w, `[0,w]` when w<=t<=2w,
and `[0,t-w]` afterward; negative halves are reflections. Let old(t) and
new(t) denote the ACTUAL union lengths in the positive half-plane, including
all fan/pair overlaps. Direct endpoint comparison gives

    old(t)=3t                         on[0,3/7],
           12/7-t                     on[3/7,4/7],
           2t                         on[4/7,D/3],
           D-t                        on[D/3,6/7],
           w+t                        on[6/7,1];

    new(t)=3t                         on[0,w],
           2t+w                       on[w,4/7],
           D-t                        on[4/7,1].

These are union lengths, not sums of individual escaped widths. For
example exterior fans merge at D/3, and old pair containment switches at
3/7,4/7,6/7. New fan/pair contact occurs at4/7, within its central merged
phase; its eventual positive endpoint t-w stays below D-t for t<=1.
The physical branch ordering is w<3/7<4/7<D/3<6/7<1.

Integrating these actual lengths gives

    (G_swapped-G_original)/2
      = -(3/7-w)^2/2 +(w/7-3/98)+w^2/6-1/49
      = -1/7+4w/7-w^2/3 = 2/189.

Thus the full area INCREASES by4/189. The old bottom left endpoints are
`(9/7,2/7,5/3,0,29/21,8/21)`. Their largest sorted gap is19/21<1, so the
bottom union is strictly connected. However its range r=5/3 exceeds49/31,
and exterior adjacent coapexes also violate full competing-minimum filters.
It does NOT refute an exchange claim restricted to retained actual minima,
does not refute K6, and does not establish a subfamily value result.

For exact domain comparison, take the whole symbolic fan family

    A=(16/7,16/7,4+2w,4,40/7+2w,40/7+2w),
    2/7<=w<=1/3, r=1+2w, D=12/7+w.

The same union formulas and integral expression hold throughout that
interval. At w=2/7 some branch endpoints coincide; their zero-length
pieces cause no omission. The bottom range is r; its largest sorted gap
is11/7-2w, so bottom connectedness is strict precisely when w>2/7.
The exchange difference changes sign at

    w0=(6-sqrt(15))/7,
    r0=(19-2sqrt(15))/7.

It is positive for w>w0 within this family. However `w0>9/31` exactly:
this is equivalent to123>31sqrt(15), whose squares differ by714>0.
Hence `r0>49/31`. On the family's retained range
`2/7<=w<=9/31`, the half-difference is strictly negative. Its derivative
is4/7-2w/3>0 there, and at w=9/31 it is-34/6727, so the full exchange
difference is at most-68/6727. This exact family therefore does NOT
defeat the minimum-aware retained-range exchange proposal. Its exterior
coapexes also remain excluded from full-minimum hypotheses.

The selected universal ALL-real exchange mechanism alone is unavailable.

### 4.1 The same two-fan mechanism also defeats geometry-only retained exchange

Allow the exterior fan separation D to vary rather than tying D-w to12/7.
The following exact actual-union calculation directly tests the SAME
selected exchange predicate, now inside its retained range bound:

    A=(44/21,44/21,32/7,4,136/21,136/21),
    w=2/7, D=46/21, d=D-w=40/21,
    c(t)=30/7-3t.

The original positive-half union has exactly

    3t       on[0,10/21=d/4],
    d-t      on[10/21,40/63=d/3],
    2t       on[40/63,46/63=D/3],
    D-t      on[46/63,20/21=d/2],
    w+t      on[20/21,1].

For the swapped pair, its central interval passes the t=2w switch BEFORE
it meets the positive exterior fan. Consequently the actual new union is

    3t       on[0,6/21=w],
    2t+w     on[6/21,12/21=2w],
    3t-w     on[12/21,13/21=(d+2w)/4],
    D-t      on[13/21,1].

Every piece is an actual union, not an upper proxy. The old half integral
is921/882 and the new is923/882. Hence

    G_old=921/441=307/147,
    G_swapped=923/441,
    G_swapped-G_old=2/441>0.

The bottom left endpoints are
`(23/21,2/21,33/21,0,31/21,10/21)`. Their sorted gaps are2/21,8/21,13/21,
8/21,2/21, so bottom connectedness is strict. Their range is11/7<49/31.
Nonadjacent apex order is retained, and the only positive adjacent apex
inversion is the selected central pair. The exterior adjacent apex ties
are permitted geometric faces, but exclude this configuration from a
whole-six minimum by the frozen direct coapex descent. Its area also
exceeds the sharp witness. Thus this is NOT a retained ACTUAL-MINIMUM
counterexample or K6 counterexample. It refutes only integrated exchange
under range/connectedness/apex-order geometry alone. A minimum-aware
proof must use additional full optimality, not merely those filters.

### 4.2 Consequence for the frozen R4 geometric averaged predicate(P)

FULL frozen R4 Main section1 and Builder section2 were reread for this
logical scope check; their exact identity is
`G_old-G_swap=integral_B S-Ru`, with `Ru<=3u^2/4`.
For4.1, u=4/7 and r=11/7. The geometric(P) would require

    integral_B S >=u(5-r)/12+u^2/3=40/147=120/441.

But the actual gain is-2/441 and `Ru<=12/49=108/441`, so

    integral_B S<=106/441.

Thus(P) is refuted on its GEOMETRY-ONLY declared domain by a margin at
least14/441=2/63. This is stronger than merely refuting its old movable-V
proof premise, which left(P) pending. Frozen predecessor bytes are not
changed; this new note records the new scoped verdict chronologically.

The failure is not a contact-tie artifact. Set epsilon=1/100000 and use

    A_epsilon=(44/21-epsilon,44/21+epsilon,32/7,4,
               136/21-epsilon,136/21+epsilon).

The pair and hence u remain unchanged; bottom minimum0 and maximum11/7
remain labels4 and3. Sorted bottom gaps remain strictly below1. All
apices are distinct, with strict word(1,2,4,3,5,6), and nonadjacent apex
comparisons remain natural. A translated interval has symmetric-difference
length at most2epsilon at each height. Four changed triangles therefore
change either full union area by at most8epsilon; the difference of the
two areas changes by at most16epsilon. Consequently

    G_swapped,e - G_old,e >=2/441-16epsilon>0,
    (P)'s violated margin >=2/63-16epsilon>0.

The strict perturbed geometry is still not claimed stationary or a
global minimum. Neither(P) restricted to actual competing minima, the
exact(T) identity, nor K6 is refuted. Main independently checked the4.1
actual branch integrals and this consequence before acceptance; the old
half integral307/294 equals921/882 used above.

## 5. Prospective whole-minimum profile coupling: sufficient but unproved

Builder proposed this genuinely sufficient conditional exclusion. For an
adjacent inverted pair with original apices a>b, let O be the actual union
of the other four triangles, and `f_i(z)` be the i-th triangle's area
outside O. At a true whole-six global minimum, the old inverted pair is
disjoint, and each old coordinate globally minimizes its individual
profile. Indeed any trial coordinate gives full area at most the sum of
its profile and the unchanged other profile; global minimality forces
`f_i(a)<=f_i(z)`, and similarly `f_(i+1)(b)<=f_(i+1)(z)`.

If the FULL hypotheses forced

    f_i(b)+f_(i+1)(a) <= f_i(a)+f_(i+1)(b),

both nonnegative individual swap costs would vanish. Then a is a common
profile argmin. Putting both adjacent triangles at apex a has the exact
old area: at coapex the two triangles share only their common boundary,
so their profile areas add once. This would produce another whole-six
global minimum with an adjacent coapex, contradicting the frozen direct
coapex descent.

An initial critic message imposed an unnecessary extra coapex-exclusion
premise; that requirement is WITHDRAWN after Builder's exact correction.
In this selected INVERSE context, r<2 already gives exterior-apex
distinctness at a and b. An exterior i-1 at a would imply
`p_(i-1)-p_(i+1)=2+u>r`; an exterior i+2 at b is symmetric. Other exterior
labels have distance>=2 and cannot share those apices under r<2.
The conditional implication is consequently valid without that extra
premise. But the whole-six profile-Monge comparison has NOT been
proved and Parent/Builder are not adopting it as a stronger surrogate.
Actual global minimality of the swapped placement instead gives
only a LOWER bound on the sum of profile swap costs by its outside-O
self-overlap. That direction does not force the two costs to vanish.
Endpoint-only stationary controls are not counterexamples under the full
global-minimum hypotheses. No whole inversion is excluded by this logic
without its missing quantitative premise.

## 6. Current exact gap

The two-ray insertion formula and exact finite candidates do not yet
bound the insertion maximum jointly with core area. No sufficient signed
or geometry-dependent calibration has been derived or accepted. No
whole-core value domain or positive-inversion competing-minimum class
has been excluded by this continuation so far.

The direct exterior-union attempt retains the same real fan offsets on
both sides of the fixed sixth strip. Separate one-fan escaping widths,
or the maximum of those widths, do not retain all detached gaps and
same-side overlap. I have no justified aggregate comparison yielding
49/62. The finite exact insertion operator is consequently still an
exact reduction rather than a value certificate.

Observed continuation clock13:10:29UTC; full skill/reference reread
completed13:10:41UTC. Frozen first-stage critic derivation STOP13:05:03
is preserved; this continuation is authorized by the later direct owner
request, not an automatic continuation or ceiling reset.

## 7. Completion and literal-review ledger

Critic NEW DERIVATION STOP observed13:33:54UTC following Parent's routing
after the selected geometry-only exchange/(P) failure was independently
checked. This is an early scoped route failure, not original cap exhaustion,
not a failure of the full actual-minimum hypothesis, and not a K6 result.
No further mathematical derivation follows that stop. Original cutoff
13:43:24UTC and hardstop13:53:24UTC remain in force.

Accepted scope is the limited proper-subunion obstruction, actual scalar
calibration failure, exact integrated-exchange counters with their domain
distinctions, and the geometry-only(P) refutation including strict geometry.
The profile-coupling conditional implication is sound but its premise is
unproved and not adopted as a replacement target. Exterior-union and
dynamic-tree formulations are exact; no lower value bound follows here.

ZERO whole competing-minimum/inverted-domain closures; ZERO sharp-bound
or whole-proof assembly completion. All twelve positive-inversion continua
under genuine full-minimum conditions, required faces, and remaining
whole-proof dependencies are still OPEN. None of the geometric witnesses
is a K6 counterexample or a claimed stationary/global minimum.

FULL Main continuation note literal review completed at observed13:34:06UTC:
its exact exterior intervals, dynamic overlap identity, scalar/counter
scope and current zero-closure wording checked without blocking correction.
That initial checkpoint did not include its later append or report.
FULL final Main note, including section4.1 and observed Main stop13:34:09,
and FULL bilingual final report were then read at observed13:35:15UTC.
All exact scopes, area values, the geometric(P) failure, strictification,
zero-closure wording and separate stop times checked without blocking
correction. Builder explicitly reported his independent literal review
13:33:55 and observed stop13:32:49; those were not inferred from agreement.
FULL final Builder note, including sections6–7, was read at observed
13:35:40UTC and accepted at its stated geometric-failure/zero-root scope.
Its independent review attribution and final resource ledger are consistent.

Mathematical subprocesses/seconds/failed starts:0/0/0. No code, samples,
enumeration, LP, optimizer, replay, infrastructure, new agent, UI/API/Git
mutation, build/install or scratch copy. One ordinary apply_patch context
failure at13:22:18 was repaired after reading the note tail; it was not a
mathematical subprocess start. No material deletion or cleanup occurred.
All frozen predecessor bytes remained untouched by this critic.

EN: Exact elimination and the new failed geometric certificates do not
prove the all-core bound. The quantitative whole-minimum comparison is
still missing; K6 remains OPEN.

VI: Khử biến chính xác và phản ví dụ cho chứng chỉ hình học không khép
bất đẳng thức mọi lõi. So sánh định lượng dưới đầy đủ giả thiết cực tiểu
vẫn thiếu; K6 còn OPEN. Không công nhận mốc khép toàn miền mới.
