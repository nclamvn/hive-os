import pg from "pg";

const databaseUrl = process.env.TIP023H_DATABASE_URL;
const organizationId = process.env.TIP023H_ORGANIZATION_ID;
const workerId = process.env.TIP023H_WORKER_ID;
if (!databaseUrl || !organizationId || !workerId) {
  throw new Error("TIP-023H worker requires database, organization and worker identity");
}

const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
let processed = 0;
try {
  for (;;) {
    await client.query("BEGIN");
    try {
      await client.query(
        "SELECT set_config('hiveos.organization_id', $1, true)",
        [organizationId],
      );
      const result = await client.query(
        `WITH candidates AS (
           SELECT id
           FROM durable_job
           WHERE organization_id = $1
             AND job_type = 'scale.certification.noop'
             AND status = 'READY'
             AND available_at <= now()
           ORDER BY priority ASC, available_at ASC, id ASC
           FOR UPDATE SKIP LOCKED
           LIMIT 25
         ), completed AS (
           UPDATE durable_job job
           SET status = 'SUCCEEDED', attempts = attempts + 1,
               result = jsonb_build_object('workerId', $2::text),
               completed_at = now(), updated_at = now(), version = version + 1
           FROM candidates
           WHERE job.organization_id = $1 AND job.id = candidates.id
             AND job.status = 'READY'
           RETURNING job.id, job.workspace_id, job.attempts
         )
         INSERT INTO durable_job_event
           (id, organization_id, workspace_id, job_id, event_type,
            attempt_number, worker_id, created_at)
         SELECT md5($2::text || ':' || completed.id), $1::text, completed.workspace_id,
                completed.id, 'SUCCEEDED', completed.attempts, $2, now()
         FROM completed
         RETURNING job_id`,
        [organizationId, workerId],
      );
      await client.query("COMMIT");
      processed += result.rowCount ?? 0;
      if (!result.rowCount) break;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
  process.stdout.write(`${JSON.stringify({ workerId, processed })}\n`);
} finally {
  await client.end();
}
