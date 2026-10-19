import { ADAPTIVE_SHIFT_LIMITS, adaptiveShiftPacket, ShiftCandidateContradictionError } from "./adaptive-shift-partitions";

if (process.argv.length !== 2) {
  console.error("This CLI accepts no input, model code, interval expansion or shell arguments; the experiment is frozen.");
  process.exitCode = 2;
} else {
  try {
    const packet = adaptiveShiftPacket();
    console.log(JSON.stringify(packet));
    if (packet.status !== "COMPLETE") process.exitCode = 1;
  } catch (error) {
    if (error instanceof ShiftCandidateContradictionError) {
      const record = { method: "ERDOS_STRAUS_ADAPTIVE_SHIFT_PARTITIONS_V1", status: "CANDIDATE_CONTRADICTION",
        row: error.row, scope: "Exact offending row retained for investigation. Not a COMPLETE packet, root refutation or novelty certificate." };
      const output = JSON.stringify(record);
      if (Buffer.byteLength(output, "utf8") <= ADAPTIVE_SHIFT_LIMITS.maxOutputBytes) console.log(output);
      else console.error("Contradiction diagnostic exceeds output cap; no complete decision emitted.");
    } else console.error("Frozen adaptive-shift experiment failed closed; no complete decision or root proof is implied.");
    process.exitCode = 1;
  }
}
