# TIP-064 Driver completion — prospective bounded proof-unit observation

Status: DRIVER_ENGINEERING_COMPLETE. This is offline engineering evidence only; Contractor acceptance, readiness, live observation and browser verification remain separate. No model, DB, login, browser, standalone checker, server, build, installation, Git or environment-file action was performed by this Builder. Historical scalar unit controls ran only inside the listed offline regression suite with its explicit test activation; no forest or semantic replay ran.

Authority: sealed TIP `docs/contractor/tips/TIP-064_LRC_DURABLE_PROOF_UNIT_AUDIT.md` SHA-256 `08bb5e527c43c5890bb02a5cbf1a7585d08409c5b20e1a2b5b0d8c571e09f23a`, incorporating proposal `119e545a027c43bba63a320ffdd189659a90585d1d8679105eb7c3310bbf52b1`. Vibecode Kit was used to separate Builder scope, offline evidence and Contractor activation; it did not authorize a live action.

## Final owned source/test pins

| File | SHA-256 |
| --- | --- |
| `src/modules/research-sandbox/worker.ts` | `df0327cde525f567dcc0d5669b90633381d83537faf9e8ab7302143a22730cec` |
| `src/modules/research-sandbox/agent-review-kernel.ts` | `2cea6b0b5489f34fb88278c76176268720a4d0a450d92615644b02e21e7eee7e` |
| `src/modules/research-sandbox/kernel.ts` | `46d77e92d17eca3c16f5e27591ad23cb64a53492138e8332695ea9c6af0f1830` |
| `src/modules/research-sandbox/math-cycle-kernel.ts` | `1731a69dffe618536808810b67b4746c0348fdf2c7f60059a251d54d234632c0` |
| `src/modules/research-sandbox/adapters/codex-local-math.ts` | `358550ea220538b5e68abd22818906cafcd11af795c70ba8c444683288f95c08` |
| `src/modules/research-sandbox/adapters/codex-local-review.ts` | `7dc0e2531d5407e78a352d361938251b52e3ee4a16ab3b69bb2504541f4f6fcd` |
| `src/modules/research-sandbox/math-lrc-proof-unit-identity.ts` | `89c56f84354cd84b99063a060805d3b65ed11c1713a2b4290756d14e42087ea9` |
| `src/server/operations/lrc-proof-unit-observation.ts` | `195cb24c5e6e1eadd83ac4f99b4fd3b48c896ee7cd308199177d52cb8a6da66f` |
| `src/server/operations/lrc-proof-unit-observation-runtime.ts` | `1431c1cdb94e30d470a72519f5f9aa0e6bb9ae4c85fb4f0cee0b10a35dbf86a7` |
| `scripts/operations/lrc-proof-unit-observation.ts` | `50c215fa0836e67ea37e46012d7843c1e44d1553e3e1300de7405ee62b88a29b` |
| `tests/fixtures/lrc-proof-unit-live.ts` | `515ca8874dc443d7fb468dee5d99853b3f3096f445f92e750a8150be0649ba2b` |
| `tests/unit/codex-local-proof-unit.test.ts` | `666ce35ba0453e4e19928f9fa586f4ca0272d8ccc0c8026fb6215c2ae5501646` |
| `tests/unit/math-lrc-proof-unit-worker.test.ts` | `34af126325cf8ee259a9afee02aa544b9ccd65b13237f4a17121dd2e49512cf5` |
| `tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts` | `8a374fba8842bdea44c846b3c0fb59a7da2b19fad07aa51a693b9d5226005667` |
| `tests/unit/math-lrc-proof-unit-request.test.ts` | `1b8562c16b24c921dbac857edd08424e754be7161ca6ffc2aefe3d6368bb5b85` |
| `tests/unit/lrc-proof-unit-observation.test.ts` | `80978c3c6d70b91b66a75dc18cbf29609069a011c99681dc1a3a9ca9b7d1008e` |
| `tests/unit/lrc-proof-unit-observation-runtime.test.ts` | `16ba032cce1ca437a021c1059a526528b4a93f065b6caf6aa10e4bb77a4bd41d` |
| `tests/unit/lrc-proof-unit-observation-cli.test.ts` | `7bf90580ea47c993e9e5869f950404f5cdc96839ea4430f87089c5991618e946` |
| `tests/unit/math-lrc-proof-unit-identity.test.ts` | `02eca8bc8c19f131c6aaf9fe97860dfd85a74e69d5f7220ef396846d1b0388c0` |

