# TIP-034 Builder B completion report

STATUS: DONE for assigned R01/R02 source/method deliverables and R08 note corrections;
product integration and independent Contractor acceptance remain separate.

## Files

Created:

- `src/modules/research-sandbox/adapters/math-source-status-fetch.ts`
- `src/modules/research-sandbox/math-source-status.ts`
- `src/modules/research-sandbox/math-method-map.ts`
- `tests/unit/math-method-map.test.ts`
- `docs/operations/MATH_RESEARCH_LITERATURE_STATUS_2026-10-01.md`
- `docs/verification/TIP-034_LITERATURE_MAP_COMPLETION_REPORT.md`

Appended a dated withdrawal correction only:

- `docs/operations/MATH_PILOT_SPLIT_SUPPORT_RAYS_2026-10-01.md`
- `docs/operations/MATH_PILOT_A19_OBSTRUCTION_FRONTIER_2026-10-01.md`

No old mathematical packet, pinned replay, frontier schema, cycle/worker/UI
source, manifest, handoff, database or Git state was changed by Builder B.
Concurrent unrelated dirty work was preserved.

## Requirement/AC coverage

- R01: exact three-publication server URL allowlist; current status capture;
  selected/latest version distinction; timestamps/freshness; normalized status
  content and observation digests; unavailable and publication-wide withdrawal.
- R02: six distinct method families/cards with version-qualified source IDs,
  assumptions, obstruction, root bridge, tools and explicit evidence ceilings.
  Root contract, frontier dossier, card content and packet identity are bound.
  The corpus is partial; no card confers mathematical premise authority.
- R03 seam: separate clock-free integrity and new-dispatch admission exports;
  same-packet transport/pre-planner retention belongs to Builder A.
- R04/R05 seam: finite method/family schemas and explicit READY/MISSING tools;
  ranking/deferred obligations and portfolio integration belong to Builder A.
- R07 assigned controls: rehashing source/card promotion fails; malformed
  capture/duplicate history, supersession, stale/future, unavailable, alias,
  redirect/final-host/media/size and absolute stream-timeout controls pass.
- R08: both historical Jiang comparison notes now have append-only corrections.

## Verification

Focused command:

```sh
npx vitest run --project unit tests/unit/math-method-map.test.ts
npx eslint src/modules/research-sandbox/math-method-map.ts src/modules/research-sandbox/math-source-status.ts src/modules/research-sandbox/adapters/math-source-status-fetch.ts tests/unit/math-method-map.test.ts
```

Result: **9 tests in 1 file passed; lint 0 errors, 0 warnings**. No global suite
or integration run was duplicated while other Builders were changing owned
product sources; Contractor performs serial final checks.

Primary-source browsing verified current official records for Tao/Elsholtz–Tao,
Salez and withdrawn Jiang. Full relevant passages checked: Tao v2 Proposition
1.2/Remark 1.3/Proposition 1.4; Elsholtz–Tao v6 introduction/Theorem 1.1/Remark
1.2/section 2; Salez v1 Proposition 3/Corollary 1/sections 3 and 4. Historical
v2 is not misrepresented as latest v6 or as a full reviewed current paper.

Initial sandboxed Node collection returned `TypeError: fetch failed` for all
three URLs, preserving the unavailable path. A permitted read-only retry then
used the unchanged collector on the three official HTML pages. Actual parsing
and `verifySourceStatusObservation` passed: Tao ACTIVE/v6 (5,042 normalized
bytes), Salez ACTIVE/v1 (4,055 bytes), Jiang WITHDRAWN/v2 (5,653 bytes). Exact
status-page fingerprints are recorded in the literature audit note. These
checks read public pages only: no model API, application DB/ledger or worker
was run. Status validation is not mathematical theorem verification.

## Decisions, limitations and deferred gates

- ACTIVE means no withdrawal observed, never mathematical certification.
- Historical V1 semantics are frozen; future corpus/quarantine changes require
  a versioned policy rather than silently invalidating retained packets.
- Source observations use normalized status-page content digests, not raw HTTP
  or complete mathematical-paper fingerprints. Server collector provenance is
  a trusted runtime boundary, not a digital signature recoverable from a hash.
- A fresh packet can retain explicit unavailable/stale observations as leads;
  those cards remain non-authoritative. Entire stale/future packets are not
  admitted for new dispatch; future source observations are rejected even if
  the publication is also quarantined.
- The support-uniform bridge is an unverified project direction. Missing tools
  have no fabricated execution status. Existing standalone rays are not newly
  claimed as a cycle tool.
- Fixed fetch targets exclude user/model URLs and redirects; this deliberately
  is not a generic DOI crawler or provider API workflow.
- No novelty/root breakthrough, same-budget held-out science success, live
  campaign, browser E2E, paid model call, worker/DB mutation, Git push or
  deployment claim is made here. Product role forwarding and UI are A-owned.

Known review findings corrected: explicit future freshness for withdrawn
sources; v2 method applicability labeled historical; duplicate version-history
records rejected; status notices are not inferred from abstract/title keywords;
UI em dash removed. Independent skeptic review remains Contractor-owned.

Post-review B hardening: identity-only normalization now covers legacy HTTP
arXiv, dx.doi.org and safely decoded URL paths, including Crossref-style
percent-encoded DOI slashes. Tests retain rejection of malformed/double
encoding, arbitrary hosts, userinfo and nonstandard ports. The fixed fetcher
still accepts only its three exact HTTPS server-owned targets. This does not
change frozen V1 card/status semantics or any historical ledger bytes.
