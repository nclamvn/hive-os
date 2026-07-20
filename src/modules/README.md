# Domain Modules

Modular-monolith bounded contexts from the approved Blueprint (`docs/contractor/04_BLUEPRINT.md`).
TIP-001 establishes the skeleton and dependency direction only; implementations
arrive in their authorized TIPs.

Dependency direction rules:

- `src/app` (routes/UI) → `src/modules/*` → `src/server/*` (infrastructure).
- Modules may depend on infrastructure (`src/server`), never the reverse.
- Cross-module access goes through each module's public `index.ts`; no deep imports.
- UI projections never become source of truth (`docs/contractor/06_DOMAIN_MODEL.md`).

| Module | Bounded context | Authorized TIP |
|---|---|---|
| `identity-workspace/` | Identity & Workspace | TIP-003 |
| `mission-kernel/` | Mission Kernel | TIP-004 |
| `truth-kernel/` | Truth Kernel | TIP-005 |
| `skill-runtime/` | Skill Runtime | TIP-006 |
| `execution-fabric/` | Execution Fabric | TIP-007 |
| `verification-governance/` | Verification & Governance | TIP-008 |
| `observatory/` | Observatory | TIP-011 |
