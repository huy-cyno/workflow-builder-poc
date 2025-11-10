import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

function ActionNode({ data, selected }) {
  return (
    <div className={`custom-node action-node ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="node-handle"
      />

      <div className="node-header action-header">
        <span className="node-icon">⚡</span>
        <span className="node-title">{data.label}</span>
      </div>

      <div className="action-list">
        {data.actions.map((action, idx) => (
          <div key={idx} className="action-item">
            <div className="action-title">{action.title}</div>
            {action.value && (
              <div className="action-value">{action.value}</div>
            )}
          </div>
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

export default ActionNode;
