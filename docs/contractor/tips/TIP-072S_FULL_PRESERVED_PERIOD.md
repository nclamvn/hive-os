# TIP-072S — full-period orbit geometry and primitive residual strata

Date: 2026-10-05. Priority P1. Depends on 072Q/R.
Authorization: user asks to dig deeper toward a breakthrough. Additive bounded
offline research/proof/replay only. Vibecode Kit separate Builder and reviewer;
Main writes proof/contracts/reports, not product code. Blueprint/RRI checkpoint
omitted: no runtime/schema/UI/admission or execution-authority change.

## S1: exact geometry, not a larger sample bound

Lower positive integer speeds u_i are divisible by d>=2, exactly d positive
exceptions are units modulo d, 0<2d*eta<1. Let g=gcd(u_i/d), U=max lower.
An exhibited tStar has every lower distance >=L>=eta. Put R=(L-eta)/U.
For a candidate v let h=gcd(v,g), q=g/h, rho=d*eta, alpha=d*v*tStar.
Secondary shifts ell/(d*g) preserve EVERY lower phase and give alpha a q-grid.
If q*(1-2rho)>=1, some secondary shift makes v safe on all d primary shifts
with NO adjustment/slack/speed/ratio requirement. Automatic branch works L=eta.

Otherwise unsafe union gaps have centers (z+(q+1)/2)/q and radius
r=rho-(q-1)/(2q)>0. Exact base displacement to union-safe set is
D=max(0,r-||q*alpha-(q+1)/2||/q)/(d*v).
More generally use r=max(0,rho-(q-1)/(2q)), giving D0 on automatic branch.
Choose nearest gap boundary when D>0: positive offset goes UP, negative/center
offset goes DOWN; center ties LOWER. No adjustment when D0. If D<=R, change
tStar by signed D, then find an orbit-safe secondary shift. Four remaining
exceptions each forbid at most one of the five primary shifts in executable.
Selected exception forbids zero. Equality GOOD; failure UNKNOWN, not refutation.

Construct without enumerating q or g: adjusted alpha fractional part f,
k=ceil(q*(rho-f)), inv=(v/h)^(-1) mod q, ell=(inv*k) mod q. q1 uses ell0,
inverse null. Negative k allowed. Verify chosen phase really lies in closed
[rho,1-rho], after reducing modulo1. Subsequent primary shifts j/d count as usual.
Distinct lower slack and automatic cases; never divide by zero at L=eta.

At standard lower margins1/10 for n14 and1/9 for n13, d5:
n14: q1 threshold2U; q2 U/2; q>=3 no speed threshold.
n13: q1 9U/5; q2 27U/50; q3 3U/25; q>=4 no speed threshold.
Actual diagnostic L is computed from ALL lower distances, not capped to a
weaker theoretical margin. Actual speed threshold r*U/[d*(L-eta)] if L>eta; null if
r>0,L=eta; zero if r0. q1 exactly recovers primary-only geometry.

## S2: structural classification and honest foundations

Normalize the WHOLE tuple by H=gcd(all actual coordinates). Because exceptions
are units modulo d, gcd(H,d)=1 and H divides g. Let gPrime=g/H.
For n14, no automatic q>=3 implies gPrime divides2, so only gPrime in{1,2}
remains. For n13, no automatic q>=4 implies gPrime divides6, so only
gPrime in{1,2,3,6} remains. Prove using common divisor gPrime/gcd(gPrime,lcmQ),
not sample inference. q invariant under whole normalization.
These are finite gcd strata, NOT finite absolute-speed or full-LRC reductions.
Primitive n14 lower all divisible15, and primitive n13 lower all divisible20,
are covered regardless lower speed ratios GIVEN a valid lower witness; lower
LRC9/8 supplies an existence premise but is not independently proved here.
Raw large g in an imprimitive tuple is not enough; explicit normalization.
Do not promote a whole archived branch without checking EVERY integer lift.

Primary comparison: Kravitz arXivv1 Section4 pre-jumps/Theorem7.2 large-gcd,
Allikvere v2 Lemma2.2 effective gcd orbit and Lemma4.6 critical shift. These
principles are established; this is a q-aware critical-exception adaptation.
Literature novelty/global/formal/external/breakthrough NOT_ESTABLISHED.

## S3: bounded diagnostic contract and owned files

Builder owns NEW ONLY:
- scripts/research/lrc-full-period-replay.py
- tests/research/test_lrc_full_period.py
- docs/verification/TIP-072S_BUILDER_COMPLETION.md

Standalone stdlib Fraction, no old mathematics imports. Fixed d5/e5,13/14
moving counts only. Input plain exactly label,speeds,tau (canonical two-string
rational); no caller witness/verdict/certificate. Positive distinct integer
speeds<=10^12; exact8/9 lowers and5 exceptions; no subclasses/hooks. Compute
lower tau*(u/5) distances, Lactual=min, tStar=tau/5; require Lactual>=eta.
R0 is legal. Evaluate ALLfive candidates; choose min(D,index), i.e. smallest
exact displacement, ties lowest ORIGINAL coordinate label. Not max speed.
If minimumD>R, UNKNOWN with full original grid observation, no final theorem
witness. Otherwise adjust, choose ONE inverse-based secondary shift, then
exactly5 primary shifts. No loops/ranges proportional to q/g or speed values.

