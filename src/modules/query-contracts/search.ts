import { createHash } from "node:crypto";

import { Prisma } from "@prisma/client";

import {
  authorize,
  organizationIdForWorkspace,
} from "@/modules/authorization";
import type {
  Capability,
  WorkspaceContext,
} from "@/modules/identity-workspace";
import { getDb } from "@/server/db";

import {
  decodeCursor,
  encodeCursor,
  normalizePageSize,
  QueryContractError,
  type Connection,
} from "./primitives";

export type SearchObjectKind =
  | "mission"
  | "evidence"
  | "claim"
  | "skill"
  | "execution"
  | "verification"
  | "release";

export interface GovernedSearchResult {
  id: string;
  kind: SearchObjectKind;
  missionId: string | null;
  code: string;
  title: string;
  description: string;
  status: string;
  href: string;
  rank: number;
  occurredAt: Date;
}

export interface GovernedSearchPort {
  search(
    ctx: WorkspaceContext,
    input: { query: string; first?: number; after?: string },
  ): Promise<Connection<GovernedSearchResult>>;
}

type SearchCandidate = Omit<GovernedSearchResult, "href">;

const SEARCH_MAX_PAGE_SIZE = 20;
const SEARCH_CANDIDATE_MULTIPLIER = 3;

function normalizeSearchQuery(value: string) {
  const query = value.trim().replace(/\s+/g, " ");
  if (
    query.length < 1 ||
    query.length > 200 ||
    query.split(" ").length > 20
  ) {
    throw new QueryContractError(
      "Search query must contain 1–200 characters and at most 20 terms",
      "INVALID_QUERY",
    );
  }
  return query;
}

function searchCursorKind(query: string) {
  return `governed-search:${createHash("sha256")
    .update(query)
    .digest("hex")
    .slice(0, 16)}`;
}

function capabilityFor(kind: SearchObjectKind): Capability {
  switch (kind) {
    case "mission":
      return "missions.read";
    case "evidence":
    case "claim":
      return "truth.read";
    case "skill":
      return "skills.read";
    case "execution":
      return "execution.read";
    case "verification":
    case "release":
      return "verification.read";
  }
}

function hrefFor(candidate: SearchCandidate) {
  switch (candidate.kind) {
    case "mission":
      return `missions/${candidate.id}`;
    case "evidence":
      return "evidence";
    case "claim":
      return "claims";
    case "skill":
      return "skills";
    case "execution":
      return "execution";
    case "verification":
    case "release":
      return "reports";
  }
}

