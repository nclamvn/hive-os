## COMPLETION REPORT — TIP-039 PRIMARY

**STATUS:** DONE — bounded standalone implementation, exact frozen experiment and primary self-tests complete. Contractor acceptance and external mathematical review are separate gates. Root remains NOT_ESTABLISHED.

**FILES CHANGED:**

- Created: scripts/operations/composite-shift-partitions.ts — fixed eleven-row TS signed DP, numeric-lex partition retention, exact CRT projections, local pairs, strict joint tuple guard, exact stabilizer/quotient orders/four involutions, registered provenance, C4 and resource-aware atomic prefixes.
- Created: scripts/operations/composite-shift-audit.ts — no-argument fixed CLI with dynamic-import and serialization timing, bounded non-COMPLETE candidate diagnostics.
- Created: tests/unit/composite-shift-partitions.test.ts — 17 focused acceptance/regression scenarios.
- Created: docs/operations/MATH_PILOT_COMPOSITE_SHIFT_CRT_2026-10-01.md — quantified construction, signed-box/Kneser proof, character scope clarification, actual full results and deferred bridge.
- Created: this report.
- Modified: none. Old TIP-036/037/038 sources, pins and tests untouched. Parent/B/S files are not A-owned modifications.

**TEST RESULTS:**

All five TIP requirements are covered within Builder A ownership; R04 independent implementation/checker/wrapper is Builder B ownership and fresh replay was additionally invoked by A.

| Requirement | Builder A evidence |
|---|---|
| R01 | Parent/provenance domain checks, independently challenged generic proof, character clarification and countercontrols; proof note complete |
| R02 | Independent divisor-pair unit oracle compares every full image, both projections and local numeric-lex pairs across all eleven rows |
| R03 | Exact S-only H, Euler-order reduction, BigInt modular arithmetic, four involutions, C4 first exact refutation, bounded contradiction diagnostic |
| R04 | Fixed CLI inert import and unknown-argument rejection; fresh source-pinned isolated Python comparison PASS; rehashed adversarial validation owned by B |
| R05 | Source freeze, 17 focused tests, owned lint and full repository typecheck PASS; no browser/live-agent acceptance claimed |

Measured commands:

- npx vitest run --project unit tests/unit/composite-shift-partitions.test.ts: 17/17 PASS, 1 file, 1.94s including1.79s tests.
- npx eslint scripts/operations/composite-shift-partitions.ts scripts/operations/composite-shift-audit.ts tests/unit/composite-shift-partitions.test.ts: exit0, no warnings/errors.
- npm run typecheck: exit0; repeated after B sources landed.
- node --import tsx scripts/operations/composite-shift-audit.ts: COMPLETE, scientific content ff01bdbd52abbb55e98ab912b2c201968cecb210a5fd6449725dd8804731831e, 544 states,19,427 work,13ms fixed CLI observed checkpoint,25,219 packet bytes (25,220 including stdout newline).
- Fresh A invocation of B source-pinned wrapper: PASS / EXACT_FULL_CRT_INVARIANTS_AGREE, Python1076 pairs/4413 work/12ms/25,214 bytes, wrapper77ms. Verified Python source d2eb19e4c199e29744f5a6410b4bd35991777c3bb53da8d5ba939ac38f52425f; receipt8bf3923dc97cd5680b58e02459324a073a66f6cbddfa642ad1408b83af4b6795. Runtime-dependent receipt hashes are observations, not stable scientific pins.
- Contractor independently reported whole unit685/99 PASS at this snapshot; final Contractor report remains authority for final aggregate.

17 scenarios include exact fixed provenance/order; every complete image/local partition; all negative classifications/C4; H/orders/involutions; even H/index2/index4/QNR-in-H countercontrols; incompatible local CRT witnesses; negative-character U39 synchronization-only miss; positive-character abstract hit; repeated/unused valuations; exact local3 criterion; modular products above2^53; malformed-domain/reconstruction/cap expansion rejection; atomic row/state/work/output stops; finalization deadline and previous-partial preservation; bounded injected contradictions; inert import/CLI expansion; actual CLI late serialization.

**ISSUES DISCOVERED:**

- Scientific obstruction: all eleven c=3q branches miss, nine LOCAL_Q and two LOCAL_BOTH (r5/r11). All H={1}. C4 refuted by r0; no actual CRT-synchronization-only miss among these rows. This is a branch-rule falsification, not a selected-root refutation or conjecture breakthrough.
- Character premise: original broad “negative Jacobi is necessary” was false outside registered scope. Raised before proof adoption; Contractor approved and recorded registered-provenance-only correction. A positive-character abstract hit is retained.
- Composite-group transplant: prime-only H-odd/index2mod4/QNR-visible/index>=6 rules are false here. Explicit c15 controls retained; generic exact-stabilizer lemma was reviewed first.
- Operational command environment: npx tsx -e encountered sandbox IPC EPERM; node --import tsx executed the identical standalone module without IPC, no escalation or dependency change.
- Documentation rendering: an initial Markdown math draft lost backslash/delimiter escaping; Contractor identified it, A repaired proper $$ displays and LaTeX commands. No product source or scientific-content change.
- No real generic-candidate contradiction occurred; only injected diagnostic failure was tested. Do not report an observed mathematical refutation of the Kneser deduction.

**DEVIATIONS FROM SPEC:**

- Disclosed contract wording clarification only: initial input freeze SHA3c7607ad72039d17c8b0c46b838412b907ffda70b7513e9430553b99106703f4; amended wording SHA2269fea155b62f0a15e67b0011a99d044618a0b8ea33d9428cde6170f0f23059. Eleven inputs/c3q/caps/C4 unchanged.
- Additional abstract U39 and positive-character controls improve semantic rejection, but are explicitly not campaign rows or new targets.
- No UI/app/DB/model/worker/Git/deploy/publication work performed. This tool is not integrated into agent-cycle authority.
- Synchronous partial-diagnostic sealing may exceed the wall cap after stop; it cannot yield COMPLETE/PASS. In-process timing excludes inert import; fixed CLI includes dynamic import and output checkpoints.
- Same-model independent contexts and separate algorithms are not formal/external-expert independence.

**SUGGESTIONS FOR CHỦ THẦU:**

- Preserve all eleven misses and reject blind c3q success; do not expand multipliers after outcomes to conceal C4 failure.
- Next preregistered root bridge should address actual bounded factor supply/image occupancy and the missing q target. Negative character, integrality restoration or another group's H/V statistics alone do not establish a hit.
- Keep the known Type-II/divisor construction and Kneser attribution explicit, novelty unestablished. No new root coverage or held-out benchmark score is implied.
- Contractor should record final frozen unit/lint/type/manifest and independent receipt gate. No live model/browser acceptance is claimed.

**FROZEN PRIMARY CODE SHA-256:**

- scripts/operations/composite-shift-partitions.ts: 156e651901f74fc8c552208c1976d0119bb0fc289c78309417444bdbfd5f5705
- scripts/operations/composite-shift-audit.ts: 36d194a13dc161038cda548f16b93865ae16a8f30ee419f5cb88a7bcadf92396
- tests/unit/composite-shift-partitions.test.ts: b1ec49c66ee8f7c52b3fa41313ab9ef25bb4d233bb16151c96a677d0d5b6e4b6

