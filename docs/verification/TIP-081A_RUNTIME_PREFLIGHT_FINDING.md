# TIP-081A — Retained generated-output size finding

2026-10-06. SAME081PhaseA, approved two-stage offline packaging T3/T6.
Main performed read-only bounded lstat/readdir of exact retained build4 server,
static and public roots under network/write denial and attempt5 read denial.
No application build, NFT execution, copy, package import/server or DB effect.

## Observed before any supplementary trace/materialization

- Exact predecessor root: /private/tmp/hiveos-tip081-shadow-QGsthQ.
- Generated server:249 regular files /23579033bytes.
- Static:139 regular files /2628053bytes.
- Public:1 regular file /1byte.
- Enumeration total560entries (files plus directories), within20000.
- Largest required generated route:
  .next-tip080/server/app/w/[workspaceSlug]/research/math-tools/page.js,
  **13448165bytes**, greater than existing **8388608bytes** per-file copy cap.
- Existing source snapshot accounted cost18531243bytes. Existing total copy cap
  67108864bytes; remaining aggregate capacity cannot cure a per-file violation.

This is a size diagnostic, NOT complete runtime closure or successful packaging.
Only bounded stat sizes were collected, not a hash/acceptance of the oversized
generated file. Do not read/copy it through a larger hidden allowance, skip the
route, split it artificially or exempt generated files from the approved cap.
The new actual planning preflight must reject it before NFT/output copy. This
diagnostic is separate from the one allowed actual runtime NFT diagnostic, which
has NOT been invoked. Preserve old BUILD_FAILED marker/result/descriptor.

## Consequence

T3 complete actual product inventory/package remains NOT_ACCEPTED under current
contract. Source mechanism/tiny adversarial controls may still be verified, but
cannot authorize build/server/E2E. Stop at offline mechanism checkpoint and report
this exact blocker. A future layout/copy-policy revision requires direct human
approval and preserved history; a fresh app build/E2E grant remains separate.

## Main correction — copy-policy provenance (authoritative)

Independent contract audit corrected Main's initial reading. Original copyTree
applies8MiB to source snapshot/public/static copies. Original regular dependency
verification uses64MiB remaining aggregate, and Next's generated-route copier has
no universal8MiB file cap. The plan/TIP owner envelope did not declare a universal
runtime-generated8MiB ceiling. Therefore the new helper's all-runtime8MiB gate,
and its combined snapshot+output64MiB accounting, are newly conservative Main
implementation policies, NOT inherited universal Owner ceilings.

The observed13448165-byte file and actual refusal remain true. They do NOT prove
a violation of the inherited runtime contract or a need for a budget increase.
Preserve this earlier assumption and refusal history; do not relabel the old
failed build or erase the finding. Source-copy8MiB protection remains unchanged.
No guard is loosened or actual runtime trace/copy/build authorized by this
correction. Unknown dynamic/native analysis and bootstrap integration remain
independently OPEN, so real materialization still refuses. Completion must report
a PARTIAL bounded mechanism, not full closure blocked solely by an Owner cap.
