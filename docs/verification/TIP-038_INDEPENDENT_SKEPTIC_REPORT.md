# TIP-038 — Independent skeptical review

2026-10-01. Separate skeptical agent context; same model, not foundational,
different-model, expert or formal mathematical independence. Report ownership
only; no product, campaign scope, historical evidence, DB, provider or Git edits.

## Current verdict

**PASS_WITH_SCOPE_LIMITS; no open acceptance blocker in the registered local
standalone slice.** Transfer implication valid with its stated hypotheses;
C1 refuted inside the frozen experiment. Both frozen Builder sources/tests,
mathematical note and completion reports fully reviewed; own fresh independent
execution and adversarial controls pass. C2/C3 are not established theorems.

Read AGENTS, durable handoff through TIP-037, the full frozen TIP-038 contract,
Vibecode Kit and its QA/report references. The skill separates Builder claims
from skeptical checks and prevents finite replay from becoming a root or novelty
certificate. Frozen seeds and depth were not changed after arithmetic results.

## Proof and boundary review

For distinct primes h,q both 3 modulo4, p1mod4, q dividing T_h=(p+h)/4 and
Legendre(q/h)=-1, p=-h moduloq. Quadratic reciprocity gives
Legendre(p/q)=-Legendre(h/q)=Legendre(q/h)=-1. Since h<p, q<=T_h<p.
q=h is excluded by gcd(T_h,h)=1. This is character eligibility at the new
shift, not membership of -1 in its signed image. No inequality q<h follows.

The weak bound q<=T_h cannot become strict without an additional assumption:
the proof-only boundary p181,h7,T47=q47 has Legendre(47/7)=-1 and misses -1
in its signed image {1,3,5}. This is a quantified boundary control, not an
additional campaign seed or computed factor-directed row. A factor1mod4 or2
does not produce an integral new T_q when p1mod4.

The coprime divisor witness remains the known Type-II construction: uv divides
T, gcd(u,v)=1, h divides u+v, k=T/(uv), A=(u+v)/h, with denominators
(T,Apu k,Apv k). Positivity and exact rational equality do not themselves
certify novel mathematics. A strict tuple requires retained distinctness and
divisibility checks; repeated unused prime mass belongs in k, not discarded.

