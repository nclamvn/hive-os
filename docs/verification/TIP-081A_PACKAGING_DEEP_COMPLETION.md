# TIP-081A — Deep packaging repair checkpoint

2026-10-06. SAME RESEARCH_EVIDENCE_PROGRAM_081, Phase A engineering.
STATUS: bounded diagnosis/prevention/tiny controls DONE; full product packaging
PARTIAL / NOT_READY. No application build was authorized or run this turn.
Spec TIP-081A_PACKAGING_DEEP_REPAIR.md; root-cause/next-design report
TIP-081A_PACKAGING_ROOT_CAUSE.md; exact Main results
TIP-081A_PACKAGING_TINY_EVIDENCE.json. Vibecode Builder/source-review separation
and evidence-first debug protocol were used; full architecture stayed deferred.

## What is newly established

The defect is not generic permission trouble. The controlled INPUT dependency
link also makes NFT omit resolved transitive dependencies outside its base.
Next copies the link into standalone OUTPUT, then writes through it to original
dependencies. Removing only the link can conceal missing dependencies. Actual
retained build4 contains57NFTs/3678refs but only29regular dependencies1.158MB;
its server trace lacks next/package metadata. Both mechanisms were independently
reviewed against installed Next16.2.11 source.

Source prevention now rejects the prior unsafe package instead of admitting it:
bare dependency-root NFT, arbitrary/ancestor/output links, hard-link aliases,
missing/extra/changed bytes. Exact root and each ancestor are checked first.
Application prepare/build/package CLI modes refuse old acknowledgment before
effects. No new acknowledgment or attempt reset was introduced.

Only two prior owned files changed: build helper and unit harness. Added exactly
two owned packaging probe/unit files. Original config/compiler overlay/start/UI/
shared security/schema/old080 scientific source did not change. Full replacement
materialization mechanism is NOT implemented or accepted by these guard changes.

## Actual tiny pipeline evidence

Probe1 rootI1bfpi retained:45entries4810bytes. It refused at the physical-trace
assertion before copier invocation, outer237.508416ms. Main had incorrectly
expected the unimported projectpackage JSON in a .cjs dependency trace. A separate
actualNFT-only read-only diagnosis showed baseline2files and physical8files with
all7imported dependencies and warnings0. Failed source/test snapshots and report
are retained as TIP-081A_PACKAGING_PROBE1_*. No app build was consumed.

The corrected fixture keeps the exact seven imported dependencies and independently
verifies projectpackage copying during load; no dependency requirement was relaxed.
Probe2 `/private/tmp/hiveos-tip081-packaging-s3OrEI`:

- Actual installed NFT baseline:2files, bare dependency root present,7required
  files absent including package metadata. Copier actual Next copyTracedFiles
  recreates link then receives EPERM under sourcefixturewriteDENY.
- Actual installed NFT physical input:8files=entry+7dependencies,0missing files,
  no bare root. Includes scoped/nested package manifests, transitive CJS, JSON,
  text asset. Actual Next copier writes7regular output dependencyfiles423bytes,
  hashes match and every output device/inode is independent from both inputs.
- Internal copy/trace control19.042ms, outer192.268292ms. Separate isolated load
  passed45.145042ms with value81 and engineering-only asset, after actual OS read
  denial of both originalfixture and originalinstalleddependencies was confirmed
  by negativecontrols returning EPERM. Network and all writes denied during load.
- Final fixture64entries7898bytes, input1939bytes unchanged, within128/1MiB bounds.
  Generated server.js was NOT executed; there was no application compilation.

Copy/load phases are distinctly evidenced. The create-only run record remains
TINY_COPY_PASS_LOAD_PENDING; Main's separate load evidence records the subsequent
actual pass, without rewriting that original record. Probe code requests OS
isolation, but only Main's enforced policy plus negative controls establishes it.

