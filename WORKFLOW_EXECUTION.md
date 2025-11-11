# Workflow Execution Guide

> How to extract and execute the workflow logic from the saved JSON

## 🎯 The Problem

You have a workflow JSON like this:

```json
{
  "nodes": [
    { "id": "start", "type": "level", "data": {...} },
    { "id": "condition1", "type": "condition", "data": {...} },
    { "id": "pathA", "type": "level", "data": {...} },
    { "id": "pathB", "type": "action", "data": {...} }
  ],
  "edges": [
    { "source": "start", "target": "condition1" },
    { "source": "condition1", "target": "pathA", "sourceHandle": "branch-0" },
    { "source": "condition1", "target": "pathB", "sourceHandle": "else" }
  ]
}
```

**Question:** How do you execute this? How do you follow the if/else logic?

## 💡 The Solution: Workflow Execution Engine

### Step 1: Parse the Workflow

```javascript
// src/utils/workflowExecutor.js

class WorkflowExecutor {
  constructor(workflow) {
    this.nodes = workflow.nodes;
    this.edges = workflow.edges;
    this.nodeMap = this.buildNodeMap();
    this.edgeMap = this.buildEdgeMap();
  }

  // Quick lookup: nodeId -> node
  buildNodeMap() {
    const map = {};
    this.nodes.forEach(node => {
      map[node.id] = node;
    });
    return map;
  }

  // Quick lookup: nodeId -> outgoing edges
  buildEdgeMap() {
    const map = {};
    this.edges.forEach(edge => {
      if (!map[edge.source]) {
        map[edge.source] = [];
      }
      map[edge.source].push(edge);
    });
    return map;
  }

  // Find the starting node (no incoming edges)
  getStartNode() {
    return this.nodes.find(node =>
      !this.edges.some(edge => edge.target === node.id)
    );
  }

  // Get next nodes based on current node
  getNextNodes(nodeId, context = {}) {
    const edges = this.edgeMap[nodeId] || [];
    const currentNode = this.nodeMap[nodeId];

    // If it's a condition node, evaluate which path to take
    if (currentNode.type === 'condition') {
      return this.evaluateCondition(currentNode, edges, context);
    }

    // Otherwise, return all next nodes
    return edges.map(edge => ({
      nodeId: edge.target,
      edge: edge
    }));
  }

  // Evaluate condition and return correct path
  evaluateCondition(conditionNode, edges, context) {
    const branches = conditionNode.data.branches || [];

    // Check each branch condition
    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];

      // Evaluate the condition
      if (this.checkCondition(branch.condition, context)) {
        // Find the edge with this branch's handle
        const edge = edges.find(e => e.sourceHandle === `branch-${i}`);
        if (edge) {
          return [{ nodeId: edge.target, edge, branch: branch.name }];
        }
      }
    }

    // If no condition matched, take the 'else' path
    const elseEdge = edges.find(e => e.sourceHandle === 'else');
    if (elseEdge) {
      return [{ nodeId: elseEdge.target, edge: elseEdge, branch: 'else' }];
    }

    return [];
  }

  // Check if condition is true
  checkCondition(conditionString, context) {
    // Parse condition like "Nationality equals Singapore"
    // or "age >= 18"

    // Simple parser (you can make this more sophisticated)
    const patterns = [
      // "field equals value"
      /^(\w+)\s+equals\s+(.+)$/i,
      // "field >= value"
      /^(\w+)\s*(>=|<=|>|<|==|!=)\s*(.+)$/,
    ];

    for (const pattern of patterns) {
      const match = conditionString.match(pattern);
      if (match) {
        const field = match[1];
        const operator = match[2] || 'equals';
        const value = match[3] || match[2];

        return this.evaluateExpression(field, operator, value, context);
      }
    }

    return false;
  }

  evaluateExpression(field, operator, expectedValue, context) {
    const actualValue = context[field];

    switch (operator.toLowerCase()) {
      case 'equals':
      case '==':
        return String(actualValue) === String(expectedValue);
      case '!=':
        return String(actualValue) !== String(expectedValue);
      case '>':
        return Number(actualValue) > Number(expectedValue);
      case '<':
        return Number(actualValue) < Number(expectedValue);
      case '>=':
        return Number(actualValue) >= Number(expectedValue);
      case '<=':
        return Number(actualValue) <= Number(expectedValue);
      default:
        return false;
    }
  }

  // Execute the workflow step by step
  async execute(context = {}) {
    const executionLog = [];
    const startNode = this.getStartNode();

    if (!startNode) {
      throw new Error('No start node found in workflow');
    }

    let currentNodeId = startNode.id;
    const visited = new Set(); // Prevent infinite loops

    while (currentNodeId) {
      // Check for cycles
      if (visited.has(currentNodeId)) {
        throw new Error(`Cycle detected at node: ${currentNodeId}`);
      }
      visited.add(currentNodeId);

      const currentNode = this.nodeMap[currentNodeId];

      console.log(`Executing node: ${currentNode.data.label}`);

      // Execute the current node
      const result = await this.executeNode(currentNode, context);

      executionLog.push({
        nodeId: currentNodeId,
        nodeType: currentNode.type,
        label: currentNode.data.label,
        result: result
      });

      // Get next node(s)
      const nextNodes = this.getNextNodes(currentNodeId, context);

      if (nextNodes.length === 0) {
        // End of workflow
        console.log('Workflow completed');
        break;
      }

      if (nextNodes.length > 1) {
        // Multiple paths - should not happen with proper conditions
        console.warn('Multiple next nodes found, taking first one');
      }

      // Move to next node
      currentNodeId = nextNodes[0].nodeId;

      if (nextNodes[0].branch) {
        console.log(`Taking branch: ${nextNodes[0].branch}`);
      }
    }

    return {
      success: true,
      executionLog,
      context
    };
  }

  // Execute a single node
  async executeNode(node, context) {
    switch (node.type) {
      case 'level':
        return await this.executeLevel(node, context);

      case 'condition':
        return await this.executeCondition(node, context);

      case 'action':
        return await this.executeAction(node, context);

      default:
        console.warn(`Unknown node type: ${node.type}`);
        return { status: 'skipped' };
    }
  }

  async executeLevel(node, context) {
    console.log(`  Level: ${node.data.levelName}`);
    console.log(`  Steps: ${node.data.steps.join(', ')}`);

    // In real implementation, you might:
    // - Show a form to collect data
    // - Verify documents
    // - Call verification APIs
    // - Update context with results

    // Example: simulate collecting data
    return {
      status: 'completed',
      data: {
        levelName: node.data.levelName,
        stepsCompleted: node.data.steps
      }
    };
  }

  async executeCondition(node, context) {
    console.log(`  Condition: ${node.data.label}`);

    // The actual branching happens in getNextNodes()
    // This is just for logging

    return {
      status: 'evaluated',
      branches: node.data.branches
    };
  }

  async executeAction(node, context) {
    console.log(`  Action: ${node.data.label}`);

    // Execute each action in the node
    const results = [];

    for (const action of node.data.actions) {
      console.log(`    - ${action.title}`);

      // In real implementation:
      // - Create case in system
      // - Send webhook
      // - Trigger email
      // - etc.

      results.push({
        actionType: action.type,
        title: action.title,
        status: 'completed'
      });
    }

    return {
      status: 'completed',
      actions: results
    };
  }
}

export default WorkflowExecutor;
```

