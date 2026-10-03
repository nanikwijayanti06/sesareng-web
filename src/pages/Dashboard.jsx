import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Check,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  GraduationCap,
  Landmark,
  MapPin,
  MapPinned,
  Plus,
  RotateCcw,
  Search,
  Store,
  Users,
  Workflow,
} from "lucide-react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "leaflet/dist/leaflet.css";
import ActorAvatar from "../components/common/ActorAvatar";
import DashboardLayout from "../components/layout/DashboardLayout";
import impactData from "../data/impact.json";
import assessmentsData from "../data/assessments.json";
import interventionData from "../data/interventions.json";
import locationsData from "../data/locations.json";
import providersData from "../data/providers.json";
import umkmData from "../data/umkm.json";
import universitiesData from "../data/universities.json";
import { exportCsv } from "../logic/exportLogic";
import { getPrimaryBottleneck } from "../logic/assessmentLogic";
import { getVerifyStatus } from "../logic/monitoringLogic";
import "../styles/dashboard.css";

const actors = locationsData.items;
const regions = [...new Set(actors.map((actor) => actor.region))];
const stages = interventionData.stages.map((stage) => stage.name);

const activities = [
  { title: "Diagnose selesai", text: "Hierro Watch menyelesaikan asesmen awal.", time: "10 menit lalu", icon: CheckCircle2 },
  { title: "Provider terhubung", text: "Jogja Media Training terhubung ke Bakpia Kencana.", time: "1 jam lalu", icon: Users },
  { title: "Tahap Enable dimulai", text: "Dukungan adopsi teknologi untuk Batik Astoetik.", time: "3 jam lalu", icon: Workflow },
];

const markerColors = {
  UMKM: "#2463eb",
  Provider: "#0c766e",
  "Perguruan Tinggi": "#52667f",
};

