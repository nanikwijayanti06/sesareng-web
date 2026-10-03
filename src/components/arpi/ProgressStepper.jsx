import { Check } from "lucide-react";
import "../../styles/arpi.css";

function ProgressStepper({ stages, activeStage, onStageChange }) {
  return (
    <nav className="arpi-stepper" aria-label="Progress ARPI">
      {stages.map((stage, index) => (
        <button
          aria-current={activeStage === index ? "step" : undefined}
          className={`arpi-step${activeStage === index ? " is-current" : ""}${index < activeStage ? " is-complete" : ""}`}
          key={stage.name}
          onClick={() => onStageChange(index)}
          type="button"
        >
          <span className="arpi-step-marker">{index < activeStage ? <Check size={14} /> : index + 1}</span>
          <span>{stage.name}</span>
        </button>
      ))}
    </nav>
  );
}

export default ProgressStepper;