## 🚀 Usage Examples

### Example 1: Simple Execution

```javascript
import WorkflowExecutor from './utils/workflowExecutor';

// Load workflow JSON
const workflow = {
  nodes: [
    {
      id: 'start',
      type: 'level',
      data: {
        label: 'Collect Data',
        levelName: 'Basic Info',
        steps: ['APPLICANT_DATA']
      }
    },
    {
      id: 'verify',
      type: 'level',
      data: {
        label: 'Verify ID',
        levelName: 'Identity Check',
        steps: ['IDENTITY']
      }
    }
  ],
  edges: [
    { source: 'start', target: 'verify' }
  ]
};

// Execute workflow
const executor = new WorkflowExecutor(workflow);
const result = await executor.execute();

console.log(result);
// Output:
// {
//   success: true,
//   executionLog: [
//     { nodeId: 'start', nodeType: 'level', label: 'Collect Data', ... },
//     { nodeId: 'verify', nodeType: 'level', label: 'Verify ID', ... }
//   ]
// }
```

### Example 2: With If/Else Logic

```javascript
const workflowWithCondition = {
  nodes: [
    {
      id: 'check-age',
      type: 'level',
      data: { label: 'Check Age', levelName: 'Age Verification', steps: [] }
    },
    {
      id: 'condition',
      type: 'condition',
      data: {
        label: 'Is Adult?',
        branches: [
          { name: 'Branch 1', condition: 'age >= 18' }
        ]
      }
    },
    {
      id: 'adult-path',
      type: 'action',
      data: {
        label: 'Approve',
        actions: [{ type: 'approve', title: 'Approve Application' }]
      }
    },
    {
      id: 'minor-path',
      type: 'action',
      data: {
        label: 'Reject',
        actions: [{ type: 'reject', title: 'Reject - Too Young' }]
      }
    }
  ],
  edges: [
    { source: 'check-age', target: 'condition' },
    { source: 'condition', target: 'adult-path', sourceHandle: 'branch-0' },
    { source: 'condition', target: 'minor-path', sourceHandle: 'else' }
  ]
};

// Execute with context data
const executor = new WorkflowExecutor(workflowWithCondition);

// Case 1: User is adult
const result1 = await executor.execute({ age: 25 });
console.log(result1.executionLog.map(log => log.label));
// Output: ['Check Age', 'Is Adult?', 'Approve']

// Case 2: User is minor
const result2 = await executor.execute({ age: 15 });
console.log(result2.executionLog.map(log => log.label));
// Output: ['Check Age', 'Is Adult?', 'Reject']
```

