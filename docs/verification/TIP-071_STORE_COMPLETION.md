# TIP-071 STORE completion — fixture-only durable storage

Status: source/test freeze candidate; Contractor and independent peer review remain required. This is not live M1 acceptance, not production authorization, and not a mathematical theorem.

## Scope and authority

Only four new STORE-owned TypeScript/test files were created. No pre-existing product file, worker, route, permission model, private diagnostics history, DB row, model configuration, Git state, or historical evidence was changed. Every test root was a unique `/private/tmp/hive071-store-*` fixture. Temporary evidence remains recoverable; no automatic cleanup occurred.

The production constructor refuses `AUTHENTICATION_REQUIRED` before storage IO. Fixture construction requires both `NODE_ENV=test` and VITEST. An injected fixture fence is not a production authority adapter. Opaque WeakMap handles are purpose-specific; copied, foreign and wrong-purpose handles refuse.

## Implemented

- Exact descriptor, context, owned-claim and receipt schemas; bounded plain JSON rejects accessors, non-plain prototypes, inherited `toJSON`, sparse arrays, cycles, excessive depth/node/UTF-8 length before hashing or schema parsing.
- Three role slots reserved together under one quota lock. The approved descriptor digest plus nonce forms a recomputed spent intent; all three reservation documents must agree on the descriptor, three unique UUID slot IDs and distinct role-to-directory assignments.
- A single 100-slot/128-MiB quota counts V1 history, V2 history and expired/partial slots conservatively. Slot charge remains 1,146,880 bytes; prepared/stdout/finite caps remain 49,152/1,048,576/32,768 bytes. All control files in a slot share 16,384 bytes, not a per-file allowance.
- Complete writes, file and parent-directory fsync, create-only immutable files, 0700 directories/0600 files, no-follow open, full ancestor-chain checks, owner/inode/link checks and before/after authority fences around underlying asynchronous IO. Open handles are closed if authorization fails immediately after acquisition. Unknown outcomes retain partial bytes and the lock; no automatic retry, stale-lock removal, purge or recovery is provided.
- Fresh staged finite read before final critic transport; immutable pre-critic replay receipt followed separately by post-ledger admission receipt and final commit marker. No final-ledger circular reference enters the pre-critic receipt.
- Exact finite lineage, explicit mapping between the method preset and the existing finite predicate, exact producer/checker source path pins, exact replay checker source path pin, and expiry bounded by the earliest original descriptor/owned-claim expiry without renewal.
- Full prepared wire records are validated with the existing prepared-input schema and renderer validation against the immutable binding, role, actual retained solver attempt and (for critic) exact stored finite record/source pins. The original ledger's payload `roleInputDigests` remain distinct from full-file `preparedByteDigests`. Transport manifests bind both and actual stdout bytes.
- Post-ledger `finalFiniteMetrics` preserves the same two checker calls, original/replay operation and checker-time totals; final aggregate elapsed time cannot regress below the pre-critic observation or exceed the existing 5-second cap. The receipt cannot predict its own future fsync; the bridge enforces the cap after fsync and records the final observation.

Every durable result retains `FINITE_ONLY`, global/real-time/formal/external/novelty `NOT_ESTABLISHED`, `dispatchAllowed=false` and `proofClosure=false`.

## Verification and failure trail

All six enable flags were explicitly OFF in final unit execution: research worker, pilot queue, campaign, OpenAI, Codex-local and Docker sandbox. No model, DB, network, install, actual private-root IO or Git action ran.

Final explicit selector:

```text
node node_modules/vitest/vitest.mjs run --project unit tests/unit/math-diagnostic-capture-v2.test.ts --maxWorkers=1 --no-file-parallelism
```

PASS: 58/58, start 2026-10-04 21:21:32 local, duration 5.77 seconds. Four-file owned ESLint: exit 0. Whole-repository typecheck and aggregate acceptance are Contractor-owned, not claimed here.

Coverage includes actual 98-slot quota refusal for expired/partial V1-only and 95 V1 plus three V2 slots, unchanged legacy bytes, malformed reservation versions, recomputed intent tampering, aliased slot groups, aggregate control overflow, separate payload/file hashes, exact named source paths, copied handles, terminal-purpose transition, expiry, per-IO revocation, acquired-FD closure, symlink/hardlink/mode/ancestor drift, immutable receipt/seal readback, missing seal, partial allocation and fsync failure. The 128-MiB root-byte guard is retained; with 100 slots and these exact aggregate caps the maximal charged slot bytes are 114,688,000, so a valid slot-only history cannot independently reach 134,217,728. No fabricated oversized history is presented as a positive root-byte test.

Earlier failing checkpoints were retained as development evidence: an invalid computed-key test prevented collection; corrected before execution. A prepared-file versus old payload digest mismatch required an explicit two-digest transport contract. A schema patch initially targeted the wrong line, causing 8/48 schema failures; repaired. A reversed V2 slot group passed an insufficient per-slot check (1/57 failure); this prompted cross-reservation group completeness/signature validation. A mixed-history test iterated beyond its 95 V1 IDs (1/59 failure); corrected. Final 58-test run is the current result, not an assertion that earlier runs passed.

## Frozen file pins

```text
aa32e8cb90d6470460c8b37083109b814c7fd968b77817a9275300e97538c9c4 src/modules/research-sandbox/math-lrc-durable-replay.ts
29897c95057f9c09e48e9534052b0b072d15049d81a84b5b260ab5e84b590286 src/server/operations/math-diagnostic-capture-v2.ts
c3e1011e84e3459eac644bdfe965fc75b0524e321797c3b12484cd187f1fd157 tests/unit/math-diagnostic-capture-v2-fixture.ts
24115840c7e5e34d3182bd2c4c28e2984e6551f671802675c2f0dacd43d71365 tests/unit/math-diagnostic-capture-v2.test.ts
```

## Remaining boundaries

TIP-072 must provide actual authenticated host authority, root ownership/state fencing, actor/tenant/capability/command/outbox/lease verification and real prepared/transport retention integration. Existing V1 maintenance directories are currently unsupported and conservatively STOP new allocations; bounded read-only maintenance interoperability belongs in that integration, not an unauthorized recovery API. Missing reservations/unknown history also STOP and remain charged in place.

TIP-073 and a separate human-authorized G2/M1 gate are still required before model execution or campaign. Fixture callers cannot self-declare admission or mint production authority. No LRC-14/15 proof, novel mathematical progress, external review or completed live E2E is established by this storage slice.
