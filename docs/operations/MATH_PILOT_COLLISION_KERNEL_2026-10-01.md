# Collision kernel: prime-modulus refutation and a polynomial family

Date: 2026-10-01. Status: written elementary proofs plus independent finite
integer replay. No novelty, formal-kernel, root-conjecture or target-hitting
acceptance. This is research evidence, not a newly retained agent-cycle event.

## 1. The question actually answered

The earlier bound for the normalized sufficient Type II family was
`R <= P-E`. The Pell example `m=1224` showed equality need not hold at a
composite modulus. It was tempting to attribute all additional collisions to
CRT sign changes and expect equality at prime moduli. That expectation is false.

| m | s=4m-1 | s prime? | P | E | P-E | Actual R |
|---:|---:|:---:|---:|---:|---:|---:|
| 132840 | 531359 | yes | 567 | 40 | 527 | 525 |
| 360696 | 1442783 | yes | 567 | 32 | 535 | 533 |

Both primality claims are checked by exhaustive trial division through
`floor(sqrt(s))` in both implementations. These are counterexamples to an
occupancy formula, **not** counterexamples to Erdős–Straus.

## 2. Exact collision kernel

Write

$$m=\prod_i q_i^{e_i},\quad s=4m-1,\quad
B=\prod_i([-e_i,e_i]\cap\mathbb Z),\quad
\phi(f)=\prod_i q_i^{f_i}\pmod s.$$

All factors are units because `gcd(m,s)=1`. The normalized residue set is
`R_s=-phi(B)`, and its size is denoted by `R`. Put

$$P=|B|=\prod_i(2e_i+1).$$

For `h=f-g`, define coprime positive integers

$$A(h)=\prod_i q_i^{\max(h_i,0)},\qquad
U(h)=\prod_i q_i^{\max(-h_i,0)}.$$

**Lemma (complete fixed-core criterion).** A nonzero difference produces a
collision if and only if

$$|h_i|\le2e_i\quad\hbox{and}\quad s\mid A(h)-U(h).$$

Equivalently, enumerate all coprime positive `A,U` with `AU | m²`, `A != U`,
and `A=U mod s`. This is an equivalence for the fixed finite box, not an
equivalence between this sufficient family and all Erdős–Straus solutions.

Proof: equality of the two unit ratios is precisely `phi(h)=1`, or `A=U mod s`.
The coordinate bounds are necessary for a difference. They are sufficient:
each interval of length `2e_i+1` realizes every integer difference from `-2e_i`
to `2e_i`. Coprimality means the exponents of `A` and `U` cannot overlap; then
`AU | m²` is exactly the doubled coordinate bound. QED.

This replaces an informal CRT-only model: the criterion works at primes too.

## 3. Proven lower bounds, and when the count is exact

Choose one orientation of each nonzero kernel vector by `A(h)>U(h)`, and put

$$w(h)=\prod_i(2e_i+1-|h_i|),\qquad W=\sum_h w(h).$$

**Lemma (energy).** If the occupied fibers have sizes `n_r`, then

$$\mathcal E=\sum_r n_r^2=P+2W,\qquad
\max\left\{1,\ P-W,\ \left\lceil\frac{P^2}{\mathcal E}\right\rceil\right\}
\le R.$$

Proof: a fixed difference has exactly `w(h)` ordered realizations, one for
each coordinate overlap. The two orientations together count twice the
unordered collision pairs. Hence `W=sum_r binomial(n_r,2)` and the energy
identity follows. Since `n-1 <= binomial(n,2)` for every positive integer `n`,
`P-R <= W`. Cauchy–Schwarz gives `P² <= R*Ecal`. QED.

Moreover `R=P-W` **if and only if every occupied fiber has size at most two**.
This follows from equality in the integer inequality above. There is no
independence assumption about the generators.

For the two prime examples, the complete positive kernels are respectively

