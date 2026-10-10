# Proposed TIP-065 — observable rejected-response boundary

Status: UNSEALED / APPROVAL_REQUIRED. This proposal does not activate a model,
change product code or authorize another case. It responds to the actual
TIP-064 first-role failure, not an inferred mathematical failure.

## Evidence and objective

Case b396580a-7bc7-4a8d-a966-0ad3eaa3e246, run293b2fa4-368a-4c5f-baf0-84b058f607ab:
one solver attempt, INVALID_INPUT/dead-letter, no admitted result or reviewers.
Sanitized receipts cannot distinguish transport, reported-tool/protocol, JSON,
schema or mathematical-output admission failure. No raw rejected response or
returned usage/context was preserved, so the precise old cause is unknown.

Make rejection diagnostic and independently replayable WITHOUT converting
quarantined bytes into accepted research evidence, weakening guards, rerunning
the failed case or searching unrelated Codex subscription history.

## Proposed staged scope

1. Read-only design and additive implementation: bounded create-only0600 local
   quarantine for exact prepared input/schema and returned stdout before its
   admission parser, with host source/case/run/role/dispatch identity; distinct
   attempted/transport-returned/admitted states. Preserve original caps,
   no-tools policy and legacy behavior. No stdout/credentials/environment
   dumps into ordinary logs or UI. Quarantine is sensitive untrusted material;
   fix its storage/access/retention policy before implementation, not an
   arbitrary-path file reader on GET.
2. Typed non-secret reason codes by boundary. Parser refusal must remain a
   refusal. Preserve actual returned context/accounting only when independently
   parseable; missing or malformed remains UNAVAILABLE. Existing renderer-v1
   and old contracts/attempts/ledgers/case/receipts stay unchanged. If durable
   schema semantics change, version additively; do not reinterpret history.
3. Offline replay tool using the same version-pinned admission validator on
   retained quarantined bytes, with strict path/digest/size/local/tenant guards,
   no subprocess/model/checker/forest and no DB acceptance writes. Test every
   reason, unsafe/oversize input, partial writes, source drift, token/context
   mismatch, tool activity and failure before/after transport return. Synthetic
   tests are not recovery of the missing TIP-064 response.
4. Passive UI shows accurate failed operational state, available diagnostic
   category and missing evidence without old writable controls or retry. No
   raw rejected-response execution/rendered HTML, auto polling or parser-driven
   promotion. Independent cross-review and Main unit/types/lint/build/pin QA.

## Separate human gate before live activity

Engineering approval of steps1–4 authorizes NO model call. After offline QA,
present fixed storage/privacy design and actual readiness; ask separately for
one NEW experiment if needed. Never reset the failed TIP-064 dispatch fence,
reuse its case or manufacture the unavailable response. A future experiment
must keep the original limits, exact IDs, subscription model and no-retry policy
unless the human explicitly changes scope. No new prime, forest replay, API
spend, Git, installation, migration, deployment or billing is implied.

## Success criterion

Given a returned but refused response, a bounded independently reproducible
diagnostic explains the exact admission boundary from real retained bytes,
while proof/review status remains unaccepted. Only a later independently
authorized successful SOLVER/CRITIC/ADVERSARY run can supply full live-method
evidence; neither this diagnostic upgrade nor AI agreement proves LRC or novelty.
