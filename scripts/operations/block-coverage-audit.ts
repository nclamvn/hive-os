import { performance } from "node:perf_hooks";

if(process.argv.length!==2){console.error("Frozen block-coverage CLI accepts no roots, shifts, allocations or code arguments.");process.exitCode=2;}
else void(async()=>{
  const started=performance.now();
  const {BLOCK_COVERAGE_LIMITS,blockCoveragePacket,finalizeBlockCoverageForOutput}=await import("./block-coverage");
  try{let firstRead=true;let packet=blockCoveragePacket({now:()=>{if(firstRead){firstRead=false;return started;}return performance.now();}});
    let output=JSON.stringify(packet);packet=finalizeBlockCoverageForOutput(packet,performance.now()-started);output=JSON.stringify(packet);
    if(packet.status==="COMPLETE"&&performance.now()-started>=BLOCK_COVERAGE_LIMITS.seconds*1000){packet=finalizeBlockCoverageForOutput(packet,performance.now()-started);output=JSON.stringify(packet);}
    console.log(output);if(packet.status!=="COMPLETE")process.exitCode=1;
  }catch{console.error("Fixed block-coverage experiment failed closed; no root exclusion implied.");process.exitCode=1;}
})().catch(()=>{console.error("Fixed block-coverage import failed closed.");process.exitCode=1;});
