# HIVE OS Control Room

The Control Room integrates the strongest operating-model ideas from the
SOT.OS v0.2 interface without replacing the locked HIVE OS visual system.

## Product boundary

- HIVE OS remains the only product identity.
- Dashboard remains task-oriented and keeps Mission Composer first.
- Control Room is the system-oriented surface at
  `/w/[workspaceSlug]/control-room`.
- The default theme remains the locked light academic/deeptech theme.
- No count, health state, percentage, mission, or activity may be fabricated.

## Lenses

### Architecture

Four ordered authority planes:

1. Mission
2. Truth
3. Execution
4. Assurance

Implemented nodes read workspace-scoped authoritative counts. Future nodes are
marked `Planned` and explicitly write nothing.

TIP-006 makes `SKL-20 Skill registry` operational. Its count is derived from
real Skill and SkillVersion rows. The node states explicitly that registry
authority cannot execute a skill or mutate Mission and Truth state.

TIP-007 makes `RUN-21 Manual bridge` and `ART-22 Execution artifacts`
operational. Their counts are derived from real ExecutionTip, AgentRun,
CompletionReport, and ExecutionArtifact rows.

TIP-008 makes `VER-31 Verification` and `RLS-32 Release governance`
operational. Their counts are derived from immutable VerificationScenario,
VerificationRun, VerificationReport, GovernanceSignoff,
EvidenceCeilingAssessment, GovernedRelease, and ReleaseManifest rows.

### Operations

Shows recent real missions and unresolved signals derived from Decisions,
Disputes, Escalations, claim review dates, reports awaiting import, and open
execution deviations.

The independent assurance corridor renders the actual ordered release
boundary:

`Requirement coverage → Scenario results → Technical health → Release ceiling`

Recent Verify Reports expose their content-hash prefix, independence status,
corruption-run count, and deterministic readiness. No approved public release
projection is shown before the Mission reaches `RELEASED`.

The Manual Provider Bridge is rendered as one accountable handoff:

`Instruction artifact → External operator → Completion Report`

It exposes recent execution TIPs and the Contractor-visible deviation gate.
The interface always labels imported provider results as execution claims, not
independent verification.

### Audit

Shows recent immutable AuditEvent records only when the current role has
`audit.read`. Other roles receive a non-disclosing restricted state.

## Signature interaction

The governed spine connects the ordered planes. Selecting a node opens the
Context Inspector, which explains:

- authority;
- governed writes;
- prohibited actions;
- current authoritative projection.

The object finder is available from the workspace header and with `Cmd/Ctrl+K`
inside Control Room. It searches the system map and recent real missions.

## Responsive and accessibility rules

- Full desktop canvas is used when no separate AppShell right rail is present.
- Inspector becomes an in-flow region below the map on narrower viewports.
- No horizontal overflow at 390px.
- Lens tabs and object finder are keyboard operable.
- Dialog focus is trapped and returned to its trigger.
- Small metadata uses `ink-muted` or stronger; `ink-faint` is not used for
  essential text.
