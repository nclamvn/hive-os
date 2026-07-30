import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

// DS-01 — the locked tokens exist in the single semantic source of truth.
const css = readFileSync(
  path.resolve(__dirname, "../../src/app/globals.css"),
  "utf8",
);

const REQUIRED_TOKENS = [
  // canvas & surface
  "--color-canvas: #f4f6f8",
  "--color-surface: #ffffff",
  "--color-surface-subtle: #f8fafc",
  "--color-surface-selected: #eaf0fb",
  // text hierarchy
  "--color-ink: #0c1424",
  "--color-ink-strong: #08101f",
  "--color-ink-muted: #617086",
  "--color-ink-faint: #8b98aa",
  // lines
  "--color-line: #dce3eb",
  "--color-line-strong: #c4cfdb",
  // navy + semantic
  "--color-navy-900: #10244a",
  "--color-navy-800: #17366a",
  "--color-navy-700: #24498a",
  "--color-blue-600: #315fe8",
  "--color-success-600: #0b7a67",
  "--color-warning-600: #c46716",
  "--color-danger-600: #b42318",
  "--color-violet-600: #7047c7",
  // radii
  "--radius-panel: 10px",
  // shadow
  "--shadow-panel:",
  // focus ring
  "--focus-ring:",
  // shell dimensions
  "--shell-header: 64px",
  "--shell-sidebar: 244px",
  "--shell-rail: 372px",
];

describe("DS-01 locked design tokens", () => {
  it.each(REQUIRED_TOKENS)("declares %s", (token) => {
    expect(css).toContain(token);
  });

  it("declares the canonical typography roles", () => {
    for (const role of [
      ".text-page-title",
      ".text-section-title",
      ".text-body",
      ".text-meta",
    ]) {
      expect(css).toContain(role);
    }
  });

  it("page title is 26/34 weight 600 (Precision Instrument)", () => {
    const block = css.slice(css.indexOf(".text-page-title"));
    expect(block).toMatch(/font-size:\s*26px/);
    expect(block).toMatch(/line-height:\s*34px/);
    expect(block).toMatch(/font-weight:\s*600/);
  });

  it("declares dark semantic overrides and three type roles", () => {
    expect(css).toContain('html[data-theme="dark"]');
    expect(css).toContain("--color-canvas: #0d0e10");
    expect(css).toContain("--color-surface: #131518");
    expect(css).toContain("--color-surface-selected: #25292f");
    expect(css).toMatch(/--font-sans:\s+var\(--font-body\)/);
    expect(css).toContain("--font-serif: var(--font-display)");
    expect(css).toMatch(/--font-mono:\s+var\(--font-utility\)/);
  });
});
