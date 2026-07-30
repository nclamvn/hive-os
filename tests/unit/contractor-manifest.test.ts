import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = path.resolve(__dirname, "../..");
const manifestPath = path.join(
  root,
  "docs/contractor/MANIFEST.current.sha256",
);

describe("Contractor package integrity", () => {
  it("XC-07 matches every current manifest entry", () => {
    const entries = readFileSync(manifestPath, "utf8")
      .trim()
      .split("\n")
      .filter(Boolean);

    const listed = new Set<string>();
    for (const entry of entries) {
      const match = entry.match(/^([a-f0-9]{64})  (docs\/contractor\/.+)$/);
      expect(match, `malformed manifest entry: ${entry}`).toBeTruthy();
      const [, expected, relativePath] = match!;
      listed.add(relativePath);
      expect(relativePath).not.toMatch(/MANIFEST\.(?:current|founding)\.sha256$/);
      const contents = readFileSync(path.join(root, relativePath));
      const actual = createHash("sha256").update(contents).digest("hex");
      expect(actual, relativePath).toBe(expected);
    }

    const contractorRoot = path.join(root, "docs/contractor");
    const currentFiles: string[] = [];
    const visit = (directory: string) => {
      for (const item of readdirSync(directory, { withFileTypes: true })) {
        const absolute = path.join(directory, item.name);
        if (item.isDirectory()) visit(absolute);
        else {
          const relative = path.relative(root, absolute);
          if (!/MANIFEST\.(?:current|founding)\.sha256$/.test(relative)) {
            currentFiles.push(relative);
          }
        }
      }
    };
    visit(contractorRoot);

    expect([...listed].sort()).toEqual(currentFiles.sort());
  });
});
