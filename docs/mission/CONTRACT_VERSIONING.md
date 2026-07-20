# Contract Versioning (TIP-004)

- One current DRAFT/IN_REVIEW contract per mission; `@@unique(missionId, versionNumber)`.
- Lifecycle: DRAFT → IN_REVIEW → APPROVED (→ SUPERSEDED when a newer approved
  version replaces it).
- Approved content is immutable: enforced at service level (only DRAFT contracts
  accept definition edits) and reinforced by DB triggers
  (`mission_contract_content_frozen`, `*_frozen` on definition tables).
- Submission requires: non-empty objective/scope/success, an assurance profile,
  ≥1 requirement, ≥1 weighted obligation, total weight > 0, and no duplicate
  requirement/obligation/gate codes (`evaluateCompleteness`).
- Approval is atomic (`approveContract`): lock mission, confirm IN_REVIEW,
  permission (+ Regulated Owner-only), revalidate completeness, mark APPROVED,
  set `Mission.approvedContractId`, create runtime obligations + gates,
  transition CONTRACT_REVIEW → APPROVED, emit audits — all in one transaction.
- Amendment: creates a material Decision; on approval a new DRAFT version is
  copied from the approved contract with `supersedesContractId` set; prior
  versions and audits are preserved. Assurance downgrades are always material.
Tests: MK-05..10, MK-14.
