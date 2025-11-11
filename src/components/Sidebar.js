import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ onAddNode }) {
  const [expandedSection, setExpandedSection] = useState('actions');

  const nodeTemplates = [
    {
      type: 'level',
      icon: '💾',
      title: 'Level Step',
      description: 'Verification level'
    },
    {
      type: 'condition',
      icon: '🔀',
      title: 'Condition',
      description: 'Branch logic'
    }
  ];

  const actionPresets = [
    {
      id: 'approval',
      icon: '✅',
      title: 'Approval Flow',
      description: 'Approve & notify',
      data: {
        label: 'Approval Actions',
        actions: [
          { type: 'approve', title: 'Auto-approve user', value: '' },
          { type: 'sendEmail', title: 'Send approval email', value: 'user@example.com' },
          { type: 'notify', title: 'Push notification', value: 'Approved!' },
          { type: 'log', title: 'Log approval', value: 'User approved' }
        ]
      }
    },
    {
      id: 'rejection',
      icon: '❌',
      title: 'Rejection Flow',
      description: 'Reject & notify',
      data: {
        label: 'Rejection Actions',
        actions: [
          { type: 'reject', title: 'Reject application', value: 'Insufficient documents' },
          { type: 'sendEmail', title: 'Send rejection email', value: 'user@example.com' },
          { type: 'notify', title: 'Push notification', value: 'Application rejected' },
          { type: 'log', title: 'Log rejection', value: 'User rejected' }
        ]
      }
    },
    {
      id: 'manual-review',
      icon: '📋',
      title: 'Manual Review',
      description: 'Create case & alert',
      data: {
        label: 'Manual Review Actions',
        actions: [
          { type: 'createCase', title: 'Create review case', value: 'Compliance Team' },
          { type: 'sendEmail', title: 'Alert team', value: 'compliance@company.com' },
          { type: 'log', title: 'Log case creation', value: 'Manual review initiated' }
        ]
      }
    },
    {
      id: 'webhook',
      icon: '🔗',
      title: 'Webhook & API',
      description: 'External integrations',
      data: {
        label: 'Integration Actions',
        actions: [
          { type: 'sendWebhook', title: 'Send webhook', value: 'https://api.partner.com/webhook' },
          { type: 'callAPI', title: 'Call external API', value: 'POST /api/sync' },
          { type: 'log', title: 'Log API call', value: 'External API called' }
        ]
      }
    },
    {
      id: 'notification',
      icon: '📧',
      title: 'Notifications',
      description: 'Email, SMS, push',
      data: {
        label: 'Notification Actions',
        actions: [
          { type: 'sendEmail', title: 'Send email', value: 'user@example.com' },
          { type: 'sendSMS', title: 'Send SMS', value: '+1234567890' },
          { type: 'notify', title: 'Push notification', value: 'Important update!' }
        ]
      }
    },
    {
      id: 'database',
      icon: '💾',
      title: 'Database Update',
      description: 'Update records',
      data: {
        label: 'Database Actions',
        actions: [
          { type: 'updateDatabase', title: 'Update user status', value: 'status: verified' },
          { type: 'log', title: 'Log database update', value: 'User record updated' }
        ]
      }
    }
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Add Steps</h3>
      </div>

      <div className="sidebar-content">
        {/* Basic Nodes */}
        <div className="sidebar-section">
          <div className="section-header">
            <span>Basic Nodes</span>
          </div>
          {nodeTemplates.map((template) => (
            <div
              key={template.type}
              className="node-template"
              onClick={() => onAddNode(template.type)}
              title={`Add ${template.title}`}
            >
              <div className="template-icon">{template.icon}</div>
              <div className="template-info">
                <div className="template-title">{template.title}</div>
                <div className="template-description">{template.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Presets */}
        <div className="sidebar-section">
          <div
            className="section-header clickable"
            onClick={() => toggleSection('actions')}
          >
            <span>Action Presets</span>
            <span className="toggle-icon">{expandedSection === 'actions' ? '▼' : '▶'}</span>
          </div>
          {expandedSection === 'actions' && (
            <div className="section-content">
              {actionPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="node-template action-preset"
                  onClick={() => onAddNode('action', preset.data)}
                  title={`Add ${preset.title}`}
                >
                  <div className="template-icon">{preset.icon}</div>
                  <div className="template-info">
                    <div className="template-title">{preset.title}</div>
                    <div className="template-description">{preset.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <p>Click to add nodes to canvas</p>
      </div>
    </div>
  );
}

export default Sidebar;
