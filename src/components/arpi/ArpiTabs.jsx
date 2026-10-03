import { CheckCircle2 } from "lucide-react";
import "../../styles/arpi.css";

function ArpiTabs({ stages, activeStage, onStageChange }) {
  return (
    <nav className="arpi-tabs" aria-label="Panel tahapan ARPI">
      {stages.map((stage, index) => (
        <button
          aria-selected={activeStage === index}
          className={activeStage === index ? "is-active" : ""}
          key={stage.name}
          onClick={() => onStageChange(index)}
          role="tab"
          type="button"
        >
          {index < activeStage && <CheckCircle2 size={14} aria-hidden="true" />}
          {stage.name}
        </button>
      ))}
    </nav>
  );
}

export default ArpiTabs;