import { getEnv } from "../env";
import { LocalObjectStorage } from "./local";
import { S3ObjectStorage } from "./s3";
import type { ObjectStorage } from "./types";

export type { ObjectStorage, StoredObjectMetadata } from "./types";

let instance: ObjectStorage | undefined;

/** Resolve the configured object-storage adapter (validated by the env schema). */
export function getObjectStorage(): ObjectStorage {
  if (instance) return instance;
  const env = getEnv();
  if (env.STORAGE_DRIVER === "s3") {
    instance = new S3ObjectStorage({
      region: env.S3_REGION!,
      bucket: env.S3_BUCKET!,
      accessKeyId: env.S3_ACCESS_KEY_ID!,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
      endpoint: env.S3_ENDPOINT,
      forcePathStyle: env.S3_FORCE_PATH_STYLE,
    });
  } else {
    instance = new LocalObjectStorage(env.STORAGE_LOCAL_ROOT);
  }
  return instance;
}

/** Test-only helper to clear the cached adapter. */
export function resetObjectStorageCache(): void {
  instance = undefined;
}
