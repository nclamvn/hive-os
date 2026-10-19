# TIP-035 bounded dossier completion report

Date: 2026-10-01. Builder C. Status: DONE implementation; Contractor accepted assigned integration and pre-copy browser behavior. Final overall checks and copy-only screenshot reload remain Contractor-owned.

## Requirement coverage

- H01 implemented: mission-scoped lightweight summaries, exact authorized off-page selected-case reads, bounded complete cycle chains, deterministic tuple cursors and visible navigation/completeness labels.
- H02 implemented: selector-independent calibration evidence, malformed/repeated selection rejection, cross-mission/workspace/tenant scoped body retrieval, scoped job/outbox reads, explicit invalid-selection and incomplete-calibration states.
- Graph panel wiring implemented using only integrity-validated full `cycle.trace` supplied by Builder A. Panel semantics belong to G04/Builder A and are not independently certified by this wiring.
- Coverage of assigned implementation: 2/2 requirements. Contractor's final guarded integration accepted all four C scenarios; actual desktop/mobile navigation was accepted before the later copy-only correction. Overall final acceptance belongs to Contractor.

## Files

Created:

- `src/modules/research-sandbox/math-dossier-pagination.ts`: bounded constants, strict query/cursor identities, tuple pagination and shared plausible calibration candidate predicate.
- `src/modules/research-sandbox/math-dossier-loader.ts`: independent bounded calibration evidence scan and honest incomplete result.
- `tests/unit/math-dossier-pagination.test.ts`: malformed/repeated input, root-bound cursor, tie ordering and historical cycle navigation contracts.
- `tests/unit/math-dossier-calibration.test.ts`: older valid calibration after invalid recent candidates, 200-candidate cap and error propagation.
- `tests/unit/math-dossier-loader.test.ts`: light query projection, bounded exact body/job scopes, full-chain selection, no prefix validation and non-empty authorization errors.
- `tests/unit/math-pilot-copy.test.ts`: live dispatch prerequisites use approved resources and separate AI review roles; distinct human acceptance and theorem cautions remain.
- `tests/integration/math-dossier.test.ts`: four guarded `hiveos_test` scenarios prepared for Contractor execution.

Modified:

- `src/modules/research-sandbox/kernel.ts`: summary projection and optional exact case IDs; job/outbox filters use only displayed cases or formal attempts. Calibration reads skip job/outbox lookups. Two ID-only active-calibration metadata lookups keep card request controls independent of the selected detail as well. Narrow prerequisite scan in existing authoritative request transaction now uses the same provider/model/completed-candidate predicate and 200-candidate safety ceiling as UI. Every candidate is revalidated; UI readiness is not trusted by mutation.
- `src/modules/research-sandbox/math-cycle-kernel.ts`: ONLY agreed list-cycle read seam and new bounded read helper. Select four lightweight ID records, retrieve exactly three displayed full event chains, count all scoped cycles, and bind direct historical cycle selection to exact case, mission and workspace. Existing trace validation/policy code untouched by C.
- `src/app/w/[workspaceSlug]/research/math-pilot/page.tsx`: no full-body-first 100-case/20-cycle load; paginated summary selector, one visible full case, independent calibration scan, three full displayed cycles and direct historical detail links. Graph panel sits next to adaptive panel. Removed render-time factorization/discovery `analyzeTwoGateResidualPrime`, not retained source or evidence. Existing bounded integer tuple-integrity checks remain.
- `src/i18n/math-pilot-copy.ts`: Contractor-approved narrow VI/EN `dispatchLocked` wording removes the contradictory mandatory-human prerequisite for AI dispatch, retaining worker/provider/approved resource limits and separated AI review roles. No queue/cap or human-acceptance policy changed.

## Bounded behavior and decisions

- Summary page: 20 visible metadata rows, one additional lightweight row to determine next page. Metadata status/title is explicitly not mathematical acceptance.
- Default detail: latest case on visible summary page; selected exact authorized ID may be off-page. Invalid/repeated/malformed query never falls back to an unrelated default detail.
- Cycle page: at most three full histories. No event `take` or prefix is fed to full-chain validation. Count does not imply all bodies are loaded. Direct `cycleId` navigation supplies complete older details, even for a cycle otherwise shown only as a brief. Historical views do not offer fresh launch controls.
- Cursors are canonical inert JSON in base64url bound to mission and selected scope, sorted by `(createdAt desc, id desc)` and filter by strict older-than tuple. They are not authentication tokens; every actual query independently reapplies trusted authorization and tenant/workspace/mission/case filters.
- Calibration: up to 200 plausible completed candidate records, pages of 20, independently of any `caseId`, summary or cycle page. Pending records do not crowd out older accepted evidence. A safety cap with unresolved readiness yields INCOMPLETE/NOT_ESTABLISHED and empty effective pass set, not a definitive missing/failed calibration claim. Positive evidence is still validated with unchanged contract, provider/model, approved research digest, checklist and AI-ledger rules.
- Matching mutation prerequisite runs inside the existing trusted command transaction. No nested transaction, schema change, new model call, live attestation or provider dispatch added.
- Existing visibility-aware single-flight refresh untouched.
- VI/EN copy and existing restrained typography/MathText/KaTeX reused, no decorative mathematical score.

