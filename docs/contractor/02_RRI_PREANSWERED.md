# RRI Report — Pre-answered from Owner Context

## Product decisions already resolved

| REQ-ID | Decision |
|---|---|
| REQ-P01 | Web app is the primary interface; CLI is not the user-facing default. |
| REQ-P02 | Users submit objectives and inputs in natural language. |
| REQ-P03 | Internal skills and frameworks are hidden behind one coherent workflow. |
| REQ-P04 | Human approval is required for strategic scope, blueprint, material trade-offs, and release. |
| REQ-P05 | Contractor and Builder are separate trust roles and use different model families. |
| REQ-P06 | Contractor does not code; Builder does not silently change approved architecture. |
| REQ-P07 | Evidence, claims, disputes, honest-null, falsification, and provenance are first-class objects. |
| REQ-P08 | `not found`, `not proved`, `blocked`, and `open` must never collapse into one state. |
| REQ-P09 | UI is mature, light, restrained, academic/deeptech, with minimal decorative color. |
| REQ-P10 | Latest mock and token direction are approved as the visual contract. |
| REQ-P11 | Product must support research, analysis, build, and evaluation missions. |
| REQ-P12 | Observatory/public release may only display governed claims within evidence ceiling. |
| REQ-P13 | Metrics must be computed from real records; no fake dashboard numbers. |
| REQ-P14 | Workflow must scale down for small tasks and up for high-assurance missions. |
| REQ-P15 | Minimum audit trail persists even when process is shortened. |

## Open questions deferred to implementation scan

- Existing repository or greenfield.
- Authentication provider.
- Deployment target.
- Initial tenancy model: single workspace or multi-tenant SaaS.
- Whether model execution is manual-bridge first or API-integrated first.
- Which existing Refinery and hygiene scripts are imported versus wrapped as external tools.

## Contractor recommendation

Build v0.1 as a single-workspace, production-quality modular monolith with clear interfaces for later multi-tenancy and remote model providers. Begin with a manual provider bridge for Sol/Fable artifacts unless usable APIs and credentials are already present in the target repository.
