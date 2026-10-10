import { finiteGraphAdapter } from "./finite-graph";
import { integerWitnessAdapter } from "./integer-witness";
import { polynomialIdentityAdapter } from "./polynomial-identity";
import { rationalIntervalFloorAdapter } from "./rational-interval-floor";
import type { DomainAdapter } from "../types";

// Reviewed domain-owned catalog is the ONLY registry extension seam. Generic
// resolver, provider and verifier sources remain frozen during fourth transfer.
export const installedAdapters: readonly DomainAdapter[] = Object.freeze([
  integerWitnessAdapter, finiteGraphAdapter, polynomialIdentityAdapter, rationalIntervalFloorAdapter,
]);
