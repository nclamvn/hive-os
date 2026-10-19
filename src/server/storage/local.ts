import { createHash } from "node:crypto";
import { mkdir, open, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

import {
  assertValidObjectKey,
  boundedObjectReadLimit,
  type GetObjectOptions,
  type ObjectStorage,
  type PutObjectOptions,
  type StoredObjectMetadata,
} from "./types";

/**
 * Development adapter backed by the local filesystem.
 *
 * Layout: `<root>/objects/<key>` for bodies, `<root>/meta/<sha256(key)>.json`
 * for content-type sidecars. Not for production use — production uses the
 * S3-compatible adapter.
 */
export class LocalObjectStorage implements ObjectStorage {
  readonly driver = "local";

  constructor(private readonly root: string) {}

  private objectPath(key: string): string {
    assertValidObjectKey(key);
    return path.join(this.root, "objects", key);
  }

  private metaPath(key: string): string {
    const digest = createHash("sha256").update(key).digest("hex");
    return path.join(this.root, "meta", `${digest}.json`);
  }

  async put(
    key: string,
    body: Uint8Array,
    options?: PutObjectOptions,
  ): Promise<StoredObjectMetadata> {
    const filePath = this.objectPath(key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, body);
    await mkdir(path.dirname(this.metaPath(key)), { recursive: true });
    await writeFile(
      this.metaPath(key),
      JSON.stringify({ key, contentType: options?.contentType ?? null }),
    );
    const info = await stat(filePath);
    return {
      key,
      size: info.size,
      contentType: options?.contentType,
      lastModified: info.mtime,
    };
  }

  async get(key: string,options?:GetObjectOptions): Promise<Uint8Array | null> {
    const maximum=boundedObjectReadLimit(options);
    try {
      if(maximum!==undefined) {
        const handle=await open(this.objectPath(key),constants.O_RDONLY|constants.O_NOFOLLOW);
        try {
          const info=await handle.stat();
          if(!info.isFile() || info.size>maximum) throw new Error("Object exceeds bounded read");
          const body=new Uint8Array(info.size);
          let offset=0;
          while(offset<body.byteLength) {
            const read=await handle.read(body,offset,body.byteLength-offset,offset);
            if(!read.bytesRead) throw new Error("Object changed during bounded read");
            offset+=read.bytesRead;
          }
          if((await handle.read(new Uint8Array(1),0,1,offset)).bytesRead || (await handle.stat()).size!==info.size) throw new Error("Object changed during bounded read");
          return body;
        } finally {await handle.close();}
      }
      return new Uint8Array(await readFile(this.objectPath(key)));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async head(key: string): Promise<StoredObjectMetadata | null> {
    try {
      const info = await stat(this.objectPath(key));
      let contentType: string | undefined;
      try {
        const meta = JSON.parse(await readFile(this.metaPath(key), "utf8")) as {
          contentType: string | null;
        };
        contentType = meta.contentType ?? undefined;
      } catch {
        contentType = undefined;
      }
      return { key, size: info.size, contentType, lastModified: info.mtime };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    await rm(this.objectPath(key), { force: true });
    await rm(this.metaPath(key), { force: true });
  }

  async list(prefix: string): Promise<string[]> {
    const base = path.join(this.root, "objects");
    let keys: string[];
    try {
      keys = await collectFiles(base, base);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    return keys.filter((key) => key.startsWith(prefix)).sort();
  }
}

async function collectFiles(base: string, dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(base, full)));
    } else if (entry.isFile()) {
      results.push(path.relative(base, full).split(path.sep).join("/"));
    }
  }
  return results;
}
