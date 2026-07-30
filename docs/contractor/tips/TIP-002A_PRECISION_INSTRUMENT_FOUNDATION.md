# TIP-002A — Precision Instrument UI Foundation

Status: `COMPLETE — LOCAL VERIFIED`

Owner direction approval: `2026-07-29`

Owner implementation authorization: `2026-07-29`

## Context

The current HIVE OS interface is accessible, responsive, restrained, and
truthful, but its visual hierarchy still resembles a conventional enterprise
SaaS dashboard. Deeptech meaning is present in the copy and domain model more
than in the interaction and visual system.

The Owner selected **Direction A — Precision Instrument** and added two product
requirements:

- Vietnamese and English interface language, with Vietnamese as the default.
- Light, dark, and system appearance modes, with system as the default.

This TIP establishes the bounded foundation and three representative product
surfaces. It does not authorize a cosmetic rewrite of every route.

## Product and design thesis

HIVE OS is a governed research and engineering instrument for teams that must
explain why a technical decision can be trusted. The interface must feel like a
precise scientific instrument: quiet surrounding surfaces, explicit authority,
legible evidence lineage, and no decorative science-fiction styling.

The memorable structural signature is the **Governed Provenance Rail**:

```text
Mission → Truth → Execution → Verification → Release
```

It represents real authority and evidence flow. It is not a decorative progress
bar and must never imply completion from fabricated or unavailable data.

## Scope

### 1. Semantic theme foundation

- Replace light-only color assumptions with semantic light and dark tokens.
- Support `system`, `light`, and `dark`; first visit defaults to `system`.
- Resolve system preference before first meaningful paint so the UI does not
  flash the wrong theme.
- Persist an explicit user choice; `system` continues tracking operating-system
  changes.
- Set the browser `color-scheme` and preserve WCAG AA contrast, visible keyboard
  focus, semantic status redundancy, and reduced-motion behavior in both themes.
- No gradient, glass, neon, glow, decorative shadow, or fake telemetry.

Core palette:

| Role | Light | Dark |
| --- | --- | --- |
| Lab canvas | `#F4F6F8` | `#0B1018` |
| Instrument surface | `#FFFFFF` | `#111925` |
| Primary ink | `#0C1424` | `#E8EDF5` |
| Muted ink | `#617086` | `#9AA8BA` |
| Authority signal | `#315FE8` | `#8AABFF` |
| Verified signal | `#0B7A67` | `#56C7AD` |

Lines, selected surfaces, and semantic warning/danger states must be derived as
named tokens and verified independently in each theme.

### 2. Vietnamese-first internationalization

- Support complete `vi` and `en` dictionaries for every surface changed by this
  TIP.
- First visit defaults to `vi`; browser language must not silently override the
  Owner-selected default.
- Persist explicit language selection and apply it consistently across auth and
  workspace routes.
- Set `<html lang>` correctly and retain left-to-right layout.
- Use stable translation keys; do not use English UI sentences as identifiers.
- Keep governed records, user content, evidence, IDs, and imported source text
  unchanged. Only product interface copy is translated.
- Validation, empty, loading, success, and error states must be translated, not
  only headings and navigation.
- Language switching must not discard form state or change the active governed
  object.

### 3. Typography

- Display/thesis: **Literata**, used only for mission theses and key research
  statements.
- UI/body: **Be Vietnam Pro**, optimized for Vietnamese and English interface
  copy.
- Data/utility: **IBM Plex Mono**, used sparingly for IDs, hashes, timestamps,
  gates, and evidence coordinates.
- Preserve tabular numerals and avoid all-uppercase prose.

The restrained serif is the deliberate aesthetic risk. It is limited to thesis
content on a cool instrument palette, avoiding the generic warm editorial
template.

### 4. Shell and navigation

- Rework App Shell hierarchy without changing route authority or access rules.
- Group primary navigation by real workflow plane instead of presenting every
  destination at equal weight.
