# Skill Registry

TIP-006 implements workspace-scoped, immutable executable contracts.

- `Skill` is the governed projection and points to one active version.
- `SkillVersion` is append-only and content-hashed.
- Registration and activation require `skills.manage`.
- Discovery is deterministic and read-only.
- No provider, tool, queue or SkillRun is implemented in this TIP.

The authoritative contract is
`docs/contractor/tips/TIP-006_SKILL_REGISTRY.md`.
