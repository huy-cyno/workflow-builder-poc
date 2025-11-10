# CLAUDE.md - AI Assistant Context Document

> This document maintains context for AI assistants working on this project. Read this first before making any changes.

## 📋 Project Overview

**Project Name:** Workflow Builder PoC
**Purpose:** React Flow-based workflow builder that replicates Sumsub's cockpit.sumsub.com interface
**Tech Stack:** React 18 + React Flow 11
**Created:** January 2025
**Status:** ✅ Working PoC - Ready for development

## 🎯 Project Goal

Create a visual workflow builder similar to Sumsub's verification workflow system where users can:
- Drag and drop nodes to create workflows
- Connect nodes to define process flow
- Save/load workflows as JSON
- Analyze workflow structure
- See visual representation of complex verification flows

## 🏗️ Architecture

### Core Concepts

1. **Nodes** - Visual blocks representing steps in a workflow
2. **Edges** - Connections between nodes showing flow direction
3. **Handles** - Connection points on nodes (input/output)
4. **Flow State** - Managed by React Flow hooks (`useNodesState`, `useEdgesState`)

### Node Types

#### 1. Level Node (`LevelNode.js`)
- **Purpose:** Represents a verification level/step
- **Visual:** Blue border with 💾 icon
- **Data Structure:**
  ```javascript
  {
    label: 'Level step 1',
    levelName: 'Collect particulars',
    levelType: 'Individuals', // or 'Companies'
    steps: ['APPLICANT_DATA', 'IDENTITY', 'SELFIE'],
    isStart: true // Shows "Start" badge
  }
  ```
- **Use Case:** Document collection, ID verification, selfie capture

#### 2. Condition Node (`ConditionNode.js`)
- **Purpose:** Branch logic based on conditions
- **Visual:** Orange border with 🔀 icon
- **Data Structure:**
  ```javascript
  {
    label: 'Condition 1',
    branches: [
      {
        name: 'Branch 1',
        condition: 'Nationality equals Singapore'
      }
    ]
  }
  ```
- **Features:** Multiple branches + "Else" branch
- **Handles:** Each branch has its own output handle (`branch-0`, `branch-1`, `else`)

#### 3. Action Node (`ActionNode.js`)
- **Purpose:** Execute actions (create case, send webhook, etc)
- **Visual:** Green border with ⚡ icon
- **Data Structure:**
  ```javascript
  {
    label: 'Action 1',
    actions: [
      {
        type: 'createCase',
        title: 'Create case',
        value: 'Case details here'
      }
    ]
  }
  ```

## 📊 Data Flow & State Management

### How Data is Saved

```javascript
// When user clicks "Save"
const workflow = {
  nodes: [
    {
      id: 'level-1234567890',
      type: 'level',
      position: { x: 50, y: 150 },
      data: { /* node-specific data */ }
    }
  ],
  edges: [
    {
      id: 'reactflow__edge-level1-condition2',
      source: 'level-1',      // ⬅️ Node that comes BEFORE
      target: 'condition-2',  // ⬅️ Node that comes AFTER
      sourceHandle: 'next',   // ⬅️ Which output
      targetHandle: 'prev',   // ⬅️ Which input
      type: 'smoothstep',
      style: { stroke: '#6D9DFF', strokeWidth: 2 }
    }
  ],
  metadata: {
    version: 1,
    createdAt: '2025-01-10T12:00:00.000Z'
  }
};
```

### Understanding Connections

**Key Insight:** The `edges` array tells you everything about connections.

```javascript
// Finding what comes AFTER a node
const nextNodes = edges
  .filter(e => e.source === nodeId)
  .map(e => e.target);

// Finding what comes BEFORE a node
const prevNodes = edges
  .filter(e => e.target === nodeId)
  .map(e => e.source);

// Example: If edge is { source: 'A', target: 'B' }
// Flow is: A → B
// A comes before B
// B comes after A
```

