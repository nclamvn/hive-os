# TIP-033A: Mixed-core evidence in the controlled agent loop

Priority P0. Depends on TIP-033 and the 2026-10-01 mixed-core diagnostic.
Working directory: /Users/os/hiveos. Scope: local, existing bounded cycle protocol.

## Focused scan

TypeScript/Next.js 16.2.11, PostgreSQL/Prisma, tenant-scoped append-only JSON
cycle events, Codex-local subscription adapters. The raw mixed-core packet and
fixed Python replay exist, but only the read-only workbench consumes them.
Reuse math-cycle-kernel event chaining, strict schemas, prior evidence ordering,
resource reservation, fail-closed stops and existing UI trace projections.

## Requirements and acceptance criteria

- MC-01: Given a new Erdős–Straus cycle, before any planner call, compute and
  independently replay the fixed bounded packet, bind it to the root contract,
  and retain it in the tenant-scoped append-only event chain. On mismatch or
  unavailable replay, stop before any model dispatch.
- MC-02: Given a valid packet, planner, task verifier, solver, critic and
  adversary receive the same bound evidence. No paid API or model-authored shell.
- MC-03: Given a typed assertion of either universal single-core rescue or
  universal equality with the known-relation occupancy bound, reject it before
  source/solver/reviewer calls using the exact counterexample registry. A
  paraphrase without a typed ID still requires semantic review; no claim of a
  general semantic-equivalence detector.
- MC-04: Given altered scope/count/hash/root binding, duplicate or out-of-order
  events, the trace validator rejects them even after chain hashes are rebuilt.
  Historical traces without the new method marker remain readable unchanged.
- MC-05: Show the retained evidence/replay/claim decision on the cycle UI,
  without theorem/novelty labels. Distinguish this from a diagnostic preview.
- MC-06: Unit and database integration tests verify ordering, transport to all
  roles, deterministic rejection, immutable retention and legacy compatibility.
  Report any live subscription campaign not actually run as deferred.

## Decisions and boundaries

The user's continuation authorizes this already proposed bounded integration.
No new database table, provider, dependency, budget, root problem, publication
policy or model fan-out. No rewrite of historical cases. No larger math search.
Blueprint/RRI checkpoints are reused from TIP-033 and the user's continuation;
no separate interview is needed for this gap. This is a Builder implementation
slice under the existing architecture, not a new scientific sign-off.

Completion and verification report required, with MC-01..06 coverage, specific
test counts and explicit deferred gates. Production build/live scientific
campaigns must not be implied by unit or fixture integration success.
