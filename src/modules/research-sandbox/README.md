# TIP-024B/024C — Governed Research Agent and Isolated Computational Sandbox

This module is a provider-neutral control plane. It does not call an AI API,
execute notebooks, compile LaTeX or run a CAS inside the Next.js process.

## Invariants

1. A request is accepted through the durable command/outbox/job plane.
2. Provider and runtime identifiers must satisfy the workspace policy. Secrets
   never enter a request, audit payload or retained manifest.
3. Research source bodies are retained with a SHA-256 digest. Every non-null
   finding must bind to an exact excerpt and valid offsets in that body.
4. Primary provenance is derived only from the deterministic domain policy. A
   provider cannot promote its own source to `VERIFIED_PRIMARY`.
5. `HONEST_NULL` has no source or fabricated excerpt.
6. Sandbox output is checked against the actual returned bytes, resource
   ceilings and network policy before a manifest is retained.
7. Source snapshots, findings and review decisions are append-only and RLS
   isolated by organization.
8. A requester cannot review their own research or computation run.
9. Authoring and release consumers use `getApprovedResearchBundle`. That gate
   recomputes the retained digest and returns accepted findings only.

## Worker adapters

An external worker claims `research.run.execute` or `sandbox.run.execute`, then
calls `executeResearchJob` with a `ResearchProvider` or `executeSandboxJob` with
a `SandboxExecutor`. The adapter is responsible for network retrieval or an
isolated container runtime. The kernel validates the returned contract and
owns all state transitions.

TIP-024C connects two concrete adapters without moving authority out of the
kernel:

- `OpenAIResearchProvider` uses the Responses API `web_search` tool and strict
  structured output. A model-proposed URL is accepted only when the tool's
  returned source metadata contains it. The worker then retrieves the page
  independently through an HTTPS-only, public-address-only, redirect-bounded
  loader. Findings that cannot be rebound to an exact retained span are
  dropped; if none survive, the adapter emits `HONEST_NULL`.
- `DockerSandboxExecutor` accepts only `artifact://` input objects whose bytes
  match the requested digest. It uses a fixed shell-free command map for CAS,
  Jupyter and LaTeX, digest-pinned images, `--network none`, a read-only root,
  all capabilities dropped, `no-new-privileges`, a PID limit, non-root UID,
  bounded CPU/memory/wall/output and object-storage output.

`ALLOWLIST` is deliberately unsupported by the Docker adapter. Implementing it
requires a separately governed egress proxy; the worker fails closed instead
of pretending Docker DNS controls are an allowlist.

Run one tenant-scoped worker process with `npm run worker:research-sandbox`.
Configuration is documented in `.env.example`. Secrets remain environment-only
and are never copied into durable jobs, audit payloads, source snapshots or
output manifests.

The mandatory local container bite is `npm run test:sandbox-container`. It
proves network denial and read-only-root behavior against an actual container.
