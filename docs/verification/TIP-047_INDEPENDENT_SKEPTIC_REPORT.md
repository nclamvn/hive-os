# TIP-047 independent skeptical seam review

Date: 2026-10-03. Reviewer: delegated replay Builder `/root/lrc_replay_builder`.

This review was read-only. Only this documentation file was added afterward, on Contractor instruction. No product or test edits, model/API calls, database writes or migrations, dependency mutations, Git publication, or foreign author-code execution were performed by this review.

## Scope and baseline

Reviewed `math-lrc-modular-certificates.ts`, `math-lrc-modular-replay.ts`, `math-lrc-allikvere-report.ts`, the fixed imported author bytes/provenance, the retained report, its CLI collector, and the retained-only UI route/panel. This is review of bounded p=199 modular fibers, not verification of Allikvere's entire theorem.

The retained report was 135,832 bytes when checked. Both the original report and an otherwise unchanged, coherently resealed copy were admitted by the pure validator.

| Scope | Total | GRID | Conditional OMIT_GCD | SURVIVOR |
| --- | ---: | ---: | ---: | ---: |
| p199-tight-level2 | 8192 | 8187 | 2 | 3 |
| p199-gw-level2 | 8192 | 8190 | 1 | 1 |
| p199-tight-terminal-0 | 49 | 48 | 1 | 0 |
| p199-tight-terminal-1 | 49 | 48 | 1 | 0 |
| p199-tight-terminal-2 | 49 | 48 | 1 | 0 |
| p199-gw-terminal-0 | 49 | 48 | 1 | 0 |

These category counts describe the selected certificate leaves. They are not intrinsic disjoint classifications of every possible mathematical proof method.

## Invalid-mutation and retained-read probes

An in-memory Node/tsx diagnostic modified copies of the retained JSON. Where the modified scope remained structurally legal, it recomputed scope and certificate digests, summary digest bindings, Python-output bytes/digest, evidence digests and report digest. Invalid scope/schema mutations were also rejected rather than repaired. No mutant was written to disk.

All **25/25** invalid mutants were rejected:

1. Global verdict changed to an established-theorem claim.
2. Whole-ZIP verification changed to true.
3. All global gaps removed.
4. One gap duplicated to replace a different required gap.
5. Gap order reversed.
6. Lower-LRC dependency marked replayed.
7. One report row removed.
8. A row duplicated to replace another expected scope.
9. Six-row order reversed.
10. Source-manifest digest changed.
11. Descriptor source digest changed.
12. Descriptor, evidence and certificate root digests changed coherently.
13. A binary digit axis narrowed from `[0,1]` to `[0]`.
14. An archived terminal prefix changed.
15. A fixed terminal digit axis changed.
16. Ordered parent residues reversed.
17. Prime 199 changed to 197.
18. One expected author survivor removed.
19. Author survivor-match flag changed to false.
20. Both retained primary and independent witness counts forged.
21. A survivor removed from both retained primary and independent summaries.
22. Python source pin changed.
23. An unknown theorem-authority field added.
24. A certificate node removed.
25. Root box narrowed.

The probe instrumented Node subprocess entry points (`execFile`, `exec`, `spawn`, `fork`, and synchronous variants) and global `fetch` to count and throw if invoked. Across baseline/resealed-baseline admission and these validation probes, observed calls were **0 subprocess / 0 fetch**. This directly checks pure-validator behavior, not every authentication/database operation of a live HTTP request. Static route review additionally confirmed that `view=allikvere` skips the existing divisor and mixed-core replay paths and invokes only the retained panel's pure admission.

The report enforces exact fixed imported descriptors, all six expected rows in their expected order, exact source/root/domain/prefix/author-list binding, all five required global gaps, the unreplayed lower dependency, and literal `NOT_ESTABLISHED`. The core consumer verifies full root/child partitions, unique reachable acyclic nodes, exact integer witnesses/gcd tests, survivors and counts; it never calls its producer. The pinned Python implementation uses a separate interpreter, integer arithmetic, and full-grid survivor enumeration rather than importing the primary producer or stored outcomes.

