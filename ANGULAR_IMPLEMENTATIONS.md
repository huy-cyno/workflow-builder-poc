# Angular Implementations Guide

This document explains the Angular implementations of the Workflow Builder and helps you choose the right approach.

## 📁 Project Structure

```
workflow-builder-poc/
├── src/                      # ✅ React + React Flow (MAIN - Feature Complete)
├── angular-drawflow/         # ✅ Angular + Drawflow (COMPLETED)
└── angular-react-wrapper/    # ✅ Angular wrapping React (COMPLETED)
```

## 🎯 Three Approaches

### 1. React + React Flow (Main PoC) ✅
**Location:** `src/`
**Status:** ✅ Complete with NodeEditor

**Features:**
- Full-featured NodeEditor panel
- Modern UI with consistent button styling
- Dynamic branch/action management
- Save/Load workflows
- Test execution simulator
- Professional polish

**Best For:**
- React projects
- Maximum features
- Production readiness

**Run:**
```bash
npm start
# Opens at http://localhost:3000
```

---

### 2. Angular + Drawflow ✅
**Location:** `angular-drawflow/`
**Status:** ✅ Completed and tested

**Features:**
- Native Angular implementation
- Drawflow library (vanilla JS)
- Custom node types (Level, Condition, Action)
- Save/Load workflows
- Zoom controls
- Lightweight and fast

**Best For:**
- Pure Angular projects
- Simpler workflows
- Quick demos
- Learning Drawflow

**Run:**
```bash
cd angular-drawflow
npm install
npm start
# Opens at http://localhost:4200
```

**Pros:**
- ✅ Framework agnostic library
- ✅ Smaller bundle size
- ✅ Simple to understand
- ✅ Direct HTML control

**Cons:**
- ❌ Less sophisticated than React Flow
- ❌ Manual HTML templates
- ❌ No built-in node editor
- ❌ Basic zoom/pan

---

### 3. Angular Wrapper for React App ✅
**Location:** `angular-react-wrapper/`
**Status:** ✅ Completed and working

**Implementation:**
Embeds the complete React Flow PoC inside an Angular application using iframe with postMessage communication bridge.

**Features:**
- Angular control panel with test buttons
- React app embedded in iframe
- Two-way communication (Angular ↔️ React)
- Load workflows from Angular
- Trigger save/clear in React
- Full React Flow features available

**Best For:**
- Angular projects that need React Flow features
- Gradual migration from React to Angular
- Leveraging existing React code
- Teams with both frameworks

**Run:**
```bash
cd angular-react-wrapper
npm install
npm start
# Opens at http://localhost:4200
# React app embedded inside
```

**Communication API:**
```typescript
// Angular -> React
loadWorkflow(workflow);    // Load data into React
saveWorkflow();           // Trigger save in React
clearWorkflow();          // Clear React workflow

// React -> Angular (automatic)
WORKFLOW_SAVED           // React saved workflow
NODE_SELECTED            // User selected node
REACT_APP_READY          // React loaded
```

---

## 📊 Comparison Matrix

| Feature | React Flow | Angular Drawflow | Angular Wrapper |
|---------|-----------|------------------|-----------------|
| **Framework** | React | Angular | Angular + React |
| **Library** | React Flow | Drawflow | React Flow |
| **Bundle Size** | ~500KB | ~350KB | ~600KB |
| **Node Editor** | ✅ Full | ❌ None | ✅ Full |
| **Complexity** | Medium | Low | High |
| **Customization** | High | Medium | High |
| **Integration** | React only | Angular only | Both |
| **Maintenance** | Easy | Easy | Complex |
| **Learning Curve** | Medium | Low | High |

---

## 🚀 Quick Start Guide

### Running React Version
```bash
npm install
npm start
```

### Running Angular Drawflow
```bash
cd angular-drawflow
npm install
npm start
```

### Both Side-by-Side
```bash
# Terminal 1 - React
npm start

# Terminal 2 - Angular
cd angular-drawflow && npm start
```

React opens at: `http://localhost:3000`
Angular opens at: `http://localhost:4200`

---

## 💡 Recommendations

### For Your Angular Project

**If you need:**
- ✅ Quick demo → Use **Angular Drawflow**
- ✅ Full features → Consider **Angular Wrapper** or migrate to React
- ✅ Production app → Use **React Flow** directly or **Angular Wrapper**

### Development Path

1. **Prototype** → Angular Drawflow (fastest)
2. **Demo** → Both versions for comparison
3. **Production** → React Flow (most mature) or Angular Wrapper

---

## 📝 Implementation Notes

### Angular Drawflow
- Built with Angular 20 standalone components
- Uses Drawflow 0.0.60
- Custom CSS matching React version
- Example workflow pre-loaded

### React Flow
- React 18 with hooks
- React Flow 11
- Comprehensive NodeEditor
- Save/Load/Execute features

---

## 🔧 Extending

### Add Custom Node to Angular Drawflow

```typescript
// In workflow.ts
addCustomNode(): void {
  const html = `
    <div class="node-content custom-node">
      <div class="node-header">
        <span class="node-icon">🎯</span>
        <span class="node-title">Custom Node</span>
      </div>
    </div>
  `;

  const data = {
    label: 'Custom Node',
    customField: 'value'
  };

  this.editor.addNode('custom', 1, 1, 200, 200, 'custom-node', data, html);
}
```

### Add to React Flow
See `CLAUDE.md` for detailed instructions on extending the React version.

---

## 📚 Resources

### React Flow
- Docs: https://reactflow.dev
- GitHub: https://github.com/wbkd/react-flow

### Drawflow
- Docs: https://github.com/jerosoler/Drawflow
- Examples: https://jerosoler.github.io/Drawflow/

### Angular Elements
- Docs: https://angular.dev/guide/elements
- For Web Component wrapping

---

## ✅ What's Working

- ✅ React Flow PoC with full features
- ✅ Angular Drawflow PoC with basic features
- ✅ Angular React Wrapper with postMessage bridge
- ✅ All three can save/load JSON
- ✅ All have similar UI/UX
- ✅ All support custom nodes

## 🔜 Future Enhancements

- [x] Angular Wrapper implementation
- [ ] Shared workflow JSON format
- [ ] Cross-framework data sync
- [ ] Unified documentation
- [ ] Performance comparison

---

**Last Updated:** 2025-01-11
**Version:** 0.2.0
