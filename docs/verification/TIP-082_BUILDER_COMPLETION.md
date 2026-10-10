# TIP-082 Builder completion

2026-10-09 · LEAN_RESEARCH_DEVELOPMENT_082 · ENGINEERING.
Status: PARTIAL — initial focused check passes; standalone replay launch blocked.

## Changes

package.json adds only research:check and research:replay. New source:
scripts/research/check.mjs (three fixed fail-fast stages),
scripts/research/replay.ts (existing arithmetic-checker synthetic replay),
tsconfig.research.json (strict/noEmit/checkJs actual source and imports),
vitest.research.config.ts (envDir:false/no setup/two explicit test files), and
tests/unit/research-development.test.ts (eight orchestration/replay controls).
No product checker, frozen R3/P51/configuration, live source/auth/lease gate,
existing test, dependency, build directory or protected data changed.

## Initial authorized validation — no repair/retry

One `npm run research:check` exited0:

| Stage | Result | Elapsed |
|---|---|---:|
| Node syntax | PASS |31.2ms|
| Focused strict TypeScript | PASS, zero diagnostics |2065.6ms|
| Focused Vitest | PASS,2files/59tests |848.4ms|
| Check invocation's internal clock | complete |2946.6ms|

Vitest reports503ms, setup0ms, existing hostile/wrong-answer/exhaustive controls
plus eight new controls. Mocked child failures/timeouts test the actual exported
orchestration; no deliberately failed validation subprocess was launched.
Type scope includes the actual replay/checker/contracts/bounded JSON and
execution-fabric dependencies, not whole app/UI/DB/generated/R3 source. No source
error suppressions, any facade, synthetic source replacement or noCheck.

One `npm run research:replay`, enclosed by an explicit120000ms spawn timeout,
exited1 after187.8ms. Installed tsx CLI attempted native IPC listen at its
temporary named pipe and received EPERM before invoking the replay/checker.
This is an environment/CLI startup failure, not an arithmetic mismatch. No
arithmetic replay stdout result or standalone replay PASS is claimed. The
wrapper retained Nodev24.14.1 and the raw EPERM stack in the tool output.

Known measured inner check+replay wrapper elapsed sum3134.4ms is not an exact
aggregate subprocess/outer npm wall-time certificate; command launch overhead
is additional. Both completed far below120s; Builder performed only the two
authorized initial commands, within the<=240s allocation of shared600s.

## Acceptance and stop

AC1 PASS (ordering, syntax/type failure and timeout controls).
AC2 PASS (actual focused strict types).
AC3 PASS (existing controls executed).
AC4 PARTIAL: unit tests recompute exact known public floor499999999972 and
strict rational bounds, reject tampered answer, preserve non-formal/no-official-
score labels; standalone replay launch did not reach its output.
AC5 source implementation complete; discoverable commands are added, Main's
direction document/non-own review and final acceptance remain separate.

Suggested narrow repair for Main approval: use installed `node --import tsx`
loader for the replay instead of tsx CLI's IPC-launch path. No implementation or
retry of that suggestion has occurred. Stop before repair pending Main's single
repair/validation routing. No build/install/DB/API/env/R3/import/derivation/Git
campaign work, scratch copies or new distDir. No cleanup/deletions performed.

Standard developer-slice success is not theorem/proof/novelty/fresh-model/official
score acceptance, hostile-host sandboxing or live source authority. R3 remains
DEFERRED_UNACCEPTED with its frozen first-failure history untouched. Vibecode
was applied as one bounded implementation/report; no source-only certificate
stack or new workflow framework was introduced.

## Main-authorized single repair — source only, no rerun

Main authorized the ordinary TIP-082 developer repair after the preserved first
EPERM result. package.json alone changes research:replay from
`tsx scripts/research/replay.ts` to
`node --import tsx scripts/research/replay.ts`. The checker, replay source,
configurations, test semantics and frozen R3 files remain unchanged. The import
loader path avoids using the tsx CLI entrypoint; whether it actually launches
successfully remains UNRUN by Builder. Main owns the final combined check/replay
within the shared600s envelope, each command<=120s. No further Builder command,
hash, test, import or arithmetic replay was executed after repair.

