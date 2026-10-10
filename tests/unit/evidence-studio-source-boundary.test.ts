import {describe,it,expect} from "vitest";
import {readFileSync} from "node:fs";
import path from "node:path";
import {safeRead,hash,OLD_BUNDLE} from "../../scripts/test/build-tip081.mjs";
const root="/Users/os/hiveos";
describe("TIP081 original-source preservation and read-only module boundary",()=>{
  it("keeps all 78 old080 source pins plus review exact",()=>{const manifest=JSON.parse(safeRead(root,OLD_BUNDLE,65536).toString());expect(Object.keys(manifest.sourcePins)).toHaveLength(78);for(const [file,digest]of Object.entries(manifest.sourcePins))expect(hash(safeRead(root,file))).toBe(digest);expect(hash(safeRead(root,manifest.reviewReport))).toBe(manifest.reviewDigest);});
  it("reader imports only existing authorized read boundary",()=>{const text=readFileSync(path.join(root,"src/modules/research-evidence-studio/reader.ts"),"utf8");expect(text).toContain("getBridgeView(ctx,query.runId)");expect(text).toContain("exportBridge(ctx,query.runId)");expect(text).not.toMatch(/\b(createDraft|startBridge|importBridgeRole|checkBridgeFinal|reserveBridgeRole|revokeBridge)\b|node:child_process|node:fs/);});
  it("route has no mutation actions or arbitrary raw artifact readers",()=>{const text=readFileSync(path.join(root,"src/app/w/[workspaceSlug]/research/evidence-studio/page.tsx"),"utf8");expect(text).not.toMatch(/use server|\/actions\/|node:fs|node:child_process|artifacts\//);expect(text).toContain("loadStudio");});
});
