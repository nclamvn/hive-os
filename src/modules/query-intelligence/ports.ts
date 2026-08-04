import type { WorkspaceContext } from "@/modules/identity-workspace";

import type { EntityCandidate, QueryAnalysis } from "./contracts";

export interface QueryAnalyzerPort {
  analyze(input: {
    question: string;
    preferredLanguage: "vi" | "en" | "unknown";
  }): Promise<unknown>;
}

/**
 * Registry resolution is always tenant-scoped and bounded. Implementations
 * must return only curator-confirmed records visible to the caller.
 */
export interface EntityRegistryPort {
  resolve(
    ctx: WorkspaceContext,
    input: {
      rawQuestion: string;
      analysis: QueryAnalysis;
      first: number;
    },
  ): Promise<EntityCandidate[]>;
}
