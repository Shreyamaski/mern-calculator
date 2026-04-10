import { useEffect, useMemo, useState } from "react";

import { CalculatorPanel } from "./components/CalculatorPanel.jsx";
import { HistoryPanel } from "./components/HistoryPanel.jsx";
import { Header } from "./components/Header.jsx";
import { useCalculator } from "./hooks/useCalculator.js";
import {
  clearCalculations,
  createCalculation,
  deleteCalculation,
  fetchCalculations
} from "./services/calculationService.js";
import "./styles/app.css";

const themePalette = {
  dark: {
    accent: "#63f3ff"
  },
  sunset: {
    accent: "#ffd166"
  }
};

function App() {
  const [theme, setTheme] = useState("dark");
  const [history, setHistory] = useState([]);
  const [historyStatus, setHistoryStatus] = useState({
    loading: true,
    error: ""
  });

  const {
    expression,
    preview,
    errorMessage,
    appendValue,
    deleteLast,
    clearAll,
    evaluateExpression,
    reuseCalculation
  } = useCalculator();

  const accentColor = useMemo(() => themePalette[theme].accent, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setHistoryStatus({ loading: true, error: "" });
        const data = await fetchCalculations();
        setHistory(data);
        setHistoryStatus({ loading: false, error: "" });
      } catch (error) {
        setHistoryStatus({
          loading: false,
          error: error.response?.data?.message || "Could not load history."
        });
      }
    };

    loadHistory();
  }, []);

  const handleCalculate = async () => {
    const result = evaluateExpression();

    if (!result.ok) {
      return;
    }

    try {
      const savedCalculation = await createCalculation({
        expression: result.expression,
        result: result.value,
        theme
      });

      setHistoryStatus((currentStatus) => ({ ...currentStatus, error: "" }));
      setHistory((currentHistory) => [savedCalculation, ...currentHistory].slice(0, 20));
    } catch (error) {
      setHistoryStatus((currentStatus) => ({
        ...currentStatus,
        error: error.response?.data?.message || "Calculation saved locally, but history could not be updated."
      }));
    }
  };

  const handleDeleteHistoryItem = async (id) => {
    try {
      await deleteCalculation(id);
      setHistoryStatus((currentStatus) => ({ ...currentStatus, error: "" }));
      setHistory((currentHistory) => currentHistory.filter((item) => item._id !== id));
    } catch (error) {
      setHistoryStatus((currentStatus) => ({
        ...currentStatus,
        error: error.response?.data?.message || "Could not delete that history item."
      }));
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearCalculations();
      setHistoryStatus((currentStatus) => ({ ...currentStatus, error: "" }));
      setHistory([]);
    } catch (error) {
      setHistoryStatus((currentStatus) => ({
        ...currentStatus,
        error: error.response?.data?.message || "Could not clear history."
      }));
    }
  };

  return (
    <div className="app-shell" style={{ "--accent-color": accentColor }}>
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <main className="app-layout">
        <section className="hero-panel">
          <Header
            theme={theme}
            onThemeToggle={() =>
              setTheme((currentTheme) => (currentTheme === "dark" ? "sunset" : "dark"))
            }
          />

          <div className="hero-copy">
            <p className="eyebrow">Responsive MERN Calculator</p>
            <h1>NeonCalc keeps the math simple and the interface polished.</h1>
            <p className="supporting-text">
              Solve quick calculations, keep a live history in MongoDB, and switch between moody dark and warm sunset themes.
            </p>
          </div>

          <CalculatorPanel
            expression={expression}
            preview={preview}
            errorMessage={errorMessage}
            onAppend={appendValue}
            onDelete={deleteLast}
            onClear={clearAll}
            onCalculate={handleCalculate}
          />
        </section>

        <HistoryPanel
          history={history}
          loading={historyStatus.loading}
          error={historyStatus.error}
          onReuse={reuseCalculation}
          onDelete={handleDeleteHistoryItem}
          onClearAll={handleClearHistory}
        />
      </main>
    </div>
  );
}

export default App;
