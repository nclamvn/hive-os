import { describe, expect, it } from "vitest";
import type { ShowcaseTransportRequest } from "@/modules/research-showcase/contracts";
import { nativeShowcaseTransport, getShowcaseContainmentReadiness } from "@/modules/research-showcase/transport";
import { getPoly19ContainmentStatus } from "@/modules/research-showcase/containment";
import { documentedPartialToolControls, poly19CodexProfile, sanitizedCodexEnvironment } from "@/modules/research-showcase/profile";
import { captureOfflineCodexTrace } from "@/modules/research-showcase/transport-capture";

const bytes = (events: unknown[]) => Buffer.from(events.map(e => JSON.stringify(e)).join("\n")+"\n");
const good = (original = "original π unchanged") => [
  { type: "thread.started", thread_id: "engineering-thread" },
  { type: "turn.started" },
  { type: "item.completed", item: { type: "agent_message", text: original } },
  { type: "turn.completed", usage: { input_tokens: 10, output_tokens: 4, cached_input_tokens: 2, reasoning_output_tokens: 1 } },
];
const request = (): ShowcaseTransportRequest => ({ runId: "engineering-run", role: "ATTEMPT", prompt: "ENGINEERING_ONLY",
  deadlineAt: "2026-10-06T04:00:00Z", signal: new AbortController().signal, permit: { showcase: true } });

describe("TIP079B blocked live transport (offline controls, NOT live containment acceptance)", () => {
  it("publishes blocked readiness with no invented tool-denial or evidence digest", async () => {
    expect(await nativeShowcaseTransport.readiness()).toEqual({status:"BLOCKED_UNESTABLISHED",reason:"ALL_MODEL_TOOL_DENIAL_NOT_ESTABLISHED",evidenceDigest:null});
    expect(getPoly19ContainmentStatus()).toMatchObject({liveEnabled:false,establishedDeniedModelTools:null,requestedModelTools:0});
  });
  it("retains an explicit zero-effect refusal result rather than throwing away failure", async () => {
    expect(await nativeShowcaseTransport.execute(request())).toEqual({outcome:"CONTAINMENT_REFUSED_BEFORE_EFFECT",rawOriginal:"",rawTrace:new Uint8Array(0),threadId:null,
      usage:null,actualModelVersion:null,elapsedMilliseconds:0,invocationStarted:false,remoteEffect:"NONE",reason:"ALL_MODEL_TOOL_DENIAL_NOT_ESTABLISHED"});
  });
  it("refuses before reading attacker-controlled prompt/permit getters", async () => {
    const input = new Proxy({}, {get() { throw new Error("request property touched before containment"); }});
    expect((await nativeShowcaseTransport.execute(input as ShowcaseTransportRequest)).invocationStarted).toBe(false);
  });
  it("cannot be activated by a forged permit, JSON approval or tool-free trace", async () => {
    const input = {...request(), permit:{showcase:true,approved:true,containment:"ESTABLISHED_NO_TOOLS"}, trace:bytes(good())};
    expect((await nativeShowcaseTransport.execute(input as ShowcaseTransportRequest)).outcome).toBe("CONTAINMENT_REFUSED_BEFORE_EFFECT");
    expect(getShowcaseContainmentReadiness().status).toBe("BLOCKED_UNESTABLISHED");
  });
  it("does not fall back when signal is aborted or authority is absent", async () => {
    const input=request(); const controller=new AbortController();controller.abort();input.signal=controller.signal;
    input.permit=undefined as unknown as ShowcaseTransportRequest["permit"];
    expect((await nativeShowcaseTransport.execute(input)).remoteEffect).toBe("NONE");
  });
  it("has no active CLI path or mutable readiness/transport entry", () => {
    expect(Object.isFrozen(nativeShowcaseTransport)).toBe(true);
    expect(Object.isFrozen(getShowcaseContainmentReadiness())).toBe(true);
    expect("cliPath" in nativeShowcaseTransport).toBe(false);
  });
  it("preserves exact required model/effort/tier and ceilings", () => {
    expect(poly19CodexProfile).toMatchObject({model:"gpt-6.1-sol",reasoningEffort:"high",serviceTier:"priority",modelTools:0,
      originalBytes:32768,traceBytes:524288,promptBytes:131072});
  });
  it("lists documented individual switches without claiming a complete denial", () => {
    expect(documentedPartialToolControls["features.shell_tool"]).toBe(false);
    expect(documentedPartialToolControls.web_search).toBe("disabled");
    expect("tools.all" in documentedPartialToolControls).toBe(false);
    expect(getPoly19ContainmentStatus().liveEnabled).toBe(false);
  });
  it("excludes API/provider/proxy/database/secrets and does not read ambient env", () => {
    const env=sanitizedCodexEnvironment({PATH:"/bin",HOME:"/engineering",CODEX_HOME:"/engineering/auth-location",
      LANG:"en_US.UTF-8",OPENAI_API_KEY:"fake",ANTHROPIC_API_KEY:"fake",DATABASE_URL:"fake",HTTPS_PROXY:"fake",OPENAI_BASE_URL:"fake"});
    expect(env).toEqual({PATH:"/bin",HOME:"/engineering",CODEX_HOME:"/engineering/auth-location",LANG:"en_US.UTF-8"});
  });
});

