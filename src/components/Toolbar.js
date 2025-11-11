import React from 'react';
import './Toolbar.css';

function Toolbar({ onSave, onLoad, onAnalyze, onDelete, onTestExecute, selectedNode }) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1>Workflow Builder</h1>
        <span className="badge">PoC</span>
      </div>

      <div className="toolbar-right">
        <button className="btn btn-primary" onClick={onTestExecute}>
          🚀 Test Execute
        </button>

        <button className="btn btn-secondary" onClick={onAnalyze}>
          🔍 Analyze
        </button>

        <button className="btn btn-secondary" onClick={onSave}>
          💾 Save
        </button>

        <label className="btn btn-secondary">
          📂 Load
          <input
            type="file"
            accept=".json"
            onChange={onLoad}
            style={{ display: 'none' }}
          />
        </label>

        {selectedNode && (
          <button className="btn btn-danger" onClick={onDelete}>
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default Toolbar;
