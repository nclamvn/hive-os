# Full preserved-period geometry: reducing the critical exception stratum

Date: 2026-10-05. Status: WRITTEN_ARGUMENT; independent/Main acceptance is
recorded separately in TIP-072S reports. No global LRC, literature novelty,
formal verification, whole archived-branch or autonomous-runtime claim.

## 1. What the previous method missed

TIP-072Q used the $d$ common-divisor shifts $j/d$. TIP-072R controlled a
ratio cone of lower speeds. Neither description uses the FULL common divisor
of the actual lower tuple. Its extra preserved phases can make an exception
harmless on every primary shift without requiring a fast exception or clustered
lower speeds. We now derive the exact geometry of that extra freedom and a
discrete necessary condition for a remaining obstruction.

This adapts established pre-jump/gcd methods; it is not a discovery of the
preserved-shift principle or an independently adjudicated new LRC theorem.

## 2. The full secondary orbit

Let $d\ge2$, $0<2d\eta<1$, and let lower positive integer speeds $u_i$ be
divisible by $d$. There are exactly $d$ positive exceptional speeds, each
coprime to $d$. Write

$$g=\gcd_i(u_i/d),\qquad U=\max_i u_i,\qquad \rho=d\eta.$$

Suppose an exhibited time $t_*$ has lower distances at least $L\ge\eta$.
Define $R=(L-\eta)/U$, which may be zero. For a selected exception $v$, put

$$h=\gcd(v,g),\qquad q=g/h,\qquad \alpha=dvt_*.$$

Every secondary shift $\ell/(dg)$ preserves all lower phases. In scaled
exception phase it adds $v\ell/g=(v/h)\ell/q$. Since $v/h$ is a unit modulo
$q$, these are the $q$ equally spaced phases $\alpha+k/q$ modulo one.
They can be represented using $\ell=0,\ldots,q-1$; enumerating $g$ shifts
is unnecessary. For $q=1$ use the single representative $\ell=0$.

At a base time $t$, the exception is GOOD on ALL subsequent primary shifts
$j/d$ exactly when

$$\min_{0\le j<d}\|v(t+j/d)\|=\frac{\|dvt\|}{d}\ge\eta.$$

Thus the desired scaled phase lies in the closed arc
$A=[\rho,1-\rho]$ modulo one, of length $1-2\rho$.

### Automatic orbit gate

If

$$q(1-2\rho)\ge1,$$

the translated $q$-grid always meets $A$: a closed arc of length at least
$1/q$ cannot miss a grid with spacing $1/q$. Equality includes its endpoints.
Choose the corresponding secondary shift. Selected $v$ then forbids zero
primary shifts. Every other exception forbids at most one, because its strict
BAD arc has length $2\eta<1/d$. The remaining $d-1$ exceptions cannot forbid
all $d$ primary shifts. Lower phases are unchanged throughout.

**No speed bound, lower-speed ratio or strict lower slack is needed in this
automatic case.** A valid lower witness at $L=\eta$ is sufficient.

## 3. Exact distance when the orbit is too short

Suppose $q(1-2\rho)<1$. As $\alpha$ varies, the safe set is the union of
translates $A-k/q$. The arcs have length less than their spacing. The unsafe
components are OPEN gaps with centers

$$c_z=\frac{z+(q+1)/2}{q}\quad(z\in\mathbb Z)$$

and radius

$$r=\rho-\frac{q-1}{2q}>0.$$

In particular, odd $q$ has gap centers at integer multiples of $1/q$;
even $q$ has a half-grid offset. Omitting this parity offset gives an incorrect
distance formula. Distance from $\alpha$ to the nearest gap center is

$$\beta=\frac{\|q\alpha-(q+1)/2\|}{q}.$$

Distance to the closed safe union, converted to base-time units, is exactly

$$D_v(t_*)=\frac{\max(0,r-\beta)}{dv}.$$

Use $r=\max(0,\rho-(q-1)/(2q))$ for a uniform formula, giving $D=0$ in
the automatic case; formal gap-center coordinates there do not assert an
actual gap exists. For $q=1$, this is precisely TIP-072Q's primary-only
distance $\max(0,\rho-\|\alpha\|)/(dv)$.

If $D=0$, do not move. Otherwise let $z$ be the nearest integer to
$y=q\alpha-(q+1)/2$, and let $s=y-z$. It is unique in an unsafe gap:
$qr=q\rho-(q-1)/2<1/2$. Move to its upper boundary when $s>0$;
when $s<0$ move to its lower boundary. At the center $s=0$, choose LOWER.
The signed scaled-phase change has magnitude $r-\beta$, and signed base
change has magnitude $D$. These are closed GOOD boundaries.