$$\begin{array}{c|c|c|c}
m&h&A-U&w(h)\\\hline
132840&(5,4,1,1)&531360-1=531359&40\\
132840&(6,-8,1,2)&537920-6561=531359&2\\
360696&(5,1,1,1,1)&1442784-1=1442783&32\\
360696&(6,2,1,2,-2)&1455552-12769=1442783&2
\end{array}$$

Coordinates use the increasing prime factor order of `m`. The first vector
in each case is the old positive relation, the second is mixed-sign.
All fibers have size at most two; thus `567-42=525` and `567-34=533` exactly.
The corresponding energies are `651` and `635`. The new lower bound equals
the independently enumerated class count in these two cases.

## 4. An infinite polynomial collision family

**Proposition.** For every positive integer `d`, set

$$X=8(8d+1),\quad Y=16d+1,\quad
m=dXY=8d(8d+1)(16d+1),\quad s=4m-1.$$

Then

$$\gcd(dX,Y)=1,\quad dX^2-Y^2=s,\quad
-\frac{Y}{dX}\equiv-\frac{X}{Y}\pmod s.$$

Both ratios are admissible normalized pairs: `(a,u)=(dX,Y)` has `au=m`,
and `(a,u)=(Y,X)` has `au=m/d`. They are distinct and coprime.

Proof: `Y` is odd, `gcd(d,Y)=1`, and
`2(8d+1)-(16d+1)=1`, so both coprimality statements follow. Direct expansion
gives

$$dX^2-Y^2=4096d^3+768d^2+32d-1=4dXY-1.$$

The congruence follows after multiplying the two unit ratios by `dXY`.
The kernel pair `A=dX²,U=Y²` satisfies `AU=m²/d | m²`. QED.

In particular, `d=1` recovers `m=1224`; `d=5,7` give the two prime examples.
No claim is made that infinitely many moduli in this cubic family are prime.

### A sharper bound on the entire family

Let `a=v_2(m)` and let `E` be the earlier count

$$E=(a-1)\prod_{q_i\ne2}(e_i+1),\qquad a\ge2.$$

For this family `a=3+v_2(d)`. The universal vector is
`v=(a+2,e_odd...)`. Its in-box edges form a matching: two successive edges
would span `2(a+2)>2a` in the 2-coordinate.

Let `h` be the polynomial relation. Write `t=v_2(d)`. Then
`h_2=t+6`, and every prime factor of `Y` has `h_q=-2e_q`.
Thus its own edges also form a matching. Its edges cannot share a vertex with
a universal edge: `h+v` exceeds the allowed doubled 2-coordinate, while
`h-v` has coordinate `-3e_q` at any prime factor of `Y`, outside `[-2e_q,2e_q]`.
Signs reversed give the same exclusions. Such a prime exists since `Y>1`.

The overlap weight of `h` is exactly the divisor count `tau(d)`: the
2-coordinate contributes `t+1`, odd prime factors of `d` contribute `e+1`,
and factors of `8d+1` and `Y` contribute one. Their odd supports are disjoint.
The two sets of edges are therefore disjoint matchings with `E+tau(d)` edges.
Identifying these pairs already leaves at most that many fewer classes:

$$\boxed{R\le P-E-\tau(d)<P-E\qquad(d\ge1).}$$

Additional relations can lower `R` further. **Equality is not asserted for all
d.** This is an unconditional written family-wide bound, not extrapolation
from the nine replayed values.

## 5. A general norm-equation route for future classification

Every coprime kernel pair can be written uniquely as `A=alpha X²`,
`U=beta Y²`, with coprime squarefree `alpha,beta`. The condition `AU | m²`
implies `alpha beta XY | m`; write `m=t alpha beta XY`. Choosing `A>U`, let
`A-U=k(4m-1)`, with `k>0`. Then the exact necessary equation is

$$\alpha X^2-\beta Y^2=4kt\alpha\beta XY-k,$$

or, after completing the square,

$$ (\alpha X-2kt\alpha\beta Y)^2
-\alpha\beta(4k^2t^2\alpha\beta+1)Y^2=-\alpha k.$$

