/**
 * Provider-independent object-storage contract.
 *
 * Snapshots, artifacts, reports, and release bundles are stored through this
 * interface only. Application code must never import a concrete adapter
 * directly — it obtains one via `getObjectStorage()`.
 */
export interface StoredObjectMetadata {
  key: string;
  size: number;
  contentType: string | undefined;
  lastModified: Date | undefined;
}

export interface PutObjectOptions {
  contentType?: string;
}
export interface GetObjectOptions {
  /** Host intake bound. Omitted preserves legacy whole-object reads. */
  maxBytes?:number;
}
export function boundedObjectReadLimit(options?:GetObjectOptions) {
  const value=options?.maxBytes;
  if(value!==undefined && (!Number.isSafeInteger(value) || value<1 || value>64*1024*1024)) throw new Error("Invalid bounded object read limit");
  return value;
}

export interface ObjectStorage {
  /** Stable identifier of the backing adapter, e.g. "local" or "s3". */
  readonly driver: string;

  put(
    key: string,
    body: Uint8Array,
    options?: PutObjectOptions,
  ): Promise<StoredObjectMetadata>;

  /** Returns null when the object does not exist. */
  get(key: string,options?:GetObjectOptions): Promise<Uint8Array | null>;

  head(key: string): Promise<StoredObjectMetadata | null>;

  delete(key: string): Promise<void>;

  /** Keys beginning with the prefix, lexicographically sorted. */
  list(prefix: string): Promise<string[]>;
}

/** Object keys are workspace-scoped POSIX-like paths; reject traversal. */
export function assertValidObjectKey(key: string): void {
  if (
    key.length === 0 ||
    key.startsWith("/") ||
    key.includes("..") ||
    key.includes("\\") ||
    key.includes("\0")
  ) {
    throw new Error(`Invalid object key: ${JSON.stringify(key)}`);
  }
}
