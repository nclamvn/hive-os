# TIP116 R9 global continuation — actual coupled bound attempt

Status: FINAL PARTIAL; whole H+mu>=40/31 remains OPEN. Scalar and
geometry-only sufficient routes are refuted below, not the exact coupled
target or any implication under full competing-minimum hypotheses.

Owner continuation observed2026-10-12 13:09:49 UTC. Original R9
activation12:53:24, derivation cutoff13:43:24 and hardstop13:53:24 are
unchanged. Math subprocess grant0. Earlier R9 elimination and completion
are frozen. Only this new own note is writable for this continuation.

## 1. Exact target and proposed sufficient scalar tradeoff

Use the independently accepted all-core elimination notation

    H(A)=area of the actual five-triangle core in scaled coordinates,
    mu(A)=min_z area of triangle6 outside that core.

The required theorem is H+mu>=40/31 for EVERY real core. If the corrected
conditional internal K5 chain is invoked, let

    H0=70/61, epsilon=H-H0>=0, c=270/1891.

The exact target is epsilon+mu>=c. I examined the sufficient calibration

    (T_a) mu>=c-a*epsilon, for a constant0<=a<1.

It would imply H+mu>=40/31+(1-a)*epsilon>=40/31. The epsilon coefficient
therefore has a genuine quantitative role; this is not merely a necessary
stationary condition. Nevertheless EVERY such slope is impossible, as
shown by the exact sharp six-placement. At a=1 the proposed inequality is
the original unproved coupled target itself. Slopes a>1 do not alone imply
the target from epsilon>=0. No restriction to K5-optimal cores is used.

## 2. Exact first-five area at the retained sharp six-placement

Take the previously accepted sharp six apices

    (A1,...,A6)=(0,25,36,70,81,106)/31,
    G6=40/31.

The first-five area calculation here is direct. Put y=31*t, and multiply
horizontal lengths by31. The five integer-apex intervals are

    [a_j-j*y,a_j-(j-1)*y], (a1,...,a5)=(0,25,36,70,81),
    0<=y<=31.

Their area integral is divided by31^2=961 at the end. The actual upper
endpoint envelope has label chain5,4,2,1, with transition heights
11,45/2,25. Its integral is

    integral_0^11(81-4y)dy
      +integral_11^(45/2)(70-3y)dy
      +integral_(45/2)^25(25-y)dy =3517/4.

The actual lower envelope has chain1,3,5, with transitions18,45/2:

    integral_0^18(-y)dy
      +integral_18^(45/2)(36-3y)dy
      +integral_(45/2)^31(81-5y)dy =-2887/4.

Hence the full hull integral is1601. Because these FIVE apices are strictly
increasing, every actual uncovered component is a label-prefix gap. For
cut i its width is

    q_i(y)=[min_(a<=i<b)(a_b-a_a-(b-a+1)*y)]_+.

This is exact: max right endpoint of the prefix and min left endpoint of
the suffix define its separation; natural apex order prevents nonprefix
spatial holes. Direct comparison of these finitely listed affine distances
gives the following actual functions, with zero elsewhere:

    q1=25-2y on[0,11], 36-3y on[11,12];
    q2=11-2y on[0,11/2];
    q3=34-2y on[0,11], 56-4y on[11,14];
    q4=11-2y on[0,11/2].

Their integrals are respectively311/2,121/4,271,121/4, summing487.
The core union, not just its hull or pair approximation, consequently has

    H=(1601-487)/961=1114/961,
    epsilon=1114/961-70/61=684/58621>0.

This is a hand calculation, not a new sample/enumeration procedure or a
regional closure claim. It uses the retained exact sharp value only to
identify the sixth marginal below; no assumption that this core minimizes
K5 or that its actual sixth apex minimizes the insertion cost is made.

## 3. Exact failure of the scalar sufficient route, not K6

At the actual sixth placement A6=106/31 its marginal is

    G6-H=40/31-1114/961=126/961=c-epsilon.

Exact elimination permits a smaller insertion cost, hence

    mu<=126/961=c-epsilon<c-a*epsilon, for EVERY a<1.

Thus(T_a) is refuted even though it would be sufficient under the
conditional K5 baseline. This is not a K6 counterexample: the complete
six-placement has area exactly40/31, and the eliminated cost is not
asserted smaller. It also does not refute a=1 or any shape-dependent
calibration. Parent routing explicitly retains the actual coupled
exterior-union investigation after this scalar failure; no new timer or
grant is issued.

## 4. Active whole exterior formulation

For a fixed sixth apex, shear its interval to[0,t]. The other five
intervals can be written[-d_m+m*t,-d_m+(m+1)*t], m=1,...,5, with real d_m.
Their actual UNION outside[0,t] must have integrated area at least49/62;
this is exactly the sufficient all-core target, not a relaxed pair sum.

When d_m>=0, that interval contributes only on the left before t=d_m/m
and only on the right afterwards; its escaping width is
min(t,m*|t-d_m/m|). The widths cannot be added: same-side overlap, gaps,
and all original contact switches must remain. Negative and large d_m
are also included by the actual interval formula. No global lower bound
for the resulting joint two-sided union is established at this checkpoint.

