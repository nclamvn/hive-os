import { randomUUID } from "node:crypto";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import pg from "pg";

import {
  digestResearchResult,
  sha256,
} from "@/modules/research-sandbox/integrity";

import { signUpToDashboard } from "./auth-helpers";
import { E2E_ENV } from "./env";

async function createMission(page: Page, dashboardUrl: string) {
  await page.goto(`${dashboardUrl}/missions/new`);
  await page.getByLabel("Mission title").fill("Governed research dossier");
  await page.getByLabel("Objective").fill("Retain cited research findings.");
  await page.getByLabel("Scope").fill("Primary and independent sources.");
  await page.getByLabel("Success definition").fill("Independently reviewed findings.");
  await page.getByLabel("Requirement title").fill("Source integrity");
  await page.getByLabel("Acceptance criteria").fill("Every finding has an exact source span.");
  await page.getByLabel("Obligation title").fill("Independent review");
  await page.getByRole("button", { name: "Create mission" }).click();
  await page.waitForURL(/\/missions\/[0-9a-f-]{36}/);
}

async function seedApprovedResearch(email: string) {
  const client = new pg.Client({ connectionString: E2E_ENV.DATABASE_MIGRATION_URL });
  await client.connect();
  try {
    const scope = await client.query<{
      organization_id: string;
      workspace_id: string;
      membership_id: string;
      mission_id: string;
      document_id: string;
    }>(
      `SELECT w.organization_id, w.id AS workspace_id, mem.id AS membership_id,
              mission.id AS mission_id, document.id AS document_id
         FROM "user" u
         JOIN membership mem ON mem.user_id = u.id
         JOIN workspace w ON w.id = mem.workspace_id
         JOIN mission ON mission.workspace_id = w.id
         JOIN authoring_document document ON document.workspace_id = w.id
          AND document.mission_id = mission.id
        WHERE u.email = $1
        ORDER BY document.created_at DESC
        LIMIT 1`,
      [email],
    );
    const target = scope.rows[0]!;
    const runId = randomUUID();
    const sourceId = randomUUID();
    const findingId = randomUUID();
    const decisionId = randomUUID();
    const decisionCreatedAt = new Date("2026-08-06T00:00:00.000Z");
    const body = "The retained field protocol requires georeferenced UAV imagery.";
    const excerpt = "georeferenced UAV imagery";
    const contentDigest = sha256(body);
    const finding = {
      key: "georeferenced-evidence",
      kind: "SUPPORTING",
      claim: "Georeferenced imagery is required for the retained inspection record.",
      sourceId,
      excerpt,
      start: body.indexOf(excerpt),
      end: body.indexOf(excerpt) + excerpt.length,
      decision: {
        id: decisionId,
        organizationId: target.organization_id,
        workspaceId: target.workspace_id,
        missionId: target.mission_id,
        researchRunId: runId,
        findingId,
        decision: "ACCEPTED",
        rationale: "The retained exact span supports the bounded claim.",
        reviewedByMembershipId: target.membership_id,
        createdAt: decisionCreatedAt,
      },
    };
    const approvedDigest = digestResearchResult({
      sources: [{
        uri: "https://authority.example/uav-protocol",
        digest: contentDigest,
        provenance: "VERIFIED_PRIMARY",
      }],
      findings: [finding],
    });
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO research_run
        (id, organization_id, workspace_id, mission_id, document_id, question,
         scope, source_policy, query_plan, provider_name, model_name, status,
         command_id, requested_by_membership_id, reviewed_by_membership_id,
         review_rationale, approved_digest, completed_at, reviewed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10,$11,'APPROVED',
         $12,$13,$13,$14,$15,now(),now())`,
      [
        runId,
        target.organization_id,
        target.workspace_id,
        target.mission_id,
        target.document_id,
        "What evidence is required for an accountable UAV inspection?",
        "Retained primary protocols only.",
        JSON.stringify({ allowedDomains: ["authority.example"], primaryDomains: ["authority.example"], requirePrimary: true, maxSources: 5 }),
        JSON.stringify({ queries: ["UAV retained evidence"], languages: ["en"] }),
        "fixture-provider",
        "fixture-model",
        randomUUID(),
        target.membership_id,
        "Fixture represents completed independent review.",
        approvedDigest,
      ],
    );
    await client.query(
      `INSERT INTO research_source_snapshot
        (id, organization_id, workspace_id, mission_id, research_run_id,
         canonical_uri, title, publisher, media_type, content, content_digest,
         provenance, captured_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'text/plain',$9,$10,'VERIFIED_PRIMARY',now())`,
      [sourceId, target.organization_id, target.workspace_id, target.mission_id, runId, "https://authority.example/uav-protocol", "Retained UAV field protocol", "Authority", body, contentDigest],
    );
    await client.query(
      `INSERT INTO research_finding
        (id, organization_id, workspace_id, mission_id, research_run_id,
         source_id, finding_key, kind, claim, exact_excerpt, start_offset,
         end_offset, confidence)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'SUPPORTING',$8,$9,$10,$11,0.95)`,
      [findingId, target.organization_id, target.workspace_id, target.mission_id, runId, sourceId, finding.key, finding.claim, excerpt, finding.start, finding.end],
    );
    await client.query(
      `INSERT INTO research_finding_decision
        (id, organization_id, workspace_id, mission_id, research_run_id,
         finding_id, decision, rationale, reviewed_by_membership_id, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,'ACCEPTED',$7,$8,$9)`,
      [decisionId, target.organization_id, target.workspace_id, target.mission_id, runId, findingId, finding.decision.rationale, target.membership_id, decisionCreatedAt],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

test("TIP-024D-E2E-01 guides a bounded research request and reports the honest worker state", async ({ page }) => {
  const { dashboardUrl } = await signUpToDashboard(page, "Research QA");
  await createMission(page, dashboardUrl);
  await page.goto(`${dashboardUrl}/research`);
  await expect(page.getByRole("heading", { name: "Know what to do. Know what the system is doing." })).toBeVisible();
  await expect(page.getByText("A worker claims work automatically after the research adapter is activated.")).toBeVisible();
  await expect(page.getByLabel("Query plan, one query per line")).not.toBeVisible();
  await expect(page.getByText("Open advanced Jupyter, CAS, or LaTeX tools")).toBeVisible();
  await expect(page.getByLabel("Immutable input reference")).not.toBeVisible();
  await page.getByLabel("Research question").fill("What retained evidence is required?");
  await page.getByLabel("Scope and exclusion criteria").fill("Official protocols; exclude unsupported summaries.");
  await page.getByRole("button", { name: "Assign to worker" }).click();
  await expect(page.getByText("Waiting for worker").first()).toBeVisible();
  await expect(page.getByText("Live tracking, refreshing every 5 seconds")).toBeVisible();
  await expect(page.getByText(/The worker will claim this automatically/).first()).toBeVisible();
  const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(scan.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual([]);
});

test("TIP-024D-E2E-02 guided research has no horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const { dashboardUrl } = await signUpToDashboard(page, "Research Mobile");
  await createMission(page, dashboardUrl);
  await page.goto(`${dashboardUrl}/research`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("TIP-024E-E2E-01 imports an approved dossier into a traceable authoring revision", async ({ page }) => {
  const { email, dashboardUrl } = await signUpToDashboard(page, "Research Bridge QA");
  await createMission(page, dashboardUrl);
  await page.goto(`${dashboardUrl}/authoring`);
  await page.getByLabel("Document title").fill("UAV evidence bridge proposal");
  await page.getByLabel("Document type").selectOption("RESEARCH_PROPOSAL");
  await page.getByRole("button", { name: "Open editorial workspace" }).click();
  await page.waitForURL(/\/authoring\/[0-9a-f-]{36}/);
  await seedApprovedResearch(email);

  await page.goto(`${dashboardUrl}/research`);
  await expect(page.getByText("Approved").first()).toBeVisible();
  await page.getByRole("button", { name: "Import approved dossier" }).click();
  await page.waitForURL(/\/authoring\/[0-9a-f-]{36}\?researchImport=created/);
  await expect(page.getByText("Revision 2 · DRAFT")).toBeVisible();
  await expect(page.getByText("Retained UAV field protocol")).toBeVisible();
  await page.getByText("Research and computation provenance").click();
  await expect(page.getByText("Imported research dossiers")).toBeVisible();
  await expect(page.getByText("1 approved findings")).toBeVisible();
});
