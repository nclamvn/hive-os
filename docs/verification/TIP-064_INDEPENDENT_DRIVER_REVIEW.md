# TIP-064 independent Driver review

Status: **PASS — offline engineering review of the final frozen Driver scope.** No remaining actionable finding. Reviewer is the Core Builder and did not author or edit the Driver product/tests. Contractor acceptance, local readiness, live execution, mathematical acceptance and browser verification remain separate.

Authority: sealed TIP-064 `08bb5e527c43c5890bb02a5cbf1a7585d08409c5b20e1a2b5b0d8c571e09f23a` and incorporated proposal `119e545a027c43bba63a320ffdd189659a90585d1d8679105eb7c3310bbf52b1`. Driver completion was read fully; its independently verified final pin is `84f1afd634dec5dcbf35952d54992bdb704b300d01b5410ff9849634577db166`, superseding `458aa76b1c219a0031d80ddcf8b0cd5713ac8e7ff3c90ed647dd75f476a63ffb` by report-only clarification of historical scalar unit controls versus standalone checker execution. All19 product/test pins stayed unchanged. This report does not silently accept an earlier checkpoint: the findings below were consequential, explicitly sent to Main, and repaired by Driver under Main approval before final signoff.

## Findings and closure

1. **Repaired: root-status-dependent atomic cycle selection.** The inherited active-cycle predicate selected only roots in AWAITING_REVIEW/APPROVED. A failed root still owning a running cycle could disappear from the atomic request check after preflight. The new v3-only OR now selects active cycles independently of root status and refuses before the historical DEAD_LETTER-review exception. A FAILED-root/RUNNING-cycle regression checks the actual request transaction query and no creation. Historical v2 predicate/exemption stays unchanged.
2. **Repaired: exact outer IDs did not bind the actual job payload.** Initially, a correct outbox ID/topic/aggregate/command could carry a sibling run/case payload. A worker could then call a model for that sibling before final inspection failed. The new runtime validates exact one-key payloads at outbox, dispatched-job, claimed-job and owned preexecute reads; verifies prepared role IDs; and passes a trusted `proofUnitTarget` to the fresh worker/review-kernel load. Those kernels refuse a sibling loaded row before identity import, fence or model. Current job payloads are rechecked at solver fence/retention and review retention. Offline tests cover poisoned payloads, loaded-row races and in-flight lineage drift, with no sibling model call or retained ledger.
3. **Repaired follow-up: rejected-claim cleanup could lose the known post-claim version.** The claimed identity is now captured and journaled before cleanup. Cleanup is still attempted if that first append fails; its result is separately recorded as retained dead-letter or explicit FAILED_UNCERTAIN. A cleanup-throw regression retains job ID/version/attempts without leaking diagnostics or retrying. Permanently failed storage cannot be made durable by software; the report accurately keeps that uncertainty.

No broader scope was added by this reviewer. The frozen Core and old TIP-062/TIP-063 artifacts were not edited.

## Reviewed boundaries

