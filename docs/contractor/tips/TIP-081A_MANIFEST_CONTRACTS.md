# TIP-081A — Data-only runtime manifest contracts

2026-10-07. Direct Owner “triển khai bước kế tiếp” approves the preceding
data-only acquisition / independent manifest / bootstrap prerequisite proposal.
SAME081 Phase A engineering, exact open T2/T3 and source-contract portion of T4.
This is D8 step2 implementation, not authorization for product trace/copy/build.

## Routing / ownership

Implement a source-only producer/resolver and separately implemented verifier plus
source-derived launcher contract. No changes to the frozen23-file accepted source
bundle or legacy runtime/build/start helpers. A separate successor manifest source
bundle binds exact base844f824ecdd755205e748ec562b487caf4aca1f02302af28f6bc35add528ac0f
and review4151805883669bead2087e956b445c9e2bd66d87cf2685897ef037d88eb78772.
Old seven predecessor pairs, failedbuild4 and archived scientific evidence remain.
Main docs/effects/sealing; Builders own new modules/tests only; peer read-only.

## Contract / scope

M1 A byte-bound in-memory input inventory (Map of exact relative path->Buffer)
and exact entry set, profile/epoch labels, deterministic digests, no mutation.
Paths reject .env/.git/artifacts/protected/attempt5, traversal/special/control/
backslash/absolute/duplicates/prefix collisions, and unsupported package metadata.
Limits <=64MiB combined analysis data/20000inventory+site entries, <=120s per
suite/probe within existing900s cumulative (198.268070125s already consumed).
Tiny fixture <=1MiB/128file entries. No source/public/static copy limit is changed.

M2 Syntax-derived producer on JS/CJS/MJS, JSON and opaque asset/native classifications.
Use installed Next compiled Acorn as a pinned trusted TOOL, never import/evaluate
target files. Exact parser sha3c141146168735659c30b29c925fbf9fdf4d12ad85eb83d68e2afb26a1cc248d,
metadata sha aa6eff9593179bc7379017992eda314ce97bd7c6576869d82d514139ce612cca.
Tool121634B+metadata read nofollow; no NFT/TS/compiler/native/package-helper imports.
Record exact source offsets, kind, literal/dynamic specifier, conditions/package
metadata dependencies and SHA. Parse failures/unsupported file formats stay OPEN.
Require/import/export/require.resolve and computed loader references must surface;
shadowing, aliases, context loaders, eval/Function, unknown calls/filesystem/native/
dynamic expressions have explicit conservative OPEN obligations, never silently
accepted. No regex-only syntax proof. No dependency input effects even for hostile
code. Unknown semantic behavior cannot yield full runtime acceptance.

M3 Data-only resolver over supplied inventory, not runtime Node resolution or fs.
Exact relative/CJS extension/main rules and bare/scoped/nested packages; fixed
node production import/require/default conditions and builtins explicit.
exports/imports exact supported keys honor order and encapsulation; wildcard,
array/complex/invalid/escape/ambiguous features unresolved rather than fallback.
Record package.json provenance and absent candidate universe assumptions.
No arbitrary Node resolution/import/require/glob on target. Unsupported semantics
must not fabricate a resolved edge. Opaque native/sharedlib/assets are not closure.

M4 Independent verifier reconstructs entry/file/digest/source-site/edge/obligation
universe from original inventory; must not call producer/buildCandidate or trust
candidate status/fullness. It may share immutable schema/path helpers and pinned
parser, but has its own traversal/comparison and independent resolution validation.
Detect removed/reordered/extra/tampered sites, target/condition/package/epoch drift,
invented entries or disposition clearing. A static-graph match is labelled
STATIC_GRAPH_VERIFIED with fullRuntimeClosure:NOT_ACCEPTED, unresolved obligations
retained; never a product materialization/build/start capability. Finite fixtures
and shared parser assumptions recorded honestly.

M5 Root launcher contract derived from exact Next16.2.11 utils.js
df5d27cf5100a99ad07e627158880d172617a2c28006a3488c3856995d30bc5e.
Source/template/config SHA bind production/isDev:false/allowRetry:false, package
CJS/ESM choice, cwd, relocated relative distDir, private serialized config,
next/start-server seeds and keepAlive behavior. Secret/prototype/unsupported values
reject; output source only, never executed or materialized. Raw required config
must be source-reviewed; no arbitrary caller config earns accepted launcher.
No QA/auth/provider/DB edits or fallback. Missing root/assets remains OPEN.

M6 Main fullsource review+independent adversarial review before effects; units
including prior209, focused lint/whole noEmit TSC in OS network/protected/.env deny,
repo writes denied (unit exact temporary fixture writes only as required).
Negative controls for forged completeness/no-effect target/edge omission/alias/
conditional/nested/exports/native/parse/path/resource/bootstrap and verifier parity.
Separate source pins+completion with quantified scoped coverage vs fullT2–T5 OPEN.
No Git/model/API/install/general product reads/trace/copy/new appbuild/server/E2E.
Stop at accepted source contracts or substantive unsupported/architecture blocker.

## API coordination

Producer module scripts/test/runtime-tip081-manifest.mjs exports:
createManifestSnapshot({files,entries,profile,epoch}), analyzeManifestSource(snapshot,file),
resolveManifestSpecifier(snapshot,importer,specifier,mode), buildManifestCandidate(snapshot),
loadManifestParser(), canonicalManifest(value), manifestDigest(value).
Snapshot owns copied Map bytes and sorted entries; schema agreed by Builders in
messages before authoring. Verifier scripts/test/verify-tip081-manifest.mjs exports
verifyManifestCandidate(snapshot,candidate) and buildLauncherContract(input).
Tests new evidence-studio-manifest.test.ts / evidence-studio-manifest-verifier.test.ts.
Verifier must not import buildManifestCandidate/analyzeManifestSource/resolver.
No changes to legacy configs/helpers. No CLI product loader at this stage.

## Main/peer M5 clarification

No actual reviewed required-server-config receipt is acquired in D8step2.
Caller-supplied config/review digests are integrity declarations, not authority.
Launcher generation ALWAYS reports SOURCE_CONTRACT_ONLY,
reviewedConfigAuthority:NOT_ESTABLISHED and fullRuntimeClosure:NOT_ACCEPTED.
This is acceptable M5 source-contract delivery, not T4 root/bootstrap closure.
Independent peer agreed; no extra product read or execution grant follows.

## Main/peer accounting clarification

The64MiB ceiling is deterministic logical analysis accounting, NOT a process-RSS
claim: copied inventory bytes plus canonical snapshot/analysis/site/edge/
obligation/candidate/verification metadata must be charged, with entry/site counts
checked before growth. Parser AST memory is not measured RSS; source/visit limits
and the parent120s deadline provide separate safeguards. Pinned tool overhead
is recorded separately, not copied runtime payload. No universal product fit
or copy-budget acceptance follows from a bounded fixture.

## M3 condition subset clarification

Local Node24.14.1 embedded internal/modules/esm/utils includes node-addons and
module-sync among potentially active runtime conditions. Snapshot profile does
not authenticate a complete execArgv/condition envelope. Both resolvers therefore
support only node/import/require/default keys in each visited conditional object;
any other key there refuses as UNSUPPORTED_EXPORTS/IMPORTS, never fallback.
Insertion order/null blocking and known opposite-mode skipping remain. Selected
nested objects are checked; contents of inactive known opposite-mode branches
are not traversed or certified. This models a conservative subset, not all Node
conditions. Pre-correction281PASS source/log checkpoint is retained separately.
