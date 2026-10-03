import assessmentsData from "../data/assessments.json";
import interventionsData from "../data/interventions.json";
import providersData from "../data/providers.json";
import umkmData from "../data/umkm.json";
import universitiesData from "../data/universities.json";
import { buildAssessmentSummary } from "./assessmentLogic";
import { calculateAIAppropriateness, recommendInterventions } from "./matchingLogic";
import { getVerifyStatus } from "./monitoringLogic";

const findById = (items, id) => items.find((item) => item.id === id) ?? null;

export const arpiRecords = umkmData.items.map((umkm) => {
  const assessment = buildAssessmentSummary(
    assessmentsData.assessments.find((item) => item.id === umkm.assessmentId),
  );
  const storedIntervention = findById(interventionsData.interventions, umkm.interventionId);
  const match = interventionsData.matches.find((item) => item.umkmId === umkm.id);
  const enable = interventionsData.enable.find((item) => item.umkmId === umkm.id);
  const adopt = interventionsData.adopt.find((item) => item.umkmId === umkm.id);
  const verify = interventionsData.verify.find((item) => item.umkmId === umkm.id);
  const adapt = interventionsData.adapt.find((item) => item.umkmId === umkm.id);
  const recommendations = recommendInterventions(assessment, interventionsData.interventions);
  const intervention = recommendations[0]?.intervention ?? storedIntervention;
  const provider = findById(providersData.items, intervention?.providerId);
  const trainingProvider = findById(providersData.items, enable?.trainingProviderId);
  const university = findById(universitiesData.items, intervention?.universityId);
  const mentor = findById(universitiesData.items, adopt?.universityId);
  const verifyStatuses = (verify?.metrics ?? []).map((metric) =>
    getVerifyStatus(metric.actual, metric.target, metric.lowerIsBetter),
  );
  const overallVerifyStatus = verifyStatuses.includes("Di Bawah Target")
    ? "Di Bawah Target"
    : verifyStatuses.includes("Perlu Review")
      ? "Perlu Review"
      : "Target Tercapai";

  const aiAppropriateness = calculateAIAppropriateness(assessment, intervention ?? {});

  return {
    ...umkm,
    assessment,
    assessmentStatus: assessment.displayStatus,
    primaryBottleneck: assessment.primaryBottleneck,
    intervention,
    recommendations,
    match: {
      ...match,
      aiAppropriateness,
      status: aiAppropriateness === "Rendah" && intervention?.requiresAI ? "Not Suitable" : match?.status ?? "Review",
      provider,
      university,
    },
    enable: { ...enable, trainingProvider },
    adopt: { ...adopt, provider: findById(providersData.items, adopt?.providerId), mentor },
    verify: { ...verify, overallStatus: overallVerifyStatus },
    adapt: { ...adapt, verifyStatus: overallVerifyStatus },
  };
});

export const arpiPrototypeStatus = interventionsData.dataStatus;
export const arpiStages = interventionsData.stages;
export const arpiProviders = providersData.items;
export const arpiUniversities = universitiesData.items;