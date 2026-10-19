# TIP-033G — normalized-bound research completion note

2026-10-01. Builder's G01/G02 research/tooling slice; G03 power-core exploration
belongs to the other Builder. Contractor/skeptic acceptance is separate.

## Status and scope

DONE for written G01/G02 derivations and bounded independent controls.
Scientific verdict: useful exact research/search reduction, **not a claimed
novel theorem or breakthrough on Erdős–Straus**. The exchange is known prior
art. The residual all-representation bound below is an elementary corollary;
its novelty is UNESTABLISHED. No full fixed-target search was performed.

Created only `scripts/operations/normalized-exchange.ts`,
`normalized-exchange-replay.py`, `normalized-exchange-audit.ts`,
`tests/unit/normalized-exchange.test.ts` and this note. Existing D/E/F/V2
scope, sources/data pins, app/UI, DB, worker, provider, dependencies, Git,
handoff and Contractor documents were not changed. The existing exact
normalized-bound arithmetic module is reused read-only.

## 1. Exact exchange and normalization

Assume positive integers p>=2,A,u,k,Q satisfy gcd(A,u)=1 and

$$Ap+u=(4Auk-1)Q.$$

Set T=ukQ and h=4T-p. Rearrangement gives Ah=u+Q, so h>0. Any common divisor
of A,Q divides u, hence gcd(A,Q)=1. The same rearrangement gives

$$Ap+Q=(4AQk-1)u.$$

Thus exchange `(u,Q)` to `(Q,u)` keeps A,k fixed and changes normalized core
from m=Auk to m'=AQk. It preserves exactly the unordered denominator triple

$$\{T,Apuk,ApQk\}.$$

Choosing u<=Q is a change of representative, not a new decomposition. After
sorting, exact integer identity, positivity and strict distinctness are
unchanged. The earlier written argument gives T<=floor((p+1)/3)<p; the
other two denominators are positive multiples of p and at least p. Hence
exactly two denominators are p-divisible in either orientation. For p>2,
strictness is equivalent to u!=Q. At p2 the benchmark is rejected; p3 admits
the degenerate `(1,6,6)` control, retained as non-strict rather than accepted.

If p is prime, u and Q are also coprime: with d=gcd(u,Q), gcd(A,d)=1 and
Ah=u+Q force d|h. Also d|T, hence d|p. Since d^2<=uQ<=T<p, d cannot equal p,
so d=1. This last prime-specific conclusion is not silently extended to
composite arithmetic controls.

## 2. Linear REPRESENTATIVE bound

For the chosen orientation u<=Q,

$$m_{\rm rep}=\frac{T}{h}\left(1+\frac{u}{Q}\right)
\le\frac{2T}{4T-p}.$$

The latter rational function strictly decreases for T>p/4. With
T0=floor(p/4)+1, therefore

$$\boxed{m_{\rm rep}\le\left\lfloor\frac{2T_0}{4T_0-p}\right\rfloor.}$$

For p1mod4 this is floor((p+3)/6). It bounds an existence representative of
every normalized solution, NOT every original core and NOT a prescribed
factor-support/prime-power/whole-q subclass. The three denominator values are
preserved, but m's support need not be.

Explicit falsification of an incorrectly broadened ALL-m linear bound:

- p7,A3,u2,k1,Q1: original m6>representative bound4; exchanged m3, same
  strict triple `(2,21,42)`.
- Even within the residual PRIME class, p26881,A204,u611,k11,Q1 gives
  original m1371084>4480, exchanged m2244, same strict triple. p26881 was
  independently trial-divided in the control, not assumed prime.
- Fixed original p131433121 witness `(A,u,k,Q)=(4,9,1,3676451)` has m36;
  the exchanged orientation has m14705804, not divisible by3. They have
  the identical triple. This prevents misuse as a certified b2/prime-ell tail.

Unconditional representative bounds for the four fixed targets:

```text
p131433121: 21905520
p159727681: 26621280
p351121:      58520
p171348241: 28558040
```

If a SEPARATE full-scope certificate shows h>=h0, then the same argument gives
the conditional bound floor((p+h0)/(2h0)). Arithmetic examples with assumed
h0=27,43,3,63 give2433947,1857299,58520,1359907 respectively. This tool sets
`gateExclusionsCertifiedHere:false`: it does NOT certify the assumption,
reinterpret a restricted core miss as a full gate miss, or import a previous
survey as a new retained agent certificate.

## 3. Stronger bound on ALL residual representations

An independent arithmetic refinement of the old quadratic bound is available
for p>=2,p1mod840. Write p=840n+1, so n>=1. Every admissible h=4T-p is3mod4.

If h3, T=210n+1 is odd,1mod3 and1mod5. As u+Q=3A and ukQ=T, neither u norQ
is divisible by3, uQ is2mod3, and therefore k is2mod3. Since k divides T,
k is odd and not divisible by5. The positive k<11 with k2mod3 are2,5,8,
all forbidden. Thus k>=11.

