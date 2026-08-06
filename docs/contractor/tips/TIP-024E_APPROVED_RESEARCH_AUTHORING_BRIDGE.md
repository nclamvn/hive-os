# TIP-024E — Approved Research to Authoring Bridge

Status: Implemented, local verification complete

## Objective

Move independently approved research findings into a governed authoring
document without copying unreviewed model output, losing provenance or
bypassing editorial quality gates.

## User outcome

An authorized author chooses an approved research dossier and a target
document. HIVE OS creates one new immutable revision containing:

- evidence sections derived from accepted findings only;
- deterministic citation markers bound to retained research source IDs;
- source snapshot SHA-256 digests;
- the approved research bundle digest and retained finding IDs;
- an auditable import event.

The author can edit the imported prose in later revisions. Provenance-bound
sections and citations cannot be deleted independently because doing so would
invalidate the strict authoring content contract.

## Mandatory invariants

1. Only an `APPROVED` research run with a valid recomputed digest may cross the
   bridge.
2. Research and document must belong to the same organization, workspace and
   Mission.
3. A research run bound to a target document cannot be redirected elsewhere.
4. Only findings with an immutable `ACCEPTED` review decision are imported.
5. Every imported source retains `researchRunId`, `researchSourceId` and its
   source snapshot digest.
6. The revision retains the approved bundle digest, source IDs, finding IDs and
   generated section keys.
7. Repeating the same import is idempotent and creates no duplicate revision.
8. The imported revision is reassessed by the existing authoring quality gate.
9. DOCX and PDF exports carry research provenance and remain blocked when the
   authoring quality report has blockers.

## Acceptance criteria

| ID | Criterion |
| --- | --- |
| BRIDGE-01 | Queued, running, rejected or digest-invalid research cannot be imported |
| BRIDGE-02 | Cross-Mission and wrong bound-document imports fail closed |
| BRIDGE-03 | Accepted findings become bounded evidence sections with citation markers |
| BRIDGE-04 | Citation records retain source and run identity plus SHA-256 |
| BRIDGE-05 | Revision retains the approved bundle manifest |
| BRIDGE-06 | Retried import returns the existing revision |
| BRIDGE-07 | Audit records both revision creation and research import |
| BRIDGE-08 | Vietnamese and English UX supports choosing or creating a target document |
| BRIDGE-09 | DOCX and PDF expose the approved research digest |

## Explicit non-goals

- The bridge does not activate an OpenAI worker or consume API budget.
- The bridge does not treat an AI-generated claim as approved evidence.
- The bridge does not automatically rewrite a complete proposal.
- Citation entailment remains a human editorial responsibility after import.
