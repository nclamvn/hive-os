/** Passive, reviewed G1 source registry. This does not mint G2 authority.
 * Final implementation hashes are installed only after the engineering freeze;
 * neither a model nor a retained ledger is a source of authority for these pins.
 */
export const MATH_METHOD_UNIT_INSTALLED_PARSER_VERSION="MATH_METHOD_UNIT_ADMISSION_V1";
export const MATH_METHOD_UNIT_SOURCE_FILES=Object.freeze([
  "src/modules/research-sandbox/math-lrc-research-program.ts","src/modules/research-sandbox/math-lrc-method-unit.ts","src/modules/research-sandbox/math-lrc-method-unit-live.ts","src/modules/research-sandbox/math-lrc-method-unit-review.ts",
  "src/modules/research-sandbox/math-pilot.ts","src/modules/research-sandbox/contracts.ts","src/modules/research-sandbox/agent-review.ts",
  "src/modules/research-sandbox/math-transport-diagnostics.ts","src/modules/research-sandbox/math-transport-admission.ts",
  "src/modules/research-sandbox/worker.ts","src/modules/research-sandbox/agent-review-kernel.ts","src/modules/research-sandbox/kernel.ts","src/modules/research-sandbox/math-cycle-kernel.ts",
  "src/modules/research-sandbox/adapters/codex-local-math.ts","src/modules/research-sandbox/adapters/codex-local-review.ts","src/app/actions/research-sandbox.ts",
  "src/server/operations/math-diagnostic-auth.ts","src/server/operations/math-diagnostic-capture.ts","src/server/operations/math-diagnostic-replay.ts",
  "src/server/operations/math-method-unit-authority.ts","src/server/operations/math-method-unit-transport.ts","src/server/operations/math-method-unit-review-orchestration.ts","src/server/operations/math-method-unit-source-loader.ts","src/server/operations/lrc-method-unit-observation.ts",
  "src/server/operations/lrc-controlled-observation.ts","src/modules/research-sandbox/integrity.ts","src/modules/research-sandbox/errors.ts",
  "src/modules/research-sandbox/math-lrc-campaign-integration.ts","src/modules/research-sandbox/math-lrc-campaign.ts",
  "src/modules/execution-fabric/contracts.ts","src/modules/execution-fabric/errors.ts",
  "src/modules/identity-workspace/context.ts","src/modules/identity-workspace/policy.ts","src/modules/authorization/index.ts",
  "src/server/tenant-context.ts","src/server/db.ts","src/server/env.ts",
]);
export const MATH_METHOD_UNIT_FROZEN_SOURCES:Readonly<Record<string,string>>=Object.freeze({
  "src/modules/research-sandbox/math-lrc-research-program.ts":"2e5e4a0a7a26b5b6314a907b61a5f6eb48f1eb873cbddcfa92069f3be0affec9",
  "src/modules/research-sandbox/math-lrc-method-unit.ts":"72300a2c56ff21e449126fed3d57be247e3abc116e248b96777fc0b9b00812c5",
  "src/modules/research-sandbox/math-lrc-method-unit-live.ts":"580e4f653e8578a572f5310135d62bfe588a0d6e1d3f095ab58bf57dc61768be",
  "src/modules/research-sandbox/math-lrc-method-unit-review.ts":"470f33418ab1246dba6f7002d53c9584212e43ce79bac9cfb4bdfb1440295f6a",
  "src/modules/research-sandbox/math-pilot.ts":"0a09ef2400147b286adaaa76e49eff9f7b29f8c3ad40e4d2bf7ce80445256d87",
  "src/modules/research-sandbox/contracts.ts":"25452f07f71103a386df645c7901331dd8cacba1d4eecb43681882dab3c96972",
  "src/modules/research-sandbox/agent-review.ts":"641fd6c3a8b8e2614720e2868c638b1d9a2c5ba3bb9f46e9f06bc5dbe5a1183e",
  "src/modules/research-sandbox/math-transport-diagnostics.ts":"6654a2abadbc5892828aef7321eb8fee6e70f079cc10cac1e6448c44bd6ce4e9",
  "src/modules/research-sandbox/math-transport-admission.ts":"b2c508bc567e8bc49184bcfb8a0519f4e31dc38a52060614b56fab566148ab3d",
  "src/modules/research-sandbox/worker.ts":"d6a8b8f2022d53e473064914f8f3af8bb9669f9ec3964a4647f7f246e8c83bbb",
  "src/modules/research-sandbox/agent-review-kernel.ts":"03912151a298e746b4465e94ca6c2b1166c248125a5d60dea79483682c073dcf",
  "src/modules/research-sandbox/kernel.ts":"9259f77c5fc97bbffd07866d2fc61c6425afd80f8e534c46eb02d8aa0c9d7658",
  "src/modules/research-sandbox/math-cycle-kernel.ts":"fea72203a175ff651f8c346e24955c3bb2f8ddb526d2540b0c787c291ae23045",
  "src/modules/research-sandbox/adapters/codex-local-math.ts":"ecf2d7649916d6465758d87b1be31f5947931d89dec45a1a0bf0f5bf23780c86",
  "src/modules/research-sandbox/adapters/codex-local-review.ts":"a1351b4cf22f4e2f99e35e6c3628d4e6a8b5b0f9599968936c9345c7078d9f5a",
  "src/app/actions/research-sandbox.ts":"4d348e3925baf10df200401bff748aea83af52f1e76cdaf94ca61d361d2d42c4",
  "src/server/operations/math-diagnostic-auth.ts":"6c588f70e83a1a320dc26bc66ea33c6e4e4915ac2370fee5b39a357ebf704538",
  "src/server/operations/math-diagnostic-capture.ts":"b55e1c2ad9ea95e4e96602760c1a4c34af20cd9877b3c48399a8620a9be8486a",
  "src/server/operations/math-diagnostic-replay.ts":"7e3ccceb1154c4f3e73aa89fbbb322893ef058c1faeb57bb45dddf6547c53d9c",
  "src/server/operations/math-method-unit-authority.ts":"08c5f65ef36dcc03f86bda0b9f5aa6bc980f5c0660423b6da2bfb61f80b46d91",
  "src/server/operations/math-method-unit-transport.ts":"f422819fc756cb629876976734a510b48bf6a2f21aedb6514d81589267c71935",
  "src/server/operations/math-method-unit-review-orchestration.ts":"6bf1abaa91381246c6458e1e7a046dd32184eda329aabcb4c1b029dfab61ec49",
  "src/server/operations/math-method-unit-source-loader.ts":"2c243c8a49302e2709b5f1c778b95fc8ce0f45326314ed0cd7d0c7ed5a5c2256",
  "src/server/operations/lrc-method-unit-observation.ts":"65d6007ec374bd7d07d9c4b27419bec5caeace508e9254302220f2d6c92d7617",
  "src/server/operations/lrc-controlled-observation.ts":"03964b2764d94122b049a95dbd0d6c37188dbc155cc38ea8f71ecd1e8e5d43da",
  "src/modules/research-sandbox/integrity.ts":"1c2d2e29572e68b9c40ee15f7ede10f4985f4cad973767b6532a8c653108c203",
  "src/modules/research-sandbox/errors.ts":"62cdcab748edc52c23c6d621f2cbb60adf9b07bc17de907a1fd24672bbfa06c1",
  "src/modules/research-sandbox/math-lrc-campaign-integration.ts":"1c4d9b689dd92ee88d21f4c4e100cda0fe489930e6514c05c88ab96406d4ee0f",
  "src/modules/research-sandbox/math-lrc-campaign.ts":"60455f420f3cf75450325870315b2924e353173fe56ea19e5983c32770372ca2",
  "src/modules/execution-fabric/contracts.ts":"61f6db26bdd8bb3b48025a5dddbd8f475fcd7f81e240ec24104994b0285f7637",
  "src/modules/execution-fabric/errors.ts":"5efed5bc8b9aa3555d634dc46796f2df93ed7cc655a10ef999ca711d055dc004",
  "src/modules/identity-workspace/context.ts":"b6f346442c1850b57e4ea64ce1338677c521f3802968355cb27f790fb892f3a5",
  "src/modules/identity-workspace/policy.ts":"eb6d78133475ee05dcf2af0943e4c51d5e90c2581a43c6c55e6fa0c00d1671b8",
  "src/modules/authorization/index.ts":"a1563720b504c99cf217567146c2426f2228dbbc8a28ac2718105a6241134ffa",
  "src/server/tenant-context.ts":"44e8f52a411757cc1755328d5c9b254e8b0afba02b60c5c42f5fb1a888487aa4",
  "src/server/db.ts":"40cf6e193ac0929d9cc7b4d51374b4e38052b94fe3ab6f9f90575777aca43841",
  "src/server/env.ts":"f5d6e5258d8bb4628d85397d5682afb95ad18c1cfc5b8950e0925cc340f4e68c",
});
export function frozenMethodUnitFiniteSourcePins(){
  const sha=MATH_METHOD_UNIT_FROZEN_SOURCES["src/modules/research-sandbox/math-lrc-method-unit.ts"];
  return sha?Object.freeze({producerSourceSha256:sha,checkerSourceSha256:sha}):undefined;
}
export function frozenMethodUnitDiagnosticSourcePins(){
  if(Object.keys(MATH_METHOD_UNIT_FROZEN_SOURCES).length!==MATH_METHOD_UNIT_SOURCE_FILES.length||MATH_METHOD_UNIT_SOURCE_FILES.some(f=>!MATH_METHOD_UNIT_FROZEN_SOURCES[f]))return undefined;
  return Object.freeze({parser:MATH_METHOD_UNIT_FROZEN_SOURCES["src/modules/research-sandbox/math-transport-admission.ts"],...Object.fromEntries(MATH_METHOD_UNIT_SOURCE_FILES.map((file,i)=>[`source${i+1}`,MATH_METHOD_UNIT_FROZEN_SOURCES[file]]))});
}
