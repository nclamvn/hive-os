import Link from "next/link";
import {notFound} from "next/navigation";
import {WorkspaceShell} from "@/components/shell/workspace-shell";
import {LrcDemo} from "@/components/research/lrc-demo";
import {getTranslator} from "@/i18n/server";
import {hasCapability} from "@/modules/identity-workspace";
import {loadWorkspacePage} from "@/server/auth/workspace-page";
import {getEnv} from "@/server/env";
import retained from "../../../../../../docs/research/LRC_METHOD_VALIDATION_084.json";

export const dynamic="force-dynamic";
export default async function LrcDemoPage({params}:{params:Promise<{workspaceSlug:string}>}) {
  const {workspaceSlug}=await params;
  const data=await loadWorkspacePage(workspaceSlug);
  if(!hasCapability(data.ctx.membership.role,"research.read"))notFound();
  const env=getEnv();
  if(!["development","test"].includes(env.NODE_ENV)||
    (env.DEPLOYMENT_ENV&&!["development","test"].includes(env.DEPLOYMENT_ENV)))notFound();
  const {locale}=await getTranslator();
  const vi=locale==="vi";
  return <WorkspaceShell data={data} title={vi?"Atlas Lonely Runner":"Lonely Runner atlas"} subtitle={vi?"Hai kết quả lưu trữ · chỉ đọc":"Two retained results · read only"}>
    <div className="mx-auto w-full max-w-6xl min-w-0 pb-10">
      <Link href={`/w/${workspaceSlug}/research/math-tools`} className="text-meta text-ink-muted hover:text-ink mb-5 inline-flex min-h-11 items-center underline underline-offset-4">{vi?"Trở lại bàn toán học":"Back to the mathematics workbench"}</Link>
      {hasCapability(data.ctx.membership.role,"research.request")?<Link href={`/w/${workspaceSlug}/research/lean`} className="text-meta text-ink mb-5 ml-5 inline-flex min-h-11 items-center underline underline-offset-4">{vi?"Mở bàn nghiên cứu gọn (nhập thủ công)":"Open lean workbench (manual input)"}</Link>:null}
      <LrcDemo raw={retained} locale={locale}/>
      <Link href={`/w/${workspaceSlug}/research/kakeya`} className="text-body text-ink mt-5 inline-flex min-h-11 items-center underline underline-offset-4">{vi?"Xem hồ sơ Kakeya · năm tam giác, chứng chỉ và phản biện":"Explore the Kakeya dossier · five triangles, certificates and review"}</Link>
    </div>
  </WorkspaceShell>;
}
