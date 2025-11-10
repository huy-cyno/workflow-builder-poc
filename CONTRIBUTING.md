# Contributing Guide

## 🎯 Before You Start

1. **Read these files first:**
   - `README.md` - Basic overview
   - `CLAUDE.md` - Deep technical context
   - `QUICK_START.md` - Get it running fast

2. **Understand the architecture:**
   - React Flow manages visual state
   - Nodes and edges are just JavaScript objects
   - Custom node components are in `src/nodes/`
   - Business logic is in `src/App.js`

3. **Check existing issues/TODOs:**
   - See `CHANGELOG.md` for planned features
   - Review `CLAUDE.md` TODOs section

## 🏗️ Development Setup

```bash
# Clone and setup
cd workflow-builder-poc
npm install

# Start dev server
npm start

# Project runs at http://localhost:3000
```

## 📝 Code Style Guide

### General Principles
- **Keep it simple** - This is a PoC, not production code
- **Comment complex logic** - Help future developers (or AI assistants)
- **Use descriptive names** - `getNextNodes` not `gnc`
- **One responsibility per function** - Do one thing well

### React Component Style

```javascript
// ✅ Good
function MyNode({ data, selected }) {
  // Early returns for loading/error states
  if (!data) return null;

  // Event handlers defined with useCallback
  const handleClick = useCallback(() => {
    // ...
  }, [dependencies]);

  return (
    <div className="my-node">
      {/* JSX here */}
    </div>
  );
}

// ❌ Avoid
function MyNode(props) {
  return <div onClick={() => props.onClick(props.data)}> {/* inline handlers */}
}
```

### CSS Guidelines

```css
/* ✅ Use descriptive class names */
.level-node { }
.condition-branch { }
.action-item { }

/* ✅ Group related styles */
.node-header {
  /* layout */
  display: flex;
  gap: 8px;

  /* typography */
  font-size: 14px;
  font-weight: 600;
}

/* ❌ Avoid generic names */
.box { }
.item { }
.container { }
```

### File Organization

```
src/
├── nodes/              # Custom node components
│   ├── LevelNode.js    # One file per node type
│   └── NodeStyles.css  # Shared node styles
├── components/         # UI components
│   ├── Toolbar.js      # One component per file
│   └── Toolbar.css     # Colocated styles
└── utils/             # Helper functions (future)
    └── workflow.js
```

## 🔧 Adding Features

### 1. Adding a New Node Type

**Step-by-step:**

1. Create component file:
```javascript
// src/nodes/MyNewNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';
import './NodeStyles.css';

function MyNewNode({ data, selected }) {
  return (
    <div className={`custom-node mynew-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Left} />

      <div className="node-header">
        <span className="node-icon">🎯</span>
        <span className="node-title">{data.label}</span>
      </div>

      {/* Add your custom content */}

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default MyNewNode;
```

2. Add styles to `NodeStyles.css`:
```css
.mynew-node {
  border-color: #YOUR_COLOR;
}
```

3. Register in `App.js`:
```javascript
import MyNewNode from './nodes/MyNewNode';

const nodeTypes = {
  level: LevelNode,
  condition: ConditionNode,
  action: ActionNode,
  mynew: MyNewNode,  // ← Add here
};
```

4. Add to sidebar (`components/Sidebar.js`):
```javascript
const nodeTemplates = [
  // ...existing
  {
    type: 'mynew',
    icon: '🎯',
    title: 'My New Node',
    description: 'Does something cool'
  }
];
```

5. Define default data (in `App.js`):
```javascript
function getDefaultNodeData(type) {
  switch (type) {
    // ...existing cases
    case 'mynew':
      return {
        label: 'My New Node',
        customField: 'value'
      };
  }
}
```

### 2. Adding Workflow Features

**Example: Validation**

```javascript
// Add to App.js
function validateWorkflow(nodes, edges) {
  const errors = [];

  // Check for disconnected nodes
  nodes.forEach(node => {
    const hasIncoming = edges.some(e => e.target === node.id);
    const hasOutgoing = edges.some(e => e.source === node.id);

    if (!hasIncoming && !node.data.isStart) {
      errors.push(`Node "${node.data.label}" has no incoming connections`);
    }
    if (!hasOutgoing) {
      // Could be an end node, maybe warn instead
      console.warn(`Node "${node.data.label}" has no outgoing connections`);
    }
  });

  // Check for cycles
  if (hasCycle(nodes, edges)) {
    errors.push('Workflow contains a cycle');
  }

  return errors;
}

