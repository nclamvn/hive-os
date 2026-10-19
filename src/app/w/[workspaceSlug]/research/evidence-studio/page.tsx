import Link from "next/link";
import {notFound} from "next/navigation";
import {WorkspaceShell} from "@/components/shell/workspace-shell";
import {EvidenceStudioPanel} from "@/components/research/evidence-studio-panel";
import {hasCapability} from "@/modules/identity-workspace";
import {loadWorkspacePage} from "@/server/auth/workspace-page";
import {getTranslator} from "@/i18n/server";
import {getEvidenceStudioCopy} from "@/i18n/evidence-studio-copy";
import {parseStudioQuery} from "@/modules/research-evidence-studio/presentation";
import {loadStudio} from "@/modules/research-evidence-studio/reader";

export const dynamic="force-dynamic";
export const revalidate=0;
export default async function EvidenceStudioPage({params,searchParams}:{params:Promise<{workspaceSlug:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const [{workspaceSlug},q]=await Promise.all([params,searchParams]);
  const data=await loadWorkspacePage(workspaceSlug);
  if(!hasCapability(data.ctx.membership.role,"research.read"))notFound();
  const {locale}=await getTranslator(),c=getEvidenceStudioCopy(locale),query=parseStudioQuery(q),result=await loadStudio(data.ctx,query);
  return <WorkspaceShell data={data} title={c.title} subtitle={c.subtitle}><div className="mx-auto w-full min-w-0 max-w-[1440px] pb-8"><Link href={`/w/${encodeURIComponent(workspaceSlug)}/research`} className="text-meta text-ink mb-4 inline-flex min-h-11 items-center focus-visible:outline focus-visible:outline-2">{c.back}</Link><EvidenceStudioPanel result={result} query={query} slug={workspaceSlug} locale={locale}/></div></WorkspaceShell>;
}
