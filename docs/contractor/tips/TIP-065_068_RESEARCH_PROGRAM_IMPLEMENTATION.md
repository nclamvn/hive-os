# TIP-065–068: LRC research program v2 — offline implementation

Date: 2026-10-04. Priority P0 (065–067), P1 (068).
Status: SEALED_G1_OFFLINE_IMPLEMENTATION. Working directory `/Users/os/hiveos`.
Dependencies: approved research-program blueprint and Contractor pre-seal review.
Main is Contractor; three existing Builders implement under Vibecode Kit v6.2.

## Authority and incorporated specification

The direct human request, “triển khai tiếp tục công việc của chúng ta với bài
toán LRC 14 và 15 sau khi nâng cấp phương pháp”, supplies G1 offline approval
following the previous planning gate. It is not G2 model/forest authorization.
The historical proposals keep their original APPROVAL_REQUIRED headings.

Read the full incorporated documents, not only this dispatch summary:

- `docs/proposals/BLUEPRINT_MATH_RESEARCH_PROGRAM_V2.md`, SHA256
  `c0aac1b91d6f274f3d5e514c8bbac1ad44bbd115eda892158d0f4d1b1c3697e6`.
- `docs/proposals/TIP-065_068_RESEARCH_PROGRAM_DRAFT_PACKS.md`, SHA256
  `b42ffff08dcca56ffa59d73963d15bfb6887c80bec63c68eefe9a3f848cd6c40`.
- The three scope JSON/note pairs and their exact pins in
  `docs/contractor/research-program-v2/SEAL_ACCEPTANCE.md`.

The blueprint's R1–R12 and the draft's twenty named D1–D5/C1–C5/M1–M5/U1–U5
criteria are binding acceptance requirements. This TIP is executable only with
the accompanying Main seal acceptance. Later implementation hashes are frozen
after review, before any G2. Identity alone never establishes mathematics.

## Accepted exact scope

Preserve the integer-speed convention: 14 total runners means 13 moving speeds,
15 total means 14. Exact source v2 ordered prime sets have 61 and 71 entries;
archived 111-prime v1 cannot substitute. Deterministic master: 436 obligations,
bounded to 512 nodes/4096 edges/1024 references/512KiB. All critical implications
require admitted statement/domain/quantifier/assumption-aligned artifacts, not
just closed nodes, coherent hashes or DAG connectivity. Source-adopted closure
stays conditional; default trust is NO_SOURCE_ADOPTION. No fresh global proof.

First unit is the known conditional few-exception shift lemma for fourteen
positive integer speeds: assume LRC(m), 1<=m<=12; d prime, e>=2 exceptions,
m_d=ceil(2d/15), e*m_d<d. Finite checker supports only d3/e2 and d5/e2..4.
Canonical rational offsets, strict bad boundary (<1/15; equality GOOD), complete
unit partitions, all critical boundaries/singletons/open cells including wrap,
and exact tuple-mask complement are required. Consumer independently derives
coverage and arithmetic; it never invokes producer or old collectors to verify.
Input/certificate <=32KiB; parsed AND intermediate components <=256bits;
producer+consumer together <=5s cooperative/2M charged operations. Finite
arithmetic does not prove the lower theorem, real witness or analytic alignment.

New additive LRC_METHOD_UNIT contract-v4/ledger-v7 only. New lane ordering:
SOLVER -> ADVERSARY -> actual host finite check -> CRITIC. Solver may provide
<=2048B seed inside its aggregate16KiB math output, never a checker receipt.
Host-only ledger finite evidence <=32KiB records exact lineage/input/source and
actual check outcome; immutable solver attempt is not retroactively patched.
Critic sees solver payload plus <=1024B host summary/finiteEvidenceDigest, not
adversary prose. Missing seed gives MISSING with null execution data and an
INCONCLUSIVE audit. Well-formed unsupported/semantic certificate-refusal records
may reach conservative critic; operational/integrity/storage/accounting failure
hardstops. RESOURCE_REFUSED from checker budget also hardstops model dispatch,
while passive schemas may retain/read the truthful record.

