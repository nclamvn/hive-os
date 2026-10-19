# Completion Report — TIP-043 primary

STATUS: DONE within Builder A scope — implementation, proof draft, focused
checks and post-checkpoint truth complete. Final Contractor acceptance and
the six broader research/product gates remain separate.

## Ownership and requirement coverage

Created only:

- `scripts/operations/inert-direction.ts`: independent bounded TypeScript
  arithmetic, paid split representations, five local decisions and witnesses.
- `scripts/operations/inert-direction-audit.ts`: fixed no-argument local CLI.
- `tests/unit/inert-direction.test.ts`: 25 focused scenarios.
- This completion report, including the requested proof draft. Main owns the
  final operations note, manifest, verification and handoff.

REQ-043-1–3 implemented. REQ-043-4 post-checkpoint independent truth completed.
REQ-043-5 scoped preservation observed; Contractor will verify all49 old pins.
No old producer, mathematical implementation, outcome or checker imported.
No app/UI, database, worker, provider, deployment, dependency or Git writes.
The Next.js guide is not relevant to these standalone non-app files.

## Proof draft: root-coupled quadratic character

Let p be prime, p=1 mod4, and let h<p be prime, h=3 mod4. Set
T=(p+h)/4. For an odd prime q dividing T, neither q=p nor q=h, and
h=-p modq. Quadratic reciprocity gives

$$
\left(\frac qh\right)
=(-1)^{(q-1)/2}\left(\frac hq\right)
=(-1)^{(q-1)/2}\left(\frac{-p}{q}\right)
=\left(\frac pq\right).
$$

