# TIP-024Q-R1: P1 Enterprise UAT Closure

## HEADER

- TIP-ID: TIP-024Q-R1
- Project: HIVE OS
- Module: Identity UX, managed staging, recovery and enterprise pilot
- Depends on: TIP-024Q, TIP-021C-B, TIP-022, TIP-023H
- Priority: P1
- Authorized by: Owner, 2026-08-05

## TASK

Close the four P1 obligations retained by TIP-024Q without weakening the
governed kernel or overstating operational evidence. Complete Vietnamese and
English identity surfaces, patch the existing staging host, run a continuous
managed soak with recovery and projection-rebuild evidence, and execute five
representative governed Mission scenarios with retained machine evidence.

## REQUIREMENTS

1. `QA-024Q-R1-01` Every sign-in, sign-up, email verification, password
   recovery, onboarding and account-security string follows the selected VN/EN
   locale. Vietnamese remains the first-visit default and appearance remains
   system-following.
2. `QA-024Q-R1-02` Validation, neutral anti-enumeration outcomes, busy states,
   visible errors and accessible show/hide-password names are localized; locale
   changes do not weaken authentication semantics.
3. `QA-024Q-R1-03` Responsive, keyboard and WCAG AA E2E coverage proves both
   locales on identity and security surfaces.
4. `QA-024Q-R1-04` The AWS staging host is preflighted, backed up or otherwise
   recoverable, fully patched within the existing topology, rebooted only when
   required, and returns the same immutable application revision with zero OOM
   or unexpected restart.
5. `QA-024Q-R1-05` A continuous 30–60 minute managed-staging soak records
   liveness, readiness, sign-in latency, error rate, CPU/memory and restart
   behavior. The run is bounded and non-SLO.
6. `QA-024Q-R1-06` Managed PostgreSQL logical backup integrity, isolated
   restore, tenant boundary and projection rebuild are rehearsed without
   mutating the live governed dataset.
7. `QA-024Q-R1-07` Five enterprise pilot Missions cover multiple roles,
   separation of duties, approvals, retained evidence, deterministic dossier
   export and rebuild. Machine evidence must remain distinct from functional
   team attestation.
8. `QA-024Q-R1-08` All local and remote gates are recorded with exact revision,
   counts, durations and remaining human-only decisions.

## ACCEPTANCE CRITERIA

1. Given a first visit, when an identity route renders, then visible and
   assistive copy is Vietnamese; switching to EN changes the complete surface.
2. Given either locale, when recovery and password-validation branches execute,
   then their outcomes are localized and remain non-enumerating.
3. Given the staging preflight and patch plan, when maintenance completes, then
   health recovers, application identity is unchanged and rollback evidence is
   retained.
4. Given a continuous managed soak, when the requested duration elapses, then
   every sample gap is bounded and no 5xx, OOM or unexpected restart is hidden.
5. Given an integrity-checked backup, when restored into an isolated target and
   projections are rebuilt, then authoritative counts and tenant boundaries
   match the source fingerprint.
6. Given five governed pilot scenarios, when their dossiers are inspected, then
   roles, decisions, evidence hashes, workflow state and exports are retained
   and attributable.
7. Typecheck, lint, build, unit, strict integration and full no-retry E2E pass.

## CONSTRAINTS

- Preserve user-owned generated artifacts and unrelated working-tree changes.
- Do not add paid AWS resources or exceed the approved USD 20/month topology.
- Do not print secrets, database URLs, tokens or runtime environment contents.
- Do not patch the database or application by bypassing migrations and kernels.
- Do not represent synthetic/machine pilot evidence as human functional-team
  attestation or claim production SLO/capacity from bounded staging tests.

## DECISIONS LOG

- Owner's explicit request to complete all four retained P1 obligations is the
  authorization checkpoint for this bounded refinement.
- The existing neutral, Inter-based identity layout remains the visual
  baseline; localization and state clarity are the design work, not a restyle.
- Human functional-team attestation remains a named final sign-off boundary;
  the Builder may prepare and verify its evidence package but may not impersonate
  the attestors.