const previews = [
  {
    title: "UMKM",
    count: `${umkmData.items.length} pelaku usaha`,
    route: "/umkm",
    icon: Store,
    items: umkmData.items,
  },
  {
    title: "Perguruan Tinggi",
    count: `${universitiesData.items.length} mitra akademik`,
    route: "/universitas",
    icon: GraduationCap,
    items: universitiesData.items,
  },
  {
    title: "Provider",
    count: `${providersData.items.length} mitra layanan`,
    route: "/provider",
    icon: Building2,
    items: providersData.items,
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [actorType, setActorType] = useState("");
  const [stage, setStage] = useState("");
  const [diagnoseProfile, setDiagnoseProfile] = useState("");
  const [impactPeriod, setImpactPeriod] = useState("6");
  const [selectedImpactMonth, setSelectedImpactMonth] = useState("");
  const [globalFilters, setGlobalFilters] = useState({ region: "", sector: "", stage: "", status: "" });
  const [matchQueue, setMatchQueue] = useState(interventionData.matches);

  const filteredUmkm = umkmData.items.filter((item) =>
    (!globalFilters.region || item.location === globalFilters.region)
    && (!globalFilters.sector || item.sector === globalFilters.sector)
    && (!globalFilters.stage || item.stage === globalFilters.stage)
    && (!globalFilters.status || (item.status ?? "Aktif") === globalFilters.status),
  );
  const filteredProviders = providersData.items.filter((item) =>
    (!globalFilters.region || item.location === globalFilters.region)
    && (!globalFilters.status || (item.status ?? "Aktif") === globalFilters.status),
  );
  const filteredUniversities = universitiesData.items.filter((item) =>
    (!globalFilters.region || item.location === globalFilters.region)
    && (!globalFilters.status || (item.status ?? "Aktif") === globalFilters.status),
  );

  const filteredActors = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id");

    return actors.filter((actor) => {
      const matchesSearch = !query || [
        actor.name,
        actor.type,
        actor.detail,
        actor.region,
        actor.stage,
      ].some((value) => value.toLocaleLowerCase("id").includes(query));
      const matchedUmkm = actor.umkmId ? umkmData.items.find((item) => item.id === actor.umkmId) : null;
      const matchedProvider = actor.providerId ? providersData.items.find((item) => item.id === actor.providerId) : null;
      const matchedUniversity = actor.universityId ? universitiesData.items.find((item) => item.id === actor.universityId) : null;
      const actorStatus = matchedUmkm?.status ?? matchedProvider?.status ?? matchedUniversity?.status ?? "Aktif";

      return matchesSearch
        && (!region || actor.region === region)
        && (!actorType || actor.type === actorType)
        && (!(stage || globalFilters.stage) || actor.stage === (globalFilters.stage || stage))
        && (!diagnoseProfile || actor.diagnoseProfile === diagnoseProfile)
        && (!globalFilters.region || actor.region === globalFilters.region)
        && (!globalFilters.status || actorStatus === globalFilters.status)
        && (!globalFilters.sector || (matchedUmkm && matchedUmkm.sector === globalFilters.sector));
    });
  }, [search, region, actorType, stage, diagnoseProfile, globalFilters]);

  const metrics = [
    { label: "Total UMKM", value: filteredUmkm.length, note: "Sesuai filter aktif", icon: Store, route: "/umkm" },
    { label: "Provider Aktif", value: filteredProviders.filter((item) => item.status !== "Nonaktif").length, note: "Mitra layanan aktif", icon: Building2, route: "/provider" },
    { label: "Perguruan Tinggi", value: filteredUniversities.filter((item) => item.status !== "Nonaktif").length, note: "Mitra akademik aktif", icon: GraduationCap, route: "/universitas" },
    { label: "Intervensi Aktif", value: filteredUmkm.filter((item) => ["Enable", "Adopt"].includes(item.stage)).length, note: "Tahap Enable/Adopt", icon: Activity, route: "/arpi" },
    { label: "Verify Pending", value: interventionData.verify.filter((item) => filteredUmkm.some((umkm) => umkm.id === item.umkmId)).filter((item) => item.metrics.some((metric) => getVerifyStatus(metric.actual, metric.target, metric.lowerIsBetter) !== "Target Tercapai")).length, note: "Perlu validasi outcome", icon: CheckCircle2, route: "/arpi?stage=verify" },
    { label: "Adapt Pending", value: interventionData.adapt.filter((item) => filteredUmkm.some((umkm) => umkm.id === item.umkmId) && item.followUpStatus !== "Selesai").length, note: "Tindak lanjut terbuka", icon: Workflow, route: "/arpi?stage=adapt" },
  ];
  const visibleImpact = impactData.timeSeries.slice(-Number(impactPeriod));
  const firstImpact = impactData.timeSeries[0];
  const latestImpact = visibleImpact.find((item) => item.month === selectedImpactMonth) ?? visibleImpact[visibleImpact.length - 1];
  const productivityGrowth = Math.round(((latestImpact.productivityIndex / firstImpact.productivityIndex) - 1) * 100);
  const economicGrowth = Math.round(((latestImpact.economicValue / firstImpact.economicValue) - 1) * 100);
  const currentAssessmentIds = new Set(filteredUmkm.map((item) => item.assessmentId));
  const bottleneckDistribution = assessmentsData.assessments
    .filter((item) => currentAssessmentIds.has(item.id))
    .map((assessment) => getPrimaryBottleneck(assessment))
    .reduce((counts, bottleneck) => ({ ...counts, [bottleneck]: (counts[bottleneck] ?? 0) + 1 }), {});
  const pipelineCounts = stages.map((name) => ({ name, count: filteredUmkm.filter((item) => item.stage === name).length }));

  const resetFilters = () => {
    setSearch("");
    setRegion("");
    setActorType("");
    setStage("");
    setDiagnoseProfile("");
  };

  const resetGlobalFilters = () => setGlobalFilters({ region: "", sector: "", stage: "", status: "" });
  const exportAllData = () => exportCsv("sesareng-regional-hub.csv", [
    ...filteredUmkm.map((item) => ({ actor: "UMKM", id: item.id, name: item.name, profile: item.diagnoseProfile, region: item.location, status: item.status })),
    ...filteredProviders.map((item) => ({ actor: "Provider", id: item.id, name: item.name, profile: item.type, region: item.location, status: item.status ?? "Aktif" })),
    ...filteredUniversities.map((item) => ({ actor: "Perguruan Tinggi", id: item.id, name: item.name, profile: item.role, region: item.location, status: item.status ?? "Aktif" })),
  ], [{ key: "actor", label: "Jenis Aktor" }, { key: "id", label: "ID" }, { key: "name", label: "Nama" }, { key: "profile", label: "Profil/Role" }, { key: "region", label: "Wilayah" }, { key: "status", label: "Status" }]);

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        <header className="dashboard-heading">
          <ActorAvatar
            assetKey="logoSleman"
            className="sleman-emblem"
            icon={Landmark}
            iconSize={24}
            name="Pemerintah Kabupaten Sleman"
          />
          <div>
            <p className="dashboard-kicker">PEMERINTAH KABUPATEN SLEMAN</p>
            <h1>Dashboard Sesareng</h1>
            <p className="dashboard-subtitle">Regional AI Hub - Kabupaten Sleman</p>
          </div>
          <button className="dashboard-map-link" onClick={() => navigate("/map")} type="button">
            <MapPinned size={17} />
            Buka peta penuh
            <ArrowRight size={15} />
          </button>
        </header>

        <p className="prototype-label">{umkmData.dataStatus}</p>

        <section className="dashboard-admin-toolbar" aria-label="Aksi dan filter dashboard">
          <div className="dashboard-admin-actions">
            <button className="admin-button primary" onClick={() => navigate("/umkm?action=create")} type="button"><Plus size={15} /> Tambah UMKM</button>
            <button className="admin-button" onClick={exportAllData} type="button"><Download size={15} /> Ekspor Data</button>
            <button className="admin-button" onClick={() => navigate("/map")} type="button"><MapPinned size={15} /> Buka Peta</button>
            <button className="admin-button" onClick={() => navigate("/arpi")} type="button"><Workflow size={15} /> Buka ARPI</button>
          </div>
          <div className="dashboard-global-filters">
            <label>Wilayah<select aria-label="Filter global wilayah" onChange={(event) => setGlobalFilters((current) => ({ ...current, region: event.target.value }))} value={globalFilters.region}><option value="">Semua wilayah</option>{regions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Sektor<select aria-label="Filter global sektor" onChange={(event) => setGlobalFilters((current) => ({ ...current, sector: event.target.value }))} value={globalFilters.sector}><option value="">Semua sektor</option>{[...new Set(umkmData.items.map((item) => item.sector))].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>ARPI stage<select aria-label="Filter global ARPI stage" onChange={(event) => setGlobalFilters((current) => ({ ...current, stage: event.target.value }))} value={globalFilters.stage}><option value="">Semua tahap</option>{stages.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Status<select aria-label="Filter global status" onChange={(event) => setGlobalFilters((current) => ({ ...current, status: event.target.value }))} value={globalFilters.status}><option value="">Semua status</option><option>Aktif</option><option>Diarsipkan</option><option>Nonaktif</option></select></label>
            <button className="admin-button" onClick={resetGlobalFilters} type="button"><RotateCcw size={14} /> Reset filter</button>
          </div>
        </section>

        <section className="dashboard-metrics" aria-label="Ringkasan ekosistem">
          {metrics.map(({ label, value, note, icon: Icon, route }) => (
            <button className="dashboard-metric" key={label} onClick={() => navigate(route)} type="button">
              <span className="metric-icon"><Icon size={19} /></span>
              <span className="metric-copy">
                <span className="metric-label">{label}</span>
                <strong>{value}</strong>
                <span className="metric-note">{note}</span>
              </span>
              <ChevronRight className="metric-chevron" size={17} />
            </button>
          ))}
        </section>

        <section className="dashboard-panel ecosystem-panel">
          <div className="panel-heading ecosystem-heading">
            <div>
              <p className="panel-kicker">SEBARAN AKTOR</p>
              <h2>Peta Ekosistem</h2>
              <p className="panel-description">Sebaran pelaku usaha dan mitra Regional AI Hub di Kabupaten Sleman.</p>
            </div>
            <div className="map-legend" aria-label="Legenda peta">
              {Object.entries(markerColors).map(([type, color]) => (
                <span key={type}><i style={{ backgroundColor: color }} />{type}</span>
              ))}
            </div>
          </div>

          <div className="ecosystem-filters">
            <label className="filter-search">
              <span>Cari aktor</span>
              <div className="filter-input-wrap">
                <Search size={16} />
                <input
                  aria-label="Cari aktor"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nama, layanan, wilayah..."
                  value={search}
                />
              </div>
            </label>
            <label>
              <span>Wilayah</span>
              <select aria-label="Filter wilayah" onChange={(event) => setRegion(event.target.value)} value={region}>
                <option value="">Semua wilayah</option>
                {regions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Jenis aktor</span>
              <select aria-label="Filter jenis aktor" onChange={(event) => setActorType(event.target.value)} value={actorType}>
                <option value="">Semua jenis</option>
                <option value="UMKM">UMKM</option>
                <option value="Provider">Provider</option>
                <option value="Perguruan Tinggi">Perguruan Tinggi</option>
              </select>
            </label>
            <label>
              <span>Tahap ARPI</span>
              <select aria-label="Filter tahap ARPI" onChange={(event) => setStage(event.target.value)} value={stage}>
                <option value="">Semua tahap</option>
                {stages.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span>Profil Diagnose</span>
              <select aria-label="Filter profil Diagnose" onChange={(event) => setDiagnoseProfile(event.target.value)} value={diagnoseProfile}>
                <option value="">Semua profil</option>
                <option value="Basic Digital">Basic Digital</option>
                <option value="Targeted AI">Targeted AI</option>
                <option value="Advanced AI">Advanced AI</option>
              </select>
            </label>
            <button className="filter-reset" onClick={resetFilters} type="button">Reset</button>
          </div>

          <div className="map-result-count" aria-live="polite">
            Menampilkan <strong>{filteredActors.length}</strong> dari {actors.length} aktor
          </div>
          <div className="ecosystem-map-frame">
            <MapContainer
              center={[-7.83, 110.38]}
              className="ecosystem-map"
              scrollWheelZoom={false}
              zoom={10}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredActors.map((actor) => (
                <CircleMarker
                  center={actor.position}
                  fillColor={markerColors[actor.type]}
                  fillOpacity={0.92}
                  key={actor.name}
                  pathOptions={{ color: "#ffffff", weight: 2 }}
                  radius={9}
                  stroke
                >
                  <Popup>
                    <div className="map-popup">
                      <strong>{actor.name}</strong>
                      <span>{actor.type} · {actor.detail}</span>
                      <span>{actor.region} · {actor.stage}</span>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
            {filteredActors.length === 0 && (
              <div className="map-empty-state">Tidak ada aktor yang cocok dengan filter.</div>
            )}
          </div>
        </section>

        <section className="impact-section" aria-labelledby="impact-title">
          <div className="impact-heading">
            <div>
              <p className="panel-kicker">PEMANTAUAN HASIL</p>
              <h2 id="impact-title">Track Record Dampak Sesareng</h2>
              <p>{impactData.dataStatus} · Angka ilustratif, bukan data resmi pemerintah.</p>
            </div>
            <label className="impact-period">
              <span>Periode</span>
              <select aria-label="Periode grafik dampak" onChange={(event) => setImpactPeriod(event.target.value)} value={impactPeriod}>
                <option value="3">3 bulan</option>
                <option value="6">6 bulan</option>
              </select>
            </label>
            <label className="impact-period">
              <span>Fokus bulan</span>
              <select aria-label="Fokus bulan grafik dampak" onChange={(event) => setSelectedImpactMonth(event.target.value)} value={visibleImpact.some((item) => item.month === selectedImpactMonth) ? selectedImpactMonth : visibleImpact[visibleImpact.length - 1].month}>
                {visibleImpact.map((item) => <option key={item.month} value={item.month}>{item.month}</option>)}
              </select>
            </label>
          </div>
          <div className="impact-summaries">
            <article className="impact-summary">
              <span>Produktivitas</span>
              <strong>+{productivityGrowth}%</strong>
              <small>Perubahan indeks Jan-{latestImpact.month}</small>
            </article>
            <article className="impact-summary teal">
              <span>Nilai Ekonomi</span>
              <strong>+{economicGrowth}%</strong>
              <small>Perubahan agregat Jan-{latestImpact.month}</small>
            </article>
          </div>
          <div className="impact-chart-grid">
            <article className="dashboard-panel impact-chart-card">
              <div className="impact-chart-title">
                <h3>Track Record Produktivitas</h3>
                <span>Data simulasi/prototipe</span>
              </div>
              <div className="impact-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visibleImpact} margin={{ top: 12, right: 12, bottom: 2, left: -12 }} onClick={(state) => state?.activeLabel && setSelectedImpactMonth(state.activeLabel)}>
                    <CartesianGrid stroke="#e8edf3" strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis domain={["dataMin - 3", "dataMax + 3"]} tickLine={false} axisLine={false} width={42} />
                    <Tooltip formatter={(value) => Number(value).toLocaleString("id-ID")} />
                    <Legend onClick={() => setSelectedImpactMonth(visibleImpact[visibleImpact.length - 1]?.month ?? "")} />
                    <Line name="Indeks produktivitas" type="monotone" dataKey="productivityIndex" stroke="#2864c8" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
            <article className="dashboard-panel impact-chart-card">
              <div className="impact-chart-title">
                <h3>Track Record Nilai Ekonomi</h3>
                <span>Data simulasi/prototipe</span>
              </div>
              <div className="impact-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={visibleImpact} margin={{ top: 12, right: 12, bottom: 2, left: -12 }} onClick={(state) => state?.activeLabel && setSelectedImpactMonth(state.activeLabel)}>
                    <CartesianGrid stroke="#e8edf3" strokeDasharray="3 3" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis domain={["dataMin - 0.15", "dataMax + 0.15"]} tickLine={false} axisLine={false} width={42} />
                    <Tooltip formatter={(value) => Number(value).toLocaleString("id-ID")} />
                    <Legend onClick={() => setSelectedImpactMonth(visibleImpact[visibleImpact.length - 1]?.month ?? "")} />
                    <Line name="Nilai ekonomi agregat" type="monotone" dataKey="economicValue" stroke="#138579" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>
        </section>

        <section className="dashboard-lower-grid">
          <article className="dashboard-panel pipeline-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">PROGRAM</p>
                <h2>ARPI Stage Distribution</h2>
              </div>
              <button className="panel-link" onClick={() => navigate("/arpi")} type="button">Lihat program <ArrowRight size={14} /></button>
            </div>
            <div className="pipeline-list">
              {pipelineCounts.map((item, index) => (
                <button className="pipeline-stage" key={item.name} onClick={() => { setStage(item.name); window.scrollTo({ top: 0, behavior: "smooth" }); }} type="button">
                  <span className={`pipeline-number${index < 2 ? " is-active" : ""}`}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="pipeline-name">{item.name}</span>
                  <strong>{item.count}</strong>
                  <ChevronRight size={15} />
                </button>
              ))}
            </div>
          </article>

          <article className="dashboard-panel bottleneck-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">DIAGNOSE</p>
                <h2>Bottleneck Distribution</h2>
              </div>
              <button className="panel-link" onClick={() => navigate("/umkm")} type="button">Detail <ArrowRight size={14} /></button>
            </div>
            <div className="bottleneck-list">
              {Object.entries(bottleneckDistribution).map(([name, count]) => (
                <div className="bottleneck-item" key={name}>
                  <div className="bottleneck-label"><span>{name}</span><strong>{count} UMKM</strong></div>
                  <div className="bottleneck-track"><span style={{ width: `${Math.round((count / Math.max(1, ...Object.values(bottleneckDistribution))) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-panel activity-panel">
            <div className="panel-heading">
              <div>
                <p className="panel-kicker">PEMANTAUAN</p>
                <h2>Aktivitas terbaru</h2>
              </div>
              <Activity size={18} className="activity-heading-icon" />
            </div>
            <div className="activity-list">
              {activities.map(({ title, text, time, icon: Icon }) => (
                <div className="activity-row" key={title}>
                  <span className="activity-icon"><Icon size={16} /></span>
                  <div><strong>{title}</strong><p>{text}</p><time>{time}</time></div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="dashboard-panel approval-queue-panel">
          <div className="panel-heading">
            <div><p className="panel-kicker">PERSETUJUAN</p><h2>Approval Queue</h2></div>
            <span className="admin-status status-warning">{matchQueue.filter((item) => item.status === "Review").length} perlu review</span>
          </div>
          <div className="approval-queue-list">
            {matchQueue.filter((item) => item.status === "Review").map((item) => {
              const umkm = umkmData.items.find((record) => record.id === item.umkmId);
              const intervention = interventionData.interventions.find((record) => record.id === item.interventionId);
              return (
                <div className="approval-queue-row" key={item.umkmId}>
                  <ActorAvatar assetKey={umkm?.imageKey} name={umkm?.name ?? item.umkmId} />
                  <div className="approval-queue-copy"><strong>{umkm?.name ?? item.umkmId}</strong><span>{intervention?.name} · {item.aiAppropriateness}</span></div>
                  <button className="admin-button" onClick={() => navigate(`/arpi?stage=match&umkmId=${item.umkmId}`)} type="button">Review</button>
                  <button className="admin-button primary" onClick={() => setMatchQueue((current) => current.map((entry) => entry.umkmId === item.umkmId ? { ...entry, status: "Recommended", approved: true } : entry))} type="button"><Check size={14} /> Approve</button>
                </div>
              );
            })}
            {matchQueue.every((item) => item.status !== "Review") && <p className="admin-empty-state">Approval queue kosong.</p>}
          </div>
        </section>

        <section className="directory-section">
          <div className="directory-heading">
            <div>
              <p className="panel-kicker">DIREKTORI EKOSISTEM</p>
              <h2>Quick Actions & Direktori</h2>
            </div>
            <button className="panel-link" onClick={() => navigate("/map")} type="button">Jelajahi ekosistem <ArrowRight size={14} /></button>
          </div>
          <div className="directory-grid">
            {previews.map(({ title, count, route, icon: Icon, items }) => (
              <button className="directory-card" key={title} onClick={() => navigate(route)} type="button">
                <span className="directory-icon"><Icon size={19} /></span>
                <span className="directory-card-heading"><strong>{title}</strong><small>{count}</small></span>
                <ChevronRight size={17} />
                <span className="directory-items">{items.map((item) => (
                  <span className="directory-item" key={item.id}>
                    <ActorAvatar assetKey={item.imageKey} name={item.name} />
                    <span>{item.name}</span>
                  </span>
                ))}</span>
                <span className="directory-action">Buka direktori <ArrowRight size={14} /></span>
              </button>
            ))}
          </div>
        </section>
        <footer className="dashboard-footer"><MapPin size={14} /> Kabupaten Sleman <span>•</span> Data simulasi/prototipe</footer>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
