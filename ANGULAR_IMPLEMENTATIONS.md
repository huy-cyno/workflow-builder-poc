# Angular Implementations Guide

This document explains the Angular implementations of the Workflow Builder and helps you choose the right approach.

## 📁 Project Structure

```
workflow-builder-poc/
├── src/                      # ✅ React + React Flow (MAIN - Feature Complete)
├── angular-drawflow/         # ✅ Angular + Drawflow (COMPLETED)
└── angular-react-wrapper/    # 📝 Angular wrapping React (Guide below)
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

### 3. Angular Wrapper for React App 📝
**Location:** `angular-react-wrapper/` (to be created)
**Status:** Guide provided below

**Concept:**
Embed the React Flow PoC inside an Angular application using Web Components or iframe.

**Best For:**
- Angular projects that need React Flow features
- Gradual migration
- Leveraging existing React code

**Two Approaches:**

#### Option A: Web Components (Recommended)
Use `@angular/elements` to wrap React or `react-to-webcomponent`.

```bash
# In React project
npm install react-to-webcomponent

# Create Web Component wrapper
# Then import in Angular
```

#### Option B: Iframe Embedding
Simple but isolated:

```typescript
// Angular component
<iframe src="http://localhost:3000"
        width="100%"
        height="800px"
        frameborder="0">
</iframe>
```

**Communication:**
```typescript
// Angular -> React
iframe.contentWindow.postMessage({ type: 'LOAD_WORKFLOW', data: workflow });

// React -> Angular
window.addEventListener('message', (event) => {
  if (event.data.type === 'WORKFLOW_SAVED') {
    console.log(event.data.workflow);
  }
});
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
- ✅ Both can save/load JSON
- ✅ Both have similar UI/UX
- ✅ Both support custom nodes

## 🔜 Future Enhancements

- [ ] Angular Wrapper implementation
- [ ] Shared workflow JSON format
- [ ] Cross-framework data sync
- [ ] Unified documentation
- [ ] Performance comparison

---

**Last Updated:** 2025-01-11
**Version:** 0.2.0
