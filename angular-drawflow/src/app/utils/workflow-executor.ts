/**
 * Workflow Execution Engine for Angular + Drawflow
 *
 * Parses and executes workflow JSON, handling if/else logic and branching.
 */

export interface WorkflowNode {
  id: string;
  name: string;
  html: string;
  class: string;
  data: any;
  inputs: any;
  outputs: any;
  pos_x: number;
  pos_y: number;
}

export interface DrawflowData {
  drawflow: {
    Home: {
      data: {
        [key: string]: WorkflowNode;
      };
    };
  };
}

export interface ExecutionLog {
  step: number;
  nodeId: string;
  nodeType: string;
  label: string;
  result: any;
  timestamp: string;
}

export interface ExecutionResult {
  success: boolean;
  steps: number;
  executionLog: ExecutionLog[];
  context: any;
  summary: {
    totalSteps: number;
    nodeTypeCount: { [key: string]: number };
    executionPath: string[];
    startTime?: string;
    endTime?: string;
  };
}

export class WorkflowExecutor {
  private nodes: { [key: string]: WorkflowNode } = {};
  private nodeConnections: { [key: string]: { output: string; input: string; nodeId: string }[] } = {};

  constructor(drawflowData: DrawflowData) {
    this.nodes = drawflowData.drawflow.Home.data;
    this.buildConnectionMap();
  }

  /**
   * Build connection map from Drawflow structure
   */
  private buildConnectionMap(): void {
    Object.keys(this.nodes).forEach(nodeId => {
      const node = this.nodes[nodeId];

      // For each output connection
      Object.keys(node.outputs || {}).forEach(outputKey => {
        const output = node.outputs[outputKey];
        output.connections.forEach((conn: any) => {
          if (!this.nodeConnections[nodeId]) {
            this.nodeConnections[nodeId] = [];
          }

          this.nodeConnections[nodeId].push({
            output: outputKey,
            input: conn.input,
            nodeId: conn.node
          });
        });
      });
    });
  }

  /**
   * Find the starting node (node with no incoming connections)
   */
  private getStartNode(): WorkflowNode | null {
    const nodesWithInput = new Set<string>();

    Object.keys(this.nodes).forEach(nodeId => {
      const node = this.nodes[nodeId];
      Object.keys(node.inputs || {}).forEach(inputKey => {
        const input = node.inputs[inputKey];
        if (input.connections && input.connections.length > 0) {
          nodesWithInput.add(nodeId);
        }
      });
    });

    const startNodeId = Object.keys(this.nodes).find(id => !nodesWithInput.has(id));
    return startNodeId ? this.nodes[startNodeId] : null;
  }

  /**
   * Get next nodes based on current node
   */
  private getNextNodes(nodeId: string, context: any = {}): string[] {
    const connections = this.nodeConnections[nodeId] || [];
    const currentNode = this.nodes[nodeId];

    if (!currentNode) {
      return [];
    }

    // If it's a condition node, evaluate which path to take
    if (currentNode.class.includes('condition')) {
      return this.evaluateCondition(currentNode, connections, context);
    }

    // Otherwise return all connected nodes
    return connections.map(conn => conn.nodeId);
  }

  /**
   * Evaluate condition and return matching branch
   */
  private evaluateCondition(node: WorkflowNode, connections: any[], context: any): string[] {
    const branches = node.data.branches || [];

    // Check each branch condition
    for (let i = 0; i < branches.length; i++) {
      const branch = branches[i];

      if (this.checkCondition(branch.condition, context)) {
        console.log(`  ✓ Condition matched: ${branch.name}`);

        // Find connection for this branch (output_1, output_2, etc.)
        const branchConn = connections.find(c => c.output === `output_${i + 1}`);
        if (branchConn) {
          return [branchConn.nodeId];
        }
      }
    }

    // If no condition matched, take the 'else' path
    console.log(`  Taking 'else' branch`);
    const elseConn = connections.find(c =>
      c.output === `output_${branches.length + 1}` || c.output === 'output_else'
    );

    return elseConn ? [elseConn.nodeId] : [];
  }

