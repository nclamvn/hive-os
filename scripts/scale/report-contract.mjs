const requiredGates = [
  "SCALE-01",
  "CONC-01",
  "TEN-01",
  "WORK-01",
  "SOAK-01",
  "REC-01",
];

export function validateTip023hReport(report, { requireCertification = true } = {}) {
  if (report?.schema !== "hive-os.enterprise-scale-certification.v1") {
    throw new Error("TIP-023H report schema is invalid");
  }
  if (!Array.isArray(report.failures)) {
    throw new Error("TIP-023H report failures ledger is missing");
  }
  for (const failure of report.failures) {
    if (!failure?.gate || !failure?.severity || !failure?.disposition || !failure?.message) {
      throw new Error("TIP-023H failure lacks gate, severity, disposition or message");
    }
  }
  for (const gate of requiredGates) {
    if (!(gate in (report.gates ?? {}))) {
      throw new Error(`TIP-023H report is missing ${gate}`);
    }
  }
  if (requireCertification) {
    if (report.classification !== "LOCAL_CERTIFICATION_NON_SLO") {
      throw new Error("TIP-023H report is not a certification profile");
    }
    if (report.parameters?.requestedSoakSeconds < 3_600) {
      throw new Error("TIP-023H certification requested less than 3,600 seconds");
    }
    if (report.observations?.soak?.actualDurationSeconds < 3_600) {
      throw new Error("TIP-023H certification ran less than 3,600 seconds");
    }
    if (report.observations?.soak?.continuity?.maxIntervalGapSeconds > 30) {
      throw new Error("TIP-023H certification contains a continuity gap");
    }
    if (report.observations?.soak?.continuity?.retainedSamples <
      report.observations?.soak?.continuity?.expectedMinimumSamples) {
      throw new Error("TIP-023H certification lacks continuous interval evidence");
    }
    if (report.overallStatus !== "PASS" || report.failures.length) {
      throw new Error("TIP-023H certification is not PASS");
    }
    for (const gate of requiredGates) {
      if (report.gates[gate] !== "PASS") {
        throw new Error(`TIP-023H certification gate ${gate} did not pass`);
      }
    }
  }
  return report;
}
