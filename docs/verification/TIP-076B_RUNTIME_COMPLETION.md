# TIP-076B — Durable generic campaign implementation checkpoint

2026-10-05. Status: PREDECESSOR_RUNTIME_QA_PASSED_RUNTIME_GUARD_PENDING_FRESH_QA,
not mathematical, public or production acceptance.
Authorized scope: TIP-076B and the approved TIP-076 blueprint, package 2 of
RESEARCH_CORE_V3_076. The committed mathematical target and all predecessor
research gates remain unchanged. This is local engineering, not mathematical
closure or an efficacy claim.

## Implemented scope

The new authenticated campaign aggregate and append-only event chain reuse the
existing command runtime, outbox, durable jobs, leases, tenant context and object
storage. The additive migration supplies tenant-bound foreign keys, forced RLS,
append-only events, immutable approval identities, monotonic reservations and
permanent revocation. The existing dispatcher has one explicit versioned
controlled-campaign seam; it is not a second scheduler.

The generic worker consumes domain-owned predicates, applicable method cards and
discriminating experiments. Wrong witnesses retire candidate digests, not false
goal predicates. Only a fresh bounded host check may establish exact local
closure. Typed exact predicate refutations stop without changing the target.
The adaptive policy is a deterministic fresh applicable-method policy, not a
claim of intelligent research superiority.

Effects have separate durable reservation, invocation, retention and verification
fences. NOT_CROSSED permits one charged replacement; uncertain START pauses;
retained original bytes are reused with at most one separately charged verifier
replay. Stale leases and revocation fence effects and adoption. Current reviewed
sources are charged and checked even before adopting a completed stage; a source
failure preserves historical mathematical closure while refusing execution.
Abort signals are accompanied by a host deadline race; this does not establish
external cancellation or production exactly-once behavior.

Original candidate bytes are retained before candidate schema admission when the
bounded transport result is usable. Requested model, attested model and usage
provenance remain distinct. Unknown usage stays null. First-claim queue latency
is derived from durable job creation and its actual first CLAIMED event, otherwise
UNKNOWN. Diagnostics and terminal postgrade/export/feedback actions have separate
irreversible bounded reservations and single-use START fences.

The backward-compatible optional bounded ObjectStorage.get port has local
NOFOLLOW descriptor reads and a capped S3 stream reader. Unbounded legacy calls
are unchanged. No actual S3/network access was performed.

## Reviewed source boundary

The sole installed anchor is
`docs/verification/TIP-076B_RUNTIME_SOURCE_BUNDLE.json`, installed by Main after
independent source review, never by a caller flag. The loader requires every
generic core/campaign/evaluator/control source listed in source-bundle.ts,
Prisma/schema/migration/role changes and bounded storage ports. C and D source
groups are mandatory, not optional. Actual checker sources, installed adapter
catalog, registry and fixed controlled-campaign catalog are pinned separately.
Catalog/adapter additions are reviewed extension exceptions; the generic runtime
digest still includes the executable generic evaluator and authenticated driver.
The loader bounds descriptor allocation, cumulative bytes including review report,
and elapsed time before effects. Exact installed adapter IDs must match the
reviewed checker-source mapping.

Admission bootstrap requires a bounded installed-source preflight before a
campaign exists. Successful admission retains observed bytes/elapsed time and
conservatively reserves its scan in the campaign. A refused preflight has no
campaign ledger in which to reserve it: this is explicitly outside-ledger intake
work, not free or observed zero. Campaign action scans are reserved permanently
before their reads.

## Actual verification at this checkpoint

- Prisma client generation: succeeded; no database write.
- Whole repository `tsc --noEmit`: exit 0.
- Focused ESLint across owned campaign/storage/dispatcher/tests: exit 0, no output.
- Fresh focused campaign, bounded storage and legacy storage unit suites:
  37/37 PASS, four files, 247 ms. These are engineering controls only.
- Actual campaign integration, migration/RLS and child-process crash suite:
  20/20 PASS, 9.39 s reported suite duration (7.39 s tests), using Main's independently
  reviewed installed bundle. Both owner migration and runtime URLs were guarded
  to localhost/127.0.0.1, port 5433, database hiveos_test before spawning; outer
  limit 120 s. No truncate. The earlier actual attempt failed 20/20 in 3.58 s
  before campaign approval/effects: QA factory supplied a PreparedProblem wrapper
  instead of its contract. The diagnosed correction was test-only; migration and
  owned identity fixture writes had already succeeded. This failure is preserved.
