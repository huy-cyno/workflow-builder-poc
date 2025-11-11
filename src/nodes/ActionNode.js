import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

// Action type metadata
const ACTION_TYPES = {
  createCase: {
    icon: '📋',
    label: 'Create Case',
    color: '#FF6B9D'
  },
  sendWebhook: {
    icon: '🔗',
    label: 'Send Webhook',
    color: '#9B59B6'
  },
  sendEmail: {
    icon: '📧',
    label: 'Send Email',
    color: '#3498DB'
  },
  sendSMS: {
    icon: '💬',
    label: 'Send SMS',
    color: '#1ABC9C'
  },
  updateDatabase: {
    icon: '💾',
    label: 'Update Database',
    color: '#34495E'
  },
  callAPI: {
    icon: '🌐',
    label: 'Call API',
    color: '#E67E22'
  },
  approve: {
    icon: '✅',
    label: 'Approve',
    color: '#27AE60'
  },
  reject: {
    icon: '❌',
    label: 'Reject',
    color: '#E74C3C'
  },
  notify: {
    icon: '🔔',
    label: 'Send Notification',
    color: '#F39C12'
  },
  log: {
    icon: '📝',
    label: 'Log Event',
    color: '#95A5A6'
  }
};

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
        {data.actions.map((action, idx) => {
          const actionType = ACTION_TYPES[action.type] || {
            icon: '⚡',
            label: action.type,
            color: '#68CD86'
          };

          return (
            <div
              key={idx}
              className="action-item"
              style={{ borderLeftColor: actionType.color }}
            >
              <div className="action-header-row">
                <span className="action-icon">{actionType.icon}</span>
                <div className="action-title">{action.title || actionType.label}</div>
              </div>
              {action.value && (
                <div className="action-value">{action.value}</div>
              )}
              <div className="action-type-badge" style={{ backgroundColor: actionType.color }}>
                {actionType.label}
              </div>
            </div>
          );
        })}
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
