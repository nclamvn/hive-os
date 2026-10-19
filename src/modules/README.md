# Domain Modules

Modular-monolith bounded contexts from the approved Blueprint (`docs/contractor/04_BLUEPRINT.md`).
TIP-001 establishes the skeleton and dependency direction only; implementations
arrive in their authorized TIPs.

Dependency rules:

- `src/app` contains routes and actions; it calls module public ports and
  server-side projections/orchestrators.
- `src/modules/*` contains bounded-context contracts and kernels. Modules may
  use infrastructure from `src/server`.
- `src/server/*` contains shared infrastructure plus cross-context
  orchestrators and read projections. Those orchestrators may call module
  public ports.
- Cross-module and cross-layer calls use each module's public `index.ts`.
- The one approved module-to-module contract exception is
  `verification-governance` importing the deterministic execution report
  schemas from `execution-fabric/contracts`; it is covered by the verification
  contract tests and must not expand silently.
- UI projections never become source of truth (`docs/contractor/06_DOMAIN_MODEL.md`).

| Module                     | Bounded context                                         | Authorized TIP |
| -------------------------- | ------------------------------------------------------- | -------------- |
| `identity-workspace/`      | Identity & Workspace                                    | TIP-003        |
| `mission-kernel/`          | Mission Kernel                                          | TIP-004        |
| `truth-kernel/`            | Truth Kernel                                            | TIP-005        |
| `skill-runtime/`           | Skill Runtime                                           | TIP-006        |
| `execution-fabric/`        | Execution Fabric                                        | TIP-007        |
| `verification-governance/` | Verification & Governance                               | TIP-008        |
| `observatory/`             | Observatory                                             | TIP-011        |
| `organization/`            | Enterprise organization graph and compatibility tenancy | TIP-023A       |
| `authorization/`           | Scoped grants, delegation, SoD and authority-plane RLS   | TIP-023B       |
| `query-contracts/`         | Bounded cursor collections and authorized search         | TIP-023C       |
| `workflow-accountability/` | Assignment, SLA, approval chains and bounded work inbox   | TIP-023D       |
| `command-runtime/`         | Idempotent commands, outbox, leases and dead letters      | TIP-023E       |
| `projections/`             | Incremental Workspace/Portfolio read models and watermarks | TIP-023E       |
| `lifecycle/`               | Legal hold and governed object-body disposition             | TIP-023G       |
| `dossier-export/`          | Resumable bounded dossier parts and final manifest           | TIP-023G       |
| `query-intelligence/`      | QueryPlan trust boundary and golden evaluation contracts     | TIP-024A       |
