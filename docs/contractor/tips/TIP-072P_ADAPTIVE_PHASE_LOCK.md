# TIP-072P — adaptive phase-locking and integer-lift scope validation

Date2026-10-05. PriorityP1. Depends072O. Human requested continue.
Scope is mathematical research plus a SMALL explicit offline Python diagnostic,
NOT another application/runtime lane, UI change, M1 or Allikvere branch admission.
Vibecode Kit focused scan -> sealed TIP -> Builder -> independent review -> Main.
Main no productcode. No new RRI/Blueprint needed: existing architecture untouched.
No new human gate for this bounded offline scope; all production gates unchanged.

## Research outcome required

P1: prove exact doubled speed relation is not preserved by independent integer
congruence lifts. Fixed relation a_j−2a_i+M(z_j−2z_i)=0 is extra coupling.
A finite union of nonidentity pair hyperplanes cannot cover a full integer orthant;
explain affine identity condition and distinguish finite prime-digit boxes.
Actual repo/article sources and a concrete14-speed same-residue pair-loss example
M1245 must be given. Do not label example a retained improper branch.

P2: general residual-phase lemma. d>=3,r>=2, a,b units mod d,
b≡r*a mod d, Delta=b−r*a, beta=||Delta*t0||. Positive targeteta with
2eta<1/d and (r+1)eta+beta<=1/d gives pair strictBADunion<=1.
Delta/d integer preserves phaseerror at ALLshifts; strictBAD admits equality.
This suffices, is not necessary and does not prove a universal density statement.

P3: adaptive interval theorem. Lower-preserved speeds have minimum>=L>eta at
tStar, largest ACTUAL LOWER speed U, radiusR=(L−eta)/U. Let
rho=1/d−(r+1)eta>=0. For Delta!=0, nearest residual-band distance is
max(0,||Delta*tStar||−rho)/|Delta|. If that is<=R, an adjustedbase exists
and atmoste−1forbidden shifts for e<=d unitexceptions includingpair.
Worstphase sufficient bound |Delta|R>=1/2−rho. Delta0 handled separately.
Only LOWER speed maximum U, not maximum all speeds. No necessity/optimalityclaim.

Fixed useful corollary:14moving/15total,9divisibleby5,5unitexceptions,
selectedpair a,b with b≡2a mod5. Exhibit lower tau for reducedspeeds
withmargin>=1/10; tStar=tau/5,Umaxactualdivisible,R1/(30U).
Delta0 OR |Delta|R>=||Delta*tStar|| suffices for target1/15;
worstphase |Delta|>=15U. Choose nearest n to Delta*tStar, ties LOWER INTEGER,
adjustedbase n/Delta, |adjustment|<=R; thenenumerate5physicalshifts lowestGOOD.
This removes exactspeed equality via timeadjustment. ConditionallowerLRC9
suffices for universalcorollary, not reproved. Arbitrarylarge lower speeds
may destroy dominance while preservingallresidues; no wholebranchpromotion.

Infinite subfamily fixeddivisibles5..45, exceptions[1,2+1245z,3,7,11],z>=0:
z0exactpair; z>=1 Delta1245z>=15*45. ALLz guaranteeconditionalrealproperty
with explicittau1/10. Residuesmod1245constant. It is not claimed retained
improper; does notcover independentgrowth of all14speeds.
Grid-synchronized t=h/M withd|M can preserve phasepairforALLlifts but stays
onMgrid; cannot turn knownNO_GRID branch into newcertificate via thisalone.

P4: keep meaningful negatives/caveats: smallDelta gate failure is UNKNOWN /
NOT_APPLICABLE, never LRCfailure; actualGOODshiftmaystill exist. No guarantee
for14totalfromfixed1/15. No global/formal/external/novelty/strictslackclaim.
Phasealigneduniformlemma conditional, not exactrelation inheritance.

## Builder executable scope and files

Builder owns newonly:
scripts/research/lrc-adaptive-phase-lock-replay.py
tests/research/test_lrc_adaptive_phase_lock.py
docs/verification/TIP-072P_BUILDER_COMPLETION.md

