import { ForbiddenError,NotFoundError,UnauthenticatedError } from "@/modules/identity-workspace";
import { ShowcaseRefusal } from "@/modules/research-showcase/contracts";

export function showcaseErrorResponse(error:unknown) {
  const status=error instanceof UnauthenticatedError?401:error instanceof ForbiddenError?403:error instanceof NotFoundError?404:error instanceof ShowcaseRefusal?({AUTHORITY:403,SOURCE:503,INTEGRITY:409,RESOURCE:429,SCHEMA:400,TRANSPORT:503,CONTAINMENT:503}[error.code]):409;
  return Response.json({error:"SHOWCASE_REQUEST_REFUSED",nativeBlockedReason:"CONTAINMENT_UNESTABLISHED"},{status,headers:{"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
}
export function showcaseRunId(value:string) {
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new NotFoundError();
  return value;
}