- Normal request admission refuses a wrong provider/model before durable creation, requires fixed prospective v3 brief/scope and uses existing tenant-authorized storage/outbox. Same-model sealed calibrations remain the request transaction's authority; preflight is not a bypass.
- One-shot preflight uses an explicit actor lookup, active workspace/membership/organization membership, read/request/jobs capabilities, fixed mission, safe local environment/database and subscription login. No first-admin selection, calibration backfill or shared worker loop.
- Solver imports only fixed42-file identity under the unchanged internal v2 binding, converts it to NOT_FRESH identity admission, then prepares the full solver payload before the single-dispatch fence. The worker rechecks lease/version/attempt1/current case and current payload before fence and retention. It attaches host evidence only after trusted output, and creates only the normal automatic review event.
- Both full review payloads are admitted before the review fence. Individually guarded CRITIC/ADVERSARY calls retain exact prepared stdin/schema, bind the complete solver-attempt digest, require distinct contexts and coherent positive actual usage, and refuse host echoes, wrong roles, drift, malformed findings and overflow. Current contract/attempt/dossier, advisory lock, lease/version and lineage govern retention. External row case/run IDs are passed to conservative evaluation and passive readback.
- Adapters send exact stored stdin/schema, use fresh ephemeral read-only local contexts, restrict child environment, require subscription sign-in, and reject reported tool/web/file/unknown protocol activity. Legacy schemas explicitly omit prospective model/host fields. No parser repair, agreement manufacture or fallback to a legacy reviewer occurs.
- New orchestration selects one exact solver outbox/job and its one exact automatic review, attempts1, then requires a valid ledger6 and exactly two succeeded selected jobs for completed classification. Root conclusion remains PARTIAL/INCONCLUSIVE; honest REJECTED/INCONCLUSIVE audit is not rewritten to agreement.
- One original30-minute budget,240-second owned child deadlines,1MiB stream caps,10-second/53,211,840-byte42-file import and1800-second leases are retained. Cancellation prevents subsequent roles/retention; no budget reset or detached Promise.race. Create-only600 complete-byte/fsynced receipts preserve known IDs, actual returned contexts/usage and input/prompt/schema/source pins. A completed critic remains journaled if adversary fails. Failed receipt/readback cannot yield completed success or authorize retry.
- Cycle/portfolio entry refuses the prospective family, including malformed family markers, before generic OPEN routing. Existing historical interfaces remain separate.

## Independent tests

Final post-freeze run at 2026-10-04 12:40:30 local: **16 suites,367/367 PASS,1.60s**. Eight new Driver suites contribute177 tests. Eight additional Core/legacy suites contribute190, covering Core bindings, exact selectors, old local math/cycle adapters and old controlled observation/budget/receipt behavior. All19 Driver source/test files passed scoped ESLint with exit0 and no warnings. Whole TypeScript was not rerun concurrently with Main final QA; Driver's own final whole-type pass is evidence reported by Driver, not a separate reviewer run.

Command: `npx vitest run` over `math-lrc-proof-unit-identity`, `math-lrc-proof-unit-worker`, `math-lrc-proof-unit-cycle-refusal`, `math-lrc-proof-unit-request`, `codex-local-proof-unit`, `lrc-proof-unit-observation`, `lrc-proof-unit-observation-runtime`, `lrc-proof-unit-observation-cli`, `math-lrc-proof-unit-live`, `command-runtime-exact-selectors`, `codex-local-math`, `codex-local-cycle`, `lrc-controlled-observation`, `lrc-controlled-observation-runtime`, `lrc-controlled-observation-cli`, `lrc-controlled-observation-abort` under `tests/unit/`, each with `.test.ts` suffix.

External boundaries were mocked. CLI tests launch only Node refusal paths and temporary receipt IO; production/local guards prevent DB/provider runtime import. This is not a real Prisma transaction, provider execution, subscription login or end-to-end/browser proof. No provider/model, DB, browser, checker, forest, server/build/install, environment-file or Git action was performed by this reviewer.

## Independently verified final pins

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

## Remaining limits, not findings

Reported tool activity is refused after observation; prompts/read-only sandbox are not an attestation that tools or unreported activity could never occur. The reviewer did not observe actual provider output. Arbitrary JS callbacks/DB/filesystem operations are cooperative/non-preemptible; child timeout and subsequent-action budget checks do not establish hard JS/DB/fs interruption. Storage failure can prevent durable receipts, and cleanup uncertainty needs read-only reconciliation, never automatic replay. Hash/row binding is not cryptographic authenticity against a fully malicious host/DB fabricating every field. Identity observation is not fresh semantic completeness. Conditional AI review does not close unsigned premises, global14/15 LRC, formal proof, other60 primes/23applications, novelty or external/human acceptance. Browser geometry and whole live workflow remain NOT_RUN here.