- Extra post-VERIFIED actual SIGKILL preparation: 1/1 PASS, 4.29 s reported duration
  (1.90 s test), 21 unrelated tests skipped. Its job remains RUNNING, stage
  VERIFIED and historical exact-scoped closure COMPLETED. Provider log has one
  actual invocation. Source-change resume is NOT_RUN until Main independently
  installs a changed reviewed source epoch.

The authored integration suite uses task-owned organizations and no truncate,
authenticated approvals, actual outbox dispatch/claims/worker/storage/checks,
three positive and three invalid-domain cases, concurrent claim, method pivot,
typed exact refutation, unknown usage, ignored-abort timeout, TOTAL stop,
revocation, RLS/append-only/tamper, stale lease and actual SIGKILL boundaries.
The AFTER_START controlled fixture logs its actual invocation before sending the
kill-boundary IPC; the generic START fence alone is not an actual-call counter.

Legacy operator baseline was captured independently before dispatcher changes.
Its automatic review yields zero routine continuation prompts, so the comparative
reduction percentage is UNDEFINED. No manufactured 1-to-0 reduction is claimed.
The owned baseline organization is preserved.

## Outstanding acceptance

Main installed initial and refreshed independently reviewed engineering source
bundles. The refreshed 22-control runtime suite and exact old post-VERIFIED
source-epoch resume passed, as recorded below. Main's independent acceptance and
combined C/D verification remain outside Builder's scoped completion. Retain
failures, exact process observations and source epochs here.
No hiveos_dev migration, .env edit, live model/API call, p139/attempt5 access,
legacy37 reseal, dependency/Git mutation or mathematical/public acceptance has
been performed or authorized by this checkpoint. Final acceptance also depends
on packages C/D and Main's fresh consequential review.

## Retained source-epoch crash fixture

The preparation uses immutable source bundle digest
`10b003bb55a832115e94cf721eedc8e9b08001b09b01cda718d1c86d0407a9af`,
generic runtime digest
`05cab52232d0e85d0a665442b124ec8d3ebcd1b95865a256a7474b7d37c915b7`,
and exact historical receipt digest
`06ed9c7be10701bf48cc4d3f5a1c29cc621663a4b3edbb795311b3c2c35dec80`.
Its six-event chain retains the original 45-byte witness.

```json
{"organizationId":"918e9712-76c6-4779-9fed-b82c4838eee4","actorUserId":"d099feed-2170-4e09-996a-87c8f974e6dc","workspaceId":"ce531b20-0e12-4811-b25e-7786e73ff02a","campaignId":"020dfeb1-66a4-4e19-bc8e-a0b536cf8645","jobIds":["fa0f9823-d421-4e80-b190-9c658551ee05"],"logPath":"/var/folders/81/y445_2554tb49zsn_qtb_9v80000gn/T/hiveos-076b-process-qiJ2lG/invocations.jsonl","sourceBundleDigest":"10b003bb55a832115e94cf721eedc8e9b08001b09b01cda718d1c86d0407a9af"}
```

The fixture selectors PREPARE/RESUME are QA-only process inputs, not model or
production execution grants. Tests never edit Main's source bundle. The separate
resume control requires the changed installed digest, expires this exact owned
lease and asserts no second invocation, no receipt adoption or reopened closure,
and a durable execution refusal/dead-lettered job.

QA source checkpoint (after correction and extra source-epoch test selectors):

```text
46339289b1f18da412195a6f46579d7929a96f3e710395c8297fd29e5d9fe237  tests/fixtures/research-campaign-v3.ts
08eb41e27e19f5425335dde9b381bb694c734a0e131214d22385b277551730d8  tests/fixtures/research-campaign-v3-worker.ts
44deac97e5ad651eaa0794af0c005e32d1f2b069a0299b0ed9f62df68e7078b2  tests/integration/research-campaign-v3.test.ts
b6fbc3c40f2e81c6d0aa5d62bb9b6221704a322a9199537baec2636df96a41c0  tests/unit/research-campaign-v3.test.ts
56d7c933789e0b58c5426ae9170d7e9e4a2fbcb23a2bd49f74d664bf0ba13489  tests/unit/storage-bounded-v3.test.ts
```

