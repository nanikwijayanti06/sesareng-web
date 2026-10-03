import { useEffect } from "react";
import { X } from "lucide-react";

function AdminDialog({ open, title, onClose, children, footer, size = "medium" }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="admin-dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="admin-dialog-title" aria-modal="true" className={`admin-dialog admin-dialog-${size}`} role="dialog">
        <header className="admin-dialog-header">
          <h2 id="admin-dialog-title">{title}</h2>
          <button aria-label="Tutup dialog" className="icon-button" onClick={onClose} type="button"><X size={18} /></button>
        </header>
        <div className="admin-dialog-content">{children}</div>
        {footer && <footer className="admin-dialog-footer">{footer}</footer>}
      </section>
    </div>
  );
}

export default AdminDialog;