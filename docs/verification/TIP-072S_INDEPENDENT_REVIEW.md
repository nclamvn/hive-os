# TIP-072S independent mathematical and frozen-product review

Date: 2026-10-05. Status: OFFLINE_PROOF_AND_DIAGNOSTIC_PASS;
READY_WITH_DEFERRED_PREEXISTING_REPOSITORY_INVENTORY_GAP.
Independent local model review and exact arithmetic reconstruction, not formal
verification, external peer review, native agent-loop or scientific admission.
Reviewer edited ONLY this new report. No product/test/proof/manifest/handoff edit.

## Frozen inputs and process

Read AGENTS.md, durable handoff, Q/R proofs, Vibecode Kit/verification protocols,
the complete resealed S contract, Main's complete proof, and frozen product,
tests and Builder report. The original contract's absolute-speed threshold
omitted U; reviewer identified that dimensional typo and Main resealed BEFORE
acceptance. The superseded a4334ad... pin is not the accepted contract.

Accepted SHA-256 pins:

- Contract TIP-072S_FULL_PRESERVED_PERIOD.md:
  48646058ef6adc30cb0829774f8c89d5e66fcfe4a122237e17de696cf1d0e599.
- Proof LRC_FULL_PRESERVED_PERIOD_2026-10-05.md:
  6722691dbb7c811c4727f87704af77a79fc5e23144f1e0c73511a25bf6c3e7f8.
- Product scripts/research/lrc-full-period-replay.py:
  557181c0788421f9553cb8810b8debb1ec08372c9779aa28f87bb4ce8fb9dae7.
- Tests tests/research/test_lrc_full_period.py:
  afd70b98e8dbb36d8e286fc1b4c5430569af12b929e0211ba1f2c91229331b56.
- Builder report TIP-072S_BUILDER_COMPLETION.md:
  65663c59eb09bef395babb0782813f75e79014cabb392dc1f8bfad9e421712c2.

Before freeze, Main also corrected the named beta field to ||gapCoordinate||/q.
The frozen product, tests and this independent oracle use that normalized
alpha-phase distance, separately from the signed gap-coordinate offset.

## S1/S2: written mathematical proof PASS

Independently derived the preserved period dg, effective orbit q=g/gcd(v,g),
closed safe arc [rho,1-rho], automatic condition q(1-2rho)>=1, parity-dependent
gap centers, exact nearest-safe distance and lower-center tie convention.
Verified q1 recovery, equality GOOD, actual lower margin L>=eta including R0,
and actual speed threshold rU/[d(L-eta)], never dividing by zero for positive
r at zero slack. Verified the nonenumerating ceil/inverse selector; negative
ceil values are legal and inverse modulo1 is absent.

Whole-tuple gcd H is coprime to d and divides g. Effective q values survive
normalization, and prime-power valuations prove g/H=lcm(all q). Consequently
the normalized residual lower-gcd strata are {1,2} for n14 and {1,2,3,6} for
n13. These are finite gcd strata, NOT finite absolute-speed domains. Lower
LRC9/8 remains an explicit existence premise when no exhibited witness is
provided; this review does not independently establish those lower theorems.

All fixture identities and scope distinctions passed. The q3/q4 hostile cases
defeat every original five shift; the genuine q2/q3 perturbative cases already
have other original GOOD indices and are correctly NOT called original-grid
obstructions. The billion-period control defeats max-speed-only selection.
No mathematical revision to the frozen written proof was requested.

