import { randomUUID } from "node:crypto";
import { lstat } from "node:fs/promises";
import path from "node:path";
import { hashPassword } from "better-auth/crypto";
import { getDb } from "../../src/server/db";
import { getEnv } from "../../src/server/env";
import { auth } from "../../src/server/auth";
import { provisionWorkspace } from "../../src/modules/identity-workspace/onboarding";
import { createMission } from "../../src/modules/mission-kernel";
import { assertShowcaseEnvironment } from "../../src/modules/research-showcase/source";
import type { WorkspaceContext } from "../../src/modules/identity-workspace";

/** Main-only isolated synthetic login provisioning. No deletion/truncation,
 * mail, old account reuse or production environment activation. */
async function main() {
  assertShowcaseEnvironment();if(process.argv.length!==2)throw new Error("FIXED_PROVISIONER_NO_ARGUMENTS");
  const env=getEnv(),root=env.STORAGE_LOCAL_ROOT;
  const migration=new URL(env.DATABASE_MIGRATION_URL!);
  if(!["localhost","127.0.0.1"].includes(migration.hostname)||migration.port!=="5433"||migration.pathname!=="/hiveos_test")throw new Error("ISOLATED_OWNER_TARGET_REQUIRED");
  if(!root || !path.isAbsolute(root))throw new Error("PRIVATE_QA_STORAGE_REQUIRED");
  const st=await lstat(root);if(!st.isDirectory()||st.isSymbolicLink()||(st.mode&0o777)!==0o700)throw new Error("PRIVATE_QA_STORAGE_REQUIRED");
  const id=randomUUID(),email=`tip079-qa-${id}@example.test`,password=`Tip079-${randomUUID()}`,name="TIP079 synthetic QA operator";
  const user=await getDb().user.create({data:{id,email,name,emailVerified:true}});
  await getDb().account.create({data:{id:randomUUID(),accountId:id,providerId:"credential",userId:id,password:await hashPassword(password)}});
  const workspace=await provisionWorkspace({id:user.id,name:user.name,email:user.email},"TIP079 Poly19 Engineering");
  const membership=await getDb().membership.findFirstOrThrow({where:{workspaceId:workspace.id,userId:id}});
  const ctx:WorkspaceContext={user:{id,name,email},workspace,membership:{id:membership.id,role:membership.role,status:membership.status},correlationId:randomUUID()};
  const mission=await createMission(ctx,{title:"TIP079 fixed public Poly19 engineering demonstration"});
  const signed=await auth.api.signInEmail({body:{email,password}});if(signed.user.id!==id)throw new Error("SYNTHETIC_LOGIN_CHECK_FAILED");
  const organizationId=(await getDb().workspace.findUniqueOrThrow({where:{id:workspace.id},select:{organizationId:true}})).organizationId;
  // These are newly created SYNTHETIC test credentials, not private auth tokens.
  process.stdout.write(JSON.stringify({purpose:"ENGINEERING_ONLY",email,password,actorUserId:id,organizationId,workspaceId:workspace.id,workspaceSlug:workspace.slug,missionId:mission.id,
    url:`/w/${workspace.slug}/research/poly19?missionId=${mission.id}`})+"\n");
}
void main().catch(()=>{process.stderr.write("SHOWCASE_QA_PROVISIONING_REFUSED\n");process.exitCode=2;}).finally(()=>getDb().$disconnect());
