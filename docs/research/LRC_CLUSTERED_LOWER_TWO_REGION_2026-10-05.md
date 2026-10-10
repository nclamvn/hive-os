# A complete clustered-lower family by two complementary time constructions

Date: 2026-10-05. Status: WRITTEN_ARGUMENT; independent acceptance recorded
separately in TIP-072R verification reports. This is a complementary infinite
family result, not global LRC14/15, formal verification or established novelty.

## 1. Why this changes the research method

TIP-072Q closed arbitrary five exceptional speeds above the FIXED lower
progression $5,10,\ldots,45$. Increasing a search bound for that progression
would not allow the lower coordinates to vary independently.

Here neither tuple is fixed. We prove an entire ratio cone of lower tuples,
with arbitrary unbounded exceptions. Instead of searching each exception
configuration, we arrange for two sufficient regions to overlap: small
exceptions are all safe at the same nonzero shifts; a large exception is made
safe on every shift by moving within an exact lower-valid interval.

The written proof has no absolute speed bound or lower-LRC assumption.
The diagnostic program's $10^{12}$ speed ceiling is only an execution limit.

## 2. General theorem

Write $\|x\|=\operatorname{dist}(x,\mathbb Z)$, with strict BAD meaning
$\|x\|<\eta$; equality is GOOD. Let $d\ge2$ be an integer and
$0<2d\eta<1$. Let $u_1,\ldots,u_r$ be positive integers divisible by $d$,
where $r\ge1$, and let $a_1,\ldots,a_d$ be positive integers coprime to $d$.
Set

$$m=\min_i u_i,\qquad U=\max_i u_i,\qquad V=\max_k a_k,$$

$$B=\frac{1-d\eta}{d\eta}\,m,\qquad
C=\frac{(1-d\eta)(1-\eta)}{\eta(1+d\eta)}.$$

**Theorem.** If $U\le Cm$, there is a real time $T$ such that all $r+d$
coordinates have distance at least $\eta$ from an integer.

Pairwise distinctness is not needed for the proof, but is imposed in the
LRC application and executable. No premise on a previously computed lower
witness or on the relative residues of the exceptions is needed. For composite
$d$, coprimality, not merely nondivisibility, is essential.

### First lower-good interval

Each lower coordinate is GOOD in its first closed band
$[\eta/u_i,(1-\eta)/u_i]$. Their intersection is exactly

$$I=[a,b]=\left[\frac{\eta}{m},\frac{1-\eta}{U}\right],\qquad
W=b-a=\frac{1-\eta}{U}-\frac{\eta}{m}.$$

Since
$C< (1-\eta)/\eta$, the ratio premise ensures $W>0$.
For any $t\in I$, $\eta\le u_i t\le1-\eta$, so every lower coordinate
is GOOD. Also $u_i(t+j/d)\equiv u_i t\pmod1$ for every integer $j$.
This is the complete first-band intersection, not an assertion that there
are no other lower-good components elsewhere.

### Region A: all exceptions slow, $V\le B$

Take $t=a=\eta/m$. For every exception $v$,

$$0<vt\le\frac{\eta B}{m}=\frac1d-\eta.$$

For every physical $j=1,\ldots,d-1$, the residue of $vj$ modulo $d$ is
some $k\in\{1,\ldots,d-1\}$ because $v$ is a unit. The fractional
representative is therefore

$$\frac{k}{d}+vt\in
\left[\frac1d,\frac{d-1}{d}+\frac1d-\eta\right]
\subseteq[\eta,1-\eta].$$

There is no wraparound in this representative. Thus EVERY nonzero physical
shift $T=t+j/d$ works simultaneously for all exceptions and all lower speeds.
In particular $j=1$ is a constructive witness. The low-region assertion
deliberately excludes $j=0$; an exception of speed1 can be BAD there.
Equality $V=B$ is harmless: the right endpoint above equals $1-\eta$.

### Region B: a large exception, $V>B$

The ratio premise is exactly the sufficient overlap condition for the two
uniform bounds:

$$
W\ge\frac{2\eta}{B}
\quad\Longleftrightarrow\quad
\frac{U}{m}\le\frac{(1-d\eta)(1-\eta)}{\eta(1+d\eta)}=C.
$$

All factors divided by are positive. Consequently $W\ge2\eta/B>2\eta/V$.
The same construction works at the analytic equality $V=B$ as well, although
our deterministic implementation assigns equality to Region A.

For a unit $v$ modulo $d$, multiplication by $v$ permutes the divisor shifts:

$$\min_{0\le j<d}\|v(t+j/d)\|=\frac{\|dvt\|}{d}.$$

Thus the base times where selected $v=V$ is BAD on at least one shift are
the pairwise disjoint OPEN intervals

$$J_h=\left(\frac{h}{dv}-\frac{\eta}{v},
             \frac{h}{dv}+\frac{\eta}{v}\right),\qquad h\in\mathbb Z.$$

Their length is $2\eta/v$; disjointness follows from $2d\eta<1$.
The closed connected $I$ cannot lie in their union: if it did, connectedness
would put it in one $J_h$, but $|I|\ge|J_h|$ prevents a closed interval from
fitting inside that open interval, even at equality.

This gives an exact construction. Begin at $a$. If $\|dva\|\ge d\eta$,
keep $t=a$. Otherwise $a$ belongs to a unique $J_h$ and move RIGHT to

$$t=\frac{h+d\eta}{dv}.$$

