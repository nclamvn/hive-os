import { randomUUID } from "node:crypto";
import { createDomainProblemContract,applicableDomainMethods,prepareProblemContract } from "@/modules/research-sandbox/research-core-v3";
import type { Json } from "@/modules/research-sandbox/research-core-v3/types";
import type { CampaignEnvelope } from "@/modules/research-sandbox/research-campaign/contracts";

export function campaignQaEnvelope(methods:string[],rounds=1):CampaignEnvelope {
  return {version:3,provider:"CONTROLLED_LOCAL",requestedModel:"controlled-campaign-v3",methods,
    total:{calls:8,tokens:8192,checkerOperations:5000000,computeMilliseconds:500000,readBytes:48*1024*1024,writeBytes:2*1024*1024},
    perCall:{tokens:1024,milliseconds:5000},stop:{maxRounds:rounds,maxNoInformation:rounds,deadlineAt:new Date(Date.now()+90000).toISOString()},
    recovery:{replacementDeliveries:1,verifierReplays:1,diagnosticIncidents:8,diagnosticReadBytes:8*1024*1024,diagnosticMilliseconds:60000}};
}
export function campaignQaProblem(adapterId="INTEGER_WITNESS",input:Json={kind:"LINEAR_WITNESS",coefficients:["1","1"],rhs:"5"}) {
  return createDomainProblemContract({id:randomUUID(),rootId:randomUUID(),target:"Exactly check the sealed QA obligation",mode:"ENGINEERING",
    adapterId,adapterVersion:1,input,obligationId:"exact-obligation"}).contract;
}
export function campaignQaMethods(contract:unknown) {
  // Domain-owned reviewed method metadata, not an orchestration domain switch.
  const prepared=prepareProblemContract(contract);
  return applicableDomainMethods(prepared,prepared.contract.obligations[0].id).map(card=>card.id);
}
