// One fixed, nonadaptive diagnostic batch. Main owns execution authorization.
// Plain callchain ENTRY domination remains preserved in predecessor evidence.
// This does not issue admission, change caps/artifacts or accept CLI input.
import {loadAdmittedSyntheticGrammarP2} from "./admit-private-grammar-tip081-p2.mjs";

if (process.argv.length !== 2) throw new Error("FIXED_DIAGNOSTIC_NO_ARGUMENTS");

const grammar = await loadAdmittedSyntheticGrammarP2();
const CAP = 67108864;
const TTL = 120000;
const CASES = Object.freeze([
  Object.freeze({prefixes: 31, calls: 94, predicted: "SYNTHETIC_ANALYZED", structuralOnlyPredictedDepth: 128}),
  Object.freeze({prefixes: 32, calls: 94, predicted: "DEPTH_REFUSED", structuralOnlyPredictedDepth: 129}),
]);
const rows = [];

for (const item of CASES) {
  // At most222 ASCII characters. Prefix AST construction follows call parsing;
  // these depth predictions do not claim observed private frame/AST metadata.
  const source = "!".repeat(item.prefixes) + "a" + "()".repeat(item.calls) + ";";
  let handle = null;
  let outcome = "UNEXPECTED_FAILURE";
  let observation = null;
  let disposed = false;
  try {
    handle = grammar.createSyntheticGrammarFixtureP2(source, "SCRIPT", CAP, TTL);
    grammar.analyzeSyntheticGrammarFixtureP2(handle);
    observation = grammar.observeSyntheticGrammarFixtureP2(handle);
    outcome = observation.phase;
  } catch (error) {
    // Only fixed refusal scalars leave this diagnostic. No private source/AST.
    if (error && typeof error === "object" && typeof error.code === "string" &&
        error.code.length <= 64 && error.realParserDisabled === true) outcome = error.code;
  } finally {
    if (handle !== null) {
      try { grammar.retireSyntheticGrammarFixtureP2(handle); } catch { /* Owned refusals retire. */ }
      try { grammar.observeSyntheticGrammarFixtureP2(handle); }
      catch (error) { disposed = error?.code === "AUTHORITY_REFUSED"; }
    }
  }
  rows.push({prefixes: item.prefixes, calls: item.calls, predicted: item.predicted,
    structuralOnlyPredictedDepth: item.structuralOnlyPredictedDepth, outcome, disposed, observation});
}

const result = JSON.stringify({scope: "FIXED_SYNTHETIC_HYBRID_DEPTH_DIAGNOSTIC_ONLY",
  realParserDisabled: true, fullP2Accepted: false, cap: CAP, ttl: TTL, rows});
if (result.length > 8192) throw new Error("DIAGNOSTIC_OUTPUT_BOUND");
process.stdout.write(result + "\n");