The old062 pure orchestrator/runtime/CLI are unchanged: respectively `03964b2764d94122b049a95dbd0d6c37188dbc155cc38ea8f71ecd1e8e5d43da`, `ae62c093435774e622ff03bf1bd43aff6aa607bfbc9b21c1b2c4798f18c90a0a`, `e0531135c8a4135db3f6f4e8389447619e6683a61cb5740c4fa800e96f3a1cdb`. Its invocation/final v5 predicate did not change. Frozen063 packet module remains `294b9ba3e804960478bbcee3df8f771b82e748818d9c6500802c597740ee8f96`; old offline audit module/test remain `d5db654c7e6104a00860af868f7904d55844d6470d42315fd52a49876ba3768d` / `b957dc1395360cec658b8daf99b606c96c07eaefab1ab672e458c4f3949320ed`. No prior completion/review/receipt artifact was edited.

## Delivered R1–R4/R6–R7 engineering

- R1: the normal authorized request handler admits the explicit new request only with fixed gpt-6-sol/local capability before command creation. It stores the fixed contract-v3 using existing OPEN case storage and normal solver outbox. No migration or new executor. Malformed proof-family markers refuse before generic OPEN/cycle/portfolio fallback. Old query semantics remain unchanged except narrowly conditional v3 checks.
- R2/R4: the worker reuses the unchanged bounded campaign importer only internally at its original v2 digest for fixed42-file identity observation. It derives new IDENTITY_ONLY/NOT_FRESH admission, never a v3 campaign root or semantic replay. Identity import and full solver preparation precede the provider-dispatch fence. Both complete review inputs are admitted before the review fence. Transport passes exact retained stdin/schema bytes; no truncation. Provider host echo, missing/impossible usage, mixed lanes, wrong roles, context reuse, complete-input overflow and invalid findings refuse.
- R3: the existing solver job creates only its normal automatic review outbox. The one-shot dispatches and claims exact outbox/job IDs under exact actor/tenant authority, attempts1 and1800-second lease. Outbox/job/claimed/preexecute payloads must match the actual created case/run; loaded kernel rows check the optional one-shot target before import/fence. Current job payloads are checked again before solver fence/retention and review retention. Distinct solver/critic/adversary contexts, full attempt digest, current contract and advisory/lease/version fences govern retention. No retry/backfill.
- R3 race repair: v3 atomic request query includes active cycles independently of root run status; active presence refuses before the historical terminal-review exception. Preflight is read-only and the request transaction remains final authority. Failed roots with running cycles are not exempted.
- R4: model-only output is parsed separately. Trusted worker/kernel attach full host solver evidence and reviewer inputs after actual return. New strict ledger6/evaluation comes from Core, with exact external case/run IDs passed by this Driver. Readback uses actual row IDs and requires valid v6 bindings; root remains PARTIAL/INCONCLUSIVE, including a REJECTED audit as an honest completed observation.
- R6/R7: a new prospective CLI/orchestrator/runtime reuse the unchanged original30-minute monotonic budget, 240-second child cap, 1MiB stream caps,10-second identity import and original complete-byte fsync writer. Cancellation owns its children and checks budget before each new role/retention; no detached Promise.race. Completed classification requires exactly the two selected succeeded jobs at attempts1, three attempted roles, actual case/run/contract bindings, fixed packet and valid ledger6.
- R7: create-only mode600 JSONL retains exact known command/run/case/outbox/job identities, source-file SHA pins, attempted roles, and actual returned thread/usage plus packet/sourceData/input/prompt/schema digests. Completed critic data remains journaled if adversary later fails. Claimed payload rejection journals the captured post-claim version before cleanup and records DEAD_LETTER/uncertain cleanup status. Receipt failures after side effects are PARTIAL/EXECUTION_UNKNOWN, never fabricated NOT_RUN; unavailable usage is null/UNAVAILABLE, never zero backfill.

R5 passive UI is owned by the separate UI Builder. This report does not claim UI or live acceptance.

## Repairs and verification

