# TIP-081A — Build4 completion / NOT READY / STOP

2026-10-06. SAME RESEARCH_EVIDENCE_PROGRAM_081 Phase A, engineering only.
Direct Owner approved build-environment repair, actual preflight, ONE fresh
application build<=600s and E2E<=30min ONLY after build/package admission PASS.
This fresh allowance is consumed1/1. Four total application failures are retained;
this is not a reset, and no retry, fresh-root fallback or dev-server was used.

## Repair and pre-build verification

TIP-081A_BUILD4_ENVIRONMENT_PREFLIGHT.md E1–E3 completed for the narrow repair.
Only three owned build/start/harness files changed. Actual pinned parseEnv runs
before marker consumption; production-build rate limiting is ON, ordinary
NODE_ENV=test runtime configuration remains unchanged. Shared env/security/auth,
compiler overlay, Studio UI and original080 scientific source were not changed.

Main122unit/4files PASS1.08s, focused lint exit0 and whole noEmit/nonincremental
TypeScript exit0. Independent read-only source review found no blocker in the
frozen three-file delta. Native actual-schema negative control reproduced SEC04
for production+rate=false; positive control and frozen helper --preflight passed
with production+rate=true. Those controls had network and all writes denied,
and consumed no application-build allowance.

The four predecessor review/bundle pairs remain preserved. Main sealed successor
bundle SHA ea767fc39a4e7c0b09fb78e2f8d57b2f50ad05703e2b6dc62b69a9da09f279f9.
Main source admission111exact entries PASS:79old080pins,19owned081pins,16assets.
No historic source pins were refreshed to hide a change.

## One actual application build

Fresh owned shadow `/private/tmp/hiveos-tip081-shadow-QGsthQ`, prepared803entries,
18531243bytes. Actual build ran offline under OS network denial, denied reads
of forbidden historical attempt5 paths and writes confined to that exact shadow
including its TMPDIR. Original installed dependencies were read through the
explicit trusted link, never authorized for writes. No inherited API credentials.

Next16.2.11 webpack compiled successfully in13.4s, finished TypeScript21.4s,
collected page data and generated3/3static pages. It then FAILED during standalone
trace copying. Retained private result `tip081-build4-result.json`:

```json
{"purpose":"OWNER_BUILD4_600S","status":"BUILD_FAILED","durationMilliseconds":39510.686,"exitCode":1,"signal":null,"errorCode":null,"sourceTraceAdmitted":false,"completedAt":"2026-10-06T09:07:09.709Z"}
```

One-use marker SHA c9d46b34e3d7aae5dc1af09529262da3f5070a4220293576ccfc17c712ce1814
binds source bundle, exact root, compiler overlay and environment preflight.
Result and marker are retained, not deleted or relabelled as success. Main invoked
the pure requireBuild4Success guard after failure; it refused with
TIP081_BUILD4_SUCCESS_REQUIRED. No packaging command or application launch ran.

Actual failure included:

```text
EPERM: operation not permitted, copyfile
.../node_modules/notosans-fontface/fonts/NotoSans-Bold.ttf
  -> .../.next-tip080/standalone/node_modules/notosans-fontface/fonts/NotoSans-Bold.ttf
EPERM: operation not permitted, copyfile
.../node_modules/next/dist/compiled/jest-worker/threadChild.js
  -> .../.next-tip080/standalone/node_modules/next/dist/compiled/jest-worker/threadChild.js
```

## Confirmed packaging mechanism and accountability

Read-only checks after failure observed:

- `.next-tip080/next-server.js.nft.json` includes bare `../node_modules` among28
  entries. The specific authoring-export route trace also includes the bare
  dependency directory among69entries.
- Generated `.next-tip080/standalone/node_modules` is a symlink to
  `/Users/os/hiveos/node_modules`, not a private regular dependency directory.
- The generated threadChild.js destination resolves to that original installed
  file and has the SAME device/inode as the installed source.
- Installed Next `dist/build/utils.js` handleTraceFiles reproduces traced symlinks
  with fs.symlink, and regular files with fs.copyFile. A later regular dependency
  copy therefore targets the original dependency tree through the generated link.

The OS exact-shadow write guard correctly rejected that write-through. This is
a shadow packaging-design defect, not a user's environment or sign-in mistake,
and not a reason to relax the guard or grant writes to original node_modules.
Environment repair succeeded through page generation; compile/page generation
are not full-build/package acceptance. No new copy experiment was run after the
single-build failure. A concrete repair still needs bounded compatibility proof.

Independent reviewer separately confirmed the exact failed result, generated
dependency-root link and installed Next copying mechanism, read-only/no effects.
That review did not follow the generated link or rescan dependency/history trees;
original source/archive preservation rests on Main's bounded pin audit above.

## Acceptance and preservation

E1 actual environment preflight PASS. E2 one-use binding/failed-launch refusal
PASS. E3 unit/type/lint/pin/archive preservation PASS. E4 full application build
FAIL, standalone/NFT/dependency package admission NOT_REACHED. E5 conditional
browser/E2E NOT_RUN: its prerequisite failed, not a browser test failure.
OVERALL NOT_READY. Existing Studio A-R01..12/A-S01..12 runtime acceptance remains
OPEN; neither component rendering nor historical integration evidence substitutes
for the missing actual authenticated browser acceptance.

Final Main read-only audit re-admitted111source entries and the shadow descriptor;
79old080pins,19new081pins,16asset pins and predecessors MATCH. Exact completed
export remains120417bytes, SHA
976246818165fdfc4a01b7d89123e5d7bcbe18a63600549e99059dc312df8df2.
No current DB query/QA identity/session write, original research command/model/
checker/API/LRC/native/install/Git/migration/billing/deploy/publication effect.
No existing server stop was issued; no new3004server or browser tab was started.

## Stop and next routing

STOP: fresh build allowance0, all four failures retained. No automatic build5,
dev-server, marker reset, original dependency writes or alternate root retry.

Proposed next direct Owner routing: a narrow shadow-packaging repair that prevents
the bare dependency-root symlink from becoming a standalone write-through, while
retaining admission of every required regular traced dependency. Validate with
a tiny installed-Next trace-copy compatibility control and negative symlink/
source/NFT-boundary controls BEFORE requesting another application build. Keep
original source, dependencies, security gates, network denial and output-write
confinement intact; no broad trace exclusions or unknown dependency omissions.
This proposal authorizes no experiment or build. A future fresh build and
conditional E2E require a new direct bounded approval after repair evidence.

This checkpoint closes the authorized attempt, not Phase A or a mathematical
milestone. Native079 remains BLOCKED; no research/efficacy/formal/LRC closure follows.
