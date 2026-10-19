# Factor-directed transfer: exact finite graph and failed progress claim

2026-10-01, TIP-038. Fixed standalone local development experiment, not an agent campaign, novelty certificate or Erdős–Straus proof. All inputs are exposed and selected from TIP-037 failures. Written arguments are not formalized.

## 1. Quantified transfer lemma and exact limits

Let p,h be distinct primes with p=1 mod4, h=3 mod4 and 3<=h<p. Put T_h=(p+h)/4. Let q be a prime factor of T_h with Legendre(q/h)=−1. If q=3 mod4 then

\[
\left(\frac pq\right)=-1,\qquad q\le T_h<p,\qquad q\ne h.
\]

Proof: gcd(T_h,h)=1, so q≠h. Since q divides p+h, p≡−h modq. Both h and q are 3mod4, so quadratic reciprocity gives Legendre(h/q)=−Legendre(q/h)=+1. Multiplying by Legendre(−1/q)=−1 gives Legendre(p/q)=−1. The size statement follows from q|T_h and h<p. **q<=T_h is non-strict**; equality is allowed when T_h itself is prime. The separate arithmetic control p17,h11,T7,q7 realizes equality, but is not a frozen experiment node. No h-descent follows; the actual 71→239 transfer increases the shift.

If q=1mod4, p+q=2mod4 is nonintegral for this shifted construction. For q=2, p+q is odd. Such QNR factors are retained as explicit blockers, not erased or replaced by unapproved shifts. In this particular p=1mod840 slice every actual blocker is 1mod4; the generic q2 rule is still fail-closed.

