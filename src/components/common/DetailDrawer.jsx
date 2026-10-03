import { useEffect } from "react";
import { X } from "lucide-react";

function DetailDrawer({ open, title, onClose, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="detail-drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside aria-label={title} aria-modal="true" className="detail-drawer" role="dialog">
        <header className="detail-drawer-header"><h2>{title}</h2><button aria-label="Tutup detail" className="icon-button" onClick={onClose} type="button"><X size={18} /></button></header>
        <div className="detail-drawer-content">{children}</div>
        {footer && <footer className="detail-drawer-footer">{footer}</footer>}
      </aside>
    </div>
  );
}

export default DetailDrawer;