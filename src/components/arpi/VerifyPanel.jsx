import { useState } from "react";
import { Check, CheckCircle2, ClipboardCheck, Edit3 } from "lucide-react";
import { calculateChangePercentage, getVerifyStatus } from "../../logic/monitoringLogic";
import ActorAvatar from "../common/ActorAvatar";
import AdminDialog from "../common/AdminDialog";
import "../../styles/arpi.css";

function formatMetric(value, unit) {
  const formatted = Number(value).toLocaleString("id-ID", { maximumFractionDigits: 2 });
  return unit === "index" ? formatted : `${formatted} ${unit}`;
}

function VerifyPanel({ records }) {
  const [metricOverrides, setMetricOverrides] = useState({});
  const [validated, setValidated] = useState({});
  const [editingRecord, setEditingRecord] = useState(null);
  const [editMetrics, setEditMetrics] = useState([]);

  const openEditor = (record) => {
    setEditingRecord(record);
    setEditMetrics(record.verify.metrics.map((metric) => ({ ...metric })));
  };

  const saveResults = (event) => {
    event.preventDefault();
    setMetricOverrides((current) => ({ ...current, [editingRecord.id]: editMetrics }));
    setValidated((current) => ({ ...current, [editingRecord.id]: false }));
    setEditingRecord(null);
  };

  return (
    <section className="arpi-panel" role="tabpanel" aria-label="Verify">
      <div className="arpi-panel-intro">
        <div><h2>Outcome Measurement</h2><p>Bandingkan baseline, hasil aktual, dan target untuk setiap indikator produktivitas.</p></div>
        <span className="prototype-chip">Data simulasi/prototipe</span>
      </div>
      <div className="arpi-verification-list">
        {records.map((record) => {
          const metrics = metricOverrides[record.id] ?? record.verify.metrics;
          const statuses = metrics.map((metric) => getVerifyStatus(metric.actual, metric.target, metric.lowerIsBetter));
          const overallStatus = validated[record.id]
            ? "Tervalidasi"
            : statuses.includes("Di Bawah Target")
              ? "Di Bawah Target"
              : statuses.includes("Perlu Review") ? "Perlu Review" : "Target Tercapai";
          const statusClass = overallStatus === "Target Tercapai" || overallStatus === "Tervalidasi"
            ? "status-success"
            : overallStatus === "Perlu Review" ? "status-warning" : "status-danger";

          return (
            <article className="arpi-card" key={record.id}>
              <div className="arpi-record-main">
                <ActorAvatar assetKey={record.imageKey} name={record.name} />
                <div className="arpi-record-identity"><strong>{record.name}</strong><span>Before-after · target vs actual</span></div>
                <span className={`status-badge ${statusClass}`}><CheckCircle2 size={13} />{overallStatus}</span>
              </div>
              <div className="verification-grid">
                {metrics.map((metric) => {
                  const status = getVerifyStatus(metric.actual, metric.target, metric.lowerIsBetter);
                  const change = calculateChangePercentage(metric.before, metric.actual);
                  const metricStatusClass = status === "Target Tercapai" ? "status-success" : status === "Perlu Review" ? "status-warning" : "status-danger";
                  return (
                    <div className="verification-metric" key={metric.key}>
                      <div className="verification-metric-heading"><strong>{metric.label}</strong><span className={`status-badge ${metricStatusClass}`}>{status}</span></div>
                      <div className="verification-values">
                        <span><small>Before</small><strong>{formatMetric(metric.before, metric.unit)}</strong></span>
                        <span aria-hidden="true">→</span>
                        <span><small>After</small><strong>{formatMetric(metric.after, metric.unit)}</strong></span>
                      </div>
                      <div className="verification-target"><span>Target <strong>{formatMetric(metric.target, metric.unit)}</strong></span><span>Actual <strong>{formatMetric(metric.actual, metric.unit)}</strong></span></div>
                      <small className="verification-change">Perubahan {change > 0 ? "+" : ""}{change}%</small>
                    </div>
                  );
                })}
              </div>
              <div className="verification-footnote"><ClipboardCheck size={14} /> Pengukuran contoh untuk evaluasi prototipe.</div>
              <div className="arpi-panel-actions">
                <button className="admin-button" onClick={() => openEditor(record)} type="button"><Edit3 size={14} /> Input Result</button>
                <button className="admin-button primary" onClick={() => setValidated((current) => ({ ...current, [record.id]: true }))} type="button"><Check size={14} /> Validate</button>
              </div>
            </article>
          );
        })}
      </div>
      <AdminDialog open={Boolean(editingRecord)} onClose={() => setEditingRecord(null)} size="large" title={`Input Verify Result · ${editingRecord?.name ?? ""}`}>
        <form id="verify-form" onSubmit={saveResults}>
          <div className="verify-edit-list">
            {editMetrics.map((metric, index) => (
              <fieldset className="verify-edit-metric" key={metric.key}>
                <legend>{metric.label}</legend>
                <label className="admin-form-field">Before<input disabled value={metric.before} /></label>
                <label className="admin-form-field">After<input onChange={(event) => setEditMetrics((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, after: Number(event.target.value) } : item))} type="number" value={metric.after} /></label>
                <label className="admin-form-field">Target<input onChange={(event) => setEditMetrics((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, target: Number(event.target.value) } : item))} type="number" value={metric.target} /></label>
                <label className="admin-form-field">Actual<input onChange={(event) => setEditMetrics((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, actual: Number(event.target.value) } : item))} type="number" value={metric.actual} /></label>
              </fieldset>
            ))}
          </div>
          <div className="admin-dialog-footer"><button className="admin-button" onClick={() => setEditingRecord(null)} type="button">Batal</button><button className="admin-button primary" type="submit">Simpan hasil</button></div>
        </form>
      </AdminDialog>
    </section>
  );
}

export default VerifyPanel;
