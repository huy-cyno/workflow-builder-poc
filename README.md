# Workflow Builder PoC

A visual workflow builder with **three implementations**: React Flow, Angular + Drawflow, and Angular wrapping React.

## 🎯 Three Implementations Available

This project provides three different approaches to building a workflow editor:

1. **React + React Flow** (`src/`) - Main implementation with full features
2. **Angular + Drawflow** (`angular-drawflow/`) - Native Angular implementation
3. **Angular React Wrapper** (`angular-react-wrapper/`) - Hybrid approach embedding React in Angular

📖 **See [ANGULAR_IMPLEMENTATIONS.md](ANGULAR_IMPLEMENTATIONS.md)** for detailed comparison and guides.

## Features

- ✅ Custom node types (Level, Condition, Action)
- ✅ Visual node handles for connections
- ✅ **Node Editor Panel** - Edit node properties with slide-in panel
- ✅ Sidebar for adding nodes with action presets
- ✅ Save/Load workflow as JSON
- ✅ Workflow analysis (shows connections in console)
- ✅ MiniMap and Controls
- ✅ Modern, polished UI with consistent button styling
- ✅ Selected node highlighting
- ✅ Start badge for first node
- ✅ Double-click nodes to edit properties
- ✅ Dynamic branch and action management

## Quick Start

### React Flow (Main)
```bash
npm install
npm start
# Opens at http://localhost:3000
```

### Angular Drawflow
```bash
cd angular-drawflow
npm install
npm start
# Opens at http://localhost:4200
```

### Angular React Wrapper
```bash
cd angular-react-wrapper
npm install
npm start
# Opens at http://localhost:4200
```

## How to Use

1. **Add nodes** - Click on node types in the sidebar (or use action presets)
2. **Connect nodes** - Drag from one handle (circle on node edge) to another
3. **Select node** - Click on a node to select it
4. **Edit node** - Double-click a node OR select it and click "Edit" button in toolbar
   - Edit labels, conditions, branches, actions
   - Add/remove branches dynamically
   - Configure level steps and types
5. **Delete node** - Select a node and click "Delete" button in toolbar
6. **Save workflow** - Click "Save" to download workflow as JSON file
7. **Load workflow** - Click "Load" to import a JSON workflow file
8. **Analyze workflow** - Click "Analyze" to see connections in browser console
9. **Test Execute** - Click "Test Execute" to simulate workflow execution

## Project Structure

```
workflow-builder-poc/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.js              # Left panel for adding nodes
│   │   ├── Sidebar.css
│   │   ├── Toolbar.js              # Top toolbar with actions
│   │   ├── Toolbar.css
│   │   ├── NodeEditor.js           # ⭐ NEW: Right panel for editing nodes
│   │   ├── NodeEditor.css          # ⭐ NEW: Modern styled editor
│   │   ├── ExecutionDemo.js        # Workflow execution simulator
│   │   └── ExecutionDemo.css
│   ├── nodes/
│   │   ├── LevelNode.js            # Verification level node
│   │   ├── ConditionNode.js        # Conditional branching node
│   │   ├── ActionNode.js           # Action execution node
│   │   └── NodeStyles.css
│   ├── App.js                      # Main application logic
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Example Workflow JSON

When you save a workflow, it generates JSON like this:

```json
{
  "nodes": [
    {
      "id": "level-1",
      "type": "level",
      "position": { "x": 50, "y": 150 },
      "data": {
        "label": "Level step 1",
        "levelName": "Collect particulars",
        "levelType": "Individuals",
        "steps": ["APPLICANT_DATA"],
        "isStart": true
      }
    }
  ],
  "edges": [
    {
      "source": "level-1",
      "target": "condition-123",
      "type": "smoothstep",
      "style": { "stroke": "#6D9DFF", "strokeWidth": 2 }
    }
  ],
  "metadata": {
    "version": 1,
    "createdAt": "2025-01-10T12:00:00.000Z"
  }
}
```

## Technologies Used

- React 18
- React Flow 11
- CSS3

## License

MIT
