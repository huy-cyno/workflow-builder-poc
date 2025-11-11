# 🚀 Quick Guide: How to Consume Workflow JSON

## TL;DR - 3 Steps to Execute a Workflow

```javascript
// 1. Import the executor
import WorkflowExecutor from './utils/workflowExecutor';

// 2. Get your workflow from the builder
const workflow = { nodes: [...], edges: [...] };

// 3. Execute it!
const executor = new WorkflowExecutor(workflow);
const result = await executor.execute({ age: 25, country: 'Singapore' });

// Done! Check the results
console.log(result.summary.executionPath);
// Output: ['Collect Data', 'Age Check', 'Approve']
```

---

## 🎯 Try the Live Demo

1. Open the app (already running on port 3000)
2. Build a workflow with nodes and conditions
3. Click **"🚀 Test Execute"** in the toolbar
4. Enter test data like:
   ```json
   {
     "age": 25,
     "country": "Singapore"
   }
   ```
5. Click "Execute" and see which path it takes!

---

## 🔍 Understanding the JSON Structure

### The Workflow JSON

```json
{
  "nodes": [
    { "id": "A", "type": "level", "data": {...} },
    { "id": "B", "type": "condition", "data": {...} },
    { "id": "C", "type": "action", "data": {...} }
  ],
  "edges": [
    { "source": "A", "target": "B" },
    { "source": "B", "target": "C", "sourceHandle": "branch-0" }
  ]
}
```

### Key Concepts

| Element | Meaning |
|---------|---------|
| `source` | Node that comes **BEFORE** |
| `target` | Node that comes **AFTER** |
| `sourceHandle` | Which branch (for conditions) |

**Example:**
```
{ source: "A", target: "B" }  →  Flow goes A → B
```

---

## 🔀 How Conditions Work

When you have a condition node with branches:

```javascript
{
  type: 'condition',
  data: {
    branches: [
      { name: 'Adult', condition: 'age >= 18' },
      { name: 'Teen', condition: 'age >= 13' }
    ]
  }
}
```

**The executor:**
1. Checks each branch in order
2. Takes the **first match**
3. If no match → takes **else branch**

**Supported conditions:**
- `"age >= 18"` - numerical comparison
- `"country equals Singapore"` - text equality
- `"score > 50"` - greater than
- `"status != pending"` - not equals

---

## 📊 Execution Result Format

```javascript
{
  success: true,
  steps: 5,

  executionLog: [
    {
      step: 1,
      nodeType: 'level',
      label: 'Collect Data',
      result: { status: 'completed' }
    },
    // ... more steps
  ],

  summary: {
    executionPath: ['Collect Data', 'Age Check', 'Approve'],
    totalSteps: 5
  }
}
```

---

## 💡 Common Use Cases

### Use Case 1: Simple If-Else

```javascript
// Build a workflow with age check
// Execute with different ages
await executor.execute({ age: 25 }); // → Approve path
await executor.execute({ age: 15 }); // → Reject path
```

### Use Case 2: Multi-Branch Logic

```javascript
// Country-based routing
await executor.execute({ country: 'Singapore' }); // → SG KYC
await executor.execute({ country: 'USA' });       // → US KYC
await executor.execute({ country: 'Japan' });     // → Else (International)
```

### Use Case 3: Real-Time Updates

```javascript
const result = await executor.execute(
  { age: 25 },
  {
    onStep: (stepInfo) => {
      console.log(`Current: ${stepInfo.label}`);
      updateProgressBar(stepInfo.step);
    }
  }
);
```

---

## 📁 Files to Check

- **Execution Engine:** `src/utils/workflowExecutor.js`
- **Examples:** `src/utils/workflowExamples.js`
- **Demo UI:** `src/components/ExecutionDemo.js`
- **Full Guide:** `WORKFLOW_EXECUTION.md`

---

## 🎓 Next Steps

1. **Try the demo** - Click "Test Execute" button
2. **Read examples** - Check `src/utils/workflowExamples.js`
3. **Build your own** - Use the executor in your code
4. **Customize** - Extend the executor for your needs

---

**Questions?** Check the full documentation in `WORKFLOW_EXECUTION.md`
