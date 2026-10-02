# Exact occupied-half density — 2026-10-02

## Scope and chronology

TIP-042 adds a sufficient certificate to the exact 191 TIP-041 development
rows, without changing a root, shift, mask, baseline certificate or previous
source. All 191 are exposed. The retained label `PRIMALITY_ONLY_120` names the
historical cohort, not a presently held-out test. The original Erdős problem
242 remains **NOT_ESTABLISHED**.

The contract was frozen as
`8f633bc61a0c5a14127bd02418d1039b238660bdd74badbf246861f6d59ea402`
before this campaign. Previously observed P1_h79 occupancy motivated the
proposal; it is disclosed hypothesis-generation evidence, not a new discovery.
The policy nevertheless evaluates every eligible row in the frozen order.
Before outputs, the two Builders agreed that inherited density allocation is
0/0/0 (not applicable); the embedded baseline preserves its original allocation.

A generated all 191 decisions, B independently generated all 191, and Main
checked direct equality of inputs, every new row, summary and every embedded
baseline row. Both semantic digests matched. Only then Main explicitly permitted
retrospective gain and truth analysis. The B Python checkpoint hash was
`642bcd27a36e6b3cee93d54ca7b84ec690b7192fbe72ccf8ea95c12650cb0dc7`;
it was a checkpoint, not a claim of final source freeze. Subsequent wrapper
hardening and final source validation are separate acceptance work. No truth
result altered inputs, method, partition selection, caps or witness selection.

## Sufficient theorem, not an exclusion theorem

Let G=U(m). Let K be a subgroup whose entire set already has legal constructive
representations using spent factor support J. Let the two remaining supports
I_A and I_B be disjoint from one another and J. Their complete signed boxes
produce occupied subsets S_A and S_B of the **same full quotient** Q=G/K.
For any target t in Q,

$$
|S_A|+|S_B|>|Q|\quad\Longrightarrow\quad
S_A\cap tS_B^{-1}\ne\varnothing.
$$

Proof: inversion and translation are bijections. If the intersection were
empty, the disjoint union would have size |S_A|+|S_B| inside Q, a contradiction.
This elementary pigeonhole argument is standard, not a novel theorem.

For the target t=(-1)K, choose a matching pair of cosets only **after** the
strict inequality is true. If their actual represented residues are a,b, then
c=-1/(ab) lies in K. Use the stored legal representation of c, not an abstract
membership claim. Add the three exponent vectors on disjoint supports. For
factorization T=product q_i^{e_i}, this gives

$$
z_i\in[-e_i,e_i],\qquad
u=\prod_{z_i>0}q_i^{z_i},\qquad
v=\prod_{z_i<0}q_i^{-z_i},\qquad
\gcd(u,v)=1,\quad uv\mid T,\quad u+v\equiv0\pmod m.
$$

Whole-vector inversion, if needed, swaps u and v without consuming any extra
valuation. Normalizing each half separately would change the chosen quotient
match and is not admitted. Set k=T/(uv) and A=(u+v)/m. Since 4T=p+m,

$$
\frac1T+\frac1{Apuk}+\frac1{Apvk}
=\frac1T+\frac{u+v}{Apuvk}
=\frac1T+\frac m{pT}=\frac4p.
$$

The registered p,m have m>2 and T<p, so a target pair cannot have u=v;
after inversion u<v. Also v<=T<p, so T<Apuk<Apvk. The implementation still
checks strict sorted denominators, exactly two p-divisible denominators and
the cross-multiplied identity using BigInt for every produced certificate.
It stores a constructive witness, not a globally minimum witness.

There is no converse: equality can have a hit or miss, and many sparse boxes
have hits. `NOT_CERTIFIED` is not `MISS`, an exclusion, or a failed conjecture.
Represented incomplete subsets may themselves prove a sound positive density
implication; they are not the registered complete/canonical half evidence and
cannot support the registered negative measurement. Fake and duplicate entries
must never inflate occupied cardinality.

## Fixed algorithm and execution authority

The fresh pinned baseline appears once in the packet. Its certificate-bearing
rows become `INHERITED_CERTIFIED`, without rewriting mechanism or claiming a
new density certificate. For baseline `NOT_CERTIFIED` rows, scan original
ascending half masks; the lower unused bit is always on A. Retain all attempted
decisions and the baseline row, attempt and two half digests. Stop at the first
strict occupied-count inequality. Then scan increasing canonical A cosets,
find the canonical target/B coset, and use the retained ordered numeric-lex
half representatives and actual paid K correction. There is no direct target
oracle in deciding eligibility and no alternate split chosen for a nicer tuple.

Semantic equality binds inputs, policy, baseline science/rows digests, new rows
and summary. The top packet digest also binds actual embedded baseline limits,
source observations and runtime. Producer-specific timings/counters are not
part of semantic equality. The approved fixed complete baseline content binds
all retained frequencies/representatives; coherent rehashed histogram changes
are rejected by that protected finite identity, not admitted as scoped PASS.

TS starts its clock before dependency reads and dynamic loading. It hashes all
three immutable baseline sources before/after loading and after generation.
This is local trusted-workspace consistency, **not** an executable-byte signed
attestation: an already cached module is not authenticated by a filesystem hash.
Fresh Python separately verifies and executes its pinned baseline bytes and
reconstructs legal positive coprime divisor halves before its own density scan.
Scoped validation is not a substitute for fresh replay, formal proof checking
or external mathematical review. PATH-selected Python and counters remain local
collector trust, not authenticated interpreter/CPU attestation.

