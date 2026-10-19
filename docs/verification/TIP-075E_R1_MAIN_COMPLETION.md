# TIP-075E-R1 — Main deadline repair acceptance

2026-10-05. Contractor /root. Human approval: “duyệt sửa và kiểm”.
Status: BUILD_ACCEPTED_ONLY / EXECUTION_NOT_GRANTED.
Focused repair CLOSED; G/C/T/B remain OPEN0/4, same root
LRC_P139_REPRODUCTION_075 REPRODUCTION. Historical whole attempts1–4 and failed
admitted slot5 are preserved. No new whole attempt, real replay, runtime grant,
mathematical closure, paper refutation or breakthrough occurred in this repair.

## Scope, design and ownership

Read AGENTS/research protocol/latest active and handoff, approved narrow repair
TIP and forensic checkpoint, Vibecode Kit v6.2 and report/QA references; bundled
Next index read, no Next/TS/UI implementation needed. Workflow reduced because
the exact diagnosed defect, immutable-history boundaries and proposed fix were
already approved; no new RRI/architecture/algorithm/research campaign round.

Builder owns NEW hostv6/tests/Builderreport only. Independent reviewer owns only
NEW reviewreport, no peer edits. Main owns TIP, thisreport and append-only active/
handoff checkpoints, authored NO product/test code. No old source/test/report/
resource/manifest/realgrant/evidence edits. QA did not access real grant/evidence
evenstat; positive tests use temporary paths and fixed stubs before139 effects.

Main reviewed the COMPLETE exact v5-to-v6 source delta, complete new test delta
including the adapted existing timeout fixture and added pre-START guard, full
Builderreport and final appendix, peer review/serialized QA evidence. Prior full
read of pinned v5 in075E is retained; exact-byte replacement test and read-back
hashes establish all other v6 bytes unchanged. No claim of a fresh Main reread of
all1206 unchanged source lines is made from that focused delta review. The peer
independently reviewed the source/test delta and fixed worker control paths.

## Exact correction and immutable numerical limits

Hostv6 differs from frozen hostv5 in exactly TWO replacements:

```python
REVIEW_FILE=REPOSITORY/'docs/verification/TIP-075E_R1_MAIN_COMPLETION.md'
self.deadline=self.started+lim['auditScanSeconds' if kind=='HOST_AUDIT' else 'processSeconds']
```

Audit stays120s/full or10s/tiny; worker VERIFY/GENERATE uses the already approved
process660s/full or20s/tiny. The worker's Io context is constructed once; neither
replay nor repeated reads reset started/deadline. Parent phase reservation,
10s creation debit/110s bootstrap/AUDIT132/child672/660process, actual isolated
process timeout, source before/after checks and independent600s math deadline
remain byte-for-byte unchanged. No time guard disabled or budget field raised.
All generation/replay/TABLE/UNION/event/cursor/EOF/math semantics and TOTAL caps
are unchanged; producer/checker v5 and their tests are unchanged.

The new host source pin and new review file deliberately cannot be authorized by
the old075E review/grant. This Main report is BUILD acceptance ONLY, NOT execution
permission. The old failed attempt5 ERROR receipt cannot be deleted/replaced to
resume. No source37 reseal, source/auth/lease/replay/G2/liveagent bypass is added.

## What the new tests establish

11 distinct new controls supplement86 carried Host controls, with one deliberately
adapted carried timeout fixture. They check audit120/tiny10 expiry, worker660/
tiny20 expiry for both kinds, repeated charges without deadline refresh, both
actual worker-function roles crossing virtual121s, late post-source refusal at
660s, unchanged source drift refusal, frozenv5 failure under SAME long-worker
positive assertions, exact two-replacement delta, old source/review refusal and
pre-START expiry with no child/reservation.

The positive full-bound worker fixtures have synthetic private authority/startup
context and intercept compilation of the checked role bytes to install a fixed
non-mathematical stub. Actual worker framing/source/private gate/output paths run,
but no actual139 constructor/Budget/masks/event replay runs. Empty synthetic
prefix/events/cursors/streams are NOT scientific certificates, positive whole
grant evidence or actual409-root closure. Virtual121/660 is not a real long run.
The math600s field is checked unchanged; this does not prove whole-fit feasibility.