describe("TIP079B inert bounded original capture (engineering observations only)", () => {
  it("preserves exact original and raw trace before any scientific parsing", () => {
    const raw=bytes(good());const r=captureOfflineCodexTrace([raw],{exitCode:0});
    expect(r.outcome).toBe("CAPTURED_ENGINEERING_OBSERVATION");expect(r.rawOriginal).toBe("original π unchanged");
    expect(Buffer.from(r.rawTrace)).toEqual(raw);expect(r.usage).toEqual({inputTokens:10,outputTokens:4,cachedInputTokens:2,reasoningOutputTokens:1});
    expect(r.toolDenialEstablished).toBe(false);expect(r.actualModelVersion).toBeNull();expect(r.remoteEffect).toBe("UNKNOWN");
  });
  it("joins byte-fragmented multibyte messages without proof editing", () => {
    const raw=bytes(good("λ\nline")); const chunks=Array.from(raw,n=>Uint8Array.of(n));
    expect(captureOfflineCodexTrace(chunks,{exitCode:0}).rawOriginal).toBe("λ\nline");
  });
  it("retains raw oversized message but does not truncate/adopt a proof", () => {
    const raw=bytes(good("x".repeat(32769)));const r=captureOfflineCodexTrace([raw],{exitCode:0});
    expect(r.outcome).toBe("ORIGINAL_LIMIT");expect(r.rawOriginal).toBe("");expect(Buffer.from(r.rawTrace)).toEqual(raw);
  });
  it("caps raw trace and discloses incomplete retention/observed size", () => {
    const r=captureOfflineCodexTrace([new Uint8Array(524289)],{exitCode:0});
    expect(r.outcome).toBe("TRACE_LIMIT");expect(r.rawTrace.length).toBe(524288);expect(r.observedTraceBytes).toBe(524289);expect(r.traceComplete).toBe(false);
  });
  it.each(["command_execution","file_change","mcp_tool_call","web_search","view_image","spawn_agent","request_permissions","apply_patch","read_file","unknown_future_tool"])("retains and refuses observed %s without treating reaction as prevention", type => {
    const raw=bytes([...good().slice(0,2),{type:"item.started",item:{type,id:"tool"}}]);const r=captureOfflineCodexTrace([raw],{exitCode:0});
    expect(r.outcome).toBe("UNEXPECTED_TOOL_OBSERVED");expect(Buffer.from(r.rawTrace)).toEqual(raw);expect(r.remoteEffect).toBe("UNKNOWN");
  });
  it("retains completed original when transport later times out", () => {
    const r=captureOfflineCodexTrace([bytes(good())],{exitCode:null,timedOut:true});
    expect(r.outcome).toBe("TIMED_OUT");expect(r.rawOriginal).toBe("original π unchanged");
  });
  it("retains completed original on nonzero exit, with unknown effect", () => {
    const r=captureOfflineCodexTrace([bytes(good())],{exitCode:2});expect(r.outcome).toBe("NONZERO_EXIT");expect(r.rawOriginal).toBe("original π unchanged");
  });
  it("marks incomplete response, missing final or missing context honestly", () => {
    expect(captureOfflineCodexTrace([bytes(good().slice(0,3))],{exitCode:0}).outcome).toBe("INCOMPLETE");
    expect(captureOfflineCodexTrace([bytes(good().filter(e=>e.type!=="thread.started"))],{exitCode:0}).outcome).toBe("INVALID_TRACE");
  });
  it("leaves malformed or absent usage unknown rather than fabricating zero", () => {
    const events=good();events[3]={type:"turn.completed",usage:undefined} as unknown as typeof events[3];
    expect(captureOfflineCodexTrace([bytes(events)],{exitCode:0}).usage).toBeNull();
  });
  it("rejects duplicate context/completed-turn identities", () => {
    expect(captureOfflineCodexTrace([bytes([...good(),good()[0]])],{exitCode:0}).outcome).toBe("INVALID_TRACE");
    expect(captureOfflineCodexTrace([bytes([...good(),good()[3]])],{exitCode:0}).outcome).toBe("INVALID_TRACE");
  });
  it("never last-selects repeated completed messages or repairs their raw bytes", () => {
    const events=good();events.splice(3,0,{type:"item.completed",item:{type:"agent_message",text:"second untrusted proof"}});
    const raw=bytes(events),r=captureOfflineCodexTrace([raw],{exitCode:0});
    expect(r.outcome).toBe("INVALID_TRACE");expect(r.rawOriginal).toBe("original π unchanged");expect(Buffer.from(r.rawTrace)).toEqual(raw);
  });
  it.each([
    [good()[3],...good().slice(0,3)],
    [good()[2],...good().filter(e=>e.type!=="item.completed")],
    [good()[0],good()[1],good()[1],...good().slice(2)],
    [...good(),{type:"item.completed",item:{type:"agent_message",text:"late"}}],
  ])("refuses invalid stage ordering without inventing a fresh context", (...events) => {
    expect(captureOfflineCodexTrace([bytes(events)],{exitCode:0}).outcome).toBe("INVALID_TRACE");
  });
  it("retains malformed JSON and invalid UTF8 without interpreting it", () => {
    const raw=Buffer.from("not-json\n");expect(Buffer.from(captureOfflineCodexTrace([raw],{exitCode:0}).rawTrace)).toEqual(raw);
    expect(captureOfflineCodexTrace([Uint8Array.of(255)],{exitCode:0}).outcome).toBe("INVALID_TRACE");
  });
});
