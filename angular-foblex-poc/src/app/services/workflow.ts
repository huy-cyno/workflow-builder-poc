import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WorkflowNode {
  id: string;
  type: 'level' | 'condition' | 'action';
  position: { x: number; y: number };
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
  metadata: {
    version: number;
    createdAt: string;
    updatedAt: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private nodesSubject = new BehaviorSubject<WorkflowNode[]>([]);
  private edgesSubject = new BehaviorSubject<WorkflowEdge[]>([]);
  private selectedNodeSubject = new BehaviorSubject<WorkflowNode | null>(null);

  public nodes$ = this.nodesSubject.asObservable();
  public edges$ = this.edgesSubject.asObservable();
  public selectedNode$ = this.selectedNodeSubject.asObservable();

  constructor() {}

  // Node management
  getNodes(): WorkflowNode[] {
    return this.nodesSubject.value;
  }

  getEdges(): WorkflowEdge[] {
    return this.edgesSubject.value;
  }

  addNode(node: WorkflowNode): void {
    const currentNodes = this.nodesSubject.value;
    this.nodesSubject.next([...currentNodes, node]);
  }

  updateNode(nodeId: string, updatedData: any): void {
    const nodes = this.nodesSubject.value.map(node =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...updatedData } } : node
    );
    this.nodesSubject.next(nodes);
  }

  deleteNode(nodeId: string): void {
    const nodes = this.nodesSubject.value.filter(node => node.id !== nodeId);
    const edges = this.edgesSubject.value.filter(
      edge => edge.source !== nodeId && edge.target !== nodeId
    );
    this.nodesSubject.next(nodes);
    this.edgesSubject.next(edges);
    this.selectedNodeSubject.next(null);
  }

  selectNode(node: WorkflowNode | null): void {
    this.selectedNodeSubject.next(node);
  }

  // Edge management
  addEdge(edge: WorkflowEdge): void {
    const currentEdges = this.edgesSubject.value;
    this.edgesSubject.next([...currentEdges, edge]);
  }

  deleteEdge(edgeId: string): void {
    const edges = this.edgesSubject.value.filter(edge => edge.id !== edgeId);
    this.edgesSubject.next(edges);
  }

  // Workflow management
  saveWorkflow(): Workflow {
    return {
      nodes: this.nodesSubject.value,
      edges: this.edgesSubject.value,
      metadata: {
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  loadWorkflow(workflow: Workflow): void {
    this.nodesSubject.next(workflow.nodes);
    this.edgesSubject.next(workflow.edges);
    this.selectedNodeSubject.next(null);
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
      node => !edges.some(edge => edge.target === node.id)
    );
  }

  getEndNodes(): WorkflowNode[] {
    const edges = this.edgesSubject.value;
    return this.nodesSubject.value.filter(
      node => !edges.some(edge => edge.source === node.id)
    );
  }

  getAllPaths(): string[][] {
    const nodes = this.nodesSubject.value;
    const edges = this.edgesSubject.value;
    const startNode = this.getStartNode();
    const paths: string[][] = [];

    if (!startNode) return paths;

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

  isBefore(nodeAId: string, nodeBId: string): boolean {
    const edges = this.edgesSubject.value;
    const visited = new Set<string>();

    const search = (currentId: string): boolean => {
      if (currentId === nodeBId) return true;
      if (visited.has(currentId)) return false;
      visited.add(currentId);

      const nextEdges = edges.filter(e => e.source === currentId);
      return nextEdges.some(e => search(e.target));
    };

    return search(nodeAId);
  }
}
