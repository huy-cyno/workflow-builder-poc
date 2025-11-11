/**
 * Workflow Execution Engine
 *
 * Parses and executes workflow JSON, handling if/else logic and branching.
 *
 * Usage:
 *   const executor = new WorkflowExecutor(workflow);
 *   const result = await executor.execute({ age: 25, country: 'Singapore' });
 */

class WorkflowExecutor {
  constructor(workflow) {
    this.nodes = workflow.nodes || [];
    this.edges = workflow.edges || [];
    this.nodeMap = this.buildNodeMap();
    this.edgeMap = this.buildEdgeMap();
  }

  /**
   * Build quick lookup map: nodeId -> node
   */
  buildNodeMap() {
    const map = {};
    this.nodes.forEach(node => {
      map[node.id] = node;
    });
    return map;
  }

  /**
   * Build quick lookup map: nodeId -> outgoing edges
   */
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

  /**
   * Find the starting node (node with no incoming edges)
   */
  getStartNode() {
    return this.nodes.find(node =>
      !this.edges.some(edge => edge.target === node.id)
    );
  }

  /**
   * Get next nodes based on current node and context
   *
   * For condition nodes, evaluates which branch to take.
   * For regular nodes, returns all connected nodes.
   *
   * @param {string} nodeId - Current node ID
   * @param {object} context - Execution context (user data)
   * @returns {Array} Array of { nodeId, edge, branch? }
   */
  getNextNodes(nodeId, context = {}) {
    const edges = this.edgeMap[nodeId] || [];
    const currentNode = this.nodeMap[nodeId];

    if (!currentNode) {
      console.error(`Node not found: ${nodeId}`);
      return [];
    }

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

  /**
   * Evaluate condition node and return the matching branch
   *
   * Checks each branch condition in order.
   * Returns first matching branch, or 'else' branch if none match.
   *
   * @param {object} conditionNode - The condition node
   * @param {Array} edges - Outgoing edges from this node
   * @param {object} context - Execution context
   * @returns {Array} Single element array with next node info
   */
  evaluateCondition(conditionNode, edges, context) {
    const branches = conditionNode.data.branches || [];

    // Check each branch condition in order
    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];

      console.log(`  Evaluating: ${branch.condition}`);

      // Evaluate the condition
      if (this.checkCondition(branch.condition, context)) {
        console.log(`  ✓ Condition matched: ${branch.name}`);

        // Find the edge with this branch's handle
        const edge = edges.find(e => e.sourceHandle === `branch-${i}`);
        if (edge) {
          return [{
            nodeId: edge.target,
            edge,
            branch: branch.name,
            condition: branch.condition
          }];
        }
      } else {
        console.log(`  ✗ Condition not matched`);
      }
    }

    // If no condition matched, take the 'else' path
    console.log(`  Taking 'else' branch`);
    const elseEdge = edges.find(e => e.sourceHandle === 'else');
    if (elseEdge) {
      return [{
        nodeId: elseEdge.target,
        edge: elseEdge,
        branch: 'else'
      }];
    }

