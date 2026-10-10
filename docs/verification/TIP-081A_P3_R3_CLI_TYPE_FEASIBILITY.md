# TIP-081A P3 R3 — CLI and focused typing feasibility

Status: SOURCE_ONLY_PARTIAL / EFFECT_DISPATCH_STOP. This is the single initial
named-source review, not CLI closure, a check result, a reservation, or an A/B
execution grant. Milestone remains P3_SYNTHETIC_PRIVATE_SUMMARY_REPLAY. All205
rows remain UNRUN; runtime0/8, compileOFF, tuplesNOT_ISSUED and prior open gates
are unchanged.

## 1. Scope and method

Read the current user AGENTS/disk rules, Vibecode Kit skill and report reference,
research protocol, active commitment/latest handoff checkpoint, complete R3
acceptance plan and TOOL_PRECODE, and parser/full205 completion checkpoint.

Installed source read completely: `node_modules/eslint/bin/eslint.js`,
`node_modules/eslint/package.json`, `node_modules/eslint/lib/cli.js`,
`node_modules/typescript/bin/tsc`, `node_modules/typescript/package.json`, and
`node_modules/typescript/lib/tsc.js`. The latter two direct entry references
authorize tracing into `lib/cli.js` and `lib/_tsc.js` respectively. `_tsc.js` was
scanned by fixed-file rg and selected source ranges; its entire approximately
134000-line bundle was NOT read. Installed source versions observed in manifests
are ESLint9.39.5 and TypeScript5.9.3, not a fresh pin or preservation MATCH.

No other installed file was read. No CLI/help/program, import, hash, parser,
generator, test, census, dependency install, tree scan, Git/network, or protected
source access occurred. Only this report is written. No scratch/output/build
directory was created; there is nothing to remove. No large build/copy/install
or Docker action is in scope.

## 2. ESLint: direct evidence and remaining closure

| Named source | Established fact | Required consequence |
|---|---|---|
| bin/eslint.js:12–15 | Calls node:module enableCompileCache at bootstrap | A fixed child environment must disable compile-cache writes; the supervisor/Node control is not proven by this source alone. |
| bin/eslint.js:149–170 | --init and --mcp launch npm/npx through cross-spawn | Both flags excluded; no initializer/package fetch is admissible. |
| bin/eslint.js:174–178 | Normal branch loads lib/cli; --stdin reads an accumulating stdin buffer | Fixed file arguments only; no stdin mode. |
| bin/eslint.js:71–81 | Error rendering can require a message file using error.messageTemplate | Failure-path module closure is required too, not merely the successful lint path. |
| lib/cli.js:218 | shouldUseFlatConfig is called before option parsing | --config alone does not prove flat/legacy branch selection; the implementation and fixed environment need review. |
| lib/cli.js:303 | --inspect-config launches npx inspector | Excluded. |
| lib/cli.js:408–414 | Non-off concurrency uses fromOptionsModule; off uses direct engine construction | Freeze --concurrency off, but unread engine dependencies still prevent a no-worker verdict. |
| lib/cli.js:428 | Normal file mode invokes engine.lintFiles | Filename/ignore/config/parser/rule import resolution is in the unread engine graph. |
| lib/cli.js:439–480 | Normal file mode checks default cwd eslint-suppressions.json and loads/applies it when present, even without suppression flags | --no-config-lookup alone cannot close ambient suppression discovery or prevent suppressed findings. |
| lib/cli.js:113–143,513 | Formatter loading can resolve a module; output-file mode creates directories/writes files | A named built-in formatter must be source-closed; no output-file/fix/cache/suppression-writing mode. |

The normal branch has no spawn in the reviewed bin/CLI statements when the
excluded flags are absent. This is NOT a claim that the transitive engine graph
has no workers, children, dynamic imports, or ambient reads. The manifest's
runtime dependency list is not an executed-import census. LegacyESLint is
required at module bootstrap even when the intended operation is flat config;
flat operation does not by itself eliminate all legacy bootstrap dependencies.

Proposed fixed lint semantics, pending implementation source proof: literal
new-hand-source filenames only, one literal plugin-free flat config, no ancestor
config lookup, concurrency off, no stdin/globs/fix/cache/output-file/init/mcp/
inspector/debug/print-config/env-info. Use a named reviewed built-in formatter
and retain raw diagnostics under the existing B collector. The config must
specify actual useful rules, not an empty ruleset or blanket ignores. The
automatic suppression route must be resolved explicitly before dispatch; do
not assume absence, read that ambient file now, create a shadow cwd, or silently
drop suppressed diagnostics. Installed parser imports needed by ESLint are TOOL
imports, not private-parser admission; their exact preservation/scope boundary
requires Main confirmation rather than an inferred exception.

## 3. TypeScript: direct evidence and remaining closure

The entry graph is bin/tsc → lib/tsc.js → lib/_tsc.js. The shim tries
enableCompileCache before loading the bundle. `_tsc.js` selected source shows
node:fs/path/os, optional crypto, conditional source-map-support in development,
a host dynamic require(modulePath), and inspector profiling. The words
child_process/worker_threads in the builtin-module-name table are not actual
child creation. The current scan finds no executed spawn/Worker site, but is
not a complete descendant proof.

Selected anchors:

- 4870–5080: Node system/bootstrap, filesystem/watch bindings, optional
  source-map-support, dynamic host require, profiler inspector.
- 131935–132310: explicit-project parsing, otherwise upward config discovery;
  watch, incremental, build and ordinary compilation branches.
- 133775–133817: debug/development bootstrap and executeCommandLine entry.
- 39907/40181: typeRoots selection and automatic ambient type discovery;
  explicit types[] prevents automatic type-directive enumeration.
- 11268 and 124012: default target-library selection and library replacement.

A fixed explicit project is necessary. No extends/references/build/watch/
incremental/composite/trace/profile/locale/init/help/version mode is intended.
noEmit prevents target emission but does not alone exclude compiler caches,
trace/profiling writes or ambient resolution. types:[], typeRoots:[], explicit
lib and libReplacement:false narrow those paths; their transitive declaration
and imported-module graph must still be enumerated. No application tsconfig,
Vite/Vitest worker graph or Next.js tree is needed by this focused check.

Proposed fixed environment controls: production NODE_ENV; no inherited
NODE_OPTIONS/NODE_PATH/NODE_COMPILE_CACHE/debug/inspector settings; an explicit
compile-cache disabling control such as NODE_DISABLE_COMPILE_CACHE=1. Exact
Node/supervisor semantics must be established before dispatch; this report
does not certify that an environment spelling alone eliminates all disk writes.

## 4. Meaningful focused type-proof contract

Freeze the following proof target, not a manufactured declarations-only echo:
TypeScript must check the actual new TOOL implementation and its call sites.
The fixed prospective checked-source roots are:

- tests/unit/private-summary-tip081-p3.r3.mjs
- scripts/test/admit-private-summary-tip081-p3.r3.mjs
- scripts/test/metadata-baseline-tip081-p3.r3.mjs
- scripts/test/boundary-expectations-tip081-p3.r3.mjs
- scripts/test/derive-private-summary-tip081-p3.r3.mjs
- scripts/test/capture-private-summary-tip081-p3.r3.mjs
- scripts/test/check-private-summary-tip081-p3.r3.mjs
- scripts/test/preserve-private-summary-tip081-p3.r3.mjs

These names define the prospective scope, not existence/import/pin verification.
Runtime/verifier/kernel String.raw containers can be additional checked roots,
but checking a string container does not type-check its embedded private body.
Their target syntax/source review and admission obligations remain separate.

The actual focused configuration must use allowJs/checkJs/noEmit and strict
checking, including noImplicitAny/strictNullChecks, literal files, empty ambient
types/typeRoots, one explicit standard library set, and no discovery/extends/
references. No noCheck, @ts-nocheck, @ts-ignore, blanket wildcard local-module
declaration, declaration shadow that substitutes for a checked .mjs source,
skip-based criterion, root any cast or replacement stub is an acceptable pass.
The original intended runner .d.ts may express contracts only in addition to,
not instead of, checking actual executable source.

Meaningful obligations include checked admission export arities/result shapes;
readonly context/domain/pin records; opaque foreign handles; metadata baseline
state and immutable initial-base witness; unknown JSON values narrowed by the
real scalar/schema guards; kernel wire/check seams; literal registry/status/
dependency-mask shapes; bounded FD/journal and first-fault cleanup state; and
supervisor launch/result contracts. Contract declarations cannot attest runtime
truth or issue T/tuple authority.

Current .mjs sources were not run through a type checker here. Unannotated
parameters, null-initialized mutable state, dynamic indexed records and native
module declarations require a bounded actual-source JSDoc/type contract route.
Source-only type-annotation authoring is a separate Main release with changed
source inventory/preservation; no annotation or config is authored by this task.
Native declarations must be closed and meaningful (unknown narrowed by guards,
not blanket any). Prefer a scoped actual @types/node declaration graph if it can
fit; a deliberately limited native facade needs explicit Main review and cannot
claim the complete Node API. TypeScript's own API declarations for the real
deriver must likewise be included, not hidden by a module echo.

## 5. Exact next source-scope request

No expansion is exercised by this report. Request Main's explicit next bounded
installed-source scope for these direct ESLint references:

1. node_modules/eslint/lib/eslint/index.js (candidate directory entry for
   require('./eslint'); exact resolution must be established, not guessed).
2. node_modules/eslint/lib/eslint/eslint.js
3. node_modules/eslint/lib/options.js
4. node_modules/eslint/lib/shared/logging.js
5. node_modules/eslint/lib/shared/runtime-info.js
6. node_modules/eslint/lib/shared/translate-cli-options.js
7. node_modules/eslint/lib/eslint/eslint-helpers.js
8. node_modules/eslint/lib/services/suppressions-service.js
9. node_modules/debug/package.json (only to identify the bare import entry).

Each newly exposed reference is then reported before further expansion; this is
not permission for a package/tree scan. Formatter/parser/config/error-message
modules and other bare dependencies remain unreviewed until their exact names
are revealed and explicitly admitted to source scope.

For actual-source typing request separately: node_modules/typescript/lib/
lib.es2022.d.ts, node_modules/typescript/lib/typescript.d.ts, and
node_modules/@types/node/package.json plus its declared entry when authorized.
Their references may reveal a substantial additional fixed declaration closure.
No declarations were read or newly hashed in this task. Any first-capture or
preservation rows required by the final graph must be added explicitly to the
fixed A/B whitelist and bounded I/O inventory; they are not cost-free inherited
pins. Existing historical pins remain DATA only until the authorized protocol
compares them.