## Quantified frozen result

Both complete method packets have content
`e9fcbee161256e09693a27100aee3571a785376155cf0ddd4de5c3ea9b24056b`
and new rows
`0ebd2ae6ea4bcb6271b313f34fa45424976425f8e2621c9ff59d87286d2a8ab5`.
The preserved baseline is content `4d00cb143ae028bcda5f636df617c049ed4d006bcd54bed3f585c1c58e048347`
and rows `e51794b81610642e49920bd9016835891f046d909de7a00ecdd0da61e52c5bee`.

| Exposed cohort | Rows | Inherited | New density | Still not certified |
|---|---:|---:|---:|---:|
| Original 71 | 71 | 4 | 1 | 66 |
| Historical new 120 | 120 | 31 | 7 | 82 |
| Total | 191 | 35 | 8 | 148 |

After the A/B agreement gate, Main freshly reconstructed independent truth:
old 11 hits/60 misses; historical new 63 hits/57 misses. Its diagnostic records
digest is `90228ef75a5034411705cfa5463080b1716547149a5d6c53c8e942bc24b4cbaf`,
with 24,618 pair candidates, 1,891,054 work ticks and 1,460 ms including fresh TS.
This is a separate truth budget and a disclosed Main receipt, not an A oracle run.
There were no lost or false certificates. Known-hit recovery rose from 35/74
to 43/74 (58.11%); 31 known-hit rows remain uncertified. All 117 truth-miss rows
remain uncertified. A failing sufficient predicate cannot distinguish these two
classes without the separately evaluated truth tool.

All eight gains, with constructive (u,v,k,A), are retained:

| Row | u | v | k | A |
|---|---:|---:|---:|---:|
| P1_h79 | 1 | 6161 | 8140 | 78 |
| N2_h83 | 57 | 290941 | 3 | 3506 |
| N3_h47 | 3594 | 13843 | 1 | 371 |
| N4_h47 | 3 | 29936 | 554 | 637 |
| N5_h23 | 1 | 8292971 | 6 | 360564 |
| N5_h47 | 207 | 60094 | 4 | 1283 |
| N5_h71 | 1651 | 5023 | 6 | 94 |
| N6_h83 | 1 | 182267 | 273 | 2196 |

These are finite mechanism gains on exposed inputs, not eight new open-problem
solutions, uncontaminated benchmark successes or novelty evidence.

## Resource and failure ceiling

One shared 60-second deadline includes dependency I/O/loading, baseline,
density work, hash/seal and output checkpoints. Tighter total state/work/output
limits are passed into the unchanged baseline; its actual lower declarations
remain embedded and are not rewritten to default limits. Baseline counters
seed the extension counters. Row caps apply only to the 191 campaign rows.
The separate immutable-checker ceiling is 50M; uninstrumented validation,
serialization and source hashes are time-accounted, not falsely assigned known
producer tick costs. Synchronous checkpoints do not guarantee universal hard
preemption or identical CPU work across languages.

Representative primary run: baseline 33,932 states/344,702 work, extension
976 states/2,315 work, total 34,908 states/347,017 work, zero enumerated pairs,
889 ms and 2,950,495 JSON bytes. Fixed CLI exit0 retained the same semantics,
1,002 ms/2,950,496 packet bytes (one trailing stdout newline is additional).
These are observations, not hard universal speed claims or equal-budget scores.

Base exhaustion stops before campaign row1. Rows are retained atomically;
state/work/time failure preserves an ordered prefix. Late completion becomes
PARTIAL/FINALIZE. Output trimming removes a suffix; if full baseline cannot fit,
the diagnostic explicitly omits it, contains no campaign rows/certificates,
and is BASELINE-phase nonadmitting. PARTIAL never PASS. The minimum lowered
output cap is 32,768 bytes. No source or cap was changed to rescue an outcome.
Final collector review additionally refreshed elapsed after partial output
trimming and canonicalized received baseline timeout diagnostics; independent
clock regressions pass. These are receipt repairs, not scientific decisions.

## Controls and next root bridge

Tests cover strict C6 equality with and without hits, duplicate/fake entries,
wrong smaller ambient group, joint CRT failure despite local hits, disjoint
support and exact tuples, ordered first split/match, actual paid lift, whole
inversion and a real nonzero per-half inversion attack. Fully rehashed faults
test copied support, unpaid lift, valuation overflow, cardinality, quotient,
half digest, mask, row order, pending, counters, actual baseline limit and pins.
Deadline-before-source, baseline and extension exhaustion, omitted evidence,
tighter legitimate limits, fixed/inert CLI and late stdout are retained.

The next mathematical gap is not more exposed counting: prove factor supply
and image occupancy sufficient for some admissible shift for **every** residual
prime, or a different root-bound constructive bridge. None is supplied here.
Novelty, formal/external review, governed tool/UI/agent admission,
uncontaminated equal-budget live-model evaluation and product E2E also remain
deferred. No browser, API, DB, worker or deployment was exercised by this slice.

## Primary literature/status check

The official [Elsholtz–Tao record](https://arxiv.org/abs/1107.1010) identifies
the published 2013 counting paper and current v6 revision. It supplies counting
context, not this elementary density proof or a universal factor-supply bridge.
The official [Jiang record](https://arxiv.org/abs/2609.09204) currently marks v2
withdrawn and reports errors; it is not accepted as authority here. A checked
these records on 2026-10-02. This bounded status screen is not novelty clearance.
