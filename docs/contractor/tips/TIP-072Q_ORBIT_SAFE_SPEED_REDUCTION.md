# TIP-072Q — orbit-safe fast-exception reduction

Date: 2026-10-05. Priority P1. Depends on 072O/P.
Authorization: user requested continuing toward a breakthrough; bounded offline
mathematics and exact replay only. No application architecture or authority change.
Vibecode Kit: focused independent scans -> sealed TIP -> Builder -> independent
mathematical/product review -> Main acceptance. Main does not write product code.
RRI/Blueprint checkpoint omitted because this is additive research-only work,
not a new runtime, schema, UI, admission policy or campaign.

## Mathematical scope and requirements

Q1: prove the exact identity for a unit v modulo d:
min_j ||v(t+j/d)|| = ||dvt||/d. Strict BAD means distance < eta;
equality is GOOD. For 0<2eta<1/d, the union across all d shifts has
open base-time components (h/(dv)-eta/v,h/(dv)+eta/v).
Nearest orbit-safe distance is max(0,d*eta-||dvtStar||)/(d*v).
If already safe, do not adjust; otherwise nearest component boundary, ties LOWER.

Q2: preserved speeds divisible by d, margin L>eta at tStar, actual lower max U,
R=(L-eta)/U. With exactly d unit exceptions, a selected exception with
nearest-safe distance <=R can be made GOOD on ALL d shifts while preserving
every lower coordinate. Remaining d-1 exceptions each forbid at most one shift.
Worst-phase v*R>=eta suffices. Finite samples are not the universal proof.

Q3: two distinct count corollaries, not interchangeable:
- 14 moving/15 total: nine 5-divisible lower speeds, reduced witness tau at
  margin >=1/10, tStar=tau/5, R=1/(30U), eta=1/15. V>=2U suffices.
- 13 moving/14 total: eight 5-divisible lower speeds, reduced witness tau at
  margin >=1/9, tStar=tau/5, R=5/(126U), eta=1/14. V>=9U/5 suffices.
V=max actual unit exceptions. These require the given lower witness; lower
LRC9/LRC8 can supply existence but are not independently reproved here.
Every tuple outside the corresponding bounded-ratio core is covered in this
divisibility stratum. Uncovered core remains infinite as U grows, not a finite
absolute check or global LRC proof. Do not use naive compactness at zero speeds.
Explain why no exact/signed pair or residue diversity is required.

Q4: compare primary sources: Allikvere v2 Lemma4.6 covers d5 with at most4
exceptions; here exactly5 needs an extra phase/time premise. Kravitz Proposition
6.1 supplies established fast-runner interval reasoning; our all-shift adaptation
is program-method progress, NOT established literature novelty. Actual retained
p83 n13 archive does not automatically match this d5/e5 stratum. No pruning
entire independent congruence branch from a single representative or ratio cone.
Insufficient gate means UNKNOWN, not LRC failure. No generic strict slack.

## Small executable contract

Builder owns NEW ONLY:
- scripts/research/lrc-orbit-safe-speed-replay.py
- tests/research/test_lrc_orbit_safe_speed.py
- docs/verification/TIP-072Q_BUILDER_COMPLETION.md

Self-contained standard-library Fraction arithmetic; no old mathematical helper
imports. Derive from actual bounded plain inputs (label,speeds,tau), not externally
supplied verdicts/certificates. Fixed d5/e5, counts13/14 only; positive distinct
actual integer speeds <=10^12, exactly8/9 lower divisibles and5 unit exceptions.
Canonical rational strings, <=256-bit components, no subclass/hooks admission.
Select V deterministically (largest exception); ties cannot occur on distinct
inputs. Keep original grid even on UNKNOWN; a found witness stays separately
observed, not proof of a failed sufficient gate. When gate passes, independently
check radius, all five selected-exception distances, remaining BAD counts, every
lower coordinate and lowest physical GOOD shift. No normalized/carry ambiguity.

CLI eight fixed cases ONLY, no paths/options/stdin/custom speeds:
14 moving: lower5..45, tau1/10; exceptions
1. [1,2,3,7,91] high mixed residues;
2. [1001,1011,1021,1031,1041] all-same-residue large common offset;
3. [1,2,3,7,89] below dominance but successful phase gate;
4. [1,2,3,7,104] initially all-shift safe, no adjustment;
5. [1,2,3,7,99] negative adjustment;
6. [1,2,3,7,11] UNKNOWN with original observed witness.
13 moving: lower5..40, tau1/9; exceptions
7. [73,78,83,88,93] high same-residue cluster at target1/14;
8. [1,2,3,7,11] UNKNOWN, preserve actual original observations.

Case2 must demonstrate that the original five shifts have no full witness,
whereas orbit-safe adjustment yields one. This is ONLY that exhibited base grid,
not an archived modular NO_GRID branch or a mathematical counterexample.

Retain complete actual speeds/labels, lower reduced distances and witness,
count/target/L/U/R/V/tStar, scalar orbit phase/beta/nearest boundary/adjustment,
speed-only and phase-sensitive gates, original and successful adjusted5xn
distance matrices, all exception BAD sets, GOOD complement, all final distances
and minimum. Canonical whole-body digest includes all mathematical context/scope;
timing outside deterministic digest. No omitted fields to fit output caps.
Scope: local unsigned, agentLoop NOT_RUN, executionAuthority false, whole branch,
global/formal/external/novelty NOT_ESTABLISHED.

Unchanged hard ceilings: 5s, 2M charged operations, 32768B complete JSON output,
256-bit rationals, shared whole-run budget not reset. Product has no file-write,
network, child-process, DB/provider/private-root access. Only six named execution
env flags read by CLI, all require exact false; no other execution authority.
Failure must emit no positive JSON. Main source pin consistency is not signed
host/interpreter/runtime attestation or external certificate admission.

## Acceptance / QA

Q5: independent whole-matrix arithmetic, source-pinned real isolated CLI tests,
both counts, sign/no-adjustment/nearest-center lower tie and closed endpoints.
Geometry endpoint tests may test the lemma separately without fabricating a
full lower-witness fixture. Refuse false lower/count/unit/divisibility/types/
duplicates/component/resource/flag premises. Verify below-dominance success and
UNKNOWN-not-counterexample split. Eight fixed cases keep all coordinates.
No AST-only or digest-only acceptance. Tests -I -S -B, timeout5s, all6flagsOFF.

Q6: independent written proof/product review; Main actual fresh CLI and Python
tests plus contractor-manifest regression and prefix/fingerprint preservation.
No TS/UI/config/dependency edits, so Next build/typecheck/lint may SKIP with explicit
reason; old passes remain historical, not current evidence. No browser E2E claim.
Record exact test counts/commands and six sealed REQ-IDs, not project completion %.

Main owns this TIP, new research proof LRC_ORBIT_SAFE_SPEED_REDUCTION_2026-10-05.md,
new TIP-072Q_MAIN_COMPLETION.md, and append-only manifest/handoff. Reviewer owns
new TIP-072Q_INDEPENDENT_REVIEW.md. Seven new assigned files total.
All old artifacts remain immutable. No DB/session/model/provider/API/Codex-child/
private capture/scientific-case/job/M1/campaign/archive/schema/migration/envfile/
install/Gitwrite/commit/push/billing/deploy. Full072 stays PARTIAL/NOT_READY_FOR_M1.
If scientific opportunity fails, report honest limitation rather than manufacture
a positive proof or broaden authority.