## 6. Resource and dispatch verdict

The original plan is unchanged: A raw2500/three1000 allowances=5500; B raw10000
partition500precheck+350syntax+750lint+1200type+6500unit+500post+200settlement,
plus five1000 allowances=15000. Syntax is in-process, no child. The whole
proposed reservation is20500 within21440.727166, with940.727166 margin. It cannot
accommodate another1000 process allowance. No probes, --help, timing trials,
retry, process substitution or third preservation/hash helper are authorized.

The named graph does not yet prove that lint/type need only their two already
counted child processes. Their750/1200 wall-time feasibility is UNKNOWN, not a
source-measured fit claim. Future authorized checks must retain hard limits and
first-failure raw evidence; timeout means STOP, not relaxation or auto-rerun.

Concrete blockers before tool/source release and dispatch: unread ESLint engine
and failure-path closure; ambient suppression handling; final actual-source
typing/annotation/native-declaration closure; fixed CLI/environment/formatter
binding; expanded preservation and bounded native I/O/cost inventories. The
focused typing target is meaningful and source-authorable in principle, but no
pass or deadline fit is established. Continue only through Main's explicit
scoped source routing; A remains inert capture/derive → complete numerical and
emitted-source review → B precheck/target admission/checks, with no effect granted
by this source feasibility report.

## 7. Authorized named expansion — decisive frozen-condition blocker

Predecessor §§1–6 remain the initial review history, not silently rewritten.
Main authorized the nine §5 ESLint paths and the three declaration paths, then
the @types/node manifest's literal entry index.d.ts. Read all nine ESLint files
completely, both small manifests/entries and lib.es2022.d.ts completely. Scanned
the 11437-line typescript.d.ts for external references and read its namespace,
CompilerOptions, forEachChild/createSourceFile and export sections; did not claim
a complete declaration-semantic review. @types/node20.19.43's <=5.6 typesVersions
alternative does not select the ts5.6 tree for the named TypeScript5.9.3.

Main additionally authorized the exact linter/index.js bridge, the directly
referenced linter/linter.js, espree/package.json and its literal CommonJS entry
dist/espree.cjs. Read the bridge completely, linter top160 and Espree entry
top190 plus fixed-file require scans. No installed Acorn body was read/imported.

The following unconditional bootstrap chain is established, independently of
which parser the future config selects:

| Source anchor | Literal edge |
|---|---|
| node_modules/eslint/bin/eslint.js:174 | require('../lib/cli') |
| node_modules/eslint/lib/cli.js:27 | require('./eslint/eslint') |
| node_modules/eslint/lib/eslint/eslint.js:45 | require('./eslint-helpers') |
| node_modules/eslint/lib/eslint/eslint-helpers.js:20 | require('../linter') |
| node_modules/eslint/lib/linter/index.js:3 | require('./linter') |
| node_modules/eslint/lib/linter/linter.js:16 | require('espree') |
| node_modules/espree/package.json exports['.'] require | ./dist/espree.cjs |
| node_modules/espree/dist/espree.cjs:5 | require('acorn') |

The R3 acceptance plan preservation text at243–245 says: “no installed Acorn
import or broad dependency scan is permitted.” It has no B-lint exception.
TOOL_PRECODE's A-specific clarification is not authority to narrow that parent
condition. Thus the mandated installed ESLint CLI would import installed Acorn
before evaluating any custom-parser config or concurrency choice. --concurrency
off, --no-config-lookup or a custom parser cannot remove this edge. This is a
concrete incompatible frozen condition, not merely an incomplete inventory.

Verdict: SOURCE_ONLY_BLOCKED_FOR_FIXED_ESLINT_ROUTE / EFFECT_DISPATCH_STOP.
Main must obtain a direct Owner routing decision about the contradictory
requirements before lint-tool source authoring or A/B dispatch. This report
neither proposes an implicit exemption nor changes the lint criterion, CLI,
process graph, effect count or budget. Further dependency review is suspended
at this decision blocker; the names below record exposed edges, not automatic
permission to continue a broad tree review.

## 8. Expanded branch proof and concrete controls (design only)

The authorized class/helpers now prove the specific ESLint worker branch:
processOptions preserves concurrency='off'; calculateWorkerCount returns0 at
eslint.js:419–421; lintFiles takes lintFilesWithoutMultithreading. runWorkers is
therefore unreachable on this fixed branch. RuntimeInfo.environment is the
reviewed npm-spawn path; absence of --env-info excludes that function call, not
its cross-spawn bootstrap import. Neither fact certifies all unread modules.

shouldUseFlatConfig returns process.env.ESLINT_USE_FLAT_CONFIG !== 'false'; fixed
true closes its branch. Clear ESLINT_FLAGS because helpers:1346–1368 merge
ambient flags, which can change loader/TS-config selection. With no flags the
helpers choose LegacyConfigLoader: this is the legacy *flat config lookup*
class, not permission to use legacy .eslintrc configuration. Its exact fixed
config loading must still be checked in config-loader.js.

Options/translator confirm config-lookup Boolean, ignore Boolean, cache Boolean,
fix Boolean, concurrency off and output-file path. --output-file is path-valued:
do not invent a --no-output-file switch that may supply a filename or fail
option parsing; omit output-file altogether and reject it in the fixed argument
registry. No quiet/pass-on-no-patterns/no-warn-ignored skip route. Use maxWarnings0
and exact result-file membership to reject ignored/unconfigured/missing targets.
Disabling inline config prevents hand-source comments from changing the frozen
rules; comments that deliberately encode prototype/adversarial fixtures are not
a reason to drop substantive rules indiscriminately.

Two design-only private-path controls are needed if Owner resolves the lint
contradiction:

1. Suppressions: options.js exposes --suppressions-location; there is no
   suppression-disable option. cli.js:448–459 returns2 for a supplied absent
   file. Therefore use a new fixed create-only regular UTF8 file whose exact
   reviewed bytes are `{}` (two bytes), not an absent-file shortcut. A/B first
   capture/pins, no-follow/regular-file check, before-B exact-byte recheck and
   after-B preservation must include it. No trailing slash/directory target.
   getCacheFile then retains this exact file path. With suppress/prune flags
   excluded, load parses {}, applySuppressions cannot suppress any file; save
   is not called. This price includes the existing service's structuredClone
   of results and the full installed stringify dependency bootstrap, even
   though its save operation is unreachable. No file is created/read now.
2. Cache: --no-cache produces null lintResultCache, but eslint.js:999–1008 still
   unlinks cacheFilePath when it exists. Default .eslintcache is unsafe. Supply
   a distinct new literal --cache-location leaf with no trailing slash, proven
   absent before B and after B; no root/user cache deletion is authorized.
   Main must freeze both exact leaf names in the source/path inventory. Preserve
   their fixed parent/no-symlink and serial no-mutation premise; absence checks
   are costed B preflight, not fresh unbudgeted probes. There is no cache created
   by this cache=false branch. Do not point cache-location at the {} file.

ESLint constructor also checks cwd/.eslintignore existence at764–767 despite
ignore=false. That bounded existence probe is not no-I/O, and must be named in
the future allowed read/stat inventory; it does not load that file's content.
Exact file arguments whose stat is regular lead findFiles directly to results;
no directory/glob search invokes @humanfs/node in this fixed branch. Retrier is
still instantiated and may retry file reads on ENFILE/EMFILE inside the same
750ms deadline; that is not permission for an extra effect or CLI rerun.

Formatter: --format json first attempts cwd resolution of eslint-formatter-json
and only falls back to the builtin. Use the literal absolute builtin path
/Users/os/hiveos/node_modules/eslint/lib/cli-engine/formatters/json.js containing
slashes, which takes the direct-file branch at1196–1197. Its source remains
unread and must be source-closed/preserved before import. No external formatter
package resolution is necessary on this branch. Its native JSON serialization
and raw stdout cap remain part of the existing B collector inventory.

## 9. Exact exposed next references — not exercised

If and only if Main obtains a compatible routing decision, these installed
ESLint relative runtime references are newly exposed and remain unread:

- node_modules/eslint/lib/eslint/legacy-eslint.js
- node_modules/eslint/lib/config/default-config.js
- node_modules/eslint/lib/linter/timing.js
- node_modules/eslint/lib/config/config-loader.js
- node_modules/eslint/lib/services/warning-service.js
- node_modules/eslint/lib/config/config.js
- node_modules/eslint/lib/shared/naming.js
- node_modules/eslint/lib/shared/severity.js
- node_modules/eslint/lib/shared/relative-module-resolver.js
- node_modules/eslint/lib/cli-engine/hash.js
- node_modules/eslint/lib/cli-engine/lint-result-cache.js
- node_modules/eslint/lib/linter/source-code-fixer.js
- node_modules/eslint/lib/cli-engine/formatters/json.js
- node_modules/eslint/messages/file-not-found.js
- node_modules/eslint/messages/all-matched-files-ignored.js
- node_modules/eslint/messages/config-file-missing.js
- node_modules/debug/src/index.js (manifest-selected main).

The known first-layer bare-module manifest requests are literal
node_modules/@humanwhocodes/retry/package.json,
node_modules/@humanwhocodes/module-importer/package.json,
node_modules/cross-spawn/package.json, node_modules/optionator/package.json,
node_modules/is-glob/package.json, node_modules/minimatch/package.json,
node_modules/glob-parent/package.json and
node_modules/json-stable-stringify-without-jsonify/package.json. They are not
implicitly executed or admitted because their manifest names appear here.
Additional linter/Espree references shown in the newly authorized top sections
remain unresolved; the Acorn prohibition ends this route before any need to
enumerate/read their entire tree. No automatic installed Acorn import exception.

## 10. Actual-MJS typing closure after declaration review

The real TypeScript API declaration exports namespace ts with concrete
SourceFile/Node/CompilerOptions/createSourceFile/forEachChild signatures and
type-predicate helpers. It is not a missing-API situation requiring a fake
typescript declaration. The fixed-file external-reference scan of
typescript.d.ts finds no external import/reference edge; only internal
namespace aliases and the final export=ts. Its full declaration semantics were
not independently audited, and its preservation/byte cost remains required.

lib.es2022.d.ts directly names the following seven unreviewed files:

- node_modules/typescript/lib/lib.es2021.d.ts
- node_modules/typescript/lib/lib.es2022.array.d.ts
- node_modules/typescript/lib/lib.es2022.error.d.ts
- node_modules/typescript/lib/lib.es2022.intl.d.ts
- node_modules/typescript/lib/lib.es2022.object.d.ts
- node_modules/typescript/lib/lib.es2022.regexp.d.ts
- node_modules/typescript/lib/lib.es2022.string.d.ts

