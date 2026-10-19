# TIP-081A — Tiny probe1 retained refusal

2026-10-06. Owned root /private/tmp/hiveos-tip081-packaging-I1bfpi,
prepared45entries4810bytes50.541708ms. Main actual installedNFT/copy control
under networkDENY, exactrootwrites, source/physicalinputwritesDENY returned
TIP081_PACKAGING_CLOSURE_REFUSED before copier invocation. Outer237.508416ms,
exit1, no application build/server/DB/model effects or result publication.

Exact source/test cut retained separately as PROBE1_SOURCE.txt / PROBE1_TEST.txt
before correction. Original fixture and its source-bound descriptor stay retained;
do not reuse/reseal it after source changes. This is a tiny fixture assertion
failure, not another application build or evidence of complete packaging.

Main subsequent actualNFT-only read-only diagnostic (allwrites/networkDENY):
baseline files are entry.cjs,node_modules (2), warnings0. Physical files are
entry.cjs plus seven exact dependency files including both package metadata,
transitive JS, JSON and asset (8), warnings0. The extra expected project
package.json is NOT a dependency of this .cjs entry; copier handles project
metadata separately. All seven imported dependency files are present.

Approved narrow fixture correction: exact physicalNFT set is entry+7dependencies,
not entry+projectpackage+7. Keep all required dependency metadata/bytes and separate
copier/load projectpackage validation. Do not widen allowed paths or suppress
missing/extra dependency assertions. Fresh tiny control fixture permitted within
same bounded QA envelope; previous refused root and source snapshots preserved.
Full product materialization/native coverage/build/E2E remain OPEN/noauthority.
