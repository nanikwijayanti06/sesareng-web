import { ArrowUpRight } from "lucide-react";
import "../../styles/arpi.css";

function InterventionCard({ title, eyebrow, action, onAction, className = "", children }) {
  return (
    <article className={`arpi-card ${className}`.trim()}>
      <div className="arpi-card-heading">
        <div>
          {eyebrow && <p className="arpi-card-eyebrow">{eyebrow}</p>}
          <h3>{title}</h3>
        </div>
        {action && (
          <button className="arpi-card-action" onClick={onAction} type="button">
            {action}<ArrowUpRight size={15} />
          </button>
        )}
      </div>
      {children}
    </article>
  );
}

export default InterventionCard;