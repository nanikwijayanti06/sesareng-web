function searchableValues(value) {
  if (Array.isArray(value)) return value.flatMap(searchableValues);
  if (value && typeof value === "object") return Object.values(value).flatMap(searchableValues);
  return value == null ? [] : [String(value)];
}

function filterByValue(items, value, fields, defaultFields) {
  if (!value) return items;
  const keys = fields.length > 0 ? fields : defaultFields;
  return items.filter((item) => keys.some((field) => {
    const candidate = field.split(".").reduce((current, key) => current?.[key], item);
    return String(candidate ?? "").toLocaleLowerCase("id") === String(value).toLocaleLowerCase("id");
  }));
}

export function filterBySearch(items = [], query = "", fields = []) {
  const normalized = query.trim().toLocaleLowerCase("id");
  if (!normalized) return items;
  return items.filter((item) => {
    const values = fields.length > 0
      ? fields.flatMap((field) => searchableValues(field.split(".").reduce((current, key) => current?.[key], item)))
      : searchableValues(item);
    return values.some((value) => value.toLocaleLowerCase("id").includes(normalized));
  });
}

export const filterByStage = (items, stage, fields = ["stage"]) => filterByValue(items, stage, fields, ["stage"]);
export const filterByProfile = (items, profile, fields = ["diagnoseProfile"]) => filterByValue(items, profile, fields, ["diagnoseProfile", "profile"]);
export const filterByProvider = (items, provider, fields = ["providerId", "provider.id"]) => filterByValue(items, provider, fields, ["providerId", "provider.id"]);
export const filterByStatus = (items, status, fields = ["status", "matchStatus", "clinicStatus", "followUpStatus"]) => filterByValue(items, status, fields, ["status", "matchStatus", "clinicStatus", "followUpStatus"]);
export const filterByBottleneck = (items, bottleneck, fields = ["primaryBottleneck", "bottleneck"]) => filterByValue(items, bottleneck, fields, ["primaryBottleneck", "bottleneck"]);

export function resetFilters(defaults = {}) {
  return Object.fromEntries(Object.keys(defaults).map((key) => [key, ""]));
}