## 5. Scope and resources

Required AGENTS/protocol/current active+h/o/new continuation scope and full
local Vibecode Kit plus TIP/report reference were reread. The skill governs
minimal scope, independent proof review and truthful completion only.
No mathematical subprocesses/seconds/failed starts:0/0/0. No arithmetic
code, sampling, chamber enumeration, optimizer, LP, UI/API/Git mutation,
build/install, infrastructure, new agent, asset, scratch copy or deletion.
This new note preserves the attempted sufficient calibration and exact
failure; no frozen predecessor is edited. Whole target remains OPEN.

## 6. Literal review of the retained-range geometric uncrossing failure

The critic derived and Main independently checked the ACTUAL configuration

    A=(44/21,44/21,32/7,4,136/21,136/21).

Swap ONLY A3 and A4. In the symmetric co-moving frame c(t)=30/7-3t,
put w=2/7,D=46/21,d=D-w=40/21. The two exterior fan intervals are
[-D+t,-D+3t] and[D-3t,D-t]; the old central pair is
[-w-t,-w] and[w,w+t]. Their actual positive-half union length is

    old(t)=3t       on[0,10/21],
           d-t      on[10/21,40/63],
           2t       on[40/63,46/63],
           D-t      on[46/63,20/21],
           w+t      on[20/21,1].

For the swapped pair, the positive central interval has length t before
w, length w on[w,2w], and length t-w after2w. The actual union is

    new(t)=3t       on[0,6/21],
           2t+w     on[6/21,12/21],
           3t-w     on[12/21,13/21],
           D-t      on[13/21,1].

Builder independently hand-checked the interval contacts and integrated
these already-saved pieces during literal review. Their half integrals
are921/882 and923/882; hence

    G_old=307/147, G_swap=923/441,
    G_swap-G_old=2/441>0.

The bottom starts are(23,2,33,0,31,10)/21. Their range is11/7<49/31;
sorted gaps are(2,8,13,8,2)/21, all strictly below1. The central3/4
inversion is the only positive adjacent inversion. Thus retained range
and strict bottom connectedness ALONE do not justify integrated sorting.
The original exterior coapexes and the high area exclude this point from
actual full-minimum hypotheses. No K6 counterexample is claimed.

There is also a direct consequence for the frozen R4 geometry-only(P).
Its accepted identity is

    G_old-G_swap=integral_B S-Ru, 0<=Ru<=3u^2/4.

Here u=4/7,r=11/7, so(P) would demand
integral_B S>=u(5-r)/12+u^2/3=120/441. But the actual negative gain
and Ru<=108/441 force integral_B S<=106/441. The geometric(P) fails
by at least2/63. This new verdict is recorded without changing any R4
or first-stage R9 byte. The old status(P) pending is superseded only for
its UNIVERSAL GEOMETRIC domain, not a minimum-aware restriction.

The contact ties are not responsible: perturb only the exterior apices
to(44/21-e,44/21+e,136/21-e,136/21+e), e=1/100000, leaving A3,A4.
The range and u stay unchanged, bottom gaps stay below1, and the apex
word(1,2,4,3,5,6) becomes strict. Four interval translations alter either
area by at most8e, hence the exchange gain by at most16e. Therefore
the increase remains at least2/441-16e>0, and the(P) violated margin is
at least2/63-16e>0. Still no full stationarity or minimum is asserted.

## 7. Final completion, review and stop

The scalar calibration calculation was FULL hand-checked by the critic;
its acceptance was received by the observed13:19:11 clock. The new
retained-range counter and(P) consequence were FULL literally read and
independently hand-checked by Builder at observed13:33:55. The Main and
critic notes had already been FULL read at13:32:56. These are review
times, not new route activation or new derivation after stop.

Builder NEW derivation STOP was observed13:32:49 after Main's first
closing routing on the definite failed geometric route. Original
13:43:24 cutoff/13:53:24 hardstop remain unchanged. No new variants,
computations or campaign follow. Only final literal review and recording.

No all-core H+mu floor, actual-minimum gain or minimum-aware(P) has been
proved or refuted. Same-side exterior gaps/overlap and finite profile
cost payment under all-six optimality remain unbounded at the required
constant. Every positive-inversion competing-minimum class and the whole
boundary/attainment assembly remain OPEN. Root closure in this global
continuation is ZERO. Earlier exact elimination remains valid and frozen.

Only this new note changed. Math subprocesses/seconds/failed starts0/0/0;
no code, sample, optimizer, LP, enumeration, replay, infrastructure,
UI/API/Git mutation, build/install, new agent, scratch copy or deletion.
Vibecode supplies only minimal scope/review/truthful reporting. No
automatic follow-up or enlargement of the original grant.

Builder FULL final Main note and bilingual report read observed13:35:46
agreed with the exact bounded-range counter, strict perturbation and(P)
margin, and with the explicit non-minimum/K6 distinction. This is literal
review only; the13:32:49 new-derivation stop is unchanged.
Independent critic FULL final sections1–7 read observed13:35:40 accepted
the exact scalar failure, counter/P consequence/strict perturbation and
scope/stop/resource record with no blocking correction. No global bound
or full-minimum exclusion was accepted.
