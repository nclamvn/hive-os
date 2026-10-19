# COMPLETION REPORT — TIP-102 bounded Builder repair

**STATUS:** DONE for the scoped code repairs; Contractor owns broader validation,
build, Git inventory, checkpoint and push.

## Files changed

- `next.config.ts`: the three existing engineering QA profiles and the new
  maintenance-only `LOCAL_QA` profile reuse one `.next-build`; ordinary
  development/production still use `.next`. Existing
  thirteen exact tracing exclusions and profile names are unchanged.
- `.gitignore`: ignore local `.pnpm-store`, reusable/legacy `.next-*` generated
  outputs, Python bytecode/cache. Research artifacts are not blanket-ignored.
- `tsconfig.json`: include reusable build type outputs, remove legacy per-TIP
  generated-type includes; exclude stale per-TIP outputs and local pnpm store.
- Six active `scripts/test/build-tip{076,079,080}.mjs` and
  `start-tip{076,079,080}-standalone.mjs`: align their output routing with the
  reusable build directory. The preceding source hash, trace, environment,
  database, storage and packaging authority checks remain in place. Old profile
  markers are invalidated before helper builds; successful trace admission writes
  the helper's fixed profile marker. Package-only and launch paths refuse missing,
  wrong, nonregular, oversized or symlinked markers before server evaluation.
- `postcss.config.mjs`: maintenance `LOCAL_QA` scans the same exact `src` candidate
  root as the retained TIP079/080 profiles, avoiding dependency/evidence scanning.
- `src/server/kakeya-dossier.ts`: parse JSON as `unknown`; explicitly validate
  presentation summary roots, inventory counts and displayed singular-record
  fields; project only validated UI fields. Existing fourteen SHA-256 pins,
  allowlisted selectors, authorization and dev/test-only scope are unchanged.
- `tests/unit/build-hygiene.test.ts`: regression coverage for reusable paths,
  default profiles, retained source checks and ignored cache outputs.
- `tests/unit/kakeya-dossier.test.ts`: malformed roots, out-of-range and incorrect
  singular records, and projection regression cases.
- Existing QA config test expectations now assert `.next-build` rather than the
  retired per-TIP active output routing.
- `scripts/build/standalone-paths.mjs`, `scrub-standalone-env.mjs` and
  `prepare-standalone-assets.mjs`: profile-aware post-build packaging, verified
  against the selected generated manifest/server. Missing or mismatched output
  now fails loudly; env files are removed recursively within the chosen artifact
  without following symlink directories. Static assets use the chosen distDir,
  and symlinked destinations are refused before recursive replacement.
- `tests/unit/standalone-packaging.test.ts`: nine tiny owned synthetic fixtures
  exercise profile selection, nested env scrubbing, output mismatch/missing
  refusal, symlink containment and correct static destinations without a build.
- Removed exactly the untracked generated `pnpm-workspace.yaml` placeholder.
  Active application/scripts/tests/CI contain no reference to it; canonical npm
  installation uses tracked `package-lock.json`, and no pnpm lockfile is present.
  It contained invalid nonboolean build permission placeholders, not a usable
  project configuration. No package/dependency or build config was changed here.
- `src/app/layout.tsx`, new `src/app/fonts.css`, and `public/fonts/hive/`: replace
  build-time Google font fetching with the exact retained 22 WOFF2 assets
  (317,468 bytes), untouched binary copies. Keep all 36 normal-weight subset faces,
  original Unicode ranges/weights/swap, two fallback faces with original metrics,
  semantic variables/body classes and the eight Latin/Vietnamese preloads.
  Full OFL notices and asset hashes/provenance are shipped alongside the fonts.
- New `tests/unit/offline-fonts.test.ts` and one existing design-token assertion:
  test font bytes, retained families/ranges/weights/metrics, licenses and preload
  selection rather than the retired Google-import spelling.
- `.gitattributes`: explicitly mark retained PDF/bin/font/image assets as binary
  so Git preserves their bytes and does not misclassify evidence as text for diff
  whitespace checks. Removed only the newly introduced extra EOF blank from
  `src/app/fonts.css`; no digest-bound historical evidence was normalized.

The previous PostCSS working-directory path fix remains intact. Frozen TIP081 inventories,
snapshot source and historical certificates retain their original paths.

## Acceptance / test results

- Final focused unit tests after offline font repair: **109/109 PASS**, seven
  files, 1.07 seconds. Includes mocked marker acceptance/refusal tests, nine
  packaging fixture cases, retained-font tests and existing design-token tests;
  no server is run.
- Scoped ESLint: **PASS**, zero errors, covering config, K5 loader/tests and the
  six active helpers.