Here $h$ is the unique nearest integer to $dva$, since
$\|dva\|<d\eta<1/2$. The move is positive and at most $2\eta/v\le W$,
so $t\in I$. At the right endpoint $\|dvt\|=d\eta$; the selected
exception is GOOD on ALL $d$ physical shifts. This right-boundary construction
is intentionally different from TIP-072Q's nearest-boundary rule. A negative
phase offset or a center tie still moves RIGHT, not toward the nearest side.

For each other exception, the $d$ phases have circular spacing $1/d$. Its
strict BAD arc has length $2\eta<1/d$, so it forbids at most one physical
shift. There are $d-1$ such exceptions; they cannot exhaust all $d$ indices.
Choose the smallest physical GOOD index. Every lower coordinate remains GOOD
because $t\in I$ and the divisor shifts preserve its phase. This proves
Region B and the theorem. No generic strict slack is promised. $\square$

## 3. Two distinct LRC applications

The stationary runner is not included in the moving-speed tuple.

| Moving / total | Lower speeds | Exceptions | Target $\eta$ | $B$ | Complete sufficient family |
|---|---|---|---|---|---|
|14 /15|nine positive multiples5|five units5|$1/15$|$2m$|$U\le7m$|
|13 /14|eight positive multiples5|five units5|$1/14$|$9m/5$|$19U\le117m$|

Both families permit the lower coordinates AND exceptions to vary independently
without an absolute integer bound. For example, nine distinct multiples of five
chosen from $[10,70]$, or from $[45,85]$, satisfy the first ratio criterion.
There are infinitely many such lower tuples, not just common scalings of one
progression. Any five distinct positive units modulo five can be appended.

The second threshold is $117/19$, not seven. A $1/15$ witness must not be
admitted at the $1/14$ target. Neither family assumes LRC8 or LRC9: the lower
times and intervals here are explicit.

This result is COMPLEMENTARY to TIP-072Q, not a superset: its old lower
$5,10,\ldots,45$ has $U/m=9$ and is outside the new cone. Its separate complete
exception-family proof remains valid and unchanged. No archived p83 branch is
certified merely because one tuple or one ratio cone is covered.

## 4. Equality and an explicit construction

For fourteen moving speeds, use lower
$(10,15,20,25,30,35,40,45,70)$. Then $m=10$, $U=70=7m$,
$I=[1/150,1/75]$, and $W=1/150=2\eta/B$ with $B=20$.

Exceptions $(1,2,3,4,19)$ are in Region A; every physical $j=1,2,3,4$
works. For $(1,2,3,4,21)$, Region B moves to $t=4/315$ and the smallest
GOOD physical shift is $j=1$, giving $T=67/315$. All fourteen coordinates
are checked in the retained diagnostic matrices. The analytic equality $V=20$
cannot be a valid unit-modulo-five exception here; no invalid fixture should
be invented merely to test that boundary.

For thirteen moving speeds, lower
$(95,100,105,110,115,120,125,585)$ reaches $19U=117m$ exactly.
Here $B=171$, $I=[1/1330,1/630]$, and $W=1/1197=2\eta/171$.
Unlike the previous case, $171$ IS a unit modulo five. Exceptions
$(1,2,3,4,171)$ test both equalities with actual legal integer coordinates;
at $j=4$, the speed171 distance is exactly $1/14$, so equality must remain GOOD.

## 5. A real method gap is not an LRC counterexample

If $U/m>C$, the two uniform sufficient regions may leave a gap. When $W>0$,
the interval-only tail threshold is $H=2\eta/W$; the uncovered uniform region
is $B<V<H$. This is a limitation of these sufficient bounds, not a theorem
that no witness exists, nor an optimal LRC ratio assertion.

Concrete control: lower $(10,15,20,25,30,35,40,45,75)$ and exceptions
$(1,2,3,4,21)$. Now $U/m=15/2>7$, $B=20$, $H=300/13>21$.
The first lower-good interval $[1/150,14/1125]$ is strictly inside the
selected21 unsafe component $(2/315,4/315)$. All four smaller exceptions are
also orbit-unsafe throughout that interval. Thus neither uniform route gives
the proposed guarantee. Nevertheless $T=31/150$ is a full witness, with
minimum distance $1/15$. An out-of-cone diagnostic must say UNKNOWN and keep
observed witnesses separately; it must never manufacture a counterexample.

The old cone-complement remains infinite as lower coordinates grow. We do not
replace a global finite-reduction theorem by a normalized-ratio argument.

## 6. Primary comparison and claim boundaries

[Allikvere v2, Section4.4 Lemma4.6](https://arxiv.org/html/2609.02604v2#S4.SS4)
uses common-divisor shifts with fewer than five unit exceptions when $d=5$.
Our critical five-exception case needs extra structure: the lower ratio premise
allows two explicit time constructions to cover all exceptional speeds.

[Kravitz arXiv v1, Proposition8.1](https://arxiv.org/html/1912.06034v1#S8)
(Proposition6.1 in the published version) provides the established interval and
fast-phase principle. The present argument combines that principle with divisor
orbits and a simultaneous slow-exception construction. It is a method improvement
inside this program. This limited source comparison DOES NOT establish literature
priority or novelty; an external novelty review remains undone.

No global LRC14/15 proof, independently reimplemented Allikvere archive, formal
theorem-prover result, autonomous research execution, native agent-loop closure,
external adjudication or mathematical breakthrough is asserted. Local offline
replay does not create a signed/admissible runtime certificate. Production
TIP-072 remains PARTIAL / NOT_READY_FOR_M1.
