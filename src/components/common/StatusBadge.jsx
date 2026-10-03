const statusClasses = {
  active: "status-success",
  completed: "status-success",
  Selesai: "status-success",
  Aktif: "status-success",
  "Target Tercapai": "status-success",
  Berjalan: "status-info",
  Review: "status-warning",
  "Perlu Review": "status-warning",
  Pending: "status-warning",
  Archived: "status-neutral",
  Diarsipkan: "status-neutral",
  "Belum Mulai": "status-neutral",
  "Di Bawah Target": "status-danger",
  "Not Suitable": "status-danger",
};

function StatusBadge({ status, children }) {
  const label = children ?? status;
  return <span className={`admin-status ${statusClasses[status] ?? "status-neutral"}`}>{label}</span>;
}

export default StatusBadge;