Primary source comparison was actually browsed: Kravitz arXiv v1 Section4
pre-jumps/Theorem7.2 large-gcd argument, and Allikvere v2 Lemma2.2 effective
gcd orbit/Lemma4.6 divisor-shift counting. These foundations are established.
The present adaptation is useful inside this program; priority/novelty is NOT
established. Sources:
[Kravitz](https://arxiv.org/html/1912.06034v1#S7),
[Allikvere](https://arxiv.org/html/2609.02604v2#S4.SS4).

## S3/S5: independent complete deterministic-body reconstruction PASS

Reviewer wrote and ran a read-only scratch oracle, importing NO product/test
mathematics helpers. For small nonautomatic q, nearest-safe movement came from
explicit closed safe-arc endpoints, not the product gap-distance expression.
The secondary inverse was independently computed by extended Euclid, not the
product's pow call. Every standalone certificate and full fixed-report body
matched: ALL880 original/successful matrix coordinates, ALL60 lower-witness
distances, ALL35 complete18-column candidate rows, every label/input/target/
g/H/gPrime/L/U/R/selection/adjustment/secondary datum, all BAD/GOOD sets,
lowest physical GOOD witnesses, scope, counts, definitions and exact refs.

Main-approved fixed-report-only deduplication retains top-level scope and
candidateColumns, with exact body.scope/body.candidateColumns references.
Standalone certificates retain complete definitions. All arithmetic data are
present, and the complete deterministic body digest binds definitions and refs.
Builder/Main reported an earlier33,540-byte OUTPUT_REFUSED attempt with no
positive JSON; that prefreeze refusal is historical, not this reviewer's fresh
run. No cap increase or dropped distance/candidate row was accepted.

Reviewer fresh inspected-BYTE child, Python -I-S-B, minimal six exactfalse
flags, empty stdin, shell=False, timeout5s; source bytes unchanged pre/post:

- Exit0, stderr0B, stdout30,406B including newline.
- Arithmetic elapsed13.651083ms; charged operations829,460.
- Process elapsed49.774084ms.
- Complete semantic digest:
  4afb7cf0818eb41f6a2d3d085b1290483c97177e909cebdc1b9f47a050804548.

Fifteen coherent rehash controls changed scope, refs, column semantics, beta,
absolute threshold, selection, retained coordinates, lower witness, target,
secondary shift, normalized gcd, UNKNOWN classification or counts. Each was
rejected by REVIEWER whole-body equality despite having its own coherent hash.
This is NOT a product validator for externally supplied certificates.

## S4: fresh unit and independent hostile checks PASS

Fresh command: python3 -I -S -B tests/research/test_lrc_full_period.py.
33/33 unittest methods PASS,1.404s. Thirty flag-fault and three option-fault
subtests are not inflated into that method count.

Additional reviewer-owned read-only checks:

- 1,376 frozen-product exact geometry/inverse cases over BOTH targets,
  q1..12, rational phases and all generated gap centers/endpoints PASS.
  Independently compared closed safe intervals and checked the selected phase.
- Three complete zero-slack cases PASS: automatic q3; nonautomatic q1 with
  multiple safe candidates; nonautomatic q1 with only speed24 safe. The last
  selects original index13, T16/75 and full minimum exactly1/15.
- 28 additional plain-type/no-hook/extra-authority/path/rational/speed/limit/
  deadline/operation/output-preflight refusal controls PASS. Oversized output
  refused BEFORE any whole-tree dict/list JSON serialization.
- Independent AST/call audit PASS: nine allowed stdlib import roots, zero
  forbidden file/network/process calls, only six named environment reads and
  stdout/stderr writes. No stdin read; no range proportional to q/g/speeds.
  The native inverse reserves bounded bit-work before execution.

An earlier reviewer scratch stopped at its OWN incorrect zero-slack selection
expectation: speed7 was already safe, so min(D,index) selected index12 rather
than the asserted speed24/index13. Corrected that expectation and reran the
entire supplemental check successfully; no product/test/proof change followed.
Main's cleaner only-speed24 control then independently passed as a third case.
This reviewer fixture error is not a concealed mathematical/product failure.

The prefreeze mathematics-only scout also completed6,612 exact phase cases
over four rho values; that evidence is separate from the frozen-product1,376
cases and is not added to the unit-method count or used as universal proof.

## S6: inventory remains deferred, not whole-repository green

Independent CURRENT inventory inspection:122 listed entries,129 actual
contractor artifacts; all122 listed hashes MATCH, no missing listed file.
Current manifest SHA-256:
1018bb8ea5d5ad0b11bde8ee321526ca7d891b33540919d797cfc99c17603d38.
The seven unlisted paths are exactly the known research-program-v2 files:
CORE_SCOPE.json, CORE_SCOPE_REVIEW_NOTES.md, INTEGRATION_SCOPE.json,
INTEGRATION_SCOPE_REVIEW_NOTES.md, SEAL_ACCEPTANCE.md, UI_BENCHMARK_SCOPE.json,
UI_BENCHMARK_SCOPE_REVIEW_NOTES.md. Their historical preservation is Main's
baseline evidence; reviewer independently confirms their current inventory.
No unrelated reseal, exclusion or deletion was performed.

Main separately reports fresh contractor-manifest1/1 FAIL on inventory equality
(09:56:12 local,143ms duration); this review does not re-label that as its own
Vitest execution. Deferred S-INV-01 P2 needs owning-scope review before admission.

Requirement review: S1/S2/S3/S4/S5 PASS; S6 checked with explicit inventory
DEFERRED. Six of six requirements inspected; five unconditional PASS, one
READY_WITH_DEFERRED. Main final preservation/handoff/acceptance remains owned by
Main. Build/types/lint SKIP justified: additive Python/docs only, no Next/TS/UI
or dependencies changed; no fictitious zero type-error count is asserted.

## Authority and research limits

Caps remain5s/2M charged operations/32768 complete JSON bytes/256-bit rational
components, one whole-run budget. Accounting is not cryptographic CPU/runtime
attestation. Local source-byte consistency is not signed host/interpreter or
executable-closure evidence. AgentLoop NOT_RUN; executionAuthority false.
No browser E2E, native research job, M1/campaign, scientific-case/DB/session/
provider/API/private-capture/archive/schema/env/install/Git/billing/deploy write.
Full072 remains PARTIAL/NOT_READY_FOR_M1, with old admission predicates intact.
Global LRC, full archived branch, formal/external verification, literature
novelty and mathematical breakthrough remain NOT_ESTABLISHED.
