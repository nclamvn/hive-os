import { CHARACTER_SHIFT_LIMITS, CharacterCandidateContradictionError, characterShiftPacket } from "./character-shift-partitions";

if (process.argv.length !== 2) { console.error("Frozen character-shift CLI accepts no input or expansion arguments."); process.exitCode = 2; }
else {
  try { const packet = characterShiftPacket(); console.log(JSON.stringify(packet)); if (packet.status !== "COMPLETE") process.exitCode = 1; }
  catch (error) {
    if (error instanceof CharacterCandidateContradictionError) {
      const output = JSON.stringify({ method: "ERDOS_STRAUS_CHARACTER_SHIFT_DEFECTS_V1", status: "CANDIDATE_CONTRADICTION", row: error.row,
        scope: "Exact offending row retained for investigation, not COMPLETE, root refutation or novelty authority." });
      if (Buffer.byteLength(output, "utf8") <= CHARACTER_SHIFT_LIMITS.maxOutputBytes) console.log(output);
      else console.error("Diagnostic output cap; no complete decision.");
    } else console.error("Frozen character-shift experiment failed closed; no root proof is implied."); process.exitCode = 1;
  }
}
