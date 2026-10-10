import { mkdtemp,symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable } from "node:stream";
import { describe,expect,it,vi } from "vitest";
import { LocalObjectStorage } from "@/server/storage/local";
import { S3ObjectStorage } from "@/server/storage/s3";

describe("TIP076B bounded object intake; no actual S3 calls",()=>{
  it("local exact bounded read returns original bytes",async()=>{
    const s=new LocalObjectStorage(await mkdtemp(path.join(tmpdir(),"hiveos-076b-storage-")));
    await s.put("w/body",new TextEncoder().encode("hello"));expect(new TextDecoder().decode(await s.get("w/body",{maxBytes:5})??new Uint8Array())).toBe("hello");
  });
  it("local oversized descriptor refuses before body allocation",async()=>{
    const s=new LocalObjectStorage(await mkdtemp(path.join(tmpdir(),"hiveos-076b-storage-")));
    await s.put("w/body",new Uint8Array(4096));await expect(s.get("w/body",{maxBytes:8})).rejects.toThrow("bounded read");
    expect((await s.get("w/body"))?.byteLength).toBe(4096);
  });
  it("raced growth after head is caught by actual bounded descriptor",async()=>{
    const s=new LocalObjectStorage(await mkdtemp(path.join(tmpdir(),"hiveos-076b-storage-")));
    await s.put("w/body",new Uint8Array(8));expect((await s.head("w/body"))?.size).toBe(8);
    await s.put("w/body",new Uint8Array(4096));await expect(s.get("w/body",{maxBytes:8})).rejects.toThrow("bounded read");
  });
  it("bounded local read does not follow leaf symlink",async()=>{
    const root=await mkdtemp(path.join(tmpdir(),"hiveos-076b-storage-")),s=new LocalObjectStorage(root);
    await s.put("w/body",new Uint8Array(1));await symlink(path.join(root,"objects/w/body"),path.join(root,"objects/w/link"));
    await expect(s.get("w/link",{maxBytes:8})).rejects.toBeDefined();
  });
  function cloud(body:Readable,length?:number) {
    const send=vi.fn().mockResolvedValue({Body:body,ContentLength:length});
    return {send,s:new S3ObjectStorage({region:"test",bucket:"test",accessKeyId:"synthetic",secretAccessKey:"synthetic",serverSideEncryption:"AES256",client:{send} as never})};
  }
  it("bounded synthetic S3 stream returns exact complete bytes",async()=>{
    const {s}=cloud(Readable.from([Buffer.from("ab"),Buffer.from("cd")]),4);
    expect(new TextDecoder().decode(await s.get("w/body",{maxBytes:4})??new Uint8Array())).toBe("abcd");
  });
  it("unattested synthetic S3 length cannot evade stream ceiling",async()=>{
    const {s}=cloud(Readable.from([Buffer.from("abcd"),Buffer.from("efgh")]));await expect(s.get("w/body",{maxBytes:4})).rejects.toThrow("bounded read");
  });
  it("false synthetic S3 declared length refuses",async()=>{
    const {s}=cloud(Readable.from([Buffer.from("ab")]),4);await expect(s.get("w/body",{maxBytes:4})).rejects.toThrow("length mismatch");
  });
  it("invalid maxBytes refused before synthetic transport call",async()=>{
    const {s,send}=cloud(Readable.from([]));await expect(s.get("w/body",{maxBytes:-1})).rejects.toThrow("limit");expect(send).not.toHaveBeenCalled();
  });
});
