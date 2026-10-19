import { performance } from "node:perf_hooks";

if(process.argv.length!==2){console.error("Frozen sufficient-coverage CLI accepts no roots, shifts, allocations or code arguments.");process.exitCode=2;}
else void(async()=>{
  const started=performance.now();
  const {SUFFICIENT_COVERAGE_LIMITS,sufficientCoveragePacket,finalizeCoverageForOutput}=await import("./sufficient-coverage");
  try{let firstRead=true;let packet=sufficientCoveragePacket({now:()=>{if(firstRead){firstRead=false;return started;}return performance.now();}});
    let output=JSON.stringify(packet);packet=finalizeCoverageForOutput(packet,performance.now()-started);output=JSON.stringify(packet);
    if(packet.status==="COMPLETE"&&performance.now()-started>=SUFFICIENT_COVERAGE_LIMITS.seconds*1000){packet=finalizeCoverageForOutput(packet,performance.now()-started);output=JSON.stringify(packet);}
    console.log(output);if(packet.status!=="COMPLETE")process.exitCode=1;
  }catch{console.error("Fixed sufficient-coverage experiment failed closed; no root exclusion implied.");process.exitCode=1;}
})().catch(()=>{console.error("Fixed sufficient-coverage import failed closed.");process.exitCode=1;});

