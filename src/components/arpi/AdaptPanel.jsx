import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { getAdaptDecision } from "../../logic/monitoringLogic";
import ActorAvatar from "../common/ActorAvatar";
import AdminDialog from "../common/AdminDialog";
import "../../styles/arpi.css";

const decisions = ["Continue", "Adjust", "Replace", "Scale"];

function AdaptPanel({ records }) {
  const [decisionOverrides, setDecisionOverrides] = useState({});
  const [detailOverrides, setDetailOverrides] = useState({});
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState(null);

  const openEditor = (record, decision) => {
    setEditingRecord(record);
    setForm({ ...record.adapt, ...detailOverrides[record.id], decision });
  };

  const saveFollowUp = (event) => {
    event.preventDefault();
    setDecisionOverrides((current) => ({ ...current, [editingRecord.id]: form.decision }));
    setDetailOverrides((current) => ({ ...current, [editingRecord.id]: form }));
    setEditingRecord(null);
  };

  return (
    <section className="arpi-panel" role="tabpanel" aria-label="Adapt">
      <div className="arpi-panel-intro"><div><h2>Adapt & Follow-up</h2><p>Keputusan awal berasal dari hasil Verify dan aturan monitoring; petugas dapat mengubahnya.</p></div><span className="prototype-chip">Data simulasi/prototipe</span></div>
      <div className="arpi-adapt-list">
        {records.map((record) => {
          const adapt = { ...record.adapt, ...detailOverrides[record.id] };
          const suggestedDecision = getAdaptDecision({
            verifyStatus: record.verify.overallStatus,
            eligibleToScale: adapt.eligibleToScale,
            mismatch: record.verify.overallStatus === "Di Bawah Target",
          });
          const decision = decisionOverrides[record.id] ?? suggestedDecision;
          return (
            <article className="arpi-card arpi-adapt-card" key={record.id}>
              <div className="arpi-record-main">
                <ActorAvatar assetKey={record.imageKey} name={record.name} />
                <div className="arpi-record-identity"><strong>{record.name}</strong><span>Verify: {record.verify.overallStatus}</span></div>
                <span className="status-badge status-neutral">Rekomendasi: {suggestedDecision}</span>
              </div>
              <div className="adapt-decision">
                <label>
                  <span>Keputusan adaptasi</span>
                  <select aria-label={`Keputusan adaptasi ${record.name}`} onChange={(event) => setDecisionOverrides((current) => ({ ...current, [record.id]: event.target.value }))} value={decision}>
                    {decisions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <span className="status-badge status-info"><RefreshCw size={13} />{decision}</span>
              </div>
              <p className="adapt-reason">{adapt.reason}</p>
              <div className="arpi-adapt-meta">
                <div><span>Next action</span><strong>{adapt.nextAction}</strong></div>
                <div><span>Responsible actor</span><strong>{adapt.responsibleActor}</strong></div>
                <div><span>Follow-up status</span><strong>{adapt.followUpStatus}</strong></div>
              </div>
              <button className="admin-button" onClick={() => openEditor(record, decision)} type="button">Edit Decision / Assign Follow-up</button>
            </article>
          );
        })}
      </div>
      <AdminDialog open={Boolean(editingRecord)} onClose={() => setEditingRecord(null)} title={`Adapt follow-up · ${editingRecord?.name ?? ""}`}>
        {form && <form id="adapt-form" onSubmit={saveFollowUp}><div className="admin-form-grid">
          <label className="admin-form-field">Decision<select onChange={(event) => setForm((current) => ({ ...current, decision: event.target.value }))} value={form.decision}>{decisions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="admin-form-field">Follow-up status<select onChange={(event) => setForm((current) => ({ ...current, followUpStatus: event.target.value }))} value={form.followUpStatus}><option>Perlu dijadwalkan</option><option>Berjalan</option><option>Selesai</option></select></label>
          <label className="admin-form-field full">Reason<textarea onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} value={form.reason} /></label>
          <label className="admin-form-field full">Next action<textarea onChange={(event) => setForm((current) => ({ ...current, nextAction: event.target.value }))} value={form.nextAction} /></label>
          <label className="admin-form-field full">Responsible actor<input onChange={(event) => setForm((current) => ({ ...current, responsibleActor: event.target.value }))} value={form.responsibleActor} /></label>
        </div><div className="admin-dialog-footer"><button className="admin-button" onClick={() => setEditingRecord(null)} type="button">Batal</button><button className="admin-button primary" type="submit">Simpan dan assign</button></div></form>}
      </AdminDialog>
    </section>
  );
}

export default AdaptPanel;