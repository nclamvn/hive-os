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
    DEMO_FIXTURES_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    // --- Authentication (Better Auth) ---
    BETTER_AUTH_SECRET: z
      .string()
      .min(16, "must be at least 16 characters"),
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
  })
  .superRefine((env, ctx) => {
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