@types/node/index.d.ts directly includes ES2020 and59 literal path references.
Their exact unreviewed suffixes under node_modules/@types/node/ are:

```
compatibility/index.d.ts
globals.typedarray.d.ts
buffer.buffer.d.ts
globals.d.ts
web-globals/abortcontroller.d.ts
web-globals/domexception.d.ts
web-globals/events.d.ts
web-globals/fetch.d.ts
assert.d.ts
assert/strict.d.ts
async_hooks.d.ts
buffer.d.ts
child_process.d.ts
cluster.d.ts
console.d.ts
constants.d.ts
crypto.d.ts
dgram.d.ts
diagnostics_channel.d.ts
dns.d.ts
dns/promises.d.ts
domain.d.ts
events.d.ts
fs.d.ts
fs/promises.d.ts
http.d.ts
http2.d.ts
https.d.ts
inspector.generated.d.ts
module.d.ts
net.d.ts
os.d.ts
path.d.ts
perf_hooks.d.ts
process.d.ts
punycode.d.ts
querystring.d.ts
readline.d.ts
readline/promises.d.ts
repl.d.ts
sea.d.ts
stream.d.ts
stream/promises.d.ts
stream/consumers.d.ts
stream/web.d.ts
string_decoder.d.ts
test.d.ts
timers.d.ts
timers/promises.d.ts
tls.d.ts
trace_events.d.ts
tty.d.ts
url.d.ts
util.d.ts
v8.d.ts
vm.d.ts
wasi.d.ts
worker_threads.d.ts
zlib.d.ts
```

Also exposed: node_modules/typescript/lib/lib.es2020.d.ts and the manifest
dependency node_modules/undici-types/package.json. The latter manifest/entry is
unread; no entry is guessed. These declarations do not execute their named
native modules or start workers, but every loaded declaration and transitive
reference consumes compiler I/O/parse/check time and preservation resources.

Concrete closure path for §4 actual-source proof: after a compatible Main
routing decision, authorize the finite official declaration references; trace
further literal references without tree discovery; pin the final complete
closure inside A/B; annotate the actual eight checked .mjs implementations and
their real internal call sites with JSDoc contracts; include the literal Node
index as a project root while keeping automatic types/typeRoots empty; use real
typescript.d.ts for the real deriver; independently review the actual annotated
sources/config before A. Native parsing/Reflect APIs with broad official return
types must be narrowed to unknown at reviewed boundaries, not used to cast an
entire implementation graph to any. Adversarial handle calls retain opaque
unknown inputs and their runtime guards; typing must not remove those tests or
reflect foreign objects. Deliberate bad-arity tests use the retained dynamic
call seam rather than falsely changing a public arity contract.

This route checks executable source, not a stub/echo. Nevertheless current
sources have no established strict checkJs result; annotation source release,
official transitive declaration closure and1200ms fit remain unclosed. Within
the current named installed-source scope full actual-source typing cannot yet
be claimed feasible-to-pass under all frozen limits. No intrinsic compiler
feature obstruction is shown, but claiming a successful strict check or timing
bound would require evidence not supplied by this source pass. Do not switch to
skipLibCheck/noCheck/noImplicitAny=false, omit failing implementations or add an
effect/retry to manufacture closure. A/B remain held at the explicit ESLint
condition contradiction as well as the outstanding source/type/I/O gates.

## 11. Owner exception and final operational source precode — 2026-10-09

Main's complete receipt is
docs/contractor/tips/TIP-081A_P3_R3_TOOLCHAIN_CLOSURE.md, “Direct Owner approval
receipt”. Owner's direct approval supersedes ONLY §7's prohibition conflict:
installed Acorn may load inside ESLint's B lint of fixed TOOL hand sources.
It remains prohibited in A derivation, private-parser/product verification.
The original contradiction and STOP finding remain preserved history. No new
effect/process/deadline/criterion follows. No annotations/config/code, imports,
hashes, generators, tests or checks were authored/executed in this source pass.

Status: OPERATIONAL_SOURCE_PRECODE_READY_FOR_MAIN_FREEZE, not source-code CLEAR,
runtime admission, type/lint PASS, native fit or A/B grant. Main's granular code
release and independent actual-source review remain required. Native Node module
resolution and filesystem stability are controlled-host premises, not a proof
against arbitrary host mutation/caller graphs.

### 11.1 Finite literal census / table reconciliation

The finite conservative installed-source/data table below has exactly447 unique
paths:88 ESLint own files;196 rows for64 external packages;57 standard TS libs;
63 official Node declarations;37 Undici declarations;4 additional TS entry/API
files;2 Node/Undici manifests. The lint subset is284 rows and type subset163.
No path overlaps I57: its Acorn files are next/dist/compiled/acorn, not root
node_modules/acorn. I57's typescript.js and typescript/package.json are retained
there, not redundantly added to447. Two punycode rows are conservatively retained
as manifest-declared TOOL_DATA_ONLY: the reviewed URI.all.js bundles that code,
so they are NOT claimed runtime require edges. This explicit data role avoids
silently conflating manifest dependencies with executable imports.

Read/scan method: finite literal relative references and manifest-selected
entries, source rg/selected ranges for large bundles and declarations, complete
reads for small entry/branch-control files. This is operational import/branch
review, not a claim that every declaration/library algorithm was semantically
audited line-by-line. No directory enumeration, executable resolution/import
probe or target parser invocation. One reader error is retained: p-try/package.json
was mistakenly attempted without a displayed reference; it was absent, no
content read, and is not part of the table. Current p-limit instead requires
the displayed yocto-queue entry; all later names derive from displayed references.

Main's final controls are /Users/os/hiveos/eslint-tip081-p3.r3.suppressions.json
with exact canonical bytes '{}\n' (3bytes), and
/Users/os/hiveos/.eslint-tip081-p3.r3.cache ABSENT/never created. The former
supersedes the two-byte/earlier-name proposal only; empty suppression semantics
are unchanged. Main L2 raised the full literal table ceiling to768, not a private
owner/resource ceiling. Current exact union:
167 existing phase paths +447 installed rows +2 controls =616 positive/readwrite/
fixed-absence-control paths; +37 shadow metadata paths +cwd .eslintignore
existence probe =654 total distinct literal paths, <=768. No omission to fit512.

For corrected D447, the preserved positive-file schedule has2385 installed/
inherited scan rows before the separately included suppression phases. Including
the fixed3byte suppression's four phases, Front's exact formulas give
opens/closes/file hashes621+4D=2409; fstats1242+8D=4818; output-inclusive hash
contexts644+4D=2432; tight read-call upper309607+2056D+12=1228651. The+12 is
the four3-byte suppression rows; a fully uniform514-per-read-row suppression
envelope instead gives311663+2056D=1230695. These are conservative source
schedule maxima, NOT measured work. The private cache,37 shadows and
.eslintignore require4*(1+37+1)=156 separately priced lstat metadata probes,
not content buffers/JSON/file hashes. Do not silently count absent roles as
successful content opens or omit them. Existing16MiB cut/data ceilings,
4MiB journals, G9 profile65536 limit, A5500/B15000 and all205 remain unchanged.
The full TOOL pin graph does not go in a65536-byte generated product profile.

### 11.2 Fixed process / branch proof

Plain fresh /usr/local/bin/node launches remain exactly the existing lint/type
children in B. No shell/npm/npx wrapper, worker flag, package-manager lifecycle
or separate timing/version/help process is added. process.execPath is provenance,
not falsely required to equal the lexical launcher path through symlinks.

ESLint branch closure under the following exact config/argv/environment:
cli selects flat mode; processOptions retains off; calculateWorkerCount returns0;
runWorkers and its sole new Worker are not called. lib/cli's inspector branch
and bin init/mcp branches are excluded. RuntimeInfo.environment contains npm
spawn calls but is not invoked without env-info; cross-spawn's module bootstrap
defines spawn functions and does not call them. Fresh Node is neither Electron
renderer/NW/browser nor TESTING_WINDOWS, so debug's Node and isexe's POSIX mode
branches are selected. Native libuv filesystem threads are not JS Worker children.

The literal MJS config file selects config-loader's explicit string override,
skipping findUp. MJS is not a TS config, so Jiti/native TS-config loaders are
excluded. No config imports/plugins/processors/extends/rulesdir or CLI parser.
Root/default internal language/rule bootstrap is retained in447. Lazy rule-map
loaders run only for the four named rules; no all-rules/legacy getRules iteration
is invoked by the fixed flat operation. JSON formatter reads configured-rule
metadata/usedDeprecatedRules, not an arbitrary all-rules configuration. Explicit
regular file targets avoid directory/glob traversal; every result must match
the exact target list and contain no ignored/unconfigured/missing-file diagnostic.
Legacy CLIEngine/FileEnumerator/loadRules methods are not invoked, though their
unconditional bootstrap imports are retained. cache=false excludes file-entry-cache
create/flat-cache; cache-location's explicit absent leaf prevents cache deletion.
Suppress/prune/save methods are excluded; parsed empty suppression data cannot
remove diagnostics. stdin/fix/output-file branches are excluded.

TS ordinary one-shot compile follows bin→shim→_tsc. No build/watch/incremental/
trace/profiler/source-map-support/development/debug path. The bundle's host
require(modulePath) is not a call made by ordinary explicit-project compilation.
Native fs/path/os/optional crypto/perf_hooks are its trusted bootstrap modules;
no caller-provided language-service/plugin or tsserver is used. Declaration
names child_process/worker_threads do NOT execute those modules. Internal schema
code generation by ESLint/Ajv is trusted TOOL work on the reviewed fixed schema,
not private-parser evaluation or another process. Installed Node/bootstrap/builtin
semantics remain an explicit host premise; the report does not certify whole
host behavior or physical memory/elapsed fit.

Before tool launches, the B preflight must bind exact installed module/declaration
paths/pins and fixed resolution choices; unexpected nearer nested packages,
shadow declarations or changed fixed sources are STOP, not discovered/accepted
new rows. A first-captures447 as DATA before trusted TOOL imports; only B executes
lint dependencies. Standard CJS resolution from fixed importer/specifier pairs
must lead to the listed manifest-selected paths. Optional supports-color is
present/retained; no omitted optional alternate source may be loaded.

### 11.3 Literal lint argv / useful frozen configuration

