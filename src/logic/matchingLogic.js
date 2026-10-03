import { getPrimaryBottleneck } from "./assessmentLogic";

export function calculateAIAppropriateness(assessment = {}, intervention = {}) {
  if (!intervention.requiresAI) return "AI tidak diperlukan";

  const dataScore = Number(assessment.dataAvailabilityScore ?? 0);
  const infrastructureScore = Number(assessment.infrastructureScore ?? 0);
  const readinessScore = Number(assessment.readinessScore ?? 0);

  if (dataScore < 50 || infrastructureScore < 50 || readinessScore < 50) return "Rendah";
  if (dataScore >= 75 && infrastructureScore >= 70 && readinessScore >= 70) return "Tinggi";
  return "Sedang";
}

export function recommendInterventions(assessment = {}, interventions = []) {
  const bottleneck = getPrimaryBottleneck(assessment);
  const exactMatches = interventions.filter((item) => item.bottleneck === bottleneck);
  const eligibleMatches = exactMatches.length > 0
    ? exactMatches
    : interventions.filter((item) => !item.requiresAI || Number(assessment.dataAvailabilityScore) >= 50);

  return eligibleMatches
    .map((intervention) => ({
      intervention,
      aiAppropriateness: calculateAIAppropriateness(assessment, intervention),
    }))
    .sort((left, right) => {
      const suitabilityOrder = { Tinggi: 0, Sedang: 1, "AI tidak diperlukan": 2, Rendah: 3 };
      return suitabilityOrder[left.aiAppropriateness] - suitabilityOrder[right.aiAppropriateness];
    });
}

export function recommendProvider(intervention = {}, providers = []) {
  return providers.find((provider) => provider.id === intervention.providerId)
    ?? providers.find((provider) => provider.type === (intervention.requiresAI ? "Technology Provider" : "Training Provider"))
    ?? null;
}

export function recommendUniversity(intervention = {}, universities = []) {
  return universities.find((university) => university.id === intervention.universityId)
    ?? universities[0]
    ?? null;
}