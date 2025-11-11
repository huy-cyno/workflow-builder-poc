# Quick Start - Angular Foblex Flow PoC

Get the workflow builder running in 2 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Start Development Server

```bash
npm start
```

The app opens at `http://localhost:4200`

## 3. Create Your First Workflow

### Add Nodes
- Click **Level Step** in the left sidebar to add a level node
- Click **Condition** to add a condition node
- Click **Action** to add an action node

### Connect Nodes
1. Hover over a node to see small circles on the sides
2. Click and drag from the **right circle** (output)
3. Drag to the **left circle** (input) of another node
4. Release to connect

### Edit Nodes
1. Click on any node to select it
2. A panel opens on the right side
3. Edit the properties and click **Save**

### Test Execute
1. Click the **Execute** button (▶️) in the toolbar
2. The execution panel opens on the right
3. Click **Execute** to start the workflow simulation
4. Watch as the system:
   - Executes each node in sequence
   - Tracks execution time for each step
   - Shows the complete execution path
   - Displays step-by-step execution trace
   - Generates mock output for each node type

### Manage Workflows
- **Save** (💾) - Download workflow as JSON
- **Load** (📂) - Upload a previously saved workflow
- **Analyze** (🔍) - See workflow structure in the console
- **Execute** (▶️) - Test execute workflow and see execution trace
- **Delete** (🗑️) - Remove selected node

## 4. Example Workflow

Here's a simple workflow to try:

1. Add a **Level Step** node (this is your start)
2. Add a **Condition** node below it
3. Add two **Action** nodes to the right
4. Connect:
   - Level → Condition
   - Condition → Action 1 (via Branch 1)
   - Condition → Action 2 (via Else)

5. Click **Analyze** to see the paths

## 5. Build for Production

```bash
npm run build
```

Output is in `dist/angular-foblex-poc/`

## 📖 Full Documentation

See `ANGULAR_FOBLEX_POC.md` for detailed documentation.

## 🎯 Node Types At A Glance

| Node Type | Icon | Purpose | Color |
|-----------|------|---------|-------|
| Level | 💾 | Verification step | Blue |
| Condition | 🔀 | Branching logic | Orange |
| Action | ⚡ | Execute actions | Green |

## 💡 Tips

- **Drag nodes** by clicking and dragging them around
- **Select nodes** by clicking on them (shows panel on right)
- **Delete nodes** by selecting and clicking the delete button
- **Add branches** to Condition nodes in the editor panel
- **Check console** after clicking Analyze to see workflow paths

## 🚀 Next Steps

1. Try creating a complex workflow with multiple branches
2. Save it and reload it to test persistence
3. Check the console (F12) to see the workflow structure
4. Read the full documentation for advanced features
