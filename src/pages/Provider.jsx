import { useMemo, useState } from "react";
import { Building2, Check, Download, Edit3, Eye, Plus, Search, UserPlus } from "lucide-react";
import ActionMenu from "../components/common/ActionMenu";
import ActorAvatar from "../components/common/ActorAvatar";
import AdminDialog from "../components/common/AdminDialog";
import StatusBadge from "../components/common/StatusBadge";
import DashboardLayout from "../components/layout/DashboardLayout";
import providersData from "../data/providers.json";
import umkmData from "../data/umkm.json";
import { filterBySearch } from "../logic/filterLogic";
import { exportCsv } from "../logic/exportLogic";
import "../styles/catalog.css";

const blankForm = { name: "", type: "Training Provider", location: "Sleman", capabilities: "", accredited: false, status: "Aktif" };

function Provider() {
  const [records, setRecords] = useState(() => providersData.items.map((item) => ({ ...item, assignments: item.assignments ?? [], status: item.status ?? "Aktif" })));
  const [filters, setFilters] = useState({ search: "", type: "", accreditation: "", status: "" });
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [assignment, setAssignment] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  const visibleRecords = useMemo(() => {
    let result = filterBySearch(records, filters.search, ["name", "type", "location", "capabilities"]);
    if (filters.type) result = result.filter((record) => record.type === filters.type);
    if (filters.accreditation) result = result.filter((record) => String(record.accredited) === filters.accreditation);
    if (filters.status) result = result.filter((record) => record.status === filters.status);
    return result;
  }, [records, filters]);

  const openCreate = () => { setForm(blankForm); setDialog({ mode: "create" }); };
  const openEdit = (record) => {
    setForm({ name: record.name, type: record.type, location: record.location, capabilities: record.capabilities.join(", "), accredited: record.accredited, status: record.status });
    setDialog({ mode: "edit", record });
  };

  const saveProvider = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const providerData = { ...form, name, capabilities: form.capabilities.split(",").map((item) => item.trim()).filter(Boolean) };
    if (dialog.mode === "edit") {
      setRecords((current) => current.map((record) => record.id === dialog.record.id ? { ...record, ...providerData } : record));
    } else {
      const nextId = Math.max(0, ...records.map((record) => Number(record.id.replace("PRV", "")) || 0)) + 1;
      setRecords((current) => [...current, { ...providerData, id: `PRV${String(nextId).padStart(3, "0")}`, assignments: [], imageKey: "" }]);
    }
    setDialog(null);
  };

  const saveAssignment = (event) => {
    event.preventDefault();
    if (!assignment?.umkmId) return;
    setRecords((current) => current.map((record) => record.id === assignment.record.id
      ? { ...record, assignments: [...new Set([...record.assignments, assignment.umkmId])] }
      : record));
    setAssignment(null);
  };

  const clearFilters = () => setFilters({ search: "", type: "", accreditation: "", status: "" });
  const exportRows = () => exportCsv("sesareng-provider.csv", visibleRecords, [
    { key: "id", label: "ID" }, { key: "name", label: "Nama" }, { key: "type", label: "Jenis" }, { key: "capabilities", label: "Layanan" }, { key: "location", label: "Wilayah" }, { key: "accredited", label: "Accredited" }, { value: (record) => record.assignments.length, label: "Assignments" }, { key: "status", label: "Status" },
  ]);

  return (
    <DashboardLayout>
      <section className="workspace-page">
        <header className="page-heading">
          <div><p className="page-kicker">ADMIN REGIONAL AI HUB / MITRA LAYANAN</p><h1>Provider</h1><p>Kelola pelatihan, solusi teknologi, akreditasi, dan penugasan.</p></div>
          <div className="page-count"><Building2 size={17} /> {visibleRecords.length} provider</div>
        </header>
        <p className="prototype-label">{providersData.dataStatus} · perubahan tersimpan di sesi browser</p>

        <div className="admin-toolbar">
          <label className="catalog-search"><Search size={16} /><input aria-label="Cari provider" onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="Cari nama atau layanan" value={filters.search} /></label>
          <select aria-label="Filter jenis provider" onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))} value={filters.type}><option value="">Semua type</option><option>Training Provider</option><option>Technology Provider</option></select>
          <select aria-label="Filter akreditasi" onChange={(event) => setFilters((current) => ({ ...current, accreditation: event.target.value }))} value={filters.accreditation}><option value="">Semua akreditasi</option><option value="true">Accredited</option><option value="false">Belum terakreditasi</option></select>
          <select aria-label="Filter status provider" onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} value={filters.status}><option value="">Semua status</option><option>Aktif</option><option>Nonaktif</option></select>
          <button className="admin-button" onClick={clearFilters} type="button">Reset</button>
          <button className="admin-button" onClick={exportRows} type="button"><Download size={15} /> Ekspor</button>
          <button className="admin-button primary" onClick={openCreate} type="button"><Plus size={16} /> Tambah Provider</button>
        </div>

        <div className="admin-table-wrap"><table className="admin-table">
          <thead><tr><th>Provider</th><th>Type</th><th>Service</th><th>Accreditation</th><th>Assignments</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>{visibleRecords.map((provider) => (
            <tr key={provider.id}>
              <td><span className="admin-row-actor"><ActorAvatar assetKey={provider.imageKey} name={provider.name} icon={Building2} /><strong>{provider.name}</strong></span></td>
              <td><span className="provider-type-badge">{provider.type}</span></td>
              <td>{provider.capabilities.join(", ")}</td>
              <td><StatusBadge status={provider.accredited ? "Aktif" : "Pending"}>{provider.accredited ? "Accredited" : "Belum diverifikasi"}</StatusBadge></td>
              <td>{provider.assignments.length}</td><td><StatusBadge status={provider.status} /></td>
              <td><div className="admin-actions">
                <button aria-label={`Detail ${provider.name}`} className="admin-inline-action" onClick={() => setDialog({ mode: "detail", record: provider })} type="button"><Eye size={14} /></button>
                <button aria-label={`Edit ${provider.name}`} className="admin-inline-action" onClick={() => openEdit(provider)} type="button"><Edit3 size={14} /></button>
                <ActionMenu label={`Aksi ${provider.name}`} actions={[
                  { label: "Assign ke UMKM", onClick: () => setAssignment({ record: provider, umkmId: "" }) },
                  { label: "Verifikasi", onClick: () => setRecords((current) => current.map((record) => record.id === provider.id ? { ...record, accredited: true } : record)) },
                  { label: provider.status === "Aktif" ? "Nonaktifkan" : "Aktifkan", onClick: () => setDeactivateTarget(provider) },
                ]} />
              </div></td>
            </tr>
          ))}{visibleRecords.length === 0 && <tr><td className="admin-empty-state" colSpan="7">Tidak ada provider sesuai filter.</td></tr>}</tbody>
        </table></div>
      </section>

      <AdminDialog open={dialog?.mode === "create" || dialog?.mode === "edit"} onClose={() => setDialog(null)} title={dialog?.mode === "edit" ? "Edit Provider" : "Tambah Provider"}>
        <form id="provider-form" onSubmit={saveProvider}><div className="admin-form-grid">
          <label className="admin-form-field">Nama<input autoFocus onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required value={form.name} /></label>
          <label className="admin-form-field">Type<select onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} value={form.type}><option>Training Provider</option><option>Technology Provider</option></select></label>
          <label className="admin-form-field">Wilayah<input onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))} value={form.location} /></label>
          <label className="admin-form-field">Status<select onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} value={form.status}><option>Aktif</option><option>Nonaktif</option></select></label>
          <label className="admin-form-field full">Service/capabilities, pisahkan dengan koma<textarea onChange={(event) => setForm((current) => ({ ...current, capabilities: event.target.value }))} value={form.capabilities} /></label>
          <label className="admin-form-field"><span><input checked={form.accredited} onChange={(event) => setForm((current) => ({ ...current, accredited: event.target.checked }))} type="checkbox" /> Accredited</span></label>
        </div><div className="admin-dialog-footer"><button className="admin-button" onClick={() => setDialog(null)} type="button">Batal</button><button className="admin-button primary" type="submit">Simpan</button></div></form>
      </AdminDialog>

      <AdminDialog open={dialog?.mode === "detail"} onClose={() => setDialog(null)} title="Detail Provider">
        {dialog?.record && <div className="admin-detail-grid">{[["Nama", dialog.record.name], ["Type", dialog.record.type], ["Capabilities", dialog.record.capabilities.join(", ")], ["Wilayah", dialog.record.location], ["Accredited", dialog.record.accredited ? "Ya" : "Belum"], ["Assignments", dialog.record.assignments.join(", ") || "Belum ada"], ["Status", dialog.record.status]].map(([label, value]) => <div className="admin-detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>}
      </AdminDialog>

      <AdminDialog open={Boolean(assignment)} onClose={() => setAssignment(null)} title={`Assign ${assignment?.record.name ?? "Provider"}`}>
        <form id="provider-assign-form" onSubmit={saveAssignment}><label className="admin-form-field">UMKM<select onChange={(event) => setAssignment((current) => ({ ...current, umkmId: event.target.value }))} required value={assignment?.umkmId ?? ""}><option value="">Pilih UMKM</option>{umkmData.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><div className="admin-dialog-footer"><button className="admin-button" onClick={() => setAssignment(null)} type="button">Batal</button><button className="admin-button primary" type="submit"><UserPlus size={14} /> Assign</button></div></form>
      </AdminDialog>

      <AdminDialog open={Boolean(deactivateTarget)} onClose={() => setDeactivateTarget(null)} title="Ubah status provider">
        <p className="admin-confirm-copy">{deactivateTarget?.status === "Aktif" ? "Nonaktifkan" : "Aktifkan kembali"} {deactivateTarget?.name}?</p>
        <div className="admin-dialog-footer"><button className="admin-button" onClick={() => setDeactivateTarget(null)} type="button">Batal</button><button className="admin-button primary" onClick={() => { setRecords((current) => current.map((record) => record.id === deactivateTarget.id ? { ...record, status: record.status === "Aktif" ? "Nonaktif" : "Aktif" } : record)); setDeactivateTarget(null); }} type="button"><Check size={14} /> Konfirmasi</button></div>
      </AdminDialog>
    </DashboardLayout>
  );
}

export default Provider;
