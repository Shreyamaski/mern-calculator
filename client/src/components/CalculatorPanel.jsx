import { calculatorButtons } from "../data/buttons.js";
import { useButtonSound } from "../hooks/useButtonSound.js";

export function CalculatorPanel({
  expression,
  preview,
  errorMessage,
  onAppend,
  onDelete,
  onClear,
  onCalculate
}) {
  const playClick = useButtonSound();

  const handleButtonPress = (action, value) => {
    playClick();

    if (action === "append") {
      onAppend(value);
      return;
    }

    if (action === "delete") {
      onDelete();
      return;
    }

    if (action === "clear") {
      onClear();
      return;
    }

    if (action === "calculate") {
      onCalculate();
    }
  };

  return (
    <section className="calculator-card">
      <div className="display-panel">
        <p className="display-label">Current expression</p>
        <div className="display-expression">{expression || "0"}</div>
        <p className={`display-preview ${errorMessage ? "is-error" : ""}`}>
          {errorMessage || preview || "Result will appear here"}
        </p>
      </div>

      <div className="calculator-grid">
        {calculatorButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            className={`calc-button ${button.variant || ""} ${button.wide ? "wide" : ""}`}
            onClick={() => handleButtonPress(button.action, button.value)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </section>
  );
}