## 🗂️ File Structure & Responsibilities

```
src/
├── App.js                    # Main orchestrator
│   ├── Manages nodes/edges state
│   ├── Handles connections (onConnect)
│   ├── Add/delete nodes
│   ├── Save/load/analyze workflows
│   └── Defines node types
│
├── components/
│   ├── Toolbar.js           # Top bar with Save/Load/Analyze/Delete
│   └── Sidebar.js           # Left panel with node templates
│
└── nodes/
    ├── LevelNode.js         # Verification level step
    ├── ConditionNode.js     # Conditional branching
    └── ActionNode.js        # Actions/triggers
```

## 🔧 How to Extend

### Adding a New Node Type

1. **Create node component** (`src/nodes/NewNode.js`):
```javascript
import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

function NewNode({ data, selected }) {
  return (
    <div className={`custom-node new-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />

      <div className="node-header">
        <span className="node-icon">🆕</span>
        <span className="node-title">{data.label}</span>
      </div>

      {/* Your custom content */}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default NewNode;
```

2. **Register in App.js**:
```javascript
import NewNode from './nodes/NewNode';

const nodeTypes = {
  level: LevelNode,
  condition: ConditionNode,
  action: ActionNode,
  newnode: NewNode, // ⬅️ Add here
};
```

3. **Add to sidebar** (`components/Sidebar.js`):
```javascript
const nodeTemplates = [
  // ... existing nodes
  {
    type: 'newnode',
    icon: '🆕',
    title: 'New Node',
    description: 'Does something new'
  }
];
```

4. **Define default data** (in `App.js`):
```javascript
function getDefaultNodeData(type) {
  switch (type) {
    // ... existing cases
    case 'newnode':
      return {
        label: 'New Node',
        customField: 'default value'
      };
  }
}
```

### Adding Multiple Handles to a Node

```javascript
// Output handles (sources)
<Handle
  type="source"
  position={Position.Right}
  id="handle-1"  // ⬅️ Unique ID
  style={{ top: 20 }}
/>
<Handle
  type="source"
  position={Position.Right}
  id="handle-2"
  style={{ top: 60 }}
/>

// Input handles (targets)
<Handle
  type="target"
  position={Position.Left}
  id="input-1"
  style={{ top: 20 }}
/>
```

### Customizing Edge Styles

In `App.js` > `onConnect`:
```javascript
const onConnect = useCallback((params) => {
  const edge = {
    ...params,
    type: 'smoothstep', // or 'straight', 'step', 'bezier'
    animated: true,     // Makes edge animated
    label: 'custom label',
    style: {
      stroke: '#ff0000',
      strokeWidth: 3,
      strokeDasharray: '5,5' // Dashed line
    },
    markerEnd: {
      type: 'arrowclosed',
      color: '#ff0000'
    }
  };
  setEdges((eds) => addEdge(edge, eds));
}, [setEdges]);
```

## 🔍 Workflow Analysis Utilities

### Helper Functions (can add to App.js or separate utils file)

```javascript
// Find start node (no incoming edges)
function getStartNode(nodes, edges) {
  return nodes.find(n => !edges.some(e => e.target === n.id));
}

// Find end nodes (no outgoing edges)
function getEndNodes(nodes, edges) {
  return nodes.filter(n => !edges.some(e => e.source === n.id));
}

// Get all paths from start to end
function getAllPaths(nodes, edges) {
  const startNode = getStartNode(nodes, edges);
  const paths = [];

  function traverse(nodeId, path) {
    path.push(nodeId);
    const nextEdges = edges.filter(e => e.source === nodeId);

    if (nextEdges.length === 0) {
      paths.push([...path]);
    } else {
      nextEdges.forEach(edge => traverse(edge.target, [...path]));
    }
  }

  if (startNode) traverse(startNode.id, []);
  return paths;
}

