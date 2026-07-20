# Design System — LOCKED FROM LATEST MOCK

Reference: `assets/hive-os-ui-locked.png`

## Visual character

Academic, deeptech, mature, quiet, precise. The product should feel closer to a premium research instrument or institutional knowledge system than a colorful SaaS dashboard.

## Non-negotiables

- Light theme as default.
- No gradients.
- No glassmorphism.
- No neon.
- No large decorative illustrations.
- No colored card backgrounds except extremely pale semantic tints.
- No oversized rounded capsules.
- No arbitrary shadows or floating panels.
- No fake charts, percentages, counts, or activity.
- Color communicates type or state, not decoration.

## Typography

- Primary family: Inter, with system sans fallback.
- Heading weight: 600, never extra-bold.
- Body weight: 400–500.
- Tabular numerals for metrics and IDs.
- Default body: 14px / 21px.
- Small metadata: 12px / 18px.
- Page title: 24px / 32px, weight 600.
- Section title: 15–16px / 24px, weight 600.

## Core tokens

```css
:root {
  --canvas: #f8f9fb;
  --surface: #ffffff;
  --surface-subtle: #fbfcfd;
  --surface-selected: #f0f3f8;

  --ink: #101828;
  --ink-strong: #0b1220;
  --ink-muted: #667085;
  --ink-faint: #98a2b3;

  --line: #e4e7ec;
  --line-strong: #d0d5dd;

  --navy-900: #102044;
  --navy-800: #172b55;
  --navy-700: #1f3a70;
  --blue-600: #2457d6;

  --success-600: #17865f;
  --success-50: #eefaf5;
  --warning-600: #c46716;
  --warning-50: #fff7ed;
  --danger-600: #b42318;
  --danger-50: #fef3f2;
  --violet-600: #7047c7;
  --violet-50: #f5f2ff;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;
  --radius-xl: 12px;

  --shadow-panel: 0 1px 2px rgba(16,24,40,.035);
  --focus-ring: 0 0 0 3px rgba(36,87,214,.14);
}
```

## Layout tokens

- Desktop canvas target: 1440–1600px.
- Sidebar: 244px fixed desktop, collapsible tablet.
- Right context rail: 360–380px when present.
- Main content max: fluid; minimum readable center column 720px.
- Page gutters: 28–32px desktop, 20px tablet, 16px mobile.
- Card padding: 20px.
- Grid gap: 16px standard, 24px major.
- Header height: 64px.
- Row height: 54–58px.

## Components

### Primary button
Navy background, white text, 8px radius, 40px height. No gradient. Hover darkens by one token step.

### Secondary button
White background, 1px line border, ink text.

### Panels
White surface, 1px line border, 10px radius, subtle or no shadow.

### Status badge
Small text, thin border or pale tint. Do not use saturated fills.

### Progress
2–4px track. Semantic line only. Progress values are derived from closed obligations.

### Icons
Lucide-like 18–20px line icons. Dark neutral by default. Semantic color only when meaningful.

## Responsive behavior

- Right rail moves below main content below 1180px.
- Sidebar becomes icon rail below 1024px and drawer below 768px.
- Active missions table becomes stacked rows below 820px.
- Mission composer remains the first actionable element.

## Accessibility

- WCAG AA text contrast.
- Visible keyboard focus.
- No state communicated by color alone.
- Tables have correct headers and mobile alternatives.
- All status changes announced to assistive technology where dynamic.