export const postgresGovernedSearch: GovernedSearchPort = {
  async search(ctx, input) {
    const query = normalizeSearchQuery(input.query);
    const first = normalizePageSize(input.first, SEARCH_MAX_PAGE_SIZE);
    const kind = searchCursorKind(query);
    const cursor = input.after ? decodeCursor(kind, input.after) : undefined;
    const rank = cursor ? Number(cursor.s[0]) : undefined;
    const occurredAt = cursor ? new Date(cursor.s[1] ?? "") : undefined;
    if (
      cursor &&
      (cursor.s.length !== 2 ||
        !Number.isFinite(rank) ||
        !occurredAt ||
        Number.isNaN(occurredAt.getTime()))
    ) {
      throw new QueryContractError("Search cursor is invalid", "INVALID_CURSOR");
    }
    const seek = cursor
      ? Prisma.sql`
          WHERE (
            rank < ${rank!}
            OR (rank = ${rank!} AND occurred_at < ${occurredAt!})
            OR (
              rank = ${rank!}
              AND occurred_at = ${occurredAt!}
              AND id > ${cursor.i}
            )
          )`
      : Prisma.empty;
    const candidateLimit = first * SEARCH_CANDIDATE_MULTIPLIER + 1;
    const candidates = await getDb().$queryRaw<SearchCandidate[]>(Prisma.sql`
      WITH search_query AS (
        SELECT websearch_to_tsquery('simple', ${query}) AS value
      ),
      candidates AS (
        SELECT
          m.id,
          'mission'::text AS kind,
          m.id AS mission_id,
          m.reference_code AS code,
          m.title,
          'Mission'::text AS description,
          m.status::text AS status,
          ts_rank_cd(
            to_tsvector('simple', m.reference_code || ' ' || m.title),
            search_query.value
          )::float8 AS rank,
          m.updated_at AS occurred_at
        FROM mission m, search_query
        WHERE m.workspace_id = ${ctx.workspace.id}
          AND to_tsvector(
            'simple', m.reference_code || ' ' || m.title
          ) @@ search_query.value

        UNION ALL

        SELECT
          e.id, 'evidence', e.mission_id, e.source_type, e.title,
          COALESCE(e.publisher, e.canonical_uri), e.access_level::text,
          ts_rank_cd(
            to_tsvector(
              'simple',
              e.title || ' ' || e.canonical_uri || ' ' ||
              COALESCE(e.publisher, '')
            ),
            search_query.value
          )::float8,
          e.created_at
        FROM evidence_source e, search_query
        WHERE e.workspace_id = ${ctx.workspace.id}
          AND to_tsvector(
            'simple',
            e.title || ' ' || e.canonical_uri || ' ' ||
            COALESCE(e.publisher, '')
          ) @@ search_query.value

        UNION ALL

        SELECT
          c.id, 'claim', c.mission_id, c.claim_key,
          latest.statement, 'Claim'::text, c.state::text,
          ts_rank_cd(
            to_tsvector(
              'simple', c.claim_key || ' ' || latest.statement
            ),
            search_query.value
          )::float8,
          c.updated_at
        FROM claim c
        JOIN LATERAL (
          SELECT cv.statement
          FROM claim_version cv
          WHERE cv.claim_id = c.id
          ORDER BY cv.version_number DESC
          LIMIT 1
        ) latest ON true
        CROSS JOIN search_query
        WHERE c.workspace_id = ${ctx.workspace.id}
          AND (
            to_tsvector('simple', c.claim_key) @@ search_query.value
            OR to_tsvector('simple', latest.statement) @@ search_query.value
          )

        UNION ALL

        SELECT
          s.id, 'skill', NULL::text, s.skill_key, s.display_name,
          s.description, s.status::text,
          ts_rank_cd(
            to_tsvector(
              'simple',
              s.skill_key || ' ' || s.display_name || ' ' || s.description
            ),
            search_query.value
          )::float8,
          s.updated_at
        FROM skill s, search_query
        WHERE s.workspace_id = ${ctx.workspace.id}
          AND to_tsvector(
            'simple',
            s.skill_key || ' ' || s.display_name || ' ' || s.description
          ) @@ search_query.value

        UNION ALL

        SELECT
          t.id, 'execution', t.mission_id, t.code, t.title,
          t.description, t.status::text,
          ts_rank_cd(
            to_tsvector(
              'simple', t.code || ' ' || t.title || ' ' || t.description
            ),
            search_query.value
          )::float8,
          t.updated_at
        FROM execution_tip t, search_query
        WHERE t.workspace_id = ${ctx.workspace.id}
          AND to_tsvector(
            'simple', t.code || ' ' || t.title || ' ' || t.description
          ) @@ search_query.value

        UNION ALL

        SELECT
          vr.id, 'verification', vr.mission_id, m.reference_code, m.title,
          'Verify Report ' || vr.overall_status::text,
          vr.overall_status::text,
          ts_rank_cd(
            to_tsvector(
              'simple',
              m.reference_code || ' ' || m.title || ' verify report ' ||
              vr.overall_status::text
            ),
            search_query.value
          )::float8,
          vr.created_at
        FROM verification_report vr
        JOIN mission m ON m.id = vr.mission_id
        CROSS JOIN search_query
        WHERE vr.workspace_id = ${ctx.workspace.id}
          AND to_tsvector(
            'simple',
            m.reference_code || ' ' || m.title || ' verify report ' ||
            vr.overall_status::text
          ) @@ search_query.value

        UNION ALL

        SELECT
          r.id, 'release', r.mission_id, m.reference_code, m.title,
          r.visibility::text || ' governed release',
          r.status::text,
          ts_rank_cd(
            to_tsvector(
              'simple',
              m.reference_code || ' ' || m.title || ' governed release ' ||
              r.visibility::text
            ),
            search_query.value
          )::float8,
          r.approved_at
        FROM governed_release r
        JOIN mission m ON m.id = r.mission_id
        CROSS JOIN search_query
        WHERE r.workspace_id = ${ctx.workspace.id}
          AND to_tsvector(
            'simple',
            m.reference_code || ' ' || m.title || ' governed release ' ||
            r.visibility::text
          ) @@ search_query.value
      )
      SELECT
        id, kind, mission_id AS "missionId", code, title, description,
        status, rank, occurred_at AS "occurredAt"
      FROM candidates
      ${seek}
      ORDER BY rank DESC, occurred_at DESC, id ASC
      LIMIT ${candidateLimit}
    `);

    const organizationId = await organizationIdForWorkspace(ctx.workspace.id);
    const authorized: GovernedSearchResult[] = [];
    for (const candidate of candidates) {
      const decision = await authorize(
        ctx.user.id,
        capabilityFor(candidate.kind),
        {
          organizationId,
          workspaceId: ctx.workspace.id,
          ...(candidate.missionId ? { missionId: candidate.missionId } : {}),
        },
      );
      if (decision.allowed) {
        authorized.push({ ...candidate, href: hrefFor(candidate) });
      }
      if (authorized.length > first) break;
    }
    // Never derive page metadata from forbidden candidates: even a bare
    // hasNextPage bit would disclose their existence. A heavily denied page
    // may therefore end early rather than leak that more ranked rows exist.
    const hasNextPage = authorized.length > first;
    const nodes = authorized.slice(0, first);
    return {
      nodes,
      pageInfo: {
        endCursor: nodes.length
          ? encodeCursor(
              kind,
              [
                String(nodes[nodes.length - 1]!.rank),
                nodes[nodes.length - 1]!.occurredAt,
              ],
              nodes[nodes.length - 1]!.id,
            )
          : null,
        hasNextPage,
      },
    };
  },
};

export const searchGovernedObjects = postgresGovernedSearch.search.bind(
  postgresGovernedSearch,
);