- Add accessible language and appearance controls.
- Preserve desktop sidebar, tablet rail, mobile drawer, skip link, focus return,
  and responsive reflow behavior.
- Replace generic panel repetition with open instrument bays, structural rules,
  and containers only where grouping is semantically necessary.

### 5. Representative surfaces

- **Dashboard:** become a mission command surface centered on the next
  accountable action, real active missions, and honest empty states.
- **Mission Workspace:** expose contract stage, obligations, gates, evidence,
  and current authority through the Governed Provenance Rail.
- **Control Room:** become the canonical system map and context inspector using
  the same rail and plane vocabulary.

Auth, Security, and untouched operational routes receive compatible global
tokens and controls, but their full information-architecture redesign belongs
to a later explicitly authorized surface-migration TIP.

### 6. Motion

- Use one orchestrated transition on provenance/gate changes.
- Motion must encode state change, not ambient decoration.
- Respect `prefers-reduced-motion`; all information remains available without
  animation.

## Acceptance scenarios

| ID | Scenario | Expected |
| --- | --- | --- |
| PI-01 | First visit with OS light/dark preference | Vietnamese UI renders in the matching theme without a wrong-theme flash |
| PI-02 | Choose English, then navigate and reload | English persists across auth and workspace routes |
| PI-03 | Choose light/dark, then choose system | Explicit modes persist; system resumes tracking OS changes |
| PI-04 | Inspect document semantics | Correct dynamic `lang`, browser `color-scheme`, titles, labels, and accessible names |
| PI-05 | Switch language with a partially completed form | Governed object and form state remain intact |
| PI-06 | Render Dashboard, Mission, and Control Room | Shared Precision Instrument hierarchy and Governed Provenance Rail are visually coherent |
| PI-07 | Render honest-null and error states | No fabricated value; all user-facing interface states are translated |
| PI-08 | Navigate using keyboard in all four locale/theme combinations | Focus, contrast, menus, dialogs, and controls remain usable |
| PI-09 | Test reduced motion | No required information or operation depends on animation |
| PI-10 | Capture visual matrix | Approved screenshots exist at 390×844, 768×1024, 1280×800, and 1536×1024 for `vi/en × light/dark` |
| PI-11 | Run quality gates | Typecheck, lint, unit, integration, E2E, accessibility, and production build pass |

## Non-goals

- No route, domain-state, authorization, gate, or persistence semantics change.
- No translation of user-authored or imported governed content.
- No AI-generated artwork, 3D scene, decorative telemetry, or invented metric.
- No broad redesign of every settings and operational form in this TIP.
- No production deployment, external service, billing action, or push.

## Builder completion report

Report exact files, dependency changes, token and font decisions, locale/theme
persistence behavior, translation coverage, accessibility evidence, visual
matrix paths, quality-gate counts, deviations, and confirmation that governed
semantics were unchanged.

## Authorization gate

Implementation begins only after the Owner explicitly authorizes
`TIP-002A`. A later `TIP-002B` may migrate remaining product surfaces only
after this foundation passes Contractor verification.

## Local closure

Closed on `2026-07-29`.

- Vietnamese-first locale and system-first appearance contracts are implemented
  with persistent explicit choices and pre-paint theme resolution.
- Precision Instrument typography, light/dark semantic tokens, grouped
  navigation, and the Governed Provenance Rail are implemented.
- Dashboard, Mission Workspace, and Control Room share the new hierarchy
  without changing governed domain or authorization semantics.
- The `vi/en × light/dark` dashboard matrix contains 16 screenshots across
  390×844, 768×1024, 1280×800, and 1536×1024.
- Typecheck, lint, production build, 143 unit, 123 integration, and all 79 E2E
  scenarios pass.
- No external resource, provider, billing action, deployment, push, or release
  was performed.

See `docs/verification/TIP-002A_COMPLETION_REPORT.md` and
`docs/verification/TIP-002A_VERIFY_REPORT.md`.