## Valid overlap and execution-receipt trust boundary

A separate **valid**, in-memory counterprobe changed `p199-tight-terminal-0` node `n12` from its valid GRID witness to a valid `OMIT_GCD` leaf with `omittedIndex=12`, `divisor=7`. Recomputing the primary consumer and all retained envelope/report hashes admitted the alternative certificate. Counts became **47 GRID + 2 conditional gcd**, rather than **48 GRID + 1 conditional gcd**. This counterprobe executed no Python process; its retained independent summary/receipt was synthesized from the recomputed valid primary result.

This does not demonstrate false arithmetic, scope contraction, omission of a required branch, discharge of a global gap, or theorem admission. GRID and OMIT_GCD can overlap mathematically, and the current consumer admits either valid proof. Therefore:

- Retained category counts must be read as chosen proof-certificate categories, not as proof that every gcd-labelled point lacks grid witnesses.
- Consistent source/output/evidence hashes and a pinned checker identifier are **not an authentic external execution attestation**. Actual cross-interpreter execution is established by the controlled local collector/run, whose retention must remain trusted.
- A collector/storage compromise can fabricate a coherent receipt for a valid certificate. Pure GET admission reconstructs arithmetic/integrity but cannot establish process authenticity from an unsigned JSON receipt. This limitation is explicitly disclosed in the implementation and UI.

No change to the product was requested as part of this read-only review. If future product semantics require every gcd-labelled point to be grid-witness-free, that stronger exclusive-classification contract needs additional checking rather than inference from current category counts.

## Independent archived-prefix arithmetic oracle

For each of the four archived terminal prefixes, a standalone in-memory arithmetic loop derived the ordered residues from the imported parent vector and all 13 archived digits:

`u[a] = (parentResidues[a] + parentLevel * prime * archivedDigit[a]) mod M`, with `M = 14 * 199 = 2786`.

Without invoking the primary generator/consumer or Python checker, it enumerated **every integer grid index `j=0..2785`** and checked the exact inequality `14 * min((j*u[a]) mod M, M - (j*u[a]) mod M) >= M` for all 13 coordinates. It separately computed, for each omitted coordinate, the gcd of target level 14 and all other derived residues.

| Archived prefix | Grid indices tested | Witness indices | Omit-one gcds |
| --- | ---: | ---: | --- |
| p199-tight-terminal-0 | 2786 | 0 | 7 for all 13 omissions |
| p199-tight-terminal-1 | 2786 | 0 | 7 for all 13 omissions |
| p199-tight-terminal-2 | 2786 | 0 | 7 for all 13 omissions |
| p199-gw-terminal-0 | 2786 | 0 | 7 for all 13 omissions |

Thus the four exact archived points are grid-witness-free under this finite-grid check. These are **not SURVIVOR points**: all satisfy the conditional OMIT_GCD clause, with omit-one gcds equal to 7. The lower-LRC premise remains declared, not replayed. This independent oracle supplies the explicit archived-prefix no-grid evidence beyond the generic OMIT_GCD leaf check, which by itself only verifies the gcd assertion.

## Outcome and remaining boundaries

No invalid-mutation acceptance or global-claim bypass was found in the inspected seams. Full Allikvere coverage remains **NOT_ESTABLISHED**: all-orbit level-1 coverage, other primes, entire terminal `7^13` fibers, the lower-case LRC induction and analytic prime-product bound are not discharged. A 49-point shard does not close the full terminal domain; finite-grid witness absence is not a continuous-time LRC counterexample. Hashes/source pins are neither formal verification nor novelty/theorem acceptance.

Contractor separately reported whole-repository unit regression: **115 unit files / 938 tests passed in 124.11 seconds**, with type, lint and build exit codes 0. These results are Contractor-reported, not independently rerun by this skeptical review. Database integration was **NOT_RUN** in this turn. Final browser and overall TIP acceptance belong to Contractor.
