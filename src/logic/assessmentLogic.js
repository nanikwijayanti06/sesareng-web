const readinessFields = [
  "businessProcessScore",
  "workerCapabilityScore",
  "dataAvailabilityScore",
  "infrastructureScore",
  "managementScore",
];

export function calculateReadiness(assessment = {}) {
  const scores = readinessFields
    .map((field) => Number(assessment[field]))
    .filter(Number.isFinite);

  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

export function determineDiagnoseProfile(score) {
  if (score < 50) return "Basic Digital";
  if (score < 80) return "Targeted AI";
  return "Advanced AI";
}

export function getPrimaryBottleneck(assessment = {}) {
  const scoredBottlenecks = Object.entries(assessment.bottleneckScores ?? {});
  if (scoredBottlenecks.length > 0) {
    return scoredBottlenecks.sort((left, right) => right[1] - left[1])[0][0];
  }

  const constraints = [
    ["Business Process", assessment.businessProcessScore],
    ["Worker Capability", assessment.workerCapabilityScore],
    ["Data Availability", assessment.dataAvailabilityScore],
    ["Infrastructure", assessment.infrastructureScore],
    ["Management", assessment.managementScore],
  ].filter(([, score]) => Number.isFinite(Number(score)));

  return constraints.sort((left, right) => left[1] - right[1])[0]?.[0] ?? "Belum dinilai";
}

export function getAssessmentStatus(assessment = {}) {
  if (assessment.status === "completed") return "Selesai";
  if (assessment.status === "in_progress") return "Berjalan";
  return "Belum Mulai";
}

export function buildAssessmentSummary(assessment = {}) {
  const readinessScore = calculateReadiness(assessment);
  return {
    ...assessment,
    readinessScore,
    diagnoseProfile: determineDiagnoseProfile(readinessScore),
    primaryBottleneck: getPrimaryBottleneck(assessment),
    displayStatus: getAssessmentStatus(assessment),
  };
}