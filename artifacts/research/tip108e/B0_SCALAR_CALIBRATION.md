# Whole B0 scalar calibration and supporting 2+4 hand dependencies

This is HAND mathematics, not an executed certificate. It uses the licensed
lower-functional reductions in HAND_CRITICAL_NOTES.md and Main's endpoint
phase bounds. It is not a proof of the remaining 3+3 type or global K6.
Its status is pending independent review; no new process was run.

## Whole far-gap dependency (not an execution or sampled prune)

For the ACTUAL left-pair range a, its two possible orientations have areas
3/4-a/2+3a^2/4 and3/4+a/2-a^2/4. The latter is larger by a-a^2>=0.
Thus, together with the retained proper4 bound,

    G_L+G_R>=2-S/2+3a^2/4+b^2/4>=2-S/2+3S^2/16.

The last difference is(3a-b)^2/16. This uses actual pair range a, not an
unrestricted choice of difference in[-a,a] incorrectly treated as attaining a.
For every cross pair of rank r>=2 and difference D>=d>1, its full intersection
is J_r(D)=(r-D)_+^2/[r*(r^2-1)], decreasing in D. Rank1 cross pairs are
disjoint. For LEFT56/RIGHT1234 the rank2,3,4,5 counts are2,2,2,1. Therefore

    G_L+G_R-G<=2J2(d)+2J3(d)+2J4(d)+J5(d)=V244(d).

At d5/3, V244=62/135. The sum bound minus target decreases with S through
18/31, and at that endpoint is1855/3844. Hence for every d>=5/3,

    G-target>=1855/3844-62/135=12097/518940>0.

Only the entire d interval(1,5/3) remains for the scalar calibration below.
No sampled offset or presumed natural ordering entered this argument.

## Domain, functions and dependencies

Set S=a+b<=18/31, d>1. The original critical domain has S>18/61; smaller
S in the inequalities below is harmless. The actual left pair span is a.
Its two orientations are k=q-p5=d, ell=q-p6=d+a (negative orientation),
or k=d+a, ell=d (positive orientation). The retained whole far-gap proof
allows d<5/3. Thus all cross arguments are below5/3+18/31<7/3.

The exact high-band functions are f_r(D), as in the retained Q definitions.
Their relevant second-derivative bounds are

    f2''>=-2/3; f3''>=-5/12; f4''>=-3/10; f5''>=0.

Also (f2+f3)''>=-5/12, (f3+f4)''>=-13/60,
(f2+f4)''>=-2/3 and (f4+f5)''>=-2/15. All seams are C1.
These follow directly from the exact high-band hinge formulas; no Hessian
of the true union is presumed.

After p4=q, B=0 or b, and the licensed A reductions, three LOWER-functional
branches cover all configurations. Main's endpoint bounds used below are:

- Pure RIGHT Bb/Ab face H0: for S>=1/2, H0-target>=455/138384;
  for S<=1/2, H0-target>=535/6336.
- Pure LEFT negative face HS: for S>=1/2,
  HS-target>=S/8+9385/415152; for S<=1/2, HS-target>=1/6.
- Pure LEFT positive face is at least HS+S/4.

Here target=1+S/2. Main's complete d-phase derivations are separate proof
dependencies, not values inferred from samples or assumed worst faces.

## Bb/Ab: corrected semiconcavity, not false concavity

At fixed S,d, let H(a) denote the C0 lower face, before the C-loss
m=b*(1/6+a/4-b/2)_+. For negative orientation,

    H''=-3/4+(1/4)*1_{d+b<2}
         -(f2+f3)''(d+a)-(f3+f4)''(d+b)<=2/15.

The low positive hinge has second derivative POSITIVE1/4. Earlier Main
concavity was withdrawn. The correct conclusion is

    H(a)>=linear_endpoint_chord-ab/15.

For positive orientation H''=-1-f2''(d+a)-(f4+f5)''(d+b)<=-1/5,
so actual concavity of THIS lower face is valid.

For S>=1/2, m<=a/8: its unrestricted quadratic maximum after subtracting
a/8 is (36S^2-132S+49)/1728<0. Taking endpoint surplus bounds3/1000
and1/50, and t=a/S, the negative-orientation margin is at least

    3/1000+17t/1000-S^2*t*(1-t)/15
      >=3/1000-11t/2000+9t^2/400>=959/360000>0.

The middle inequality uses S^2/15<9/400. The positive orientation is stronger.
For S<=1/2, m<=49/1728 and ab/15<=1/240, so the negative margin is at least
535/6336-49/1728-1/240>0; the positive case again is stronger.

## Bb/A0: genuine concavity in both orientations

Again remove C at the same loss m. The negative fixed-S second derivative is

    -7/4-(f2+f3+f5)''(d+a)-f3''(d+b)<=-11/12.

The positive second derivative is at most

    -5/4-(f2+f4)''(d+a)-f4''(d+b)<=-17/60.

The b0 endpoint is the same pure-left face HS. Its a0 endpoint dominates
the pure-right Bb/Ab face H0. Their difference is at least

    b/4-3b^2/8+(f4+f5)(d+b)-(f4+f5)(d)
      >=b*(2-3b)/8>=0.

