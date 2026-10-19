import type { ShowcaseContainmentReadiness, ShowcaseTransport, ShowcaseTransportResult } from "./contracts";
import { getPoly19ContainmentStatus } from "./containment";

/** A diagnostic status, NOT a grant. Current CLI's complete pre-effect tool
 * boundary is unestablished. Never accept a caller's approval/config as evidence.
 */
export function getShowcaseContainmentReadiness(): ShowcaseContainmentReadiness {
  const status = getPoly19ContainmentStatus();
  return Object.freeze({ status: status.status, reason: status.reason, evidenceDigest: null });
}

/** Disabled live-intent port. It has no executable path, subprocess, filesystem,
 * credential, network, prompt parsing, fallback provider, or tool dispatch seam.
 * Refusal happens before reading even untrusted request/permit properties.
 * Adding a real implementation requires new independently reviewed containment.
 */
export const nativeShowcaseTransport: ShowcaseTransport = Object.freeze({
  provenance: "LIVE_NATIVE" as const,
  async readiness() { return getShowcaseContainmentReadiness(); },
  async execute(): Promise<ShowcaseTransportResult> {
    return { outcome: "CONTAINMENT_REFUSED_BEFORE_EFFECT", rawOriginal: "", rawTrace: new Uint8Array(0),
      threadId: null, usage: null, actualModelVersion: null, elapsedMilliseconds: 0,
      invocationStarted: false, remoteEffect: "NONE", reason: "ALL_MODEL_TOOL_DENIAL_NOT_ESTABLISHED" };
  },
});
