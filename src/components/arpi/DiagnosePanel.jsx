import { useMemo, useState } from "react";
import { Check, ChevronDown, RotateCcw, Search } from "lucide-react";
import ActorAvatar from "../common/ActorAvatar";
import { filterByProfile, filterBySearch, resetFilters } from "../../logic/filterLogic";
import { buildAssessmentSummary } from "../../logic/assessmentLogic";
import "../../styles/arpi.css";

const initialFilters = { search: "", region: "", profile: "", readiness: "" };
const scoreFields = [
  ["businessProcessScore", "Proses bisnis"],
  ["workerCapabilityScore", "Kapasitas pekerja"],
  ["dataAvailabilityScore", "Ketersediaan data"],
  ["infrastructureScore", "Infrastruktur"],
  ["managementScore", "Manajemen"],
];

function DiagnosePanel({ records }) {
  const [filters, setFilters] = useState(initialFilters);
  const [expandedId, setExpandedId] = useState(null);
  const [assessmentEdits, setAssessmentEdits] = useState({});
  const [statusOverrides, setStatusOverrides] = useState({});
  const regions = [...new Set(records.map((record) => record.location))];
  const visibleRecords = useMemo(() => {
    let filtered = filterBySearch(records, filters.search, ["name", "location", "primaryBottleneck", "diagnoseProfile"]);
    filtered = filterByProfile(filtered, filters.profile);
    if (filters.region) filtered = filtered.filter((record) => record.location === filters.region);
    if (filters.readiness === "low") filtered = filtered.filter((record) => record.assessment.readinessScore < 50);
    if (filters.readiness === "medium") filtered = filtered.filter((record) => record.assessment.readinessScore >= 50 && record.assessment.readinessScore < 80);
    if (filters.readiness === "high") filtered = filtered.filter((record) => record.assessment.readinessScore >= 80);
    return filtered;
  }, [records, filters]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <section className="arpi-panel" role="tabpanel" aria-label="Diagnose">
      <div className="arpi-panel-intro">
        <div><h2>Productivity Assessment</h2><p>Evaluasi proses bisnis, kapasitas, data, infrastruktur, dan kendala usaha.</p></div>
        <span className="prototype-chip">Data simulasi/prototipe</span>
      </div>
      <div className="arpi-filter-row">
        <label className="arpi-search">
          <Search size={16} />
          <input aria-label="Cari UMKM Diagnose" onChange={(event) => updateFilter("search", event.target.value)} placeholder="Cari UMKM atau bottleneck" value={filters.search} />
        </label>
        <select aria-label="Wilayah Diagnose" onChange={(event) => updateFilter("region", event.target.value)} value={filters.region}>
          <option value="">Semua wilayah</option>
          {regions.map((region) => <option key={region} value={region}>{region}</option>)}
        </select>
        <select aria-label="Profil Diagnose" onChange={(event) => updateFilter("profile", event.target.value)} value={filters.profile}>
          <option value="">Semua profil</option>
          <option>Basic Digital</option><option>Targeted AI</option><option>Advanced AI</option>
        </select>
        <select aria-label="Readiness" onChange={(event) => updateFilter("readiness", event.target.value)} value={filters.readiness}>
          <option value="">Semua readiness</option>
          <option value="low">Di bawah 50</option><option value="medium">50–79</option><option value="high">80 ke atas</option>
        </select>
        <button className="arpi-reset" onClick={() => setFilters(resetFilters(initialFilters))} type="button"><RotateCcw size={14} /> Reset</button>
      </div>

      <div className="arpi-record-list">
        {visibleRecords.map((record) => {
          const isExpanded = expandedId === record.id;
          const assessment = buildAssessmentSummary({ ...record.assessment, ...assessmentEdits[record.id] });
          const status = statusOverrides[record.id] ?? record.assessmentStatus;
          return (
            <article className="arpi-record" key={record.id}>
              <div className="arpi-record-main">
                <ActorAvatar assetKey={record.imageKey} name={record.name} />
                <div className="arpi-record-identity"><strong>{record.name}</strong><span>{record.location} · {record.diagnoseProfile}</span></div>
                <div className="arpi-record-stat"><span>Readiness</span><strong>{assessment.readinessScore}</strong></div>
                <div className="arpi-record-stat arpi-bottleneck"><span>Primary bottleneck</span><strong>{assessment.primaryBottleneck}</strong></div>
                <span className={`status-badge ${status === "Tervalidasi" ? "status-success" : "status-neutral"}`}>{status}</span>
                <button className="arpi-detail-button" aria-expanded={isExpanded} onClick={() => setExpandedId(isExpanded ? null : record.id)} type="button">
                  {isExpanded ? "Tutup Assessment" : "Edit / Detail"}<ChevronDown size={15} />
                </button>
              </div>
              {isExpanded && (
                <div className="arpi-assessment-detail">
                  <div className="arpi-assessment-grid">
                    {scoreFields.map(([field, label]) => (
                      <label className="arpi-assessment-score" key={field}><span>{label}</span><span className="assessment-score-edit"><input aria-label={`${label} ${record.name}`} max="100" min="0" onChange={(event) => setAssessmentEdits((current) => ({ ...current, [record.id]: { ...current[record.id], [field]: Number(event.target.value) } }))} type="number" value={assessment[field]} /> / 100</span></label>
                    ))}
                    <div className="arpi-assessment-score"><span>Financial constraint</span><strong>{assessment.financialConstraint}</strong></div>
                    <div className="arpi-assessment-score"><span>Capability constraint</span><strong>{assessment.capabilityConstraint}</strong></div>
                    <div className="arpi-assessment-score"><span>Readiness score</span><strong>{assessment.readinessScore}</strong></div>
                    <div className="arpi-assessment-score"><span>Diagnose profile</span><strong>{assessment.diagnoseProfile}</strong></div>
                    <div className="arpi-assessment-score"><span>Primary bottleneck</span><strong>{assessment.primaryBottleneck}</strong></div>
                  </div>
                  <div className="arpi-panel-actions">
                    <button className="admin-button" onClick={() => setStatusOverrides((current) => ({ ...current, [record.id]: "Tervalidasi" }))} type="button"><Check size={14} /> Validasi</button>
                    <button className="admin-button primary" onClick={() => setStatusOverrides((current) => ({ ...current, [record.id]: "Selesai" }))} type="button">Complete</button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
        {visibleRecords.length === 0 && <p className="arpi-empty-state">Tidak ada UMKM sesuai filter.</p>}
      </div>
    </section>
  );
}

export default DiagnosePanel;