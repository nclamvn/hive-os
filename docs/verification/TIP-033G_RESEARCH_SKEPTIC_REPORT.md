# TIP-033G independent skeptical mathematical review

2026-10-01. Reviewer: separate Codex agent; same-model peer criticism, not a
formal proof certificate, independent human review, or novelty certification.
Read-only research controls; no app, database, worker, paid API or Git mutation.
Historical D/E/F artifacts are not changed by this review.

## Scientific derivation checkpoint

The exchange of `u` and `Q` in
`Ap+u=(4Auk-1)Q`, with positive integers and `gcd(A,u)=1`, is valid.
Writing `h=(u+Q)/A=4ukQ-p` shows `gcd(A,Q)=1`. The exchanged core is
`m'=AQk`, and `Ap+Q=(4m'-1)u`. The sorted denominator tuple
`(uQk, Apuk, ApQk)` is preserved. Positivity, integrality and strict
distinctness therefore survive an exchange when present initially.

After choosing `u<=Q`, put `T=ukQ` and `T0=floor(p/4)+1`. The bound
`m<=floor(2T0/(4T0-p))` is a bound on an existence representative, not on
every original core. For the residual targets `p=1 mod 4`, it becomes
`floor((p+3)/6)`. Applying this representative bound to a fixed dyadic/odd
prime-power subclass would be invalid: exchanging `u,Q` may change support
and exponents. Earlier independent controls checked 26,543 prime-target
normalized pairs, including coprimality and exact tuple preservation.

