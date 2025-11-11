# Workflow Builder - Angular React Wrapper

This Angular application wraps and embeds the React Flow workflow builder, enabling you to use the full-featured React application within an Angular project.

## 🎯 What This Does

This is an **Angular shell** that:
- Embeds the complete React Flow PoC in an iframe
- Provides Angular-to-React communication via postMessage API
- Demonstrates how to integrate React components in Angular projects
- Keeps both frameworks isolated yet connected

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   Angular App (Port 4200)               │
│  ┌──────────────────────────────────┐   │
│  │  Angular Wrapper Controls        │   │
│  │  - Load workflow from Angular    │   │
│  │  - Trigger save in React         │   │
│  │  - Send commands to React        │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Iframe: React App               │   │
│  │  /react-app/index.html           │   │
│  │  (Full React Flow PoC)           │   │
│  └──────────────────────────────────┘   │
│                                          │
│  Communication: postMessage API          │
└─────────────────────────────────────────┘
```

## 📦 What's Included

- **Angular 20** wrapper application
- **React Flow PoC** embedded in `/public/react-app/`
- **Communication bridge** via postMessage
- **Control panel** to test Angular ↔️ React communication
- **Type-safe** message handling

## 🚀 Quick Start

### Installation

```bash
cd angular-react-wrapper
npm install
```

### Running

```bash
npm start
# Opens at http://localhost:4200
```

The React app is embedded and will load automatically in the iframe.

## 💬 Communication API

### Angular → React Messages

```typescript
// Load workflow from Angular
this.reactWorkflow.loadWorkflow(workflowData);

// Trigger save in React
this.reactWorkflow.saveWorkflow();

// Clear workflow in React
this.reactWorkflow.clearWorkflow();

// Custom message
this.reactWorkflow.sendMessageToReact({
  type: 'CUSTOM_ACTION',
  payload: data
});
```

### React → Angular Messages

React app sends messages that Angular listens for:

```typescript
// In React (add to your App.js):
window.parent.postMessage({
  type: 'WORKFLOW_SAVED',
  workflow: workflowData
}, '*');

// Angular automatically handles:
// - WORKFLOW_SAVED
// - WORKFLOW_LOADED  
// - NODE_SELECTED
// - REACT_APP_READY
```

## 🎨 Features

### Control Panel
- **Load Sample**: Inject a test workflow from Angular
- **Trigger Save**: Command React to save current workflow
- **Clear**: Reset the workflow in React
- **Console Logging**: See all messages in browser console

### React App
- Full React Flow workflow builder
- All original features (NodeEditor, Save/Load, etc.)
- Running in isolated iframe
- Communicates via postMessage

## 📁 Project Structure

```
angular-react-wrapper/
├── src/
│   ├── app/
│   │   ├── react-workflow/          # Wrapper component
│   │   │   ├── react-workflow.ts    # Communication logic
│   │   │   ├── react-workflow.html  # UI with iframe
│   │   │   └── react-workflow.css   # Styling
│   │   ├── app.ts                   # Main app
│   │   └── app.html
│   └── index.html
│
├── public/
│   └── react-app/                   # React build files
│       ├── index.html
│       ├── static/
│       └── ...
│
└── package.json
```

## 🔧 How It Works

### 1. React App is Built
```bash
# From root project
npm run build
# Creates /build folder
```

### 2. React Build Copied to Angular
```bash
cp -r build/* angular-react-wrapper/public/react-app/
```

### 3. Angular Serves React Files
Angular's dev server serves files from `public/` directory, making React app available at `/react-app/index.html`.

### 4. Iframe Embedding
```html
<iframe src="/react-app/index.html"></iframe>
```

### 5. Communication Bridge
```typescript
// Angular listens
window.addEventListener('message', (event) => {
  if (event.data.type === 'WORKFLOW_SAVED') {
    // Handle in Angular
  }
});

// React sends
window.parent.postMessage({ type: 'WORKFLOW_SAVED', data }, '*');
```

## 🎯 Use Cases

### When to Use This Approach

✅ **Good For:**
- Migrating from React to Angular gradually
- Using React libraries in Angular projects
- Teams with both React and Angular expertise
- Need full React Flow features in Angular

❌ **Not Ideal For:**
- Pure Angular projects (use Angular Drawflow instead)
- Performance-critical applications (iframe overhead)
- Deep integration needs (use Web Components instead)

## 🔄 Comparison

| Feature | Angular Drawflow | Angular React Wrapper |
|---------|------------------|----------------------|
| **Technology** | Pure Angular + Drawflow | Angular + React |
| **Integration** | Native | Iframe |
| **Features** | Basic | Full (React Flow) |
| **Performance** | Faster | Slower (iframe) |
| **Bundle Size** | Smaller | Larger |
| **Maintenance** | Easier | Complex |
| **Best For** | Simple workflows | Feature-rich workflows |

## 🚧 Limitations

1. **Iframe Isolation**
   - Separate DOM contexts
   - postMessage overhead
   - Can't share services directly

2. **Styling**
   - React app styles isolated
   - Need to size iframe properly
   - Responsive challenges

3. **Performance**
   - Two applications running
   - Larger bundle size
   - Message passing latency

4. **Security**
   - postMessage origin validation needed
   - XSS considerations
   - CORS if different domains

## 🎓 Advanced Topics

### Adding New Messages

**In React (src/App.js):**
```javascript
// Send custom message
window.parent.postMessage({
  type: 'NODE_DOUBLE_CLICKED',
  node: nodeData
}, '*');
```

**In Angular (react-workflow.ts):**
```typescript
case 'NODE_DOUBLE_CLICKED':
  this.handleNodeDoubleClick(event.data.node);
  break;
```

### Handling File Uploads

```typescript
// Angular uploads file
const file = event.target.files[0];
const workflow = JSON.parse(await file.text());
this.loadWorkflow(workflow);
```

### State Synchronization

```typescript
// Keep Angular state in sync
private angularWorkflowState: any;

handleWorkflowSaved(workflow: any) {
  this.angularWorkflowState = workflow;
  // Save to backend, localStorage, etc.
}
```

## 🐛 Troubleshooting

### Iframe Not Loading
- Check `/public/react-app/` has all build files
- Verify Angular dev server is running
- Check browser console for errors

### Messages Not Received
- Ensure `window.parent.postMessage` in React
- Verify event listener in Angular `ngOnInit`
- Check message format matches

### Styles Look Wrong
- React app has its own styles
- Iframe may need explicit dimensions
- Check viewport meta tags

## 📚 Resources

- [postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Angular Elements](https://angular.dev/guide/elements) (alternative approach)
- [React to Web Component](https://www.npmjs.com/package/react-to-webcomponent)

## ✅ Testing Checklist

- [ ] React app loads in iframe
- [ ] "Load Sample" button works
- [ ] Console shows Angular → React messages
- [ ] "Trigger Save" communicates to React
- [ ] React workflows display correctly
- [ ] Responsive layout works

## 🎉 Success!

You now have a working Angular-React hybrid! The React workflow builder runs seamlessly within your Angular application.

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-11
