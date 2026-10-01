# Mixed-core milestone and a collision-model falsification

Date: 2026-10-01. Local read-only diagnostic. No paid API, publication, push,
agent-ledger acceptance, formal-proof claim or root-coverage promotion.

## 1. Exact minimum support for two named hard primes

The family is exactly the previously declared normalized construction:

\[
s=4m-1,\quad \gcd(a,u)=1,\quad au\mid m,\quad s\mid ap+u,
\quad v=(ap+u)/s,\quad k=m/(au).
\]

It yields

\[
\frac4p=\frac1{uvk}+\frac1{apuk}+\frac1{apvk}.
\]

Define support as the number of **distinct primes dividing m**, not the number
of primes dividing s, the number of agents, or the size of the denominators.

| p | All single-prime cores | Two-prime-core witness | Minimum support in this family |
|---|---|---|---|
| 131433121 | No eligibility, finite replay + proven tail | m=36=2²3², s=143, a=4, u=9 | Exactly 2 |
| 159727681 | No eligibility, finite replay + proven tail | m=284=2²·71, s=1135, a=4, u=71 | Exactly 2 |

The lower-bound certificate is described in
[the single-core exclusion report](MATH_PILOT_SINGLE_CORE_EXCLUSION_2026-10-01.md).
For support zero, m=1 gives s=3 and only residue 2, while these primes are 1
modulo 3. For support one, the complete prior audit checks 1180 and 1277
candidate moduli respectively; s>2p+1 is excluded by the proven minimum-residue
bound. The remaining degree-one bases are exhausted by divisors of p+1,
p+4 and 4p+1, not by a finite arbitrary base cutoff.

For the second prime v=562917, k=1, and the exact strict identity is

\[
\frac4{159727681}=
\frac1{39967107}+\frac1{45362661404}+\frac1{359653708021908}.
\]

For the first prime v=3676451, k=1, and the sorted denominators are
33088059, 4731592356, 1932829716534284.
Both witnesses have three positive distinct denominators and exactly two
denominators divisible by p, checked by integer cross-multiplication.

The positive controls p=351121 and p=171348241 have minimum support **1**.
The presence of a two-core witness must never automatically promote support
to 2. In particular, a failed bounded two-core search is UNRESOLVED, not a
global exclusion. p=159727681 misses this subfamily through s=1134 and hits at
1135. Its previously found unrestricted first witness at s=791 uses three
prime factors of m; there is no contradiction and no denominator-optimality
claim. These are instance-specific structural results, not newly covered primes.

## 2. A general, proven upper bound for modular occupancy

Write

\[
m=2^a\prod_{i=1}^t\ell_i^{b_i},\quad
s=4m-1,\qquad \ell_i\text{ odd primes}.
\]

Each normalized coprime pair corresponds uniquely to a signed valuation
vector f in the integer box

\[
B=[-a,a]\times\prod_i[-b_i,b_i],\qquad
R_s=\{-2^{f_0}\prod_i\ell_i^{f_i}\bmod s:f\in B\}.
\]

There are P=(2a+1)∏(2b_i+1) vectors. If a≥2, the vector

\[
v=(a+2,b_1,\ldots,b_t)
\]

is a modular kernel vector, because 2^(a+2)∏ell_i^b_i=4m≡1 modulo s.
Join each f to f+v when both are in B. Each vertex has at most one incoming
and one outgoing edge. All coordinates of v are positive, so there are no
cycles. The graph is a disjoint union of chains. Its number of edges is

\[
E=(a-1)\prod_i(b_i+1).
\]

Every chain maps to a single ratio class. Hence the number of components is
P−E and

\[
\boxed{|R_s|\le(2a+1)\prod_i(2b_i+1)-(a-1)\prod_i(b_i+1).}
\]

For a=0 or 1 there are no such in-box edges and the stated diagnostic uses
the trivial P bound. For a pure dyadic core with a≥1 this reduces to the
previous exact a+2 class count. For mixed cores it is **only an upper bound**.
It provides neither a lower bound on coverage nor a guarantee of hitting p.

At m=36 (a=2,b=2), P=25,E=3 and |R_143|=22. These are three unavoidable
collisions, so treating all signed assignments as independent classes is false.

## 3. Pell collisions: equality with this upper bound is false

The full finite diagnostic m≤1024 found |R_s|=P−E in every case. It would be
unsound to extrapolate that observation. At X=72,Y=17,

\[
(X-2Y)^2-5Y^2=-1,\quad
m=XY=1224=2^3 3^2 17,\quad s=4XY-1=4895.
\]

The Pell identity gives X²−Y²=s, so the reversed coprime pairs
(a,u)=(72,17) and (17,72) yield the same modular class:

\[
-17\cdot72^{-1}\equiv-72\cdot17^{-1}\equiv3739\pmod{4895}.
\]

Here P=105, E=12 and the known-relation bound is 93, but direct enumeration
gives **92** classes. The difference of the two signed vectors has mixed
signs, whereas any nonzero multiple of v has only one sign. Thus these two
vectors belong to distinct chains and merge their images: an additional
collision not explained by the universal positive kernel vector.