### Example 3: Multiple Conditions

```javascript
const complexWorkflow = {
  nodes: [
    { id: 'start', type: 'level', data: { label: 'Start' } },
    {
      id: 'check-country',
      type: 'condition',
      data: {
        label: 'Country Check',
        branches: [
          { name: 'Singapore', condition: 'country equals Singapore' },
          { name: 'USA', condition: 'country equals USA' }
        ]
      }
    },
    { id: 'sg-path', type: 'level', data: { label: 'Singapore KYC' } },
    { id: 'usa-path', type: 'level', data: { label: 'USA KYC' } },
    { id: 'other-path', type: 'level', data: { label: 'International KYC' } }
  ],
  edges: [
    { source: 'start', target: 'check-country' },
    { source: 'check-country', target: 'sg-path', sourceHandle: 'branch-0' },
    { source: 'check-country', target: 'usa-path', sourceHandle: 'branch-1' },
    { source: 'check-country', target: 'other-path', sourceHandle: 'else' }
  ]
};

const executor = new WorkflowExecutor(complexWorkflow);

// Execute for Singapore user
await executor.execute({ country: 'Singapore' });
// Takes: start → check-country → sg-path

// Execute for USA user
await executor.execute({ country: 'USA' });
// Takes: start → check-country → usa-path

// Execute for UK user
await executor.execute({ country: 'UK' });
// Takes: start → check-country → other-path (else branch)
```

## 🔍 Extracting Specific Flows

### Get All Possible Paths