// Check if nodeA comes before nodeB
function isBefore(nodeAId, nodeBId, edges) {
  const visited = new Set();

  function search(currentId) {
    if (currentId === nodeBId) return true;
    if (visited.has(currentId)) return false;
    visited.add(currentId);

    const nextEdges = edges.filter(e => e.source === currentId);
    return nextEdges.some(e => search(e.target));
  }

  return search(nodeAId);
}

// Build connection map for quick lookups
function buildConnectionMap(nodes, edges) {
  const map = {};

  nodes.forEach(node => {
    const incoming = edges.filter(e => e.target === node.id);
    const outgoing = edges.filter(e => e.source === node.id);

    map[node.id] = {
      node,
      incoming: incoming.map(e => e.source),
      outgoing: outgoing.map(e => e.target),
      incomingEdges: incoming,
      outgoingEdges: outgoing
    };
  });

  return map;
}
```

## 🎨 Styling Guide

### Color Scheme
```css
/* Node Types */
Level Node:     #6D9DFF (Blue)
Condition Node: #FFB648 (Orange)
Action Node:    #68CD86 (Green)

/* UI Elements */
Background:     #fafafa
Borders:        #e0e0e0
Selected:       #6D9DFF
Text Primary:   #2d3748
Text Secondary: #666
```

### Important CSS Classes
- `.custom-node` - Base node styling
- `.custom-node.selected` - Selected state
- `.start-badge` - "Start" indicator
- `.node-handle` - Connection points

## 🚀 Development Workflow

### Running the App
```bash
cd workflow-builder-poc
npm install
npm start
```

### Testing Changes
1. Add a node from sidebar
2. Connect nodes by dragging handles
3. Click "Analyze" to see structure in console
4. Click "Save" to export JSON
5. Reload page and click "Load" to import

### Debugging Tips
```javascript
// Log current state
console.log('Nodes:', nodes);
console.log('Edges:', edges);

// Log on every change
useEffect(() => {
  console.log('State updated:', { nodes, edges });
}, [nodes, edges]);

// Visualize in React DevTools
// Component: ReactFlowProvider > WorkflowBuilder
// Props will show all nodes/edges
```

## 📝 TODOs & Future Enhancements

### High Priority
- [ ] Node editing panel (click node to edit properties)
- [ ] Validation (prevent cycles, ensure connected flow)
- [ ] Undo/Redo functionality
- [ ] Zoom to fit button
- [ ] Export as image/PNG

### Medium Priority
- [ ] Drag nodes from sidebar (currently click to add)
- [ ] Multiple condition branches (currently 1 + else)
- [ ] Copy/paste nodes
- [ ] Node search/filter
- [ ] Keyboard shortcuts (Del to delete, Ctrl+S to save)

### Nice to Have
- [ ] Real-time collaboration
- [ ] Version history
- [ ] Templates/presets
- [ ] Auto-layout algorithm
- [ ] Mini tutorial/onboarding

### Backend Integration
```javascript
// Example API integration
async function saveToBackend(workflow) {
  const response = await fetch('https://api.example.com/workflows', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(workflow)
  });

  return response.json();
}