- All six helper `node --check` syntax checks and repository `git diff --check`:
  **PASS**.
- Additional packaging helper/script/tests ESLint and all three packaging
  `node --check` syntax checks: **PASS**.
- Font/layout/design-token scoped ESLint: **PASS**. Fontkit read-only cmap audit
  of vendored files: all 104 checked Vietnamese codepoints present for both
  families at each 400/500/600 weight. No fontkit installation was required.
- First focused run: **64 pass / 1 fail** because a new metadata regression test
  assumed TIP076 used the same hash-check spelling as TIP079/080. The code already
  retained its original SHA-256 check; the assertion was corrected to the actual
  TIP076 check and the full focused set rerun successfully.
- Font rerun first found an existing design-token assertion tied to Google import
  spelling. It was updated to assert actual retained family CSS; an intermediate
  undefined test-path variable was corrected, then the complete 109 tests rerun
  successfully. These failures were test-maintenance defects, not suppressed.
- No Builder build, dependency installation, scientific replay, database write,
  staging or commit was performed. Repository-wide checks/build are reported by
  the Contractor separately, not implied by these focused results.

## Issues discovered / handoff

- Existing reviewed source-bundle manifests pin the changed config/helper bytes.
  They intentionally **fail closed on drift** and were not reissued. Old builds
  and scientific execution grants do not become valid because output routing
  changed. This task does not authorize a replacement scientific run.
- Reusing one directory requires serial builds. The former per-TIP directory names
  also distinguished launch profiles; Contractor approved and Builder added a
  small fixed profile marker to retain that refusal boundary. `LOCAL_QA` builds
  do not produce a historical helper marker or supply historical source authority.
- Historical TIP076 temporary-storage allocation and TIP079/080 fixed old scratch
  roots were not modernized or granted new execution authority during maintenance.

## Deviations / decisions

- Contractor explicitly approved extension from config-only routing to the six
  active helpers to avoid leaving them pointing at nonexistent new build outputs.
- Contractor explicitly approved marker matching and maintenance `LOCAL_QA` after
  the shared-directory authority issue was reported. These are engineering-only
  changes, not replacement execution grants or reissued source-bundle approvals.
- Contractor found and authorized repair of the two ordinary post-build scripts:
  their hardcoded `.next` path would otherwise scrub/copy the wrong output during
  a `LOCAL_QA` build. Local Next implementation copies loaded env files at paths
  relative to the tracing root, which can be nested; recursive no-symlink scrub
  handles that layout without deleting external targets.
- After Contractor's maintenance build could not fetch Google fonts, Builder first
  diagnosed exact cached font bytes/families/weights/VI coverage and reported
  before editing. Contractor authorized narrow offline vendoring. Plain local CSS
  preserves per-face Unicode ranges that a naive multiple-subset `next/font/local`
  array would not express; no font transformation, mock response, substitute
  font, new dependency or framework was introduced. Inter metadata is v4.001
  git-66647c0bb (variable wght100–900), Plex Mono v2.3 (static400/500/600).
  Primary complete OFL notices were read from:
  `https://raw.githubusercontent.com/rsms/inter/master/LICENSE.txt` and
  `https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/OFL.txt`.
  Cached original gstatic URLs were not retained; provenance states that limit.
- Contractor separately authorized removal of the unused pnpm placeholder after
  verification; no other user files or dependency store were removed.

Removed pnpm placeholder content, retained here for recovery if ever needed:

```yaml
allowBuilds:
  '@prisma/engines': set this to true or false
  esbuild: set this to true or false
  prisma: set this to true or false
  sharp: set this to true or false
  unrs-resolver: set this to true or false
```
- Frozen historical TIP081 path references remain unchanged; replacing them would
  erase snapshot context and invalidate more evidence rather than clean live code.
- Minimal record guards were used for K5 UI parsing, not a new schema framework or
  registry. Parsing and tests do not claim mathematical verification or novelty.

## Cleanup and suggestions

- Builder allocated no project copy, dependency store, build output or Docker
  image. Packaging tests created nine fixture cases per run in tiny directories
  named `codex-tmp-standalone-20261010-*` under the system temporary folder; every
  rerun removed its fixtures, and no matching directory remains. Only synthetic
  fixture files were deleted; existing
  research evidence and user artifacts are preserved.
- The unused generated `pnpm-workspace.yaml` placeholder was also removed;
  its complete contents are retained above and can be restored if necessary.
- Contractor should run repository types/full checks after these edits, inspect
  secret/large-object staging, and report any baseline failures honestly before
  the authorized commit/push.
