import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WorkflowNode, WorkflowEdge } from './workflow';

export interface ExecutionStep {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  status: 'pending' | 'executing' | 'completed' | 'skipped';
  timestamp: number;
  output?: any;
}

export interface ExecutionTrace {
  id: string;
  startTime: number;
  endTime?: number;
  steps: ExecutionStep[];
  currentNodeId?: string;
  completed: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  private executionTraceSubject = new BehaviorSubject<ExecutionTrace | null>(null);
  private executingSubject = new BehaviorSubject<boolean>(false);

  public executionTrace$ = this.executionTraceSubject.asObservable();
  public executing$ = this.executingSubject.asObservable();

  constructor() {}

  /**
   * Execute workflow simulation starting from the start node
   */
  async executeWorkflow(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    onStepExecute?: (step: ExecutionStep) => void
  ): Promise<ExecutionTrace> {
    const trace: ExecutionTrace = {
      id: `trace-${Date.now()}`,
      startTime: Date.now(),
      steps: [],
      completed: false,
    };

    this.executingSubject.next(true);
    this.executionTraceSubject.next(trace);

    try {
      // Find start node (no incoming edges)
      const startNode = nodes.find(n => !edges.some(e => e.target === n.id));

      if (!startNode) {
        trace.error = 'No start node found (node with no incoming connections)';
        trace.completed = true;
        trace.endTime = Date.now();
        this.executionTraceSubject.next(trace);
        this.executingSubject.next(false);
        return trace;
      }

      // Execute from start node
      await this.executeNode(startNode, nodes, edges, trace, onStepExecute);

      trace.completed = true;
      trace.endTime = Date.now();
    } catch (error) {
      trace.error = error instanceof Error ? error.message : 'Unknown error';
      trace.endTime = Date.now();
    }

    this.executionTraceSubject.next(trace);
    this.executingSubject.next(false);
    return trace;
  }

  /**
   * Execute a single node and trace execution path
   */
  private async executeNode(
    node: WorkflowNode,
    allNodes: WorkflowNode[],
    edges: WorkflowEdge[],
    trace: ExecutionTrace,
    onStepExecute?: (step: ExecutionStep) => void
  ): Promise<void> {
    // Simulate execution delay
    await this.delay(500);

    // Create execution step
    const step: ExecutionStep = {
      nodeId: node.id,
      nodeName: node.data.label || `${node.type} Node`,
      nodeType: node.type,
      status: 'executing',
      timestamp: Date.now(),
    };

    trace.currentNodeId = node.id;
    trace.steps.push(step);

    if (onStepExecute) {
      onStepExecute(step);
    }

    this.executionTraceSubject.next({ ...trace });

    // Simulate execution
    await this.delay(800);
    step.status = 'completed';
    step.output = this.generateNodeOutput(node);

    // Find next nodes based on node type
    const nextEdges = edges.filter(e => e.source === node.id);

    if (nextEdges.length === 0) {
      // End node reached
      trace.steps[trace.steps.length - 1].status = 'completed';
      return;
    }

    if (node.type === 'condition') {
      // For condition nodes, follow first branch
      // In real implementation, would evaluate condition
      const firstEdge = nextEdges[0];
      const nextNode = allNodes.find(n => n.id === firstEdge.target);

      if (nextNode) {
        await this.delay(300);
        await this.executeNode(nextNode, allNodes, edges, trace, onStepExecute);
      }
    } else {
      // For level and action nodes, follow the single output
      const nextEdge = nextEdges[0];
      const nextNode = allNodes.find(n => n.id === nextEdge.target);

      if (nextNode) {
        await this.delay(300);
        await this.executeNode(nextNode, allNodes, edges, trace, onStepExecute);
      }
    }
  }

  /**
   * Get current execution trace
   */
  getCurrentTrace(): ExecutionTrace | null {
    return this.executionTraceSubject.value;
  }

  /**
   * Clear execution trace
   */
  clearTrace(): void {
    this.executionTraceSubject.next(null);
  }

  /**
   * Reset execution service
   */
  reset(): void {
    this.executionTraceSubject.next(null);
    this.executingSubject.next(false);
  }

  /**
   * Generate mock output for a node
   */
  private generateNodeOutput(node: WorkflowNode): any {
    switch (node.type) {
      case 'level':
        return {
          level: node.data.label,
          type: node.data.levelType,
          steps: node.data.steps,
          status: 'completed',
        };
      case 'condition':
        return {
          condition: node.data.label,
          result: true,
          timestamp: new Date().toISOString(),
        };
      case 'action':
        return {
          action: node.data.label,
          result: 'success',
          executedAt: new Date().toISOString(),
        };
      default:
        return { executed: true };
    }
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get execution duration in milliseconds
   */
  getExecutionDuration(trace: ExecutionTrace): number {
    if (trace.endTime) {
      return trace.endTime - trace.startTime;
    }
    return Date.now() - trace.startTime;
  }

  /**
   * Get execution path as node names
   */
  getExecutionPath(trace: ExecutionTrace): string[] {
    return trace.steps.map(s => s.nodeName);
  }

  /**
   * Get execution statistics
   */
  getExecutionStats(trace: ExecutionTrace): {
    totalSteps: number;
    completedSteps: number;
    duration: number;
    path: string[];
  } {
    return {
      totalSteps: trace.steps.length,
      completedSteps: trace.steps.filter(s => s.status === 'completed').length,
      duration: this.getExecutionDuration(trace),
      path: this.getExecutionPath(trace),
    };
  }
}
