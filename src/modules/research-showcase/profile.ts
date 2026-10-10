/** TIP079 fixed target. These documented partial switches are NOT a no-tool proof. */
export const poly19CodexProfile = Object.freeze({
  model: "gpt-6.1-sol" as const,
  reasoningEffort: "high" as const,
  serviceTier: "priority" as const,
  promptBytes: 128 * 1024,
  originalBytes: 32 * 1024,
  traceBytes: 512 * 1024,
  modelTools: 0,
  requestedTransport: "CHATGPT_SUBSCRIPTION_CLI" as const,
});

/** Evidence inventory only; deliberately not executable argv or an active profile. */
export const documentedPartialToolControls = Object.freeze({
  "features.shell_tool": false,
  "features.unified_exec": false,
  "features.apps": false,
  "features.hooks": false,
  "features.multi_agent": false,
  "agents.enabled": false,
  "tools.view_image": false,
  web_search: "disabled",
});

/** No env read here. Secrets and provider/proxy overrides never enter a proposed child. */
export function sanitizedCodexEnvironment(input: Readonly<Record<string, string | undefined>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of ["PATH", "HOME", "CODEX_HOME", "TMPDIR", "LANG", "LC_ALL"]) {
    const value = input[key];
    if (typeof value === "string") out[key] = value;
  }
  return out;
}
