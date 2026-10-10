# TIP-081A — Narrow actual route classification repair
2026-10-07. SAME081 Phase A / D8step3 / I2–I5 input-universe only.
Direct Owner approves focused repair and one new read-only feasibility probe after
the prior ROUTES_REFUSED STOP. No new family, runtime graph, build or cap grant.

## Evidence first
Main diagnostic read only pages/app manifests with original25 lineage/source pins
before/after, sandbox no writes/network/.env/protected reads. Pages manifest is
30bytes SHA f79d77e6b5217464cbeb4a002eda67303f04ac657e64aeb61bbeeebf51aba6fd:
single /500 -> pages/500.html. App manifest54 entries/all.js,
4620bytes SHA ce53c060567b22222e3c1fe114a18a90b34404011b724c5fde3552c701d54409.
Diagnostic71.016334ms,4reads9300bytes includes independent hash rereads.
Installed Next16.2.11 server/require.js100–103 reads .html as data; build/index.js
2243–2256 creates pages/500.html mapping. No installed tool or product evaluated.

## Small repair / acceptance
R1 Producer accepts pages-manifest pages/*.html as a static acquired file with
PAGE_ROUTE provenance, NOT a graph execution entry. Existing.js routes retained.
App paths stay JS-only. Strict paths/schema, missing/symlink/hardlink/unsupported
extensions unchanged; unrelated HTML shapes remain unsupported, not absent.
R2 Independent verifier implements same supported class itself, not producer
classification helper; test real /500 fixture and rehashed provenance/entry tamper.
R3 Existing regression suite +focusedlint/whole noEmit TSC then one real fixed-root
probe and independent inventory verification if acquisition succeeds. Preserve any
refusal; no second retry or follow-on scope. Actual graph stays UNRUN until caller-
inclusive pre-growth ledger exists, fullRuntimeClosure NOT_ACCEPTED throughout.

## Process / constraints
Builder producer/test and independently authored verifier/test only, Main effects.
No framework/API/schema/receipt/cap widening except evidence-backed supported
static-route class. Two focused new named controls with grouped negative cases,
not a new test family. Preserve four prior inventory files/source bundle/review
before edits; write separate successor source pins, keep earlier docs immutable.
No RRI/blueprint redesign because architecture and target do not change.
Remaining cumulative ceiling 499.900709s of900s,
no reset; units/probe120s/lint/type180s/64MiB logical/20k entries, tiny1MiB128entries.
No generalNFT/installedtree walk/transitive expansion/target/native imports/copy/
server/browser/DB/model/API/Git/deploy/math; protectedhistorynever read/stat/follow.
STOP actual acceptance of supported input class or concrete next blocker.

