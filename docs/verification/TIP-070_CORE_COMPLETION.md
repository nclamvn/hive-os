# TIP-070 Core completion: authenticated passive retained-loop readiness

Date: 2026-10-04. Role: Core Builder. Status: READY_WITH_SCOPE_LIMITS.
Sealed scope: `docs/contractor/tips/TIP-070_AUTHENTICATED_LOOP_READINESS.md`,
SHA-256 `63f94205c7ffe0148431baef6463ada470fa2699197fdc39c8991d8b4e9f1e99`.
This includes Contractor's explicit ordinary authentication-housekeeping exception.
G2 remains NOT_AUTHORIZED. This is not an executor or production deployment certification.

## Delivered

Three new owned product/test files, with no preexisting product edits:

- `src/server/operations/math-lrc-loop-readiness.ts`
- `tests/unit/math-lrc-loop-readiness.test.ts`
- `tests/unit/math-lrc-loop-readiness-fixture.ts`

`loadLrcLoopReadiness` is a server-only DAL accepting current request Headers,
workspace slug, one UUID mission and 1–16 distinct UUID cases. Strict input rejects
caller contexts, grants, source pins, digests or injected resolvers. It takes an
immutable Headers snapshot, resolves actual session/workspace/membership, checks
mission-scoped `research.read`, uses the existing organization tenant transaction,
and refreshes authorization before returning. Principal, membership or tenant
drift drops the whole projection to non-disclosing UNAVAILABLE. Ordinary sanitized
viewing does not require being the original researcher; this does not extend raw
diagnostic rights to another viewer.

The query independently scopes Mission through its workspace organization relation
(Mission has no direct organizationId), and scopes case/run/review identity before
deriving job IDs or hashing bodies. Wrong-tenant/mislinked review is indistinguishable
from an unavailable case, including in explicit returned-row corruption controls.
Exact persisted solver/review jobs, outboxes and original command are checked:
distinct IDs, attempts=maxAttempts=1, SUCCEEDED jobs, dispatched outboxes, exact
job/topic/aggregate/one-key payload, run command identity, original requester,
successful original request command and its run outcome. No latest-job-by-case
UI status is used as evidence.

Only the exact frozen v4 method contract, source/question/scope and full ledger7
are admitted. The solver job's original `resultDigest` is NOT the dossier digest.
The fixed v4 adapter emits no external sources and one exact HONEST_NULL finding;
the loader enforces that specific frozen shape and reconstructs its worker result
digest, comparing the independently persisted solver result anchor. It separately
checks attempt, dossier and review/result digests. Generic provider source keys and
source classes are not persisted, so no generic reconstruction or invented
provenance is attempted. Source-free conditional method findings are not theorem
or independent mathematical verification.

Bounded passive `verifyInstalledMethodUnitSources` checks the existing reviewed37
files and supplies fixed finite pins. It does not cover new069/070 code or attest
fresh mathematical execution. Separate new-file QA pins are recorded below.
Plain retained JSON is bounded before hashing/recursive schema work. No private
capture root is accessed and no checker runs on this DAL path.

TIP069 registry, record admission and planning occur wholly inside the authenticated
process. Batch is null; information, relations and associations are empty because
their independent durable anchors do not exist. No closure/stop/pivot authority is
invented. A malformed, incomplete or unavailable requested cohort emits no partially
trusted tasks. Admitted cohorts retain exact source finding references/reasons/digests
as proposed UNROUTABLE tasks. Raw records, session identities, role contexts and
private admission tokens never enter the deeply frozen bounded DTO.

All DTOs keep PLANNING_ONLY, dispatchAllowed=false, proofClosure=false,
freshFiniteReplay=NOT_RUN, batch/independentInformation=NOT_BOUND,
executionGate=G2_NOT_AUTHORIZED, and global/formal/external/novelty NOT_ESTABLISHED.

## Focused verification

Final command:

```text
npm run test:unit -- tests/unit/math-lrc-loop-readiness.test.ts
65 passed, 0 failed; 20:41:19 local; duration 3.06s
```

Owned-file lint:

