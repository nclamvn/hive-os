import { performance } from "node:perf_hooks";

if(process.argv.length!==2){console.error("Frozen composite CLI accepts no row, factor, multiplier or program arguments.");process.exitCode=2;}
else void(async()=>{
  const started=performance.now();
  const {COMPOSITE_SHIFT_LIMITS,CompositeCandidateContradictionError,compositeShiftPacket,finalizeCompositeForOutput}=await import("./composite-shift-partitions");
  try{
    let firstRead=true;let packet=compositeShiftPacket({now:()=>{if(firstRead){firstRead=false;return started;}return performance.now();}});
    let output=JSON.stringify(packet);packet=finalizeCompositeForOutput(packet,performance.now()-started);output=JSON.stringify(packet);
    if(packet.status==="COMPLETE"&&performance.now()-started>=COMPOSITE_SHIFT_LIMITS.seconds*1000){packet=finalizeCompositeForOutput(packet,performance.now()-started);output=JSON.stringify(packet);}
    console.log(output);if(packet.status!=="COMPLETE")process.exitCode=1;
  }catch(error){
    if(error instanceof CompositeCandidateContradictionError){
      const output=JSON.stringify({method:"ERDOS_STRAUS_COMPOSITE_SHIFT_CRT_V1",status:"CANDIDATE_CONTRADICTION",row:error.row,
        scope:"Exact offending registered row retained for investigation, not COMPLETE, root refutation or novelty authority."});
      if(Buffer.byteLength(output,"utf8")<=COMPOSITE_SHIFT_LIMITS.maxOutputBytes)console.log(output);else console.error("Diagnostic output cap.");
    }else console.error("Fixed composite experiment failed closed; no root proof implied.");
    process.exitCode=1;
  }
})().catch(()=>{console.error("Fixed composite import failed closed.");process.exitCode=1;});