This is a tiny benign module closure proof, NOT full Next-server/native/bootstrap/
actual application/runtime correctness. The copied projectpackage check is
separate from raw NFT output. No official benchmark or mathematical claim follows.

## Verification and preservation

Final Main153unit/5files PASS1.18s (31newdistinct, previous122 retained), focused
lint exit0/1.840007s and whole noEmit/nonincremental TypeScript exit0/26.009219s.
Earlier pre-correction153PASS1.14s/type28.955315s and first probe refusal remain
history, not additional distinct tests. Test wrappers/diagnostics/probes remained
within900s aggregate/120s per suite; type/lint within180s each. No app build.

Direct CLI prepare/build/package refusal controls PASS under network/allwriteDENY.
New guards also directly refuse actual retained build4 bare NFT and linked output.
Separate read-only reviewer confirmed final source/correction, no remaining blocker
in bounded prevention scope; reviewer executed no tests/probes/writes.

Main seals source bundlee730b4b949965b1b5aa1459167c3246c46728a7a209c102ba5c73006383e12f2
and reviewf4bb2a633f14fb157a25e6eb246316c5d229472c176802bbd0eecbc5919a0d32.
115exact entries admitted,79old080pins/21owned081pins/16assets/2support MATCH.
PRE_PACKAGING review/bundle and allfourearlier pairs preserved; only build/harness
prior deltas admitted. Completed export remains120417bytes/SHA
976246818165fdfc4a01b7d89123e5d7bcbe18a63600549e99059dc312df8df2.
Exact build4 metadata stays BUILD_FAILED39.510686s: marker c9d46b34...,
result6c7871e1142efb870b7617de700a6d6828eac9359d7d57c4ed9565066dfc2ad4,
descriptor53f484a6... unchanged. Scientific originals/commands were not mutated.
No DB/authidentity/model/API/LRC/native/install/Git/deploy/billing/publication.

## Requirement and scenario coverage

P1 rootcause PASS; P2 prevention PASS; P3 actual tiny pipeline PASS after retained
fixture refusal/correction; P4 pure refusal/regression controls PASS; P5 scoped
source/archive/history seal PASS; P6 explicit open-gates/STOP report PASS.
Bounded task6/6requirements,6/6mapped scenarios accepted for diagnosis/prevention.
Full-product materialization OPEN/P1engineering blocker. PhaseA A-R01..12/
A-S01..12 runtime/package/browser acceptance remains OPEN; E2E0, server0, build0.
OVERALL PRODUCT NOT_READY; no ship/production/native/formal/math acceptance.

## Stop and concrete next decision

STOP after this bounded repair. Four historical failed application builds remain;
fresh application-build allowance0. No newroot app retry, oldack reuse or devfallback.

The installed compiler SWC121773448bytes alone exceeds64MiB total copy limit;
TypeScript9112572bytes exceeds8MiB single-source copy ceiling. A full physical
compiler snapshot requires a different resource contract and is not silently
performed. Exclusion-only/hard-link/originalwrite fixes are rejected.

Recommended next Owner decision: approve a source-bound two-stage shadow packaging
mechanism. Keep compiler resources read-only; reconstruct complete runtime closure
with guarded installed-NFT APIs; materialize and verify a regular independent
package under existing output caps, including package metadata/assets/required
server files and generated routes. Preserve raw NFT predecessor evidence rather
than silently rewrite it. Prove the mechanism and actual runtime closure offline
BEFORE requesting a new application build. Unknown imports/outputs/cap excess
refuse; no full-product success presumed from this tiny demonstration.

That is a packaging layout/pipeline revision beyond the old loader-only contract,
so needs direct human confirmation. Output undefined vs a documented adapter seam
remains an implementation choice to review within that next approved design.
No broad tracing root, installed Next patch, original dependency write permission
or source/science gate relaxation. A future<=600s application build/conditional
<=30min E2E needs a separate explicit approval after mechanism evidence.
