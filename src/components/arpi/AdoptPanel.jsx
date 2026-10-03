import { useState } from "react";
import { calculateProgress } from "../../logic/monitoringLogic";
import ActorAvatar from "../common/ActorAvatar";
import "../../styles/arpi.css";

function AdoptPanel({ records, universities = [] }) {
  const [checklistOverrides, setChecklistOverrides] = useState({});
  const [clinicOverrides, setClinicOverrides] = useState({});

  const updateChecklist = (record, checklistId, completed) => {
    const currentChecklist = checklistOverrides[record.id] ?? record.adopt.checklist;
    setChecklistOverrides((current) => ({
      ...current,
      [record.id]: currentChecklist.map((item) => item.id === checklistId ? { ...item, completed } : item),
    }));
  };

  return (
    <section className="arpi-panel" role="tabpanel" aria-label="Adopt">
      <div className="arpi-panel-intro"><div><h2>AI Adoption Clinic</h2><p>Dukungan integrasi solusi ke workflow dan data operasional dengan pendampingan mentor.</p></div><span className="prototype-chip">Data simulasi/prototipe</span></div>
      <div className="arpi-record-list">
        {records.map((record) => {
          const checklist = checklistOverrides[record.id] ?? record.adopt.checklist;
          const clinic = { ...record.adopt, ...clinicOverrides[record.id] };
          const progress = calculateProgress(checklist);
          return (
            <article className="arpi-card arpi-adopt-card" key={record.id}>
              <div className="arpi-record-main">
                <ActorAvatar assetKey={record.imageKey} name={record.name} />
                <div className="arpi-record-identity"><strong>{record.name}</strong><span>{record.intervention.name}</span></div>
                <span className={`status-badge ${clinic.clinicStatus === "Selesai" ? "status-success" : clinic.clinicStatus === "Berjalan" ? "status-warning" : "status-neutral"}`}>{clinic.clinicStatus}</span>
              </div>
              <div className="arpi-adopt-meta">
                <div><span>Technology/provider support</span><strong>{clinic.provider?.name ?? "Belum ditetapkan"}</strong></div>
                <label><span>University / mentor</span><select aria-label={`Assign mentor ${record.name}`} onChange={(event) => setClinicOverrides((current) => ({ ...current, [record.id]: { ...current[record.id], mentor: universities.find((item) => item.id === event.target.value) ?? null } }))} value={clinic.mentor?.id ?? ""}><option value="">Pilih mentor</option>{universities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              </div>
              <div className="arpi-progress-block">
                <div><span>Implementation progress</span><strong>{progress}%</strong></div>
                <div className="arpi-progress-bar" role="progressbar" aria-label={`Progress implementasi ${record.name}`} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
              </div>
              <div className="arpi-checklist">
                {checklist.map((item) => (
                  <label key={item.id}>
                    <input checked={item.completed} onChange={(event) => updateChecklist(record, item.id, event.target.checked)} type="checkbox" />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
              <label className="arpi-clinic-status">Clinic status<select aria-label={`Status clinic ${record.name}`} onChange={(event) => setClinicOverrides((current) => ({ ...current, [record.id]: { ...current[record.id], clinicStatus: event.target.value } }))} value={clinic.clinicStatus}><option>Belum Mulai</option><option>Berjalan</option><option>Selesai</option></select></label>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default AdoptPanel;