```javascript
class WorkflowAnalyzer {
  constructor(workflow) {
    this.executor = new WorkflowExecutor(workflow);
  }

  // Get all possible execution paths
  getAllPaths() {
    const paths = [];
    const startNode = this.executor.getStartNode();

    if (!startNode) return paths;

    this.traversePaths(startNode.id, [], paths);
    return paths;
  }

  traversePaths(nodeId, currentPath, allPaths) {
    const node = this.executor.nodeMap[nodeId];
    currentPath.push({
      id: nodeId,
      label: node.data.label,
      type: node.type
    });

    const edges = this.executor.edgeMap[nodeId] || [];

    if (edges.length === 0) {
      // End of path
      allPaths.push([...currentPath]);
      return;
    }

    // For condition nodes, explore all branches
    if (node.type === 'condition') {
      edges.forEach(edge => {
        const branchName = edge.sourceHandle === 'else'
          ? 'else'
          : `branch-${edge.sourceHandle.split('-')[1]}`;

        const pathCopy = [...currentPath];
        pathCopy[pathCopy.length - 1].branch = branchName;

        this.traversePaths(edge.target, pathCopy, allPaths);
      });
    } else {
      // For regular nodes, continue to next
      edges.forEach(edge => {
        this.traversePaths(edge.target, [...currentPath], allPaths);
      });
    }
  }

  // Get flow as a tree structure
  getFlowTree() {
    const startNode = this.executor.getStartNode();
    if (!startNode) return null;

    return this.buildTree(startNode.id);
  }

  buildTree(nodeId, visited = new Set()) {
    if (visited.has(nodeId)) {
      return { error: 'Cycle detected' };
    }

    visited.add(nodeId);
    const node = this.executor.nodeMap[nodeId];
    const edges = this.executor.edgeMap[nodeId] || [];

    const tree = {
      id: nodeId,
      label: node.data.label,
      type: node.type,
      children: []
    };

    if (node.type === 'condition') {
      // Show branches
      edges.forEach(edge => {
        const branchName = edge.sourceHandle === 'else'
          ? 'else'
          : node.data.branches[parseInt(edge.sourceHandle.split('-')[1])]?.name || 'branch';

        tree.children.push({
          branch: branchName,
          condition: edge.sourceHandle === 'else'
            ? 'default'
            : node.data.branches[parseInt(edge.sourceHandle.split('-')[1])]?.condition,
          next: this.buildTree(edge.target, new Set(visited))
        });
      });
    } else {
      edges.forEach(edge => {
        tree.children.push(this.buildTree(edge.target, new Set(visited)));
      });
    }

    return tree;
  }
}

// Usage:
const analyzer = new WorkflowAnalyzer(workflow);

// Get all possible paths
const paths = analyzer.getAllPaths();
console.log('All possible paths:', paths);
// Output:
// [
//   [
//     { id: 'start', label: 'Start', type: 'level' },
//     { id: 'condition', label: 'Check', type: 'condition', branch: 'branch-0' },
//     { id: 'path-a', label: 'Path A', type: 'level' }
//   ],
//   [
//     { id: 'start', label: 'Start', type: 'level' },
//     { id: 'condition', label: 'Check', type: 'condition', branch: 'else' },
//     { id: 'path-b', label: 'Path B', type: 'level' }
//   ]
// ]

// Get tree structure
const tree = analyzer.getFlowTree();
console.log('Flow tree:', JSON.stringify(tree, null, 2));
```

## 🎨 Frontend Integration

### React Component Example

```javascript
// src/components/WorkflowRunner.js
import React, { useState } from 'react';
import WorkflowExecutor from '../utils/workflowExecutor';

function WorkflowRunner({ workflow }) {
  const [currentNode, setCurrentNode] = useState(null);
  const [context, setContext] = useState({});
  const [executionLog, setExecutionLog] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const startWorkflow = async () => {
    setIsRunning(true);
    setExecutionLog([]);

    const executor = new WorkflowExecutor(workflow);
    const startNode = executor.getStartNode();

    await runStep(executor, startNode.id);
  };

  const runStep = async (executor, nodeId) => {
    const node = executor.nodeMap[nodeId];
    setCurrentNode(node);

    // Execute current node
    const result = await executor.executeNode(node, context);

    setExecutionLog(prev => [...prev, {
      nodeId,
      label: node.data.label,
      result
    }]);

    // Simulate delay for visualization
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get next node
    const nextNodes = executor.getNextNodes(nodeId, context);

    if (nextNodes.length > 0) {
      await runStep(executor, nextNodes[0].nodeId);
    } else {
      setIsRunning(false);
      setCurrentNode(null);
    }
  };

  return (
    <div className="workflow-runner">
      <button onClick={startWorkflow} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Start Workflow'}
      </button>

      {currentNode && (
        <div className="current-step">
          <h3>Current Step: {currentNode.data.label}</h3>
          <p>Type: {currentNode.type}</p>
        </div>
      )}

      <div className="execution-log">
        <h4>Execution Log:</h4>
        {executionLog.map((log, idx) => (
          <div key={idx} className="log-entry">
            {idx + 1}. {log.label} - {log.result.status}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkflowRunner;
```

### Adding to App.js

```javascript
// src/App.js
import WorkflowRunner from './components/WorkflowRunner';

function App() {
  const [showRunner, setShowRunner] = useState(false);

  return (
    <div>
      {/* Existing workflow builder */}

      {/* Add button in toolbar */}
      <button onClick={() => setShowRunner(!showRunner)}>
        ▶️ Run Workflow
      </button>

      {/* Modal or panel with runner */}
      {showRunner && (
        <div className="workflow-runner-modal">
          <WorkflowRunner workflow={{ nodes, edges }} />
        </div>
      )}
    </div>
  );
}
```

## 📊 Real-World Use Cases

### Use Case 1: KYC Verification Flow