Mandatory private diagnostics use fresh authenticated original actor/current
tenant capabilities/local permission and an unforgeable process-local grant;
caller IDs or a copied WorkspaceContext cannot authenticate. Capture exact
prepared input before model fence and raw bounded stdout before decoding. No
stderr contents/environment/credentials/history. Fixed external production root
has no fallback and is not accessed in G1. Tests use named unique temp roots.
0700 dirs, create-only0600 regular single-link files, no-follow/ancestor identity,
full writes/file+directory fsync. Cross-process quota:100 captures/128MiB, reserve
1,146,880B worst-case per capture, including32KiB host finite evidence. Reserve
critic slot before checker and retain evidence even if critic never dispatches.
Interrupted/partial/orphan/expired bytes remain charged. Replay expiry24h is not
deletion; explicit authorized purge <=10 opaque IDs/16MiB/5s, no root/glob/GET
cleanup. Same-OS-user/admin protection or encryption is not claimed.

Replay is pure version/source-pinned transport and mathematical admission only:
no model/subprocess/checker/network/DB acceptance/promotion. New absent-grant
dispatch refuses. Safe UI summaries never contain raw response/path/error values.
Production cross-process session ingress is deferred if not safely implementable
within existing authenticated actions; never invent a bypass to make a CLI run.

UI uses existing authorized Math Pilot route, HIVE tokens, VN/EN, safe explicit
KaTeX companions and native disclosures. Goal -> retained method -> critical
obligations -> evidence, with unchanged history archived. Broad null/malformed
v4/ledger7/field markers refuse before legacy forms/cycles/polling. GET remains
passive: no prepare/checker/import/replay/provider/write or raw capture access.
Browser geometry remains NOT_RUN unless actually observed under later authority.
Four matched source-visible benchmark fixtures are offline preparations only;
equal statement/source/tool/model/caps/three-role allowance, null actual usage,
no held-out/superiority claim. False strengthened finite candidate is not LRC.

## Ownership and implementation sequence

1. Core Builder owns four pure program/unit/live/review modules, `math-pilot.ts`,
   `contracts.ts`, `agent-review.ts`, and focused new tests. Publish actual APIs.
2. Integration Builder owns diagnostic contracts/pure admission/auth/storage/
   replay/one-shot preparation, adapters and narrow actions/worker/kernel/
   review-kernel/cycle refusals, with its own fixture tests. No third executor.
3. UI Builder owns pure cockpit presentation/panel/copy, existing Math Pilot
   page and offline matched benchmark harness/tests. Coordinate against Core
   APIs; no overlapping edit ownership. Existing frozen panels unchanged.
4. After code freeze Core and Integration cross-review consequential semantics/
   privacy/lineage. Main reviews UI and independently verifies aggregate.

Builders may choose internal implementation details within scope. Report API or
architectural ambiguity to Main; material expansion returns to Human. Main does
not write product code. New implementation documents/fixtures only; do not edit
scope seals, proposals, historical reports or packet/renderer-v1 bytes.

## Testable acceptance and report protocol

Given exact supported finite fixtures, when producer/independent consumer run,
then only scoped finite claims are admitted; missing/incomplete/coherently
rehash-mutated partitions, wrong masks, equality errors and over-cap input refuse.
Given closed nodes but missing/false/mismatched implication, root cannot close.
Given model-authored evidence, forged auth, absent reserve, exact-job mismatch or
budget failure, no model callback or scientific admission occurs.
Given legacy records, their bytes/validators/guards remain compatible.
Given matched fixtures, any source/access/cap/oracle difference refuses reporting.
Given failed064, cause remains UNKNOWN and missing roles/usage remain unavailable.

Run focused offline unit selectors only; no DB integration setup, author code,
real forest, model/API/browser/private-root action. Report exact selectors and
unique test counts, D/C/M/U mapping, changed files/hash pins, deviations and debts
in new Completion Reports. Main runs type/lint/build with all execution gates
OFF and compares baseline file pins/handoff prefix/manifest history. Do not sum
overlapping runs or reuse old QA as current evidence.

## Exclusions and next human gate

No migration/install/environment/Git/billing/deploy, paid API, real collectors,
private history, old064 retry/reset/reconstruction or broader search. Preserve
all unrelated dirty work. Missing production authority fails closed; offline
fixtures are not authentication, external attestation or actual live E2E.

After offline QA, prepare exactly ONE new G2 M1 manifest with unit/predicate/
source/checker/model/calibration/actor/tenant/caps/new actual IDs/no retries.
Human approves that strategic experiment; it cannot reuse exhausted064authority.
No software completion claim is a research breakthrough, global14/15 proof,
formal certification, external acceptance or novelty finding.