Main review required actual case/run IDs in evaluation, early fixed-model routing, and strict observed-tool refusal. Independent Core review found two consequential edges: atomic cycle selection had retained a root-status restriction, and matching outer outbox/job IDs did not bind their payload to the exact created target. Both were repaired under explicit Main approval with offline regressions, including failed-root/active-cycle races and sibling payload substitution. A follow-up claimed-cleanup journal gap was repaired so a failed failJob call cannot lose the captured owned ID/version. No old lane bypass was added.

Final focused offline run: **407/407 PASS in16 suites,5.04s**,2026-10-04 at12:38:37 local. Of these, eight new Driver suites contain177 tests; eight adjacent historical suites contain230. Actual worker+review-kernel success retains a valid v6 ledger and automatic review event using injected external boundaries; failure tests verify pre-fence refusal, no sibling model call, no partial ledger, current payload/lease drift, abort/no next role, known IDs and cleanup uncertainty. Adapter tests mock spawn/files only; CLI subprocess tests exercise production/argument refusal and temporary receipt-writer IO, not a provider or DB.

Focused command: `npx vitest run tests/unit/math-lrc-proof-unit-identity.test.ts tests/unit/math-lrc-proof-unit-worker.test.ts tests/unit/math-lrc-proof-unit-request.test.ts tests/unit/math-lrc-proof-unit-cycle-refusal.test.ts tests/unit/codex-local-proof-unit.test.ts tests/unit/lrc-proof-unit-observation.test.ts tests/unit/lrc-proof-unit-observation-runtime.test.ts tests/unit/lrc-proof-unit-observation-cli.test.ts --maxWorkers=1`.

Adjacent command adds `lrc-controlled-observation.test.ts`, `lrc-controlled-observation-runtime.test.ts`, `lrc-controlled-observation-cli.test.ts`, `codex-local-math.test.ts`, `math-lrc-campaign-integration.test.ts`, `math-agent-review.test.ts`, `research-lrc-proof-unit-audit.test.ts`, `math-lrc-proof-unit.test.ts` under `tests/unit/`. Final `npx tsc --noEmit --incremental false` exited0; scoped ESLint on all19 owned source/test files exited0 with zero warnings. Production build is Main-owned.

## Ready operator invocation — Main only after acceptance

From repository root, with existing local environment supplied by Main, exact fixture actor explicitly chosen by Main, shared worker/OpenAI/Docker flags OFF, local dev DB only, and a never-used absolute receipt path:

```sh
NODE_ENV=development node --env-file=.env --import tsx scripts/operations/lrc-proof-unit-observation.ts preflight --actor-email pilot.demo@hiveos.invalid --receipt /absolute/new-tip064-preflight.jsonl
NODE_ENV=development node --env-file=.env --import tsx scripts/operations/lrc-proof-unit-observation.ts run --actor-email pilot.demo@hiveos.invalid --receipt /absolute/new-tip064-run.jsonl --activate-local --confirm-one-run
```

These commands are instructions, not executed by this Builder. Preflight leaves dispatch authority closed; run enables only its process-local queue/local-Codex/campaign flags before runtime import. Pure environment guard rejects remote databases, connection-query overrides except schema=public, wrong deployment/model/shared flags before runtime/DB initialization. Actor ID may replace the exact email; never select the first administrator. Receipt output carries the selected-case URL on completion. Refusal, timeout, criticism or malformed output does not authorize another run.

## Trust and budget limitations

Read-only Codex sandbox and no-tools prompt are not OS attestations that tools could never execute. The new JSONL parser refuses reported command/web/tool/file/unknown activity and unsupported protocol; it cannot undo activity already dispatched, observe unreported actions or turn instructions into a security proof. Do not waive an unexpected live protocol or rerun.

Arbitrary injected JavaScript callbacks and DB/filesystem operations are cooperative/non-preemptible boundaries; no hard JS/DB/fs walltime or external authenticity is claimed. Owned child timeout/cancellation is enforced only for the launched child, with listener/timer cleanup; post-operation budget checks govern subsequent actions. Complete-byte serial writes precede sync, but a storage/power failure can still leave partial JSONL. Cleanup failures remain explicit uncertainty and need read-only manual reconciliation, not replay. Hashes bind retained bytes/rows and reject tested substitution, not a malicious host that fabricates every field. Conditional review leaves unsigned premises, global14/15 LRC, other60 primes/23applications, formal proof, external/human acceptance and novelty OPEN.
