# TIP-072N — correlated triple shift, structural divisor-class extension

Date: 2026-10-05. Priority P1. Depends on TIP-072M quantitative diagnosis,
not production072B. Human approved next step exploiting common-time correlation.
Authority is additive offline mathematical analysis/diagnostics, not actual M1,
G2, DB/campaign/model/private-capture access or architecture/cap expansion.

## Contractor decisions and focused scan

Use shortened SCAN -> sealedTIP -> BUILD -> independent VERIFY. Existing stack/
auth/UI are known; no RRI or new Blueprint because this is an additive offline
kernel within the approved research direction. Vibecode Kit Contractor does not
author product code. Two Builders own implementation; third independently reviews.
No new human checkpoint is needed for this bounded research diagnostic.

Negative scan: correlation at a fixed valid lower witness does NOT always
strictly improve the previous four independent-phase thresholds. Exact14-speed
examples at t0=1/2 with odd reduced divisible speeds attain the old margins.
Preserve this negative result; do not sell correlation as automatic improvement.
Generic adaptive-window solver is deferred: the earlier Lipschitz interval is
already known, and relabelling it is not a discovery.

Meaningful new target: d=3 with e=3 exceptions having EXACT integer speeds
q,2q,4q, q>0 and 3 not dividing q. It exceeds the previous e<d union-count scope.
Congruence alone is insufficient to assert these exact phase relations.

## Claim and specifications

Let ||x|| be distance to the nearest integer. For every real x,
H(x)=max_(j=0,1,2) min_(c=1,2,4)||c(x+j/3)|| >=1/9,
and inf_x H(x)=1/9. Period1/3 allows reduction to closed[0,1/3].
Choose normalized h=1 on[0,1/9] and[2/9,1/3], h=2 on[1/9,2/9].
All three coordinate fractional-part ranges lie in[1/9,8/9] on each segment.
At x=1/9 all three shift minima equal1/9, so every larger uniform bound fails.
Endpoint choices overlap; deterministic fixture choice uses h=2 on the closed
central interval, h=1 otherwise. All boundary equalities remain GOOD.

For physical time t0, write q*t0=x+m/3 with
m=floor(3*q*t0), x in[0,1/3). Then physical j equals
q^(-1)*(h-m) modulo3, NOT merely q^(-1)*h.
Carry m, q inverse and reduction must be retained/replayed/tested.
This extends to any exact q family, not arbitrary residue lifts.

For k moving speeds, k>=4, exactly three nondivisible by3 and equal q,2q,4q,
assume the required lower witness for k-3 divisible speeds 3*v_i:
||tau*v_i||>=1/(k-2). Set t0=tau/3; all divisible coordinates stay invariant
under j/3. Thus all k attain gamma=min(1/(k-2),1/9).
Applications: k13 (14total) gamma1/11 under lowerLRC10;
k14 (15total) gamma1/12 under lowerLRC11. No global theorem/lower proof claimed.
Optional robustness radius(gamma-1/(k+1))/maxSpeed is an old Lipschitz
consequence, not the principal new deliverable.

## Implementation ownership

Core Builder new-only:
- src/modules/research-sandbox/math-lrc-correlated-triple.ts
- tests/unit/math-lrc-correlated-triple.test.ts
- docs/verification/TIP-072N_CORE_COMPLETION.md

Replay Builder new-only:
- scripts/research/lrc-correlated-triple-replay.py
- scripts/operations/lrc-correlated-triple-audit.ts
- tests/unit/math-lrc-correlated-triple-replay.test.ts
- docs/verification/TIP-072N_REPLAY_COMPLETION.md

Reviewer new-only report docs/verification/TIP-072N_INDEPENDENT_REVIEW.md.
Main owns TIP/manifest append/proof dossier/Main report/handoff append.

## Fixed exact evidence and bounded admission

1. Core imports no old mathematical arithmetic/helper. Only node:crypto for
   canonical passive contract hashing. Fixed builder and full reconstruction
   validator, no execution/grant or generic supplied-speed solver.
2. Exact rational reduced decimal-string tuples. Retain three closed proof
   segments with normalized shift, all9 coordinate affine/fractional ranges and
   floor integers; show every whole range inside[1/9,8/9]. Written Main all-real
   proof is separate from sampling.
