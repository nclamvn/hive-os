import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { normalizedExchangeControls } from "./normalized-exchange";

const sourcePin = "ccd7f19bf33337a45bc22f6cc5043b7249501f8325ba54cd7d1ee4a312bfac5b";
const hash = (v: string | Buffer) => createHash("sha256").update(v).digest("hex");
const primary = normalizedExchangeControls();
try {
  const path = resolve("scripts/operations/normalized-exchange-replay.py");
  if (hash(readFileSync(path)) !== sourcePin) throw new Error("Source drift");
  const result = spawnSync("python3", ["-I", "-S", "-B", path], {
    encoding: "utf8", timeout: 30000, maxBuffer: 256 * 1024,
    env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH ?? "/usr/bin:/bin", PYTHONDONTWRITEBYTECODE: "1" },
  });
  if (result.error || result.status !== 0) throw new Error("Replay unavailable");
  const status = isDeepStrictEqual(primary, JSON.parse(result.stdout)) ? "PASS" : "MISMATCH";
  console.log(JSON.stringify({ primary, replay: { status, sourcePin, primaryDigest: hash(JSON.stringify(primary)), outputDigest: hash(result.stdout.trim()) } }));
  if (status !== "PASS") process.exitCode = 1;
} catch {
  console.log(JSON.stringify({ primary, replay: { status: "UNAVAILABLE", sourcePin } }));
  process.exitCode = 1;
}
