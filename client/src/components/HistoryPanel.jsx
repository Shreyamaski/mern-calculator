export function HistoryPanel({ history, loading, error, onReuse, onDelete, onClearAll }) {
  return (
    <aside className="history-card">
      <div className="history-header">
        <div>
          <p className="section-tag">MongoDB History</p>
          <h2>Recent calculations</h2>
        </div>

        <button type="button" className="ghost-button" onClick={onClearAll}>
          Clear all
        </button>
      </div>

      {loading ? <p className="status-text">Loading history...</p> : null}
      {error ? <p className="status-text error-text">{error}</p> : null}
      {!loading && !history.length ? (
        <p className="status-text">No calculations saved yet. Press `=` to store one.</p>
      ) : null}

      <div className="history-list">
        {history.map((item) => (
          <article key={item._id} className="history-item">
            <button type="button" className="history-reuse" onClick={() => onReuse(item.expression)}>
              <span>{item.expression}</span>
              <strong>= {item.result}</strong>
            </button>

            <button
              type="button"
              className="history-delete"
              onClick={() => onDelete(item._id)}
              aria-label={`Delete ${item.expression}`}
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </aside>
  );
}