The divisor mechanism is already in [Tao2011v2, Proposition1.2 and Remark1.3](https://arxiv.org/html/1107.1010v2).
The reciprocity mechanism overlaps the external author [CENTL transfer note](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/SHIFTED-NONRESIDUE-TRANSFER.md),
which is an unvetted comparison lead, not adopted authority. [Kneser's theorem](https://arxiv.org/html/1303.3539v1)
supports the quotient bounds, which use the exact
stabilizer, not an arbitrary convenient subgroup. No priority, novelty or
universal progress claim follows from this review or limited literature checks.

## Independent frozen-scope arithmetic

Read-only Python stdin oracle independently factored each T by trial division,
generated positive divisors, enumerated every coprime (u,v) with uv dividing T,
formed S={u/v modh}, and checked H={a in S:aS=S}. It initialized precisely
the13 seeds and followed every eligible QNR factor in ascending BFS order,
with first-discovery depths and depth2 ceiling. It imported no Builder factors,
images or graph. Corrected an initial sign typo in the diagnostic oracle before
using any result: S is u/v, not -u/v. No files/artifacts were produced by this run.

All four target primes and all13 prime3mod4 seed shifts, negative characters
and p1mod840 were separately checked by elementary trial primality/power tests.
Final bounded diagnostic:17 computed nodes,4 transfers,11 factor blockers,
2 hit nodes and0 uncomputed frontiers; about0.0054s. All candidate transfers
also satisfy the directly checked character implication and q<=T_h<p.

Computed transfers, in canonical discovery order:

| p | Parent h | Child q | Child result |
|---|---:|---:|---|
|200656681|71|239|HIT, canonical coprime pair (3,5255)|
|200656681|103|2027|MISS|
|131433121|31|2053643|MISS|
|131433121|2053643|103|HIT, canonical coprime pair (598,2389)|

An additional direct integer check reconstructed both strict tuples and
cross-multiplied the full equation, without floating point:
p200656681,h239,k3182,A22 gives
(50164230,42140310890172,73815777909284620);
p131433121,h103,k23,A29 gives
(32858306,52424203240786,209433815288023).
Both have precisely two p-divisible denominators and strict increasing order.

**C1 is refuted**, not merely unproved: at p200656681,h103, the QNR factor
q2027 is an eligible shift, but its T=50164677=3^6*68813 has signed image
size39, H={1}, n2026, V7 and excludes -1. Its only QNR factor68813 is1mod4,
so this path terminates in the allowed directed graph without a witness.
As a small explicit counterexample certificate, q68813 is1922 modulo2027;
the whole image is {3^i*1922^j: -6<=i<=6,-1<=j<=1} modulo2027, namely
{1,3,9,27,59,81,148,177,243,299,444,461,481,531,664,676,725,729,836,
897,901,976,1001,1082,1219,1332,1383,1451,1505,1593,1630,1685,1712,
1835,1853,1913,1922,1969,1992}. Neither2026 nor a nonidentity stabilizer
occurs. All repeated valuation6 and unused mass are represented.

**C2 and C3 have no refutation in the two computed missing-child edges**.
Both are finite controls, never PROVED: parent V5,n102,H{1} becomes V7,n2026,
H{1}; parent V1,n6,H{1,2,4,8,16} becomes V3,n2053642,H{1}.

These same edges disfavor interpreting raw V growth or H collapse as general
progress. Actual quotient-image occupancy falls63/102 to39/2026 on the first
edge, and3/6 to27/2053642 on the second. V/n also falls on both edges. The
groups differ; none of these quantities is a proved well-founded invariant.
No additional rows were searched to make either candidate look successful.

Eleven blockers retain all QNR1mod4 factors, not silently discarded failures.
Only two of the13 seed branches reach a hit in the registered graph. An empty
depth-limit frontier here means finite factor-branch exhaustion or stopping at
hits, not closure of the Erdős root. No revisit is present in this graph; cycle
classification therefore needs adversarial/synthetic controls, not this count.

## Implementation / resource checks

Read full primary/checker/wrapper/Python/CLI and both unit files. Canonical
ordered-pair DP preserves orientation before the -1 target; the independent
Python enumerates coprime positive divisor pairs and imports no primary factor,
image or graph data. Exact H is reconstructed using candidates in S rather than
enumerating all h residues. Quotient orders use prime-factor/power reduction.
Large modular products use BigInt/integer arithmetic, not unsafe Number products.

The scoped validator reconstructs all QNR factors, ordered atomic BFS prefixes,
edge/blocker dispositions, target computation/depth, certificates, first progress
refutations, per-seed bounded reachability and actual DFS cycle witnesses. A
merged seed never resets the two-hop distance. Explicit abstract graph controls
exercise revisit versus cycle and outward frontier semantics without claiming
those synthetic graphs are admissible arithmetic. In particular, a frontier
record annotation from a reachable parent does not assert reachability of its
uncomputed child inside the two-hop budget.

Own focused execution:28/28 tests on2files PASS,1.55s,start20:37:12+07.
Includes actual source-byte replay, field-rehashed faults, canonical image oracle,
abstract C2/C3/cycle/revisit controls, atomic caps, fake source/IO/process failure,
constructor/stdout/receipt clocks and inert/argument-rejecting CLI controls.

Own actual fresh fixed-byte execution:PASS,EXACT_FULL_GRAPH_INVARIANTS_AGREE.
Primary1405 state insertions/15545 worksteps/11ms/28177bytes;
Python8076 positive-pair checks/6252 modular worksteps/17ms/28171bytes;
wrapper83ms. These are local arithmetic timings, not model throughput.
Full content952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4.
Expected/observed/verified Python source digest
19fd4294c0b5ace65936a918858a62418eb519559392347237d7e6bc186d64f7.

Eight additional own fully-rehashed faults all MISMATCH: reordered seeds,
omitted QNR factor, cross-root edge, forged QNR2, wrong H, wrong quotient order,
PROVED status and false targetComputed. For the fixed p1mod8 domain, 2 dividing
T forces h7mod8 and Legendre(2/h)=+1, so the QNR2 control is a genuine arithmetic
inconsistency, not simply an unexpected string.

A plausible image omission at a hit node passes local scoped identities but
is MISMATCH against both the retained fresh replay and a new actual replay.
This is the explicit image-completeness/minimum boundary, not a repaired hash
claim or a local validator proof. Fresh execution is mandatory for admission.

Own tighter maxRecords1 run:PARTIAL with2 completed nodes/1 completed record,
pending FACTOR p200023321:h71,q61; locally valid and wrapperPARTIAL, neverPASS.
Own independent Python phase injections retained exact atomic prefixes:
FACTORfirstseed→1node/0records,pendingq531977;
NODEchild2027→14nodes/13records,pendingp200656681:h2027;
FINALIZE→17nodes/15records,pendingFINALIZE. Every summary is incomplete.
No product/source/artifact file was changed to inject these faults.

Caps are checkpoint bounds and output/process limits, not hard preemption of a
synchronous JS instruction or external execution attestation. The wrapper counts
source read/hash, isolated child launch and validation/final receipt; a late PASS
is downgraded. Fixed verified bytes and an environment allowlist do not certify
the Python binary or a hostile local administrator. PARTIAL and investigation
diagnostics are non-acceptance outcomes. Contradictions were injected tests only;
the arithmetic experiment found no contradiction of the written defect theorem.

Final A/B freezes match own read-only byte fingerprints below. A temporary
report-wording concern about repeated checker image allocation was withdrawn
after reopening the final frozen source: the initial read was a prefreeze
snapshot, while final4c15... uses one `values` array outside the candidate loop.
No source/report repair or permission expansion resulted from that concern.

| Frozen file | SHA-256 |
|---|---|
|factor-transfer-partitions.ts|46067b52a11cf7aa6a5335ebaafaf87bf5a8c312bebf1d46f3af6c4acf0dbb40|
|factor-transfer-audit.ts|b57bee55f2755c994f485683d3b341a0c1f4831f96053a303204825a16770cd1|
|factor-transfer-check.ts|4c15beb16e6898dce5976026c30e8037feacf35db8b264ad920ed756a1fc6344|
|factor-transfer-replay.ts|edd5637a270f528fbab1d21e34297fa79953d6746d36ea63c7a8de8e48c6a689|
|factor-transfer-replay.py|19fd4294c0b5ace65936a918858a62418eb519559392347237d7e6bc186d64f7|
|factor-transfer-partitions.test.ts|6b3e99aca8669fd67e2fcd8f50bc266347e0519dc0ea2177f6f1fe6fdcad3d75|
|factor-transfer-replay.test.ts|ba68ddb6698596300a9ee4959f327144a01664f160d1ebe0324fca8e0f8d21c9|

Own frozen TIP hash matches the preregistered
5d0869de07328c6bffb416cb6aa28f55ec01b1948899aacf1c0183d0bca723db.
All14 TIP-036/037 source+test byte fingerprints independently match their prior
freeze; no previous source was silently repinned. Own writes are this report only.

Contractor-attributed final whole-unit656/656 on97files,82.41s,
start20:36:15+07; typecheckPASS, lint retry0 after a stale prefer-const finding.
Contractor independently reports12 fully-rehashed faults rejected and an atomic
partial notPASS. These are not own runs. No integration/build/UI/model/DB
campaign is claimed by this skeptical receipt or inferred from unit acceptance.

## Scientific ceiling

The two hit nodes are local arithmetic witnesses on exposed development cases;
one h103 was already a known TIP-037 success. The new targets also already have
h3 successes. No held-out evaluation, model/API campaign, comparative AI yield,
unbounded transfer termination, root proof, novelty or public mathematical
acceptance is established. The meaningful result is a falsified immediate-hit
progress claim and explicit character/stabilizer/blocker geometry, not a root
breakthrough. A next mechanism should address the retained1mod4 blockers or
prove a genuinely comparable invariant, rather than posthoc expand this depth.
