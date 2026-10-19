import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    // Reusable QA/build outputs and historical per-TIP outputs are not sources.
    ".next-*/**",
    // Package-manager caches/dependencies are not maintained project code.
    ".pnpm-store/**",
    "**/node_modules/**",
    // Emitted parser candidates include vendored TypeScript grammar bodies.
    // Handwritten scripts/test code remains linted; artifact hashes stay intact.
    "scripts/test/generated/private-grammar-tip081-p2.candidate.mjs",
    "scripts/test/generated/private-grammar-tip081-p2.checked.candidate.mjs",
    "scripts/test/generated/private-grammar-tip081-p2.v5.candidate.mjs",
    "scripts/test/generated/private-grammar-tip081-p2.v6.candidate.mjs",
    "scripts/test/generated/private-summary-tip081-p3.candidate.mjs",
    "scripts/test/generated/private-summary-tip081-p3.alias-fault.candidate.mjs",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
