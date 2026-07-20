# Assurance Policy (TIP-004)

Source: `src/modules/mission-kernel/assurance.ts`.

| Profile | Approval | Verify later | Release sign-off | Public eligible | Seed gates |
|---|---|---|---|---|---|
| QUICK | Owner/Admin | no | no | no | — |
| PROFESSIONAL | Owner/Admin | no | no | no | — |
| RESEARCH | Owner/Admin | yes | yes | yes | INDEPENDENT_VERIFICATION (open) |
| REGULATED | Owner only | yes | yes | yes | INDEPENDENT_VERIFICATION + HUMAN_RELEASE_SIGNOFF (open) |

- Research/Regulated seed truthful OPEN gates representing future verification
  requirements — never marked passed.
- Profile selection is a human contract decision; changing an approved profile
  requires a new contract version; downgrading requires a material Decision
  reserved to Owners.
Tests: MK-06, MK-10; unit assurance tests.
