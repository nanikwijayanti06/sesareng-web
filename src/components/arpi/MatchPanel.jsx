import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import ActorAvatar from "../common/ActorAvatar";
import universitiesData from "../../data/universities.json";
import interventionsData from "../../data/interventions.json";
import { filterByBottleneck, filterByProvider, filterBySearch, filterByStatus, resetFilters } from "../../logic/filterLogic";
import { calculateAIAppropriateness } from "../../logic/matchingLogic";
import InterventionCard from "./InterventionCard";
import "../../styles/arpi.css";

const initialFilters = { search: "", bottleneck: "", appropriateness: "", providerId: "", status: "" };

function MatchPanel({ records, providers }) {
  const [filters, setFilters] = useState(initialFilters);
  const [matchOverrides, setMatchOverrides] = useState({});
  const bottlenecks = [...new Set(records.map((record) => record.primaryBottleneck))];
  const updatedRecords = records.map((record) => {
    const override = matchOverrides[record.id] ?? {};
    const intervention = interventionsData.interventions.find((item) => item.id === override.interventionId) ?? record.intervention;
    const provider = providers.find((item) => item.id === override.providerId) ?? record.match.provider;
    const university = universitiesData.items.find((item) => item.id === override.universityId) ?? record.match.university;
    return {
      ...record,
      intervention,
      match: {
        ...record.match,
        ...override,
        provider,
        university,
        aiAppropriateness: calculateAIAppropriateness(record.assessment, intervention ?? {}),
      },
    };
  });
  const visibleRecords = useMemo(() => {
    let filtered = filterBySearch(updatedRecords, filters.search, ["name", "primaryBottleneck", "intervention.name", "match.provider.name", "match.university.name"]);
    filtered = filterByBottleneck(filtered, filters.bottleneck, ["primaryBottleneck"]);
    filtered = filterByProvider(filtered, filters.providerId, ["match.provider.id"]);
    filtered = filterByStatus(filtered, filters.status, ["match.status"]);
    if (filters.appropriateness) filtered = filtered.filter((record) => record.match.aiAppropriateness === filters.appropriateness);
    return filtered;
  }, [updatedRecords, filters]);
  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const updateMatch = (recordId, key, value) => setMatchOverrides((current) => ({ ...current, [recordId]: { ...current[recordId], [key]: value } }));

  return (
    <section className="arpi-panel" role="tabpanel" aria-label="Match">
      <div className="arpi-panel-intro"><div><h2>Match & AI Appropriateness</h2><p>Cocokkan bottleneck dengan intervensi, provider, dan mitra akademik. AI bukan pilihan wajib.</p></div><span className="prototype-chip">Data simulasi/prototipe</span></div>
      <div className="arpi-filter-row arpi-filter-row-match">
        <label className="arpi-search"><Search size={16} /><input aria-label="Cari intervensi" onChange={(event) => updateFilter("search", event.target.value)} placeholder="Cari UMKM/intervensi" value={filters.search} /></label>
        <select aria-label="Filter bottleneck" onChange={(event) => updateFilter("bottleneck", event.target.value)} value={filters.bottleneck}><option value="">Semua bottleneck</option>{bottlenecks.map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="AI Appropriateness" onChange={(event) => updateFilter("appropriateness", event.target.value)} value={filters.appropriateness}><option value="">Semua appropriateness</option><option>Tinggi</option><option>Sedang</option><option>Rendah</option><option>AI tidak diperlukan</option></select>
        <select aria-label="Filter provider" onChange={(event) => updateFilter("providerId", event.target.value)} value={filters.providerId}><option value="">Semua provider</option>{providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}</select>
        <select aria-label="Status match" onChange={(event) => updateFilter("status", event.target.value)} value={filters.status}><option value="">Semua status</option><option>Recommended</option><option>Review</option><option>Not Suitable</option></select>
        <button className="arpi-reset" onClick={() => setFilters(resetFilters(initialFilters))} type="button"><RotateCcw size={14} /> Reset</button>
      </div>

      <div className="arpi-match-list">
        {visibleRecords.map((record) => (
          <InterventionCard
            className="arpi-match-card"
            eyebrow={`${record.name} · ${record.primaryBottleneck}`}
            key={record.id}
            title={record.intervention?.name ?? "Belum direkomendasikan"}
          >
              <div className="arpi-match-layout">
              <div className="arpi-match-actor"><ActorAvatar assetKey={record.imageKey} name={record.name} /><div><strong>{record.name}</strong><span>{record.location}</span></div></div>
              <div className="arpi-match-detail"><span>AI Appropriateness</span><strong>{record.match.aiAppropriateness}</strong></div>
              <div className="arpi-match-partners"><span><small>Provider</small><strong>{record.match.provider?.name ?? "Belum dipilih"}</strong></span><span><small>Perguruan tinggi</small><strong>{record.match.university?.name ?? "Belum dipilih"}</strong></span></div>
              <span className={`status-badge ${record.match.status === "Recommended" ? "status-success" : record.match.status === "Not Suitable" ? "status-danger" : "status-warning"}`}>{record.match.status}</span>
            </div>
              <div className="arpi-match-admin-controls">
                <label>Intervention<select aria-label={`Intervention ${record.name}`} onChange={(event) => updateMatch(record.id, "interventionId", event.target.value)} value={matchOverrides[record.id]?.interventionId ?? record.intervention?.id ?? ""}>{interventionsData.interventions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label>Assign Provider<select aria-label={`Assign Provider ${record.name}`} onChange={(event) => updateMatch(record.id, "providerId", event.target.value)} value={matchOverrides[record.id]?.providerId ?? record.match.provider?.id ?? ""}>{providers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label>Assign University<select aria-label={`Assign University ${record.name}`} onChange={(event) => updateMatch(record.id, "universityId", event.target.value)} value={matchOverrides[record.id]?.universityId ?? record.match.university?.id ?? ""}>{universitiesData.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
                <label>Status<select aria-label={`Status match ${record.name}`} onChange={(event) => updateMatch(record.id, "status", event.target.value)} value={record.match.status}><option>Recommended</option><option>Review</option><option>Not Suitable</option></select></label>
                <button className="admin-button primary" onClick={() => updateMatch(record.id, "status", "Recommended")} type="button">Approve</button>
              </div>
          </InterventionCard>
        ))}
        {visibleRecords.length === 0 && <p className="arpi-empty-state">Tidak ada rekomendasi sesuai filter.</p>}
      </div>
    </section>
  );
}

export default MatchPanel;