import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

function ConditionNode({ data, selected }) {
  return (
    <div className={`custom-node condition-node ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="node-handle"
      />

      <div className="node-header condition-header">
        <span className="node-icon">🔀</span>
        <span className="node-title">{data.label}</span>
      </div>

      <div className="condition-branches">
        {data.branches.map((branch, idx) => (
          <div key={idx} className="condition-branch">
            <div className="branch-title">Branch {idx + 1}</div>
            <div className="branch-condition">{branch.condition}</div>
            <Handle
              type="source"
              position={Position.Right}
              id={`branch-${idx}`}
              className="node-handle branch-handle"
              style={{ top: `${30 + idx * 60}px` }}
            />
          </div>
        ))}

        <div className="condition-branch else-branch">
          <div className="branch-title">Else</div>
          <Handle
            type="source"
            position={Position.Right}
            id="else"
            className="node-handle else-handle"
            style={{ top: `${30 + data.branches.length * 60}px` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ConditionNode;