Launcher /usr/local/bin/node; argv (each is an individual argument, no shell string):

```text
/Users/os/hiveos/node_modules/eslint/bin/eslint.js
--config
/Users/os/hiveos/eslint-tip081-p3.r3.config.mjs
--no-config-lookup
--concurrency
off
--no-ignore
--no-cache
--no-fix
--no-inline-config
--max-warnings
0
--format
/Users/os/hiveos/node_modules/eslint/lib/cli-engine/formatters/json.js
--suppressions-location
/Users/os/hiveos/eslint-tip081-p3.r3.suppressions.json
--cache-location
/Users/os/hiveos/.eslint-tip081-p3.r3.cache
--
```

Then append exactly the14 absolute MJS paths in11.5, in that order. No output-file
argument; --no-output-file is not invented for a path-valued option. No quiet,
ignore pattern, no-warn-ignored, pass-on-no-patterns, config inspection/help/version,
flag, plugin, parser, global discovery or stdin argument.

Config has one literal flat record with basePath:'/Users/os/hiveos' and the
exact14 project-relative versions of the11.5 paths (strip ONLY the fixed
'/Users/os/hiveos/' prefix in the literal authored table, not by runtime
discovery); ecmaVersion2022,
sourceType module; four error rules no-dupe-args, no-dupe-keys, no-unreachable and
valid-typeof; no other ruleset/import/plugins/processor/extends/ignores. This is
a substantive focused correctness check, not an empty/syntax-only substitute.
Lint/syntax covers all14 fixed MJS inputs, including the two raw lexical overlays.
Strict/checkJs covers the12 executable modules defined below. Verifier's exported
string is not falsely reported as a type-checked private internal program. The
raw runtime/kernel lexical bodies are not string containers or standalone modules;
their retained P2 bindings remain under independent syntax/source/composition gates.

Environment is a new fixed allowlist, never a spread of process.env or .env read:
NODE_ENV='production', NODE_DISABLE_COMPILE_CACHE='1',
ESLINT_USE_FLAT_CONFIG='true', ESLINT_FLAGS='', DEBUG='', TIMING='',
FORCE_COLOR='0', NO_COLOR='1', TERM='dumb', LANG='C', LC_ALL='C', TZ='UTC'.
Native launcher does not require PATH-based lookup. Do not inherit NODE_OPTIONS,
NODE_PATH, NODE_COMPILE_CACHE, inspector/debug/coverage/profiling/TSC watch settings,
HOME-based module paths or npm configuration. Any host-required extra variable
must be explicitly source-reviewed/priced before release. Native Node honoring
its compile-cache disabling control is a host contract; old CLI boot calls
enableCompileCache when available remain source-visible, not silently removed.

### 11.4 Concrete real-JSDoc authoring/type configuration

Launcher /usr/local/bin/node; exact type argv:

```text
/Users/os/hiveos/node_modules/typescript/bin/tsc
--project
/Users/os/hiveos/tsconfig-tip081-p3.r3.json
--pretty
false
```

Main accepted: targetES2022, moduleESNext, moduleResolutionBundler,
moduleDetectionforce, allowJs/checkJs/noEmit/strict true; noImplicitAny/
strictNullChecks true; skipLibCheck/skipDefaultLibCheck/noCheck false;
types[]/typeRoots[]; lib['ES2022']; libReplacementfalse;
resolvePackageJsonExports/resolvePackageJsonImports false; no baseUrl,
extends/references/incremental/composite/watch/plugins/trace/profile/emit.
paths is EXACTLY {typescript:['./node_modules/typescript/lib/typescript.d.ts']}.
_tsc:16534/39169 establish config-relative pathsBasePath without baseUrl;
121954 establishes immediate .mjs format and avoids local .d.ts ancestor lookup
in Bundler mode. This type-resolution choice does not change Node runtime
module/admission semantics. No wildcard local declarations or any-root casts.

files is exactly12 executable MJS roots below plus
/Users/os/hiveos/tests/unit/private-summary-tip081-p3.r3.d.ts and
/Users/os/hiveos/node_modules/@types/node/index.d.ts; include[]/exclude[] empty.
The12 executable source roots remain checked, not substituted by the local
contract file. Exclude ONLY private-summary-runtime-tip081-p3.r3.mjs and
private-summary-kernel-tip081-p3.r3.mjs: those are raw lexical TEXT overlays
concatenated with retained P2/static declarations, NEVER imported alone. They
remain among all14 lint/syntax inputs. No fake ambient P2 declarations, edits to
private lexical bodies or type bypass replace this executable-root distinction.
Node's explicit entry reaches all63 official declarations and37 Undici
declarations; real compiler API and57 lib declarations are retained. Automatic
ambient types/library replacement/package export discovery are disabled.

Granular annotation/source groups, without runtime/API/registry/ledger edits:

| Actual source group | Required real checked bindings |
|---|---|
| runner |81 actual functions/callbacks, domain APIs,205 literal EvidenceId union/row/dependency-mask shape, serial group state/primary raw-fault latch, handles as unknown, actual kernel wire and decoder/check seams, FD/journal scalar states |
| admission |15 functions; readonly exact pin/context/domain/export contracts; namespace/JSON results start unknown and narrow through actual existing guards; no tuple authority inferred by a type |
| baseline |13 functions; Metadata27 schema/typed ordered keys, immutable initial-base binding, per-handle/domain/sourceUnits state, WeakMap records/WeakSet opaque handles, emission/count/stale cleanup |
| boundary expectations |8 functions;20 exact expected observations, MODEL/K distinction, wire string/check boolean contract, validated unknown JSON, actual supplied source-T scalar not fabricated static authority |
| deriver |actual TS Node/SourceFile/type-predicate/visitor calls and fixed lexical source/cost/offset inventory contracts using real typescript.d.ts, no replacement TS module declaration |
| manifest/capture/preserve/check/supervisor |actual callbacks/argv/phase enums, fixed manifest records/FD ownership/read-write progress/pin data/receipt schemas, child settlement/output/timeout/first-fault states; concrete locals/captures after actual source authoring |
| verifier string container + lint config |typed string exports and literal config shape only; do not edit/embed JSDoc into retained private body strings or claim product-internal type proof |

The local .d.ts expresses exact internal contracts/finite literal unions; it
does not declare replacement modules for the checked .mjs files. JSDoc goes on
actual named params/returns/state/captures/callbacks, not on a stand-in function.
Use readonly records/arrays and discriminated phases; native JSON.parse/dynamic
import outputs are narrowed from unknown through existing complete guards.
Existing boolean-only primitive foreign identity assertions and opaque handle
policy remain; type annotations never authorize reflecting foreign objects.
Official native signatures containing any must not launder the whole API into
unchecked code; narrow such values to unknown at the existing boundary. Native
capture aliases/assertion signatures need explicit types where inferred bind/
assert behavior would otherwise lose narrowing. Literal __proto__:null is
prototype-setting syntax, not an additional metadata own field/type proof.

Deliberate bad-arity/primitive/getter test inputs remain through the existing
dynamic call seam; no @ts-ignore/@ts-nocheck/@ts-expect-error masking or removed
tests. Preserve source assertions, ALL205, normal/alias domain lifecycle and
kernel one-shot ordering. Comment-only annotation authoring should not alter
runtime bindings/arities/allocations/private strings; any required executable
repair must be a concrete Main L2 delta with re-review, not silent type-driven
rewriting. No claim that the current unannotated code already passes strict
checking; authoring and independent readback are the next concrete prerequisite.

### 11.5 Fixed14 syntax/lint inputs and exact12 executable type roots

The ordered list below remains the complete syntax/lint list. The strict/checkJs
files list is EXACTLY its12 entries excluding only runtime (first) and kernel
(third); the verifier string-export module remains included, as do every actual
tool/admission/metadata/boundary/runner/config implementation. Explicit type roots:

```text
/Users/os/hiveos/scripts/test/private-summary-verifier-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/derive-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/admit-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/metadata-baseline-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/boundary-expectations-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/private-summary-tool-manifest-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/capture-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/preserve-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/check-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/supervise-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/tests/unit/private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/eslint-tip081-p3.r3.config.mjs
```

Unchanged14 syntax/lint inputs:

```text
/Users/os/hiveos/scripts/test/private-summary-runtime-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/private-summary-verifier-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/private-summary-kernel-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/derive-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/admit-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/metadata-baseline-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/boundary-expectations-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/private-summary-tool-manifest-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/capture-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/preserve-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/check-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/scripts/test/supervise-private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/tests/unit/private-summary-tip081-p3.r3.mjs
/Users/os/hiveos/eslint-tip081-p3.r3.config.mjs
```

### 11.6 Named negative metadata/shadow probes

These37 names are ABSENCE-only: never create/read/hash their contents. _tsc:41091
tests .mts/.d.mts before .mjs on relative imports. The14-pair envelope includes
direct roots too conservatively; a root-only file need not receive an import
miss, but no possible sibling-shadow slot is hidden. The nine package names
are declaration-scope misses before the reviewed parent manifest. Existing or
symlink shadow means STOP before check, not a declarations-only successful test.

```text
/Users/os/hiveos/scripts/test/private-summary-runtime-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/private-summary-runtime-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/private-summary-verifier-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/private-summary-verifier-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/private-summary-kernel-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/private-summary-kernel-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/derive-private-summary-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/derive-private-summary-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/admit-private-summary-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/admit-private-summary-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/metadata-baseline-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/metadata-baseline-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/boundary-expectations-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/boundary-expectations-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/private-summary-tool-manifest-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/private-summary-tool-manifest-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/capture-private-summary-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/capture-private-summary-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/preserve-private-summary-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/preserve-private-summary-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/check-private-summary-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/check-private-summary-tip081-p3.r3.d.mts
/Users/os/hiveos/scripts/test/supervise-private-summary-tip081-p3.r3.mts
/Users/os/hiveos/scripts/test/supervise-private-summary-tip081-p3.r3.d.mts
/Users/os/hiveos/tests/unit/private-summary-tip081-p3.r3.mts
/Users/os/hiveos/tests/unit/private-summary-tip081-p3.r3.d.mts
/Users/os/hiveos/eslint-tip081-p3.r3.config.mts
/Users/os/hiveos/eslint-tip081-p3.r3.config.d.mts
/Users/os/hiveos/node_modules/typescript/lib/package.json
/Users/os/hiveos/node_modules/@types/node/compatibility/package.json
/Users/os/hiveos/node_modules/@types/node/web-globals/package.json
/Users/os/hiveos/node_modules/@types/node/assert/package.json
/Users/os/hiveos/node_modules/@types/node/dns/package.json
/Users/os/hiveos/node_modules/@types/node/fs/package.json
/Users/os/hiveos/node_modules/@types/node/readline/package.json
/Users/os/hiveos/node_modules/@types/node/stream/package.json
/Users/os/hiveos/node_modules/@types/node/timers/package.json
```

