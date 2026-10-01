import { z } from "zod";

/**
 * Environment schema for HIVE OS.
 *
 * Validation reports which variables are missing or malformed but never
 * echoes their values — connection strings and credentials must not leak
 * into logs, errors, or reports.
 */
const envSchema = z
  .object({
    RUNTIME_COMPONENT: z
      .enum(["web", "research-worker"])
      .default("web"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DEPLOYMENT_ENV: z
      .enum(["development", "test", "staging", "production"])
      .optional(),
    DATABASE_URL: z
      .string()
      .min(1, "required")
      .refine(
        (v) => v.startsWith("postgresql://") || v.startsWith("postgres://"),
        "must be a postgresql:// connection string",
      ),
    // Owner/migration connection (used by the Prisma CLI, not app runtime).
    DATABASE_MIGRATION_URL: z
      .string()
      .refine(
        (v) => v.startsWith("postgresql://") || v.startsWith("postgres://"),
        "must be a postgresql:// connection string",
      )
      .optional(),
    DB_POOL_MAX: z.coerce.number().int().min(1).max(50).default(10),
    DB_CONNECTION_TIMEOUT_MS: z.coerce
      .number()
      .int()
      .min(500)
      .max(60_000)
      .default(5_000),
    DB_IDLE_TIMEOUT_MS: z.coerce
      .number()
      .int()
      .min(1_000)
      .max(300_000)
      .default(30_000),
    DB_STATEMENT_TIMEOUT_MS: z.coerce
      .number()
      .int()
      .min(1_000)
      .max(300_000)
      .default(30_000),
    DB_SLOW_QUERY_MS: z.coerce.number().int().min(10).max(300_000).default(1_000),
    STORAGE_DRIVER: z.enum(["local", "s3"]).default("local"),
    STORAGE_LOCAL_ROOT: z.string().default(".storage"),
    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    S3_FORCE_PATH_STYLE: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    S3_SERVER_SIDE_ENCRYPTION: z.enum(["AES256", "aws:kms"]).optional(),
    S3_KMS_KEY_ID: z.string().min(1).optional(),
    DEMO_FIXTURES_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    MAINTENANCE_MODE: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    // --- Authentication (Better Auth) ---
    BETTER_AUTH_SECRET: z
      .string()
      .min(16, "must be at least 16 characters")
      .optional(),
    BETTER_AUTH_URL: z
      .string()
      .url("must be a valid URL")
      .default("http://localhost:3000"),
    // Self-sign-up defaults to disabled; production must opt in explicitly.
    AUTH_ALLOW_SELF_SIGNUP: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    // Auth request rate limiting; may be disabled ONLY under NODE_ENV=test.
    AUTH_RATE_LIMIT_ENABLED: z
      .enum(["true", "false"])
      .default("true")
      .transform((v) => v === "true"),
    // Tunable limits (requests per window seconds). Production-safe defaults.
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
    AUTH_RATE_LIMIT_WINDOW: z.coerce.number().int().positive().default(60),
    // Keyed digest secret for the destination throttle and IP/user-agent
    // digests. It never stores plaintext email; required outside tests (below).
    AUTH_THROTTLE_SECRET: z.string().min(16).optional(),
    // --- Identity-recovery mail boundary ---
    // `local` captures messages in a non-production sink; `smtp` delivers via a
    // real provider. Production must use `smtp` (enforced below).
    MAIL_DRIVER: z.enum(["local", "smtp"]).default("local"),
    MAIL_FROM: z.string().optional(),
    MAIL_REPLY_TO: z.string().optional(),
    // Absolute base used to build recovery links. Must be HTTPS in production
    // and share the Better Auth origin.
    MAIL_BASE_URL: z.string().url().default("http://localhost:3000"),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().optional(),
    SMTP_SECURE: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    SMTP_USERNAME: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    // --- TIP-024C governed research / isolated computation worker ---
    RESEARCH_WORKER_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    // Operator-controlled local pilot dispatch gate. This is NOT a billing
    // limit or proof that a worker is healthy; it defaults closed everywhere.
    MATH_PILOT_QUEUE_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    RESEARCH_OPENAI_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    RESEARCH_CODEX_LOCAL_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    // An optional second requested CLI model for the adversarial review role.
    // This records model separation, not provider attestation or independence.
    MATH_REVIEW_ADVERSARY_MODEL: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,159}$/).optional(),
    // Optional, digest-pinned Python image for isolated exact-answer replay.
    MATH_EXACT_REPLAY_IMAGE: z.string().regex(/^.+@sha256:[a-f0-9]{64}$/).optional(),
    // Local formal pilot only. A compiler result never promotes a theorem.
    MATH_FORMAL_LEAN_IMAGE: z.string().regex(/^.+@sha256:[a-f0-9]{64}$/).optional(),
    // Immutable local image ID built from the pinned Lean 4.10 checker source.
    MATH_FORMAL_REPLAY_IMAGE: z.string().regex(/^sha256:[a-f0-9]{64}$/).optional(),
    SANDBOX_DOCKER_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    OPENAI_API_KEY: z.string().min(1).optional(),
    OPENAI_PROJECT: z.string().min(1).optional(),
    RESEARCH_WORKER_ORGANIZATION_ID: z.string().uuid().optional(),
    RESEARCH_WORKER_ACTOR_USER_ID: z.string().min(1).max(200).optional(),
    RESEARCH_WORKER_ID: z.string().min(1).max(120).default("research-sandbox-worker"),
    RESEARCH_WORKER_POLL_MS: z.coerce.number().int().min(250).max(60_000).default(2_000),
    RESEARCH_WORKER_CLAIM_FIRST: z.coerce.number().int().min(1).max(20).default(4),
    SANDBOX_RUNTIME_REGISTRY_JSON: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    // `next build` evaluates modules under NODE_ENV=production but is not a
    // running deployment. Recovery/mail/throttle requirements are enforced at
    // real runtime startup (and by tests), not while collecting build output.
    const buildPhase = process.env.NEXT_PHASE === "phase-production-build";
    const researchWorker = env.RUNTIME_COMPONENT === "research-worker";
    const deploymentEnv =
      env.DEPLOYMENT_ENV ??
      (env.NODE_ENV === "test"
        ? "test"
        : env.NODE_ENV === "development"
          ? "development"
          : undefined);
    if (!buildPhase && !researchWorker && !env.BETTER_AUTH_SECRET) {
      ctx.addIssue({
        code: "custom",
        path: ["BETTER_AUTH_SECRET"],
        message: "required at runtime (min 16 chars)",
      });
    }
    if (!buildPhase && env.NODE_ENV === "production" && !deploymentEnv) {
      ctx.addIssue({
        code: "custom",
        path: ["DEPLOYMENT_ENV"],
        message: "required when NODE_ENV=production",
      });
    }
    if (
      deploymentEnv &&
      ["staging", "production"].includes(deploymentEnv) &&
      env.NODE_ENV !== "production"
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["DEPLOYMENT_ENV"],
        message: "staging and production require NODE_ENV=production",
      });
    }
    if (
      !buildPhase &&
      env.NODE_ENV === "production" &&
      deploymentEnv &&
      !["staging", "production"].includes(deploymentEnv)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["DEPLOYMENT_ENV"],
        message: "NODE_ENV=production requires staging or production",
      });
    }
    if (env.STORAGE_DRIVER === "s3") {
      const required = [
        "S3_REGION",
        "S3_BUCKET",
        "S3_ACCESS_KEY_ID",
        "S3_SECRET_ACCESS_KEY",
      ] as const;
      for (const key of required) {
        if (!env[key]) {
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: "required when STORAGE_DRIVER=s3",
          });
        }
      }
      if (!env.S3_SERVER_SIDE_ENCRYPTION) {
        ctx.addIssue({
          code: "custom",
          path: ["S3_SERVER_SIDE_ENCRYPTION"],
          message: "required when STORAGE_DRIVER=s3",
        });
      }
      if (
        env.S3_SERVER_SIDE_ENCRYPTION === "aws:kms" &&
        !env.S3_KMS_KEY_ID
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["S3_KMS_KEY_ID"],
          message: "required when S3_SERVER_SIDE_ENCRYPTION=aws:kms",
        });
      }
    }
    if (
      !buildPhase &&
      deploymentEnv &&
      ["staging", "production"].includes(deploymentEnv) &&
      env.STORAGE_DRIVER !== "s3" &&
      (!researchWorker || env.SANDBOX_DOCKER_ENABLED)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["STORAGE_DRIVER"],
        message: "staging and production require STORAGE_DRIVER=s3",
      });
    }
    if (env.DEMO_FIXTURES_ENABLED && env.NODE_ENV === "production") {
      ctx.addIssue({
        code: "custom",
        path: ["DEMO_FIXTURES_ENABLED"],
        message: "demo fixtures must never be enabled in production",
      });
    }
    if (env.MATH_PILOT_QUEUE_ENABLED && !["development", "test"].includes(deploymentEnv ?? "")) {
      ctx.addIssue({ code: "custom", path: ["MATH_PILOT_QUEUE_ENABLED"], message: "math pilot queueing is local-only" });
    }
    if (env.RESEARCH_CODEX_LOCAL_ENABLED && !["development", "test"].includes(deploymentEnv ?? "")) {
      ctx.addIssue({ code: "custom", path: ["RESEARCH_CODEX_LOCAL_ENABLED"], message: "Codex subscription bridge is local-only" });
    }
    if (env.MATH_FORMAL_REPLAY_IMAGE && !["development", "test"].includes(deploymentEnv ?? "")) {
      ctx.addIssue({ code: "custom", path: ["MATH_FORMAL_REPLAY_IMAGE"], message: "Formal replay image is local-only" });
    }
    // Rate limiting may only be disabled for deterministic automated tests.
    if (
      !researchWorker &&
      !env.AUTH_RATE_LIMIT_ENABLED &&
      env.NODE_ENV !== "test"
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["AUTH_RATE_LIMIT_ENABLED"],
        message:
          "auth rate limiting can only be disabled when NODE_ENV=test",
      });
    }
    // The keyed throttle/digest secret is mandatory outside automated tests so
    // identity-recovery abuse controls cannot silently run without a key.
    if (
      !researchWorker &&
      !env.AUTH_THROTTLE_SECRET &&
      env.NODE_ENV !== "test" &&
      !buildPhase
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["AUTH_THROTTLE_SECRET"],
        message: "required (min 16 chars) unless NODE_ENV=test",
      });
    }
    // Identity recovery is fail-closed in production: the local mail sink must
    // never deliver production recovery links.
    if (
      !researchWorker &&
      !buildPhase &&
      env.NODE_ENV === "production" &&
      env.MAIL_DRIVER === "local"
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["MAIL_DRIVER"],
        message: "production requires MAIL_DRIVER=smtp (local sink is forbidden)",
      });
    }
    // A real SMTP driver needs a host and a From address to be usable.
    if (!researchWorker && env.MAIL_DRIVER === "smtp") {
      if (!env.SMTP_HOST) {
        ctx.addIssue({
          code: "custom",
          path: ["SMTP_HOST"],
          message: "required when MAIL_DRIVER=smtp",
        });
      }
      if (!env.MAIL_FROM) {
        ctx.addIssue({
          code: "custom",
          path: ["MAIL_FROM"],
          message: "required when MAIL_DRIVER=smtp",
        });
      }
    }
    // Recovery links must be HTTPS and same-origin as the auth base in
    // production so callbacks cannot be redirected off-site.
    if (!researchWorker && !buildPhase && env.NODE_ENV === "production") {
      if (!env.MAIL_BASE_URL.startsWith("https://")) {
        ctx.addIssue({
          code: "custom",
          path: ["MAIL_BASE_URL"],
          message: "must be an https:// URL in production",
        });
      } else {
        try {
          if (
            new URL(env.MAIL_BASE_URL).origin !==
            new URL(env.BETTER_AUTH_URL).origin
          ) {
            ctx.addIssue({
              code: "custom",
              path: ["MAIL_BASE_URL"],
              message: "must share the BETTER_AUTH_URL origin",
            });
          }
        } catch {
          // BETTER_AUTH_URL validity is enforced by its own schema rule.
        }
      }
    }
    if (!buildPhase && env.RESEARCH_WORKER_ENABLED) {
      if (!env.RESEARCH_OPENAI_ENABLED && !env.RESEARCH_CODEX_LOCAL_ENABLED && !env.SANDBOX_DOCKER_ENABLED) {
        ctx.addIssue({ code: "custom", path: ["RESEARCH_WORKER_ENABLED"], message: "requires at least one enabled adapter" });
      }
      if (!env.RESEARCH_WORKER_ORGANIZATION_ID) {
        ctx.addIssue({ code: "custom", path: ["RESEARCH_WORKER_ORGANIZATION_ID"], message: "required when the research worker is enabled" });
      }
      if (!env.RESEARCH_WORKER_ACTOR_USER_ID) {
        ctx.addIssue({ code: "custom", path: ["RESEARCH_WORKER_ACTOR_USER_ID"], message: "required when the research worker is enabled" });
      }
    }
    if (!buildPhase && env.RESEARCH_OPENAI_ENABLED && !env.OPENAI_API_KEY) {
      ctx.addIssue({ code: "custom", path: ["OPENAI_API_KEY"], message: "required when the OpenAI research adapter is enabled" });
    }
    if (!buildPhase && env.SANDBOX_DOCKER_ENABLED && !env.SANDBOX_RUNTIME_REGISTRY_JSON) {
      ctx.addIssue({ code: "custom", path: ["SANDBOX_RUNTIME_REGISTRY_JSON"], message: "required when the Docker sandbox adapter is enabled" });
    }
  });

export type Env = z.infer<typeof envSchema>;

/**
 * Validate a raw environment map. Throws with variable names and issue
 * descriptions only — never with values.
 */
export function parseEnv(raw: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const lines = result.error.issues.map(
      (issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`,
    );
    throw new Error(
      `Invalid environment configuration:\n${lines.join("\n")}`,
    );
  }
  return result.data;
}

let cached: Env | undefined;

/** Validated process environment (cached after first successful parse). */
export function getEnv(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}

/** Test-only helper to clear the cache between scenarios. */
export function resetEnvCache(): void {
  cached = undefined;
}
