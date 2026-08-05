import { z } from "zod";

export const AUTHORING_DOCUMENT_TYPES = [
  "RESEARCH_PROPOSAL",
  "TECHNICAL_PROPOSAL",
  "CLIENT_PROPOSAL",
  "COURSE_DOSSIER",
  "RESEARCH_PAPER",
  "OTHER",
] as const;

export const SECTION_KINDS = [
  "NARRATIVE",
  "METHODOLOGY",
  "EVIDENCE",
  "RISK",
  "BUDGET",
  "LATEX",
  "APPENDIX",
] as const;

export const COMPUTATIONAL_ARTIFACT_TYPES = [
  "LATEX_SOURCE",
  "JUPYTER_NOTEBOOK",
  "CAS_RESULT",
  "DATASET",
  "CODE",
] as const;

const sectionKey = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[a-z][a-z0-9-]*$/);

export const authoringSectionSchema = z
  .object({
    key: sectionKey,
    heading: z.string().trim().min(1).max(240),
    kind: z.enum(SECTION_KINDS),
    body: z.string().max(100_000),
  })
  .strict();

export const authoringCitationSchema = z
  .object({
    key: z
      .string()
      .trim()
      .min(1)
      .max(64)
      .regex(/^[A-Za-z0-9][A-Za-z0-9_.:-]*$/),
    title: z.string().trim().min(1).max(500),
    authors: z.string().trim().max(500).default(""),
    year: z.string().trim().max(32).default(""),
    publisher: z.string().trim().max(240).default(""),
    canonicalUri: z.string().trim().url().max(2_000),
    locator: z.string().trim().max(240).default(""),
    evidenceSourceId: z.string().trim().max(128).nullable().default(null),
  })
  .strict();

export const computationalArtifactSchema = z
  .object({
    type: z.enum(COMPUTATIONAL_ARTIFACT_TYPES),
    label: z.string().trim().min(1).max(240),
    storageReference: z.string().trim().min(1).max(2_000),
    contentHash: z.string().regex(/^[a-f0-9]{64}$/),
    mediaType: z.string().trim().min(1).max(160),
    verifierNote: z.string().trim().max(2_000).default(""),
  })
  .strict();

export const qualityIssueSchema = z
  .object({
    code: z.string().min(1).max(80),
    severity: z.enum(["BLOCKER", "WARNING", "NOTE"]),
    sectionKey: z.string().max(64).nullable(),
    excerpt: z.string().max(280),
  })
  .strict();

export const qualityReportSchema = z
  .object({
    schema: z.literal("hive-os.authoring-quality.v1"),
    status: z.enum(["PASS", "REVIEW", "FAIL"]),
    score: z.number().int().min(0).max(100),
    blockerCount: z.number().int().nonnegative(),
    warningCount: z.number().int().nonnegative(),
    noteCount: z.number().int().nonnegative(),
    citedMarkerCount: z.number().int().nonnegative(),
    definedCitationCount: z.number().int().nonnegative(),
    issues: z.array(qualityIssueSchema).max(500),
  })
  .strict();

export const authoringContentSchema = z
  .object({
    title: z.string().trim().min(1).max(300),
    abstract: z.string().max(5_000),
    sections: z.array(authoringSectionSchema).min(1).max(64),
    citations: z.array(authoringCitationSchema).max(512),
    computationalArtifacts: z.array(computationalArtifactSchema).max(64),
  })
  .strict()
  .superRefine((value, ctx) => {
    const sectionKeys = value.sections.map((section) => section.key);
    if (new Set(sectionKeys).size !== sectionKeys.length) {
      ctx.addIssue({
        code: "custom",
        path: ["sections"],
        message: "Section keys must be unique",
      });
    }
    const citationKeys = value.citations.map((citation) =>
      citation.key.toLowerCase(),
    );
    if (new Set(citationKeys).size !== citationKeys.length) {
      ctx.addIssue({
        code: "custom",
        path: ["citations"],
        message: "Citation keys must be unique",
      });
    }
  });

export const createAuthoringDocumentSchema = z
  .object({
    missionId: z.string().trim().min(1).max(128),
    title: z.string().trim().min(1).max(300),
    documentType: z.enum(AUTHORING_DOCUMENT_TYPES),
    locale: z.enum(["vi", "en"]).default("vi"),
  })
  .strict();

export const saveAuthoringRevisionSchema = authoringContentSchema.extend({
  documentId: z.string().trim().min(1).max(128),
  expectedRevisionNumber: z.number().int().positive(),
  changeSummary: z.string().trim().min(1).max(1_000),
});

export type AuthoringSection = z.infer<typeof authoringSectionSchema>;
export type AuthoringCitation = z.infer<typeof authoringCitationSchema>;
export type ComputationalArtifact = z.infer<
  typeof computationalArtifactSchema
>;
export type AuthoringContent = z.infer<typeof authoringContentSchema>;
export type AuthoringQualityReport = z.infer<typeof qualityReportSchema>;
export type AuthoringDocumentType = (typeof AUTHORING_DOCUMENT_TYPES)[number];
