-- CreateTable
CREATE TABLE "schema_bootstrap" (
    "id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schema_bootstrap_pkey" PRIMARY KEY ("id")
);
