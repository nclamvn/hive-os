# TIP-072M — sharp shift-margin diagnostic, offline mathematical milestone

Date: 2026-10-04. Priority: P1. Depends on existing known few-exception shift
method and frozen071 independent replay; does not depend on production072B.
Authority: human asks continue until an evidenced milestone. Offline public
mathematical analysis and additive diagnostics only; no G2 or scope-bound change.

## Contractor decision

Do not spend another turn calling partial read checks a closed agent loop.
Native-operation CAS and full107-file candidate closure need separately reviewed
design/permissions before live M1. Meanwhile pursue a falsifiable mathematical
deliverable within the four existing d/e classes, without changing their old
1/15 predicate, source pins, ledger, history, worker or production gates.
This task may establish a sharp universal discrete shift margin by written proof
plus exact diagnostic controls, NOT novel/global LRC14/15 or actual agent E2E.

## Claim to test

For d>=3,2<=e<d, unit residues a_i modulo d and arbitrary real alpha_i, set
r=floor((d-1)/e), delta=r/(2d). There is j in0..d-1 for which every
||alpha_i+a_i*j/d||>=delta, and at least d-e*r such shifts exist.
This delta is the largest uniform threshold over arbitrary phases/units:
all a_i=1 and offsets -(i*(r+1)+r/2)/d modulo1 cover the cyclic grid by
e blocks of r+1 vertices; every shift has some distance<=delta.
Hence any delta'>delta fails on that same phase tuple. Equality is GOOD.

Executable scope is ONLY (d,e)=(3,2),(5,2),(5,3),(5,4):
sharp exception thresholds1/6,1/5,1/10,1/10. Under separately assumed
LRC(14-e), lower witness plus shift invariance gives all14 moving coordinates
distance>=min(1/(15-e),delta), respectively1/13,1/13,1/12,1/11.
These are conditional stronger guarantees; sharpness of independent exception
phases is NOT tightness of a single real speed tuple's overall LRC optimum.

## Ownership / files

Core Builder owns new-only:
- src/modules/research-sandbox/math-lrc-shift-margin.ts
- tests/unit/math-lrc-shift-margin.test.ts
- docs/verification/TIP-072M_CORE_COMPLETION.md

Replay Builder owns new-only:
- scripts/research/lrc-shift-margin-replay.py (stdlib Fraction, standalone)
- scripts/operations/lrc-shift-margin-audit.ts (bounded fresh-process CLI)
- tests/unit/math-lrc-shift-margin-replay.test.ts
- docs/verification/TIP-072M_REPLAY_COMPLETION.md

Independent reviewer owns new report only after final bytes freeze. Main owns
thisTIP, appended manifest/handoff, written proof dossier and Main acceptance.
No Main product code. Builders report suggestions before contract changes.

## Specifications

1. Pure Core reports fixed four classes, exact canonical rational distances,
   strict-bad/equality-good, sharpness witnesses and explicit conditional/global/
   formal/external/novelty/agent-loop limits. No producer/helper reuse from old
   arithmetic; only ordinary contract canonical serialization/hash may be reused.
2. Derive all critical phases +/-delta-a*j/d modulo1 for every unit. Deduplicate
   coincident boundaries; include each boundary and every connected open cell,
   including wrap. Record actual masks and deduplicated mask family per branch.
   Exhaust all tuples from the aggregate family of attainable masks of any
   unit/phase; report exact tuple count and minimum surviving shifts. Do not
   multiply per-unit redundancies or pretend rational samples alone prove all-real
   claims; universal bridge is the separate written continuity/count proof.
3. Construct explicit sharpness offsets using cyclic blocks and compute all d
   distances per exception. Verify max_j min_i distance equals delta exactly.
   Existing stronger-survivor refutations and old0/1 semantics stay untouched.
4. Core strict passive admission verifies bounded exact full rebuilt report,
   not only a supplied hash/status. Reject extra fields, reordered/missing cells,
   wrong wrap/endpoints/nonunit/sharpness/margins and coherent rehashes.
   Export no authority/grant/execution function. Resource bounds<=5s/2M charged
   steps,256-bit components, report<=32768B,input bytes checked before parsing.
5. Independent Python derives its own partitions/masks/tuple minima/sharpness
   and result summary without importing Core or old arithmetic. Fixed input four
   classes only; JSON stdin bounded; component/work/time bounds; no filesystem,
   network, DB, provider, archive execution or scientific fixtures. Empty external
   environment/isolated Python invocation as appropriate to existing wrappers.
6. CLI read-only, no write option; run fresh checker with -I -S -B, shell:false,
   <=5s remaining budget, bounded stdout/stderr, pinned current source bytes and
   compare semantic complete normalized result to Core. Report process metrics
   truthfully; local hashes are consistency pins, not signed attestation/approval.
   Provider/worker execution flags must remain OFF. No child Codex/API/model call.
7. At least one actual fresh Python success in replay tests and negative controls
   with coherent rehashed semantic corruption, wrongendpoint/nonunit/missingcell/
   badsharpness/missingassumption/globalpromotion. Include processfailure/timeout/
   drift/oversize/fractional-or-zero-budget controls. Main wholetypes/lint/build
   and declared relevant historical regression pack; separate math/source review.

## Acceptance criteria / requirement IDs

M1: Written all-real proof includes quantifiers, unit permutation, open arcs,
cyclic wrap, count d-e*r, endpoint equality and independent review.
M2: Explicit upper/sharpness construction disproves every larger uniform
threshold; four exact rational witnesses and replay match it.
M3: Conditional lifting shows tau/d, preservation and lower-LRC assumptions;
stronger four margins without claiming speed-tuple global tightness or novelty.
M4: Complete phase cells and all attainable-mask tuples independently reconstruct;
no empty or omitted branch and exact minima/resource metrics match.
M5: Hostile semantic mutations with coherent hashes refuse; no partial positive
when process/source/resource evidence fails. Boundaries stay closed.
M6: Frozen consequential review, Main relevant tests/type/lint/build and preservation
audit pass. Milestone classification distinguishes verified local conditional
method result from live agent E2E, formal proof and new research breakthrough.

## Constraints / report

Create Completion Report with M1..M6 pass/partial/deferred, exact tested counts,
sourceSHA and limitations. Preserve all prior files except Main append-only docs.
No changes to old predicate/37registry/history/071/072A/ledger7/064 status,
routes/UI/worker/DB/session/private-root/env/install/migration/Git/billing/deploy.
No production072B execution, M1run, human approval impersonation or new campaign.
Current42-source manifest ceiling stays unchanged; this diagnostic is not M1's
executable manifest. Do not append mathematical evidence into an actual case.
