import { useMemo, useState } from "react";
import { Download, Edit3, Eye, GraduationCap, Plus, Search, UserPlus } from "lucide-react";
import ActionMenu from "../components/common/ActionMenu";
import ActorAvatar from "../components/common/ActorAvatar";
import AdminDialog from "../components/common/AdminDialog";
import StatusBadge from "../components/common/StatusBadge";
import DashboardLayout from "../components/layout/DashboardLayout";
import universitiesData from "../data/universities.json";
import umkmData from "../data/umkm.json";
import { filterBySearch } from "../logic/filterLogic";
import { exportCsv } from "../logic/exportLogic";
import "../styles/catalog.css";

const blankForm = { name: "", location: "Sleman", role: "Productivity assessment", specialization: "", status: "Aktif" };

function University() {
  const [records, setRecords] = useState(() => universitiesData.items.map((item) => ({ ...item, assignments: item.assignments ?? [], status: item.status ?? "Aktif" })));
  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [assignment, setAssignment] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const visibleRecords = useMemo(() => {
    let result = filterBySearch(records, filters.search, ["name", "location", "role", "specialization"]);
    if (filters.role) result = result.filter((record) => record.role.includes(filters.role));
    if (filters.status) result = result.filter((record) => record.status === filters.status);
    return result;
  }, [records, filters]);
  const roleOptions = [...new Set(records.flatMap((record) => record.role.split(", ")))];

  const openCreate = () => { setForm(blankForm); setDialog({ mode: "create" }); };
  const openEdit = (record) => { setForm({ name: record.name, location: record.location, role: record.role, specialization: record.specialization, status: record.status }); setDialog({ mode: "edit", record }); };

  const saveUniversity = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    if (dialog.mode === "edit") {
      setRecords((current) => current.map((record) => record.id === dialog.record.id ? { ...record, ...form, name } : record));
    } else {
      const nextId = Math.max(0, ...records.map((record) => Number(record.id.replace("UNI", "")) || 0)) + 1;
      setRecords((current) => [...current, { ...form, name, id: `UNI${String(nextId).padStart(3, "0")}`, shortName: name.slice(0, 3).toUpperCase(), assignments: [], imageKey: "" }]);
    }
    setDialog(null);
  };

  const saveAssignment = (event) => {
    event.preventDefault();
    if (!assignment?.umkmId) return;
    setRecords((current) => current.map((record) => record.id === assignment.record.id ? { ...record, assignments: [...new Set([...record.assignments, assignment.umkmId])] } : record));
    setAssignment(null);
  };

  const exportRows = () => exportCsv("sesareng-universitas.csv", visibleRecords, [
    { key: "id", label: "ID" }, { key: "name", label: "Nama" }, { key: "role", label: "Role" }, { key: "specialization", label: "Specialization" }, { key: "location", label: "Wilayah" }, { value: (record) => record.assignments.length, label: "Assignments" }, { key: "status", label: "Status" },
  ]);

  return (
    <DashboardLayout>
      <section className="workspace-page">
        <header className="page-heading">
          <div><p className="page-kicker">ADMIN REGIONAL AI HUB / MITRA AKADEMIK</p><h1>Perguruan Tinggi</h1><p>Kelola mitra assessment produktivitas, pengembangan kapasitas, klinik adopsi, dan pengukuran.</p></div>
          <div className="page-count"><GraduationCap size={18} /> {visibleRecords.length} dari {records.length} mitra</div>
        </header>
        <p className="prototype-label">{universitiesData.dataStatus} · perubahan tersimpan di sesi browser</p>

        <div className="admin-toolbar">
          <label className="catalog-search"><Search size={16} /><input aria-label="Cari perguruan tinggi" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Cari institusi atau specialization" value={filters.search} /></label>
          <select aria-label="Filter role universitas" onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))} value={filters.role}><option value="">Semua role</option>{roleOptions.map((role) => <option key={role}>{role}</option>)}</select>
          <select aria-label="Filter status universitas" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} value={filters.status}><option value="">Semua status</option><option>Aktif</option><option>Nonaktif</option></select>
          <button className="admin-button" onClick={() => setFilters({ search: "", role: "", status: "" })} type="button">Reset</button>
          <button className="admin-button" onClick={exportRows} type="button"><Download size={15} /> Ekspor</button>
          <button className="admin-button primary" onClick={openCreate} type="button"><Plus size={16} /> Tambah Mitra</button>
        </div>

        <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>Perguruan Tinggi</th><th>Role</th><th>Specialization</th><th>Assignments</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>{visibleRecords.map((university) => (
            <tr key={university.id}>
              <td><span className="admin-row-actor"><ActorAvatar assetKey={university.imageKey} name={university.name} /><strong>{university.name}</strong></span></td>
              <td>{university.role}</td><td>{university.specialization}</td><td>{university.assignments.length}</td><td><StatusBadge status={university.status} /></td>
              <td><div className="admin-actions">
                <button aria-label={`Detail ${university.name}`} className="admin-inline-action" onClick={() => setDialog({ mode: "detail", record: university })} type="button"><Eye size={14} /></button>
                <button aria-label={`Edit ${university.name}`} className="admin-inline-action" onClick={() => openEdit(university)} type="button"><Edit3 size={14} /></button>
                <ActionMenu label={`Aksi ${university.name}`} actions={[
                  { label: "Assign ke UMKM", onClick: () => setAssignment({ record: university, umkmId: "" }) },
                  { label: university.status === "Aktif" ? "Nonaktifkan" : "Aktifkan", onClick: () => setDeactivateTarget(university) },
                ]} />
              </div></td>
            </tr>
          ))}{visibleRecords.length === 0 && <tr><td className="admin-empty-state" colSpan="6">Tidak ada mitra sesuai filter.</td></tr>}</tbody>
        </table></div>
      </section>

      <AdminDialog open={dialog?.mode === "create" || dialog?.mode === "edit"} onClose={() => setDialog(null)} title={dialog?.mode === "edit" ? "Edit Mitra" : "Tambah Mitra"}>
        <form id="university-form" onSubmit={saveUniversity}><div className="admin-form-grid">
          <label className="admin-form-field">Nama<input autoFocus onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required value={form.name} /></label>
          <label className="admin-form-field">Wilayah<input onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} value={form.location} /></label>
          <label className="admin-form-field">Role<textarea onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} required value={form.role} /></label>
          <label className="admin-form-field">Specialization<input onChange={(event) => setForm((current) => ({ ...current, specialization: event.target.value }))} value={form.specialization} /></label>
          <label className="admin-form-field">Status<select onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} value={form.status}><option>Aktif</option><option>Nonaktif</option></select></label>
        </div><div className="admin-dialog-footer"><button className="admin-button" onClick={() => setDialog(null)} type="button">Batal</button><button className="admin-button primary" type="submit">Simpan</button></div></form>
      </AdminDialog>

      <AdminDialog open={dialog?.mode === "detail"} onClose={() => setDialog(null)} title="Detail Perguruan Tinggi">
        {dialog?.record && <div className="admin-detail-grid">{[["Nama", dialog.record.name], ["Role", dialog.record.role], ["Specialization", dialog.record.specialization], ["Wilayah", dialog.record.location], ["Assignments", dialog.record.assignments.join(", ") || "Belum ada"], ["Status", dialog.record.status]].map(([label, value]) => <div className="admin-detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>}
      </AdminDialog>

      <AdminDialog open={Boolean(assignment)} onClose={() => setAssignment(null)} title={`Assign ${assignment?.record.name ?? "Mitra"}`}>
        <form id="university-assign-form" onSubmit={saveAssignment}><label className="admin-form-field">UMKM<select onChange={(event) => setAssignment((current) => ({ ...current, umkmId: event.target.value }))} required value={assignment?.umkmId ?? ""}><option value="">Pilih UMKM</option>{umkmData.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><div className="admin-dialog-footer"><button className="admin-button" onClick={() => setAssignment(null)} type="button">Batal</button><button className="admin-button primary" type="submit"><UserPlus size={14} /> Assign</button></div></form>
      </AdminDialog>

      <AdminDialog open={Boolean(deactivateTarget)} onClose={() => setDeactivateTarget(null)} title="Ubah status mitra">
        <p className="admin-confirm-copy">{deactivateTarget?.status === "Aktif" ? "Nonaktifkan" : "Aktifkan kembali"} {deactivateTarget?.name}?</p>
        <div className="admin-dialog-footer"><button className="admin-button" onClick={() => setDeactivateTarget(null)} type="button">Batal</button><button className="admin-button primary" onClick={() => { setRecords((current) => current.map((record) => record.id === deactivateTarget.id ? { ...record, status: record.status === "Aktif" ? "Nonaktif" : "Aktif" } : record)); setDeactivateTarget(null); }} type="button">Konfirmasi</button></div>
      </AdminDialog>
    </DashboardLayout>
  );
}

export default University;
