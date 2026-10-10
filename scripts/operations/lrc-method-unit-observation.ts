/** G1 static preflight only: no environment mutation, imports of DB, sessions or subprocesses. */
const args=process.argv.slice(2);
if(args.length!==1||args[0]!=="--preflight"){
  process.stdout.write(JSON.stringify({version:"LRC_METHOD_UNIT_OBSERVATION_V1",status:"NOT_RUN",code:"G2_AUTHORITY_NOT_AUTHORIZED",modelCalls:0})+"\n");process.exitCode=1;
}else{
  process.stdout.write(JSON.stringify({version:"LRC_METHOD_UNIT_OBSERVATION_V1",status:"STATIC_G1_PREFLIGHT_ONLY",blockers:["G2_AUTHORITY_NOT_AUTHORIZED","AUTHENTICATED_SAME_PROCESS_INGRESS_REQUIRED"],modelCalls:0,databaseAccess:false,privateRootAccess:false})+"\n");
}