function hasCycle(nodes, edges) {
  const visited = new Set();
  const recursionStack = new Set();

  function dfs(nodeId) {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const outgoing = edges.filter(e => e.source === nodeId);
    for (const edge of outgoing) {
      if (!visited.has(edge.target)) {
        if (dfs(edge.target)) return true;
      } else if (recursionStack.has(edge.target)) {
        return true; // Cycle detected
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}

// Use in onSave:
const onSave = useCallback(() => {
  const errors = validateWorkflow(nodes, edges);
  if (errors.length > 0) {
    alert(`Validation errors:\n${errors.join('\n')}`);
    return;
  }

  // ... proceed with save
}, [nodes, edges]);
```

### 3. Adding UI Components

```javascript
// components/NodeEditor.js
import React from 'react';
import './NodeEditor.css';

function NodeEditor({ node, onUpdate, onClose }) {
  const [label, setLabel] = React.useState(node.data.label);

  const handleSave = () => {
    onUpdate({
      ...node,
      data: { ...node.data, label }
    });
    onClose();
  };

  return (
    <div className="node-editor">
      <h3>Edit Node</h3>
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default NodeEditor;
```

## 🧪 Testing Your Changes

### Manual Testing Checklist

- [ ] Add node from sidebar → appears on canvas
- [ ] Drag node → moves smoothly
- [ ] Connect two nodes → edge appears
- [ ] Select node → border highlights
- [ ] Delete node → node and edges removed
- [ ] Save workflow → JSON downloads
- [ ] Load workflow → restores state
- [ ] Analyze → console shows correct info

### Console Testing

```javascript
// Add to App.js temporarily
useEffect(() => {
  console.log('=== Current State ===');
  console.log('Nodes:', nodes);
  console.log('Edges:', edges);
}, [nodes, edges]);
```

## 🚀 Committing Changes

### Commit Message Format

```
type: short description

Longer explanation if needed.

- Detail 1
- Detail 2
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` CSS/formatting
- `refactor:` Code restructure
- `test:` Tests
- `chore:` Tooling/config

**Examples:**
```
feat: add node property editor panel

Users can now click a node to edit its properties.
- Added NodeEditor component
- Added edit mode state
- Styled editor panel

fix: prevent duplicate node IDs

Used timestamp to ensure unique IDs when adding nodes.

docs: update CLAUDE.md with validation examples
```

## 📊 Pull Request Guidelines

### Before Submitting

1. **Test thoroughly** - Use manual checklist above
2. **Update docs** - Modify CLAUDE.md if architecture changed
3. **Update CHANGELOG** - Add to `[Unreleased]` section
4. **Check console** - No errors or warnings
5. **Format code** - Keep style consistent

### PR Description Template

```markdown
## What does this PR do?
Brief description of changes.

## How to test?
1. Step one
2. Step two
3. Expected result

## Screenshots (if UI changes)
[Add images]

## Checklist
- [ ] Code tested locally
- [ ] Docs updated
- [ ] CHANGELOG updated
- [ ] No console errors
```

## 🐛 Reporting Issues

### Bug Report Template

```markdown
**Description:**
What went wrong?

**Steps to Reproduce:**
1. Step one
2. Step two
3. Bug occurs

**Expected Behavior:**
What should happen?

**Actual Behavior:**
What actually happens?

**Screenshots:**
[If applicable]

**Console Errors:**
[Copy from browser console]

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Node: 18.x
```

## 💡 Best Practices

### Do's ✅

- **Comment complex logic** - Explain WHY, not WHAT
- **Keep functions small** - Under 50 lines ideally
- **Use meaningful names** - `getUserWorkflow` not `guw`
- **Handle errors gracefully** - Show user-friendly messages
- **Test edge cases** - Empty states, max values, etc.
- **Update CLAUDE.md** - Help future developers

### Don'ts ❌

- **Don't commit commented code** - Delete it
- **Don't use `any` types** - Be specific
- **Don't ignore console warnings** - Fix them
- **Don't hardcode values** - Use constants
- **Don't skip documentation** - Future you will thank you

## 🎓 Learning Resources

### React Flow
- Docs: https://reactflow.dev/
- Examples: https://reactflow.dev/examples
- Discord: https://discord.gg/Bqt6xrs

### React Best Practices
- Hooks: https://react.dev/reference/react
- Patterns: https://reactpatterns.com/

### JavaScript
- MDN: https://developer.mozilla.org/
- ES6+: https://javascript.info/

## 🤝 Getting Help

1. **Check CLAUDE.md** - Most technical answers there
2. **Search existing issues** - Someone may have asked
3. **Console.log everything** - Debug with logs
4. **React DevTools** - Inspect component state
5. **Ask questions** - Create an issue with details

## 🎯 Current Focus Areas

Based on CHANGELOG planned features:

**High Priority:**
1. Node property editor
2. Flow validation
3. Undo/Redo

**Medium Priority:**
1. Keyboard shortcuts
2. Copy/paste nodes
3. Export as image

Pick one that interests you and dive in!

---

**Remember:** This is a learning project. Mistakes are okay. Experiments are encouraged. Have fun! 🚀

Last Updated: 2025-01-10
