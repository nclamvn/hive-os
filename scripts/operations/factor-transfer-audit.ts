import { performance } from "node:perf_hooks";

if(process.argv.length!==2){console.error("Frozen transfer CLI accepts no seed, shift, depth or program arguments.");process.exitCode=2;}
else void(async()=>{
  // Import and output serialization are inside this fixed CLI's 60s envelope.
  const started=performance.now();
  const {FACTOR_TRANSFER_LIMITS,TransferCandidateContradictionError,factorTransferPacket,finalizeTransferForOutput}=await import("./factor-transfer-partitions");
  try{let firstRead=true;let packet=factorTransferPacket({now:()=>{if(firstRead){firstRead=false;return started;}return performance.now();}});
    let output=JSON.stringify(packet);packet=finalizeTransferForOutput(packet,performance.now()-started);output=JSON.stringify(packet);
    if(packet.status==="COMPLETE"&&performance.now()-started>=FACTOR_TRANSFER_LIMITS.seconds*1000){packet=finalizeTransferForOutput(packet,performance.now()-started);output=JSON.stringify(packet);}
    console.log(output);if(packet.status!=="COMPLETE")process.exitCode=1;}
  catch(error){if(error instanceof TransferCandidateContradictionError){
    const output=JSON.stringify({method:"ERDOS_STRAUS_FACTOR_DIRECTED_TRANSFER_V1",status:"CANDIDATE_CONTRADICTION",node:error.node,
      scope:"Exact offending node retained for investigation, not COMPLETE, root refutation or novelty authority."});
    if(Buffer.byteLength(output,"utf8")<=FACTOR_TRANSFER_LIMITS.maxOutputBytes)console.log(output);else console.error("Diagnostic output cap.");
  }else console.error("Fixed transfer experiment failed closed; no root proof implied.");process.exitCode=1;}
})().catch(()=>{console.error("Fixed transfer import failed closed.");process.exitCode=1;});