Also /Users/os/hiveos/.eslintignore is a bounded EXISTENCE-only probe; its content
is never loaded by this flat CLI branch. Do not assert absence blindly. The
fresh-process/stopped-edit premise spans preflight through child checks; this
is not hostile-filesystem isolation.

### 11.7 Complete447 installed source/data paths

Every line is one fixed full path; no glob/tree/decoded-path discovery.
Phase role: A capture/preserve DATA only; B fixed lint or type source/declaration/
manifest binding; before/after preservation. Unused bundled punycode rows are
DATA-only as stated above. Per-row native size/pin caps and prospective frames
must be reconciled in authored tooling; new pins are first-capture-in-A, not
historical MATCH. No hash or target import was performed to fill this table.

Narrow Main repair history (superseding the initial §11 draft only): the initial
D446 list omitted the fixed --format target even though argv named it. Complete
authorized TEXT read of eslint/lib/cli-engine/formatters/json.js shows only
module.exports=function(results){return JSON.stringify(results);}; there are no
direct literal imports/requires/dependencies to add. It is a B formatter runtime
source, not unused package DATA. Add this one row, dropping none: D447, lint284,
wholeunion654. The initial14-type-root/string-container premise was incorrect:
runtime/kernel are raw lexical overlays; strict/checkJs uses the exact12
executable roots above, while syntax/lint retains all14. No fake P2 ambient
declarations/private-body edits/type bypass, code or effects followed. The
predecessor D446 schedule (2381 scans/2401 opens/4802 fstats/1226583 reads/
2424 contexts before suppression additions) is preserved here as superseded
history, not a current authoring bound.

