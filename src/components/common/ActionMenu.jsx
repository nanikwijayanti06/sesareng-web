import { useRef } from "react";
import { Ellipsis } from "lucide-react";

function ActionMenu({ actions, label = "Aksi" }) {
  const menuRef = useRef(null);

  return (
    <details className="action-menu" ref={menuRef}>
      <summary aria-label={label} title={label}><Ellipsis size={17} /></summary>
      <div className="action-menu-items">
        {actions.map(({ label: actionLabel, onClick, disabled = false, danger = false }) => (
          <button
            className={danger ? "is-danger" : ""}
            disabled={disabled}
            key={actionLabel}
            onClick={() => {
              menuRef.current.open = false;
              onClick();
            }}
            type="button"
          >
            {actionLabel}
          </button>
        ))}
      </div>
    </details>
  );
}

export default ActionMenu;