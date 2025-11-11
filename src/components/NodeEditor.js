import React, { useState, useEffect } from 'react';
import './NodeEditor.css';

function NodeEditor({ selectedNode, onUpdateNode, onClose }) {
  const [nodeData, setNodeData] = useState(null);

  useEffect(() => {
    if (selectedNode) {
      setNodeData({ ...selectedNode.data });
    }
  }, [selectedNode]);

  if (!selectedNode || !nodeData) {
    return null;
  }

  const handleSave = () => {
    onUpdateNode(selectedNode.id, nodeData);
    onClose();
  };

  const updateField = (field, value) => {
    setNodeData({ ...nodeData, [field]: value });
  };

  const updateBranch = (index, field, value) => {
    const newBranches = [...nodeData.branches];
    newBranches[index] = { ...newBranches[index], [field]: value };
    setNodeData({ ...nodeData, branches: newBranches });
  };

  const addBranch = () => {
    const newBranches = [...(nodeData.branches || [])];
    newBranches.push({
      name: `Branch ${newBranches.length + 1}`,
      condition: 'field equals value'
    });
    setNodeData({ ...nodeData, branches: newBranches });
  };

  const removeBranch = (index) => {
    const newBranches = nodeData.branches.filter((_, idx) => idx !== index);
    setNodeData({ ...nodeData, branches: newBranches });
  };

  const updateAction = (index, field, value) => {
    const newActions = [...nodeData.actions];
    newActions[index] = { ...newActions[index], [field]: value };
    setNodeData({ ...nodeData, actions: newActions });
  };

  const addAction = () => {
    const newActions = [...(nodeData.actions || [])];
    newActions.push({
      type: 'log',
      title: 'New action',
      value: ''
    });
    setNodeData({ ...nodeData, actions: newActions });
  };

  const removeAction = (index) => {
    const newActions = nodeData.actions.filter((_, idx) => idx !== index);
    setNodeData({ ...nodeData, actions: newActions });
  };

  const renderConditionEditor = () => (
    <div className="editor-section">
      <h4>Condition Branches</h4>
      <p className="editor-hint">
        Add conditions to branch the workflow. First matching condition wins.
      </p>

      {nodeData.branches?.map((branch, idx) => (
        <div key={idx} className="editor-item branch-item">
          <div className="item-header">
            <span className="item-label">Branch {idx + 1}</span>
            <button
              className="btn-remove"
              onClick={() => removeBranch(idx)}
              title="Remove branch"
            >
              ✕
            </button>
          </div>

          <label>
            <span className="label-text">Branch Name:</span>
            <input
              type="text"
              value={branch.name}
              onChange={(e) => updateBranch(idx, 'name', e.target.value)}
              placeholder="Branch name"
            />
          </label>

          <label>
            <span className="label-text">Condition:</span>
            <input
              type="text"
              value={branch.condition}
              onChange={(e) => updateBranch(idx, 'condition', e.target.value)}
              placeholder="age >= 18"
              className="condition-input"
            />
          </label>

          <div className="condition-help">
            Examples: <code>age &gt;= 18</code>, <code>country equals Singapore</code>
          </div>
        </div>
      ))}

      <button className="btn-add" onClick={addBranch}>
        + Add Branch
      </button>

      <div className="else-info">
        <strong>Else Branch:</strong> Automatically added when no conditions match
      </div>
    </div>
  );

  const renderActionEditor = () => (
    <div className="editor-section">
      <h4>Actions</h4>
      <p className="editor-hint">
        Add actions to execute when this node is reached.
      </p>

      {nodeData.actions?.map((action, idx) => (
        <div key={idx} className="editor-item action-item">
          <div className="item-header">
            <span className="item-label">Action {idx + 1}</span>
            <button
              className="btn-remove"
              onClick={() => removeAction(idx)}
              title="Remove action"
            >
              ✕
            </button>
          </div>

          <label>
            <span className="label-text">Type:</span>
            <select
              value={action.type}
              onChange={(e) => updateAction(idx, 'type', e.target.value)}
            >
              <option value="createCase">📋 Create Case</option>
              <option value="sendWebhook">🔗 Send Webhook</option>
              <option value="sendEmail">📧 Send Email</option>
              <option value="sendSMS">💬 Send SMS</option>
              <option value="updateDatabase">💾 Update Database</option>
              <option value="callAPI">🌐 Call API</option>
              <option value="approve">✅ Approve</option>
              <option value="reject">❌ Reject</option>
              <option value="notify">🔔 Send Notification</option>
              <option value="log">📝 Log Event</option>
            </select>
          </label>

          <label>
            <span className="label-text">Title:</span>
            <input
              type="text"
              value={action.title}
              onChange={(e) => updateAction(idx, 'title', e.target.value)}
              placeholder="Action title"
            />
          </label>

          <label>
            <span className="label-text">Value:</span>
            <input
              type="text"
              value={action.value}
              onChange={(e) => updateAction(idx, 'value', e.target.value)}
              placeholder="Action value"
            />
          </label>
        </div>
      ))}

      <button className="btn-add" onClick={addAction}>
        + Add Action
      </button>
    </div>
  );

  const renderLevelEditor = () => (
    <div className="editor-section">
      <h4>Level Configuration</h4>

      <label>
        <span className="label-text">Level Name:</span>
        <input
          type="text"
          value={nodeData.levelName}
          onChange={(e) => updateField('levelName', e.target.value)}
          placeholder="Level name"
        />
      </label>

      <label>
        <span className="label-text">Level Type:</span>
        <select
          value={nodeData.levelType}
          onChange={(e) => updateField('levelType', e.target.value)}
        >
          <option value="Individuals">👤 Individuals</option>
          <option value="Companies">🏢 Companies</option>
        </select>
      </label>

      <label>
        <span className="label-text">Steps:</span>
        <div className="steps-selector">
          {['APPLICANT_DATA', 'IDENTITY', 'SELFIE', 'PROOF_OF_ADDRESS', 'SOURCE_OF_FUNDS'].map(step => (
            <label key={step} className="checkbox-label">
              <input
                type="checkbox"
                checked={nodeData.steps?.includes(step)}
                onChange={(e) => {
                  const newSteps = e.target.checked
                    ? [...(nodeData.steps || []), step]
                    : nodeData.steps.filter(s => s !== step);
                  updateField('steps', newSteps);
                }}
              />
              <span>{step}</span>
            </label>
          ))}
        </div>
      </label>
    </div>
  );

  return (
    <div className="node-editor">
      <div className="editor-header">
        <div>
          <h3>Edit Node</h3>
          <span className="node-type-badge">{selectedNode.type}</span>
        </div>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>

      <div className="editor-content">
        <div className="editor-section">
          <label>
            <span className="label-text">Node Label:</span>
            <input
              type="text"
              value={nodeData.label}
              onChange={(e) => updateField('label', e.target.value)}
              placeholder="Node label"
            />
          </label>
        </div>

        {selectedNode.type === 'condition' && renderConditionEditor()}
        {selectedNode.type === 'action' && renderActionEditor()}
        {selectedNode.type === 'level' && renderLevelEditor()}
      </div>

      <div className="editor-footer">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

export default NodeEditor;
