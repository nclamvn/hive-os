# Decisions Log

| ID | Decision | Owner | Status | Reason |
|---|---|---|---|---|
| DEC-001 | Product is a web operating system, not a CLI-first product. | Homeowner | APPROVED | Natural UI for new users. |
| DEC-002 | Latest light academic/deeptech mock is the visual contract. | Homeowner | APPROVED | Mature, restrained, premium direction. |
| DEC-003 | Sol is Contractor; Fable/Claude Code is Builder. | Homeowner | APPROVED | Cross-model trust boundary. |
| DEC-004 | Contractor does not code; Builder does not change architecture silently. | Method | LOCKED | Vibecode trust boundary. |
| DEC-005 | v0.1 uses a modular monolith. | Contractor | PROPOSED | Fastest route to coherent semantics and auditable state. |
| DEC-006 | Provider interfaces are model-agnostic; manual bridge permitted first. | Contractor | PROPOSED | Avoid coupling product method to current model APIs. |
| DEC-007 | Database and deterministic kernels are source of governed state. | Contractor | PROPOSED | Prevent LLM prose from becoming truth. |
| DEC-008 | No synthetic operational metrics outside labeled demo fixtures. | Contractor | PROPOSED | Preserve SOT and public trust. |
| DEC-009 | Local-only continuation exception: G3-REMOTE is blocked by an external GitHub Actions billing factor (OBL-FND-001), not a known source-code defect. Owner authorized TIP-005…TIP-019 to build and verify in local-only mode. This authorization is NOT a Remote RC, production release, or public release. All post-G3 gates are local and provisional until OBL-FND-001 is closed. This decision expires when remote CI runs green on the reviewed commit. | Owner | APPROVED | Ratified 2026-07-28 (TIP-020A). A governed-truth system must record its own gate exceptions as an authorized Decision, not scattered prose. |
| DEC-010 | Lock the split gate model: G3 is recorded on two axes — G3-LOCAL: PASS and G3-REMOTE: BLOCKED_EXTERNAL. Post-G3 gates read G4/G5/G6-LOCAL: PASS_PROVISIONAL until OBL-FND-001 closes. A bare "G3: PASS" must never be recorded while remote reproducibility is unproven. | Owner | APPROVED | Ratified 2026-07-28 (TIP-020A). Prevents a single-axis ledger from overclaiming remote reproducibility. |
| DEC-011 | Promote the founding architecture decisions DEC-005…DEC-008 from PROPOSED to LOCKED (or record a superseding decision). | Owner | PROPOSED | Not covered by the TIP-020A ratification; the codebase already relies on these, so they remain an un-ratified claim pending separate Owner authorization. (Was the Builder's draft DEC-010; renumbered after the Owner reassigned DEC-010 to the split-gate lock.) |