The exchange and corresponding Type II parametrization are known, not a
novel structural breakthrough. In [Tao 2011](https://arxiv.org/html/1107.1010v2),
Proposition 1.2 maps to `(a,b,c)=(u,Q,h)`, `k=(p+h)/(4uQ)` and
`A=(u+Q)/h`; Remark 1.3 discusses the equivalent divisor parametrization.
Section 2 uses the interchange to assume `a<=b`. This literature alignment
does not silently upgrade the historical sufficient-family ledger to a
statement about all decomposition types.

The separate residual all-representation refinement was also reviewed and
accepted: for `p>=2`, `p=1 mod 840`, every original normalized core obeys
`m<=floor((p+11)(p+15)/176)`. At `h=3`, divisibility and modular constraints
force `k>=11`; at `h=7`, they force `k>=13`. For larger admissible `h`, the
earlier decreasing rational bound gives the `h=11` maximum; both smaller-h
estimates lie below it. This assertion does not require prime `p` and is
distinct from the linear representative bound. Its novelty is unestablished.
Direct execution of the independent exchange audit matched both packets:
34,354 controls, 22,587 swaps, 32,536 strict tuples, 206 residual controls,
packet digest `3e919c231c80fcde5b8ad639e3bae84d5e5fd97c1e0b426cb6b316dcf5e1ea5b`.
Conditional `h` floors remain explicitly uncertified assumptions.

## Core-preserving single odd-prime-power bound

The full G03 case argument was independently challenged and accepted for
`B=2^a`, `q=ell^b`, `a>=1`, `ell` an odd prime and `b>=2`:

`min R_(4Bq-1) >= max(3B-1, ceil(4Bq/(B+1))-1)`.

The exact image consists of pure dyadic terms `-2^t`, `|t|<=2a+2`, and
intermediate terms `-ell^r*2^t`, `1<=r<b`, `-a<=t<=2a+2`, modulo
`s=4Bq-1`. The reviewed cases exhaust this image:

- Pure negative exponents up to `a+2` and beyond it.
- Nonnegative low exponents through `a+1`.
- High nonnegative exponents `a+2+d`, with `0<=d<=a` and including the
  pure term, using `2^d=Qh+R`, `Q=q/ell^r`, `1<=R<Q`.
- Intermediate negative exponents, using the nonzero odd residue of
  `ell^r` modulo `2^j`.

The high-exponent canonical remainder is positive and strictly below `s`;
the estimates for `h=0` and `h>=1` both hold. The intermediate negative
case uses `q>=3*ell^r`. No primality of `s` is assumed. No primality of the
positive target `p` is required for the necessary cutoff: its canonical
residue is at most `p`. Integer rounding gives exactly

`B <= (p+1)/3`,
`q <= floor((p+1)(B+1)/(4B)) <= 3(p+1)/8`.

These are necessary bounds, not sufficient congruence hits or a proof of
the root problem. Exact original congruences and strict witness identities
remain separate checks.

### Independent controls and sharp scope boundaries

An independent stdin Python implementation checked 1,344 signed-pair versus
collapsed-image rows: `a=1..12`, `b=1..8`, fourteen odd primes from 3 to 47.
All exact image and bound checks passed; 1,000 moduli were directly shown
composite by a small divisor. Twenty-eight `b>=2` controls attain the
bound, including `(a,b,ell)=(1,2,3)` with `s=71`, minimum 23, and `(2,2,5)`
with `s=399`, minimum 79. These finite controls support the written argument;
they are not its replacement.

The bound cannot be extended to arbitrary mixed odd support. A prime-target
counterexample to that invalid extension is
`p=19, B=2, q=15, m=30, s=119, A=6, u=5, Q=k=1`.
Here `Ap+u=119`, `gcd(A,u)=1`, and the strict tuple is `(5,114,570)`.
The eligible residue is 19, below the wrongly generalized bound 39.
This does not refute G03: `15` is not a single odd prime power. Whole-q-only
aggregate ratios and the full partial-divisor family must remain distinct.
The same failure occurs at an actual fixed target: `p=159727681`, `B=2`,
`q=99`, `m=198`, `s=791`, `A=3`, `u=11`, `Q=605794`, `k=6`.
Its eligible residue is 260, below the wrongly generalized bound 263.

## Full four-target plan independently reproduced

Enumerating prime bases by an exact small sieve and every `a,b,ell` within
the proven bounds reproduces the predeclared plan, with no arbitrary
modulus or prime-base ceiling:

| Target p | Max a | Planned cores | Signed-pair slots |
| --- | ---: | ---: | ---: |
| 131433121 | 25 | 22060 | 3322548 |
| 159727681 | 25 | 23891 | 3572941 |
| 351121 | 16 | 1462 | 172150 |
| 171348241 | 25 | 24538 | 3671226 |
| Total | | 71951 | 10738865 |

The plan includes 1,214 cores already exceeding the older all-representation
finite `M(p)` bound. Checking them is harmless; filtering them would require
explicit exclusion reasons and adjusted coverage counts. The core-preserving
cutoff, unlike the symmetry representative bound, legitimately closes all
larger `a,b,ell` within this single-prime-power family for each fixed target.

## Completed implementation replay and adversarial controls

Direct execution of `node --import tsx
scripts/operations/higherpower-core-audit.ts` completed successfully. The
TypeScript implementation enumerates signed exponent boxes; the fixed
stdlib Python independently enumerates positive integer divisor pairs with
disjoint support. Both recheck actual original congruences, canonical pair
selection, exact strict identities and the two p-divisible denominators.
Every miss contributes to the complete row digest. The original congruence,
not a powered elimination equation, determines each hit.

Python source SHA-256:
`4cfbb8c77a2d09c624eb9e2771de2efaea7fbe318d7e617c3ee0b7d57c582fad`.
Both whole-packet digests:
`0077816c13c6f6ff6fbb490d220396a63cc92f07e0e9bde24a316b5077ee85a9`.

There are five hit cores across the four targets, with per-target counts
`2,0,1,2`. Two are translated-only: `(p,a,b,ell)=(131433121,3,3,5)` and
`(351121,2,3,3)`. Independent skeptic arithmetic enumerated every coprime
divisor pair at each of the five hit cores: each has exactly one hit, the
reported canonical pair, and its strict identity and divisibility pattern
hold. This is not a claim of five novel decompositions.

Eleven independent packet mutations were rejected: changed negative-row
hash, omitted target, omitted hit, dyadic-tail drift, odd-tail drift, forged
empty negative target, broadened scope, changed budget, omitted slot,
corrupt witness and a partial target. A forged primary packet cannot invoke
a passing replay; a PARTIAL packet is MISMATCH/UNAVAILABLE, never PASS.

Independent monotonic-clock expiry injections in both implementations at
first core, mid-scan and finalization all retained PARTIAL. At mid-scan the
pending core was exactly `(a,b,ell)=(1,2,349)` after 100 rows. At
finalization all 1,462 rows of target 351121 were checked but status remained
PARTIAL with `pendingFirstCore:null` and an explicit finalization reason.
No partial packet carried an authoritative complete row digest or hit list.
An initial TypeScript final-row deadline gap was repaired before this final
review; the timer now starts before planning and is monotonic.

The immutable F `b=2,a<=4` slice matches exactly, including both witnesses
and the empty targets. A test-only accessor typo (`coreWitnesses` instead
of F's `witnesses`) was identified and corrected. Fresh targeted execution
passed 14 tests in two files. D and F artifact hashes and D/E/F replay source
pins were re-read and remain unchanged.

## Final verdict and remaining scientific boundary

PASS for the reviewed written arguments and the bounded four-target
full-single-odd-prime-power decision, with the limitations above. In
particular the selected target `159727681` has no normalized core
`2^a*ell^b` with `a>=1,b>=2,ell` an odd prime, under this exact reviewed
family procedure. This is stronger than a finite arbitrary-ceiling miss;
the tails are excluded by the written argument. It does not exclude mixed
odd-prime supports, odd-only cores, Type I or other solution families, and
the retained mixed-support witness explicitly prevents a root exclusion.

The scientific outcome is useful exact family reduction and a known
symmetry, not a claimed novel theorem, universal hitting result, formal
certificate or mathematical breakthrough. The separate replay languages
share ordinary integer arithmetic and the same written mathematical scope;
their agreement is not independent-foundations certification. No historical
agent ledger is promoted by this standalone research review.