```text
/Users/os/hiveos/node_modules/eslint/bin/eslint.js
/Users/os/hiveos/node_modules/eslint/package.json
/Users/os/hiveos/node_modules/eslint/lib/cli.js
/Users/os/hiveos/node_modules/eslint/lib/cli-engine/formatters/json.js
/Users/os/hiveos/node_modules/eslint/lib/options.js
/Users/os/hiveos/node_modules/eslint/lib/eslint/index.js
/Users/os/hiveos/node_modules/eslint/lib/eslint/eslint.js
/Users/os/hiveos/node_modules/eslint/lib/eslint/eslint-helpers.js
/Users/os/hiveos/node_modules/eslint/lib/eslint/legacy-eslint.js
/Users/os/hiveos/node_modules/eslint/lib/shared/logging.js
/Users/os/hiveos/node_modules/eslint/lib/shared/runtime-info.js
/Users/os/hiveos/node_modules/eslint/lib/shared/translate-cli-options.js
/Users/os/hiveos/node_modules/eslint/lib/shared/severity.js
/Users/os/hiveos/node_modules/eslint/lib/shared/naming.js
/Users/os/hiveos/node_modules/eslint/lib/shared/relative-module-resolver.js
/Users/os/hiveos/node_modules/eslint/lib/services/suppressions-service.js
/Users/os/hiveos/node_modules/eslint/lib/services/warning-service.js
/Users/os/hiveos/node_modules/eslint/lib/config/default-config.js
/Users/os/hiveos/node_modules/eslint/lib/config/config-loader.js
/Users/os/hiveos/node_modules/eslint/lib/config/config.js
/Users/os/hiveos/node_modules/eslint/lib/config/flat-config-array.js
/Users/os/hiveos/node_modules/eslint/lib/config/flat-config-schema.js
/Users/os/hiveos/node_modules/eslint/lib/linter/timing.js
/Users/os/hiveos/node_modules/eslint/lib/linter/index.js
/Users/os/hiveos/node_modules/eslint/lib/linter/linter.js
/Users/os/hiveos/node_modules/eslint/lib/linter/rules.js
/Users/os/hiveos/node_modules/eslint/lib/linter/source-code-fixer.js
/Users/os/hiveos/node_modules/eslint/lib/linter/source-code-visitor.js
/Users/os/hiveos/node_modules/eslint/lib/linter/vfile.js
/Users/os/hiveos/node_modules/eslint/lib/linter/file-context.js
/Users/os/hiveos/node_modules/eslint/lib/linter/source-code-traverser.js
/Users/os/hiveos/node_modules/eslint/lib/linter/file-report.js
/Users/os/hiveos/node_modules/eslint/lib/linter/rule-fixer.js
/Users/os/hiveos/node_modules/eslint/lib/linter/interpolate.js
/Users/os/hiveos/node_modules/eslint/lib/linter/esquery.js
/Users/os/hiveos/node_modules/eslint/lib/linter/apply-disable-directives.js
/Users/os/hiveos/node_modules/eslint/lib/shared/traverser.js
/Users/os/hiveos/node_modules/eslint/lib/shared/stats.js
/Users/os/hiveos/node_modules/eslint/lib/shared/deep-merge-arrays.js
/Users/os/hiveos/node_modules/eslint/lib/shared/flags.js
/Users/os/hiveos/node_modules/eslint/lib/shared/option-utils.js
/Users/os/hiveos/node_modules/eslint/lib/shared/ast-utils.js
/Users/os/hiveos/node_modules/eslint/lib/shared/ajv.js
/Users/os/hiveos/node_modules/eslint/lib/shared/assert.js
/Users/os/hiveos/node_modules/eslint/lib/shared/directives.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/index.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/validate-language-options.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/index.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/source-code.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/index.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/cursors.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/forward-token-cursor.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/padded-token-cursor.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/utils.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/backward-token-comment-cursor.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/backward-token-cursor.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/filter-cursor.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/forward-token-comment-cursor.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/limit-cursor.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/skip-cursor.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/cursor.js
/Users/os/hiveos/node_modules/eslint/lib/languages/js/source-code/token-store/decorative-cursor.js
/Users/os/hiveos/node_modules/eslint/lib/linter/code-path-analysis/code-path-analyzer.js
/Users/os/hiveos/node_modules/eslint/lib/linter/code-path-analysis/code-path.js
/Users/os/hiveos/node_modules/eslint/lib/linter/code-path-analysis/code-path-segment.js
/Users/os/hiveos/node_modules/eslint/lib/linter/code-path-analysis/id-generator.js
/Users/os/hiveos/node_modules/eslint/lib/linter/code-path-analysis/debug-helpers.js
/Users/os/hiveos/node_modules/eslint/lib/linter/code-path-analysis/code-path-state.js
/Users/os/hiveos/node_modules/eslint/lib/linter/code-path-analysis/fork-context.js
/Users/os/hiveos/node_modules/eslint/lib/cli-engine/hash.js
/Users/os/hiveos/node_modules/eslint/lib/cli-engine/lint-result-cache.js
/Users/os/hiveos/node_modules/eslint/lib/cli-engine/cli-engine.js
/Users/os/hiveos/node_modules/eslint/lib/cli-engine/file-enumerator.js
/Users/os/hiveos/node_modules/eslint/lib/cli-engine/load-rules.js
/Users/os/hiveos/node_modules/eslint/lib/rules/index.js
/Users/os/hiveos/node_modules/eslint/lib/rules/utils/lazy-loading-rule-map.js
/Users/os/hiveos/node_modules/eslint/lib/rules/no-dupe-args.js
/Users/os/hiveos/node_modules/eslint/lib/rules/no-dupe-keys.js
/Users/os/hiveos/node_modules/eslint/lib/rules/no-unreachable.js
/Users/os/hiveos/node_modules/eslint/lib/rules/valid-typeof.js
/Users/os/hiveos/node_modules/eslint/lib/rules/utils/ast-utils.js
/Users/os/hiveos/node_modules/eslint/conf/globals.js
/Users/os/hiveos/node_modules/eslint/conf/ecma-version.js
/Users/os/hiveos/node_modules/eslint/conf/replacements.json
/Users/os/hiveos/node_modules/eslint/conf/default-cli-options.js
/Users/os/hiveos/node_modules/eslint/messages/file-not-found.js
/Users/os/hiveos/node_modules/eslint/messages/all-matched-files-ignored.js
/Users/os/hiveos/node_modules/eslint/messages/config-file-missing.js
/Users/os/hiveos/node_modules/debug/package.json
/Users/os/hiveos/node_modules/debug/src/index.js
/Users/os/hiveos/node_modules/debug/src/node.js
/Users/os/hiveos/node_modules/debug/src/common.js
/Users/os/hiveos/node_modules/espree/package.json
/Users/os/hiveos/node_modules/espree/dist/espree.cjs
/Users/os/hiveos/node_modules/acorn/package.json
/Users/os/hiveos/node_modules/acorn/dist/acorn.js
/Users/os/hiveos/node_modules/acorn-jsx/package.json
/Users/os/hiveos/node_modules/acorn-jsx/index.js
/Users/os/hiveos/node_modules/acorn-jsx/xhtml.js
/Users/os/hiveos/node_modules/@humanwhocodes/retry/package.json
/Users/os/hiveos/node_modules/@humanwhocodes/retry/dist/retrier.cjs
/Users/os/hiveos/node_modules/@humanwhocodes/module-importer/package.json
/Users/os/hiveos/node_modules/@humanwhocodes/module-importer/src/module-importer.cjs
/Users/os/hiveos/node_modules/cross-spawn/package.json
/Users/os/hiveos/node_modules/cross-spawn/index.js
/Users/os/hiveos/node_modules/cross-spawn/lib/parse.js
/Users/os/hiveos/node_modules/cross-spawn/lib/enoent.js
/Users/os/hiveos/node_modules/cross-spawn/lib/util/resolveCommand.js
/Users/os/hiveos/node_modules/cross-spawn/lib/util/escape.js
/Users/os/hiveos/node_modules/cross-spawn/lib/util/readShebang.js
/Users/os/hiveos/node_modules/optionator/package.json
/Users/os/hiveos/node_modules/optionator/lib/index.js
/Users/os/hiveos/node_modules/optionator/lib/util.js
/Users/os/hiveos/node_modules/optionator/lib/help.js
/Users/os/hiveos/node_modules/is-glob/package.json
/Users/os/hiveos/node_modules/is-glob/index.js
/Users/os/hiveos/node_modules/is-extglob/package.json
/Users/os/hiveos/node_modules/is-extglob/index.js
/Users/os/hiveos/node_modules/minimatch/package.json
/Users/os/hiveos/node_modules/minimatch/minimatch.js
/Users/os/hiveos/node_modules/glob-parent/package.json
/Users/os/hiveos/node_modules/glob-parent/index.js
/Users/os/hiveos/node_modules/json-stable-stringify-without-jsonify/package.json
/Users/os/hiveos/node_modules/json-stable-stringify-without-jsonify/index.js
/Users/os/hiveos/node_modules/eslint-scope/package.json
/Users/os/hiveos/node_modules/eslint-scope/dist/eslint-scope.cjs
/Users/os/hiveos/node_modules/eslint-visitor-keys/package.json
/Users/os/hiveos/node_modules/eslint-visitor-keys/dist/eslint-visitor-keys.cjs
/Users/os/hiveos/node_modules/lodash.merge/package.json
/Users/os/hiveos/node_modules/lodash.merge/index.js
/Users/os/hiveos/node_modules/@eslint/eslintrc/package.json
/Users/os/hiveos/node_modules/@eslint/eslintrc/dist/eslintrc.cjs
/Users/os/hiveos/node_modules/@eslint/eslintrc/dist/eslintrc-universal.cjs
/Users/os/hiveos/node_modules/@eslint/config-array/package.json
/Users/os/hiveos/node_modules/@eslint/config-array/dist/cjs/index.cjs
/Users/os/hiveos/node_modules/@eslint/config-array/dist/cjs/std__path/posix.cjs
/Users/os/hiveos/node_modules/@eslint/config-array/dist/cjs/std__path/windows.cjs
/Users/os/hiveos/node_modules/@eslint/plugin-kit/package.json
/Users/os/hiveos/node_modules/@eslint/plugin-kit/dist/cjs/index.cjs
/Users/os/hiveos/node_modules/@eslint/object-schema/package.json
/Users/os/hiveos/node_modules/@eslint/object-schema/dist/cjs/index.cjs
/Users/os/hiveos/node_modules/ajv/package.json
/Users/os/hiveos/node_modules/ajv/lib/ajv.js
/Users/os/hiveos/node_modules/ajv/lib/cache.js
/Users/os/hiveos/node_modules/ajv/lib/data.js
/Users/os/hiveos/node_modules/ajv/lib/keyword.js
/Users/os/hiveos/node_modules/ajv/lib/definition_schema.js
/Users/os/hiveos/node_modules/ajv/lib/compile/index.js
/Users/os/hiveos/node_modules/ajv/lib/compile/resolve.js
/Users/os/hiveos/node_modules/ajv/lib/compile/schema_obj.js
/Users/os/hiveos/node_modules/ajv/lib/compile/formats.js
/Users/os/hiveos/node_modules/ajv/lib/compile/rules.js
/Users/os/hiveos/node_modules/ajv/lib/compile/util.js
/Users/os/hiveos/node_modules/ajv/lib/compile/async.js
/Users/os/hiveos/node_modules/ajv/lib/compile/error_classes.js
/Users/os/hiveos/node_modules/ajv/lib/compile/ucs2length.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/index.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/validate.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/custom.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/ref.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/allOf.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/anyOf.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/comment.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/const.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/contains.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/dependencies.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/enum.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/format.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/if.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/items.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/_limit.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/_limitItems.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/_limitLength.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/_limitProperties.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/multipleOf.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/not.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/oneOf.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/pattern.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/properties.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/propertyNames.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/required.js
/Users/os/hiveos/node_modules/ajv/lib/dotjs/uniqueItems.js
/Users/os/hiveos/node_modules/ajv/lib/refs/json-schema-draft-04.json
/Users/os/hiveos/node_modules/ajv/lib/refs/json-schema-draft-07.json
/Users/os/hiveos/node_modules/file-entry-cache/package.json
/Users/os/hiveos/node_modules/file-entry-cache/cache.js
/Users/os/hiveos/node_modules/find-up/package.json
/Users/os/hiveos/node_modules/find-up/index.js
/Users/os/hiveos/node_modules/supports-color/package.json
/Users/os/hiveos/node_modules/supports-color/index.js
/Users/os/hiveos/node_modules/imurmurhash/package.json
/Users/os/hiveos/node_modules/imurmurhash/imurmurhash.js
/Users/os/hiveos/node_modules/prelude-ls/package.json
/Users/os/hiveos/node_modules/prelude-ls/lib/index.js
/Users/os/hiveos/node_modules/prelude-ls/lib/Func.js
/Users/os/hiveos/node_modules/prelude-ls/lib/List.js
/Users/os/hiveos/node_modules/prelude-ls/lib/Obj.js
/Users/os/hiveos/node_modules/prelude-ls/lib/Str.js
/Users/os/hiveos/node_modules/prelude-ls/lib/Num.js
/Users/os/hiveos/node_modules/deep-is/package.json
/Users/os/hiveos/node_modules/deep-is/index.js
/Users/os/hiveos/node_modules/type-check/package.json
/Users/os/hiveos/node_modules/type-check/lib/index.js
/Users/os/hiveos/node_modules/type-check/lib/parse-type.js
/Users/os/hiveos/node_modules/type-check/lib/check.js
/Users/os/hiveos/node_modules/levn/package.json
/Users/os/hiveos/node_modules/levn/lib/index.js
/Users/os/hiveos/node_modules/levn/lib/parse-string.js
/Users/os/hiveos/node_modules/levn/lib/cast.js
/Users/os/hiveos/node_modules/brace-expansion/package.json
/Users/os/hiveos/node_modules/brace-expansion/index.js
/Users/os/hiveos/node_modules/escape-string-regexp/package.json
/Users/os/hiveos/node_modules/escape-string-regexp/index.js
/Users/os/hiveos/node_modules/esquery/package.json
/Users/os/hiveos/node_modules/esquery/dist/esquery.min.js
/Users/os/hiveos/node_modules/estraverse/package.json
/Users/os/hiveos/node_modules/estraverse/estraverse.js
/Users/os/hiveos/node_modules/esrecurse/package.json
/Users/os/hiveos/node_modules/esrecurse/esrecurse.js
/Users/os/hiveos/node_modules/fast-json-stable-stringify/package.json
/Users/os/hiveos/node_modules/fast-json-stable-stringify/index.js
/Users/os/hiveos/node_modules/globals/package.json
/Users/os/hiveos/node_modules/globals/index.js
/Users/os/hiveos/node_modules/globals/globals.json
/Users/os/hiveos/node_modules/import-fresh/package.json
/Users/os/hiveos/node_modules/import-fresh/index.js
/Users/os/hiveos/node_modules/strip-json-comments/package.json
/Users/os/hiveos/node_modules/strip-json-comments/index.js
/Users/os/hiveos/node_modules/ignore/package.json
/Users/os/hiveos/node_modules/ignore/index.js
/Users/os/hiveos/node_modules/locate-path/package.json
/Users/os/hiveos/node_modules/locate-path/index.js
/Users/os/hiveos/node_modules/path-exists/package.json
/Users/os/hiveos/node_modules/path-exists/index.js
/Users/os/hiveos/node_modules/has-flag/package.json
/Users/os/hiveos/node_modules/has-flag/index.js
/Users/os/hiveos/node_modules/concat-map/package.json
/Users/os/hiveos/node_modules/concat-map/index.js
/Users/os/hiveos/node_modules/balanced-match/package.json
/Users/os/hiveos/node_modules/balanced-match/index.js
/Users/os/hiveos/node_modules/fast-levenshtein/package.json
/Users/os/hiveos/node_modules/fast-levenshtein/levenshtein.js
/Users/os/hiveos/node_modules/word-wrap/package.json
/Users/os/hiveos/node_modules/word-wrap/index.js
/Users/os/hiveos/node_modules/@eslint-community/eslint-utils/package.json
/Users/os/hiveos/node_modules/@eslint-community/eslint-utils/index.js
/Users/os/hiveos/node_modules/uri-js/package.json
/Users/os/hiveos/node_modules/uri-js/dist/es5/uri.all.js
/Users/os/hiveos/node_modules/fast-deep-equal/package.json
/Users/os/hiveos/node_modules/fast-deep-equal/index.js
/Users/os/hiveos/node_modules/json-schema-traverse/package.json
/Users/os/hiveos/node_modules/json-schema-traverse/index.js
/Users/os/hiveos/node_modules/parent-module/package.json
/Users/os/hiveos/node_modules/parent-module/index.js
/Users/os/hiveos/node_modules/resolve-from/package.json
/Users/os/hiveos/node_modules/resolve-from/index.js
/Users/os/hiveos/node_modules/p-locate/package.json
/Users/os/hiveos/node_modules/p-locate/index.js
/Users/os/hiveos/node_modules/p-limit/package.json
/Users/os/hiveos/node_modules/p-limit/index.js
/Users/os/hiveos/node_modules/yocto-queue/package.json
/Users/os/hiveos/node_modules/yocto-queue/index.js
/Users/os/hiveos/node_modules/ms/package.json
/Users/os/hiveos/node_modules/ms/index.js
/Users/os/hiveos/node_modules/which/package.json
/Users/os/hiveos/node_modules/which/which.js
/Users/os/hiveos/node_modules/path-key/package.json
/Users/os/hiveos/node_modules/path-key/index.js
/Users/os/hiveos/node_modules/shebang-command/package.json
/Users/os/hiveos/node_modules/shebang-command/index.js
/Users/os/hiveos/node_modules/isexe/package.json
/Users/os/hiveos/node_modules/isexe/index.js
/Users/os/hiveos/node_modules/isexe/mode.js
/Users/os/hiveos/node_modules/shebang-regex/package.json
/Users/os/hiveos/node_modules/shebang-regex/index.js
/Users/os/hiveos/node_modules/callsites/package.json
/Users/os/hiveos/node_modules/callsites/index.js
/Users/os/hiveos/node_modules/punycode/package.json
/Users/os/hiveos/node_modules/punycode/punycode.js
/Users/os/hiveos/node_modules/esutils/package.json
/Users/os/hiveos/node_modules/esutils/lib/utils.js
/Users/os/hiveos/node_modules/esutils/lib/ast.js
/Users/os/hiveos/node_modules/esutils/lib/code.js
/Users/os/hiveos/node_modules/esutils/lib/keyword.js
/Users/os/hiveos/node_modules/typescript/lib/lib.es5.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.core.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.collection.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.iterable.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.generator.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.promise.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.proxy.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.reflect.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.symbol.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2016.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2016.array.include.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2016.intl.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2017.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2017.arraybuffer.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2017.date.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2017.intl.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2017.object.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2017.sharedmemory.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2017.string.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2017.typedarrays.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2018.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2018.asyncgenerator.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2018.promise.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2018.regexp.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2018.intl.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2019.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2019.array.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2019.object.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2019.string.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2019.symbol.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2019.intl.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2020.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2020.bigint.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2020.date.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2020.number.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2020.promise.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2020.sharedmemory.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2020.string.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2020.symbol.wellknown.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2020.intl.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2021.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2021.promise.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2021.string.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2021.weakref.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2021.intl.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2022.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2022.array.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2022.error.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2022.intl.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2022.object.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2022.regexp.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.es2022.string.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.decorators.d.ts
/Users/os/hiveos/node_modules/typescript/lib/lib.decorators.legacy.d.ts
/Users/os/hiveos/node_modules/@types/node/index.d.ts
/Users/os/hiveos/node_modules/@types/node/compatibility/index.d.ts
/Users/os/hiveos/node_modules/@types/node/globals.typedarray.d.ts
/Users/os/hiveos/node_modules/@types/node/buffer.buffer.d.ts
/Users/os/hiveos/node_modules/@types/node/globals.d.ts
/Users/os/hiveos/node_modules/@types/node/web-globals/abortcontroller.d.ts
/Users/os/hiveos/node_modules/@types/node/web-globals/domexception.d.ts
/Users/os/hiveos/node_modules/@types/node/web-globals/events.d.ts
/Users/os/hiveos/node_modules/@types/node/web-globals/fetch.d.ts
/Users/os/hiveos/node_modules/@types/node/assert.d.ts
/Users/os/hiveos/node_modules/@types/node/assert/strict.d.ts
/Users/os/hiveos/node_modules/@types/node/async_hooks.d.ts
/Users/os/hiveos/node_modules/@types/node/buffer.d.ts
/Users/os/hiveos/node_modules/@types/node/child_process.d.ts
/Users/os/hiveos/node_modules/@types/node/cluster.d.ts
/Users/os/hiveos/node_modules/@types/node/console.d.ts
/Users/os/hiveos/node_modules/@types/node/constants.d.ts
/Users/os/hiveos/node_modules/@types/node/crypto.d.ts
/Users/os/hiveos/node_modules/@types/node/dgram.d.ts
/Users/os/hiveos/node_modules/@types/node/diagnostics_channel.d.ts
/Users/os/hiveos/node_modules/@types/node/dns.d.ts
/Users/os/hiveos/node_modules/@types/node/dns/promises.d.ts
/Users/os/hiveos/node_modules/@types/node/domain.d.ts
/Users/os/hiveos/node_modules/@types/node/events.d.ts
/Users/os/hiveos/node_modules/@types/node/fs.d.ts
/Users/os/hiveos/node_modules/@types/node/fs/promises.d.ts
/Users/os/hiveos/node_modules/@types/node/http.d.ts
/Users/os/hiveos/node_modules/@types/node/http2.d.ts
/Users/os/hiveos/node_modules/@types/node/https.d.ts
/Users/os/hiveos/node_modules/@types/node/inspector.generated.d.ts
/Users/os/hiveos/node_modules/@types/node/module.d.ts
/Users/os/hiveos/node_modules/@types/node/net.d.ts
/Users/os/hiveos/node_modules/@types/node/os.d.ts
/Users/os/hiveos/node_modules/@types/node/path.d.ts
/Users/os/hiveos/node_modules/@types/node/perf_hooks.d.ts
/Users/os/hiveos/node_modules/@types/node/process.d.ts
/Users/os/hiveos/node_modules/@types/node/punycode.d.ts
/Users/os/hiveos/node_modules/@types/node/querystring.d.ts
/Users/os/hiveos/node_modules/@types/node/readline.d.ts
/Users/os/hiveos/node_modules/@types/node/readline/promises.d.ts
/Users/os/hiveos/node_modules/@types/node/repl.d.ts
/Users/os/hiveos/node_modules/@types/node/sea.d.ts
/Users/os/hiveos/node_modules/@types/node/stream.d.ts
/Users/os/hiveos/node_modules/@types/node/stream/promises.d.ts
/Users/os/hiveos/node_modules/@types/node/stream/consumers.d.ts
/Users/os/hiveos/node_modules/@types/node/stream/web.d.ts
/Users/os/hiveos/node_modules/@types/node/string_decoder.d.ts
/Users/os/hiveos/node_modules/@types/node/test.d.ts
/Users/os/hiveos/node_modules/@types/node/timers.d.ts
/Users/os/hiveos/node_modules/@types/node/timers/promises.d.ts
/Users/os/hiveos/node_modules/@types/node/tls.d.ts
/Users/os/hiveos/node_modules/@types/node/trace_events.d.ts
/Users/os/hiveos/node_modules/@types/node/tty.d.ts
/Users/os/hiveos/node_modules/@types/node/url.d.ts
/Users/os/hiveos/node_modules/@types/node/util.d.ts
/Users/os/hiveos/node_modules/@types/node/v8.d.ts
/Users/os/hiveos/node_modules/@types/node/vm.d.ts
/Users/os/hiveos/node_modules/@types/node/wasi.d.ts
/Users/os/hiveos/node_modules/@types/node/worker_threads.d.ts
/Users/os/hiveos/node_modules/@types/node/zlib.d.ts
/Users/os/hiveos/node_modules/@types/node/compatibility/disposable.d.ts
/Users/os/hiveos/node_modules/@types/node/compatibility/indexable.d.ts
/Users/os/hiveos/node_modules/@types/node/compatibility/iterators.d.ts
/Users/os/hiveos/node_modules/undici-types/index.d.ts
/Users/os/hiveos/node_modules/undici-types/dispatcher.d.ts
/Users/os/hiveos/node_modules/undici-types/global-dispatcher.d.ts
/Users/os/hiveos/node_modules/undici-types/global-origin.d.ts
/Users/os/hiveos/node_modules/undici-types/pool.d.ts
/Users/os/hiveos/node_modules/undici-types/handlers.d.ts
/Users/os/hiveos/node_modules/undici-types/balanced-pool.d.ts
/Users/os/hiveos/node_modules/undici-types/client.d.ts
/Users/os/hiveos/node_modules/undici-types/connector.d.ts
/Users/os/hiveos/node_modules/undici-types/errors.d.ts
/Users/os/hiveos/node_modules/undici-types/agent.d.ts
/Users/os/hiveos/node_modules/undici-types/mock-client.d.ts
/Users/os/hiveos/node_modules/undici-types/mock-pool.d.ts
/Users/os/hiveos/node_modules/undici-types/mock-agent.d.ts
/Users/os/hiveos/node_modules/undici-types/mock-errors.d.ts
/Users/os/hiveos/node_modules/undici-types/proxy-agent.d.ts
/Users/os/hiveos/node_modules/undici-types/env-http-proxy-agent.d.ts
/Users/os/hiveos/node_modules/undici-types/retry-handler.d.ts
/Users/os/hiveos/node_modules/undici-types/retry-agent.d.ts
/Users/os/hiveos/node_modules/undici-types/api.d.ts
/Users/os/hiveos/node_modules/undici-types/interceptors.d.ts
/Users/os/hiveos/node_modules/undici-types/util.d.ts
/Users/os/hiveos/node_modules/undici-types/cookies.d.ts
/Users/os/hiveos/node_modules/undici-types/eventsource.d.ts
/Users/os/hiveos/node_modules/undici-types/fetch.d.ts
/Users/os/hiveos/node_modules/undici-types/file.d.ts
/Users/os/hiveos/node_modules/undici-types/filereader.d.ts
/Users/os/hiveos/node_modules/undici-types/formdata.d.ts
/Users/os/hiveos/node_modules/undici-types/diagnostics-channel.d.ts
/Users/os/hiveos/node_modules/undici-types/websocket.d.ts
/Users/os/hiveos/node_modules/undici-types/content-type.d.ts
/Users/os/hiveos/node_modules/undici-types/cache.d.ts
/Users/os/hiveos/node_modules/undici-types/mock-interceptor.d.ts
/Users/os/hiveos/node_modules/undici-types/header.d.ts
/Users/os/hiveos/node_modules/undici-types/readable.d.ts
/Users/os/hiveos/node_modules/undici-types/patch.d.ts
/Users/os/hiveos/node_modules/undici-types/pool-stats.d.ts
/Users/os/hiveos/node_modules/typescript/bin/tsc
/Users/os/hiveos/node_modules/typescript/lib/tsc.js
/Users/os/hiveos/node_modules/typescript/lib/_tsc.js
/Users/os/hiveos/node_modules/typescript/lib/typescript.d.ts
/Users/os/hiveos/node_modules/@types/node/package.json
/Users/os/hiveos/node_modules/undici-types/package.json
```

