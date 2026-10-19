import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

const ROOTS = ["src/modules", "src/server"];

function listFilesRecursively(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(root, entry.name);
    return entry.isDirectory()
      ? listFilesRecursively(absolute)
      : entry.isFile() && entry.name.endsWith(".ts")
        ? [absolute]
        : [];
  });
}

// These reads are resource-local or input-bounded correctness operations, not
// tenant collection ports.
const APPROVED_UNBOUNDED = new Set([
  "src/modules/execution-fabric/kernel.ts:tx.executionTipDependency",
  "src/modules/execution-fabric/kernel.ts:tx.executionTip",
  "src/modules/mission-kernel/mission.ts:getDb().runtimeObligation",
  "src/modules/truth-kernel/kernel.ts:tx.claimVersion",
  "src/modules/truth-kernel/kernel.ts:tx.evidenceSpan",
  "src/modules/verification-governance/kernel.ts:tx.requirement",
  "src/modules/verification-governance/kernel.ts:tx.verificationScenario",
  "src/modules/verification-governance/kernel.ts:tx.executionArtifact",
  "src/modules/verification-governance/kernel.ts:tx.runtimeGate",
  "src/server/pilot-measurement.ts:getDb().auditEvent",
  "src/server/pilot-measurement.ts:getDb().provenanceEdge",
]);

describe("bounded collection policy", () => {
  it("QUERY-04 rejects new unbounded findMany collection reads", () => {
    const found = new Set<string>();
    for (const root of ROOTS) {
      for (const absolute of listFilesRecursively(path.resolve(root))) {
        const sourceText = readFileSync(absolute, "utf8");
        const source = ts.createSourceFile(
          absolute,
          sourceText,
          ts.ScriptTarget.Latest,
          true,
        );
        const relative = path.relative(process.cwd(), absolute);
        const visit = (node: ts.Node) => {
          if (
            ts.isCallExpression(node) &&
            ts.isPropertyAccessExpression(node.expression) &&
            node.expression.name.text === "findMany"
          ) {
            const options = node.arguments[0];
            const bounded =
              options &&
              ts.isObjectLiteralExpression(options) &&
              options.properties.some(
                (property) =>
                  ts.isPropertyAssignment(property) &&
                  ts.isIdentifier(property.name) &&
                  property.name.text === "take",
              );
            if (!bounded) {
              found.add(
                `${relative}:${node.expression.expression.getText(source)}`,
              );
            }
          }
          ts.forEachChild(node, visit);
        };
        visit(source);
      }
    }
    expect([...found].sort()).toEqual([...APPROVED_UNBOUNDED].sort());
  });
});
