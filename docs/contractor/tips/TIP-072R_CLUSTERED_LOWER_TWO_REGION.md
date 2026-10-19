# TIP-072R — a complete clustered-lower family, not another finite sample

Date: 2026-10-05. Priority P1. Depends on 072Q; complementary, not a superset.
Authorization: latest user asks to continue the LRC research. Bounded offline
proof and exact arithmetic only; no application architecture/authority changes.
Vibecode Kit: two independent read-only mathematical scans, sealed TIP,
Builder implementation, independent review, Main verification. Main does not
write product code. RRI/Blueprint checkpoint omitted: additive research-only
scope with no new worker, schema, UI, admission policy or campaign.

## Requirements and universal mathematical contract

R1. Prove the following for d>=2, 0<2d*eta<1. Positive lower speeds are
divisible by d, exactly d exceptions are positive units modulo d. Put
m=min ACTUAL lower speeds, U=max ACTUAL lower speeds, V=max exceptions,
B=m*(1-d*eta)/(d*eta), C=(1-d*eta)*(1-eta)/(eta*(1+d*eta)).
If U<=C*m, every tuple has a common time at distance >=eta.
No lower LRC premise, exhibited lower witness, fixed lower progression,
bounded absolute speeds, residue diversity or pair relation is required.

For V<=B: t0=eta/m and EVERY NONZERO physical shift j/d works. Explain
unit residue, signed/circular distance, lower first good bands and why j=0
is excluded from the low-branch guarantee. For V>B: exact lower-valid closed
interval I=[eta/m,(1-eta)/U], width W>=2eta/B>2eta/V. Start at left endpoint;
if selected V is unsafe across its complete orbit, move to the RIGHT endpoint
of its unique open unsafe component. Keep already safe time unchanged. One
exception then forbids zero shifts, remaining d-1 each forbid at most one.
Equality is GOOD; analytic V=B belongs to low branch. No generic strict slack.

R2. Distinguish two corollaries:
- 14 moving/15 total: nine lower multiples5, five units5; U<=7m, eta1/15,
  B=2m. Both lower and exceptional coordinates may vary independently without
  an absolute bound in the written theorem.
- 13 moving/14 total: eight lower multiples5, five units5; 19U<=117m,
  eta1/14, B=9m/5. Not interchangeable with the fifteen-total target.
This complementary infinite family DOES NOT include old lower5..45 (ratio9).
Above C there may be a gap B<V<H, H=2eta/W when W>0. Failure of this method
is UNKNOWN, never an LRC counterexample or evidence of an optimal LRC bound.
C is sufficient for this two-region argument, not an asserted optimal constant.
Compare Allikvere v2 Lemma4.6 and Kravitz arXiv v1 Proposition8.1 / published
Proposition6.1. Novelty/global LRC/whole archived branch NOT_ESTABLISHED.

## Bounded local executable

R3. Builder owns NEW ONLY:
- scripts/research/lrc-clustered-lower-replay.py
- tests/research/test_lrc_clustered_lower.py
- docs/verification/TIP-072R_BUILDER_COMPLETION.md

Self-contained stdlib Fraction implementation, no old mathematical imports.
Fixed d5/e5 with counts13/14 ONLY. Plain input exactly label,speeds; no caller
tau, witness, verdict, certificate or custom executable. Positive distinct
actual int speeds <=10^12, exact8/9 divisible lowers and5 unit exceptions.
No subclasses/hooks. Derive all premises and boundaries from actual inputs.
Outside ratio cone: UNKNOWN_RATIO_NOT_APPLICABLE, retaining original grid and
any independently observed witness separately; no theorem admission.
Inside: deterministic low branch at V<=B; otherwise high branch, largest V
and right-boundary adjustment. Lowest physical GOOD witness independently checked.

