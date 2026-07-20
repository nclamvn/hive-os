import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations run as the OWNER role (DATABASE_MIGRATION_URL); the application
// runtime connects as the least-privileged role (DATABASE_URL). Fall back to
// DATABASE_URL when no dedicated migration URL is provided.
const migrationUrl =
  process.env.DATABASE_MIGRATION_URL ?? process.env.DATABASE_URL ?? "";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