If $D\le R$, the perturbed $t'$ preserves all lower coordinates:

$$\|u_i t'\|\ge L-u_i|t'-t_*|\ge L-UR=\eta.$$

Apply a secondary shift to make selected $v$ orbit-safe, then the primary
shift-count argument from Section2. This proves the full-period witness theorem.
All statements quantify over actual tuples, not congruence representatives.

The worst-phase bound is $D\le r/(dv)$. For $L>\eta$, a sufficient ACTUAL
speed threshold is $v\ge rU/[d(L-\eta)]$. The factor $U$ is essential.
At $L=\eta$, positive $r$ has no finite worst-phase threshold; nevertheless
an actual $D=0$ is valid. There is no division by zero or fictitious strict slack.

At the standard lower margins, the thresholds specialize to:

| Moving / total | $L$ | $q$ | Worst-phase sufficient speed |
|---|---|---|---|
|14 /15|$1/10$|1|$2U$|
|14 /15|$1/10$|2|$U/2$|
|14 /15|$1/10$|at least3|none|
|13 /14|$1/9$|1|$9U/5$|
|13 /14|$1/9$|2|$27U/50$|
|13 /14|$1/9$|3|$3U/25$|
|13 /14|$1/9$|at least4|none|

The $1/15$ and $1/14$ targets are not interchangeable. The diagnostic uses
the ACTUAL attained lower margin, not a deliberately weakened theoretical one.

## 4. Construct the secondary shift without enumerating its orbit