Retain labels/order, actual speeds, lower/exception indices, counts, eta,m,U,V,
B,C,ratio, ratio-premise, I endpoints/W/H (H null when W<=0), overlap/gap,
selected index, t0, exact orbit phase/nearest center/beta/right boundary,
branch and actual adjustment. Full original5xn distance matrix and every
exception BAD set; full adjusted5xn matrix on high branch, final GOOD complement,
all final coordinate distances/minimum. No matrix truncation to fit caps.
Whole deterministic body digest covers context and scope, timing separate.
Scope: unsigned local, no retained-agent-result, agentLoop NOT_RUN,
executionAuthority false; whole-branch/global/formal/external/novelty absent.
The finite executable speed cap is not a cap in the written theorem.

CLI fixed cases ONLY, no paths/options/stdin/custom cases. Eight cases:
1. n14 lower10,15,20,25,30,35,40,45,70; E1,2,3,4,19 (ratio equality, low).
2. same lower; E1,2,3,4,21 (ratio equality, high/right boundary).
3. n14 lower45,50,55,60,65,70,75,80,85; E1001,1011,1021,1031,1041
   (independently variable lower tuple, all same exception residue).
4. n14 lower50,55,60,65,70,75,80,85,90; E1,2,3,7,201
   (high but originally orbit-safe, zero adjustment).
5. n13 lower95,100,105,110,115,120,125,585; E1,2,3,4,171
   (ratio and low-threshold equality, valid unit exception).
6. same lower; E1,2,3,4,172 (high/right boundary, target1/14).
7. old n14 lower5..45; E1,2,3,7,11 (UNKNOWN ratio9; observed witness separate).
8. n13 lower5,10,15,20,25,30,35,40; E1,2,3,7,11
   (UNKNOWN ratio8, cannot promote fifteen-total or observed success).

Same hard ceilings as072Q: 5s,2M chargedoperations,32768B completeJSON,
256-bit rational components. Shared whole-run budget never reset; checked
before serialization. No file-write/network/child-process/DB/provider/private
root product capability. CLI reads only six execution flags, all exact false.
Failure emits no positive JSON. Local byte pin is not signed runtime attestation.

## Acceptance and independent QA

R4. Unit/adversarial tests: counts/positivity/duplicates/types/subclasses,
wrong lower/unit counts, invalid resource ceilings, component/output limits,
all six flags absent/true/malformed, options refused; no historical-test claims.
Exact endpoints, lower interval width equality, low branch every j1..4,
right-boundary positive/negative phase signs, center ties RIGHT here (notQnearest
LOWER), already-safe/zero adjustment, same-residue independence, both targets,
ratio-out UNKNOWN with observed success. In n14, V=2m cannot be a unit modulo5;
test analytic equality separately, never invent an invalid full-tuple fixture.

R5. Independent written proof review and whole-body exact reconstruction,
ALL matrices/context/scopes/digest, not source-AST/digest-only acceptance.
Fresh inspected-byte child Python -I -S -B, minimal6OFFenv, shellfalse,
empty stdin, timeout5s, source pre/post pin. Negative coherent rehash mutation
controls belong to reviewer comparison, not a nonexistent product validator.

R6. Main fresh CLI + tests + preservation. Seven new assigned artifacts only:
three Builder files above; this TIP, research proof
docs/research/LRC_CLUSTERED_LOWER_TWO_REGION_2026-10-05.md,
docs/verification/TIP-072R_MAIN_COMPLETION.md; reviewer owns
docs/verification/TIP-072R_INDEPENDENT_REVIEW.md. Append-only current manifest
and handoff, all old research immutable. Record REQ-ID counts/QA results,
not project completion percentages. Next build/types/lint SKIP justified if
Python/docs-only. No browser/E2E claim. Existing seven unlisted contractor
research-program-v2 files remain UNADMITTED, no unrelated reseal/deletion.

No DB/session/model/provider/API/Codex-child/privatecapture/scientificcase/job/
M1/campaign/archive/schema/migration/envfile/install/Gitwrite/commit/push/billing/
deploy. Full072 PARTIAL/NOT_READY_FOR_M1, original gates and predicates unchanged.
