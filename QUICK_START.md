# Quick Start Guide

## 🚀 Run the Project (30 seconds)

```bash
cd workflow-builder-poc
npm install
npm start
```

Open http://localhost:3000

## 🎯 Basic Usage (2 minutes)

1. **Add Node**: Click "Level Step", "Condition", or "Action" in left sidebar
2. **Connect**: Drag from blue circle on right → blue circle on left
3. **Select**: Click any node to select it
4. **Delete**: Select node → Click "🗑️ Delete" button
5. **Save**: Click "💾 Save" → Downloads `workflow.json`
6. **Load**: Click "📂 Load" → Select saved JSON file
7. **Analyze**: Click "🔍 Analyze" → Check browser console

## 📊 Understanding Output

When you save, you get:

```json
{
  "nodes": [/* your workflow steps */],
  "edges": [/* connections between steps */]
}
```

**Key concept:**
```javascript
{ source: "A", target: "B" }  // means: A → B
```

- `source` = node that comes BEFORE (where arrow starts)
- `target` = node that comes AFTER (where arrow points)

## 🔧 Common Tasks

### Find what comes after a node
```javascript
edges.filter(e => e.source === nodeId).map(e => e.target)
```

### Find what comes before a node
```javascript
edges.filter(e => e.target === nodeId).map(e => e.source)
```

### Check if workflow is valid
```javascript
// 1. Every node except start should have incoming edge
// 2. Every node except end should have outgoing edge
// 3. No cycles (node can't connect back to itself)
```

## 📁 File Structure

```
src/
├── App.js              ← Main logic lives here
├── nodes/
│   ├── LevelNode.js    ← Blue verification steps
│   ├── ConditionNode.js ← Orange if/else logic
│   └── ActionNode.js   ← Green actions
└── components/
    ├── Toolbar.js      ← Top buttons
    └── Sidebar.js      ← Left panel
```

## 🎨 Customization

### Change node colors
Edit `src/nodes/NodeStyles.css`:
```css
.level-node { border-color: #YOUR_COLOR; }
```

### Add new node type
See "Adding a New Node Type" section in CLAUDE.md

### Change edge style
Edit `src/App.js` → `onConnect` function

## 🐛 Debug Console

Press F12 → Console tab, then:
- Click "Analyze" button to see workflow structure
- All save operations log to console
- Errors appear in red

## 📖 Need More Help?

- **Full details**: Read `CLAUDE.md`
- **React Flow docs**: https://reactflow.dev
- **Report issues**: Create issue on GitHub
