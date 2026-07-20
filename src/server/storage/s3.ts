import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";

import {
  assertValidObjectKey,
  type ObjectStorage,
  type PutObjectOptions,
  type StoredObjectMetadata,
} from "./types";

export interface S3StorageConfig {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  /** Custom endpoint for S3-compatible providers (MinIO, R2, ...). */
  endpoint?: string;
  forcePathStyle?: boolean;
}

/**
 * Production adapter for any S3-compatible object store. Fulfils the same
 * `ObjectStorage` contract as the local development adapter so application
 * code is provider-independent.
 */
export class S3ObjectStorage implements ObjectStorage {
  readonly driver = "s3";
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: S3StorageConfig) {
    const clientConfig: S3ClientConfig = {
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: config.forcePathStyle ?? false,
    };
    if (config.endpoint) clientConfig.endpoint = config.endpoint;
    this.client = new S3Client(clientConfig);
    this.bucket = config.bucket;
  }

  async put(
    key: string,
    body: Uint8Array,
    options?: PutObjectOptions,
  ): Promise<StoredObjectMetadata> {
    assertValidObjectKey(key);
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: options?.contentType,
      }),
    );
    return {
      key,
      size: body.byteLength,
      contentType: options?.contentType,
      lastModified: undefined,
    };
  }

  async get(key: string): Promise<Uint8Array | null> {
    assertValidObjectKey(key);
    try {
      const result = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      if (!result.Body) return null;
      return await result.Body.transformToByteArray();
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async head(key: string): Promise<StoredObjectMetadata | null> {
    assertValidObjectKey(key);
    try {
      const result = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return {
        key,
        size: result.ContentLength ?? 0,
        contentType: result.ContentType,
        lastModified: result.LastModified,
      };
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    assertValidObjectKey(key);
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  async list(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    let continuationToken: string | undefined;
    do {
      const result = await this.client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );
      for (const item of result.Contents ?? []) {
        if (item.Key) keys.push(item.Key);
      }
      continuationToken = result.IsTruncated
        ? result.NextContinuationToken
        : undefined;
    } while (continuationToken);
    return keys.sort();
  }
}

function isNotFound(error: unknown): boolean {
  const name = (error as { name?: string }).name;
  return name === "NoSuchKey" || name === "NotFound";
}
