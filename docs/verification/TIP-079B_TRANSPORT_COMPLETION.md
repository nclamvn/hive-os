# TIP-079B — no-tool transport engineering / live containment blocked

2026-10-06. Root NATIVE_POLY19_SHOWCASE_079 / ENGINEERING_IMPLEMENTATION.
STATUS: PARTIAL / LIVE_BLOCKED_UNESTABLISHED. Actual model requests ZERO.
Owner-approved blueprint d115a3793742f864728c8ea6c4869e2a4071486883d7c9b57eeb29ac94c90218
and approved build-task boundaries preserved. No model migration, API fallback,
credential/user-config inspection or copying, install, database/browser/Git effect,
old TIP076 source reseal, historical LRCgrant/attempt access or task substitution.

## Consequential conclusion

The installed CLI0.160.0's complete, before-effect all-model-tools-denied boundary
was NOT established. This is a scoped lack-of-admissible-evidence conclusion,
not proof that every future Codex version or integration lacks the capability.
Live native transport remains disabled. Fixtures, read-only/empty cwd, prompts,
individual feature switches, missing observed tool items, strict-config acceptance
or reactive JSONL rejection are explicitly not used to close containment.
079-R2/R10 fresh native/model/browser acceptance remains NOT_RUN.

Implemented the exact fail-closed runtime seam requested by Builder079A:
`getShowcaseContainmentReadiness()` returns BLOCKED_UNESTABLISHED with null
evidenceDigest; `nativeShowcaseTransport` has LIVE_NATIVE intent but execute always
returns CONTAINMENT_REFUSED_BEFORE_EFFECT. invocationStarted=false, remoteEffect=NONE,
empty rawOriginal/rawTrace, null thread/usage/version, elapsed0. No subprocess,
filesystem/network/credential or fallback provider implementation is reachable.
Refusal precedes reading caller request/permit fields; forged approval/trace data
cannot enable it. Any future real transport requires separately reviewed source.

## Source-first bounded investigation

Used OpenAI Docs skill: official documentation search then page fetch before local
CLI manuals/schema inspection. Searches covered complete tool denial, permissions,
shell/apply_patch, and app-server tool policy. No inference to test containment.

Primary fetched sources:

- [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference):
  individual shell/apps/hooks/agents/image/web controls, managed versus local scope,
  no established comprehensive model-tool-registry deny in the fetched evidence.