The low-hinge difference equals b/4 when d+b<=2; above2 its extra is
(d+b-2)^2/8. The function f4+f5 is increasing below7/3. Thus the same
endpoint/C-loss argument closes Bb/A0, with no semiconcavity penalty needed.

## B0/Ab: eliminating C without an endpoint assumption

Use c(a)=min(3/40+a/8,9/80) to bound f2(k+C)+f3(ell+C), and drop the
nonnegative upper-energy remainder. The resulting entire-C scalar bound is

    Q=1+k/2-a^2/4-b^2/8
      +(2-k-b)_+^2/8-(ell+b-1)^2/8
      -f2(ell)-f3(k)-f4(k+b)-f4(ell)-f5(ell+b)-c(a).

For negative orientation also add the safe LEFT envelope energy

    F(a)=a^2/2                              if a<=1/4,
         a/4-1/32+(a-1/2)_+^2             otherwise.

This is the low left-lower expansion through1/4 plus BOTH left high energies,
and is not a false-gap restoration or a duplicated high envelope term.
For positive orientation the left pair has no such expansion and none is added.

### Pure RIGHT endpoint, all d phases

At a0, for S>=1/2 the d<3/2,d+S<2 polynomial is

    169/120+S/20-9S^2/40-(1/30+S/5)*d+13d^2/120.

Its derivative is positive for d>=1. The remaining phases also increase in d:
above d+S=2 the low derivative is(3-d-S)/4>1/10, whereas
(f2+f3+f4)'(d)<0 and (f4+f5)'(d+S)<=1/10; above d3/2 the former remains
negative through5/3. If d+S<3/2, the derivative is-1/3+5d/12>0.
Therefore d1 is the uniform minimum. It gives

    delta_R=29/60-13S/20-9S^2/40>=1733/57660>3/100   (S>=1/2),
    delta_R=61/120-3S/4-S^2/8>=49/480                (S<=1/2).

These two formulas meet at S1/2. At b0, replacing the two exact high terms
by c(S) loses at most9/80 from Main's pure-left face; their nonnegativity
justifies this statement. The positive pure-left endpoint gains at leastS/4.

### Entire a interval, not presumed a0 dominance

Strip c(a) from Q and call the remainder J(a). For negative orientation,

    J''=-3/4+(1/4)*1_{d+b<2}
        -(f2+f4)''(d+a)-f4''(d+b)<=13/60.

When the indicator is1, f4''(d+b)>=0, giving the stronger1/6 bound;
when it is0 the displayed13/60 follows. Thus the endpoint chord deficit
is at most13ab/120. For positive orientation,
J''=-1-f3''(d+a)-f5''(d+b)<=-7/12, so the stripped function is concave.

The cap's additional chord deficit is exactly

    c(a)-[(1-a/S)c(0)+(a/S)c(S)].

For S>=1/2, put delta_R>=3/100 and delta_1=9385/415152>11/500.
When a<=3/10, the negative-orientation target margin is at least

    3/100-(83/1000)*a/S-(13/120)*a*(S-a)+F(a).

Because1/S<=2 and13S/120<=39/620, the coefficient of the adverse linear
term is at most83/500+39/620=887/3875<23/100. For a<=1/4 the margin is
therefore at least3/100-23a/100+3a^2/5>=191/24000>0. For
1/4<=a<=3/10 it is at least-1/800+a/50+13a^2/120>=101/9600>0.
For a>=3/10 the endpoint/cap part is at least-7/250=-0.028, while
F(a)>=7/160 and curvature loss is at most13S^2/480<0.00914.
Hence the whole remaining interval also has a strictly positive margin.

For positive orientation, both endpoint margins are at least3/100 and the
cap chord deficit is at most29/1600, yielding19/1600>0.

For S<=1/2 the lesser endpoint margin is at least1/6-9/80=13/240.
The cap chord deficit is at most3/200 (zero if S<=3/10), and the negative
curvature penalty is at most13/1920. Thus even ignoring F,

    Q-target>=13/240-3/200-13/1920=311/9600>0.

Positive orientation has no curvature penalty and is stronger.

## Evidence scope and ledger

If every dependency and inequality above survives independent review, this
closes the WHOLE critical2+4/4+2 offset domain, including ties and endpoints;
it is not a sample-based claim. It still does NOT close critical3+3, R1, the
one-bottom domain or global K6. Review status must be retained explicitly.

Mathematical subprocess ledger remains exactly ONE prescribed Q244 diagnostic,
actual0.005862833990249783s, conservative3s/75, failures0. The above was hand
algebra only. No geometry enumeration, new optimizer or computational certificate.

## Review acceptance (preserving the initial pending-review history)

The independent hand review in INDEPENDENT_REVIEW.md, sections L/M, subsequently
accepted the complete B=b and B0 calibrations and their retained dependencies.
The combined uniform result is G-(1+S/2)>=959/360000 and
D>=959/180000 for the ENTIRE critical2+4 domain and its4+2 reflection.
This is a scoped analytic result, not external/formal acceptance or global K6.
LEFT456/RIGHT123 remains unclosed. No additional execution accompanied review.
