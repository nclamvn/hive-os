# Design System — PRECISION INSTRUMENT LOCKED

Reference: `assets/hive-os-ui-locked.png`

Amended by: `TIP-002A`, `TIP-002B`, `DEC-016`, and `TIP-023F-R2` on
`2026-07-30`

## Visual character

Academic, deeptech, mature, quiet, and precise. HIVE OS must feel like a
premium research instrument whose structure exposes authority and provenance,
not a colorful SaaS dashboard or decorative science-fiction interface.

The signature is the **Governed Provenance Rail**:

```text
Mission → Truth → Execution → Verification → Release
```

It represents real governed flow and never fabricates completion.

## Locale and appearance defaults

- Product interface supports Vietnamese and English.
- First visit defaults to Vietnamese (`vi`); browser language does not silently
  override this Owner decision.
- Appearance supports `system`, `light`, and `dark`.
- First visit defaults to `system`; explicit choices persist.
- System mode continues tracking operating-system changes.
- Theme resolves before first meaningful paint.

## Non-negotiables

- No gradients.
- No glassmorphism.
- No neon, glow, or decorative telemetry.
- No large decorative illustrations.
- No colored card backgrounds except restrained semantic tints.
- No oversized rounded capsules.
- No arbitrary shadows or floating panels.
- No fake charts, percentages, counts, activity, or progress.
- Color communicates type, state, or authority, not decoration.
- Dark mode preserves the same information hierarchy as light mode.

## Typography

- Product interface and display: Inter, weight 400–600. Titles, theses,
  headings, controls and body copy use the same family in Vietnamese and
  English.
- Data/utility: IBM Plex Mono, weight 400–600, used sparingly for identifiers,
  hashes, timestamps, gates, and evidence coordinates.
- Tabular numerals for metrics and IDs.
- Body: 14px / 21px.
- Metadata: 12px / 18px.
- Page title: 26px / 34px, weight 600.
- Section title: 15–16px / 24px, weight 600.
- No serif face is loaded by the application.

## Core semantic tokens

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#f4f6f8` | `#0b1018` |
| Surface | `#ffffff` | `#111925` |
| Surface subtle | `#f8fafc` | `#151f2c` |
| Surface selected | `#eaf0fb` | `#1a2b49` |
| Ink | `#0c1424` | `#e8edf5` |
| Ink strong | `#08101f` | `#f5f7fb` |
| Ink muted | `#617086` | `#9aa8ba` |
| Line | `#dce3eb` | `#273447` |
| Line strong | `#c4cfdb` | `#3a4a60` |
| Authority | `#315fe8` | `#8aabff` |
| Verified | `#0b7a67` | `#56c7ad` |

Semantic warning, danger, and informational tokens must pass WCAG AA in both
themes. Focus uses the authority token and must remain visible independently of
color.

## Shape and surface

- Small radius: 6px.
- Control radius: 8px.
- Panel radius: 10px.
- Panel shadow: at most one low-opacity 1px depth cue.
- Prefer open instrument bays, hairline rules, and semantic grouping over a
  separate rounded card for every datum.

## Layout tokens

- Desktop canvas target: 1440–1600px.
- Sidebar: 244px fixed desktop, collapsible tablet.
- Right context rail: 360–380px when present.
- Main content max: fluid; minimum readable center column 720px.
- Page gutters: 28–32px desktop, 20px tablet, 16px mobile.
- Panel padding: 20px.
- Grid gap: 16px standard, 24px major.
- Header height: 64px.
- Row height: 54–58px.

## Page alignment DNA

Every primary page surface must use one explicit width mode:

1. **Fluid instrument canvas** for dashboards, maps, operational grids and
   tables that materially benefit from the available width.
2. **Centered bounded canvas** for forms, settings, reading and focused
   workflows. Use `w-full`, an intentional `max-width`, and `margin-inline:
   auto`.

Never place a narrow, left-anchored `max-width` child inside an otherwise
full-width empty panel. If a form is bounded, its containing panel is bounded
and centered with it; the form then fills the usable panel width. On mobile,
both modes become full-width within the standard page gutters.

## Responsive behavior

- Right rail moves below the main content below 1180px.
- Sidebar becomes an icon rail below 1024px and drawer below 768px.
- Active missions table becomes stacked rows below 820px.
- Mission composer remains the first actionable main element.
- The Provenance Rail remains readable without horizontal page overflow.

## Accessibility and motion

- WCAG AA text contrast in light and dark.
- Visible keyboard focus.
- No state communicated by color alone.
- Correct table headers and mobile alternatives.
- Dynamic status changes are announced to assistive technology.
- One restrained provenance/gate transition is allowed.
- All information and operations remain available under reduced motion.
