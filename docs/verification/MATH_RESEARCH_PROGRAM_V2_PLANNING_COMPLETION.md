# Completion / verification — research-program upgrade planning

Date:2026-10-04. Contractor:Main. Status: **PLANNING_COMPLETE / G1_PENDING**.
Product implementation status for this new scope: **NOT_READY**. This report
does not claim that the upgrade, live E2E or a mathematical milestone is done.

## Delivered artifacts

- `docs/proposals/BLUEPRINT_MATH_RESEARCH_PROGRAM_V2.md`: goal/mode/trust,
  evidence-driven obligations, LRC applicability, controlled research loop,
  independent verification, diagnostics/privacy, cockpit, benchmarks and gates.
  SHA256 `c0aac1b91d6f274f3d5e514c8bbac1ad44bbd115eda892158d0f4d1b1c3697e6`.
- `docs/proposals/TIP-065_068_RESEARCH_PROGRAM_DRAFT_PACKS.md`:4draft packs,
  dependency/ownership boundaries and20named acceptance criteria D1–D5,
  C1–C5,M1–M5,U1–U5. SHA256
  `b42ffff08dcca56ffa59d73963d15bfb6887c80bec63c68eefe9a3f848cd6c40`.

No pack is sealed/dispatched. The prior TIP-065 proposal remains unchanged.
No new method packet/schema/certificate was frozen. Exact canonical scope,
schemas and checker pins must pass Contractor cross-review before coding;
the approved blueprint constrains those artifacts, not arbitrary future inputs.

## Requirement coverage

| Requirement | Designed in blueprint | New implementation this turn |
| --- | --- | --- |
| R1 | §§1,5 | NOT_IMPLEMENTED |
| R2 | §5, semantic edge admission | NOT_IMPLEMENTED |
| R3 | §6 | NOT_IMPLEMENTED |
| R4 | §§1,5 | NOT_IMPLEMENTED |
| R5 | §§7,11 | NOT_IMPLEMENTED |
| R6 | §§5,8,11 | NOT_IMPLEMENTED |
| R7 | §§7,12 | NOT_IMPLEMENTED |
| R8 | §9 | NOT_IMPLEMENTED |
| R9 | §10 | NOT_IMPLEMENTED |
| R10 | §11 | NOT_IMPLEMENTED |
| R11 | §§2,12 | NOT_IMPLEMENTED |
| R12 | §§1,12 | NOT_IMPLEMENTED |

Design coverage12/12 (100%); new implementation0/12 (0%). Counts apply only to
this proposed upgrade, not to the whole existing product. Runtime scenarios
0/20 executed, all20NOT_RUN; cannot report software acceptance from draft prose.

## Read-only scans and consequential reviews

Three existing Builders scanned core, runtime/privacy and UI without mutations.
Two reviewed the new design: Core and Integration. Five consequential findings
were incorporated by Contractor:

1. Root closure requires admitted semantic evidence for every critical implication
   edge; prerequisite node statuses/DAG connectivity are insufficient. C3 now
   explicitly tests this distinction.
2. Freeze full source-pinned prime enumerations and exact quantified shift unit,
   certificate domain/schema/checker quotas before code. Counts and method names
   alone are insufficient. Blueprint§12 specifies source/artifact identities,
   d3/d5 initial scope, 32KiB/256bit/5s/2Mops ceilings and freeze prerequisites.
3. Storage quota uses atomic worst-case reservation across processes, enforcement
   during capture and partial/orphan bytes remain charged.
4. 24h replay expiry is explicitly not24h deletion; raw remains until authorized
   bounded maintenance purge, with overdue status and storage quota consequences.
5. Replay/purge authority comes from the authenticated original actor, current
   tenant membership/capability and local diagnostic permission, never caller IDs.

These are design repairs, not passing executable tests. Reviewers made no edits.
Main used Vibecode Kit to preserve Contractor/Builder boundaries and require
architecture approval. Frontend-design influenced the single goal/evidence
cockpit, restrained reading measure, existing tokens, disclosures and safe TeX;
no UI code or asset was changed this turn.

## Planning checks and technical health

Planning checks5/5 PASS:

- P1:1319preexisting files under src/tests/scripts/docs (excluding handoff)
  retain identical path+content aggregate after the two new draft files are
  excluded:SHA256 `2fd28cc34542e87e53aa5535a9d30ba77990f15ebab9917134047bbfe9aa219a`.
- P2:12unique R-IDs and4TIP packs/20named ACs present and mapped.
- P3:five consequential peer findings have explicit scope/AC repairs above.
- P4:published14/15claim, source adoption, local replay, reviewed conditional,
  formal proof and novelty remain distinct; failed064 not repaired/reinterpreted.
- P5:git diff --check exits0; explicit trailing-whitespace scan of new drafts
  reports0lines. Git's diff check alone does not cover untracked new files.

Types/lint/build/unit/integration/browser: **NOT_RUN this turn**. Zero current
test assertions executed; type/lint error totals not measured. Old064QA counts
are historical, not current acceptance evidence. No product-code/checker execution,
model/provider/DB/browser action, server restart, migration, install, Git write,
billing or deployment. Public primary-source browsing was read-only.

Sealed manifest remains SHA256
`86c7e1501906fa0e826e88fa23fc61eaf8dc6e1a0f59bc78fedf08d3e38f78cb`.
Handoff before the new append:310696bytes, SHA256
`c452fef0aac8c149b5e54a1bc2ede64547251141d310c9aaa0d811a891a8145d`.
Final verification must exclude these three new planning files and verify that
historical handoff prefix unchanged; append-only new handoff entry is permitted.

## Outcome and next authority

No new mathematical result admitted.14/15independent reproduction/global proof
and novelty remain NOT_ESTABLISHED. TIP-064case/run and missing original rejected
transport remain unchanged. Its one-shot runtime authority is exhausted.

G1 asks approval of the new architecture and private local diagnostics policy
for offline065–068engineering. The external private root needs separate filesystem
approval at execution time; no fallback. After offline QA, G2 is a separate exact
one-experiment manifest for M1. Neither G1 nor this report authorizes live models,
forest replay, paid API, retries, wider research search, Git or publication.

Deferred explicitly:all12implementations, pre-code canonical/schema freeze,
current technical QA, actual visual acceptance, actual three-role/tool observation,
paired live benchmark, analytic/formal proof debts, novelty search/assessment and
full14/15coverage. Approval does not promise success or perfection.
