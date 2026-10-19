# TIP-033B/C — Contractor verification

2026-10-01. Vibecode Kit v6.2 Contractor review, separate from Builder reports.

## Verdict

PASS within the bounded local implementation and diagnostic scope: K01..06 and
T01..04 covered. This does not close live scientific E2E or certify novelty,
formal semantics, the root conjecture, or full all-exponent computational coverage.

## Independent checks

- Read implementation, V1/V2 schemas and dispatch/trace changes. Both fresh
  replays are required before calls; roots, method versions and canonical hashes
  are bound. V1 remains readable without newer prime-only refutation facts.
- Reviewed fixed TS signed-box generator versus Python integer-divisor pairs,
  target factorization and exact integer witness checks. The bounded numeric
  domains stay below safe-integer limits; tuple identities use BigInt/Python ints.
- Fresh full unit command: `npm run test:unit -- --maxWorkers=1`, **368/368 PASS,
  70 files**. This includes the six additional target-tool scenarios completed
  after the kernel Builder's 362-test run.
- Fresh `npm run typecheck`, `npm run lint`, `git diff --check`: PASS, no type
  errors or lint warnings.
- Fresh fixed CLIs: `node --import tsx scripts/operations/erdos-straus-kernel-audit.ts`
  and `node --import tsx scripts/operations/two-core-target-audit.ts`: PASS.
  Target packet/output digest
  `3c1c60e3f1e8abe2db377843386a24ade1394d42513c2f46dbb0daa527d847dd`;
  1,336 atlas rows, four a1..4 manifests and all 12 strict Type II controls agree.
- Strict integration uses setup's explicit `hiveos_test` guard. Sandbox first
  blocked migration access; a scoped fresh rerun of
  `npm run test:integration:strict -- tests/integration/math-pilot.test.ts tests/integration/math-formal-gate.test.ts`
  passed **9/9, two files**, under `--throw-deprecation`. Test adapters are
  fixtures, not real provider runs or live research achievements.
- Read-only browser regression on existing authenticated Math Pilot history:
  correct mission visible, zero `.katex-error`, document/content widths both
  1366px. Initial navigation timed out, but the following DOM observation showed
  successful navigation. Screenshot `/tmp/hive-tip033-historical-ui-2026-10-01.jpg`.
  No retained V2 event was fabricated or submitted; its new panel still requires
  a live visual scenario. No process/queue/campaign was started.

## Mathematical review

Contractor checked the exact reduction of `m=2^a ell` (odd prime ell exponent
ONE) to the contiguous power interval, both divisor tests, and the four-case
lower-bound proof `min R_s >= 3*2^a-1`. A separately delegated skeptic reviewed
the written quantifiers and sharpness and found no flaw; its additional finite
checks are supplementary, not an expert or formal acceptance.

The proved tail yields `2^a <= (p+1)/3` for eligible targets. Computation here
audits ONLY a1..4, although without an s ceiling for those slices. The new
p131433121 witness at s164407 is a subclass hit, not improved overall coverage:
the previously retained s143 witness is smaller and remains valid. No target
lemma is silently added to the separate V2 collision packet.

## Deferred / next work

Run a bounded live V2 scenario and visually inspect its actual retained event.
Design certified, resource-bounded factorization for the remaining exponents
before claiming a complete target decision. Compare the written lemmas against
full primary literature and formalize if promoted. Higher odd-prime exponents,
two odd-prime cores and universal escape remain open. No paid API, production
build, publication, deployment, commit or push in this slice.