```text
npx eslint src/server/operations/math-lrc-loop-readiness.ts tests/unit/math-lrc-loop-readiness.test.ts tests/unit/math-lrc-loop-readiness-fixture.ts
exit 0, no diagnostics
```

All positive row, session and source-loader fixtures are explicitly SYNTHETIC.
They are never persisted, recovered from064, or claimed as browser/scientific
evidence. Test fixture construction performs bounded finite fixture checks; the
production DAL never does so. No model/provider/worker/DB/root/browser/Git/install/
migration/build command was run by Core. Main owns whole types/lint/build and real
browser verification. Existing approved session resolution may perform ordinary
authentication-table refresh/expired-session cleanup; no absolute zero-DB-write
claim is made. Scientific/research-run/job/outbox/capture/model mutations are absent.

Owned criteria A1–A5: 5/5 covered by focused controls. A1 checks scoped query shape,
tenant arguments, refresh, current capabilities, Headers snapshot and non-disclosure;
A2 checks exact v4 rows, full ledger7 and job/outbox/command/result pins; A3 covers
legacy/missing/corrupted/source failures; A4 proves passive limitations and exact39
finding sources for one admitted fixture; A5 proves sorted deterministic frozen
two-record output with78 source findings, cap/depth/cycle/getter/duplicate refusals
and all-or-nothing cohorts. A6–A8 require UI/Main evidence and are not claimed
completed by this Core report. No real positive method-unit run exists in these
controls.

Technical checkpoints preserved, not summed as new successes:

- Initial61 controls: 60 PASS/1 FAIL. A changed solver job ID caused the mock to
  return an extra unrequested job; the loader correctly refused globally, while
  the assertion incorrectly indexed a per-case refusal. Control repaired.
- UUID fixture rebinding checkpoint: 61 failed before loader invocation because
  the test finite binding mistakenly carried requestedModelName. Strict schema
  correctly refused. The fixture was repaired, not product schema relaxed.
- Subsequent61/61 PASS at20:37:53 local, duration2.91s.
- Main actual-browser/schema finding: unsupported Mission.organizationId spread
  caused sanitized operational refusal. Query fixed to nested workspace relation;
  exact queryshape control added.
- Independent MR070-1: foreign review metadata could be used to derive a job ID.
  Repaired by pre-job review tenant/case filtering, with no-job-query control.
- Main whole-types checkpoint reported nullable-flow errors because the arrow
  refusal helper did not narrow control flow; changed to a never-returning function
  declaration and safe result fallback. No nullable assertions or schema weakening.
  One adversarial test literal received a test-only typed corruption cast.
- First65 checkpoint:64 PASS/1 FAIL. Missing review again exposed an overbroad
  job mock; the mock now faithfully applies requested job IDs. No guard weakened.
- Final65/65 PASS on final owned bytes, as above. Main aggregate reruns are separate.

## Final owned pins

```text
b2a03dc3f20386ef42e7e5d81c39dcf03beb80580e52a2bb6ca5ea4798f33720  src/server/operations/math-lrc-loop-readiness.ts
050640d54ad95bc0a9a226cd4174c363e4218275b431fe1711afcb39c99b88ca  tests/unit/math-lrc-loop-readiness.test.ts
ff25155f08c548b8e144cbf8a6077c7cac8ca606cbf62a076df7221aebd7b261  tests/unit/math-lrc-loop-readiness-fixture.ts
```

Old069 planner/tests, fixed37-source registry, scientific history/source packets,
G2 candidate and unrelated dirty work were read-only to Core. Main verifies the
whole baseline separately. Core received Main's report that actual legacy064
browser observation became AUTHENTICATED_READ_ONLY / LEGACY_NOT_ADMISSIBLE with
zero tasks and unchanged UNKNOWN history; this is Main evidence, not a Core run.

Remaining R5 task execution, R8 durable private capture/batch/information/relation
anchors and R12 activation still require later strategic security design and exact
executable-manifest G2 authorization. No live authority mint, executor, independent
replay, new campaign, LRC14/15 proof, novelty or breakthrough claim is delivered.
