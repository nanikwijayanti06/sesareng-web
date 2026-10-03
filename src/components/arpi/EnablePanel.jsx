import { useState } from "react";
import { Edit3 } from "lucide-react";
import ActorAvatar from "../common/ActorAvatar";
import AdminDialog from "../common/AdminDialog";
import "../../styles/arpi.css";

const formatCurrency = (value) => `Rp ${Number(value).toLocaleString("id-ID")}`;

function EnablePanel({ records, providers = [] }) {
  const [overrides, setOverrides] = useState({});
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState(null);
  const visibleRecords = records.map((record) => ({ ...record, enable: { ...record.enable, ...overrides[record.id] } }));
  const allocationTotal = visibleRecords.reduce((total, record) => total + (record.enable.voucherAllocation ?? 0), 0);
  const usedTotal = visibleRecords.reduce((total, record) => total + (record.enable.voucherUsed ?? 0), 0);
  const trainingCount = visibleRecords.filter((record) => record.enable.trainingProgram).length;

  const openEditor = (record, action) => {
    setEditor({ record, action });
    setForm({
      voucherAllocation: record.enable.voucherAllocation,
      voucherUsed: record.enable.voucherUsed,
      trainingProgram: record.enable.trainingProgram,
      capabilityGap: record.enable.capabilityGap,
      trainingProviderId: record.enable.trainingProvider?.id ?? "",
      status: record.enable.status,
    });
  };

  const saveChanges = (event) => {
    event.preventDefault();
    setOverrides((current) => ({
      ...current,
      [editor.record.id]: {
        voucherAllocation: Number(form.voucherAllocation) || 0,
        voucherUsed: Number(form.voucherUsed) || 0,
        trainingProgram: form.trainingProgram,
        capabilityGap: form.capabilityGap,
        trainingProvider: providers.find((provider) => provider.id === form.trainingProviderId) ?? null,
        status: form.status,
      },
    }));
    setEditor(null);
  };

  return (
    <section className="arpi-panel" role="tabpanel" aria-label="Enable">
      <div className="arpi-panel-intro"><div><h2>Enable: sumber daya dan kapasitas</h2><p>Productivity Voucher membantu kendala finansial; targeted training menutup capability gap.</p></div><span className="prototype-chip">Data simulasi/prototipe</span></div>
      <div className="arpi-summary-grid arpi-enable-summaries">
        <article className="arpi-summary-card"><span>Productivity Voucher</span><strong>{formatCurrency(usedTotal)} / {formatCurrency(allocationTotal)}</strong><small>Alokasi dan penggunaan contoh</small></article>
        <article className="arpi-summary-card arpi-summary-teal"><span>Targeted Training</span><strong>{trainingCount} program</strong><small>Program pengembangan kapabilitas</small></article>
      </div>
      <div className="arpi-record-list">
        {visibleRecords.map((record) => {
          const enable = record.enable;
          const progress = enable.voucherAllocation > 0 ? Math.min(100, Math.round((enable.voucherUsed / enable.voucherAllocation) * 100)) : 0;
          return (
            <article className="arpi-card arpi-enable-card" key={record.id}>
              <div className="arpi-record-main">
                <ActorAvatar assetKey={record.imageKey} name={record.name} />
                <div className="arpi-record-identity"><strong>{record.name}</strong><span>{record.location} · {record.primaryBottleneck}</span></div>
                <span className={`status-badge ${enable.status === "Selesai" ? "status-success" : enable.status === "Berjalan" ? "status-warning" : "status-neutral"}`}>{enable.status}</span>
              </div>
              <div className="arpi-enable-data">
                <div><span>Voucher allocation</span><strong>{formatCurrency(enable.voucherAllocation)}</strong></div>
                <div><span>Voucher used</span><strong>{formatCurrency(enable.voucherUsed)}</strong></div>
                <div><span>Training program</span><strong>{enable.trainingProgram}</strong></div>
                <div><span>Capability gap</span><strong>{enable.capabilityGap}</strong></div>
                <div><span>Training provider</span><strong>{enable.trainingProvider?.name ?? "Belum ditetapkan"}</strong></div>
              </div>
              <div className="arpi-progress-block">
                <div><span>Realisasi voucher</span><strong>{progress}%</strong></div>
                <div className="arpi-progress-bar" role="progressbar" aria-label={`Realisasi voucher ${record.name}`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
              </div>
              <div className="arpi-panel-actions">
                <button className="admin-button" onClick={() => openEditor(record, "voucher")} type="button"><Edit3 size={14} /> Allocate/Edit Voucher</button>
                <button className="admin-button" onClick={() => openEditor(record, "training")} type="button">Add/Edit Training</button>
                <button className="admin-button" onClick={() => openEditor(record, "progress")} type="button">Update Progress</button>
              </div>
            </article>
          );
        })}
      </div>
      <AdminDialog open={Boolean(editor)} onClose={() => setEditor(null)} title={editor?.action === "training" ? "Kelola Targeted Training" : "Kelola Productivity Voucher"}>
        {form && <form id="enable-form" onSubmit={saveChanges}><div className="admin-form-grid">
          <label className="admin-form-field">Voucher allocation (Rp)<input min="0" onChange={(event) => setForm((current) => ({ ...current, voucherAllocation: event.target.value }))} type="number" value={form.voucherAllocation} /></label>
          <label className="admin-form-field">Voucher used (Rp)<input min="0" onChange={(event) => setForm((current) => ({ ...current, voucherUsed: event.target.value }))} type="number" value={form.voucherUsed} /></label>
          <label className="admin-form-field full">Training program<input onChange={(event) => setForm((current) => ({ ...current, trainingProgram: event.target.value }))} value={form.trainingProgram} /></label>
          <label className="admin-form-field">Capability gap<input onChange={(event) => setForm((current) => ({ ...current, capabilityGap: event.target.value }))} value={form.capabilityGap} /></label>
          <label className="admin-form-field">Training provider<select onChange={(event) => setForm((current) => ({ ...current, trainingProviderId: event.target.value }))} value={form.trainingProviderId}>{providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}</select></label>
          <label className="admin-form-field">Status<select onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} value={form.status}><option>Belum Mulai</option><option>Berjalan</option><option>Selesai</option></select></label>
        </div><div className="admin-dialog-footer"><button className="admin-button" onClick={() => setEditor(null)} type="button">Batal</button><button className="admin-button primary" type="submit">Simpan</button></div></form>}
      </AdminDialog>
    </section>
  );
}

export default EnablePanel;