## Builder checks

- Final focused unit run: 33/33 tests, four files, 899 ms. Includes 23 new dossier assertions plus 10 unchanged legacy presentation selector regressions.
- Later approved dispatch-copy check: 2/2 tests, one file, 137 ms. This is a separate focused run, not an overlapping full-suite count.
- Contractor's final isolated connected integration run: 12/12 PASS across two files (eight existing Math Pilot cases plus all four C dossier scenarios), 73.48 s, started 17:04:01 +07. C's four scenarios all passed within that run; no individual scenario duration was provided, and C did not execute the database run.
- Contractor accepted actual desktop/320px browser measurements and client navigation between 20 and six summaries: exact selected case retained, one full detail, both calibration passes preserved and no measured horizontal overflow. This was before the later copy-only text correction; final screenshot reload remains Contractor-owned.
- Full repository typecheck: PASS at C checkpoint; concurrent builders' later edits require Contractor frozen rerun.
- Scoped ESLint: PASS, zero warnings/errors at C checkpoint.
- `git diff --check`: PASS at C checkpoint.
- Four isolated integration scenarios are prepared, not reported executed by C: 30-case deterministic pagination/off-page/cross-tenant reads; 501 newer pending calibration records with older valid evidence and actual request gate; 200 newer corrupted plausible candidates with UI and mutation failclosed cap; seven terminal STOPPED/NO_GAP campaign histories, each with two nonempty hash-linked events, with three full-chain pagination and direct cross-case denial. Synthetic retained test assessments are labeled as fixtures, not live human/model attestations.
- No database migration, paid API, source network fetch, worker/provider/model startup, live ledger mutation, Git write, push or deployment by C.

## Failures and repairs

- Initial unit loader mock imported real authentication/environment: added explicit module boundary mocks. No production auth weakened.
- TypeScript loop-inference cycle: typed tuple endpoint, keeping strict typed query/results. Redundant unreachable includeJobs checks removed after ternary skip.
- Initial fixture digest input contained unused question/scope fields: repaired to actual `researchDossierDigest` sources/findings contract.
- Contractor's first guarded connected integration run exposed a synthetic command fixture missing `completedAt` for its `SUCCEEDED` state (`command_record_outcome_shape`, PostgreSQL 23514). All four new tests stopped at fixture setup. Repaired fixture to the actual command-runtime terminal shape: non-null completion timestamp, research-request-shaped run outcome and canonical payload hash. No database constraint or product permission was weakened. The final Contractor-owned database rerun subsequently passed all four C scenarios.
- Next connected dossier-only rerun passed three scenarios and rejected the final fixture's seven simultaneously QUEUED cycles at the one-active-root partial unique index. Replaced impossible active histories with seven synthetic terminal STOPPED/NO_GAP histories and explicit terminal fixture jobs, with two correctly linked, schema-valid, nonempty PRIOR_ART/STOPPED events each. Assertions now require full events and exact returned payloads, strengthening complete-chain coverage. No index, immutability or product authority was weakened; these fixture jobs are labeled non-live and never executed by a worker.
- Existing render-time two-gate computation was a discovery/factorization operation, not retained cycle evidence. Removed rather than synthesizing an authoritative result on read.
- Contractor browser checks found three review-stage grid tracks with a min-content floor overflowing at 320px. Repaired with an explicit zero-minimum single-column track and `min-w-0` sections/round containers. Contractor remeasurement: document width 320 and no sections extending right beyond 321.
- Actual client navigation from 20 summaries to six older summaries reset the uncontrolled case selector while retaining the correct off-page detail. Keyed the native select by authoritative selected case plus summary cursor; Contractor re-clicked pagination and observed the correct selected ID persist with one detailed case.
- Approval H02 activity refinement: calibration-card pending controls previously read the selected one-case body list. Replaced with two ID-only `findFirst` metadata lookups, one for each type, scoped to exact mission/workspace/organization/provider/model and unchanged active statuses. Added query/authorization unit coverage.
- Contractor's final screenshot exposed legacy dispatch-lock copy that demanded an independent human reviewer for AI-native dispatch. Only the VI/EN lock text was aligned with the existing separated AI review workflow and approved resource envelope. Separate human acceptance/novelty gates and formal-certification cautions remain unchanged; two copy tests cover this distinction.

## Deferred limits

The existing `validateMathCycleTrace` COMPUTED path still calls bounded `surveyResidualInterval` as an integrity recomputation. C did NOT weaken, replace, cache or truncate that legacy validation. Selected-cycle bounds reduce unrelated history work but do not establish a universal no-enumeration read path, latency SLO, CDP recovery or browser responsiveness certification. This cost remains a disclosed optimization obligation.

No source/model/tool/Python/Lean execution is newly dispatched by these dossier reads. Bounded exact identity checks of already retained integer tuples remain static integrity checks, not discovery. Live visible UI acceptance, mobile checks, full frozen unit/integration/build and independent adversarial acceptance belong to Contractor. No scientific capability gain, new theorem or root breakthrough is established by pagination or a graph panel.