Exact initial command1: `npm run research:check`. Its measured internal whole
pipeline duration was2946.6ms; stage sum2945.2ms. Full enclosing npm command
duration was NOT_CAPTURED, so tool polling/wait durations are not relabelled as
that missing clock. Exact initial command2:

```sh
node --input-type=module -e 'import {spawnSync} from "node:child_process"; import {performance} from "node:perf_hooks"; const started=performance.now(); const result=spawnSync("npm",["run","research:replay"],{stdio:"inherit",timeout:120000,killSignal:"SIGKILL"}); console.log(`replay command elapsed ${(performance.now()-started).toFixed(1)}ms`); if(result.error) console.error(result.error.message); process.exitCode=result.status===0&&!result.error?0:1;'
```

Command2's enclosing spawn clock measured187.8ms. Total captured check-internal
plus replay-enclosing time is3134.4ms; exact aggregate actual subprocess time is
NOT_CAPTURED because command1 npm-launch overhead lacks an enclosing clock.
Builder's two-command maximum allocation is240000ms (not claimed as measured
elapsed); no third command or repaired rerun was spent. Main may conservatively
retain that allocation in shared-envelope accounting rather than infer missing
precision. Final status remains PARTIAL pending Main's actual final validation
and non-own review. All arithmetic outputs remain engineering-only, not proof.

Count correction from Main's actual source review: the earlier prose "eight new
controls" is incorrect and retained above as report history, not a new observed
denominator. Actual new controls are SEVEN: order1 + failing-stage each2 + native
timeout1 + overall-deadline1 + replay2. Existing checker52 + new7 = observed59.
No test/source change or additional execution accompanies this correction.

## Main actual final-batch failure and explicit ESM/smoke repair

Main's next actual check again passed: syntax33.7ms/types2161.1ms/tests775.9ms,
internal total2972.4ms,59tests PASS. Main measured enclosing check3160.298375ms.
The repaired loader command still failed BEFORE checker execution because the
`.ts` entrypoint was transformed as CommonJS with top-level await/import.meta;
Main's enclosing replay duration341.292666ms. Those two Main enclosing durations
sum3501.591041ms. Both distinct real failures remain preserved; passing unit
imports/types did not establish standalone entrypoint health.

Main amended TIP-082 and the active checkpoint to retire ONLY its self-imposed
one-repair restriction for this ordinary developer lane inside the unchanged
600s aggregate/120s-invocation envelope. No R3 condition/grant was revised.

Current source-only repair:

- apply_patch moves scripts/research/replay.ts to explicit ESM replay.mts;
- package script and focused type/test imports name that exact .mts source;
  allowImportingTsExtensions is enabled only with the existing noEmit config;
- research:check adds actual `node --import tsx scripts/research/replay.mts`
  as its FOURTH/final stage, using the same remaining absolute120s budget;
- replay prints its existing labelled full JSON plus a completion line only
  after arithmetic support; smoke bounds captured stdout/stderr at1MiB, displays
  them and requires actual labelled result/status/derivedFloor plus completion,
  not empty exit0. It adds no parser, workflow/capture framework or authority;
- tests cover all four failing stages, signalled exit, empty successful CLI,
  original timeout/deadline/order and arithmetic/mismatch controls. Prospective
  new control count11 plus existing52 gives63, NOT an executed result.

Only new lean source/config/test references and this report changed. Product
checker/candidate semantics, mathematical bounds and all frozen R3 predecessors
are untouched. No Builder validation after either repair: current .mts/smoke
syntax/type/tests/CLI outcomes are UNRUN by Builder. Main owns actual final
combined check plus standalone replay and non-own review. Current status remains
PARTIAL until those observations exist; exact original Builder aggregate remains
unavailable as disclosed above, not retroactively inferred from later timings.
