import { poly19CodexProfile } from "./profile";

export const containmentDocumentation = Object.freeze([
  "https://learn.chatgpt.com/docs/config-file/config-reference",
  "https://learn.chatgpt.com/docs/permissions",
  "https://developers.openai.com/codex/app-server",
]);

export interface Poly19ContainmentStatus {
  readonly status: "BLOCKED_UNESTABLISHED";
  readonly liveEnabled: false;
  readonly reason: "ALL_MODEL_TOOL_DENIAL_NOT_ESTABLISHED";
  readonly requestedModelTools: 0;
  readonly establishedDeniedModelTools: null;
  readonly model: "gpt-6.1-sol";
  readonly configuredEffort: "high";
  readonly configuredServiceTier: "priority";
  readonly inspectedCliVersion: "0.160.0";
  readonly diagnosticScope: "OFFLINE_DOCS_MANUAL_AND_GENERATED_PROTOCOL_SCHEMA";
}

/** No caller data, config flag, empty trace, fixture, or Markdown can activate this.
 * Source-reviewed runtime tool-registry denial remains a separate unmet condition.
 */
export function getPoly19ContainmentStatus(): Poly19ContainmentStatus {
  return Object.freeze({ status: "BLOCKED_UNESTABLISHED", liveEnabled: false,
    reason: "ALL_MODEL_TOOL_DENIAL_NOT_ESTABLISHED", requestedModelTools: 0,
    establishedDeniedModelTools: null, model: poly19CodexProfile.model,
    configuredEffort: poly19CodexProfile.reasoningEffort,
    configuredServiceTier: poly19CodexProfile.serviceTier,
    inspectedCliVersion: "0.160.0", diagnosticScope: "OFFLINE_DOCS_MANUAL_AND_GENERATED_PROTOCOL_SCHEMA" });
}
