# TIP-072T — critical 30-phase rigidity and exact lower-component coverage

Date: 2026-10-05. Priority P1. Depends on072S.
User authorization: continue the mathematical attack. Scope additive bounded
offline proof/replay only. Vibecode Kit separates Main Contractor, Builder and
independent skeptic. Main writes proof/contracts/reports, not product code.
Blueprint/RRI checkpoint omitted: no runtime/schema/UI/execution-authority or
scientific-admission change. Focused scans already performed independently.

## Decisions / focused scan

Existing Next/TypeScript/Prisma application and standalone stdlib Python
diagnostics remain unchanged. Installed Next Vitest guide read; no new package.
The proposed joint search inside the SAME symmetric Lipschitz radius was
rejected mathematically: when all30 original phases are covered, its least
displacement is exactly the old072S minimum. We instead use the complete
connected lower-GOOD component containing the exhibited base. Both scans
independently confirm a genuine positive upgrade fixture and a narrow exhausted
component. No numerical sample is substituted for a universal proof.

## T1 — complete critical coverage geometry

Exactly13 positive distinct moving speeds,8 lower multiples5 and5 exceptions
units5, eta1/14. H=gcd(ALL actual speeds), g=gcd(lower/5); require g/H=6.
Normalize w=v/H; physical preserved times tStar+ell/(30H), ell0..29.
q_v=6/gcd(w,6) in{1,2,3,6}. All lower phases preserved at all30 times.

Strict BAD iff distance<eta; equality GOOD. q1/q2/q3 exceptions forbid at
most6 of30 phases; q6 forbids at most5. Full cover forces q6 absent and allfive
masks saturated (size6), pairwise disjoint. Whole primitivity implies bothq2
andq3. CRT mod5 xmod2 xmod3 forces exactly2 q2 +3 q3, no q1:
the two q2 masks have identical2 mod5 supports and opposite parity occupancies;
the three q3 masks have identical complementary3 supports and complete ternary
occupancies. Prove necessity and sufficiency of this SATURATED CRT shape for
the actual masks, not an arbitrary invented mask certificate.
Retain each actual BAD mask, residue support, parity/ternary occupancy and full
union/multiplicity. Membership in type2+3 alone does NOT imply full cover.

Finite obstruction catalogue: exactly20 UNLABELED full-cover mask signatures,
NOT20 actual speed tuples or a finite absolute-speed reduction. Saturated q2
mask universe20; q3 universe60. Choose the two-residue q2 support A in10 ways;
its complementary parity-mask pair is unique. On the complementary3-support B,
all6 bijections B->Z3 occur as q3 masks; exactly2 unordered triples partition
these assignments pointwise. Hence10x2=20. Generate complete individual masks
as preimages of2 consecutive phase indices mod10 or3 mod15 under unit maps;
deduplicate/sort lexicographically, then complementary-support partitions.
Bounded efficient generation, not190x34220 Cartesian enumeration.
Retain top-level20 q2 masks,60 q3 masks and20 sorted signature rows of
[q2Id0,q2Id1,q3Id0,q3Id1,q3Id2] with exact ID/ordering semantics; each full
actual cover must match one catalogue signature. Every signature is genuinely
realizable: tStar1/6330, lower30*(100..107), each desired mask's residue-fixed
speed phase approximates its central phase within1/422, below q3 strict-margin
1/210 and q2 margin3/140; adding6330 preserves phases and ensures distinct
positive exceptions. Main proof gives construction; fresh unit/reviewer controls
check ALL20 whole realizations (outside fixed CLI matrix counts). This is not
global LRC proof and does not close any of the20 signatures for all speeds.

## T2 — local optimality and complete connected-component theorem

For any fully covered original orbit, let D_v be072S's exact distance to a
base making v GOOD on all5 primary shifts of some preserved secondary orbit.
The least displacement to ANY joint exception-GOOD point among30 translates
equals min_v D_v. First exit of a witness point's originally BAD exception
hits a GOOD boundary and makes that exception safe on its whole primary orbit;
spacing1/5 exceeds BAD arc length1/7. Converse follows shift counting.
This disproves any claimed full-cover/allSfail/jointPASS inside the SAME R.

