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
  })
  .superRefine((env, ctx) => {
    // `next build` evaluates modules under NODE_ENV=production but is not a
    // running deployment. Recovery/mail/throttle requirements are enforced at
    // real runtime startup (and by tests), not while collecting build output.
    const buildPhase = process.env.NEXT_PHASE === "phase-production-build";
    const deploymentEnv =
      env.DEPLOYMENT_ENV ??
      (env.NODE_ENV === "test"
        ? "test"
        : env.NODE_ENV === "development"
          ? "development"
          : undefined);
    if (!buildPhase && !env.BETTER_AUTH_SECRET) {
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
      env.STORAGE_DRIVER !== "s3"
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
    // Rate limiting may only be disabled for deterministic automated tests.
    if (!env.AUTH_RATE_LIMIT_ENABLED && env.NODE_ENV !== "test") {
      ctx.addIssue({
        code: "custom",
        path: ["AUTH_RATE_LIMIT_ENABLED"],
        message:
          "auth rate limiting can only be disabled when NODE_ENV=test",
      });
    }
    // The keyed throttle/digest secret is mandatory outside automated tests so
    // identity-recovery abuse controls cannot silently run without a key.
    if (!env.AUTH_THROTTLE_SECRET && env.NODE_ENV !== "test" && !buildPhase) {
      ctx.addIssue({
        code: "custom",
        path: ["AUTH_THROTTLE_SECRET"],
        message: "required (min 16 chars) unless NODE_ENV=test",
      });
    }
    // Identity recovery is fail-closed in production: the local mail sink must
    // never deliver production recovery links.
    if (!buildPhase && env.NODE_ENV === "production" && env.MAIL_DRIVER === "local") {
      ctx.addIssue({
        code: "custom",
        path: ["MAIL_DRIVER"],
        message: "production requires MAIL_DRIVER=smtp (local sink is forbidden)",
      });
    }
    // A real SMTP driver needs a host and a From address to be usable.
    if (env.MAIL_DRIVER === "smtp") {
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
    if (!buildPhase && env.NODE_ENV === "production") {
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
