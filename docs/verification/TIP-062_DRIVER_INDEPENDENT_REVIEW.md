# TIP-062 Driver independent review

STATUS: PASS — independent offline R2–R5 source/test review of the final Driver
freeze. R8, actual DB/model/operator-login/browser observation: NOT_RUN here.
Overall acceptance and conditional live authorization remain Contractor-owned.

Reviewer: the TIP-062 UI Builder, who did not author the Driver, CLI, runtime,
abort seams or their tests. No Driver product edits were made by this reviewer.
Read full AGENTS, current durable handoff, sealed TIP-062, pinned approved
proposal and Vibecode Kit QA/report instructions before review. The proposal
pin is f74b2114218eb7d6a533aec9797a649ec5549a384984a35c5064c731711c3009.

The final Driver completion report was fully read and independently hashed:
2b23280f17010e0588f73d5ad5ab15f32d1814d46e6d57434b97e5a194f41ed6.
This review follows its explicit supersession of the initial 89-test and later
114-test freezes, not their obsolete source pins. All nine final source/test
pins below were checked locally against the reviewed files. This report update
explicitly supersedes its own prior114-test freeze
af546061d2c556a0b0a1a5090fbece0b941c809487e9ec65caec946b232db0b9
after Contractor-approved complete-byte receipt hardening; no historical
Contractor artifact is resealed.

## Source review and acceptance

Full three Driver files, two affected adapters and four new test files read.
Adjacent existing authorization resource resolution, database pool wiring,
calibration loader/validator, math request/conflict/read loader and normal
worker/review seams were inspected where relevant. This is not a claim of a
new independent review of the entire historical codebase.

- R2 PASS offline: one fixed-preset authorized creation, only its exact solver
  outbox/job and automatic review outbox/job, no review enqueue or retry.
  Runtime verifies organization/workspace/command/topic/aggregate/attempts;
  claim IDs and review-vs-solver noncollision are checked before execution.
  Ambiguous creation is PARTIAL_OR_FAILED, not a false NOT_RUN. The final
  completion predicate requires exact case/run, fixed contract digest, valid
  ledger5, three attempted roles, both exact jobs SUCCEEDED with attempts1 and
  PARTIAL/INCONCLUSIVE root conclusion. It does not treat a favorable model
  response as proof or successful persistence.
- R3 PASS offline: explicit actor ID or unique email, exact active workspace,
  active workspace/organization memberships and read-only capability checks;
  existing loader enforces fixed mission/workspace and same-provider/model
  sealed calibrations. No first-administrator choice or backfill. Conflict
  scan ceiling refuses uncertainty; active cycles override the legacy
  dead-letter-review exemption. Preflight queue/campaign authority remains
  closed. Pure local guard precedes dynamic auth/DB runtime import, admits
  only loopback hiveos_dev/hiveos_test and no connection query override apart
  from a single schema=public. Shared worker/OpenAI/Docker/model override refuse.
- R4 PASS offline: one monotonic clock starts before runtime import; original
  30-minute outer, 240-second child, 1MiB per-stream, 10-second identity importer
  and 1800-second lease are preserved. A single shared signal kills only owned
  child processes, waits for their close and cleans timer/listener resources.
  Stage/role admission reserves remaining time, no deadline reset or version
  heartbeat. Capture precedes receipt/deadline postchecks; incomplete case
  lookup retains known command/run/outbox identities. Final-sync expiry cannot
  return COMPLETED. Complete disk failure reports execution uncertainty rather
  than retrying or inventing a retained result. The final complete-byte helper
  advances UTF-8 Buffer offsets by the exact returned count, rejects no-progress
  or impossible counts and syncs only after every byte. Storage continuation
  does not replay any model/job/command invocation.
- R5 PASS offline: standard TIP-061 host-envelope/snapshot/frozen-view, same
  facts, fixed prose, distinct contexts, accounting and v5 read guards remain
  in normal handlers and adapters. The new wrapper does not replace these
  controls with an arbitrary caller success flag. Requested gpt-6-sol is fixed
  for all three roles. Missing/invalid review, unsafe conclusion, absent host
  outcome fields, wrong role sequence or extra role refuse completion. Usage
  remains actual retained accounting or null/unavailable, never fabricated zero.

Retained evidence is NOT_FRESH identity-reference admission. No new mathematical
forest replay, global14/15 proof, other60-prime closure, all23 application closure,
formal proof, novelty or independent/external model attestation is established.

## Consequential findings and verification of repairs

1. Contractor found URL query host overrides could bypass the original local
   guard. Reviewer independently read the installed pg-connection-string parser
   and ran its pure parse function: localhost?host=remote.invalid and encoded
   %68ost resolve to remote.invalid; host=%2Ftmp resolves to a Unix socket;
   schema=public leaves localhost unchanged. No connection was opened. The
   final allowlist blocks these and SSL-file/service/unknown/duplicate controls.
2. This reviewer found an AWAITING_REVIEW/no-ledger case with a DEAD_LETTER
   review could be exempted even when it also had a QUEUED/RUNNING cycle.
   The inherited legacy request loop did not close that hole. Driver now
   selects bounded active-cycle presence and refuses before the exemption;
   only the prospective Driver changes, not the old kernel. Both active
   statuses, safe terminal exemption, missing terminal, running root and exact
   requester are exercised by six mocked runtime tests. Repair source reread.