For each actual lower u, k=floor(u*tStar), its unique GOOD band aroundtStar is
[(k+eta)/u,(k+1-eta)/u]. Their intersection I=[A,B] is the EXACT maximal
connected lower-GOOD component containingtStar, including closed/equal endpoints.
Retain every floor/band/coordinate label and active max-left/min-right label.
Lactual=min all lower distances; U=max lower; oldR=(Lactual-eta)/U.
I contains [tStar-oldR,tStar+oldR] but can be highly asymmetric, even oldR0.

If original30 already has a full GOOD point, accept delta0/lowest physicalell.
Otherwise every candidate is in an unsafe full-period gap. For v,h=gcd(v,g),
q=g/h,rho5eta,alpha5v*tStar,r=rho-(q-1)/(2q),
y=qalpha-(q+1)/2,z=nearest integer (lower tie),s=y-z,beta=|s|/q:
D=max(0,r-beta)/(5v), leftDelta=-(r+s/q)/(5v),
rightDelta=(r-s/q)/(5v). All strict-positive-radius gap premises checked.
For an already-safe candidate use left/rightDelta0 with explicit ALREADY_SAFE,
not a fictitious gap-boundary claim; fullcover forbids this situation.

There is a full witness in the preserved translates of I iff originalGOOD or
at least one of these10 closed left/right boundary points lies inside I.
Proof: a witness path startingtStar stays in I until first BAD exit; nearest
boundary on that side occurs no later. Conversely safe boundary + shift count.
No 2vR<1 bound/phase-band enumeration/native loop required.
Choose eligible boundary min(absdelta,delta,original coordinate index,side),
negative displacement wins equal distance; side LEFT before RIGHT only as final
redundant tie. Scan all30 physical times at this chosen base and retain complete
adjusted matrix; select LOWEST GOOD physicalell. H scaling must be exact.
No eligible boundary => UNKNOWN_COMPONENT_EXHAUSTED, no final witness;
absence scoped ONLY to these translates of this one connected component.
Other components/global LRC/archived integer lifts remain unestablished.

## T3 — bounded standalone implementation and complete output

Builder owns NEW ONLY:
- scripts/research/lrc-critical-component-replay.py
- tests/research/test_lrc_critical_component.py
- docs/verification/TIP-072T_BUILDER_COMPLETION.md

Plain input EXACTLY label,speeds,tau; canonical two-string rational tau;
tStar=tau/5. Actual positive distinct integer speeds<=10^12, exactly13 entries,
exact8 lowers/5 exceptions, g/H6, and EVERY computed lower distance>=eta.
Reject subclasses/hooks/extra keys/caller verdicts/witnesses/certificates.
Never import old math helpers. Stdlib Fraction only, not numeric approximations.
CLI has no options/paths/custom inputs/stdin read; only3 fixed cases below.

Lossless whole matrix representation: denominator D=lcm(den(base),30H),
positive canonical decimalstring; each 30x13 numerator is an exact NONNEGATIVE
integer at mostD/2, representing nearest-integer distance numerator/D.
Whole body explicitly defines this common-denominator schema. Numerators need
not be individually reduced; decode exactly. This retains EVERY coordinate,
not truncation/compression by sample omission. Individual contexts, endpoints,
and final13 coordinate distances use canonical two-string rational wires.
Retain all original matrices, BAD masks/union/multiplicity, GOOD complement,
CRT occupancies/shape facts, candidate parameters/BOTH directional distances/
component/symmetric gates, all lower bands/witnesses/L/U/R/H/g/gPrime,
I endpoints/active labels, selected coordinate/side/delta/base, all adjusted
matrix/BAD/GOOD information for a positive move, and accepted final13 distances/
minimum/lowest physicalell/actual time. Direct delta0 reuses its complete
original matrix explicitly; adjusted matrix null is NOT an omitted computation.
UNKNOWN has no selected boundary/adjusted/final witness. All deterministic
context/scope/body/counts and exact fixed refs digest-bound; timing separate.
Named compact column tables/top-level definitions allowed, unambiguous mappings.
No caller-supplied certificate validator or signed attestation exists.

