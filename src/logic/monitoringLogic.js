export function calculateProgress(items = []) {
  if (items.length === 0) return 0;
  const completed = items.filter((item) => typeof item === "boolean" ? item : item.completed).length;
  return Math.round((completed / items.length) * 100);
}

export function compareBeforeAfter(before, after, lowerIsBetter = false) {
  const changePercentage = calculateChangePercentage(before, after);
  return {
    before,
    after,
    changePercentage,
    improvementPercentage: lowerIsBetter ? -changePercentage : changePercentage,
  };
}

export function calculateChangePercentage(before, after) {
  const baseline = Number(before);
  const result = Number(after);
  if (!Number.isFinite(baseline) || !Number.isFinite(result) || baseline === 0) return 0;
  return Math.round(((result - baseline) / Math.abs(baseline)) * 100);
}

export function getVerifyStatus(actual, target, lowerIsBetter = false) {
  const current = Number(actual);
  const goal = Number(target);
  if (!Number.isFinite(current) || !Number.isFinite(goal)) return "Perlu Review";

  if (lowerIsBetter) {
    if (current <= goal) return "Target Tercapai";
    if (current <= goal * 1.2) return "Perlu Review";
    return "Di Bawah Target";
  }

  if (current >= goal) return "Target Tercapai";
  if (current >= goal * 0.8) return "Perlu Review";
  return "Di Bawah Target";
}

export function getAdaptDecision({ verifyStatus, eligibleToScale = false, mismatch = false } = {}) {
  if (mismatch || verifyStatus === "Di Bawah Target") return "Replace";
  if (verifyStatus === "Target Tercapai" && eligibleToScale) return "Scale";
  if (verifyStatus === "Target Tercapai") return "Continue";
  return "Adjust";
}