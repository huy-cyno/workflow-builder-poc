import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: 'level' | 'condition' | 'action';
  position: Position;
  data: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  style?: any;
}

export interface Workflow {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private nodesSubject = new BehaviorSubject<WorkflowNode[]>([]);
  private edgesSubject = new BehaviorSubject<WorkflowEdge[]>([]);
  private selectedNodeSubject = new BehaviorSubject<WorkflowNode | null>(null);

  nodes$ = this.nodesSubject.asObservable();
  edges$ = this.edgesSubject.asObservable();
  selectedNode$ = this.selectedNodeSubject.asObservable();

  constructor() {}

  getNodes(): WorkflowNode[] {
    return this.nodesSubject.value;
  }

  getEdges(): WorkflowEdge[] {
    return this.edgesSubject.value;
  }

  addNode(node: WorkflowNode): void {
    // Validate position before adding
    const validatedNode = {
      ...node,
      position: {
        x: Number.isFinite(node.position?.x) ? node.position.x : 250,
        y: Number.isFinite(node.position?.y) ? node.position.y : 250
      }
    };

    console.log('🔧 Service addNode - Input:', {
      id: node.id,
      position: node.position,
      posX: node.position?.x,
      posY: node.position?.y
    });

    console.log('🔧 Service addNode - Validated:', {
      id: validatedNode.id,
      position: validatedNode.position,
      posX: validatedNode.position.x,
      posY: validatedNode.position.y
    });

    const nodes = [...this.nodesSubject.value, validatedNode];
    this.nodesSubject.next(nodes);
  }

  updateNode(id: string, updates: Partial<WorkflowNode>): void {
    const nodes = this.nodesSubject.value.map(n => {
      if (n.id === id) {
        const updatedNode = { ...n, ...updates };
        // Validate position if it's being updated
        if (updatedNode.position) {
          updatedNode.position = {
            x: Number.isFinite(updatedNode.position.x) ? updatedNode.position.x : 250,
            y: Number.isFinite(updatedNode.position.y) ? updatedNode.position.y : 250
          };
        }
        return updatedNode;
      }
      return n;
    });
    this.nodesSubject.next(nodes);
  }

  deleteNode(id: string): void {
    const nodes = this.nodesSubject.value.filter(n => n.id !== id);
    const edges = this.edgesSubject.value.filter(
      e => e.source !== id && e.target !== id
    );
    this.nodesSubject.next(nodes);
    this.edgesSubject.next(edges);
    this.selectedNodeSubject.next(null);
  }

  addEdge(edge: WorkflowEdge): void {
    // Check if edge already exists
    const edgeExists = this.edgesSubject.value.some(
      e => e.source === edge.source && e.target === edge.target
    );
    if (!edgeExists) {
      const edges = [...this.edgesSubject.value, edge];
      this.edgesSubject.next(edges);
    }
  }

  deleteEdge(id: string): void {
    const edges = this.edgesSubject.value.filter(e => e.id !== id);
    this.edgesSubject.next(edges);
  }

  selectNode(node: WorkflowNode | null): void {
    this.selectedNodeSubject.next(node);
  }

  loadWorkflow(workflow: Workflow): void {
    // Validate and fix node positions before loading
    const validatedNodes = workflow.nodes.map(node => ({
      ...node,
      position: {
        x: Number.isFinite(node.position?.x) ? node.position.x : 250,
        y: Number.isFinite(node.position?.y) ? node.position.y : 250
      }
    }));
    this.nodesSubject.next(validatedNodes);
    this.edgesSubject.next(workflow.edges);
    this.selectedNodeSubject.next(null);
  }

  saveWorkflow(): Workflow {
    return {
      nodes: this.nodesSubject.value,
      edges: this.edgesSubject.value
    };
  }

  clearWorkflow(): void {
    this.nodesSubject.next([]);
    this.edgesSubject.next([]);
    this.selectedNodeSubject.next(null);
  }

  // Analysis utilities
  getStartNode(): WorkflowNode | undefined {
    const edges = this.edgesSubject.value;
    return this.nodesSubject.value.find(
      n => !edges.some(e => e.target === n.id)
    );
  }

  getEndNodes(): WorkflowNode[] {
    const edges = this.edgesSubject.value;
    return this.nodesSubject.value.filter(
      n => !edges.some(e => e.source === n.id)
    );
  }

  getAllPaths(): string[][] {
    const startNode = this.getStartNode();
    if (!startNode) return [];

    const paths: string[][] = [];
    const edges = this.edgesSubject.value;

    const traverse = (nodeId: string, path: string[]) => {
      path.push(nodeId);
      const nextEdges = edges.filter(e => e.source === nodeId);

      if (nextEdges.length === 0) {
        paths.push([...path]);
      } else {
        nextEdges.forEach(edge => traverse(edge.target, [...path]));
      }
    };

    traverse(startNode.id, []);
    return paths;
  }
}