  /**
   * Check if condition evaluates to true
   */
  private checkCondition(conditionString: string, context: any): boolean {
    // Pattern 1: "field equals value"
    const equalsPattern = /^(\w+)\s+equals\s+(.+)$/i;
    const equalsMatch = conditionString.match(equalsPattern);
    if (equalsMatch) {
      const field = equalsMatch[1];
      const value = equalsMatch[2].trim();
      return this.evaluateExpression(field, 'equals', value, context);
    }

    // Pattern 2: "field operator value"
    const operatorPattern = /^(\w+)\s*(>=|<=|>|<|==|!=)\s*(.+)$/;
    const operatorMatch = conditionString.match(operatorPattern);
    if (operatorMatch) {
      const field = operatorMatch[1];
      const operator = operatorMatch[2];
      const value = operatorMatch[3].trim();
      return this.evaluateExpression(field, operator, value, context);
    }

    return false;
  }

  /**
   * Evaluate expression
   */
  private evaluateExpression(field: string, operator: string, expectedValue: string, context: any): boolean {
    const actualValue = context[field];

    if (actualValue === undefined) {
      return false;
    }

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
        return false;
    }
  }

  /**
   * Execute the workflow
   */
  async execute(context: any = {}, maxSteps: number = 100): Promise<ExecutionResult> {
    const executionLog: ExecutionLog[] = [];
    const startNode = this.getStartNode();

    if (!startNode) {
      throw new Error('No start node found in workflow');
    }

    console.log('\n=== Starting Workflow Execution ===\n');

    let currentNodeId = Object.keys(this.nodes).find(id => this.nodes[id] === startNode);
    const visited = new Set<string>();
    let stepCount = 0;

    while (currentNodeId && stepCount < maxSteps) {
      stepCount++;

      if (visited.has(currentNodeId)) {
        throw new Error(`Cycle detected at node: ${currentNodeId}`);
      }
      visited.add(currentNodeId);

      const currentNode = this.nodes[currentNodeId];

      if (!currentNode) {
        throw new Error(`Node not found: ${currentNodeId}`);
      }

      console.log(`\n[Step ${stepCount}] ${currentNode.data.label}`);

      const result = await this.executeNode(currentNode, context);

      executionLog.push({
        step: stepCount,
        nodeId: currentNodeId,
        nodeType: this.getNodeType(currentNode),
        label: currentNode.data.label,
        result: result,
        timestamp: new Date().toISOString()
      });

      const nextNodes = this.getNextNodes(currentNodeId, context);

      if (nextNodes.length === 0) {
        console.log('\n✓ Workflow completed successfully');
        break;
      }

      currentNodeId = nextNodes[0];
    }

    if (stepCount >= maxSteps) {
      throw new Error(`Workflow exceeded maximum steps (${maxSteps})`);
    }

    return {
      success: true,
      steps: stepCount,
      executionLog,
      context,
      summary: this.generateSummary(executionLog)
    };
  }

  /**
   * Get node type from class name
   */
  private getNodeType(node: WorkflowNode): string {
    if (node.class.includes('level')) return 'level';
    if (node.class.includes('condition')) return 'condition';
    if (node.class.includes('action')) return 'action';
    return 'unknown';
  }

  /**
   * Execute a single node
   */
  private async executeNode(node: WorkflowNode, context: any): Promise<any> {
    const nodeType = this.getNodeType(node);

    switch (nodeType) {
      case 'level':
        return {
          status: 'completed',
          nodeType: 'level',
          data: node.data
        };

      case 'condition':
        return {
          status: 'evaluated',
          nodeType: 'condition',
          branches: node.data.branches || []
        };

      case 'action':
        return {
          status: 'completed',
          nodeType: 'action',
          actions: node.data.actions || []
        };

      default:
        return { status: 'skipped' };
    }
  }

  /**
   * Generate execution summary
   */
  private generateSummary(executionLog: ExecutionLog[]): any {
    const nodeTypes: { [key: string]: number } = {};
    const path: string[] = [];

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