VERIFY at expired660s emits no result bytes; GENERATE can emit provisional
CONTROL/events/TABLE/DATA before post-source check but emits no END/complete
stream on failure. Parent refusal of stderr/nonzero/incomplete output remains
covered. Main accepted this A3 wording clarification WITHOUT moving stream
ordering or weakening mathematical/source gates.

## Fresh Main QA and serial independent verification

All Main children use /opt/homebrew/bin/python3 (Python3.14), sys.executable,
-I-S-B, stdinDEVNULL, external120s timeout, cwd /Users/os/hiveos and environment
containing exactly six flags false: RESEARCH_WORKER_ENABLED,
MATH_PILOT_QUEUE_ENABLED, LRC_CAMPAIGN_LOCAL_ENABLED, RESEARCH_OPENAI_ENABLED,
RESEARCH_CODEX_LOCAL_ENABLED, SANDBOX_DOCKER_ENABLED.

```python
subprocess.run(
    [sys.executable, '-I', '-S', '-B', str(root / test)],
    cwd=root, env=dict.fromkeys(flags, 'false'),
    stdin=subprocess.DEVNULL, capture_output=True, timeout=120,
)
```

| Fresh Main suite | PASS / named tests | Unittest seconds | Wrapper seconds | Exit |
| --- | ---: | ---: | ---: | ---: |
| Producer v5 |43/43|0.276|0.380931|0|
| Independent checker v5 |86/86|0.662|0.764072|0|
| Host v6 |97/97|9.969|10.086196|0|

226/226 distinct controls PASS, final0FAIL/0ERROR. Combined Main wrapper11.231199s
within600s aggregate. This is the original215 logical controls plus11 new, NOT
215+oldHost86+newHost97, and not inflated by reruns/grouped roles/subcases.

Shared-source Host suites serialized: final Builder97PASS10.025s -> independent
reviewer97PASS10.239s/wrapper10.405 -> Main97PASS9.969s/wrapper10.086196. Explicit
turn/lock-release messages preceded each run. Main's two pure mathematical core
suites ran independently of the Host suite; no concurrent Host execution or
weakened source locks. All tested source/test pins read back MATCH after QA.

Initial Builder failures are retained, not relabeled as passes:

1.96 named /95PASS+1ERROR /9.898s. The old .001s tiny process fixture now expired
   during correctly bounded VERIFY pre-START bootstrap, before receipt2. Main
   L2 approved .2s (lower-only<=20) plus fixed inert child sleep2, preserving actual
   START/reservation/ERROR/noacceptedverdict/<3s. Production caps unchanged.
2.97 named /96PASS+1ERROR /10.191s. The newly added pre-START fixture omitted its
   own temporary subdirectory creation. Peer identified it; test-only mkdir0700
   corrected setup. Final test proves no reserve2/START2/receipt2/Popen after
   bootstrap expiry and retains successful AUDIT1.

All initial failures and accepted fixture changes appear in Builder and peer
reports. The regression against frozenv5 expects hostdeadline and passes by
exposing the original bug; it is not a new failed whole scientific attempt.
No actual120/600s sleep/math was used; the fixed inert sleeper is killed under
the lower .2s tiny process test. Build/type/lint/Next/browserE2E SKIP, notPASS:
only additive Python/docs and focused isolated runtime QA in scope.

## Finite requirement and scenario acceptance

R1–R5 implemented5/5; A1–A7 accepted7/7 within finite engineering scope.
No formal proof, branch-complete security audit or whole mathematical acceptance.

| Requirement | Evidence |
| --- | --- |
| R1 | Exact two-byte-replacement source assertion/diff and type-specific absolute deadline/no-refresh controls, all numeric fields unchanged. |
| R2 | Actual worker functions in BOTH roles with synthetic authority/stub math cross121; exact660 post-source refusal preserves incomplete-stream rejection. |
| R3 | Audit120/tiny10, pre-START expiry, source drift, unchanged independent600/process660/parent phase code, carried actual childkill/cleanup. |
| R4 |86 carried Host controls (one disclosed fixture adaptation) plus11 repairs; source/startup/oneclaim/TOTAL/EOF/durable/error behavior remains. |
| R5 | New review/oldpin denial, temporary-only authority tests, selected frozen pins unchanged, independent owner/peer/Main reports; no actual139/retry/realnamespace effects. |