Conversely, positive integer solutions satisfying the stated coprimality and
factorization restrictions produce kernel pairs. The norm equation alone,
without those restrictions, is insufficient. A next attack can classify
small coefficient strata and derive kernel bounds without assuming generator
independence; it still needs a separate target-sensitive argument.

## 6. Discovery survey versus independent replay

The predeclared exploratory sweep `1<=m<=1,000,000` found ten additional-
collision rows: `1224, 8976, 29400, 68640, 132840, 228144, 360696, 394060,
536640, 762120`. Nine are the polynomial family for `d=1..9`. The remaining
`394060=1292*305` is the next known negative-Pell term. This description is
only a finite observation; it is not a complete unbounded classification.

Survey manifest of all newline-separated `[m,P,E,R]` rows:
`f1fe77739dab7ce8ca9eb9af1fb44ec23ffc40e5078975df71a79eb29cb680af`.

The independently replayed packet instead has only six full kernel atlases
(`m=1,4,36,1224,132840,360696`) and nine polynomial identity controls.
TypeScript enumerates signed vectors and doubled-box kernels using BigInt.
Python enumerates integer divisor pairs of `m` and `m²`, checks coprimality,
counts fibers directly, and uses a separate trial-primality implementation.
Both agree on every packet field. Independence is implementation-level;
this is neither a separate mathematician nor formal proof certification.

```sh
node --import tsx scripts/operations/erdos-straus-kernel-audit.ts
python3 -I -S -B scripts/operations/replay-mixed-core-kernel.py
python3 -I -S -B scripts/operations/survey-mixed-core-kernel.py
npm run test:unit -- tests/unit/math-mixed-core-kernel.test.ts tests/unit/math-mixed-core.test.ts --maxWorkers=1
```

Final packet digest: `e4d7b0a4c03ab08c80a6d8a032dc9c8f4d117dd611ac61d981ffd25eb2820cf4`.
Replay stdout digest (including newline):
`bf6996bd10eb734b0fce01646bc0a8c06fe59175905df28ca14de77bbfca14a0`.
Python source digest: `92414bdfe8bf351e19e07a4a6a7e6a4db322b279e2d34172643d52af54c30ec0`.

Historical app caps (`m<=4096`) and all pinned packets/replay scripts are
unchanged. The separate operational diagnostic cap is `m<=1,000,000`.
Verification: all 356 unit tests / 68 files PASS, including ten targeted tests
across the new and historical mixed-core suites; fresh typecheck and targeted
ESLint PASS. No new browser/E2E, integration suite, production build or
formal-kernel test was run for this research-only slice.
No user-controlled Python, paid calls, credentials, ledger writes, queue
startup, migration, UI mutation, commit/push or publication occurred.

## 7. Scientific boundary and prior art

The normalized divisor/Type II background is compared with
[Bello-Hernández–Benito–Fernández, divisor parametrization](https://arxiv.org/html/2606.10922v1).
The public author-owned
[signed-box note](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/ES-TWO-TARGET-SIGNED-BOX-EQUIVALENCE.md)
also illustrates why a box reformulation does not prove target hitting.
Its broader claims are not imported or independently verified here.
Searches for the specific cubic factors/prime example were inconclusive,
not evidence of originality. Energy inequalities here are elementary counting
and Cauchy–Schwarz, not claimed as new mathematical principles.

For `d=5`, the two additional collision classes are `505115,400139` modulo
`531359`; the named target remainders are `187448,319981`. For `d=7`, the classes
are `1391707,1085251` modulo `1442783`, while target remainders are
`139868,1021551`. These collision classes are not new rescues of the named
targets. This comparison does **not** test whether other classes of those
cores hit the targets.

The earned milestone is an infinite structural family correcting the occupancy
model and refuting its prime-modulus restriction. The missing breakthrough
criterion remains a proven target-sensitive hit/exclusion mechanism, followed
by formal and literature gates. These results have not been loaded into a
live agent cycle; the earlier fixed V1 evidence must not be described as
containing them.