Retain all actual coordinates/order, counts/target/g/H/gPrime, lower witness
distances/L/U/R; all5 candidate v,h,q,alpha,r,gap coordinate/nearest integer/
offset/beta,D/signed delta,primary-onlyD,actual speed threshold/automatic/speed/
phase/primary gates. A named-column compact table is allowed to keep whole
output within existing cap; no data omission or ambiguous column mapping.
Retain selected index, adjusted base/delta, rawceil k/kmodq/inverse/ell,
secondary time and orbit-safe base. Full original and successful adjusted5xn
matrices, BAD/GOOD sets, selected distances, all final coords/minimum and lowest
physical GOODj. Whole deterministic context/body/scope digest; timing separate.
Unsigned local, agentLoopNOT_RUN,executionAuthorityfalse, no wholebranch/global/
formal/external/novelty admission. No fake externally supplied validator.

Seven fixed CLI cases ONLY, no options/paths/stdin/custom cases:
1 n14 lower10*[1,3,5,6,7,8,9,10,11], E[1,3,4,8,37], tau5/21.
  ActualL1/7,R4/5775; every old primary-only gate fails even using actualL;
  selected37q2D1/7770 passes. Ratio11 outside072R.
2 n13 lower10*(1..8), E[2,3,4,6,21], tau1/18.
  ActualL1/9,R1/2016; selected21q2D1/4410; every old gate fails.
3 n13 lower15*[1,3,4,5,7,9,11,13], E[6,12,18,24,34], tau19/108.
  ActualL1/9,U195,R1/4914; selected34q3D1/32130; every old gate fails.
4 n14 lower15*(1..9), E[1,24,22,23,21], tau1/30.
  Original masks cover ALLfive shifts; all old gates fail; selected1q3automatic.
5 n13 lower20*(1..8), E[1,29,27,28,26], tau1/36.
  Original masks cover ALLfive shifts; all old gates fail; selected1q4automatic.
6 n14 g1000000007, lower5g*(1..9), E[1,2,4,7,2g], tau1/(10g).
  Largest exception q1 gate fails, selected1 qgautomatic; inverse no enumeration.
7 n14 lower5..45,E[1,2,3,7,11],tau1/10, all period gates fail; UNKNOWN.
Expected6accepted+1UNKNOWN,7original+6successful matrices=880coords,
60 retained lower-witness distances. No dropping matrices to fit output.

Hardcaps unchanged5s/2Mchargedoperations/32768B completeJSON/256bitrationals,
one whole-run budget, preflight size/serializationwork before whole-treeJSON.
Product no file/network/process/DB/provider/privatecapture capability. Read
only6namedexecutionflags, all exactfalse forCLI. Failure no positive JSON.
Pinning inspected bytes is not signed host/interpreter/runtime attestation.

## S4-S6: acceptance and preservation

S4: fresh unit/adversarial methods, both targets; phase parity qeven/qodd,
center lower ties, endpoints, q1 recovery, qauto equality/no slack, negative
ceil/inverse/q1 specialcase, complete candidate selector including maxV trap,
normalized primitive vs imprimitive control, rational/flags/input/resource/
output refusal, correct UNKNOWN observations. No geometric sample is proof.

S5: independent written proof + ALLcandidate/context/lower/matrix/scope/body
arithmetic reconstruction. Fresh inspected-byte -I-S-B child, minimal6OFFenv,
emptystdin/shellfalse/timeout5s/pre/postpin. Coherent rehash controls are reviewer
whole-body comparison, not a nonexistent product validator. Full880+60 match.

S6: Main own fresh tests/CLI/regressions/fingerprints plus manifest inventory.
Main owns thisTIP,newproof docs/research/LRC_FULL_PRESERVED_PERIOD_2026-10-05.md,
new docs/verification/TIP-072S_MAIN_COMPLETION.md, append-only manifest/handoff.
Reviewer owns new docs/verification/TIP-072S_INDEPENDENT_REVIEW.md only.
Seven new artifacts total, no old research edits. Existing seven unlisted
contractor research-program-v2 files stay deferred; no unrelated reseal/deletion.
Record6REQ-ID coverage, not global project readiness. Next build/types/lintSKIP
justified Python/docs-only. No browser/UIE2E or native agent-loop claim.

No DB/session/model/provider/API/Codex-child/privatecapture/scientificcase/job/
M1/campaign/archive/schema/migration/envfile/install/Gitwrite/commit/push/billing/
deploy. Full072 staysPARTIAL/NOT_READY_FOR_M1, all old admission gates unchanged.