```javascript
const kycWorkflow = {
  nodes: [
    {
      id: 'collect-data',
      type: 'level',
      data: { label: 'Collect Personal Data', steps: ['APPLICANT_DATA'] }
    },
    {
      id: 'check-country',
      type: 'condition',
      data: {
        label: 'Country Check',
        branches: [
          { name: 'High Risk', condition: 'riskLevel equals high' }
        ]
      }
    },
    {
      id: 'enhanced-kyc',
      type: 'level',
      data: { label: 'Enhanced KYC', steps: ['IDENTITY', 'SELFIE', 'PROOF_OF_ADDRESS'] }
    },
    {
      id: 'standard-kyc',
      type: 'level',
      data: { label: 'Standard KYC', steps: ['IDENTITY', 'SELFIE'] }
    },
    {
      id: 'final-check',
      type: 'action',
      data: {
        label: 'Final Review',
        actions: [{ type: 'createCase', title: 'Send to Manual Review' }]
      }
    }
  ],
  edges: [
    { source: 'collect-data', target: 'check-country' },
    { source: 'check-country', target: 'enhanced-kyc', sourceHandle: 'branch-0' },
    { source: 'check-country', target: 'standard-kyc', sourceHandle: 'else' },
    { source: 'enhanced-kyc', target: 'final-check' },
    { source: 'standard-kyc', target: 'final-check' }
  ]
};

// Execute for high-risk user
const executor = new WorkflowExecutor(kycWorkflow);
await executor.execute({ riskLevel: 'high' });
// Path: collect-data → check-country → enhanced-kyc → final-check

// Execute for low-risk user
await executor.execute({ riskLevel: 'low' });
// Path: collect-data → check-country → standard-kyc → final-check
```

### Use Case 2: Dynamic Form Flow

```javascript
// Execute workflow and show forms based on current step
async function runInteractiveWorkflow(workflow, onStepChange) {
  const executor = new WorkflowExecutor(workflow);
  let currentNodeId = executor.getStartNode().id;
  const userContext = {};

  while (currentNodeId) {
    const node = executor.nodeMap[currentNodeId];

    if (node.type === 'level') {
      // Show form and wait for user input
      const userData = await onStepChange({
        type: 'form',
        fields: node.data.steps,
        label: node.data.label
      });

      // Merge user data into context
      Object.assign(userContext, userData);
    }

    // Get next step
    const nextNodes = executor.getNextNodes(currentNodeId, userContext);
    currentNodeId = nextNodes[0]?.nodeId;
  }

  return userContext;
}

// Usage in React:
const handleStepChange = async (stepConfig) => {
  return new Promise((resolve) => {
    setCurrentForm(stepConfig);
    setFormSubmitCallback(() => resolve);
  });
};

await runInteractiveWorkflow(workflow, handleStepChange);
```

## 🔧 Advanced Features

### Add Validation

```javascript
validateWorkflow() {
  const errors = [];

  // Check for unreachable nodes
  const reachable = new Set();
  const startNode = this.getStartNode();

  this.markReachable(startNode.id, reachable);

  this.nodes.forEach(node => {
    if (!reachable.has(node.id)) {
      errors.push(`Unreachable node: ${node.data.label}`);
    }
  });

  return errors;
}
```

### Add Logging

```javascript
executeNode(node, context) {
  console.log(`[${new Date().toISOString()}] Executing: ${node.data.label}`);

  // Send to analytics
  analytics.track('workflow_node_executed', {
    nodeId: node.id,
    nodeType: node.type,
    label: node.data.label
  });

  // Continue execution...
}
```

### Add Error Handling

```javascript
async executeNode(node, context) {
  try {
    const result = await this._executeNode(node, context);
    return { success: true, result };
  } catch (error) {
    console.error(`Error executing node ${node.id}:`, error);

    return {
      success: false,
      error: error.message,
      nodeId: node.id
    };
  }
}
```

---

## 🎯 Summary

**Key Points:**

1. **Edges define flow**: `source` → `target` shows direction
2. **sourceHandle identifies branches**: `branch-0`, `branch-1`, `else`
3. **Condition nodes split flow**: Evaluate context to pick branch
4. **Context carries data**: Pass user data through execution
5. **Executor follows edges**: Step by step, node by node

**The Flow:**
```
Load JSON → Build Maps → Find Start → Execute Node → Get Next → Repeat
```

**For Conditions:**
```
Reach Condition → Evaluate Context → Pick Branch → Continue Flow
```

Now you can execute any workflow logic! 🚀
