import { frozen, refuse } from "./bounded-json";
import { installedAdapters } from "./domains/installed-adapters";
import type { DomainAdapter } from "./types";

// Reviewed static installation seam. Fourth-domain transfer changes ONLY this
// list and its domain-owned module, not lifecycle/provider/closure logic.
const installed = installedAdapters;
export function resolveDomainAdapter(id: string, version = 1): DomainAdapter {
  const adapter = installed.find(a => a.id === id && a.version === version);
  if (!adapter) refuse("UNSUPPORTED", "Domain adapter/version is not installed");
  return adapter;
}
export function listDomainAdapters() {
  return frozen(installed.map(a => ({ id: a.id, version: a.version, capabilities: [...a.capabilities], limits: { ...a.limits }, implementationDigest: a.checkerSourceDigest, inputSchema: a.inputSchema, candidateSchema: a.candidateSchema, methodCards: a.methodCards })));
}
