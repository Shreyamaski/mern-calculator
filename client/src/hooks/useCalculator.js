import { useState } from "react";

import { evaluateMathExpression, isOperator, sanitizeExpression } from "../utils/calculator.js";

export function useCalculator() {
  const [expression, setExpression] = useState("");
  const [preview, setPreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const updatePreview = (nextExpression) => {
    const sanitized = sanitizeExpression(nextExpression);

    if (!sanitized) {
      setPreview("");
      setErrorMessage("");
      return;
    }

    try {
      const previewValue = evaluateMathExpression(sanitized);
      setPreview(previewValue);
      setErrorMessage("");
    } catch (error) {
      setPreview("");
      setErrorMessage(error.message === "INCOMPLETE_EXPRESSION" ? "" : error.message);
    }
  };

  const appendValue = (value) => {
    setExpression((currentExpression) => {
      const lastCharacter = currentExpression.slice(-1);
      let nextExpression = currentExpression;

      if (value === ".") {
        if (!currentExpression || isOperator(lastCharacter)) {
          nextExpression = `${currentExpression}0.`;
          updatePreview(nextExpression);
          return nextExpression;
        }

        const currentNumber = currentExpression.split(/[+\-*/]/).pop();
        if (currentNumber.includes(".")) {
          return currentExpression;
        }
      }

      if (isOperator(value)) {
        if (!currentExpression && value !== "-") {
          return currentExpression;
        }

        if (isOperator(lastCharacter)) {
          nextExpression = `${currentExpression.slice(0, -1)}${value}`;
          updatePreview(nextExpression);
          return nextExpression;
        }
      }

      nextExpression = `${currentExpression}${value}`;
      updatePreview(nextExpression);
      return nextExpression;
    });
  };

  const deleteLast = () => {
    setExpression((currentExpression) => {
      const nextExpression = currentExpression.slice(0, -1);
      updatePreview(nextExpression);
      return nextExpression;
    });
  };

  const clearAll = () => {
    setExpression("");
    setPreview("");
    setErrorMessage("");
  };

  const evaluateExpression = () => {
    const sanitized = sanitizeExpression(expression);

    if (!sanitized) {
      setErrorMessage("Enter a calculation first.");
      return { ok: false };
    }

    try {
      const value = evaluateMathExpression(sanitized);
      setExpression(String(value));
      setPreview(String(value));
      setErrorMessage("");

      return {
        ok: true,
        expression: sanitized,
        value: String(value)
      };
    } catch (error) {
      setErrorMessage(error.message === "INCOMPLETE_EXPRESSION" ? "Complete the expression before pressing equals." : error.message);
      return { ok: false };
    }
  };

  const reuseCalculation = (savedExpression) => {
    setExpression(savedExpression);
    updatePreview(savedExpression);
  };

  return {
    expression,
    preview,
    errorMessage,
    appendValue,
    deleteLast,
    clearAll,
    evaluateExpression,
    reuseCalculation
  };
}