Self-contained stdlibFraction exact arithmetic; no oldCore/helper imports.
Fixed n14,d5,e5,r2 only for executable, speedlimit10^12, rationalcomponents
<=256bits. Pure helper may accept ONLY bounded exactplain input to derive
certificate from actualspeeds/pairlabels/lower tau. No externally supplied
claimedpositive/verdictadmission; CLI FIXEDcasesonly, nostdin/paths/customspeeds.
No filewrite/network/process/provider/DB/private-root access byproductscript.
Only read SIX named envflags and requireexactfalse before CLI diagnostic.
All6 flagsOFF. One 5s/2Mchargedsteps/32768B completeJSON output budget;
failclosedno positiveJSON on budget/flag/inputfailure. No evidencefieldomission.
If outputtoo large reportL2beforechangingrepresentation/caps.

Retain complete6fixedcases, divisible5..45, tau1/10:
- exceptions[1,2,3,7,11] Delta0 exactcase.
- [1,52,3,7,11] Delta50, belowdominance but phasealreadyalignedcase.
- [1,677,3,7,11] Delta675=15U, exactradiusboundary, tieLOWER gives13/675.
- [338,1,3,7,11] Delta−675; nearesttieLOWER gives−14 hence14/675.
- [1,1247,3,7,11] Delta1245, genericcongruencesubfamilyz1.
- [1,7,3,4,11] Delta5: failsintervalalignmentgate fromtStar1/50,
  statusUNKNOWN_GATE_NOT_APPLICABLE but rawexisting shiftsj1/j3 meettarget.

For each successfulcase retain all14speeds/9reduceddistances/lowerwitness,
pairlabels/Delta/U/tStar/L/eta/radius/beta/dominance/nearestinteger/alignedbase/
actualadjustment, all5x14 rationaldistances/pairBADindices+union/GOODindices/
lowestphysicalshift/finaltime/all14coords/fullminimum; no samplingproofclaim.
For UNKNOWNcase retain validlower/context and alloriginal5x14distances and
actual observedwitness, explicitly separate observedmathwitness from gate.
Scope everycertificate: localunsigned, NOTretainedagentresult, agentLoopNOT_RUN,
authorityfalse, global/formal/external/noveltyNOT_ESTABLISHED.
No genericallrealorunbounded solver/worker/registry mutation.

P5: independent test arithmetic with fullFraction reconstruction, full14coords,
closedradius/equalitythreshold, sign/tie/beta/primitiveunits, allz in finite
sample[0,1,2,3,10,100,1000] verifyinstances NOTinfiniteproof.
Falseunit/pair/lower/n/duplicate/bounds/type/flags/resourcesrefused,
and smallDeltaUNKNOWNnotfailure. Fresh real fixedCLI process with5stimeout,
all6OFF, <=32KiB wholeJSON, sourcehash/frozeninputs; tests importknownproduct
source only withnoPythoncachewrites (-B). Report actualcounts/cases/results.
Local process consistency only, not signedinterpreter/host/sourceclosure.

## Main/reviewer scope

Main owns sealedTIP/manifestappend, proof
docs/research/LRC_ADAPTIVE_PHASE_LOCK_2026-10-05.md
and docs/verification/TIP-072P_MAIN_COMPLETION.md, handoffappend.
Reviewer ownsnew docs/verification/TIP-072P_INDEPENDENT_REVIEW.md,
challengesall-realproof and independentlyrecomputesfullfixedcases/unknown.
No oldfile edits exceptmanifest/handoffappend;7newassignedfiles.
Main final actualCLI+newtests, prior46-suite1917historicalregression,
wholetypes/lint andfingerprint/prefixaudit. BuildSKIPjustified: noNext.js/
TS/UI/assets/config/dependencychanges; prior072ObuildPASSbutnotnewbuild.
No browser/UI E2E claimed. Quantify6criteria separately from projectreadiness.

P6: allP1..P5 evidence independentlyreviewed; noremainingP0/P1 scoped; MainQA/
prefix/fingerprint/HEADunchanged. Implemented6/6only offline.
No DB/session/provider/model/API/Codexchild/privatecapture/case/job/M1/campaign/
archive/schema/migration/envfile/install/Gitwrite/commit/push/billing/deploy.
Oldregistry37/sourceceiling42/ledger7/history/refutations/064FAILEDUNKNOWN/
predicatesunchanged. Full072PARTIAL/NOT_READY_FOR_M1; oldproductiongatesremain.