### 11.8 Remaining gates / bounded stop

The practical CLI/config/type-source scheme is authorable after Main's granular
freeze: finite graph, exactly the two existing CLI children, concrete flags/
ambient controls, real actual-MJS JSDoc and official declaration closure. No
irreducible extra child is required by these selected source branches. Native
Node resolution/bootstrap/environment semantics and serial filesystem stability
remain explicit controlled-host premises; source review does not prove native
RSS, whole caller graph or elapsed bounds. 750lint/1200types and500precheck fit
are UNKNOWN until the single authorized B result, with hard timeout/first-failure
STOP and no automatic retry. A cannot serve as a trial lint/type run.

Actual author-source inventory and independent review, complete pin/native IO/
receipt/negative metadata accounting, A source/census/emitted review and Main
tuple/reservation issuance still precede B. All36/205UNRUN/runtime0/8/
compileOFF/tuplesNOT_ISSUED;62OPEN/callergraphOPEN/fullRuntimeClosureNOT_ACCEPTED,
aggregate870882.767416/900000 and remaining21440.727166 unchanged. This report
does not grant effects, self-clear annotations, weaken checks or mint normal
results from component/model fixtures.

## 12. Actual annotation/config source cut — 2026-10-09, SOURCE_READY_ONLY

Main's granular annotation grant and subsequent narrow L2 grouping/split grants
are recorded in TOOLCHAIN_CLOSURE. Implemented now, not another proposal:

