import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkspaceShell } from "@/components/shell/workspace-shell";
import { Poly19ShowcaseRegion } from "@/components/research/poly19-showcase-region";
import { loadWorkspacePage } from "@/server/auth/workspace-page";
import { getTranslator } from "@/i18n/server";
import { getPoly19ShowcaseCopy } from "@/i18n/poly19-showcase-copy";
import { hasCapability } from "@/modules/identity-workspace";
import { listResearchTargets } from "@/modules/research-sandbox/kernel";
export const dynamic="force-dynamic";

export default async function Poly19ProofPage({params,searchParams}:{params:Promise<{workspaceSlug:string}>;searchParams:Promise<{missionId?:string;runId?:string;action?:string}>}) {
  const [{workspaceSlug},query]=await Promise.all([params,searchParams]);
  const data=await loadWorkspacePage(workspaceSlug),{locale}=await getTranslator(),c=getPoly19ShowcaseCopy(locale);
  if(!hasCapability(data.ctx.membership.role,"research.read")) notFound();
  const targets=await listResearchTargets(data.ctx),missionId=query.missionId?targets.missions.find(m=>m.id===query.missionId)?.id:targets.missions[0]?.id;
  return <WorkspaceShell data={data} title={c.compactTitle} subtitle={c.subtitle}><div className="mx-auto w-full max-w-6xl min-w-0 pb-8"><Link href={`/w/${workspaceSlug}/research${missionId?`?missionId=${encodeURIComponent(missionId)}`:""}`} className="text-meta text-ink mb-5 inline-flex min-h-10 items-center focus-visible:outline focus-visible:outline-2">{c.back}</Link><Poly19ShowcaseRegion ctx={data.ctx} locale={locale} workspaceSlug={workspaceSlug} missionId={missionId} runId={query.runId} actionRefused={query.action==="refused"} canRequest={hasCapability(data.ctx.membership.role,"research.request")} canReview={hasCapability(data.ctx.membership.role,"research.review")}/></div></WorkspaceShell>;
}
