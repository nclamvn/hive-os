# TIP-065–068 Core cross-review by UI Builder

Date: 2026-10-04. Reviewer `/root/prefix_kz_ui`; read-only product review.
Final status: PASS, no remaining consequential finding in the reviewed slice.
This review is not model execution, external mathematical acceptance or a
global LRC proof. Main owns whole-task acceptance.

## Reviewed scope and one resolved finding

Read the complete finite-unit, live-input and ledger7 modules, the generic
durable-reader branch and their bounded offline tests. No product edits were
made by the reviewer. Tests ran only after Core's explicit source freeze.

**P2, resolved by Core before freeze:** the public finite verifier's unsupported
return preceded the 32KiB raw-input check; similarly, the host factory tested an
unsupported seed before the 2048B seed cap. A structurally valid oversized
out-of-domain certificate/seed could therefore bypass the promised byte refusal.
Current `math-lrc-method-unit.ts:168` checks bytes before broad classification;
line195 checks seed bytes before unsupported classification. Regression controls
use legal-shape oversized rationals, not only an unknown extra field. Core also
made external source-pin schema validation mandatory for MISSING records at 203.

## Source-backed conclusions

- `math-lrc-method-unit.ts:147–162`: independent consumer derives every critical
  root for each unit residue, sorted boundaries, alternating singleton/open
  cells, exact midpoint and wrap endpoint. It never calls producer. Exact
  rational tuple arithmetic independently derives union/complement. Equality
  is GOOD through strict `<` in155/160. Coherent deletion/mask/overlap/wrap
  mutations refuse, rather than gaining finite coverage.
- Lines110–124 and191–200: producer and consumer share one cooperative budget in
  host execution; parsed/intermediate integer arithmetic is constrained to
  256 bits and charged work to 2M, with 5s monotonic checks. This is cooperative
  refusal, not hard OS preemption. Malformed data refuses; well-shaped unsupported
  domains remain unsupported with no mathematical result. No domain widening.
- Lines178–203: status/hash/input/seed/result consistency, actual recorded
  counters and external binding/source pins are checked passively. MISSING has
  null seed/input/producer/checker/result; unavailable execution is not zero.
  These are unsigned local retained checks, not replay or an external attestation.
- `math-lrc-method-unit-live.ts:46–62`: exact fixed input bytes/schema and external
  contract/case/run/model binding; SOLVER gets no later evidence; ADVERSARY gets
  solver only; CRITIC receives the compact host summary and evidence digest,
  not adversary prose. Passive admission does not call prepare/checker/replay.
  Mathematical model outputs cannot author provenance, receipts or host fields.
- `math-lrc-method-unit-review.ts:17–32`: finite evidence is bound to the externally
  supplied actual reviewJobId, solver attempt digest, exact adversary report,
  source pins and seed. All three contexts are distinct; role/accounting and
  exact prepared-input references are validated. Unmatched quotes, missing seed
  or incomplete findings cannot yield a favorable conditional audit.
- `agent-review.ts:284–300`: generic durable read checks stored contract/attempt/
  research/ledger digests, outer dispositions and family pairing, then requires
  external actual case/run/reviewJob IDs and pins for v4/ledger7. There is no
  fallback to the record's claimed job/source IDs or historical lane.
- Review summary retains both analytic debts and literal global/formal/external/
  novelty NOT_ESTABLISHED/freshForest NOT_RUN. Three supportive model contexts
  can produce only reviewed-conditional PARTIAL, not theorem closure.

## Actual independent test execution

```sh
node node_modules/vitest/vitest.mjs run tests/unit/math-lrc-method-unit.test.ts tests/unit/math-lrc-research-program.test.ts tests/unit/math-lrc-method-unit-live.test.ts --project unit --maxWorkers=1
```

**3 suites, 134/134 PASS**, start 19:17:30, duration 1.33s. These are existing newly
authored Core tests rerun by this reviewer, not 134 additional unique tests and
not an independently authored theorem checker. Do not sum them with Core/Main
runs. No old collector, model/API, DB, browser, private-root, build, server,
environment or Git action occurred.

## Final observed pins

```text
72300a2c56ff21e449126fed3d57be247e3abc116e248b96777fc0b9b00812c5  src/modules/research-sandbox/math-lrc-method-unit.ts
580e4f653e8578a572f5310135d62bfe588a0d6e1d3f095ab58bf57dc61768be  src/modules/research-sandbox/math-lrc-method-unit-live.ts
470f33418ab1246dba6f7002d53c9584212e43ce79bac9cfb4bdfb1440295f6a  src/modules/research-sandbox/math-lrc-method-unit-review.ts
641fd6c3a8b8e2614720e2868c638b1d9a2c5ba3bb9f46e9f06bc5dbe5a1183e  src/modules/research-sandbox/agent-review.ts
437cd191a6b3a837ffc947a41c2001b07586da65032d36ad44256d9cd8638d09  tests/unit/math-lrc-method-unit.test.ts
06a491b3b934b8f9dd2078c84d952264a2e66ff64f6c42c2ccd2ce0179edcf28  tests/unit/math-lrc-research-program.test.ts
45364655fadced55e90f98e11fe9c8f3f1334d246f04dc43a329fd78ab393c80  tests/unit/math-lrc-method-unit-live.test.ts
```

Residual limitations: no live method experiment or efficacy benchmark; no
real continuous lower witness construction, independent lower-LRC proof,
global 14/15, formal kernel, source-peer-review or novelty acceptance. Reviewed
passive bindings intentionally do not execute the finite checker on GET.
