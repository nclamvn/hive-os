import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import path from "node:path";
import {describe,expect,it} from "vitest";

const root="public/fonts/hive";
const source=readFileSync("src/app/fonts.css","utf8");
const manifest=JSON.parse(readFileSync(path.join(root,"PROVENANCE.json"),"utf8")) as {
  assets:{family:string;file:string;subset:string;weights:string[];bytes:number;sha256:string;unicodeRange:string}[];
};

describe("retained offline interface fonts",()=>{
  it("vendors exactly the original 22 WOFF2 bytes with stable provenance",()=>{
    expect(manifest.assets).toHaveLength(22);
    expect(manifest.assets.reduce((n,a)=>n+a.bytes,0)).toBe(317468);
    expect(new Set(manifest.assets.map(a=>a.file)).size).toBe(22);
    for(const asset of manifest.assets){
      expect(asset.file).toMatch(/^(?:inter|ibm-plex-mono)-[a-z0-9-]+\.woff2$/);
      const bytes=readFileSync(path.join(root,asset.file));
      expect(bytes.toString("ascii",0,4)).toBe("wOF2");expect(bytes.length).toBe(asset.bytes);
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(asset.sha256);
      expect(source).toContain(`/fonts/hive/${asset.file}`);
    }
    expect(manifest.assets.find(a=>a.file==="inter-vietnamese.woff2")?.sha256).toBe("8db00ff46c67b22cda8bed865acf7077651cac8d2841d5b40980556b48961931");
    expect(manifest.assets.find(a=>a.file==="inter-latin.woff2")?.sha256).toBe("c940764593d0fe5d596be327ca7558855e018039fb78509aa21921fd3644c3e4");
  });
  it("preserves original subset/weight declarations and fallback metrics",()=>{
    const faces=[...source.matchAll(/@font-face \{([\s\S]*?)\}/g)].map(m=>m[1]);
    expect(faces.filter(f=>f.includes('src: url('))).toHaveLength(36);
    for(const family of ["Inter","IBM Plex Mono"]){
      for(const weight of ["400","500","600"]){
        const subset=manifest.assets.filter(a=>a.family===family&&a.weights.includes(weight));
        expect(subset.some(a=>a.subset==="latin")).toBe(true);
        expect(subset.some(a=>a.subset==="vietnamese")).toBe(true);
        for(const asset of subset){
          expect(faces.some(f=>f.includes(`font-family: ${family};`)&&f.includes(`font-weight: ${weight};`)&&f.includes(`/fonts/hive/${asset.file}`)&&f.includes(`unicode-range: ${asset.unicodeRange};`)&&f.includes("font-display: swap;"))).toBe(true);
        }
      }
    }
    for(const metric of ["90.44%","22.52%","107.12%","76.16%","20.43%","134.59%"])expect(source).toContain(metric);
    expect(source).toContain('--font-interface: "Inter", "Inter Fallback"');
    expect(source).toContain('--font-utility: "IBM Plex Mono", "IBM Plex Mono Fallback"');
    expect(source).not.toMatch(/https?:\/\/fonts\./);
  });
  it("preloads the same eight English/Vietnamese files without a Google build fetch",()=>{
    const layout=readFileSync("src/app/layout.tsx","utf8");
    expect(layout).not.toContain("next/font/google");expect(layout).toContain('import "./fonts.css"');
    const preloads=[...layout.matchAll(/"(\/fonts\/hive\/[^\"]+\.woff2)"/g)].map(m=>m[1]);
    expect(preloads).toHaveLength(8);expect(new Set(preloads).size).toBe(8);
    for(const preload of preloads){
      expect(preload).toMatch(/-(?:latin|vietnamese)\.woff2$/);
      expect(manifest.assets.some(a=>preload.endsWith('/'+a.file))).toBe(true);
    }
    expect(layout).toContain('crossOrigin="anonymous"');
  });
  it("ships full OFL notices with original copyright and reserved names",()=>{
    for(const file of ["INTER-OFL.txt","IBM-PLEX-MONO-OFL.txt"]){
      const notice=readFileSync(path.join(root,file),"utf8");
      expect(notice).toContain("SIL OPEN FONT LICENSE Version 1.1");
      expect(notice).toContain("PERMISSION");expect(notice).toContain("TERMINATION");expect(notice).toContain("DISCLAIMER");
    }
    expect(readFileSync(path.join(root,"INTER-OFL.txt"),"utf8")).toContain("2016 The Inter Project Authors");
    expect(readFileSync(path.join(root,"IBM-PLEX-MONO-OFL.txt"),"utf8")).toContain('2017 IBM Corp. with Reserved Font Name "Plex"');
  });
});
