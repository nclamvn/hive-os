import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { describe, expect, it, vi } from "vitest";

import {
  S3ObjectStorage,
  type S3StorageConfig,
} from "@/server/storage/s3";

describe("S3-compatible storage contract", () => {
  it("PRC-07 preserves encryption intent and object semantics", async () => {
    let listPage = 0;
    const send = vi.fn(async (command: unknown) => {
      if (command instanceof PutObjectCommand) return {};
      if (command instanceof GetObjectCommand) {
        return {
          Body: {
            transformToByteArray: async () => new Uint8Array([1, 2, 3]),
          },
        };
      }
      if (command instanceof HeadObjectCommand) {
        return {
          ContentLength: 3,
          ContentType: "application/octet-stream",
          LastModified: new Date("2026-07-29T00:00:00.000Z"),
        };
      }
      if (command instanceof ListObjectsV2Command) {
        listPage += 1;
        return listPage === 1
          ? {
              Contents: [{ Key: "w/a" }],
              IsTruncated: true,
              NextContinuationToken: "next",
            }
          : { Contents: [{ Key: "w/b" }], IsTruncated: false };
      }
      if (command instanceof DeleteObjectCommand) return {};
      throw new Error("unexpected command");
    });
    const client = { send } as unknown as S3StorageConfig["client"];
    const storage = new S3ObjectStorage({
      region: "us-east-1",
      bucket: "hiveos",
      accessKeyId: "key",
      secretAccessKey: "secret",
      serverSideEncryption: "aws:kms",
      kmsKeyId: "alias/hiveos",
      client,
    });

    await expect(
      storage.put("w/a", new Uint8Array([1, 2, 3]), {
        contentType: "application/octet-stream",
      }),
    ).resolves.toMatchObject({ key: "w/a", size: 3 });
    const put = send.mock.calls[0][0];
    expect(put).toBeInstanceOf(PutObjectCommand);
    expect((put as PutObjectCommand).input).toMatchObject({
      Bucket: "hiveos",
      Key: "w/a",
      ServerSideEncryption: "aws:kms",
      SSEKMSKeyId: "alias/hiveos",
    });

    await expect(storage.get("w/a")).resolves.toEqual(
      new Uint8Array([1, 2, 3]),
    );
    await expect(storage.head("w/a")).resolves.toMatchObject({
      key: "w/a",
      size: 3,
    });
    await expect(storage.list("w/")).resolves.toEqual(["w/a", "w/b"]);
    await expect(storage.delete("w/a")).resolves.toBeUndefined();
  });
});