3. Contractor's final capture review found successful command journaling
   could fail before returning newly committed identities. Reviewer inspected
   actual binding, not only outer orchestration stubs: successful create now
   returns exact IDs before the outer captured CREATED append; failed lookup
   carries known IDs through ObservationStop. Three additional runtime controls
   verify success-journal refusal, outer CREATED append failure and lookup fault.
4. This review's earlier optional short-write note was accepted by Contractor
   as narrow receipt-contract hardening. FileHandle.write(buffer, offset,
   remaining, null) now advances a serial handle only by bytesWritten, retaining
   multibyte UTF-8 correctly across split writes. Helper rejects zero, negative,
   oversized, fractional and NaN counts; write/sync faults propagate. Eight new
   injected controls verify those paths and sync-after-completion only. The
   helper has no model AbortSignal gate, so an expired model budget does not
   suppress attempted final PARTIAL journaling. It is in the existing pure
   module; pre-runtime local guard and side-effect boundaries remain unchanged.

No unresolved consequential finding on this final reviewed freeze. These fixes
were verified before any live activity by the reviewer. Earlier checkpoints
105/105, 111/111 and 114/114 were superseded by the final run below.

## Independently executed offline checks

Final command (installed Vitest, no real DB/provider):

```sh
node node_modules/vitest/vitest.mjs run tests/unit/lrc-controlled-observation.test.ts tests/unit/lrc-controlled-observation-abort.test.ts tests/unit/lrc-controlled-observation-cli.test.ts tests/unit/lrc-controlled-observation-runtime.test.ts tests/unit/math-lrc-campaign-integration.test.ts tests/unit/math-lrc-campaign-adapters.test.ts tests/unit/codex-local-math.test.ts --project unit --maxWorkers=1
```

7 suites, 122/122 PASS, 2.07s at09:22:56 local2026-10-04. Of these87 are
four new Driver suites and35 adjacent preexisting integration/adapter/parser
tests. Codex transport is mocked. Runtime authorization/tenant/DB/commands are
mocked; CLI rejection tests spawn only Node in production/invalid environment,
refusing before runtime import. They do not invoke operator login, Codex model,
real DB queries/writes, workers or paid APIs. Request-count assertions are stub
flow evidence, not proof that an actual persisted run completed.

Own final whole installed TypeScript --noEmit exit0 (4.84s); scoped nine-file
ESLint exit0 (0.91s), zero errors/warnings. Contractor owns full build/regression
and frozen-history pin audit. No reviewer build/server/env/Git/DB/model action.

## Limitations

Real authorization/calibration availability, transactional execution, filesystem
receipt success and actual model accounting require conditional live evidence;
offline stubs do not satisfy R8. No actual preflight/run command was executed
by this reviewer. Browser visual/interaction acceptance is NOT_RUN.

Budget admission and child cancellation are cooperative; synchronous JS/FS
and DB transactions are not hard-preempted. Expired or failed retention is
partial/unknown, not an OS resource or token-budget attestation. Operator must
use the final authoritative journal event and never retry an uncertain run.

The resolved short-write control is injected offline evidence, not a real
disk-full/power-loss experiment or filesystem recovery certificate. A failed
partial write may leave a partial JSONL record; subsequent retention is unknown
and execution is not retried. Complete-byte writes plus fsync do not attest
arbitrary hardware durability, recovery or preservation across power loss.

## Final reviewed source/test SHA256

```text
03964b2764d94122b049a95dbd0d6c37188dbc155cc38ea8f71ecd1e8e5d43da  src/server/operations/lrc-controlled-observation.ts
ae62c093435774e622ff03bf1bd43aff6aa607bfbc9b21c1b2c4798f18c90a0a  src/server/operations/lrc-controlled-observation-runtime.ts
e0531135c8a4135db3f6f4e8389447619e6683a61cb5740c4fa800e96f3a1cdb  scripts/operations/lrc-controlled-observation.ts
55bea4705eee0cb86694841ac55e0db442b1dc29b70ff917dea3173735c2ad52  src/modules/research-sandbox/adapters/codex-local-math.ts
b6758781e1e270196e49728bfc8199f226e2d352ff9b1fe20a5c8e362b9caea2  src/modules/research-sandbox/adapters/codex-local-review.ts
08d6b23601d7a607a55d029ba783e741087c96a710851f70d228ffa1be3cee02  tests/unit/lrc-controlled-observation.test.ts
9f4795e533400dfce707de093d09531eb547ca1078b37abf90363d5c8ccdc9de  tests/unit/lrc-controlled-observation-abort.test.ts
8547bdb13a8346a395a92a6e74955b02f91a2c03aa1292aadd95a73bd2e6cdb1  tests/unit/lrc-controlled-observation-cli.test.ts
3fe9b51b946956706dfb1090d5136066e8b8201b03b32157488ee00e26607552  tests/unit/lrc-controlled-observation-runtime.test.ts
```

This report is a new review artifact outside the sealed Contractor manifest.
No historical report/source/artifact reseal or product edit by the reviewer.
