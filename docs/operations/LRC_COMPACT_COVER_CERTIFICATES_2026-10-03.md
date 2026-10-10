# Compact modular cover certificates · TIP-048

This is a bounded verification-method upgrade, not a new mathematical theorem,
not a blind benchmark and not independent acceptance of Allikvere's complete
14/15-runner claims. The source rule is
[Allikvere, arXiv:2609.02604v2, §4.3, Lemma 4.3](https://arxiv.org/html/2609.02604v2).
The author's archived aggregate node totals are not imported as tree proofs.
No foreign author executable runs. Imported source bytes remain those of TIP-047.

## Quantifier and proof

Let N=14, M=14p, and T={1,...,floor(M/2)}. Coordinate i may take a residue
v_i(d)=r_i+2pd mod M at a legal lift digit d. Define its exact bad set

$$B_{i,d}=\{j\in T:14\min(jv_i(d)\bmod M,M-(jv_i(d)\bmod M))<M\}.$$

Equality is GOOD. Zero time is never a witness for positive residues; reflection
j to M-j preserves every bad/good predicate, including even-M midpoint. Thus
the folded grid suffices to check the entire fixed grid, not continuous time.

At a prefix assignment, let U be the times not bad for any assigned coordinate.
For each remaining coordinate let b_i be the maximum of |U intersect B_i,d|
over ALL legal digits in its sealed axis. Any particular completion has at most
sum_i b_i bad times in U, by the finite union bound. Therefore

$$|U|>\sum_i b_i$$

implies that EVERY completion has SOME good time in T. This is a sufficient
criterion, not a necessary one. The witness may differ between completions;
therefore this leaf is COVER_BOUND, not a fixed GRID(j). It does not assume
independence of bad sets, disjointness or random distribution. Equality does
not certify a leaf. Minimum bad counts, one selected digit, or existential
goodness separately for each coordinate cannot substitute for the maxima.

The consumer must reconstruct exact U and every b_i from the scope and prefix;
recorded cardinalities alone are not proof. Neither a digest nor an AI review
can discharge that arithmetic or tree-completeness obligation.

## Tree completeness

Each node has a prefix of the original ordered coordinate labels. A split must
contain exactly one child per legal next-axis digit, in order, each extending
the parent by exactly that digit. No other coordinate changes. Root is empty
prefix; all nodes are unique, reachable and single-parent, with no cycles.
These conditions inductively partition the entire sealed Cartesian domain.
Repeated residue labels are allowed, but coordinate labels are never merged.

Subtree cardinality is the product of remaining axis lengths, using exact
BigInt decimal values. It is not obtained by enumerating its tuples. Proven
COVER_BOUND leaves count all their completions. Singleton conditional gcd leaves
retain the proper omit-one criterion and the unreplayed lower-LRC12 dependency.
A singleton survivor excludes only fixed-grid witnesses and the gcd criterion.
UNRESOLVED retains its full symbolic subtree, never zero or a hidden deletion.
Classified plus unresolved must equal the root cardinality exactly.

An independently valid PARTIAL tree establishes its recorded proven regions
and full partition, NOT full classification. Invalid proofs, unavailable
replay, malformed counts, source/root drift or limits during verification must
not produce a complete result. Incomplete evidence cannot authorize an agent
to classify the entire domain as proper or to advance a theorem gate.

## Preregistered actual domains

Four pinned author level-2 parents, ordered tight0, tight1, tight2, gw0.
For each, ANCHORED fixes the first five archived terminal digits and allows
all seven digits in the remaining eight axes. FULL allows all seven in all
thirteen axes. These are eight different declared domains, not eight independent
experimental samples; every anchored domain lies within its corresponding full
domain. Do not add their tuple counts as unique mathematical coverage.

$$7^8=5\,764\,801,\qquad 7^{13}=96\,889\,010\,407.$$

Their sizes are known before execution. Complete closure, proof-leaf counts
and actual runtime are observations, not preregistered successful outcomes.
The four parents and archived digits are exposed development inputs. Same-model
Builder/reviewer contexts and same-host algorithms are not external mathematical
certification or an independent-model benchmark.

## Scope boundaries

TIP-046 finite-grid and TIP-047 modular v1 schemas/artifacts stay unchanged.
TIP-048 uses a distinct symbolic-domain certificate. Generation/check caps:
20k nodes,20M logical work,10s observed time,16MiB certificate. Independent
Python execution uses verified source bytes and isolated flags,256KiB stdout;
wrapper30s and collector120s/128MiB are observed outer limits. Checkpoints are
not hard synchronous JS preemption or externally authenticated CPU receipts.

The retained UI is read-only: no producer, subprocess, source fetch or model
dispatch on GET. Ordinary workspace/authentication/database loading remains.
Full worker/ledger admission of this new certificate type is a subsequent
gate; it is not silently added to the old finite-grid agent envelope.

All five global obligations remain: complete level-1 orbit coverage; other
prime gates; all full terminal fibers; lower-LRC12 replay; analytic product
bound. Completing one enlarged shard, or even all four terminal fibers at one
prime, does not establish the whole theorem. Global verdict NOT_ESTABLISHED.

Execution outcomes, exact program/artifact hashes, regression results, failures
and deferred work are recorded separately in the TIP-048 verification and
completion reports after implementation and Main acceptance.
