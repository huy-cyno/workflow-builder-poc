# Workflow Builder PoC

A React Flow-based workflow builder that replicates the Sumsub cockpit interface.

## Features

- ✅ Custom node types (Level, Condition, Action)
- ✅ Visual node handles for connections
- ✅ Sidebar for adding nodes
- ✅ Save/Load workflow as JSON
- ✅ Workflow analysis (shows connections in console)
- ✅ MiniMap and Controls
- ✅ Styled like Sumsub interface
- ✅ Selected node highlighting
- ✅ Start badge for first node

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## How to Use

1. **Add nodes** - Click on node types in the sidebar
2. **Connect nodes** - Drag from one handle (circle on node edge) to another
3. **Select node** - Click on a node to select it
4. **Delete node** - Select a node and click "Delete" button in toolbar
5. **Save workflow** - Click "Save" to download workflow as JSON file
6. **Load workflow** - Click "Load" to import a JSON workflow file
7. **Analyze workflow** - Click "Analyze" to see connections in browser console

## Project Structure

```
workflow-builder-poc/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.js
│   │   ├── Sidebar.css
│   │   ├── Toolbar.js
│   │   └── Toolbar.css
│   ├── nodes/
│   │   ├── LevelNode.js
│   │   ├── ConditionNode.js
│   │   ├── ActionNode.js
│   │   └── NodeStyles.css
│   ├── App.js
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