These are standard consequences of [quadratic reciprocity and its special values](https://dlmf.nist.gov/27.9), not new discoveries. Eligibility guarantees the next prime shift has negative character, not a successful factor partition or termination.

For two opposite transfer edges h→q and q→h, reciprocity would require both Legendre(q/h)=−1 and Legendre(h/q)=−1 although their product is −1. Thus a two-cycle of distinct valid 3mod4 prime shifts is excluded. This is **not** a proof against longer directed cycles or an unbounded termination argument.

## 2. Known construction, complete image and exact miss certificate

For positive coprime u,v with uv|T_h and h|(u+v), put k=T_h/(uv), A=(u+v)/h. The strict Type-II construction is

\[
\frac4p=\frac1{T_h}+\frac1{Apuk}+\frac1{Apvk}.
\]

For u<=v and h<p, Ap>v; hence T_h<Apuk. Coprimality excludes u=v except u=v=1, which cannot satisfy h>=3 dividing2. T_h<p and is not p-divisible; the other two denominators are p-divisible. Every returned tuple is additionally checked using the exact integer cross-product identity. The divisor framework is established; see [Tao, Proposition1.2/Remark1.3](https://arxiv.org/html/1107.1010v2).

The full signed ratio image is S={product(q_i modh)^z_i:−e_i<=z_i<=e_i}, not merely the generated subgroup. Net positive/negative exponents go exclusively to u/v; unused and canceled valuation mass goes to k. k need not be coprime to u,v or A. The primary ordered numeric-lex DP and independent divisor-pair enumeration retain identical canonical witnesses. Intermediate pairs are never swapped; final target−1 is self-inverse, so the minimum ordered hit has u<=v.

At each miss the exact stabilizer H={r:rS=S} is computed. Because 1∈S, H⊆S; the primary tests **only elements of S**, never scans all h residues. Modular multiplication/powers use exact BigInt arithmetic across the admitted h<p<=201000000 domain. Quotient order of a factor residue is reduced from h−1 using its prime divisors and tests r^d∈H, not a potentially million-step order loop or a generated-subgroup assumption.

The [TIP-037 general-prime theorem](MATH_PILOT_CHARACTER_SHIFT_DEFECTS_2026-10-01.md) gives, for each miss: |H| odd, n=(h−1)/|H|=2mod4, visible valuation V satisfying2V<=n−2, and every visible q^e having quotient order>2e+1. A QNR factor forces n>=6. Its proof uses [Kneser's theorem](https://arxiv.org/html/1303.3539v1). These necessary miss constraints are structural diagnostics, not a progress invariant across different groups.

## 3. Frozen graph semantics

The exact13 seed pairs are [(200023321,31),(200023321,71),(200023321,79),(200602081,23),(200602081,43),(200602081,67),(200602081,83),(200656681,43),(200656681,71),(200656681,103),(131433121,11),(131433121,19),(131433121,31)], bound to the accepted TIP-037 content digest `a6e29476a065de13e0de34d64458579b96e74ec9da35196e74eac1275f4e767c`.

All unique seeds initialize at depth0 in that order. Breadth-first first discovery uses ascending prime factors per parent and deduplicates (p,h). Every QNR factor is retained, with valuation/character, even if it blocks. Hits stop their branch. Depth0,1,2 nodes are computed; unseen eligible children of depth2 become explicit DEPTH_LIMIT frontier, not depth3 nodes. Revisit means a target was previously discovered, **not** that a directed cycle exists. Cycle witnesses use actual closed directed paths, reported by deterministic DFS back edges rather than enumeration of every simple cycle.

Node depth is the minimum discovery distance from **any** seed. Per-seed reachability separately caps the actual path at two transfers: arrival at another depth0 seed cannot reset that origin's distance. A frontier record from a parent reachable in two steps remains visible as an uncomputed possible third step, not a reached hit or counterexample. Reachability completeness means only completion of this frozen graph, never unbounded closure. Partial flags and null minima never certify uncomputed absence.

## 4. Actual frozen result

The primary completed **17 nodes**, **15 factor records** comprising **4 transfer edges** and **11 blockers**, with **2 hit nodes**. There are no actual revisits, cycles or depth-limit frontiers in this graph; their semantics are exercised by explicit synthetic unit controls, not fabricated campaign observations.

| Exact transfer edge | Child result |
| --- | --- |
| p200656681:71→239 | HIT |
| p200656681:103→2027 | MISS |
| p131433121:31→2053643 | MISS |
| p131433121:2053643→103 | HIT |

Only seed200656681:71 and seed131433121:31 reach a hit within two actual edges. All other seed records explicitly say NO_HIT_IN_COMPUTED_GRAPH, not that their target primes are unsolved. TIP-037 already has known h3 successes for the three new primes and h71/h103 successes for the old control. In particular the final h103 result is a recovered known finite partition, not a new theorem.

Canonical strict tuples:

- p200656681,h239: (u,v,k,A)=(3,5255,3182,22), denominators (50164230,42140310890172,73815777909284620).
- p131433121,h103: (u,v,k,A)=(598,2389,23,29), denominators (32858306,52424203240786,209433815288023).

The failed child p200656681,h2027 has T=50164677=3^6×68813, |S|39,H={1},n2026,V7. Its only QNR candidate68813 is1mod4, so the branch blocks. The old child h2053643 has T=33371691=3×103×107999, |S|27,H={1},n2053642,V3; its eligible factor103 succeeds at the next step.

### Predeclared progress claims, unchanged after observation

C1: **every valid transfer lands at a hit** — REFUTED by the first exact edge recordr9, p200656681:103→2027. Both node digests and the edge are retained. This is a refutation of C1, not of Erdős–Straus.

C2: **for every transfer whose child misses, V_child>V_parent** — NO_REFUTATION_IN_COMPUTED_EDGES. The two missing-child comparisons are5→7 and1→3. This is two finite observations, **not PROVED**.

C3: **every such missing child has trivial H** — NO_REFUTATION_IN_COMPUTED_EDGES. Both observed missing children have |H|1. Again this is not a universal claim.

Neither surviving observation justifies an ordering between different groups. At p200656681, normalized image occupancy falls from63/102 to39/2026. At the old control it falls from15/30 to27/2053642 (equivalently quotient occupancy3/6 to27/2053642). Visible mass increases while the relative image becomes much thinner. Stabilizer collapse alone does not establish progress, success or well-founded descent.

## 5. Resource and provenance receipt

Frozen limits:60 monotonic seconds,256 nodes,1000 factor records,2M primary state insertions,50M additional modular/stabilizer steps,50M independent pair checks and2MiB output. The primary used1405 state insertions and15545 counted modular/stabilizer steps, approximately10ms local packet checkpoints and28177 bytes. This is local arithmetic, not model latency/yield.

The packet API clock starts on invocation; import is excluded there because it is inert and reads no files itself. The approved fixed CLI starts its monotonic envelope **before** the fixed dynamic import, then counts discovery, digests, serialization and final output observation. Independent source-pinned wrapper receipt also starts before source reads. Late complete output becomes PARTIAL/FINALIZE with rehashed graph/reachability completeness flags. Earlier NODE/FACTOR partial reasons survive. Unknown CLI inputs are rejected before discovery. Diagnostic serialization after a stop cannot turn into PASS; exact wire-write timing is not attested by a packet checkpoint.

Invariant content digest: `952de09e31ded70c7f9f498a6ca9933ba3ca70c404f194712b491dbf00eb9bc4`.
Every node image/certificate/witness, factor record, graph and progress binding participates in canonical hashes. Algorithm-specific timing/work fields are separate measurements. A bounded exact-node contradiction diagnostic has exit1 and no COMPLETE authority; its unit injection is not an actual mathematical contradiction.

## 6. Literature and deferred alternative

The divisor construction, reciprocity and Kneser mechanisms are standard. [CENTL's author note](https://github.com/chasebryan/centl/blob/main/research/erdos-straus/BINARY-R-KNESER-DEFECT.md) overlaps stabilizer/shift concepts for N=pT; it is an unvetted comparison, not an adopted premise or priority certificate. Our node boxes use T only. No novelty or root breakthrough is claimed from the graph.

A later **separately preregistered** response to1mod4 blockers could examine a composite shift c=3q when3q<p, rather than merely increasing this failed branch's depth. That is not admitted, executed or integrated here. A composite modulus requires simultaneous target−1 congruences and has multiple possible involutions: one cannot import the prime-modulus quotient parity/minimum-index rules blindly. Weighted Kneser atom increments for quotient-order-two factors are a possible proof question, not an accepted result or hit guarantee. No composite fallback was added to this frozen graph.

The actual root bridge remains unbounded existence of an admissible successful partition; neither factor-transfer eligibility, finite hit recovery, V increase nor H collapse proves it. Keep these negative findings as constraints on future method design. Governed tool admission, UI/agent integration, comparisons, formalization and academic novelty review remain separate gates.

Reproduce with `node --import tsx scripts/operations/factor-transfer-audit.ts`; the CLI accepts no seed/shift/depth/program arguments. Consult independent replay, skeptical report and Contractor acceptance separately.
