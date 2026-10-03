import { filterBySearch } from "./filterLogic";

export function filterLocations(locations = [], filters = {}) {
  let visible = filterBySearch(locations, filters.search, ["name", "detail", "region", "type"]);
  if (filters.region) visible = visible.filter((location) => location.region === filters.region);
  if (filters.type) visible = visible.filter((location) => location.type === filters.type);
  if (filters.stage) visible = visible.filter((location) => location.stage === filters.stage);
  if (filters.profile) visible = visible.filter((location) => location.diagnoseProfile === filters.profile);
  return visible;
}