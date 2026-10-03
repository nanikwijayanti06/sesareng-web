import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Archive, Download, Edit3, Eye, Plus, Search, Store } from "lucide-react";
import ActionMenu from "../components/common/ActionMenu";
import ActorAvatar from "../components/common/ActorAvatar";
import AdminDialog from "../components/common/AdminDialog";
import StatusBadge from "../components/common/StatusBadge";
import DashboardLayout from "../components/layout/DashboardLayout";
import assessmentsData from "../data/assessments.json";
import umkmData from "../data/umkm.json";
import { filterByProfile, filterBySearch, filterByStage } from "../logic/filterLogic";
import { exportCsv } from "../logic/exportLogic";
import { getPrimaryBottleneck } from "../logic/assessmentLogic";
import "../styles/catalog.css";

const stages = ["Diagnose", "Match", "Enable", "Adopt", "Verify", "Adapt"];
const blankForm = { name: "", sector: "", location: "Sleman", diagnoseProfile: "Basic Digital", stage: "Diagnose", status: "Aktif" };
const assessmentsById = new Map(assessmentsData.assessments.map((assessment) => [assessment.id, assessment]));

function makeInitialRecords() {
  return umkmData.items.map((item) => {
    const assessment = assessmentsById.get(item.assessmentId);
    return {
      ...item,
      sector: item.sector ?? "Belum diklasifikasikan",
      readinessScore: assessment?.readinessScore ?? 0,
      primaryBottleneck: assessment ? getPrimaryBottleneck(assessment) : "Belum dinilai",
      status: item.status ?? "Aktif",
    };
  });
}

