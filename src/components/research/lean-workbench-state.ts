/** UI freshness only, never session/provider/execution authority. */
export type LeanWorkbenchInputs={statement:string;adapterId:"NONE"|"INTEGER_WITNESS"|"FINITE_GRAPH"|"POLYNOMIAL_IDENTITY"|"RATIONAL_INTERVAL_FLOOR";domainInput:string;solver:string;critic:string;repair:string};
export function updateLeanWorkbench(input:LeanWorkbenchInputs,key:keyof LeanWorkbenchInputs,value:string):LeanWorkbenchInputs{
  const next={...input,[key]:value};
  if(["statement","adapterId","domainInput","solver"].includes(key)){next.critic="";next.repair="";}
  if(key==="critic")next.repair="";
  if(key==="adapterId"&&value==="NONE")next.domainInput="";
  return next;
}
export function isCurrentLeanSubmission(submitted:number,current:number){return submitted===current;}
