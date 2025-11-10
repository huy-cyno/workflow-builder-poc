import React from 'react';
import './Sidebar.css';

function Sidebar({ onAddNode }) {
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
    },
    {
      type: 'action',
      icon: '⚡',
      title: 'Action',
      description: 'Execute action'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Add Steps</h3>
      </div>

      <div className="sidebar-content">
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

      <div className="sidebar-footer">
        <p>Click to add nodes to canvas</p>
      </div>
    </div>
  );
}

export default Sidebar;
