# TIP-002B — Core Operational Surface Migration

Status: `COMPLETE — LOCAL VERIFIED`

Proposed: `2026-07-29`

Dependency: `TIP-002A COMPLETE — LOCAL VERIFIED`

Authorized by Owner: `2026-07-29`

Completed: `2026-07-29`

## Context

TIP-002A established the Precision Instrument foundation, Vietnamese-first
locale, system-first appearance, grouped shell, and the Governed Provenance
Rail. It intentionally migrated only the structural bands of Dashboard,
Mission Workspace, and Control Room.

The remaining core operating loop still contains substantial English literal
copy and legacy panel repetition. The highest concentrations found by the
Contractor scan are:

| Surface | English literal candidates |
| --- | ---: |
| Control Room deep lenses and finder | 150 |
| Mission Workspace deep lenses | 93 |
| Verification forms | 76 |
| Truth forms | 69 |
| Execution forms | 53 |

These counts are inventory signals, not translation completeness metrics.
User-authored records, imported source text, provider/model names, hashes,
identifiers, and governed technical artifacts must never be translated.

## Task

Complete Vietnamese/English localization and Precision Instrument migration for
the core governed operating loop without changing domain state, authorization,
gate, or persistence semantics.

```text
Mission → Evidence → Claim → Execution → Verification → Release
```

## Scope

### 1. Translation architecture hardening

- Split the current dictionary into typed namespaces: `common`, `mission`,
  `truth`, `execution`, `verification`, and `control`.
- Enforce compile-time key parity between Vietnamese and English.
- Centralize localized enum/status labels, dates, numbers, counts, and
  assurance profiles.
- Product copy uses stable keys. English sentences must not be translation
  identifiers.
- Preserve all governed and user-authored content exactly as stored.
- Retain Vietnamese as first-visit default and language-switch form
  preservation from TIP-002A.

### 2. Localizable action-result contract

- Replace user-facing English action errors on scoped routes with stable error
  codes plus safe interpolation parameters.
- Translate error, success, loading, validation, empty, and permission states
  in the client surface.
- Domain errors remain deterministic and retain their existing audit meaning.
- Logs and governed ledgers retain canonical technical codes; only interface
  presentation is localized.

### 3. Mission surfaces

- Complete all nine Mission Workspace lenses.
- Migrate Missions list and New Mission.
- Localize lifecycle, assurance, obligations, gates, decisions, evidence,
  claims, build, verification, and release controls.
- Preserve real mission titles, objectives, requirements, and evidence text.

### 4. Truth surfaces

- Complete Evidence Hub and Claims & Insights.
- Present source → snapshot → exact span and claim → version → review as real
  instrument sequences.
- Replace same-weight form cards with numbered bays only where the domain order
  is real.
- Keep append-only and honest-null boundaries explicit.

### 5. Execution surfaces

- Complete Execution Operations and Manual Bridge forms.
- Preserve package → instruction → exchange → report → readiness as the
  operating sequence.
- Make immutable artifacts, attempts, deviations, and permission boundaries
  visually distinct without decorative telemetry.

### 6. Verification surfaces

- Complete Verification Operations through release authorization.
- Preserve scenario → verifier → report → sign-off → manifest → release as the
  authority sequence.
- Separate technical validity, human permission, and release eligibility in
  both copy and layout.

### 7. Control Room completion

- Complete architecture, operations, audit, inspector, finder, signals,
  Manual Bridge, and Verification Governance copy.
- Finder searches canonical governed content without translating stored values.
- The selected plane continues driving the Governed Provenance Rail.

## Layout grammar

The migrated core uses one consistent structure:

```text
┌ route thesis / authority / current boundary ┐
├ governed provenance or real process rail ───┤
│ action bay / working canvas │ evidence state │
├ immutable ledger / retained history ─────────┤
```

- Use open instrument bays and rules before adding a panel.
- Keep thesis typography restricted to one statement per route.
- Use IBM Plex Mono only for technical coordinates.
- Do not add a second visual signature beside the Provenance Rail.

## Acceptance scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| P2B-01 | Static scan scoped route copy | No unregistered product-copy literal; governed content allowlist is explicit |
| P2B-02 | Compare dictionary namespaces | Vietnamese and English keys have compile-time parity |
| P2B-03 | Switch locale in a partially completed core form | Field values, selected governed object, and current route remain intact |
| P2B-04 | Trigger validation, permission, domain, and unknown failures | Localized safe message appears; canonical error code remains available |
| P2B-05 | Operate Mission → Truth → Execution → Verification test loop | Domain state and authorization results match the pre-migration behavior |
| P2B-06 | Inspect stored governed records in both locales | User/source content, IDs, hashes, and provider data are byte-identical |
| P2B-07 | Render scoped routes in light and dark | Precision Instrument hierarchy is coherent; no legacy light-only surface |
| P2B-08 | Navigate scoped routes at 320px and 390px | No page overflow, clipping, badge collision, or inaccessible sequence |
| P2B-09 | Keyboard and screen-reader operation | Labels, errors, status changes, dialogs, and focus return remain accessible |
| P2B-10 | Reduced motion | No information or operation depends on animation |
| P2B-11 | Capture visual archetype matrix | Mission, Truth, Execution, and Verification evidence exists for `vi/en × light/dark` at desktop and mobile |
| P2B-12 | Run quality gates | Typecheck, lint, unit, integration, full E2E, accessibility, build, and manifest pass |

## Required tests

- Unit: dictionary parity, enum labels, interpolation, error-code mapping,
  governed-content preservation.
- Integration: action error codes and unchanged domain transitions.
- E2E: one complete governed loop in both locales; locale switch with dirty
  forms; dark/light accessibility; mobile overflow.
- Visual: four route archetypes × two locales × two themes × desktop/mobile.

## Non-goals

- No domain, database schema, authorization, gate, or release-policy change.
- No translation of governed or imported content.
- No auth, recovery, onboarding, Security, workspace administration, members,
  audit settings, Templates, Skill Library, Observatory, or Reports migration.
  Those surfaces belong to a later separately authorized `TIP-002C`.
- No locale-specific URL restructuring or right-to-left support.
- No external translation service, AI runtime, analytics, deployment, push, or
  production release.

## Builder completion report

Recorded in:

- `docs/verification/TIP-002B_COMPLETION_REPORT.md`
- `docs/verification/TIP-002B_VERIFY_REPORT.md`

## Authorization gate

Owner authorization was received before implementation. Authorization of this
TIP does not imply authorization of TIP-002C.
