import { randomBytes } from "node:crypto";

/** Normalize free text into a URL-safe slug base. */
export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "workspace";
}

/** Append a short random suffix for uniqueness. */
export function withRandomSuffix(base: string): string {
  return `${base}-${randomBytes(3).toString("hex")}`;
}

/** Normalize an email for comparison and storage of the normalized form. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