A1 audit exact expiry; A2 worker exact thresholds; A3 BOTH worker paths/stub and
late output restrictions; A4 no-refresh/source guards/unchanged caps; A5 carried
86 and fixture disclosure; A6 synthetic staleauthority/ERROR-claim STOP; A7
independent read/serialized fresh QA/frozen pins and this Main acceptance.
No known unresolved P0/P1 in the narrow deadline fix. Positive full inspection,
failed-run replay/recovery authority and whole feasibility are NOT implemented.
Old inventory UID/mode isolated-branch coverage limitation075E-COV-01 remains,
unchanged by this repair; no fresh comprehensive inventory/coverage percentage.

## Frozen repair pins and selected preservation

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| scripts/operations/capture-lrc-p139-generation-v6.py |71738|1a24ba000bbd8757fe85664906aeac65809b00635d1be1a56eab92e490a8a83f|
| tests/research/test_lrc_p139_release_host_v6.py |65221|7620d69ae4ae5771251a861ce38693744e959fe19d36b8ea20d50e854c7882f7|
| docs/contractor/tips/TIP-075E_R1_WORKER_DEADLINE_REPAIR.md |6458|9b137994f565063db3878dbaded0f1a7eefa1545357d18eb138061b3f2ea5fdf|
| docs/verification/TIP-075E_R1_HOST_COMPLETION.md |14379|77a7f2ef1ae7bbd204747c79e440f1621d2b9579f45c52d57f04c72ae670df11|
| docs/verification/TIP-075E_R1_INDEPENDENT_REVIEW.md |11353|091d936cabe1fdff5faec6c0c242a0f488af7430836642b1faed4eac01d0c99c|

Independent review: docs/verification/TIP-075E_R1_INDEPENDENT_REVIEW.md;
its final frozen digest and this Main report's own digest are recorded externally
in the append-only handoff/active checkpoint (no self-referential authority hash).

All14 selected old source/core/test/075E-report/resource/wire/runtime/forensic
pins rechecked MATCH before and after QA. Especially old hostd2fe9d...,
producerd8d3ec...,checker65a554...,oldHosttest6dc4ed...,oldMain88e476...,
runtime6cf387...,forensic405f6d... remain unchanged. No claim of a new full
repository hash inventory or reinspection of real grant/evidence is made.
Existing dirty work retained, HEAD4d108227498d3578c9ac3fe60305c10da5aa905b/branch
codex/tip-023a-organization-graph unchanged; gitdiffcheck0. Original contractor
manifest entries are untouched; this repair TIP pin is explicitly recorded in
active/handoff, no broader inventory cleanup/reseal undertaken.

## Stop and remaining runtime gates

Engineering repair CLOSED / BUILD_ACCEPTED_ONLY. EXECUTION_NOT_GRANTED.
No accepted actual G result returned, G/C/T/B0/4. Local v6 QA is not live
source/auth/lease/replay/G2 activation; SOURCE_REFUSED remains separate.

The fixed attempt5 ledger contains a failed verification and cannot be silently
resumed by v6, by copying a grant, changing its pins/review or deleting ERROR4.
This approval did not authorize attempt6, freshgeneration or replay/recovery.
Proposed next routing ONLY: consider a separately reviewed, bounded verifier-only
authority design that can reuse the retained UNACCEPTED candidate without
rewriting old history or generating again; obtain direct human approval before
implementing/executing it. No automatic new TIPfamily/campaign after this fix.

No real grant/evidence access evenstat, new grant,139 core, API/provider spend,
browser/DB/env/schema/privateDiagnostics/authorcode/source37/Gitwrite/commit/push/
billing/deploy operation was made. Cooperative clocks/workspace remain not hard
OS RSS/fsync/process-tree attestation. Whole research success is still unknown.
