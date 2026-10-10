# TIP-102 QA debt repair — Builder completion

**STATUS: DONE with explicitly deferred historical fixture debt.**
Engineering maintenance only; this report is not mathematical acceptance or a
new runtime/build authorization. Contractor decides checkpoint readiness.

## Files changed

- `eslint.config.mjs`: ignore the six exact emitted/vendored TypeScript grammar
  candidate files, reusable `.next-*` outputs, package-manager store and nested
  dependencies. Handwritten `src`, `scripts/test`, tests and any newly added
  generated-directory handwritten controls remain linted.
- `scripts/test/check-private-summary-tip081-p3.r3.mjs`: close the missing
  `appendLiteral` call parenthesis; rename a VM temporary `module` to
  `syntaxModule` to avoid the Next reserved-module-variable rule. No VM linking,
  evaluation, import or execution authority added.
- `tests/unit/private-summary-tip081-p3.r3.d.ts`: replace unrestricted `Function`
  with `(...args: never[]) => unknown` at the existing Reflect.apply seam.
- `tests/unit/codebase-hygiene.test.ts`: four regression tests for lint coverage,
  emitted-output exclusions, native syntax-only checking, and explicit refusal
  of frozen TIP081 configuration authority against the current live config.

## Verification

- Before: machine-readable full ESLint scan, 1,074 files, **6,014 errors and
  9,690 warnings**. Six emitted candidates accounted for 6,012 errors and 9,650
  warnings. Handwritten errors were the missing parenthesis and unsafe Function
  type; fixing syntax exposed the reserved local `module` variable.
- After: full ESLint scan, 1,069 files, **0 errors, 41 warnings, 0 fatal errors**.
  Of the warnings, one is anonymous default export, 40 are unused variables.
  This includes the VM temporary retained by the narrow repair. Historical
  research helpers have not been deleted or their lint rules disabled.
- `node --check scripts/test/check-private-summary-tip081-p3.r3.mjs`: PASS.
- New focused hygiene suite: **4/4 PASS** (1.16 seconds).
- Scoped archived P3R3 typecheck: **156 diagnostics**, FAIL. A compiler-host
  in-memory comparison against its prior `Function` declaration also has exactly
  156 diagnostics; **0 newly introduced diagnostics**. No files were restored
  temporarily or type assertions weakened to disguise this baseline.
- Existing runtime package suite after reusable config repair: **43/54 PASS,
  11 FAIL**, 697 milliseconds. Nine C1/C4/CF fixtures reject stale original
  config during setup; T1-02/T1-04 also reject copies of live config against the
  immutable original digest. Positive assertions and production pins unchanged.

## Historical fixture debt and decision

The old runtime helper is intentionally bound to fixed `/Users/os/hiveos` source
and the original config SHA `ca474b237f02029949d58aa917bc9d6591072df75a365f5b735cf07338d849f0`.
Its current setup failure is expected authority rejection, not permission to
promote the new config into old approval. No matching original bytes were found
in the four committed Next config revisions or existing TIP081 shadow fixtures.
The source-bundle receipts retain hashes, not a usable original config snapshot.

Contractor approved preserving the eleven existing positive scenarios and
immutable pins, adding a separate stale-authority regression, and reporting
these failures rather than skipping tests, rebasing pins or inventing originals.
Future repair should recover a provenance-bound historical snapshot and isolate
fixture preparation from mutable live source without expanding execution grants.

## Cleanup and scope

No dependencies installed, whole-project scratch copies, new build directories,
database changes, app build, mathematical replay, model/provider calls or Git
operations. Five owned machine-readable ESLint temporary reports (~19 MiB) are
removed after extracting the above summary. Temporary tiny test roots are
removed by the existing afterEach cleanup; no unrelated historical roots deleted.

Acceptance: concrete syntax and lint-scope repairs PASS; current-source stale
authority rejection PASS; historical positive config fixture/type debt remains
visible and deferred. Do not describe the whole repository as zero-debt/green.

## Follow-up: selected LRC page fixture isolation

The broad unit run exposed 37 failing assertions across three synthetic page
fixtures: `math-lrc-research-cockpit-page.test.ts`,
`math-lrc-loop-readiness-page.test.ts`, and
`math-lrc-proof-unit-run-page.test.ts`. All three already mocked `next/link`,
so changing Link would not have repaired the failure. Actual cause: the parent
page now nests the unrelated async server components ResearchCampaignRegion and
Poly19ShowcaseRegion. Legacy `renderToStaticMarkup` rejects Promise-returning
children even when an inactive child returns without I/O.

Contractor approved synchronous null mocks for only those unrelated regions in
only the three synthetic page fixtures. The selected LRC panels, authorization,
family admission, scope, no-write/no-poll and HTML assertions remain unchanged;
production code and existing Link mocks untouched. Actual async regions retain
their independently awaited-region tests.

Verified the three repaired page suites together with `research-campaign-ui`
and `poly19-showcase-ui-boundaries`: **80/80 tests PASS, 5 files, 2.86 seconds**.
This repairs the synchronous fixture boundary, not actual React server-rendering
behavior, and does not manufacture E2E or mathematical acceptance.

## Final bounded serial retained-fixture validation

The initial broad unit run had failed seven assertions in five heavy LRC
frontier/unit report and replay suites while sharing CPU with many workers.
Contractor requested a serial check of these failures with **unchanged fixture
limits and deadlines**, total wall-time no more than 400 seconds. No collector,
report write, source-pin repair, new mathematical campaign or approval reissue.

- `math-lrc-frontier-report.test.ts` and `math-lrc-unit-report.test.ts`, full
  suites, `--fileParallelism=false --maxWorkers=1`: **40/40 PASS**, 2 files,
  132.16 seconds. Both actual retained checkpoint admissions now pass.
- The three remaining suites used Contractor's exact relevant name filter to
  keep total work bounded: `math-lrc-frontier.test.ts`,
  `math-lrc-frontier-replay.test.ts`, `math-lrc-unit-replay.test.ts`.
  **5/5 selected tests PASS**, 3 files, 85.47 seconds; **44 unselected tests**
  explicitly filtered, not changed or silently passed.
- Selected coverage: rehashed child false-proof/count/domain rejection; both
  checked frontier literal sources; source-drift refusal; timeout/disagreement
  refusal; all three pinned unit sources with exact transport after composition.
- Started 10:54:20 UTC, all results collected by 10:58:52 UTC: **272 seconds**
  including investigation/command overhead, below the 400-second ceiling.
  Two briefly started broad/parallel commands were cancelled before results to
  enforce serial execution and the narrowed filter; no result from either
  cancelled attempt is counted toward the 45 passes.

The prior seven failures did not reproduce in this serial scope. This supports
CPU-contention-sensitive test deadlines as the observed distinction; it does
not establish a universal cause, make the initial broad run green, or remove
the remaining legacy configuration/type debt. No test code or deadline changes
were made during this follow-up. Source and certificate pins remain untouched.