3. Independently derive complete common-phase critical partition from
   x=(z +/-1/9)/c-j/3, c1/2/4,j0/1/2, over closed[0,1/3].
   Retain10distinct boundaries, all10 boundary and9 adjacentopen cells including
   both domain endpoints, exact actual goodshiftsets and positive witness choice.
   Finite representative constancy bridge is the separate continuous proof.
4. Retain full sharpness distances atx1/9 (all3x3), optimum1/9.
   Retain independent-phase obstruction with unit residues[1,2,1] and
   phases[0,1/3,1/3], showing every j has a zero coordinate: no positive arbitrary
   phase guarantee for e=d. This is not a common-time counterexample.
5. Fixed constructive fixtures k in{13,14}, q in{1,2,4,5,7,8,10,11,13,14}.
   Divisible speeds3,6,...,3*(k-3), tau1/(k-2). Retain all20 speedtuples,
   t0, normalizedx, carry m, inverse, h, physicalj, t, all coordinate distances,
   exact minimum and gamma. This tests carry/nontrivial q inverse and both totals.
   Include four negative scan fixtures at t0=1/2:
   old d/e3/2 exceptions1,2;5/2 exceptions1,4;5/3 exceptions1,2,3;
   5/4 exceptions1,2,3,4, with divisible speeds d*(1,3,...,2*(14-e)-1).
   Exact lower phases1/2 are valid; exception/full shift minima equal olddelta.
   Retain lower-validity and exactminima, but no new global/correlated-tightness claim.
6. Strict bounded plain-data admission before parsing/hashing: no prototype/
   getters/cycles/hidden/sparse/symbol/inheritedserializationhooks, zero invocations.
   Full reconstruction comparison rejects even coherent rehashes of wrong
   segment/range/endpoint/cell/sharpness/physicalcarry/assumption/globalpromotion.
   Generated evidence detached recursivelyimmutable. No partial positive.
7. Limits unchanged <=5s/2M chargedsteps/32768B/256-bit components; fixed domain
   small safeinteger or exactBigInt rational arithmetic with no floating decisions.
   Check whole envelope before success. Do not raise limits/omit branches if
   oversized: report L2 before changing representation.
8. Python independent stdlibFraction derivation, no Core/old arithmetic imports,
   fixed request only version+positiveintegerremainingMs/remainingOperations,
   boundedstdin/duplicatekeys/NaN/unknownfields refuse. Reconstruct all evidence.
   Fresh pinned-byte -I-S-B process, shellfalse, minimalexternalenv, boundedIO,
   sourcepre/posthash/identity and wholecanonicalsemantic match. Shared outer
   allowance includes IO/Core/remainingchildbudget/comparison. SixflagsOFF required.
   Source pins are local byte/process consistency, NOT signed host/runtime/agent
   attestation or scientific admission. No writable output option/private IO.
9. Scope fields explicitly all-real written proof required, conditional lower
   witness required; GLOBAL/FORMAL/EXTERNAL/NOVELTY NOT_ESTABLISHED,
   agentLoop NOT_RUN, executionAuthority false. Keep no actual case/job/result.

## Acceptance criteria / requirement IDs

N1: independently reviewed all-real correlated lower bound + matching upper proof,
    units/period/closedendpoints/exact-speed quantifiers.
N2: independent-phase obstruction and old-class no-automatic-improvement controls
    prevent unsupported generalization; carry formula checked.
N3: conditional k13/k14 lifting and20full coordinate fixtures verified independently,
    lower assumptions/nonstationary counting clear.
N4: complete19cells/10boundaries +range/sharpness/source content reconstructed
    independently in at least one actual fresh Python process.
N5: coherent semantic mutations, passivehostiledata, process/source/resource
    fault controls refuse without positive evidence; limits never widened.
N6: frozen consequential review + Main declared regression/types/lint/build,
    baseline fingerprint/prefix audit pass, truthful local/conditional classification.

## Constraints and completion

No old products/tests/routes/UI/worker/registry37/sourceceiling42/history/refutations/
ledger7/064FAILEDUNKNOWN edits. No DB/session/provider/API/Codexchild/private-root/
campaign/M1/archive/install/schema/migration/envfile/Git/billing/deploy execution.
No literature novelty/globalLRC/production072B closure claims. Report DONE/PARTIAL,
N1..N6 coverage, actual tests/metrics/pins, deviations and remaining limits.
