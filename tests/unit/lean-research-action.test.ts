import {beforeEach,describe,it,expect,vi} from "vitest";
import {evaluateLeanResearchAction} from "@/app/actions/lean-research";
import {runLeanManualBridge} from "@/modules/research-sandbox/lean-manual-bridge";
import {getEnv} from "@/server/env";
import {resolveWorkspaceContext} from "@/modules/identity-workspace";
import {authorize} from "@/modules/authorization";

vi.mock("next/headers",()=>({headers:async()=>new Headers()}));
vi.mock("@/server/env",()=>({getEnv:vi.fn(()=>({NODE_ENV:"test",DEPLOYMENT_ENV:"test"}))}));
vi.mock("@/modules/identity-workspace",()=>({resolveWorkspaceContext:vi.fn(async()=>({user:{id:"session-actor"},workspace:{id:"session-workspace"},membership:{role:"MEMBER"}})),hasCapability:(role:string)=>["MEMBER","ADMIN","OWNER"].includes(role)}));
vi.mock("@/modules/authorization",()=>({organizationIdForWorkspace:vi.fn(async()=>"session-organization"),authorize:vi.fn(async()=>({allowed:true}))}));
vi.mock("@/modules/research-sandbox/lean-manual-bridge",()=>({runLeanManualBridge:vi.fn(async()=>({origin:"OPERATOR_SUPPLIED_MODEL_OUTPUTS"}))}));
describe("lean workbench action authenticates each POST without DB mutation",()=>{
  beforeEach(()=>{vi.clearAllMocks();vi.mocked(getEnv).mockReturnValue({NODE_ENV:"test",DEPLOYMENT_ENV:"test"} as ReturnType<typeof getEnv>);vi.mocked(authorize).mockResolvedValue({allowed:true} as Awaited<ReturnType<typeof authorize>>);vi.mocked(resolveWorkspaceContext).mockResolvedValue({user:{id:"session-actor"},workspace:{id:"session-workspace"},membership:{role:"MEMBER"}} as Awaited<ReturnType<typeof resolveWorkspaceContext>>);});
  it("calls the actual bridge only after session-derived workspace authorization",async()=>{const input={untrusted:true};expect((await evaluateLeanResearchAction("actual-workspace",input)).ok).toBe(true);expect(resolveWorkspaceContext).toHaveBeenCalledWith(expect.any(Headers),"actual-workspace");expect(authorize).toHaveBeenCalledWith("session-actor","research.request",{organizationId:"session-organization",workspaceId:"session-workspace"});expect(runLeanManualBridge).toHaveBeenCalledWith(input);});
  it("reauthenticates repeated evaluations rather than trusting a prior client state",async()=>{await evaluateLeanResearchAction("actual-workspace",{});await evaluateLeanResearchAction("actual-workspace",{});expect(resolveWorkspaceContext).toHaveBeenCalledTimes(2);expect(authorize).toHaveBeenCalledTimes(4);});
  it.each(["VIEWER","SUSPENDED"])("refuses%s before any bridge execution",async role=>{vi.mocked(resolveWorkspaceContext).mockResolvedValue({membership:{role}} as Awaited<ReturnType<typeof resolveWorkspaceContext>>);expect(await evaluateLeanResearchAction("actual-workspace",{})).toEqual({ok:false,code:"UNAVAILABLE"});expect(runLeanManualBridge).not.toHaveBeenCalled();});
  it("unknown workspace and unauthenticated failures reveal no input or tenant data",async()=>{vi.mocked(resolveWorkspaceContext).mockRejectedValueOnce(new Error("private auth diagnostics"));expect(await evaluateLeanResearchAction("actual-workspace",{})).toEqual({ok:false,code:"UNAVAILABLE"});expect(runLeanManualBridge).not.toHaveBeenCalled();});
  it("organization-level capability refusal cannot be bypassed by a workspace role",async()=>{vi.mocked(authorize).mockResolvedValue({allowed:false} as Awaited<ReturnType<typeof authorize>>);expect(await evaluateLeanResearchAction("actual-workspace",{})).toEqual({ok:false,code:"UNAVAILABLE"});expect(runLeanManualBridge).not.toHaveBeenCalled();});
  it.each(["production","staging"])("refuses deployment%s before auth or execution",async deployment=>{vi.mocked(getEnv).mockReturnValue({NODE_ENV:deployment==="production"?"production":"development",DEPLOYMENT_ENV:deployment} as ReturnType<typeof getEnv>);expect(await evaluateLeanResearchAction("actual-workspace",{})).toEqual({ok:false,code:"UNAVAILABLE"});expect(resolveWorkspaceContext).not.toHaveBeenCalled();expect(runLeanManualBridge).not.toHaveBeenCalled();});
  it("refuses malformed slug without resolving another tenant",async()=>{expect(await evaluateLeanResearchAction("../other-workspace",{})).toEqual({ok:false,code:"UNAVAILABLE"});expect(resolveWorkspaceContext).not.toHaveBeenCalled();});
  it("sanitizes candidate failures without leaking provider/text/host diagnostics",async()=>{vi.mocked(runLeanManualBridge).mockRejectedValueOnce(new Error("private raw input secret"));expect(await evaluateLeanResearchAction("actual-workspace",{})).toEqual({ok:false,code:"INVALID_INPUT"});});
});
