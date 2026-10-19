# Completion Report — TIP-044 primary theory and arithmetic

STATUS: DONE within A's proof-first local scope. Contractor final acceptance
and the six broader research/product gates remain separate.

## Scope, chronology and files

Read AGENTS, the durable TIP043 handoff, Vibecode Kit v6.2 and its focused-SCAN
guidance. The new contract was read completely before finite validation:
`2e7bd3aba80bcc5a9bc3e747f4cf8b85be25aad22c4cc42e71ec8036349896c7`,
frozen2026-10-03 01:42:35 UTC and added to the86-entry current manifest.
The hypotheses and named controls were already disclosed before that freeze;
the freeze registers subsequent validation, not blinded discovery.

Created only this report through apply_patch. No product/source/test files,
prior report, app/UI, DB, provider, queue, worker, dependency or Git writes.
Arithmetic ran in an ephemeral installed Node process, independently of B's
Python. No import of prior producers, factors, source implementations or
outcomes. No180-row campaign, new survivor cohort or root benchmark.

REQ-044-1–4 completed below; REQ-044-5 A report delivered, with Main/S final
acceptance and preservation checks separately attributed. No missing
implementation within this A slice; no claim to close broader gates.

## 1. Infinite mechanism-specific forced-power no-go

For every prime p=2521 mod9240, p=1 mod840 and p=2 mod11. Quadratic
reciprocity and the supplementary formula make2,3,5,7 residues modulo p,
but11 a nonresidue, since (p/11)=(2/11)=-1. Every positive integer below11
factors over2,3,5,7, so the least positive nonresidue is exactly11.
These are standard character identities, not new reciprocity:
[NIST DLMF27.9](https://dlmf.nist.gov/27.9).

Suppose prime h<p, h=3 mod4 and11 divides T=(p+h)/4. Necessarily h=9
mod11. The root-coupled character is (11/h)=(p/11)=-1. The full order
d=ord_h(11) is even and d=2 mod4 because h−1 has exactly one factor2.
The signed single-11 box with an AVAILABLE budget1<=e<=4 contains−1
exactly when d/2<=e. Therefore a hit requires d in{2,6}, and respectively
h divides12 or1332. Their factorizations are

$$
12=2^2\cdot3,\qquad1332=2^2\cdot3^2\cdot37.
$$

The only prime divisor3 mod4 is3, incompatible with h=9 mod11. Hence
every admissible h misses when using only11 with budget at most4. This is
an infinite root-family obstruction to this mechanism, not to the full
shift, all TypeII, TypeI or Erdős–Straus.

Available budget matters: forced divisibility by11^e does not impose an
upper bound on the actual valuation. If actual v11(T)>4 and all copies are
used, the theorem does not apply. Deliberately allocating at most4 copies
still satisfies the obstruction. No larger-budget classification was run.

Because gcd(2521,9240)=1, this progression contains infinitely many primes,
by [Dirichlet's original theorem, translated primary paper](https://arxiv.org/abs/0808.1408).
The finite sample below is a replay, not the proof of infinity.

For the second control p=41161 mod101640, p=1 mod840 and p=21 mod484.
The same smaller-prime reasoning gives least nonresidue11, while
p=−1 mod11. The least positive prime in h=−p mod44 is exactly23. Also
T=(p+23)/4=11 mod121, so v11(T)=1. Its legal one-factor image is
{1,11,21} mod23 and misses22. The progression is reduced, so the same
Dirichlet quantifier applies. Other factors can still rescue this shift.

## 2. Analytic bounds are guarantees, not impossibility theorems

The inherited classical bound q<=C p^alpha and Linnik exponent lambda
applied to modulus4q^e imply, for fixed e,

$$
h\le C_e p^{\alpha\lambda e}.
$$

This deduction guarantees h<p eventually only if the exponent is below1.
With the frozen values,0.16*5.2=0.832 works for e=1, whereas e=2 gives
1.664. The latter upper bound does NOT prove that a smaller prime cannot
exist. For fixed q,e the finitely many reduced classes have fixed least
primes, all eventually below p. Constants/cutoffs remain uncomputed; no
GRH is used or needed. The classical source statements and exact published
5.18 exponent are retained in TIP043; this slice does not upgrade them.

For coherent inert cosets let E be the sum of actual inert valuations,
d the anchor's QUOTIENT order, and q0 the root's least nonresidue. Every
inert prime is at least q0, so

$$
q_0^E\le\prod_{\mathrm{inert}\ i}q_i^{e_i}\le T<p/2.
$$

A projected hit requires E>=d/2, hence q0^(d/2)<=T. This is a necessary
size constraint, not a hit certificate or full-order pruning rule. An
actually paid split subgroup can reduce d; mere generated span cannot
pay the correction.

## 3. Classical root-bound Type I pivot, independently proved

The sufficient condition ad|T and h|4a²d+1 is the known specialization of
[Elsholtz–Tao v6, Proposition2.3 and equations2.6–2.8](https://arxiv.org/html/1107.1010v6),
not an invention. Define

$$
c=T/(ad),\quad v=(4a^2d+1)/h,\quad
b=cv-a=(pa+c)/h.
$$

Integrality follows from the first expression; the second proves b>a>0.
Since a,c,d<=T<p and bh=pa+c, none is p-divisible. Further,
4abd=pv+1 and a+b=cv give the cleared identity for
(T,bcd,abdp). Strictness follows from b>a and ap>c; exactly the last
denominator is p-divisible.

Writing a=product q_i^alpha_i and d=product q_i^delta_i requires
alpha_i+delta_i<=e_i. The congruence's2alpha_i+delta_i is algebraic
squaring, not duplicate allocation. For inert d, -1/(4d) is a square
modh, but its root must be an actual divisor a|T/d. Example61,7 has
d=17, modular roots2,5 and only available a=1: no paid norm correction.

For prime T=r,h>3, ad|r leaves(1,1),(r,1),(1,r). The first would require
h=5; the second contradicts the nonresidue character of−1; the last
requires4r=−1 modh. The TypeII coprime box instead requires r=−1 modh.
These targets are distinct, not exhaustive. This proof does not cover all
TypeI parameter choices outside this fixed first-denominator branch.

## 4. Exact finite arithmetic after freeze

One independent Node invocation completed the prescribed finite validation
under60s/5M logical-work/64KiB output. It charged142570 work units and
observed7.719ms through summary creation; final serialization/time/output
cap were checked before emission. Summary output was enforced <=65536 bytes;
an exact byte count was not surfaced. A resource stop would throw a PARTIAL
diagnostic rather than emit COMPLETE. No stop occurred. These are local
cooperative checks, not hard preemption or signed CPU attestation.

Work counts included trial primality/divisor/factor loops, character modular
power rounds, least-nonresidue search, order multiplication, signed powers,
pair trials, gcd rounds and witness checks. They do not count every native
BigInt multiplication, array copy, JSON byte or machine instruction.
Command: installed `node --input-type=module` with an in-memory here-document,
no file artifacts/imported arithmetic. B retains its separate executable
replay command in its own report.

### Registered progression lists

Each progression independently tests ALL101 integers, t=0..100, and checks
least nonresidue only for primes. No omitted composite is a failed assertion.

First progression2521+9240t:36 primes,65 composites,36 least-QNR checks:

```text
2521,21001,30241,76441,104161,141121,196561,252001,261241,
298201,316681,325921,335161,353641,372121,409081,418321,
436801,446041,464521,473761,547681,566161,575401,630841,
649321,667801,677041,704761,741721,750961,778681,797161,
843361,908041,917281
```

Second progression41161+101640t:31 primes,70 composites,31 least-QNR/CRT/
least-progression-prime/exact-valuation/image checks:

```text
41161,1057561,1159201,1260841,1667401,1769041,2175601,
2582161,2887081,2988721,3903481,4005121,4818241,5631361,
5733001,6241201,6444481,6647761,6749401,7155961,7460881,
7562521,7867441,8070721,8375641,8477281,8985481,9798601,
10001881,10103521,10205161
```

### Registered prime shifts and available budgets

The15 primes h=3 mod4<=127 excluding11 are
3,7,19,23,31,43,47,59,67,71,79,83,103,107,127. Their independently
multiplied full11 orders, in that order, are
2,3,3,22,30,7,46,58,66,70,39,41,102,53,63.

All60 h/budget pairs, e=1..4, checked the actual signed image and order
criterion: four hits only at h=3,56 misses. The only compatible h=9 mod11
in this range is31, and all its four budgets miss. The incompatible hits
are retained; they are not quietly removed to inflate the no-go.

### Five known proof controls, not discoveries

| p,h,T | Factorization of T | Registered conclusion / strict tuple |
|---|---|---|
|13,7,5|5|TypeI(5,10,130), TypeII coprime-box miss|
|61,7,17|17|Both named branches miss|
|157,7,41|41|TypeII(41,942,38622), TypeI norm miss|
|401,31,108|2²*3³|Paid-quotient TypeII(108,1604,10827)|
|2521,31,638|2*11*29|Full TypeII(638,55462,804199) using2,29, not the11 atom|

All five p/h primalities and T factorizations checked. All FOUR registered
positive tuples independently pass positivity, strict ordering, exact
4xyz=p(xy+xz+yz), and their prescribed p-divisibility counts:1,2,2,2.
The last control has(u,v,k,A)=(2,29,11,1), so the root-family mechanism
no-go cannot be promoted to a full-shift exclusion.

At401,31 the full3 order is30, while the paid2² support covers
L={1,2,4,8,16} and reduces the3 quotient order to6. Inert budget3 suffices;
raw3³/2² reaches−1 and whole inversion gives(u,v)=(4,27). This explicitly
falsifies using full order30 to exclude a paid-quotient hit.

The helper also evaluated both local branches within the SAME five frozen
controls: canonical TypeI allocation counts[1,0,0,2,1] and TypeII counts
[0,0,1,1,1] after u<=v normalization. Unnormalized TypeII counts were
[0,0,2,2,2]. Auxiliary TypeI allocations at401 are(1,54,2,7,13) and
(3,6,6,7,39), both yielding(108,1404,281502); at2521 the allocation is
(2,29,11,15,163), yielding(638,51997,23833534). These additional replay
facts use no extra root and are not new selected results or discoveries.

The canonical scientific snapshot SHA is
`d056325d96d7dda9ca3dceb1ee1a53702e6865f4ad32bab858828eac25f1273b`.
It excludes runtime and retains progression prime lists, h/order/budget
records, all named branch allocations and paid quotient data. B's differently
schematized digest need not equal it: actual common arithmetic facts do.
B explicitly confirmed both prime lists/counts, all orders, all branch
counts, registered tuples and quotient facts; B observed81191 work/29ms.
Different work counters do not rank algorithm/model efficiency.

## Acceptance, issues, preservation and suggestions

AC1–3 rigorous derivations above, AC4 independent finite facts agree with B;
Main/S proof and source review remain authoritative acceptance records.
AC5 within A: one new report only, no excluded mutations. Main owns full
54 old-pin/founding/current-manifest verification. No fresh typecheck, lint,
product build or unit suite was run by A in this documentation-only slice;
TIP043's827-test pass is historical, not new technical acceptance.

No discovered arithmetic contradiction or resource failure. Precision limits
are explicit: available-vs-forced valuation, whole-vs-quotient order,
modular-square existence-vs-paid divisor, local-vs-root impossibility.
The only implementation choice is ephemeral Node rather than persistent
tool/test code, exactly allowed by the contract. No method/input/cap tuning
after results. Known hypotheses/control outcomes are not registration-blind.

Suggested next research obligation: prove a root-coupled supply condition
realizing the modular square root as a DIVISOR of T/d, or prove actual paid
TypeII correction on disjoint support. Merely enlarging shift menus,
invoking an order distribution theorem or repeating exposed hit recovery
does not close that obligation. Universal root existence, novelty clearance,
formal/expert review, governed agent/UI admission, uncontaminated equal-budget
model evaluation and product E2E remain deferred. Root NOT_ESTABLISHED.
This is a rigorous barrier to a narrow mechanism and a classical pivot,
not a new solution or claimed breakthrough.