// In App.js onSave:
const onSave = useCallback(async () => {
  const workflow = { nodes, edges, metadata: {...} };

  try {
    const result = await saveToBackend(workflow);
    console.log('Saved to backend:', result);
    alert(`Workflow saved! ID: ${result.id}`);
  } catch (error) {
    console.error('Save failed:', error);
    alert('Failed to save workflow');
  }
}, [nodes, edges]);
```

## 🐛 Known Issues & Limitations

1. **No validation** - Users can create invalid flows (cycles, disconnected nodes)
2. **No auto-save** - Changes lost on page refresh
3. **Fixed node positions** - Random placement when adding nodes
4. **No node editing** - Can't edit node properties after creation
5. **Simple JSON export** - No version control or diff
6. **No authentication** - Anyone can load any workflow

## 💡 Design Decisions & Why

### Why React Flow?
- **Mature library** with good documentation
- **Built-in features**: minimap, controls, zoom/pan
- **Customizable** nodes and edges
- **Performance** optimized for large graphs
- **Active community** and frequent updates

### Why Separate Node Components?
- **Maintainability** - Each node type is self-contained
- **Reusability** - Easy to duplicate and modify
- **Testing** - Can test nodes independently
- **Scalability** - Add new types without touching others

### Why JSON for Save/Load?
- **Human readable** - Easy to debug
- **Version control friendly** - Can diff in git
- **Portable** - Works across systems
- **API ready** - Can send directly to backend

### Why Hooks for State?
- **React Flow requirement** - `useNodesState` and `useEdgesState` are official
- **Automatic updates** - React Flow handles node dragging, etc.
- **Optimized** - Only re-renders what changed

## 🔗 Related Resources

### React Flow Documentation
- Main docs: https://reactflow.dev/
- Examples: https://reactflow.dev/examples
- API Reference: https://reactflow.dev/api-reference

### Sumsub Reference
- Original interface: https://cockpit.sumsub.com (requires login)
- Used Vue Flow (Vue.js version of React Flow)

### Similar Projects
- Zapier workflow builder
- n8n (open source workflow automation)
- Node-RED (visual programming)

## 🧪 Example Workflows

### Simple Linear Flow
```json
{
  "nodes": [
    { "id": "1", "type": "level", "data": { "label": "Collect Data" } },
    { "id": "2", "type": "level", "data": { "label": "Verify ID" } },
    { "id": "3", "type": "action", "data": { "label": "Approve" } }
  ],
  "edges": [
    { "source": "1", "target": "2" },
    { "source": "2", "target": "3" }
  ]
}
```

### Conditional Flow
```json
{
  "nodes": [
    { "id": "1", "type": "level", "data": { "label": "Check Age" } },
    { "id": "2", "type": "condition", "data": {
      "label": "Age >= 18?",
      "branches": [{ "name": "Yes", "condition": "age >= 18" }]
    }},
    { "id": "3", "type": "action", "data": { "label": "Approve" } },
    { "id": "4", "type": "action", "data": { "label": "Reject" } }
  ],
  "edges": [
    { "source": "1", "target": "2" },
    { "source": "2", "target": "3", "sourceHandle": "branch-0" },
    { "source": "2", "target": "4", "sourceHandle": "else" }
  ]
}
```

## 📞 Getting Help

If you need to understand something:

1. **Check this file first** - Most answers are here
2. **Read the code comments** - Key functions are documented
3. **Console.log everything** - Add logs liberally
4. **React DevTools** - Inspect component state
5. **React Flow docs** - Check official documentation

## 🎓 Key Learnings from Original Conversation

### User's Original Question
User wanted to understand:
1. How Vue Flow (used by Sumsub) outputs config JSON
2. How to extract connection information (what connects to what)
3. How to know what comes before/after in the flow

### Important Insights
- **Edges = Connections**: The `edges` array is the key to understanding flow
- **source = before, target = after**: This is how direction is determined
- **Handles enable branching**: Multiple source handles = multiple outputs
- **State is just JSON**: Everything serializes to simple objects

### Why This PoC Was Built
- Demonstrate React Flow usage
- Show practical implementation
- Provide working example to learn from
- Replicate Sumsub's interface as learning exercise

---

## 📌 Final Notes

**Remember:** This is a PoC (Proof of Concept). It demonstrates core functionality but lacks:
- Production error handling
- Comprehensive validation
- Performance optimization for large flows
- Security considerations
- Accessibility features

**Before making it production-ready:**
1. Add proper error boundaries
2. Implement validation logic
3. Add loading states
4. Handle edge cases
5. Add tests
6. Implement authentication
7. Add proper state persistence

**Last Updated:** January 2025
**Next Review:** When adding major features

---

*This document should be updated whenever significant changes are made to the project.*
