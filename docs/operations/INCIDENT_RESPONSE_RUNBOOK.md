# Incident Response Runbook

Status: `TIP-021C-A LOCAL CONTRACT`

## Severity

| Severity | Meaning | Immediate action |
| --- | --- | --- |
| P0 | Active compromise, cross-tenant exposure, or irreversible integrity risk | Stop traffic/writes; Owner leads |
| P1 | Authentication, readiness, release, or governed-state failure | Contain; preserve evidence; Owner notified |
| P2 | Degraded non-critical operation with safe workaround | Assign operator; monitor |
| P3 | Minor defect or documentation/operability issue | Track in normal TIP flow |

## First response

1. Name the incident commander and evidence recorder.
2. Record start time, environment, reviewed commit/image digest, affected
   workspace scope, and correlation IDs. Never paste secrets or raw recovery
   links.
3. Protect people and governed data first. Use maintenance mode when continued
   writes could enlarge harm.
4. Preserve append-only audit, security-event, release, and provider evidence.
5. Classify what is known, inferred, and unknown. Do not fabricate impact
   counts.
6. Choose containment: traffic stop, credential rotation, session revocation,
   provider isolation, or application rollback.
7. Restore service only after readiness and targeted negative tests pass.

## Communications

No public/customer claim is made without Owner authorization and verified
scope. Updates state evidence time, current impact boundary, containment,
remaining uncertainty, and next update time.

## Closure

Create an immutable incident record linking timeline, decisions, evidence,
corrective TIPs, verifier, and Owner signoff. A resolved symptom is not proof
that integrity is restored.