Initial runtime/source pins are the exact sourcePins in Main's installed bundle;
the source-bundle loader itself was
`1cc880a19b59f8670f993d0b1e4ac7496e56672835ad3a6612f7e63f629eb030`.
The post-preparation test-only `sequence` field typo was corrected to eventCount;
fresh whole repository typecheck then exited 0. Runtime sources were unchanged
through both actual successful runs.

## Coordinated post-QA refinement, pending next reviewed epoch

After C's actual isolated DB run completed, Main approved pinning the unchanged
reused command-runtime, authorization, database/environment/tenant and canonical
contract infrastructure as mandatory generic source inventory. There are 13
additional explicit files, with no edits to those shared modules. Runtime-only
fs/path tracing annotations follow the installed Next implementation patterns;
the separately reviewed standalone packager must still copy only exact pins.
Build/NFT verification of this change remains D's open control.

Four endJob returns now await within the worker's try/catch so an asynchronous
current-source refusal durably records executionFailure instead of bypassing the
campaign refusal journal. Every effect/adoption mutation now evaluates current
enterprise research.request authorization for the exact tenant/workspace/mission,
not merely membership or the initial grant. The private host failure-observation
path may only journal refusal after capability loss; tenant/membership/lease and
immutable bindings still apply, and it cannot authorize dispatch or adoption.
Two additional authored actual controls cover a mission DENY before dispatch and
capability loss during external return before candidate retention/adoption.
These 22 runtime controls plus source-epoch resume require Main's refreshed
reviewed bundle before running; their execution was NOT_RUN at this refinement
checkpoint and subsequently passed below.

Fresh whole typecheck and focused lint exit 0 after this refinement. Fresh
campaign/bounded-storage/legacy-local/S3 unit controls pass 37/37 in four files,
232 ms. Source pins:

```text
802cdf7323ab26bedc70bbbc970aada4f22e414b04866625758ede6e5bfea1c7  src/modules/research-sandbox/research-campaign/source-bundle.ts
2cddcb0dc0fef34bf318a009a08cbb1412dc7af4ea618d0429ef20fde067f526  src/modules/research-sandbox/research-campaign/worker.ts
124dea85d462d4ae563fddd84fa3f0c8bc7d8d82afcda883a4bc18f1ee6af178  tests/integration/research-campaign-v3.test.ts
```

## Final Builder actual controlled QA on refreshed sources

Main reviewed and installed 52 exact source pins, 463166 source bytes, anchored by
`docs/verification/TIP-076_REFRESH_MAIN_SOURCE_REVIEW.md`, SHA256
`24c1c21c903a857c20b18f109f96b8e020de6faa89a99d276d671ef0521d5fa6`.
The canonical installed bundle digest is
`b44bc7300db18f38731a65d332aa67d5678e354dd3cd2c6b8fe4653de263d407`.
C/D runtime sources were held throughout this serialized database turn. Exact
owner/runtime URL guards and separate 120-second outer limits remained enforced.

- Exact retained old post-VERIFIED source-epoch resume: 1/1 PASS, 23 unrelated
  tests skipped, 2.19 s reported suite duration / 306 ms test. Provider invocation log remains
  length one, historical scoped closure and COMPLETED science state unchanged.
  Current source mismatch produces durable executionFailure INTEGRITY, refusal
  observation and DEAD_LETTER job rather than adopting an old completed result.
- Fresh complete runtime suite on refreshed sources: 22/22 PASS, two separate
  source-epoch selectors skipped, 11.64 s reported suite duration / 9.20 s tests. Includes
  actual authenticated command/outbox/job/storage/exact-check paths for all three
  adapters, wrong candidates versus exact predicate refutation, permanent costs,
  concurrent claims, actual three SIGKILL boundaries, stale lease, revocation,
  ignored-abort timeout, unknown usage, TOTAL refusal, RLS/append-only/tamper and
  current scoped enterprise denial before dispatch and before returned adoption.

No truncate or broad cleanup occurred; task-owned data and baseline organization
remain retained. C's prior controlled DB run was serialized separately, not
counted as B verification. The B database slot was released to Main for fresh
independent checks. Reported B integration suite durations sum to 31.09 seconds;
the five runs were each externally capped at 120 seconds. Wrapper startup overhead
was not separately measured. These bounded short runs are below the approved
cumulative 600-second test ceiling;
no timeout occurred. The earlier diagnosed test fixture failure remains recorded.
Runtime sources were unchanged throughout these refreshed passing checks; the
subsequent separately approved refinement is recorded below.

