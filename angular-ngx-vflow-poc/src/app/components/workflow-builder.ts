import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VflowComponent } from 'ngx-vflow';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WorkflowService, WorkflowNode, WorkflowEdge } from '../services/workflow';
import { TemplateWorkflowsService } from '../services/template-workflows';
import { ToolbarComponent } from './toolbar/toolbar';
import { SidebarComponent } from './sidebar/sidebar';
import { NodeEditorComponent } from './node-editor/node-editor';

interface VflowNode {
  id: string;
  label: string;
  type: string;
  position: { x: number; y: number };
  point: [number, number];
  width: number;
  height: number;
  data?: any;
  [key: string]: any;
}

interface VflowEdge {
  id: string;
  source: string;
  target: string;
  [key: string]: any;
}

@Component({
  selector: 'app-workflow-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VflowComponent,
    ToolbarComponent,
    SidebarComponent,
    NodeEditorComponent
  ],
  templateUrl: './workflow-builder.html',
  styleUrl: './workflow-builder.css'
})
export class WorkflowBuilder implements OnInit, OnDestroy {
  nodes: any[] = [];
  edges: any[] = [];
  selectedNode: WorkflowNode | null = null;
  isInitialized = false;

  private destroy$ = new Subject<void>();

  constructor(
    private workflowService: WorkflowService,
    private templateWorkflowsService: TemplateWorkflowsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('WorkflowBuilder ngx-vflow initialized');

    // Subscribe to workflow nodes
    this.workflowService.nodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(workflowNodes => {
        console.log('📥 Component received nodes from service:', {
          count: workflowNodes.length,
          sample: workflowNodes.slice(0, 2).map(n => ({
            id: n.id,
            position: n.position
          }))
        });

        // Build ABSOLUTE MINIMAL node structure for ngx-vflow
        this.nodes = workflowNodes.map((node, index) => {
          const x = Number.isFinite(node.position?.x) ? node.position.x : 100 + (index * 150);
          const y = Number.isFinite(node.position?.y) ? node.position.y : 150;

          // Try completely minimal structure first
          const vflowNode: any = {
            id: node.id,
            type: node.type,
            label: node.data?.label || 'Node',
            x: x,
            y: y
          };

          console.log('✅ MINIMAL vflow node:', {
            id: vflowNode.id,
            type: vflowNode.type,
            x: vflowNode.x,
            y: vflowNode.y
          });

          return vflowNode;
        });

        console.log('Nodes updated:', this.nodes.length);
        this.cdr.markForCheck();
      });

    // Subscribe to workflow edges
    this.workflowService.edges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(workflowEdges => {
        this.edges = workflowEdges;
        console.log('Edges updated:', this.edges.length);
        this.cdr.markForCheck();
      });

    // Subscribe to selected node
    this.workflowService.selectedNode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(node => {
        this.selectedNode = node;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNodeClick(nodeId: string): void {
    const node = this.workflowService.getNodes().find(n => n.id === nodeId);
    if (node) {
      this.workflowService.selectNode(node);
    }
  }

  onCreateConnection(event: any): void {
    console.log('Connection created:', event);

    if (!event.source || !event.target) {
      console.warn('Invalid connection event');
      return;
    }

    const sourceNodeId = event.source;
    const targetNodeId = event.target;

    // Validate nodes exist
    const sourceExists = this.workflowService.getNodes().find(n => n.id === sourceNodeId);
    const targetExists = this.workflowService.getNodes().find(n => n.id === targetNodeId);

    if (!sourceExists || !targetExists) {
      console.error('Connection failed: Invalid node IDs');
      return;
    }

    if (sourceNodeId === targetNodeId) {
      console.warn('Cannot connect a node to itself');
      return;
    }

    // Create the connection
    const edgeId = `edge-${Date.now()}`;
    const edge: WorkflowEdge = {
      id: edgeId,
      source: sourceNodeId,
      target: targetNodeId,
      type: 'smoothstep',
      style: { stroke: '#6D9DFF', strokeWidth: 2 }
    };

    console.log('✅ Creating connection:', edge);
    this.workflowService.addEdge(edge);
  }

  onMoveNodes(event: any): void {
    // Handle node position changes
    if (event && event.id && event.position) {
      const node = this.workflowService.getNodes().find(n => n.id === event.id);
      if (node) {
        this.workflowService.updateNode(event.id, {
          position: event.position
        });
      }
    }
  }

  onAddNode(nodeData: any): void {
    const id = `${nodeData.type}-${Date.now()}`;
    const xPos = 100 + Math.random() * 200;
    const yPos = 100 + Math.random() * 200;

    const newNode: WorkflowNode = {
      id,
      type: nodeData.type as 'level' | 'condition' | 'action',
      position: { x: xPos, y: yPos },
      data: this.getDefaultNodeData(nodeData.type)
    };

    console.log('📝 Creating node:', {
      id: newNode.id,
      type: newNode.type,
      position: newNode.position,
      posX: newNode.position.x,
      posY: newNode.position.y
    });

    this.workflowService.addNode(newNode);
  }

  onDeleteNode(nodeId: string): void {
    this.workflowService.deleteNode(nodeId);
  }

  onDeleteEdge(edgeId: string): void {
    this.workflowService.deleteEdge(edgeId);
  }

  trackByNodeId(index: number, node: any): string {
    return node.id;
  }

  onAnalyzeWorkflow(): void {
    const startNode = this.workflowService.getStartNode();
    const endNodes = this.workflowService.getEndNodes();
    const paths = this.workflowService.getAllPaths();

    console.log('Workflow Analysis:', {
      totalNodes: this.workflowService.getNodes().length,
      totalEdges: this.workflowService.getEdges().length,
      startNode: startNode?.id || 'None',
      endNodes: endNodes.map(n => n.id),
      paths: paths.map(path =>
        path.map(nodeId => this.workflowService.getNodes().find(n => n.id === nodeId)?.data.label)
      )
    });
  }

  onLoadTemplate(templateId: string): void {
    const template = this.templateWorkflowsService.getTemplateById(templateId);
    if (template) {
      this.workflowService.loadWorkflow(template.workflow);
    }
  }

  getAvailableTemplates() {
    return this.templateWorkflowsService.getTemplates();
  }

  onSaveWorkflow(): void {
    const workflow = this.workflowService.saveWorkflow();
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  onLoadWorkflow(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const workflow = JSON.parse(e.target.result);
          this.workflowService.loadWorkflow(workflow);
        } catch (error) {
          console.error('Failed to load workflow:', error);
          alert('Failed to load workflow. Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  private getDefaultNodeData(type: string): any {
    switch (type) {
      case 'level':
        return {
          label: 'Level step 1',
          levelName: 'Collect particulars',
          levelType: 'Individuals',
          steps: ['APPLICANT_DATA', 'IDENTITY', 'SELFIE'],
          isStart: true
        };
      case 'condition':
        return {
          label: 'Condition 1',
          branches: [{ name: 'Branch 1', condition: 'Nationality equals Singapore' }]
        };
      case 'action':
        return {
          label: 'Action 1',
          actions: [{ type: 'createCase', title: 'Create case', value: 'Case details here' }]
        };
      default:
        return { label: 'New Node' };
    }
  }
}