This is a counterexample to the **counting equality**, not to Erdős–Straus.
Nor is this collision class a rescue for the named residual primes: it is
−1 modulo 5, incompatible with their 1 modulo 840 constraint.

### An infinite mechanism, not just an isolated small example

Start with (w,Y)=(2,1) and repeatedly apply

\[
w'=9w+20Y,\qquad Y'=4w+9Y,\qquad X=w+2Y.
\]

Direct expansion preserves w²−5Y²=−1. X is divisible by 4, Y is odd,
X>Y>0 and gcd(X,Y)=1 (a common divisor would divide −1 in the Pell identity).
After the initial (X,Y)=(4,1), every pair has X,Y>1 with disjoint nonempty
prime supports. The corresponding reversed signed vectors have mixed-sign
difference and cannot lie in one universal-relation chain. Therefore this
infinite sequence produces |R_(4XY−1)|≤P−E−1.

Also s=(X−Y)(X+Y) has two coprime odd factors. The collision residue is −1
modulo X−Y and +1 modulo X+Y. This identifies an explicit CRT/order-two
mechanism that any mixed-core occupancy model must allow. It does not assert
that every additional collision is Pell-generated or classify all kernels.

## 4. Reproducible checking and UI

New diagnostics do not alter the source, cap, hashes, or claims of the prior
character/occupancy atlases and raw divisor-led replay.

- `math-mixed-core.ts`: signed valuations, exact strict witness checking,
  minimum support from the complete single-core exclusion plus an upper witness.
- `replay-mixed-core.py`: isolated stdlib Python, independent integer factor
  pairs and trial divisor/primality enumeration; no TS imports or supplied code.
- `math-mixed-core-replay.ts`: fixed script, pinned source hash, no user args,
  10-second timeout, 256 KB output cap, allowlisted environment, full projection
  equality including unknown-field rejection. Mismatch/unavailable is not accepted.
- UI: authenticated `research.read`, development/test only, read-only structural
  panel at `research/math-tools#mixed-core`, bilingual and KaTeX-rendered.

The new collision diagnostic accepts 1≤m≤4096, separately from the historical
s≤4095 search. The infinite statement above is a written proof, not an
unbounded computational search and not a Lean certificate.

Independent outputs match all four support controls, strict identity hashes,
single-core row manifests, 1024 finite occupancy rows, and the Pell counterexample.
Finite row SHA-256:
`3a8e118d48f546752e9622a4eb7357a9fc398ea2a03ad0cbd8ff81ca8518e81a`.
Pinned Python source SHA-256:
`9da0dfd3774d9ea2162d5a31fd18c3d82d398ecf918ccae19acfbfffa64297a5`.
Pell residue-set SHA-256:
`a4054f3642f88787678280598e0467e95a35d40017771155171ec8126f618996`.

Reproduce from the repository root:

```sh
node --import tsx scripts/operations/erdos-straus-mixed-core.ts
python3 -I -S -B scripts/operations/replay-mixed-core.py
npm run test:unit -- tests/unit/math-mixed-core.test.ts --maxWorkers=1
```

Verification in this turn: 343 unit tests in 66 files passed (maxWorkers=1),
typecheck and targeted ESLint passed, `git diff --check` passed. Authenticated
browser form rejected composite p=841 without computing either packet, then
the valid p159727681/s791 request matched both the unchanged raw replay and
the new full structural replay. Formula rendering had zero KaTeX errors and
no document-level horizontal overflow at the observed 1366px desktop viewport.
No mobile, production, full integration-suite, or autonomous agent-ledger E2E
certification is implied by this browser diagnostic.
The direct Node import entry point avoids the tsx CLI's IPC pipe, which the
local filesystem sandbox rejected; no sandbox weakening was needed.

## 5. Literature and acceptance boundaries

Divisor parametrization and signed-box formulations already have public
precedents. Consult the primary preprint
[Bello-Hernández–Benito–Fernández](https://arxiv.org/html/2606.10922v1),
and the author-owned, non-peer-reviewed
[signed-box notes](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/ES-TWO-TARGET-SIGNED-BOX-EQUIVALENCE.md)
and [prior-art calibration](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/SQUARE-COMPLETION-PRIOR-ART.md).
Their variables, core, modulus and completeness assertions must not be
transferred to this narrower normalized family without a proof of equivalence.
No priority claim is made for the bound or Pell mechanism here; a targeted
publication-grade novelty review remains open.

The useful milestone is a rigorous **complexity classification of two hard
instances plus falsification of an overstrong occupancy model**. The root
conjecture, uniform mixed-core coverage, complete collision-kernel
classification and independent formal proof remain unresolved.

Next research should study the kernel beyond the positive relation, distinguish
prime from composite moduli, and seek a proved lower bound or targeted hitting
criterion. An upper bound alone cannot justify a rescue theorem. Before
autonomous reuse, this packet must enter the actual agent evidence protocol with
independent replay and explicit rejected-hypothesis routing; the current panel
does not silently create that acceptance or claim a closed agent E2E loop.
