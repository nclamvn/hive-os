# A finite upper bound for every normalized core at a fixed target

2026-10-01. Written elementary derivation, independently examined by an AI
skeptic. No novelty, Lean, expert certification, live agent retention or
efficient all-core enumeration is claimed. This is a next-method note, not a
promotion of TIP-033D's much narrower complete manifests.

## Universal normalized-family bound

Let p>=2 be fixed, with positive integers A,u,k,Q satisfying

$$m=Auk,\qquad Ap+u=(4m-1)Q.$$

The normalized family additionally requires gcd(A,u)=1, but the following
bound does not need that restriction. Rearranging gives

$$Ap=4AukQ-(u+Q),\qquad h=(u+Q)/A=4T-p\ge1,
\qquad T=ukQ.$$

As `(u-1)(Q-1)>=0`, we have `u+Q<=uQ+1<=T+1`. Thus

$$\lfloor p/4\rfloor+1\le T\le\lfloor(p+1)/3\rfloor.$$

Moreover,

$$m=\frac{(u+Q)T}{Q(4T-p)}
\le\frac{T(T+1)}{4T-p}=:F(T).$$

For successive admissible integers, the sign of `F(T+1)-F(T)` is the sign of
`(T+1)(4T-2p)`, because both denominators are positive. This is nonpositive on
the relevant range for p>=2: `T<=floor((p+1)/3)<=p/2`. Therefore, with
`T0=floor(p/4)+1`,

$$\boxed{m\le\left\lfloor
\frac{T_0(T_0+1)}{4T_0-p}\right\rfloor.}$$

For the residual targets `p=1 mod4`, this specializes to

$$\boxed{m\le M(p):=\left\lfloor
\frac{(p+3)(p+7)}{48}\right\rfloor.}$$

The generic bound is sharp at p=3 mod4: put `t=(p+1)/4`,
`A=t+1,u=t,Q=k=1`, giving `m=t(t+1)` and `Ap+u=4m-1`.
Strict distinct Type II denominators hold for p>=7; p3 itself is not strict.
This does not say the residual p=1 bound is attained.

An independent finite AI check of125516 normalized pairs at m1..4096 found
no violation. That exploratory check is not a retained pinned replay artifact;
the proof above, not the finite sample, supplies the infinite tail. Contractor
independently checked the algebra, discrete monotonicity and target constants.

| Fixed p | M(p) | Max a for m=2^a ell^b, b>=2 | Max b with a>=1 |
|---:|---:|---:|---:|
| 131433121 | 359888887711080 | 45 | 29 |
| 159727681 | 531519451560720 | 45 | 30 |
| 351121 | 2568530580 | 28 | 19 |
| 171348241 | 611671279318260 | 45 | 30 |

The last two columns use ell>=3, `2^a*9<=M` and `2*3^b<=M`.
They are upper bounds, not computed full-family decisions. These very large
finite bounds do not establish practical feasibility or universal success.
It is incorrect to say the higher-exponent family has no finite fixed-target
tail at all; the unresolved task is a sharper/practical certified decision.

## What changes at higher odd-prime exponents

For `m=2^a ell^b`, `a>=1,b>=2`, it is ell^b, NOT ell, that equals
`2^(-(a+2)) mod s`. Applying the b1 substitution directly to ell is invalid.
The exact normalized image decomposes as

$$R_s=\{-2^t:\ |t|\le2a+2\}
\ \cup\ \bigcup_{r=1}^{b-1}
\{-\ell^r2^t:\ -a\le t\le2a+2\}\pmod s.$$

Proof: signed exponent f ranges[-a,a], g ranges[-b,b]. The three g values
`-b,0,b` give the first interval as in the b1 argument. For each residue
`r=1..b-1`, the two g values `r-b,r` give intervals `[2,2a+2]` and `[-a,a]`
after using ell^b's relation. They meet or are adjacent for every a>=1.
This is equality of sets with possible collisions, not independence/count
equality or target hitting. The extra translated windows are the missing
target-sensitive structure.

At fixed a,b,r, put `d=gcd(b,r), B=b/d, R=r/d, C=2^(a+2)`.
If a target lies in the r-window, raising its congruence to B eliminates ell:

$$s\mid C^R(-p)^B-2^{tB}\quad(t\ge0),$$

or, for `t=-j<0`,

$$s\mid C^R(-2^jp)^B-1.$$

These integers are nonzero for p>1 odd. Their divisors are necessary
candidates, NOT sufficient: the raised congruence can introduce extra roots
especially at composite s. Each candidate must satisfy `s+1=C ell^b` with
ell certified prime and the ORIGINAL normalized-pair congruence; strict tuple
and Type II checks remain separate. The universal M bound makes a,b finite,
so this supplies a finite theoretical decision procedure. Factoring every
large integer with replayed certificates may still be impractical. Do not
promise to close that computation within the existing resource bounds.

## Lower-cost staged next attack

1. Define a NEW labelled aggregate-odd-part subfamily `m=2^a q`, q>=3 odd,
   restricting ratios to `2^f q^g`, g=-1,0,1. The b1 four-case proof works
   with odd composite q as well, giving the same pure-two interval/cutoff.
   Existing D tables contain every candidate q before their prime filter;
   a fresh scope/manifest and independent replay can decide this larger
   subfamily without new factorization. Partial divisors of q are excluded.
2. Certify a predeclared small b2 translated-window slice using the elimination
   factors above, then use verified counterexamples or a proof obligation to
   select the next slice. Report unresolved factorizations explicitly.
3. Only claim a complete higher-exponent decision when ALL permitted slices
   and the tail have passed exact certification. Neither a finite miss nor
   this finite bound proves the root conjecture or mathematical novelty.

This note is not supplied to the already sealed live V2 cycle. Its retained
packet and event hashes remain unchanged. Literature/expert comparison is an
open gate before any claim of a significant new research theorem.