Three fixed CLI cases, tau5/100003 throughout:
1 component_right_upgrade: lower7170,7200,...,7380;
  E[4989,54999,86656,19996,53326]. Full30cover/alloldSfail.
  I[1/100380,13/103320]; selected86656 RIGHT delta34263/606610197760>oldR;
  adjustedbase61/6065920. ALL30 scan hasGOOD[6,21]; final lowestell6,
  T242649/1213184, fullminimum1/14.
2 direct_secondary_observation: same lower, E last53332 instead53326.
  AlloldSfail, original30 hasGOOD indices[1,12,14,16,27,29]. Delta0,
  lowestell1,T100033/3000090,fullminimum7170/100003. Not originalfullcover.
3 component_exhausted: lower[7170,7200,7230,7260,7290,7320,7350,92850],
  Eoriginal. Full30cover, I[1/100380,13/1299900]; all10 boundariesoutsideI.
  UNKNOWN_COMPONENT_EXHAUSTED, not global LRC refutation.

Retained counts:3 original30x13 +1 positive-adjusted30x13 =1560 matrix coords;
24 lower distances;15 complete candidate rows;2 accepted final13 =26 distances.
Expected2 accepted (one positive component move/one direct observation),1 UNKNOWN.
Hard caps unchanged5s/2M charged steps/32768B completeJSON/256bitrationals;
one whole-run budget includes sizing/digest/serialization before output.
Preflight entire evidence size/work; no cap raising/dropping data to fit.
Product only reads6 named execution flags, all exactfalse forCLI:
RESEARCH_WORKER_ENABLED,MATH_PILOT_QUEUE_ENABLED,LRC_CAMPAIGN_LOCAL_ENABLED,
RESEARCH_OPENAI_ENABLED,RESEARCH_CODEX_LOCAL_ENABLED,SANDBOX_DOCKER_ENABLED.
No file/network/process/DB/provider/private-root capability.

## T4-T6 — acceptance and preservation

T4 fresh unit/adversarial checks: complete original/adjusted arithmetic, CRT
types vs true masks, q6 presence prevents cover, q1 mixed count, imprimitiveH
and normalized/physical index mapping, reordered labels, negative times,
endpoint GOOD, equal directional/coordinate ties, closed/single-point component,
zero-slack positive RIGHT control tau1/20076 with same lower/Eoriginal:
oldR0, full30cover, delta409/4349264640 succeeds insideI. Prove/control asymmetric
LEFT rejection/RIGHT acceptance, exact scoped UNKNOWN, canonical/type/flags/
resource/output-preflight refusal; no fake unitcount inflation.

T5 independent complete written proof + all1560 decoded matrix coords/24lower/
15candidate rows/26final distances/contexts/scopes/refs/digest reconstruction.
Fresh inspected-byte -I-S-B child, minimal6OFFenv, empty stdin, shellfalse,
timeout5s, pre/post pin. Coherent rehash controls are review oracle comparisons,
not a nonexistent product certificate validator. Source consistency is not
signed host/interpreter/runtime provenance or executable-closure acceptance.

T6 Main own fresh tests/CLI/S regression, manifest integrity/preservation audit.
Main owns thisTIP,new proof docs/research/LRC_CRITICAL_COMPONENT_2026-10-05.md,
new docs/verification/TIP-072T_MAIN_COMPLETION.md, append-only manifest/handoff.
Reviewer owns NEW docs/verification/TIP-072T_INDEPENDENT_REVIEW.md only.
Seven new artifacts total; no old product/research/test edits. Existing7 unlisted
contractor research-program-v2 files deferred, no unrelated reseal/deletion.
6 REQ-IDs mapT1-T6, explicit deferrals not whole repository green.
Build/types/lint SKIP justified additive Python/docs-only scope.

Primary HTML comparison: Allikvere effective gcd/few-exception shift counting;
Kravitz pre-jumps/interval fast-phase methods. These are established foundations;
local rigidity/optimality/component adaptation is NOT adjudicated literature
novelty or global LRC14/15 proof. Preserve every old branch/history predicate.
No browserUIE2E/native loop/job/M1/campaign/DB/session/model/provider/API/Codexchild/
privatecapture/scientificcase/archive/schema/migration/envfile/install/Gitwrite/
commit/push/billing/deploy. Full072 PARTIAL/NOT_READY_FOR_M1 and all old gates
unchanged; exacthumanG2/production prerequisites still required for a freshM1.
