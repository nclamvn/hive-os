# P3 R3 acceptance redesign — Main completion

2026-10-08 · SAME081D8 · P3_SYNTHETIC_PRIVATE_SUMMARY_REPLAY.
STATUS: DESIGN_READY_FOR_OWNER_REVIEW / PENDING_OWNER_R3_APPROVAL.
Owner requested “thiết kế lại hợp lý và hiệu quả”; DESIGN ONLY completed.

## Decision and scope

Proposed plan: docs/contractor/tips/TIP-081A_P3_ACCEPTANCE_REDESIGN_R3.md.
R3 explicitly revises P319/P321/P322 experiments; it does not silently satisfy
R2. All production ceilings and ownership/accounting/safety invariants remain.
R2 normal producer16384/+1 remains OPEN and normal129 remains source-preempted;
their unclosed history is preserved. No new reachability claim or mathematical
result is made.

Require THREE complementary evidence lanes: normal source-to-independent-replay
integration, exact production component boundaries, and reviewed call-site /
pre-growth composition. Normal integration remains mandatory. Isolated writer
and depth/entry tests cannot mint normal VERIFIED evidence. Source/test/hash
evidence does not establish full runtime or mathematical closure.

Minimal narrow seams, separate independently authored producer/verifier guards,
closed zero-argument UNIT_ONLY kernel and exact-domain admission denials. Two
disjoint records separate actual charged context K from MODEL_ONLY serialization
fixture S; retain real charge/clock/abort semantics and cleanup BOTH roots. Actual
wire digest and actual embedded seal are compared with independently reconstructed
canonical expectation, not length alone or an expected-value echo.

## Independent review / repairs

Back reviewed security/accounting/codec observability; Front reviewed depth /
composition/independence; Tool Builder reviewed runner/registry/preservation /
settlement. Main authored plan and repaired first-pass blockers, then all three
completed ONE repaired-text reread: DESIGN_CLEAR / READY_FOR_OWNER_REVIEW, no
remaining blocking DESIGN issue. No reviewer implemented or ran effects.

Vibecode Kit's independent non-own review materially changed the design:

- Replaced ambiguous unit ledger with explicit actual K versus MODEL_ONLY S.
- Added closed bounded actual-wire digest/seal observations and both-root cleanup.
- Required complete36-ID / all-variant assertion mapping and separate8-obligation,
  36-requirement and frozen mandatory-subcase denominators; no reduced suite.
- Replaced Vitest/Vite/worker graph with plain serial Node assertion harness;
  preserved all retained assertion and cleanup semantics.
- Removed syntax child, froze two-effect process/time partition, extra-process
  STOP, incremental failure evidence and pin issuance inside captured effects.
- Required fixed full predecessor/new-source whitelist and TS post-preservation.

These are design checks, not proof that the code/tool graph/fixtures fit. Exact
transitive dependencies, charges, fixture expectations, registry/port mapping and
preservation manifest must be frozen before code; complete hand/emitted review
and concrete Main reservations must precede effects/admission. Any missing row,
unknown extra descendant or failure stops; no automatic retry or extra budget.

## Resource and current state

Proposed, NOT reserved: A5500ms (2500 raw +3000 process allowances), B15000ms
(10000 raw +5000 allowances), total20500, margin940.727166 within existing P3
21440.727166 remainder. B partitions500+350+750+1200+6500+500+200=10000.
An additional1000 allowance cannot fit; STOP. Timing/native/RSS/physical scheduler
fit remains unproved. Do not assert a successful check batch is guaranteed.

ZERO measured effects this turn. Aggregate870882.767416/900000ms;
29117.232584 aggregate remainder; P3 remainder21440.727166 unchanged. No fresh
preservation/hash assertion, no parser/Acorn import, no syntax/lint/type/unit /
build/E2E or admission. Compile OFF; all normal/alias/kernel tuples NOT_ISSUED.
P3 accepted0/8/all36 controls UNRUN; source7/8 complete drafts/R5partial remains.
P2 accepted109 controls remains predecessor history. Existing dirty worktree
changes preserved; only R3 design/report and append-only checkpoints changed.

## Next permitted decision

Ask Owner to approve EXACT R3 acceptance revisions and isolated-kernel boundary
for SOURCE-ONLY implementation first. Current design request does not activate
them. No implementation, new measured effect or tuple release follows until its
respective gates. No P4/P5/math/campaign/API/browser/server/DB/Git mutation /
billing/deployment authority. Protected attempt5/grant/failed-root/.env/native /
NFT/actual-source access remains excluded.62OPEN/callergraphOPEN /
fullRuntimeClosureNOT_ACCEPTED unchanged.
