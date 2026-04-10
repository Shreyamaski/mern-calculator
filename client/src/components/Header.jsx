export function Header({ theme, onThemeToggle }) {
  return (
    <header className="header-card">
      <div>
        <p className="logo-mark">NC</p>
        <p className="logo-text">NeonCalc</p>
      </div>

      <button type="button" className="theme-switch" onClick={onThemeToggle}>
        <span>{theme === "dark" ? "Dark Glow" : "Sunset Pop"}</span>
        <span className="theme-switch-track">
          <span className="theme-switch-thumb" />
        </span>
      </button>
    </header>
  );
}
