import { performance } from "node:perf_hooks";

if(process.argv.length!==2){console.error("Frozen occupied-density CLI accepts no roots, shifts, splits or code arguments.");process.exitCode=2;}
else void(async()=>{
  const started=performance.now();
  const {OCCUPIED_DENSITY_LIMITS,occupiedDensityPacket,finalizeOccupiedDensityForOutput}=await import("./occupied-density");
  try{let firstRead=true;let packet=await occupiedDensityPacket({now:()=>{if(firstRead){firstRead=false;return started;}return performance.now();}});
    let output=JSON.stringify(packet);packet=finalizeOccupiedDensityForOutput(packet,performance.now()-started);output=JSON.stringify(packet);
    if(packet.status==="COMPLETE"&&performance.now()-started>=OCCUPIED_DENSITY_LIMITS.seconds*1000){packet=finalizeOccupiedDensityForOutput(packet,performance.now()-started);output=JSON.stringify(packet);}
    console.log(output);if(packet.status!=="COMPLETE")process.exitCode=1;
  }catch{console.error("Fixed occupied-density experiment failed closed; no root exclusion implied.");process.exitCode=1;}
})().catch(()=>{console.error("Fixed occupied-density import failed closed.");process.exitCode=1;});
