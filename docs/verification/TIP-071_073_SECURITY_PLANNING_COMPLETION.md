# TIP-071–073 — security design planning completion

Date2026-10-04. STATUS: READY_FOR_HUMAN_G1_REVIEW.
Implementation NOT_STARTED. G2 NOT_AUTHORIZED. No new M1 or campaign.

## Outcome
Prepared a concrete reviewed security architecture and draft task packs for durable
independent mathematical replay -> authenticated agent-loop consumption -> ONE fresh M1.
This is planning completion, not execution/certificate/mathematical acceptance.
The current request starts detailed design; private storage/new authority rules were not
silently treated as approved. Vibecode Kit requires the specific security/architecture
approval before Builder coding. Main used focused Builder scan and independent design review.

## Artifacts
- docs/proposals/BLUEPRINT_TIP-071_073_DURABLE_REPLAY_AND_M1.md
  SHA5ca4ae11a5f5a353664e94e73464caf3128f49a79cffc6a37cef40591ca999e5
- docs/proposals/TIP-071_073_DURABLE_REPLAY_DRAFT_PACKS.md
  SHAd1021384febf1f5ee5989ea932510d1b6e4d7da1226f8297ff18c0b66997be9e
Both are unsealed proposals OUTSIDE current110-entry contractor manifest.
Old M1 candidate remains DRAFT_NOT_EXECUTABLE_NOT_AUTHORIZED.

## Evidence and engineering gaps
Actual source inspection confirmed:
1. Existing private transport replay only parses transport, NO_RESEARCH_RETENTION.
2. Finite consumer independently derives masks/cells but shares source/helpers with producer.
3. Capture store V1 cannot add receipt files, and staged pre-critic finite read is missing.
4. Current diagnostic auth does not itself check worker.lockedBy or post-IO revocation.
5. Production method execution mint and generic requestResearchRun deliberately refuse.
6. Request kernel generates actual IDs internally; observer expects a pre-create target.
7. Research loop V1 requires checkerCalls=1, incompatible with a real second checker.
8. Old37 hashes do not cover new runtime closure; WeakMap authority is not durable evidence.
9. Pre-critic receipt cannot bind a future final ledger without a circular/fictional hash.
10. Capture close/finalfsync or DB/file cross-system failure must not become admission.

Chosen design:
- New separately pinned replay checker with own arithmetic, schema-only sharing.
- V2 capture coordinator, ONE fixedroot/quota.lock, V1 read-only for fresh M1.
- Original100slots/128MiB and per-slot1,146,880B unchanged; aggregate16KiB control
  includes reservation/binding/final/replay/admission/consumption records.
- Pre-critic finite read-back/replay/fsync receipt; separate post-ledger admission.
- Actual original actor/tenant/capabilities + exact owned job/version/lease/payload fences
  before and after every async boundary; separate bootstrap/capture/admission purposes.
- Approved descriptor+nonce unique spent intent under one lock/all3slot reservation;
  server-created IDs then immutable actual binding; ambiguity spends intent/no retry.
- Two actual checkers in V2 accounting, SAME aggregate5s/2Mops/256bit ceiling.
- Receipt expiry <=earliest source/descriptor/permit validity; restart never extends it.
- Source closure pinned/fresh reviewed process; no HMR runtime attestation claim.
- Contract4/ledger7 and all historical evidence immutable; sidecar admission separate.
- M1 known-source conditional reproduction only; finite PASS is KNOWN_FINITE_PASS,
  not novelty, semantic relation, lower-LRC/analytic discharge or global14/15 proof.
- One M1 then STOP; no automatic next experiment or campaign.

## Requirement coverage and verification
20/20 named security/engineering criteria DESIGNED (100% design coverage).
0/20 newly implemented,0/20 executed acceptance tests (0% implementation coverage).
Actual product tests/types/lint/build/browser/DB/model/checker are NOT_RUN this turn.
Prior TIP070882PASS is historical evidence, NOT current implementation certification.

Main planning checks:
P1 PASS: source seams and deliberate authority/request refusals verified by readonly inspection.
P2 PASS: namedS1–S20 mapped to071store/replay,072ingress/loop,073actualE2E.
P3 PASS: independence/accounting/circularity/auth/ownership/privacy distinctions explicit.
P4 PASS: model/domain/caps/one-run/no-retry exclusions retained.
P5 PASS: independent review identified four consequential clauses, all repaired in proposal:
  unique descriptor+nonce intent/all-slot lock; earliest expiry; pre/post fences; exact lockedBy.
P6: independent final-file review and baseline preservation recorded in final handoff.
These planning controls are not scientific AC passes.

## Independent review repairs
Reviewer found four missing precision requirements in first proposal:
- Random per-POST intent identity could allow double allocation.
- Re-auth/replay receipt lifetime could accidentally outlive source/permit.
- Post-only fence could initiate privileged work after revocation.
- Current capture auth RUNNING check is not owned worker fencing.
Main added explicit clauses and requested a fresh read-only final-file check.
The separate checker also avoids falsely branding identical shared-helper consumption
as a second mathematical implementation. No external/formal independence is claimed.

## Preservation and scope
Pre-edit baseline1398files in src/tests/scripts/docs retained for Main hash comparison.
Original handoff335042B SHA
bedb24911780b2a8fc8af948a56c60d778a17b7332552834b07d1254c0851f69.
Only three new planning artifacts + append-only handoff are intended.
Contractor manifest unchanged625a9902c9814f1e3a63263853d261c8d0f0117c383cdf62196d38c719eb7992.
HEAD4d108227498d3578c9ac3fe60305c10da5aa905b,
branchcodex/tip-023a-organization-graph, all unrelated dirty work preserved.

No product edits, executable scripts, private-root access, dependency install, migration,
DB actions/provisioning, provider/login/model/API, paid call, finite checker/forest,
browser/server state changes, Git writes/push, billing or deploy in this planning turn.

## Human decision
Approve G1 for detailed071–072 architecture/privacy and OFFLINE implementation+QA.
Then seal packs and delegate Builder implementation+independent adversarial review.
Actual fixed-root filesystem permission and bound fresh-process/current-session descriptor
plus human G2 are separate before ONE M1; do not infer them from the approval phrase.

