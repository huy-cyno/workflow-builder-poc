# TODO List

> Active development tasks and ideas. Move completed items to CHANGELOG.md

## 🔥 Critical (Do First)

- [ ] **Node Property Editor**
  - Click node to open editor panel
  - Edit label, type-specific fields
  - Save/Cancel buttons
  - Update node data in state
  - File: Create `src/components/NodeEditor.js`

- [ ] **Flow Validation**
  - Detect cycles (node connecting back to itself)
  - Check disconnected nodes
  - Warn about missing start node
  - Show validation errors to user
  - Add to: `src/App.js`

- [ ] **Error Handling**
  - Try-catch in save/load functions
  - User-friendly error messages
  - Prevent app crash on bad JSON
  - Log errors to console

## 🎯 High Priority

- [ ] **Undo/Redo**
  - Track state history stack
  - Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
  - Limit history to 50 items
  - File: Create `src/hooks/useHistory.js`

- [ ] **Keyboard Shortcuts**
  - Delete key → delete selected node
  - Ctrl+S → save workflow
  - Ctrl+Z/Y → undo/redo
  - Escape → deselect node
  - File: Create `src/hooks/useKeyboard.js`

- [ ] **Auto-Save**
  - Save to localStorage every 30 seconds
  - Restore on page load
  - Show "Draft saved" indicator
  - File: Create `src/hooks/useAutoSave.js`

- [ ] **Better Node Placement**
  - Place new nodes at canvas center
  - Smart positioning near selected node
  - Avoid overlapping existing nodes
  - Add to: `src/App.js` → `onAddNode`

## 📋 Medium Priority

- [ ] **Copy/Paste Nodes**
  - Ctrl+C to copy selected node
  - Ctrl+V to paste
  - Duplicate with new ID
  - Place near original
  - File: Add to `src/App.js`

- [ ] **Export as Image**
  - Button to export canvas as PNG
  - Use react-flow's built-in function
  - Include minimap preview
  - Add to: `src/components/Toolbar.js`

- [ ] **Multi-Select**
  - Shift+Click to select multiple
  - Drag box to select area
  - Bulk delete
  - React Flow built-in feature

- [ ] **Node Search**
  - Search bar in toolbar
  - Filter by node type, label
  - Highlight matching nodes
  - File: Create `src/components/Search.js`

- [ ] **Drag from Sidebar**
  - Enable drag from sidebar to canvas
  - Show preview while dragging
  - Drop to add node
  - Update: `src/components/Sidebar.js`

## 🌟 Nice to Have

- [ ] **Workflow Templates**
  - Predefined workflow patterns
  - "Basic KYC", "Advanced Verification", etc.
  - Load template button
  - File: Create `src/templates/`

- [ ] **Node Toolbar**
  - Floating toolbar above selected node
  - Quick actions: edit, duplicate, delete
  - Like Figma/Miro
  - File: Create `src/components/NodeToolbar.js`

- [ ] **Dark Mode**
  - Toggle in settings
  - Save preference
  - Update all colors
  - File: Create `src/contexts/ThemeContext.js`

- [ ] **Zoom to Fit**
  - Button to fit all nodes in view
  - Center selected node
  - React Flow built-in: `fitView()`

- [ ] **Grid Options**
  - Toggle grid visibility
  - Change grid size
  - Snap to grid toggle
  - Add to: `src/App.js`

## 🔌 Backend Integration

- [ ] **API Integration**
  - Connect to backend API
  - Save workflows to server
  - Load workflows by ID
  - File: Create `src/services/api.js`

- [ ] **Authentication**
  - Login/logout
  - Store JWT token
  - Protect routes
  - File: Create `src/contexts/AuthContext.js`

- [ ] **Real-time Collaboration**
  - WebSocket connection
  - See other users' cursors
  - Sync changes in real-time
  - Library: socket.io or Pusher

## 🎨 UI/UX Improvements

- [ ] **Loading States**
  - Spinner during save/load
  - Skeleton screens
  - Progress indicators

- [ ] **Toast Notifications**
  - "Workflow saved" success message
  - Error notifications
  - Library: react-hot-toast

- [ ] **Tooltips**
  - Info tooltips on buttons
  - Explain node types
  - Help for first-time users

- [ ] **Onboarding Tutorial**
  - First-time user guide
  - Interactive walkthrough
  - Library: intro.js or react-joyride

- [ ] **Accessibility**
  - Keyboard navigation
  - Screen reader support
  - ARIA labels
  - Proper focus management

## 🧪 Testing

- [ ] **Unit Tests**
  - Test helper functions
  - Test components in isolation
  - Library: Jest + React Testing Library

- [ ] **Integration Tests**
  - Test save/load flow
  - Test node connections
  - Test delete operations

- [ ] **E2E Tests**
  - Full user workflows
  - Library: Cypress or Playwright

## 📚 Documentation

- [ ] **API Documentation**
  - Document all functions
  - JSDoc comments
  - Generate with TypeDoc

- [ ] **Video Tutorial**
  - Screen recording of usage
  - How to build workflows
  - Upload to YouTube

- [ ] **Interactive Demo**
  - Embed in README
  - CodeSandbox or StackBlitz

## 🔧 Code Quality

- [ ] **TypeScript Migration**
  - Convert to .ts/.tsx
  - Add type definitions
  - Better autocomplete

- [ ] **ESLint Configuration**
  - Add eslint rules
  - Fix all warnings
  - Pre-commit hooks

- [ ] **Prettier Setup**
  - Auto-format on save
  - Consistent code style

- [ ] **Performance Optimization**
  - Memoize expensive calculations
  - Virtual scrolling for large flows
  - Lazy load components

## 💡 Feature Ideas (Brainstorm)

- [ ] Version History
  - See previous versions
  - Restore old version
  - Diff between versions

- [ ] Comments/Notes
  - Add notes to nodes
  - Sticky notes on canvas

- [ ] Custom Themes
  - Change color scheme
  - Custom node styles

- [ ] Export to Code
  - Generate workflow code
  - Output as JSON schema

- [ ] AI Assistant
  - Suggest next steps
  - Auto-optimize layout

- [ ] Analytics
  - Track workflow usage
  - Most common patterns

---

## 🎯 Current Sprint (This Week)

**Goal:** Make the editor more usable

**Tasks:**
1. [ ] Implement node property editor
2. [ ] Add basic validation
3. [ ] Fix random node placement
4. [ ] Add keyboard shortcuts

**Time Estimate:** ~8 hours

---

## 📝 Notes

### Implementation Tips

**Node Property Editor:**
```javascript
// In App.js
const [editingNode, setEditingNode] = useState(null);

const onNodeDoubleClick = useCallback((event, node) => {
  setEditingNode(node);
}, []);

const onUpdateNode = useCallback((updatedNode) => {
  setNodes((nds) =>
    nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
  );
  setEditingNode(null);
}, [setNodes]);
```

**Validation:**
```javascript
// Check for cycles using DFS
function hasCycle(nodes, edges) {
  // See CONTRIBUTING.md for full implementation
}
```

**Auto-Save:**
```javascript
// In App.js
useEffect(() => {
  const autoSave = setTimeout(() => {
    localStorage.setItem('workflow-draft', JSON.stringify({ nodes, edges }));
  }, 30000); // 30 seconds

  return () => clearTimeout(autoSave);
}, [nodes, edges]);
```

---

## ✅ Completed (Move to CHANGELOG)

When task is done:
1. Check it off: `- [x] Task name`
2. Copy to CHANGELOG.md under current version
3. Remove from this file

---

Last Updated: 2025-01-10
Next Review: When starting new tasks
