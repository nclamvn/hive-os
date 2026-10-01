# TIP-038 — Factor-directed shifts and progress falsification

2026-10-01. HIVE OS local Erdős242 research. Depends on TIP-036/037.
Owner approved the proposed next transfer investigation with “tiếp tục”.
No new root, budget/API authority, product architecture or public claim.

## Frozen scope before discovery

Use precisely the 13 negative-character miss seeds of the accepted TIP-037
content a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c:
[(200023321,31),(200023321,71),(200023321,79),
 (200602081,23),(200602081,43),(200602081,67),(200602081,83),
 (200656681,43),(200656681,71),(200656681,103),
 (131433121,11),(131433121,19),(131433121,31)].
All are exposed development controls, not held-out or intrinsically hard primes.
Do not replace inconvenient seeds, expand depth or add fallback shifts after
results. The h3 baseline and matched character-positive successes remain known.

At a miss node (p,h), factor T_h=(p+h)/4. For every QNR prime factor q,
retain its valuation and character. If q=3mod4, reciprocity implies
Legendre(p/q)=-1, q<=T_h<p, q!=h: follow the new shift q. If q=1mod4
or q=2, retain an explicit nonintegral-shift blocker instead. Eligibility
does not imply a hit or a decrease in h. Enumerate all eligible factors,
not just a handpicked one. Hits stop their branch.

Canonical traversal: initialize unique seed nodes in the exact listed order,
all depth0; breadth-first first discovery, per-parent prime factors ascending.
Deduplicate nodes by (p,h), retain every transfer edge including revisits.
Compute depth0,1,2 only (two transfers from a seed). For miss depth2 retain
factor/blocker/frontier information, but do not compute depth3. Record exact
target existence/depth-limit/revisit distinctions; a revisit is not by itself
a directed cycle. Derive bounded seed reachability to hits and explicit cycle
witnesses from the actual directed edge graph, without a termination claim.

Every computed node retains exact prime factors, full signed image, canonical
strict Type-II witness or exact H/n/V/quotient-order miss certificate. Prime
shift domain is now 3<=h<p<=201000000, p one of the four fixed targets; shifts
are admitted only as seeds or factor-derived queue members. No general caller
shift/program arguments. Large h must not silently induce a scan of all h
residues without resource checks. Exact H is contained in S (since 1 in S);
quotient orders can be computed with bounded factor/power arithmetic.

Predeclare three candidate universal progress statements for falsification:
C1 every valid transfer lands at a hit; C2 for every transfer whose child
also misses, V_child>V_parent; C3 every such missing child has trivial H.
For each retain the first exact disproving edge, or explicitly NO_REFUTATION
IN_COMPUTED_EDGES, not PROVED. Do not substitute a weaker predicate after a
failure. Changes in H cardinality and occupancy ratios across DIFFERENT
groups are descriptive, not automatically a well-founded progress invariant.
Frontier/uncomputed children cannot count as success or counterexamples.

## Limits and independent execution

Per implementation:60 monotonic seconds,256 computed nodes,1000 edge/blocker
records,2M primary state insertions,50M independent divisor-pair checks,
50M additional modular/stabilizer work steps,2MiB output. Completed ordered
prefix/exact pending phase/node/edge retained on any cap. PARTIAL cannot PASS.
Include source read, discovery, hashing/serialization and final receipt
checkpoints. A graph complete only to depth2 is explicitly a finite graph
certificate, not closure of the open root or unbounded transfer process.

Primary: signed factor exponent DP. Independent fixed stdlib Python: own
primality/factorization, positive coprime divisor-pair enumeration and exact
set stabilizer/order calculations. No TS factor/image/graph import. Compare
all full nodes, canonical witnesses, candidate factors, edges/blockers,
frontiers, reachability, progress predicates and graph manifests. Execute
source-pinned verified bytes in isolated Python with environment allowlist.
Preserve all TIP-036/037 sources/tests/pins unchanged.

## Requirements and acceptance

R01: quantified transfer proof, equality q<=T boundary, no false shift descent;
known divisor/Kneser/reciprocity mechanisms and prior-art overlap credited.
R02: exact frozen seed selection, deterministic all-factor BFS/dedup/depth2;
explicit blocker/frontier/revisit/cycle/reachability meaning.
R03: full exact node certificates and strict tuples; C1/C2/C3 exact scoped
refutations or truthful unrefuted finite status. Root remains unestablished.
R04: fresh independent full graph replay, fixed source integrity, malformed/
rehashed domain/edge/character/certificate/predicate/scope/resource faults fail
closed. Prefix/pending/deadline/output/unknown-tool controls included.
R05: Builder completions, separate skeptical review, Contractor quantified
whole-unit/type/lint/manifest/source preservation and scientific limits.

Outputs: new factor-transfer primary/audit, Python/checker/replay and two unit
files, mathematical note and completion/skeptical/verification reports.
Standalone scripts/tests/docs only. No Next/app/UI change, DB or historical
ledger mutation, tool admission, queue/worker, new model/provider/paid campaign,
dependencies/schema, Git commit/push or deployment. No new approval ceremony
within the approved local root research; material scope expansion is routed.