## Subsequent approved standalone import-boundary refinement

D's two rejected packaging attempts remain preserved: although the bounded source
loader's broad trace was fixed, importing the legacy shared worker still pulled
its scientific runner graph into the controlled UI's generated NFT inventory.
The generated-inventory rejection gate was not bypassed; no historical originals
were read for this diagnosis. Main appended narrow routing to TIP-076B.

The NEW `src/server/workers/research-campaign-cycle.ts` is an import facade, not
a second scheduler. It calls the same existing dispatchOutboxBatch, claimJobs,
leases and executeResearchCampaignJob with exact job/outbox selectors. It imports
no legacy scientific runner or live adapter. The shared worker's campaign-only
branch delegates this facade and still refuses mixed live configuration. The
normal legacy branch retains its original adapter types, first-claim behavior,
1800-second lease and sanitized errors. D owns the direct facade import change.
The loader now requires the new facade, for 53 required installed source files.

Fresh whole repository typecheck and focused ESLint exit 0. Fresh unit suite:
43/43 PASS, five files, 233 ms, including six explicitly mocked facade port
controls; these are not substituted for real DB evidence. The first unit attempt
failed 3/43 because its mock named `research.campaign.v3.execute` rather than the
actual existing `research.campaign.v3.round`; corrected test-only, then reran.

```text
cf2a7a4c1e84be4332eed5c4f611373525613d61e2feb63bc2e81b8bb6b424e1  src/server/workers/research-campaign-cycle.ts
cc4762d24a79e3930dfd23142f26f7bc3adcc628dc952543503476fda226de49  src/server/workers/research-sandbox-cycle.ts
8c46c8c4fec0ee8ebfb335911ee8bfa93a53f8176c142bb57be5399625b8f6d1  src/modules/research-sandbox/research-campaign/source-bundle.ts
d0a49135008d3d6546c5685d0ab27730bdfd2bd310f7943ccb129863ab340055  tests/unit/research-campaign-cycle.test.ts
```

Current status after this approved refinement: SOURCE_HOLD pending Main's new
independent review/repin, actual runtime revalidation and D's fresh NFT/build/browser
checks. The previous 22 runtime + source-epoch passing observations apply to their
recorded source epoch, not to untested replacement sources. No DB run was started
after this import-boundary edit without a repin.

## Subsequent actual standalone guard defect and narrow correction

D's actual standalone browser run failed 2/2 tests in 15623.316 ms. The retained
generated test metadata and error-context show the inactive engineering region
before either controlled campaign button could run. D/Main's compiled SSR
inspection found that Next's production build constant-folded the direct
process.env.NODE_ENV guard into unconditional refusal. This predecessor failure
is preserved; the mocked/unit runtime checks did not establish compiled browser
behavior.

Main routed a narrow B correction: the campaign guard now reads NODE_ENV and
DATABASE_URL from the existing validated getEnv() runtime snapshot used by the
database and authorization services. It still admits ONLY NODE_ENV=test and
localhost/127.0.0.1:5433/hiveos_test. Environment/URL parsing failures are converted
to a static sanitized CampaignRefusal AUTHORITY message. No ordinary development
or production enabling flag, dynamic getter trick, shared environment source
change or additional source inventory was introduced.

New controls explicitly admit validated localhost and 127.0.0.1 test snapshots,
reject valid production/development snapshots even with the QA database, reject
wrong database/port/host, sanitize invalid environment values, prevent bypass of
a cached refused target by raw environment mutation, and ensure resetEnvCache
revalidates a changed non-QA target rather than retaining old test permission.
Test-only stubbed environment changes are restored with the cache after each
scenario; no .env file was changed.

Fresh campaign/facade/storage/shared-environment unit suites: 65/65 PASS across
six files, 306 ms. Whole repository typecheck and scoped ESLint exit 0. These are
source/unit observations, not fresh compiled UI or database acceptance.

```text
7378a557b7910e7fd996215be6236a548ac75e79fd3f0afc76f04a91d916a141  src/modules/research-sandbox/research-campaign/source-bundle.ts
785646583430714ef6f11656da793ed3c75bce8da9af2c0ccc44fb093e3ac48a  tests/unit/research-campaign-v3.test.ts
```

SOURCE_HOLD: Main must review and repin before fresh actual integration, compiled
standalone rebuild and browser checks. No database process was started by B after
this guard correction; all earlier actual passes remain tied to their recorded
predecessor source epochs.
