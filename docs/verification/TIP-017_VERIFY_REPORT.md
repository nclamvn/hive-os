# TIP-017 Settings Productization Verify Report

Date: 2026-07-24

Overall status: `READY_WITH_DEFERRED — LOCAL VERIFIED`

## Result

Settings is now a real workspace control plane rather than a collection of
disconnected identity pages. The implemented policy surface covers:

`Identity · Provider · Storage · Assurance · Retention · Release`

Provider and release choices are enforced inside the relevant deterministic
kernels. Settings never accepts provider credentials, API keys, tokens, or
connection secrets.

## Technical health

| Check | Result |
|---|---|
| Next.js 16.2.10 production build | PASS |
| Type errors | 0 |
| Lint errors | 0 |
| Lint warnings | 0 |
| Unit tests | 106 passed |
| Integration tests | 102 passed |
| E2E tests | 61 passed |
| Aggregate tests | 269 passed |
| Serious/critical accessibility violations | 0 |
| Mobile horizontal overflow at 320px | 0 |
| Schema migrations | 12 current |

The first full E2E attempt reused a development process holding the pre-migration
Prisma Client. Restarting that process loaded the generated client and proved
that runtime-role onboarding works without broadening database privileges.
The new Settings test then detected 45 pixels of mobile overflow in the tab
strip and an invalid definition-list child. The tab strip was contained as a
keyboard-accessible horizontal scroller and the semantic markup was corrected.
The final full suite passed 61 of 61.

## Governed behavior

- Every workspace receives one policy record during atomic provisioning.
- Existing workspaces receive policy defaults through migration backfill.
- Owners and Admins may update policy through `workspace.update`; other roles
  receive a read-only projection.
- Policy updates are serialized on the Workspace authority lock and emit a
  strict, redacted, append-only audit event.
- Mission drafts inherit the configured assurance default without bypassing the
  author's explicit selection or template choice.
- Manual Bridge provider allowlists compare provider/model identifiers
  case-insensitively before any instruction artifact is written.
- Empty allowlists in allowlist mode and unsafe retention bounds fail closed.
- `INTERNAL_ONLY` blocks public manifest authorization inside Verification
  Governance.
- Storage truth remains explicit: the current local workspace database is the
  only implemented storage mode.
- Retention values are minimum preservation guardrails and do not imply an
  unimplemented deletion scheduler.
- Provider policy stores identifiers only and never stores credentials.

## UI evidence

- Settings is now a live main-navigation destination.
- The six-cell effective-policy strip exposes which values are defaults,
  minimums, local facts, or kernel gates.
- Existing Workspace, Members, and Audit surfaces remain available as
  subordinate settings tabs.
- Narrow tab navigation is contained without page overflow.
- Members and Audit tables use bounded internal scrolling at narrow widths.
- 320px inspection reports no horizontal page overflow.
- WCAG A/AA scan reports zero serious or critical violations.

## Deferred obligations

- TIP-018 closes cross-surface search, export, public-release and recovery
  workflows.
- TIP-019 performs clean-install, upgrade, backup/restore, security,
  performance, accessibility and failure-recovery hardening.
- Billing, remote CI, merge and deployment remain intentionally deferred until
  Local RC sign-off.
- The pinned `pg` concurrency deprecation remains isolated for dependency
  hardening; concurrency scenarios pass.

## Gate assessment

- TIP-017: local verified.
- Main navigation: zero planned destinations.
- TIP-018: next local priority.
- Remote G3: intentionally deferred until Local RC and billing resolution.