If h7, T=210n+2 is2mod3,2mod5 and2mod7. From u+Q=7A and nonzero uQ mod7,
uQ=-u^2 mod7 belongs to3,5,6. Since ukQ=T, k mod7 belongs to3,5,6.
The positive k<13 in those residues are3,5,6,10,12, all divisible by3 or5,
impossible for a divisor of T. Thus k>=13. Actual residual prime controls
p26881/h3/k11 and p21001/h7/k13 show these two coefficient minima occur.

For every orientation (no u<=Q assumption), u+Q<=uQ+1=T/k+1 and Q>=1 give

$$m=\frac{T(u+Q)}{Qh}\le\frac{T(T+k)}{kh}.$$

Consequently, h3 gives m<=(p+3)(p+47)/528, while h7 gives
m<=(p+7)(p+59)/1456. For h>=11, the old decreasing function
T(T+1)/(4T-p) is maximized at T=(p+11)/4. Both smaller-h bounds are below
that maximum: the numerator differences after cross multiplication are

$$3(p+11)(p+15)-(p+3)(p+47)=2p^2+28p+354>0,$$
$$91(p+11)(p+15)-11(p+7)(p+59)=80p^2+1640p+10472>0.$$

Thus every such residual representation obeys the separate bound

$$\boxed{m\le\left\lfloor\frac{(p+11)(p+15)}{176}\right\rfloor.}$$

This statement is about ALL m, unlike section2. It remains quadratic and
does not make a full higher-power/core exclusion computationally automatic.
The known linear representative reduction is much more useful for broad
existence search. No certificate from D/E/F is narrowed using this new bound.

## 4. Prior-art comparison and computational value

Primary source: [Tao, 2011, Proposition1.2/Remark1.3 and section2](https://arxiv.org/html/1107.1010v2).
Its coprime TypeII parametrization maps to `(a,b,c)=(u,Q,4ukQ-p)` here and
already includes the u/Q symmetry. Therefore recovering this map/exchange
is not novel. The residual constant refinement is not asserted absent from
the literature; expert/literature novelty review remains open.

Practical value is a sound search-space contract: a broad normalized-family
existence search may work with linear-sized canonical cores and a small branch
u<=sqrt(T)<=sqrt((p+1)/3), rather than every quadratic-sized original core.
At these fixed p the remaining millions of candidates are still not searched
here. This does not imply a uniform proof for all residual primes, and does not
preserve the factor support required by the narrower certified power slices.
Finite congruence coverage alone is not upgraded to a universal theorem.

## 5. Bounded measurements and exact replay

The fixed scope is all admissible divisor-pair controls m1..512,Q1..8,
plus residual p1mod840 controls through m4096 at the same Q cap. No p primality
claim is made for the full control population. TS uses square-root divisor
enumeration; independent Python scans all positive divisors. Both independently
derive p from the exact equation and check swap, gcd, identity, two p-divisible
denominators, strictness, all/representative bounds, with no model/network call.

```text
34354 checked controls
22587 genuinely swapped
32536 strict
206 residual p1mod840 controls
0 bound/preservation failures
controls digest44d4cd52abb6e110e2868a6147c5cf0304429a65afd93a83860395cf29c15d9b
```

Seven new unit scenarios PASS: valid exchange, residual prime counterexample
to ALL-m linear misuse, p2/p3 degeneracy, prime-power-support change, malformed
equation/gcd/positivity/floor guards, h3/h7 minima, exact independent replay
and explicit conditional-scope labels. Fresh typecheck PASS after the local
NODE_ENV allowlist typing fix; targeted lint0/0, diff-check PASS. No full
integration/browser suite or production build is claimed.

```text
node --import tsx scripts/operations/normalized-exchange-audit.ts
npm run test:unit -- tests/unit/normalized-exchange.test.ts --maxWorkers=1
```

Fixed Python source SHA256:
ccd7f19bf33337a45bc22f6cc5043b7249501f8325ba54cd7d1ee4a312bfac5b.
Exact TS/Python whole-packet digest:
3e919c231c80fcde5b8ad639e3bae84d5e5fd97c1e0b426cb6b316dcf5e1ea5b.
Fixed subprocess isolation: python3 -I -S -B, allowlisted environment,
timeout30s/output256KiB, no user-supplied path/input execution.

Rechecked D/F pins remain unchanged. E/V2 are not imported or executed by
these controls. Completion status does not confer expert/formal/novelty acceptance.

## Independent review checkpoint

The separate research skeptic examined the h3/h7 constraints, coefficient
minima, monotonicity and rational comparisons in section3 and reported no
flaw. In particular, the refinement is genuinely an ALL-representation bound
and also holds for positive composite residual p; it is not the exchange's
representative-only statement. Novelty remains UNESTABLISHED. The Builder
also examined the Contractor's separate symmetry and prime-power-tail proof
read-only without identifying an algebraic flaw. This checkpoint is an AI
mathematical review, not expert, Lean or publication acceptance. Contractor's
final technical verification remains separate.
