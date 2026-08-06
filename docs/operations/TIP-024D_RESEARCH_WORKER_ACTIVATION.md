# TIP-024D Research Worker Activation

This runbook activates research collection on the existing budget-constrained
staging node. It does not authorize a second fixed-price compute service.

## Required runtime values

- `DATABASE_URL`: the existing least-privileged application role, with TLS
  verification unchanged.
- `RESEARCH_WORKER_ENABLED=true`.
- `RESEARCH_OPENAI_ENABLED=true`.
- `RESEARCH_WORKER_ORGANIZATION_ID`: the exact organization UUID this worker
  may claim.
- `RESEARCH_WORKER_ACTOR_USER_ID`: a retained service actor with the required
  tenant membership and no owner credential.
- `OPENAI_API_KEY`: injected from the runtime secret boundary.
- Optional `OPENAI_PROJECT`.
- `RESEARCH_WORKER_CLAIM_FIRST=1` on the 512 MiB staging node.
- `RESEARCH_WORKER_POLL_MS=5000` on staging to bound idle database traffic.

Copy the existing PostgreSQL CA bundle into the same read-only mount used by
the web container and retain `NODE_EXTRA_CA_CERTS`. Do not set
`NODE_TLS_REJECT_UNAUTHORIZED=0`.

## Start contract

Resolve the immutable worker image by commit digest. Never deploy the mutable
`staging` tag directly. Use the same root-owned environment file mechanism as
the web runtime, but generate a worker-specific file containing no auth, SMTP,
migration or S3 credential unless an enabled adapter requires it.

Example shape, with operator-resolved values represented by angle brackets:

```bash
docker run --detach \
  --name hiveos-research-worker \
  --restart unless-stopped \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=32m \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  --memory 192m \
  --cpus 0.50 \
  --pids-limit 96 \
  --network host \
  --env-file <worker-runtime-env> \
  --volume <aws-postgresql-ca>:/run/certs/aws-postgresql-ca.pem:ro \
  <worker-image-by-digest>
```

Do not mount the Docker socket for research collection. The computation
sandbox remains disabled on this shared staging node. Enabling it requires a
separate hardened executor boundary and a reviewed digest-pinned runtime
registry.

## Activation checks

1. Confirm the first log record is `research_sandbox_worker_started` with the
   expected organization, worker ID, claim ceiling and adapter booleans.
2. Create one bounded research dossier in the UI.
3. Confirm the UI changes from `QUEUED` to `RUNNING` without manual database
   edits.
4. Confirm the cycle log records one claimed job and no secret, prompt, source
   body or provider response.
5. Confirm the dossier reaches `AWAITING_REVIEW` with retained sources or an
   honest-null finding.
6. Confirm the requester cannot independently approve their own dossier.
7. Record commit, worker image digest, organization, service actor, start time,
   final job state and API usage from the provider console.

## Failure and rollback

- A job that remains queued is durable. Check container state, startup logs,
  organization binding and adapter flags before resubmitting it.
- `ADAPTER_EXECUTION_FAILED` is sanitized. Inspect bounded worker logs and the
  OpenAI project usage/error view; never expose the API response to end users.
- Stop and remove only the named worker container to deactivate processing.
  Queued jobs remain retained for a later compatible worker.
- Revoke or rotate `OPENAI_API_KEY` if it may have crossed the secret boundary.
- Roll back to the previous immutable worker digest only when its database
  contract is compatible with the current migration ledger.