| File | Actual source annotation scope |
|---|---|
| scripts/test/admit-private-summary-tip081-p3.r3.mjs | all15 named functions;5 type aliases; exact readonly tuple/pin/context/domain/API contracts; typed native isFile/base64/hash/decoder/char captures; nullable FD/Stats/Buffer/hash/text/module roots, multi-role gate scratch and raw fault states |
| scripts/test/metadata-baseline-tip081-p3.r3.mjs | all13 functions;6 aliases; numeric and opaque predicates,27 Metadata keys,8 explicit assert/JSON/char/WeakMap/WeakSet capture signatures; actual Context/Witness/Reconciliation types, null live handles and tombstone lifecycle |
| scripts/test/boundary-expectations-tip081-p3.r3.mjs | all8 functions;5 aliases;4 explicit assert/unknown JSON/Array/char signatures; actual frozen20 vectors, MODEL body/wire pair, nullable hash/work/output/closure roots, checked canonical scalar comparison |
| tests/unit/private-summary-tip081-p3.r3.mjs | all81 actual helpers/handlers/callbacks;16 aliases;19 explicit assertion/unknown JSON/descriptor/Array/string/Buffer/hash/decoder/Stats capture signatures; truthful nullable6 domain/context/helper roots,205 rows/36 groups/2 slots, finite Operation/ContextScratch/UnitResult and original raw first-fault state |
| tsconfig-tip081-p3.r3.json | exact12 executable roots plus local contracts and explicit official Node index; frozen strict/checkJs/noEmit configuration, real TypeScript paths mapping, no skip/ignore/any graph or alternate declaration roots |
| tests/unit/private-summary-tip081-p3.r3.d.ts | exported internal contracts ONLY: finite205 EvidenceId via exact36-group suffix mapping;27 Metadata fields; Mode/Phase; readonly reviewed11-key context, three pins/domain proofs and four receipts; actual6/1 APIs, baseline state/witness/reconciliation, MODEL/real scalar-site distinction, bounded runner rows/slots/operations/result |

The contracts declare no ambient module, P2 globals, replacement MJS implementation
or executable authority. Handle remains unknown (including foreign/proxy values);
only baseline's original opaque checks narrow WeakMap keys to object. Synthetic
retirement's actual result is 'SYNTHETIC_P3_OWNER_RETIRED', not the initial void
proposal. BindingKind includes LOCAL_BINDING, not only observed fixture cases.
Decoder ScalarSite retains its actual string guards rather than pretending the
TOOL decoder independently proves every enum; finite Site is the trusted literal
expected-vector type. Source/private replay retains its separate real enum proof.

Manual executable-delta inventory:

1. Existing modules received comments/JSDoc and Main-approved parentheses around
   existing expressions, not new evaluation/call/binding/control/arity/allocation/
   check/string/registry operations. Source bodies and all205 assertions remain.
   Null initializations are typed nullable unions, never cast to an admitted API.
2. Main explicitly permitted the one existing combined cOk/cDeep declaration to
   split into consecutive const statements with the same names/order/exact bind
   initializers. cOk has declared AssertCondition; cDeep has the REAL native
   typeof assert.deepStrictEqual signature. The predecessor shared annotation
   and expression-only assertion-alias risk are preserved here, not hidden.
3. Native Function.call.bind captures have concrete signatures for the already
   captured native method and receiver. JSON.parse results start unknown. Baseline
   numeric casts follow the original27-key/scalar/integer loop; final Metadata
   cast follows ALL fixed values, sanitization and canonical equality. No schema
   cast replaces a malformed JSON refusal.
4. Boundary record casts follow actual coreExactKeys/object checks; cases follow
   actual Array/length checks; cumulative numeric reads follow each original
   scalar-validation loop. Pair casts follow factory successful completion, where
   variant=3 prevents finally clearing the returned closures' pair. Refused
   construction does not return closures or a fake pair.
5. Admission module casts are tied to native dynamic-import namespace provenance,
   the original exact namespace key count/function arities and trusted tuple
   identity. Cache/public return casts distinguish normal/alias vs kernel ONLY
   after gate/moduleShape; unissued context still denies before FS/import. Final
   context return follows all three existing gates, not an unguarded null erasure.
6. Runner domain/helper casts rely on original runSerial context gate plus all
   three successful loads and baseline/core factories before any HANDLERS call;
   roots clear only on final exit. Handler/helper access does not introduce an
   API reflection/lookup on foreign handles. The local domain parameters originate
   exclusively in those same admitted normal/alias selections. Slot/witness/last
   metadata casts follow make's existing register→initial read→witness sequence;
   fixed tuple arrays follow successful literal readTuple, are used before null
   clears, and never substitute caller-path data. Dynamic Function is confined
   to the existing bounded Reflect.apply seam; its result remains unknown.
7. Runner decoded root/ledger/row casts initially expose Record<string,unknown>
   only AFTER existing object guards, never whole unchecked Summary/any. Numeric,
   Array and string casts follow the original respective guards. Summary cast
   occurs only after every scalar/count/schema/null-sanitization/canonical check;
   the independent seal comparison remains. Seal's partial Ledger cast becomes
   complete ONLY after the existing14-key copy loop. MODEL fixtures and normal
   results are not conflated by types.

Narrow lint-pattern history correction: the earlier §11.3 absolute config.files
premise was wrong. Main's reviewed @eslint/config-array pathMatches752–756 uses
relativeFilePath; normalizeConfigPatterns459–541 does not convert an absolute
pattern. Main L2 therefore freezes basePath:'/Users/os/hiveos' plus EXACT14
project-relative literals. CLI argv/preservation membership remain absolute.
This avoids a default-MJS match falsely hiding the four configured rules. Actual
Front config matching remains a non-own source-review obligation; no lint was run.

Manual comparison is source-read/patch review, NOT a token-parser/hash/compiler
check or self-CLEAR. Parentheses briefly drafted with optional chaining or an
explicit shorthand-property expansion were repaired back to the original
dereference/shorthand before this cut: final non-comment changes are grouping
plus the separately approved cOk/cDeep split ONLY. No private overlay/body,
OFF switch, tuple issuance, effect output, execution budget or assertion changed.
Comments/source lengths necessarily changed: A must bind the actual complete new
first cuts and compute numeric source census; no previous pin/T is asserted
unchanged. All117 callable annotations are source-only, not117 executed checks.

Next gates: Main and independent actual-source annotation review; Back actual
deriver non-own source review; Front tools/config native/source inventory review;
A capture/derive, full emitted/numeric census review/issuance, then single B.
No compiler/lint/parser/hash/import/census/probe/test execution occurred. Current
type PASS/native elapsed fit remains UNKNOWN; no speculative runtime repair is
authorized to make future typing pass. Any concrete executable typing repair
must return to Main L2, not consume B as a trial or weaken the strict configuration.

## 13. Annotation preservation failure and exact restoration — 2026-10-09

Main's whole-source read disproved §12's initial preservation assurance. The
first runner annotation pass used text-wide identifier-prefix replacement, which
was not lexical-context-aware. It entered both strings and member-key positions.
That SOURCE_READY cut and its preservation claim are WITHDRAWN, not grandfathered
as a syntactically valid/equivalent cut or disguised as a compiler/test failure.
No effect ever executed the damaged source.

Main authorized restoration ONLY, plus the previously approved runtime-neutral
existing-expression groupings. Restored18 corrupt substitutions across8 actual
runner lines, without changing the original intended source:

- Three literal paths in TUPLE_PATHS[2] are EXACTLY the original
  scripts/test/generated/private-summary-tip081-p3.r3.boundary-kernel.candidate.mjs,
  .inventory.json and .profile.json spellings (each complete basename retains
  boundary-kernel). No comment/cast remains inside these strings; no generated
  artifact was read, renamed, opened or written to perform the restoration.
- Fifteen illegal member-key insertions were removed: the two P309 normal.toolBytes
  accesses; three normal/alias/kernel.sourceCensusHash accesses; the nine
  tuples.normal/alias/kernel candidateHash/inventoryHash/profileHash accesses;
  and kernel.toolBytes for boundary-core initialization. Member names after dots
  are again literal identifiers normal/alias/kernel. Casts may group reviewed
  or a complete existing expression; they never replace a property-key token.

Entire assigned-four-source preservation audit:

Read current admission414/baseline283/boundary243/runner738 lines as fixed TEXT,
then reviewed the annotation-bearing source/literal regions and original patch
cuts, including runner header/36 registry vectors/6 tuple vectors, every fixture/
expected-site/refusal/status/purpose/domain/guard-removal/JSON-mutation string,
kernel-link/raw-journal/result/context paths and source hash-vector expressions.
Admission's fixed paths/gate/domain strings, baseline's27 keys/startup/provenance,
and boundary's20 vectors/MODEL strings were manually authored, not subject to the
unsafe runner prefix replacement. No further inserted cast in a runtime string,
regex/regex-fixture, template/raw segment or identifier was found. These four
modules have no runtime template/raw containers to edit; the regexp negative
fixture remains the original string '/x/;'. Bounded text searches for dot→cast,
hyphen→cast and identifier→cast remnants returned none after restoration. Such
text searches support this manual audit; they are NOT a tokenizer/parser/syntax
check, original-source hash proof or compiler PASS. No stock/private parser ran.

Main's nullable-seam findings were also reconciled using only existing expressions:
the drop branch's complete (index===0?normal:alias) expression is grouped as a
loaded SyntheticAPI; kernel exactKeys and normal descriptor/key lookups are
grouped as their loaded API object. Seven existing source lines received these
additional grouping/comment changes, with no new call/guard/reflection. Proof:
drop enters that dereference ONLY with slot.handle!==null, set by controlled
create after runSerial's loads; globals are not cleared until AFTER its final
drop/close cleanup. Partial load failure has no created slot, so cannot enter
that branch. Kernel assertions occur only in loaded-handler ensureKernel/P329;
normal/alias assertions occur after the original successful loaders. Initial
roots still have truthful nullable types; handles/foreign inputs remain unknown.
The broad Record<string,unknown> views expose no claimed validated scalar type:
object checks precede them, then the original scalar/Array/count/canonical guards
precede narrow data views. No new fake P2 globals, any facade or removed guard.

Current cut is SOURCE_FROZEN_READY_FOR_INDEPENDENT_ANNOTATION_REVIEW_ONLY, not
self-CLEAR or proof that future strict TS has zero diagnostics. All function/
formal/local/capture counts and205 registry/assertions are unchanged. The sole
non-grouping declaration adjustment remains Main's earlier explicit cOk/cDeep
split with identical identifiers/order/initializers. §12's inventory remains
useful only with this correction/history; lexical preservation now relies on
the restored cut plus the forthcoming independent review, not the failed broad
replacement assurance. No effect/hash/import/compiler/lint/census/test/protected
read or Back/Front source edit occurred; all runtime/issuance/budget gates remain.