After any permitted perturbation, put $f=\operatorname{frac}(dvt')$ and

$$k=\left\lceil q(\rho-f)\right\rceil.$$

Because $t'$ is now in the union-safe set, a grid point lies in the closed
interval $[\rho,1-\rho]$. The FIRST grid point at or above $\rho$ is
$f+k/q$; it is no larger than that available grid point and therefore lies
in the interval. This is also immediate when the arc length is at least $1/q$.
Negative $k$ is allowed. For $q>1$, let

$$\ell\equiv(v/h)^{-1}k\pmod q,\qquad0\le\ell<q.$$

Then $d v(t'+\ell/(dg))\equiv f+k/q\pmod1$. For $q=1$ put $\ell=0$,
with no inverse modulo one. The actual selected scaled phase is explicitly
checked; the ceil expression is NOT asserted to be safe at an unadjusted
phase lying outside the safe union.

This requires an integer gcd/inverse and bounded rational arithmetic, not
enumeration of $q$ or $g$. A period with over a billion phases is handled by
one such calculation and a final five-row physical distance matrix.

## 5. A discrete primitive residual classification

Let $H$ be the gcd of ALL lower and exceptional speeds. Exceptions are units
modulo $d$, so $\gcd(H,d)=1$ and $H$ divides $g$. Normalize the whole tuple
by $H$ and write $g'=g/H$. Effective periods do not change:

$$\frac{g/H}{\gcd(v/H,g/H)}=\frac{g}{\gcd(v,g)}=q_v.$$

More precisely, $H=\gcd(g,v_1,\ldots,v_d)$ and

$$g'=\operatorname{lcm}(q_{v_1},\ldots,q_{v_d}).$$

To verify the identity, for each prime take the maximum valuation among
$g/\gcd(g,v_i)$; it is the valuation of $g$ minus the minimum valuation
among $g,v_1,\ldots,v_d$, exactly that of $g/H$.

For fourteen moving speeds, if no exception has $q\ge3$, every $q$ is
1 or2, hence $g'\in\{1,2\}$. For thirteen moving speeds, if no exception
has $q\ge4$, every $q$ is1,2 or3, hence $g'\in\{1,2,3,6\}$.
Therefore, GIVEN a lower GOOD witness, the normalized lower common divisor
$5g'$ can remain obstructed by this automatic gate only in these strata:

- 15 total runners: $5$ or $10$.
- 14 total runners: $5,10,15$ or $30$.

For $g'=6$ in the second line, a residual effective-period multiset must
contain both2 and3 and no6; if a $q=6$ occurs it is automatic already.
Membership in a residual stratum does not imply there is an obstruction.
The exact phase/perturbation gate still resolves some such tuples.

In particular a PRIMITIVE fourteen-moving tuple whose nine lower speeds are
all divisible15 is covered, and a PRIMITIVE thirteen-moving tuple whose eight
lower speeds are all divisible20 is covered, with NO lower ratio or exception
speed bound, GIVEN the lower witness. Lower LRC9/8 can provide existence,
but those results are not independently proved by this dossier. The diagnostic
checks its exhibited rational lower witness directly. Raw large $g$ in an
imprimitive tuple alone is not an automatic-admission condition.

These are finite gcd strata, NOT finite absolute-speed domains. All coordinate
values can still grow independently in a residual stratum. We have neither
closed those strata nor reimplemented every archived integer lift.

## 6. Genuine controls beyond the old gates

The following two cases defeat EVERY original primary shift and EVERY old
primary-only nearest-distance gate, even using the actual lower margin:

| Moving | Lower speeds | Exceptions, in retained order | Original $t_*$ | New witness | Full minimum |
|---|---|---|---|---|---|
|14|$15,30,\ldots,135$|$1,24,22,23,21$|$1/150$|$11/150$|$11/150$|
|13|$20,40,\ldots,160$|$1,29,27,28,26$|$1/180$|$91/180$|$1/9$|

Their original exceptional BAD masks, in order, are
$\{0\},\{1\},\{2\},\{3\},\{4\}$. In the first case selected1
has $q=3$ and secondary $\ell=1$; the new BAD masks are
$\varnothing,\{4\},\{1\},\varnothing,\{2\}$, leaving lowest $j=0$.
In the second, selected1 has $q=4$, $\ell=2$ and base $19/180$; masks are
$\varnothing,\{0\},\{3\},\{0\},\{1\}$, leaving lowest $j=2$.
Lower ratios9 and8 are outside TIP-072R's corresponding cones. This is an
obstruction on the original FIVE shifts only, not an archived NO_GRID branch.

Additional genuine perturbative controls, not original-grid obstructions:

- n14 lower $10(1,3,5,6,7,8,9,10,11)$, exceptions $(1,3,4,8,37)$,
  $\tau=5/21$. Actual lower margin $1/7$, radius $4/5775$; every old primary
  distance exceeds this radius. New selected37 has $q=2$, distance $1/7770$;
  final $82/555$ has minimum $5/37$.
- n13 lower $10,20,\ldots,80$, exceptions $(2,3,4,6,21)$, $\tau=1/18$.
  Actual margin $1/9$, radius $1/2016$; all old gates fail, selected21 has
  $q=2$, distance $1/4410$. Final $163/1470$ has minimum $16/147$.
- n13 lower $15(1,3,4,5,7,9,11,13)$, exceptions $(6,12,18,24,34)$,
  $\tau=19/108$. Actual margin $1/9$, radius $1/4914$; all old gates fail.
  Selected34 has $q=3$, $D=1/32130$, adjusted time $251/7140$ and $\ell=2$;
  final $877/2380$ has minimum $13/119$.

Those three original grids already have other common GOOD indices; no claim
that all original shifts fail is made for them. Their merit is the stronger
certified gate, not merely replacing one observed numerical witness.

The huge-period control has $g=1000000007$, lower speeds $5g,\ldots,45g$,
exceptions $(1,2,4,7,2g)$ and $\tau=1/(10g)$. Largest exception has $q=1$
and fails its gate; selected1 has $q=g$ and is automatic. Inverse selection
gives $\ell=333333336$ and final time $3333333361/50000000350$ without orbit
enumeration. Evaluating all five candidates is essential; max-speed selection
alone would discard a valid automatic candidate.

## 7. Established foundations and remaining work

[Kravitz arXiv v1, Section4](https://arxiv.org/html/1912.06034v1#S4) discusses
pre-jumps and credits earlier work; [Theorem7.2](https://arxiv.org/html/1912.06034v1#S7)
uses large lower gcd and preserved phases in the three-speed setting.
[Allikvere v2, Lemma2.2](https://arxiv.org/html/2609.02604v2#S2) explicitly uses
the effective orbit $g/\gcd(g,v)$; [Lemma4.6](https://arxiv.org/html/2609.02604v2#S4.SS4)
counts divisor shifts for few exceptions. Our contribution within this program
is an exact full-period critical-exception diagnostic and its residual-gcd
adaptation, not an established new principle or literature-priority claim.

Next research should attack the normalized residual strata, particularly the
mixed effective2/3 stratum at $g'=6$ for target $1/14$, through complete
phase geometry and replayable coverage. No naive finite check follows from
the small list of gcd values. A full archived-branch admission still needs the
exact branch premises and every positive distinct integer lift.

Bounded offline execution is not browser E2E, a signed runtime certificate,
native agent-loop acceptance, formal proof or external review. Product
TIP-072 remains PARTIAL / NOT_READY_FOR_M1; novelty/breakthrough unestablished.