For q=2 the root label is the supplementary character
chi_p(2)=(-1)^((p²−1)/8), not a Legendre symbol with even denominator.
If2 divides T then h=-p mod8, which leaves that supplementary character
unchanged. Thus every shifted factor's split/inert character is determined
by p, even though its actual residue and quotient direction can vary with h.
For p=1 mod840 the primes2,3,5,7 are all split. This is elementary classical
reciprocity, not a new theorem or sufficient solution criterion. Primary
reference: [NIST DLMF27.9, equations27.9.1–3](https://dlmf.nist.gov/27.9).

## Proof draft: asymptotic inert supply, not a hit theorem

Let q=n1(p) be the least positive quadratic nonresidue modulo p. Minimality
and multiplicativity make q prime: if q were composite every smaller prime
factor would be a residue, contrary to its character. Also q<p. For a
residual prime p=1 mod840, q is odd and exceeds7.

For every fixed epsilon>0, Burgess's classical bound is
n1(p)<=C_epsilon p^(1/(4sqrt(e))+epsilon), uniformly for odd prime p.
This precise quantifier is recorded in Banks–Guo, introduction equation1.1;
their Theorem1 is stronger and also suffices with k=1 for sufficiently large
p. Choose epsilon=0.16−1/(4sqrt(e))>0, so q<=C_B p^0.16. Primary source:
[Banks–Guo, Quadratic nonresidues below the Burgess bound](https://arxiv.org/html/1511.05523v1).

The residue class -p modulo4q is reduced. Xylouris's published Theorem1.1
(Acta Arithmetica150(2011), p66) bounds the least prime in every reduced
class by C_L M^5.18, with an absolute constant. Conservatively weaken5.18
to5.2 and apply it to M=4q. The resulting prime h satisfies h=3 mod4,
q divides (p+h)/4, and h<=C p^0.832<p for every sufficiently large p.
The exact published exponent would instead give0.8288. Primary source:
[Xylouris, On the least prime in an arithmetic progression, Theorem1.1](https://www.impan.pl/shop/publication/transaction/download/product/83078).

Because p=1 mod4, reciprocity gives (p/q)=(q/p)=-1, and the previous
identity makes q an inert factor for this h. Constants are independent of p
after epsilon is fixed; neither their numerical value nor a numerical
cutoff was derived. There is no GRH, finite-root admission, character-density,
valuation or hit guarantee hidden in this argument. It is a derived
classical corollary, novelty unestablished, not a proof of Erdős–Straus.

## Proof draft: exact inverse-direction obstruction and paid sufficiency

Write the distinct prime factorization T=product q_i^e_i. Let G=U(h), a
cyclic group of order h−1=2 times an odd number. Generate L from the SPLIT
factor residues only. L lies in the quadratic-residue subgroup and has odd
order. Generating L does NOT pay its signed factor box.

If there are no inert factors, every legal ratio stays in the residue
subgroup whereas -1 is a nonresidue; the shift locally misses. Otherwise
let a be the residue of the smallest inert prime. Suppose every inert coset
lies in {aL,a^-1L}. Put d=ord(aL), E=sum of the inert valuations. In the
d=2 tie choose direction+1. The nontrivial quadratic character descends to
G/L, so d is even, d=2 mod4. The quotient is cyclic, and its unique
involution is both (-1)L and a^(d/2)L. In general d is strictly smaller
than the ambient quotient index; they must not be identified.

For each coherent factor the exponent contribution is the full integer
interval[-e_i,e_i], irrespective of its inverse orientation. Summing these
integer intervals produces EVERY integer in[-E,E]. Consequently the
projected legal image is exactly {a^tL:-E<=t<=E}. Reaching a^(d/2)L is
equivalent to E>=d/2. E<d/2 therefore proves a local MISS of this
coprime-divisor Type II shift, without computing its full image. It proves
nothing about another shift, Type I or the original conjecture.

When E>=d/2 and the split signed box actually equals L, greedy bounded
allocation of d/2 to ascending inert factors produces an inert product w
in the target coset. The correction (-1)/w belongs to L and has a retained,
legal split-only representation. These supports are disjoint, so joining
the two vectors spends no valuation twice. Whole-vector inversion, if
u>v, preserves target-1 and records its orientation. With

$$
u=\prod_{z_i>0}q_i^{z_i},\qquad
v=\prod_{z_i<0}q_i^{-z_i},\qquad
k=\frac{T}{uv},\qquad A=\frac{u+v}{h},
$$

u,v are positive coprime integers, k and A are positive integers, and the
sorted denominators from (T,Apuk,Apvk) are strict, exactly two p-divisible,
and satisfy 4xyz=p(xy+xz+yz). The producer rechecks that exact BigInt
identity. The witness is constructive, not a global minimum pair.
When coherence fails, UNDETERMINED is retained. In the coherent positive
branch E>=d/2, absence of full paid-L coverage also remains UNDETERMINED:
full split coverage is sufficient, not necessary for a particular legal
correction. The earlier coherent E<d/2 local MISS remains valid even when
L is unpaid. This is an elementary conditional group argument, not a
new method-policy fallback or a universal root-supply theorem.

## Implementation and resource semantics

The split image is complete using only split support. Signed DP retains
the numeric-lex smallest ORDERED (u,v) per residue: multiplication by a
fixed new factor choice preserves pair ordering, so dominance elimination
is sound. It never sorts u,v at an intermediate stage. Unused and repeated
valuation mass is retained. L is generated separately; character labels
are recomputed by root and shift formulas and equality is checked.

Default caps are60s/180rows/2M state insertions/50M work/8MiB. Only tighter
positive finite caps are allowed; integer caps are integral, output cap
must be at least4096. Unknown options and future clock origins are rejected.
The clock starts at invocation, or at the earlier trusted CLI origin before
dynamic module loading. All primality/factor/modular/subgroup/image loops
pay/check work; state insertion is checked before exceeding its cap.
Ordinary fixed-size metadata, array copies, BigInt operations, hashing and
serialization are not individual CPU-step attestations. Their elapsed time
is observed through finalization. The caps are cooperative local limits,
not hard preemption or signed executable/CPU evidence.

Completed rows form an atomic ordered prefix. A partial row is never
retained as a certificate. Output trimming removes only a suffix; a
deadline first observed after full rows retains PARTIAL/FINALIZE rather than
COMPLETE. Earlier partial reasons and pending scopes remain intact.
Rows/content fingerprints exclude runtime; runtime records actual observed
counters and a JSON output-byte fixed point. No sealed agent admission is
introduced by this script or its fingerprints.

## Chronology and actual method-only output

Frozen TIP SHA:
afa95e7d3939795128eeeee0307af307411d6b290b40d9e0769840692966bed2.
A and B explicitly agreed wire, deterministic representations, five enums,
scope, no-inert vacuous coherence and resource domains BEFORE either
method campaign. No-inert coherent=true is only empty-set bookkeeping:
anchor/d are null and directions empty, not a direction theorem assertion.

Both method-only producers completed180 rows with content
99aedb00bc75c12ed2de7ee74a175c93c5da1cf9ba171c1107114e1b536da1f2
and rows e73c247f2ab46d32971a126d04925451db00b3a20c9e5835d83fc07c060d52d0.
Counts:61 NO_INERT_LOCAL_MISS,8 COHERENT_SHORT_LOCAL_MISS,
40 COHERENT_PAID_SPLIT_HIT,68 COHERENT_UNPAID_UNDETERMINED,
3 INCOHERENT_UNDETERMINED. First primary method run103ms,
15158 states/1603242 work/307351 bytes. Actual repaired CLI also completed
with the same scientific content,104ms/307351 bytes. These are exposed
development decisions, not held-out benchmark scores or new root results.
Main opened the chronology gate at2026-10-02T02:58:19.974Z only AFTER fresh
actual A and B CLIs both exited0 and completed180. Main directly deep-compared
ALL scientific fields and rows, not hashes alone, and observed unchanged
pre/post source bytes. Main observed TS104ms and Python436ms; their counters
differ by algorithms and are not equal-budget efficiency evidence.

Only after this explicit checkpoint A ran an independent inline Python
trial-factor and full positive coprime divisor-pair truth enumerator on all180
rows. Every61 no-inert and8 short local MISS was actually absent; every40
paid HIT was present. The unpaid UNKNOWNs split33 hits/35 misses; incoherent
UNKNOWNs split1 hit/2 misses. Total74 actual hits and106 misses; no false
HIT or MISS. The71 UNKNOWNs therefore demonstrably cannot be treated as
negative decisions. The truth audit used99252 ordered divisor checks,
198ms including TS input/wait, with record SHA
aec4a947a7cd0963fefdacfa706163a3da16eb968c1068e793bbfc67cdae3169.
This audit makes no speed/equal-budget or new-score claim. No inheritance
of TIP-042 certificates, no outcome-driven tuning and no extra root were used.
A second independent Python integer audit replayed all40 positive vectors,
valuation bounds, whole inversion, reconstructed u/v, uvk=T, u+v=hA,
coprimality, sorted strict denominators, exactly two p-divisible entries and
4xyz=p(xy+xz+yz):40/40 passed with0 failures.

The SCAN's211023 exploratory abstract checks preceded this contract, disclosed
to Main:1392 short-obstruction cases,25995 paid sufficiency cases,0 violations.
They are hypothesis checks, not preregistered acceptance/held-out observations.
Registered abstract tests separately cover no inert, inverse directions, d2
tie, d below index, threshold equality/below, positive-character hit,
unpaid miss and unpaid hit, incoherent hit/miss, and paid correction.

## Actual checks and failure history

- Direct Node Vitest focused:25/25 PASS,787ms, start09:57:53+07.
- Full TypeScript check and three-owned-file ESLint after CLI repair exit0.
- Whole-suite, prior49 pins, B proof/source/replay and S/Main post-checkpoint
  classifications remain Contractor acceptance checks, not invented here.

An initial TypeScript cap-option type inferred readonly literal defaults;
changed the public option type to a numeric keyed record. No runtime
resource widening. Contractor's actual CLI check exposed a real CJS
top-level-await transform failure; changed only to an async IIFE and added
an actual positive CLI regression. The earlier negative-argument test alone
was insufficient because transform failure could make it pass. Fixed CLI
exit0 was observed before claiming that acceptance scenario. No source or
method change was driven by campaign truth, which remains sealed.

## Fingerprints and remaining obligations

Primary9530d76f180678288909abc55bc2dad53396e695c66fd457c7816d0949db6feb.
CLI ebeda98e1720940992eb4013f6e38b9be55f03ca4ce0dfb45e6d85d4a7159510.
Test fe7597762636f2887f54fb9f27d90934f4c9c5797cb687de3ef5cf266ab0df78.
Report hash is supplied outside the self-referential document after freeze.

No novelty or breakthrough claim. Asymptotic inert supply does not force
enough valuation E, coherent direction, escape from a thin direction or
paid split coverage. The next mathematical obligation is a root-bound
factor-supply/target-image argument, not another blind menu or assumed free
lift. Six broader gates remain: unbounded root supply; prior-art/novelty
acceptance; formal/external review; governed tool/UI/agent admission;
uncontaminated equal-budget live-model comparison; product E2E/integration.
Original Erdős242 root remains NOT_ESTABLISHED. No UI/render/live E2E claim.