- [Permissions](https://learn.chatgpt.com/docs/permissions): beta filesystem/network
  profiles constrain local commands; they do not generally disable hosted search,
  apps or MCP. A named permissions field is not a total model-tool capability deny.
- [Codex App Server](https://developers.openai.com/codex/app-server): documented
  offline version-specific schema generation and thread/turn protocol. Did NOT
  start an app-server, initialize/authenticate, start threads/turns, use direct OAuth
  or backend endpoints, or issue model-list/provider requests.

Read-only CLI manual checks: `--help`, `exec --help`, `debug --help`,
`debug prompt-input --help`, `features --help`, `app-server --help`,
`app-server generate-json-schema --help`, version0.160.0. These expose
strict-config/ignore-user-config/ignore-rules and individual feature overrides;
none supplies a documented complete tool inventory/deny attestation before model
effect. Strict-config rejects unrecognized settings; it is not completeness proof.
CLI repeatedly reported inability to create PATH aliases; no override was used.
No user config or auth files were opened, printed, copied or modified by Builder.

Installed CLI executable resolved to:
`/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex`.
Offline generated schema command: `codex app-server generate-json-schema --experimental
--out /private/tmp/tip079-schema-nFsKHR`. This generated protocol files only,
not a running server/config snapshot/model-facing actual tool registry.

Fixed inspected artifacts and SHA256:

| Artifact | SHA256 |
| --- | --- |
| /private/tmp/tip079-schema-nFsKHR/v2/ThreadStartParams.json | 80a40a7fac15b4bf70efb7f893fb353acc0a0d30c68f54aee4f01923deca85de |
| /private/tmp/tip079-schema-nFsKHR/v2/TurnStartParams.json | 07771223642e1b61bd9aac0069fc0f98143a1c047724ca02c7ceb13653442738 |
| /private/tmp/tip079-schema-nFsKHR/v2/ConfigReadResponse.json | 4ec77e1a3eed746037149799c3b6bb8fe7b4b593e5930fc9f410e6282de9df50 |
| /private/tmp/tip079-schema-nFsKHR/codex_app_server_protocol.v2.schemas.json | e77b7d1436a78f431a74b2cb263a862e92ae40d70411bc63835b47ab2168827c |

ThreadStartParams fields include config/dynamicTools/environments/permissions;
dynamicTools does not supply a documented blanket removal of built-in tools.
permissions is a named profile (lines433–438). TurnStartParams permissions is
likewise a named profile (875–880); disabledPluginIds is scoped to plugins.
ConfigReadResponse ToolsV2 contains web_search only (1059–1073). No complete
tool_choice/allowedTools/noTools/effective-tool-registry field was found in the
generated inspected schemas. CLI features list and debug prompt-input were NOT
run (only help): avoided exposing/loading current user instructions/config.

## Software implementation and evidence

Created only assigned NEW transport/profile/containment/capture source + unit tests
and this report. Profile pins requested gpt-6.1-sol/high/priority and exact byte/tool
ceilings. Sanitized environment is a pure input transformation, excluding API keys,
provider/proxy/database overrides; it does not read ambient environment or auth.
Documented partial switches remain evidence inventory, never executable argv.

Pure offline capture retains raw bounded JSONL before interpretation; caps512KiB
trace/32KiB message; preserves original bytes; rejects duplicate threads/turns/
completed messages and invalid stage order; marks timeout/nonzero/oversize/unknown
tools/malformed data honestly. Missing usage/version stays UNKNOWN/null. Tool
events may already have effects, therefore remoteEffect UNKNOWN and
toolDenialEstablished=false even for a clean trace. Parser never adopts scientific
JSON or proves containment, and is not connected to a live provider.

Fresh unit suite:34/34 PASS,0FAIL, Vitest195ms / tool wrapper305ms. Prior29/29 run
PASS205ms / wrapper510ms retained in chat; not added to distinct logical count.
Shared focused-QA charged wrapper aggregate0.815s (<600s), no integration/model QA.
Scoped ESLint five files exit0, no errors/warnings; separate ~1s run. Main whole
typecheck/build/integration remain outside this Builder completion evidence.
Tests exercise zero-effect refusal/getters/forged permit, fixed profile/env,
lossless byte fragmentation, oversize retention,10 unexpected tool classes,
timeout/nonzero/incomplete/UNKNOWNs and strict context/ordering/duplicate refusal.
All observations are engineering fixtures, not actual-model/run evidence.

Source pins:

| NEW file | SHA256 |
| --- | --- |
| src/modules/research-showcase/profile.ts | 00a319641e28d0788d821e82cd9332b31fd2aa67c7ca7399eb8460b764cd9fd2 |
| src/modules/research-showcase/containment.ts | ad6fc4ce86c91d12bef041d9f14f0b0806db00e93929ee33ab17658f105bc4e2 |
| src/modules/research-showcase/transport.ts | 3aaa842d0b4693b4789efa3624caead328d099a3daa8536579f2ce5503fa34cd |
| src/modules/research-showcase/transport-capture.ts | 0317b29fef436983e9054bf36ac779bc45fdafd22547eecfc29cf2fa5364ec3a |
| tests/unit/research-showcase-transport.test.ts | 2d9a7f7fb84e7af6701edf2512022da456393a3fee1528c28311cf6e9554d7a1 |

Coverage: fixed profile/explicit unknowns, bounded offline original capture and
safe pre-effect refusal established. Complete supported no-tool containment and
actual4request native execution not established. Same-run role context/authority
transfer belongs079A; no actual cross-role provider run is claimed here.
No actual authenticated UI/browser acceptance performed; no proof/publication or
private FrontierMath score follows. No broad architecture change or weaker
reactive substitute adopted. STOP live activation at the genuine containment
blocker; preserve source/report/diagnostics for Main independent review.
