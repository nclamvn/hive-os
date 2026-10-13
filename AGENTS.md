<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## HIVE OS project context

Before planning or changing this repository, read
`docs/CODEX_CHAT_HANDOFF.md`. It contains the durable transfer of decisions,
gate status, scope boundaries, and interface requirements from the ChatGPT
Project.

## Research commitment discipline

Before research or method-development work, read
`docs/research/RESEARCH_COMMITMENT_PROTOCOL.md` and
`docs/research/ACTIVE_RESEARCH_COMMITMENT.md`, then the latest completion checkpoint
in the handoff. Bind every work item to the active milestone's exact open
obligation and admissible closure evidence. “Continue/tiếp tục” does not authorize
a new target, TIP family, mode, resource ceiling or execution grant. If the active
milestone is closed or missing, stop and request the next routing decision.
Tests, hashes, finite samples and conditional subfamilies must not substitute for
the committed mathematical closure. Strategic revisions require direct human
confirmation and preserved predecessor history; existing runtime gates remain.

## Disk hygiene

User-confirmed 2026-10-09 (see also `~/.codex/AGENTS.md`): do not add a new
`.next-tipXXX` distDir or `/tmp/hiveos-tipXXX-*` shadow copies per TIP. Reuse one
`.next-qa` folder for QA builds, delete TIP-specific build folders and scratch
copies when the TIP closes, and report what was removed.
