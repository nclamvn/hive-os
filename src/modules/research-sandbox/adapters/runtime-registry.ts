import { z } from "zod";

import type { DockerRuntimeDefinition } from "./docker-sandbox";

const runtimeRegistrySchema = z
  .array(
    z
      .object({
        runtimeId: z.string().trim().min(1).max(160),
        runtimeVersion: z.string().trim().min(1).max(160),
        kind: z.enum(["LATEX_BUILD", "CAS", "JUPYTER"]),
        image: z.string().trim().regex(/@sha256:[a-f0-9]{64}$/),
      })
      .strict(),
  )
  .max(20);

export function parseDockerRuntimeRegistry(raw: string): DockerRuntimeDefinition[] {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("SANDBOX_RUNTIME_REGISTRY_JSON must contain valid JSON");
  }
  const parsed = runtimeRegistrySchema.safeParse(value);
  if (!parsed.success) throw new Error("SANDBOX_RUNTIME_REGISTRY_JSON must contain only digest-pinned governed runtimes");
  const identities = new Set<string>();
  for (const runtime of parsed.data) {
    const identity = `${runtime.kind}:${runtime.runtimeId}:${runtime.runtimeVersion}`;
    if (identities.has(identity)) throw new Error("SANDBOX_RUNTIME_REGISTRY_JSON contains a duplicate runtime identity");
    identities.add(identity);
  }
  return parsed.data;
}
