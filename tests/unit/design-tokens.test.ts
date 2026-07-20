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
  "--color-canvas: #f8f9fb",
  "--color-surface: #ffffff",
  "--color-surface-subtle: #fbfcfd",
  "--color-surface-selected: #f0f3f8",
  // text hierarchy
  "--color-ink: #101828",
  "--color-ink-strong: #0b1220",
  "--color-ink-muted: #667085",
  "--color-ink-faint: #98a2b3",
  // lines
  "--color-line: #e4e7ec",
  "--color-line-strong: #d0d5dd",
  // navy + semantic
  "--color-navy-900: #102044",
  "--color-navy-800: #172b55",
  "--color-navy-700: #1f3a70",
  "--color-blue-600: #2457d6",
  "--color-success-600: #17865f",
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

  it("page title is 24/32 weight 600 (locked)", () => {
    const block = css.slice(css.indexOf(".text-page-title"));
    expect(block).toMatch(/font-size:\s*24px/);
    expect(block).toMatch(/line-height:\s*32px/);
    expect(block).toMatch(/font-weight:\s*600/);
  });
});