    console.warn('No matching branch found and no else branch defined');
    return [];
  }

  /**
   * Check if a condition string evaluates to true
   *
   * Supports:
   * - "field equals value"
   * - "field >= value"
   * - "field > value"
   * - "field < value"
   * - "field <= value"
   * - "field == value"
   * - "field != value"
   *
   * @param {string} conditionString - Condition to evaluate
   * @param {object} context - Data to evaluate against
   * @returns {boolean}
   */
  checkCondition(conditionString, context) {
    // Pattern 1: "field equals value"
    const equalsPattern = /^(\w+)\s+equals\s+(.+)$/i;
    const equalsMatch = conditionString.match(equalsPattern);
    if (equalsMatch) {
      const field = equalsMatch[1];
      const value = equalsMatch[2].trim();
      return this.evaluateExpression(field, 'equals', value, context);
    }

    // Pattern 2: "field operator value" (>=, <=, >, <, ==, !=)
    const operatorPattern = /^(\w+)\s*(>=|<=|>|<|==|!=)\s*(.+)$/;
    const operatorMatch = conditionString.match(operatorPattern);
    if (operatorMatch) {
      const field = operatorMatch[1];
      const operator = operatorMatch[2];
      const value = operatorMatch[3].trim();
      return this.evaluateExpression(field, operator, value, context);
    }

    console.warn(`Unable to parse condition: ${conditionString}`);
    return false;
  }

  /**
   * Evaluate a single expression
   *
   * @param {string} field - Field name from context
   * @param {string} operator - Comparison operator
   * @param {string} expectedValue - Value to compare against
   * @param {object} context - Execution context
   * @returns {boolean}
   */
  evaluateExpression(field, operator, expectedValue, context) {
    const actualValue = context[field];

    if (actualValue === undefined) {
      console.warn(`Field '${field}' not found in context`);
      return false;
    }

    console.log(`    Comparing: ${field}(${actualValue}) ${operator} ${expectedValue}`);

    switch (operator.toLowerCase()) {
      case 'equals':
      case '==':
        return String(actualValue).toLowerCase() === String(expectedValue).toLowerCase();

      case '!=':
        return String(actualValue).toLowerCase() !== String(expectedValue).toLowerCase();

      case '>':
        return Number(actualValue) > Number(expectedValue);

      case '<':
        return Number(actualValue) < Number(expectedValue);

      case '>=':
        return Number(actualValue) >= Number(expectedValue);

      case '<=':
        return Number(actualValue) <= Number(expectedValue);

      default:
        console.warn(`Unknown operator: ${operator}`);
        return false;
    }
  }

  /**
   * Execute the entire workflow
   *
   * Starts from the start node and follows edges until completion.
   *
   * @param {object} context - Initial context data (user input, etc.)
   * @param {object} options - Execution options
   * @param {number} options.maxSteps - Maximum steps to prevent infinite loops (default: 100)
   * @param {function} options.onStep - Callback for each step
   * @returns {Promise<object>} Execution result
   */
  async execute(context = {}, options = {}) {
    const {
      maxSteps = 100,
      onStep = null
    } = options;

    const executionLog = [];
    const startNode = this.getStartNode();

    if (!startNode) {
      throw new Error('No start node found in workflow');
    }

    console.log('\n=== Starting Workflow Execution ===\n');

    let currentNodeId = startNode.id;
    const visited = new Set();
    let stepCount = 0;

    while (currentNodeId && stepCount < maxSteps) {
      stepCount++;

      // Check for cycles
      if (visited.has(currentNodeId)) {
        throw new Error(`Cycle detected at node: ${currentNodeId}`);
      }
      visited.add(currentNodeId);

      const currentNode = this.nodeMap[currentNodeId];

      if (!currentNode) {
        throw new Error(`Node not found: ${currentNodeId}`);
      }

      console.log(`\n[Step ${stepCount}] ${currentNode.data.label}`);
      console.log(`Type: ${currentNode.type}`);

      // Execute the current node
      const result = await this.executeNode(currentNode, context);

      const logEntry = {
        step: stepCount,
        nodeId: currentNodeId,
        nodeType: currentNode.type,
        label: currentNode.data.label,
        result: result,
        timestamp: new Date().toISOString()
      };

      executionLog.push(logEntry);

      // Call step callback if provided
      if (onStep) {
        await onStep(logEntry);
      }

      // Get next node(s)
      const nextNodes = this.getNextNodes(currentNodeId, context);

      if (nextNodes.length === 0) {
        // End of workflow
        console.log('\n✓ Workflow completed successfully');
        break;
      }

      if (nextNodes.length > 1) {
        // Multiple paths - should not happen with proper conditions
        console.warn('Multiple next nodes found, taking first one');
      }

      const nextInfo = nextNodes[0];

      if (nextInfo.branch) {
        console.log(`→ Taking branch: ${nextInfo.branch}`);
        if (nextInfo.condition) {
          console.log(`  Condition: ${nextInfo.condition}`);
        }
      } else {
        console.log('→ Moving to next step');
      }

      // Move to next node
      currentNodeId = nextInfo.nodeId;
    }

    if (stepCount >= maxSteps) {
      throw new Error(`Workflow exceeded maximum steps (${maxSteps}). Possible infinite loop.`);
    }

    console.log(`\n=== Workflow Execution Complete (${stepCount} steps) ===\n`);

    return {
      success: true,
      steps: stepCount,
      executionLog,
      context,
      summary: this.generateSummary(executionLog)
    };
  }

  /**
   * Execute a single node
   *
   * Override this method to customize node execution behavior.
   *
   * @param {object} node - Node to execute
   * @param {object} context - Execution context
   * @returns {Promise<object>} Execution result
   */
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
        return { status: 'skipped', reason: 'Unknown node type' };
    }
  }

  /**
   * Execute a level node (verification step)
   */
  async executeLevel(node, context) {
    console.log(`  Level: ${node.data.levelName || 'N/A'}`);
    console.log(`  Type: ${node.data.levelType || 'N/A'}`);
    console.log(`  Steps: ${(node.data.steps || []).join(', ') || 'None'}`);

    // In real implementation:
    // - Show form to collect data
    // - Verify documents
    // - Call verification APIs
    // - Update context with results

    return {
      status: 'completed',
      nodeType: 'level',
      data: {
        levelName: node.data.levelName,
        levelType: node.data.levelType,
        stepsCompleted: node.data.steps || []
      }
    };
  }

  /**
   * Execute a condition node (branching logic)
   */
  async executeCondition(node, context) {
    console.log(`  Evaluating condition: ${node.data.label}`);

    // The actual branching happens in getNextNodes()
    // This method is just for logging/tracking

    return {
      status: 'evaluated',
      nodeType: 'condition',
      branches: node.data.branches || []
    };
  }

  /**
   * Execute an action node (trigger, webhook, etc.)
   */
  async executeAction(node, context) {
    console.log(`  Executing action: ${node.data.label}`);

    const results = [];

    // Execute each action in the node
    for (const action of node.data.actions || []) {
      console.log(`    - ${action.title || action.type}`);

      // In real implementation:
      // - Create case in system
      // - Send webhook
      // - Trigger email notification
      // - Update external system
      // - etc.

      results.push({
        actionType: action.type,
        title: action.title,
        value: action.value,
        status: 'completed',
        timestamp: new Date().toISOString()
      });
    }

    return {
      status: 'completed',
      nodeType: 'action',
      actions: results
    };
  }

  /**
   * Generate execution summary
   */
  generateSummary(executionLog) {
    const nodeTypes = {};
    const path = [];

    executionLog.forEach(entry => {
      nodeTypes[entry.nodeType] = (nodeTypes[entry.nodeType] || 0) + 1;
      path.push(entry.label);
    });

    return {
      totalSteps: executionLog.length,
      nodeTypeCount: nodeTypes,
      executionPath: path,
      startTime: executionLog[0]?.timestamp,
      endTime: executionLog[executionLog.length - 1]?.timestamp
    };
  }
}

export default WorkflowExecutor;
