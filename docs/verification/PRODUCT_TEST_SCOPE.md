# Product regression and historical source contracts

Status on 2026-10-13: **historical source-contract checks are not satisfied by
the current checkout**. They are not repaired, waived, or counted as passing.
Current product verification and historical campaign reproduction are different
claims. A product regression pass does not renew a research execution grant or
establish historical reproducibility.

## Commands

- `npm run test:unit`: current product regression, including behavioral guards
  in the five mixed files below. Exactly 19 source-contract cases are deselected;
  the single one-shot P3 capture file is excluded before its hooks can execute.
- `npm run test:archive`: historical cases and the one-shot P3 capture suite, with
  original assertions intact. A nonzero exit remains a failure; this command does
  not reseal hashes. **Do not run the P3 capture without a separately qualified
  historical replay plan:** its source authority remains unissued, and its fixed
  write-once observation output already exists. This is not a safe repeatable
  release check, and previous observations must not be deleted to make it run.
- `npm run test:unit:all`: unfiltered unit baseline, including all historical
  cases. Direct Vitest invocation without `HIVE_TEST_SCOPE` also remains unfiltered.
- `npm run test:integration`: unchanged.

The mixed-file partition in `vitest.config.ts` matches complete test names. It
does **not** exclude their other tests or all tests mentioning TIP081. The only
whole-file exclusion is the explicitly listed one-shot P3 capture. An invalid
scope fails configuration loading. Explicit Vitest CLI test-name filters can
override normal selection; such targeted runs are not the complete product suite.

Product unit files run serially by default. Exact replay tests include fixed
wall-clock ceilings and subprocess checks; parallel CPU-heavy files caused
deadline failures even without a concurrent build. Serial scheduling preserves
the existing assertions, mathematical scope, runtime caps and test timeouts.
It is not an exclusion of slow tests or a relaxation of acceptance criteria.

## Exact historical selections

| File | Selected cases | Why they require historical inputs |
| --- | --- | --- |
| `tests/unit/evidence-studio-source-boundary.test.ts` | `keeps all 78 old080 source pins plus review exact` | Requires the original TIP080 working-tree byte hashes, not an evolving application. The other read-only boundary tests remain in product regression. |
| `tests/unit/evidence-studio-compiler.test.ts` | `preserves exact original bytes and emits separately pinned deterministic provenance`; `refuses repeated overlay creation and complete known config collisions`; `refuses overlay and provenance tamper` | Each success setup copies the present config into a fixture whose archived helper requires original SHA-256 `ca474b237f02029949d58aa917bc9d6591072df75a365f5b735cf07338d849f0`. Other synthetic option, refusal, and serialization cases remain active. |
| `tests/unit/evidence-studio-runtime-package.test.ts` | `T1-02`, `T1-04`; `C1-01` through `C1-06`; `C4-01`, `C4-02`; `CF-08` | Require successful construction of the same pinned original-config fixture or the original four-input config proof. All other runtime path, resource, ownership, integrity, hook, and environment guards remain active. |
| `tests/unit/research-rational-interval-floor-v3.test.ts` | `pins entire frozen generic/QA manifest without any core edit` | Requires the pre-extension TIP076 R3 source/presentation snapshot. All exact rational arithmetic, invalid-candidate, resource, and authority tests remain active. |
| `tests/unit/permutation-bridge.test.ts` | `profile TIP076_QA preserves existingroutes and exactQA tracing boundary`; same case for `TIP079_QA` and `TIP080_QA` | This pinned TIP080 source asserts the superseded per-TIP output directories. Current approved disk hygiene uses one `.next-build`. Replacement product coverage in `current-build-profiles.test.ts` verifies all four isolated profiles, ordinary/unknown profiles, exact tracing exclusions, fonts and PostCSS scope. Other bridge tests stay active. |
| `tests/unit/private-summary-tip081-p3.test.ts` | Entire one-shot P3 synthetic capture suite, including root hooks | Its admission tuples are deliberately `NOT_ISSUED`, and `afterAll` writes `TIP-081A_P3_UNIT_RAW_OBSERVATIONS.json` using `wx`. The source is preserved by `TIP-081A_P3_FIRST_SOURCE_CUT.json`. This is an unfinished historical experiment, not a repeatable product regression; `ALLOCATION_COVERAGE_OPEN` and existing-output refusal remain unresolved. |

No historical test, helper, review, or manifest was edited for this partition.
The TIP081 test sources themselves are included in a frozen manifest; altering
their expectations would create further drift rather than restore evidence.

## Known reproducibility debt

The inspection before partition found 11 mismatched TIP080 source paths and 7
mismatched TIP076 R3 paths. These include evolved shell/pages, schema/role SQL,
build scripts and Next.js configuration. The live checkout is not the original
campaign snapshot. Recovering exact input bytes and a compatible toolchain is
required before claiming replay; changing expected hashes is not a repair.

Some archived compiler/harness tests also lack temporary-fixture cleanup. Do not
bulk-delete old temporary directories or copy the project to reproduce them.
This partition does not resolve that separate historical harness debt.

## Partition verification

Read-only Vitest collection of the six historical-containing files plus the new
current-build-profile suite gives 222 cases: 168 product and 54 historical,
with exact name sets disjoint and exhaustive. The historical count is 19
individual cases plus 35 collected tests in the one-shot P3 file. No one-shot
hooks were executed by this collection check.

Invalid scope selection fails with exit code 1. Scoped product execution of
source-boundary and rational-interval suites: 46 passed, exactly 2 historical
cases deselected. Runtime-package: 43 passed, exactly 11 historical deselected;
its owned temporary fixtures were cleaned by existing test hooks. Current build
profiles and permutation bridge: 71 passed, exactly 3 historical deselected.
The current Contractor inventory was mechanically refreshed (240 entries);
its integrity test passed. Founding and research manifests were not resealed.
These are scoped checks, not a claim that the full
product suite, historical replay, build, or release has passed.
