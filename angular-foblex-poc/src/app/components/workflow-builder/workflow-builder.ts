import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FFlowModule } from '@foblex/flow';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WorkflowService, WorkflowNode, WorkflowEdge } from '../../services/workflow';
import { TemplateWorkflowsService } from '../../services/template-workflows';
import { ToolbarComponent } from '../toolbar/toolbar';
import { SidebarComponent } from '../sidebar/sidebar';
import { NodeEditorComponent } from '../node-editor/node-editor';
import { ExecutionPanelComponent } from '../execution-panel/execution-panel';

@Component({
  selector: 'app-workflow-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FFlowModule,
    ToolbarComponent,
    SidebarComponent,
    NodeEditorComponent,
    ExecutionPanelComponent,
  ],
  templateUrl: './workflow-builder.html',
  styleUrl: './workflow-builder.css',
})
export class WorkflowBuilder implements OnInit, OnDestroy {
  nodes: WorkflowNode[] = [];
  edges: WorkflowEdge[] = [];
  selectedNode: WorkflowNode | null = null;
  isExecutionPanelVisible = false;

  private destroy$ = new Subject<void>();

  constructor(
    private workflowService: WorkflowService,
    private templateWorkflowsService: TemplateWorkflowsService
  ) {}

  ngOnInit(): void {
    // Subscribe to workflow nodes
    this.workflowService.nodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(workflowNodes => {
        this.nodes = workflowNodes;
      });

    // Subscribe to workflow edges
    this.workflowService.edges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(workflowEdges => {
        this.edges = workflowEdges;
        console.log('Edges updated:', workflowEdges);
        console.log('Current nodes:', this.nodes);
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
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      this.workflowService.selectNode(node);
    }
  }

  onCreateConnection(event: any): void {
    const edgeId = `edge-${Date.now()}`;

    // Extract node ID from handle ID
    // Handle format: "node-id-output" or "node-id-input"
    // We need to remove the last segment (-output or -input)
    const extractNodeId = (handleId: string): string => {
      const lastDashIndex = handleId.lastIndexOf('-');
      return handleId.substring(0, lastDashIndex);
    };

    const sourceNodeId = extractNodeId(event.fOutputId);
    const targetNodeId = extractNodeId(event.fInputId);

    // Validate nodes exist
    if (!this.nodes.find(n => n.id === sourceNodeId) ||
        !this.nodes.find(n => n.id === targetNodeId)) {
      console.error('Connection failed: Invalid node IDs', { sourceNodeId, targetNodeId });
      return;
    }

    const edge: WorkflowEdge = {
      id: edgeId,
      source: sourceNodeId,
      target: targetNodeId,
      sourceHandle: event.fOutputId,
      targetHandle: event.fInputId,
      type: 'smoothstep',
      style: { stroke: '#6D9DFF', strokeWidth: 2 },
    };

    console.log('Creating connection:', edge);
    this.workflowService.addEdge(edge);
  }

  onMoveNodes(event: any): void {
    // Handle node position changes
    if (event.fNodes) {
      event.fNodes.forEach((nodeData: any) => {
        const node = this.nodes.find(n => n.id === nodeData.fId);
        if (node) {
          node.position = nodeData.fPosition;
        }
      });
    }
  }

  onAddNode(nodeData: any): void {
    const id = `${nodeData.type}-${Date.now()}`;
    const newNode: WorkflowNode = {
      id,
      type: nodeData.type as 'level' | 'condition' | 'action',
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: this.getDefaultNodeData(nodeData.type),
    };
    this.workflowService.addNode(newNode);
  }

  onDeleteNode(nodeId: string): void {
    this.workflowService.deleteNode(nodeId);
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
      ),
    });
  }

  onExecuteWorkflow(): void {
    this.isExecutionPanelVisible = true;
  }

  onCloseExecutionPanel(): void {
    this.isExecutionPanelVisible = false;
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
          isStart: true,
        };
      case 'condition':
        return {
          label: 'Condition 1',
          branches: [{ name: 'Branch 1', condition: 'Nationality equals Singapore' }],
        };
      case 'action':
        return {
          label: 'Action 1',
          actions: [{ type: 'createCase', title: 'Create case', value: 'Case details here' }],
        };
      default:
        return { label: 'New Node' };
    }
  }
}
