import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

function LevelNode({ data, selected }) {
  return (
    <div className={`custom-node level-node ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="node-handle"
      />

      {data.isStart && (
        <div className="start-badge">
          ▶ Start
        </div>
      )}

      <div className="node-header">
        <span className="node-icon">💾</span>
        <span className="node-title">{data.label}</span>
      </div>

      <div className="level-type">
        <span className="level-icon">👤</span>
        <span>{data.levelType}</span>
      </div>

      <div className="level-name">{data.levelName}</div>

      <div className="level-steps">
        {data.steps.map((step, idx) => (
          <span key={idx} className="step-badge" title={step}>
            📄
          </span>
        ))}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="node-handle"
      />
    </div>
  );
}

export default LevelNode;