function Umkm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [records, setRecords] = useState(makeInitialRecords);
  const [filters, setFilters] = useState({ search: "", region: "", profile: "", stage: "", status: "" });
  const [dialog, setDialog] = useState(() => searchParams.get("action") === "create" ? { mode: "create" } : null);
  const [form, setForm] = useState(blankForm);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const regions = [...new Set(records.map((record) => record.location))];

  const visibleRecords = useMemo(() => {
    let result = filterBySearch(records, filters.search, ["name", "sector", "location", "primaryBottleneck"]);
    result = filterByProfile(result, filters.profile);
    result = filterByStage(result, filters.stage);
    if (filters.region) result = result.filter((record) => record.location === filters.region);
    if (filters.status) result = result.filter((record) => record.status === filters.status);
    return result;
  }, [records, filters]);

  const openCreate = () => {
    setForm(blankForm);
    setDialog({ mode: "create" });
  };

  const openEdit = (record) => {
    setForm({ name: record.name, sector: record.sector, location: record.location, diagnoseProfile: record.diagnoseProfile, stage: record.stage, status: record.status });
    setDialog({ mode: "edit", record });
  };

  const saveRecord = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) return;

    if (dialog.mode === "edit") {
      setRecords((current) => current.map((record) => record.id === dialog.record.id ? { ...record, ...form, name } : record));
    } else {
      const nextId = Math.max(0, ...records.map((record) => Number(record.id.replace("UMKM", "")) || 0)) + 1;
      setRecords((current) => [...current, { ...form, name, id: `UMKM${String(nextId).padStart(3, "0")}`, imageKey: "", assessmentId: null, interventionId: null, readinessScore: 0, primaryBottleneck: "Belum dinilai" }]);
    }
    setDialog(null);
  };

  const openArpi = (record, stage) => navigate(`/arpi?stage=${stage}&umkmId=${record.id}`);
  const confirmArchive = () => {
    setRecords((current) => current.map((record) => record.id === archiveTarget.id ? { ...record, status: "Diarsipkan" } : record));
    setArchiveTarget(null);
  };
  const clearFilters = () => setFilters({ search: "", region: "", profile: "", stage: "", status: "" });
  const exportRows = () => exportCsv("sesareng-umkm.csv", visibleRecords, [
    { key: "id", label: "ID" }, { key: "name", label: "Nama" }, { key: "sector", label: "Sektor" }, { key: "location", label: "Wilayah" }, { key: "diagnoseProfile", label: "Profile" }, { key: "primaryBottleneck", label: "Bottleneck" }, { key: "stage", label: "ARPI stage" }, { key: "status", label: "Status" },
  ]);

  return (
    <DashboardLayout>
      <section className="workspace-page">
        <header className="page-heading">
          <div><p className="page-kicker">ADMIN REGIONAL AI HUB / DIREKTORI</p><h1>Manajemen UMKM</h1><p>Kelola profil usaha dan koordinasi tahapan ARPI Kabupaten Sleman.</p></div>
          <div className="page-count"><Store size={17} /> {visibleRecords.length} dari {records.length} UMKM</div>
        </header>
        <p className="prototype-label">{umkmData.dataStatus} · perubahan CRUD tersimpan di sesi browser</p>

        <div className="admin-toolbar">
          <label className="catalog-search"><Search size={16} /><input aria-label="Cari UMKM" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Cari nama, sektor, bottleneck..." value={filters.search} /></label>
          <select aria-label="Filter wilayah" onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value }))} value={filters.region}><option value="">Semua wilayah</option>{regions.map((region) => <option key={region}>{region}</option>)}</select>
          <select aria-label="Filter profile" onChange={(event) => setFilters((current) => ({ ...current, profile: event.target.value }))} value={filters.profile}><option value="">Semua profile</option><option>Basic Digital</option><option>Targeted AI</option><option>Advanced AI</option></select>
          <select aria-label="Filter ARPI stage" onChange={(event) => setFilters((current) => ({ ...current, stage: event.target.value }))} value={filters.stage}><option value="">Semua tahap</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select>
          <select aria-label="Filter status UMKM" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} value={filters.status}><option value="">Semua status</option><option>Aktif</option><option>Diarsipkan</option></select>
          <button className="admin-button" onClick={clearFilters} type="button">Reset</button>
          <button className="admin-button" onClick={exportRows} type="button"><Download size={15} /> Ekspor</button>
          <button className="admin-button primary" onClick={openCreate} type="button"><Plus size={16} /> Tambah UMKM</button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>UMKM</th><th>Sektor</th><th>Wilayah</th><th>Profile</th><th>Readiness</th><th>Bottleneck</th><th>ARPI stage</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              {visibleRecords.map((record) => (
                <tr key={record.id}>
                  <td><span className="admin-row-actor"><ActorAvatar assetKey={record.imageKey} name={record.name} /><strong>{record.name}</strong></span></td>
                  <td>{record.sector}</td><td>{record.location}</td><td>{record.diagnoseProfile}</td>
                  <td>{record.readinessScore ? `${record.readinessScore}/100` : "Belum dinilai"}</td><td>{record.primaryBottleneck}</td><td>{record.stage}</td>
                  <td><StatusBadge status={record.status} /></td>
                  <td><div className="admin-actions">
                    <button aria-label={`Detail ${record.name}`} className="admin-inline-action" onClick={() => setDialog({ mode: "detail", record })} type="button"><Eye size={14} /></button>
                    <button aria-label={`Edit ${record.name}`} className="admin-inline-action" onClick={() => openEdit(record)} type="button"><Edit3 size={14} /></button>
                    <ActionMenu label={`Aksi ${record.name}`} actions={[
                      { label: "Lihat Assessment", onClick: () => openArpi(record, "diagnose") },
                      { label: "Match", onClick: () => openArpi(record, "match") },
                      { label: "Enable", onClick: () => openArpi(record, "enable") },
                      { label: "Verify", onClick: () => openArpi(record, "verify") },
                      { label: "Arsipkan", onClick: () => setArchiveTarget(record), danger: true },
                    ]} />
                  </div></td>
                </tr>
              ))}
              {visibleRecords.length === 0 && <tr><td className="admin-empty-state" colSpan="9">Tidak ada UMKM yang sesuai dengan filter.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <AdminDialog open={dialog?.mode === "create" || dialog?.mode === "edit"} onClose={() => setDialog(null)} title={dialog?.mode === "edit" ? "Edit UMKM" : "Tambah UMKM"}>
        <form id="umkm-form" onSubmit={saveRecord}>
          <div className="admin-form-grid">
            <label className="admin-form-field">Nama UMKM<input autoFocus onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required value={form.name} /></label>
            <label className="admin-form-field">Sektor<input onChange={(event) => setForm((current) => ({ ...current, sector: event.target.value }))} placeholder="Sektor usaha" value={form.sector} /></label>
            <label className="admin-form-field">Wilayah<input onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} required value={form.location} /></label>
            <label className="admin-form-field">Diagnose profile<select onChange={(event) => setForm((current) => ({ ...current, diagnoseProfile: event.target.value }))} value={form.diagnoseProfile}><option>Basic Digital</option><option>Targeted AI</option><option>Advanced AI</option></select></label>
            <label className="admin-form-field">ARPI stage<select onChange={(event) => setForm((current) => ({ ...current, stage: event.target.value }))} value={form.stage}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
            <label className="admin-form-field">Status<select onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} value={form.status}><option>Aktif</option><option>Diarsipkan</option></select></label>
          </div>
          <div className="admin-dialog-footer"><button className="admin-button" onClick={() => setDialog(null)} type="button">Batal</button><button className="admin-button primary" type="submit">Simpan</button></div>
        </form>
      </AdminDialog>

      <AdminDialog open={dialog?.mode === "detail"} onClose={() => setDialog(null)} size="large" title="Detail UMKM">
        {dialog?.record && <div className="admin-detail-grid">
          {[["Nama", dialog.record.name], ["Sektor", dialog.record.sector], ["Wilayah", dialog.record.location], ["Profile", dialog.record.diagnoseProfile], ["Readiness", dialog.record.readinessScore ? `${dialog.record.readinessScore}/100` : "Belum dinilai"], ["Bottleneck", dialog.record.primaryBottleneck], ["ARPI stage", dialog.record.stage], ["Assessment ID", dialog.record.assessmentId ?? "Belum dibuat"], ["Status", dialog.record.status]].map(([label, value]) => <div className="admin-detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>}
      </AdminDialog>

      <AdminDialog open={Boolean(archiveTarget)} onClose={() => setArchiveTarget(null)} title="Arsipkan UMKM">
        <p className="admin-confirm-copy">Arsipkan {archiveTarget?.name}? Data tetap tersimpan dan dapat ditemukan dengan filter status.</p>
        <div className="admin-dialog-footer"><button className="admin-button" onClick={() => setArchiveTarget(null)} type="button">Batal</button><button className="admin-button danger" onClick={confirmArchive} type="button"><Archive size={14} /> Arsipkan</button></div>
      </AdminDialog>
    </DashboardLayout>
  );
}

export default Umkm;
