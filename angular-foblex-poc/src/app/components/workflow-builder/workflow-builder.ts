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

  // Custom drag-to-connect state
  private isDraggingConnector = false;
  private dragStartType: 'input' | 'output' | null = null;
  private dragStartNodeId: string | null = null;
  private dragStartElement: HTMLElement | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private workflowService: WorkflowService,
    private templateWorkflowsService: TemplateWorkflowsService
  ) {}

  ngOnInit(): void {
    console.log('WorkflowBuilder initialized');

    // Subscribe to workflow nodes
    this.workflowService.nodes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(workflowNodes => {
        this.nodes = workflowNodes;
        console.log('Nodes updated:', workflowNodes.map(n => ({ id: n.id, type: n.type })));
      });

    // Subscribe to workflow edges
    this.workflowService.edges$
      .pipe(takeUntil(this.destroy$))
      .subscribe(workflowEdges => {
        this.edges = workflowEdges;
        console.log('Edges updated:', workflowEdges.length, 'edges');
      });

    // Subscribe to selected node
    this.workflowService.selectedNode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(node => {
        this.selectedNode = node;
      });

    // Add global mouse listeners for custom drag-to-connect
    document.addEventListener('mouseup', (e) => this.onConnectorMouseUp(e));
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

  onConnectorMouseDown(type: 'input' | 'output', nodeId: string): void {
    console.log(`🔌 START DRAG: ${type} connector on node ${nodeId}`);
    this.isDraggingConnector = true;
    this.dragStartType = type;
    this.dragStartNodeId = nodeId;
  }

  onConnectorMouseUp(event: MouseEvent): void {
    if (!this.isDraggingConnector || !this.dragStartType || !this.dragStartNodeId) {
      return;
    }

    console.log(`🔌 DRAG ENDED`);
    this.isDraggingConnector = false;

    // Get the element under the mouse cursor
    const targetElement = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;

    if (!targetElement) {
      console.log('No target element found');
      return;
    }

    // Check if we released over a connector
    const isInputConnector = targetElement.hasAttribute('fNodeInput');
    const isOutputConnector = targetElement.hasAttribute('fNodeOutput');

    if (!isInputConnector && !isOutputConnector) {
      console.log('Not released over a connector');
      this.dragStartType = null;
      this.dragStartNodeId = null;
      return;
    }

    // Get the target node ID from parent
    const connectorParent = targetElement.closest('.workflow-node-wrapper') as HTMLElement;
    if (!connectorParent) {
      console.log('Could not find connector parent node');
      this.dragStartType = null;
      this.dragStartNodeId = null;
      return;
    }

    // Get the node ID from data attribute
    const targetNodeId = connectorParent.getAttribute('data-node-id');

    if (!targetNodeId) {
      console.log('Could not find target node ID');
      this.dragStartType = null;
      this.dragStartNodeId = null;
      return;
    }

    console.log(`🔌 Target node ID: ${targetNodeId}, Target is: ${isInputConnector ? 'input' : 'output'}`);

    // Validate the connection
    const startIsOutput = this.dragStartType === 'output';
    const endIsInput = isInputConnector;

    if (!startIsOutput || !endIsInput) {
      console.log('Invalid connection: must drag from output to input');
      this.dragStartType = null;
      this.dragStartNodeId = null;
      return;
    }

    if (this.dragStartNodeId === targetNodeId) {
      console.log('Cannot connect a node to itself');
      this.dragStartType = null;
      this.dragStartNodeId = null;
      return;
    }

    // Create the connection
    this.createConnectionBetweenNodes(this.dragStartNodeId, targetNodeId);

    this.dragStartType = null;
    this.dragStartNodeId = null;
  }

  private createConnectionBetweenNodes(sourceNodeId: string, targetNodeId: string): void {
    const edgeId = `edge-${Date.now()}`;
    const edge: WorkflowEdge = {
      id: edgeId,
      source: sourceNodeId,
      target: targetNodeId,
      sourceHandle: sourceNodeId + '-output',
      targetHandle: targetNodeId + '-input',
      type: 'smoothstep',
      style: { stroke: '#6D9DFF', strokeWidth: 2 },
    };

    console.log('✅ Creating connection:', edge);
    this.workflowService.addEdge(edge);
  }

  onCreateConnection(event: any): void {
    console.log('=== Connection Event Fired ===');
    console.log('Raw event:', event);
    console.log('Event keys:', Object.keys(event));
    console.log('fOutputId:', event.fOutputId);
    console.log('fInputId:', event.fInputId);

    const edgeId = `edge-${Date.now()}`;

    // Extract node ID from handle ID
    // Handle format: "node-id-output" or "node-id-input"
    // We need to remove the last segment (-output or -input)
    const extractNodeId = (handleId: string): string => {
      console.log('Extracting from handleId:', handleId);
      const lastDashIndex = handleId.lastIndexOf('-');
      const extracted = handleId.substring(0, lastDashIndex);
      console.log('Extracted nodeId:', extracted);
      return extracted;
    };

    const sourceNodeId = extractNodeId(event.fOutputId);
    const targetNodeId = extractNodeId(event.fInputId);

    console.log('Source node ID:', sourceNodeId);
    console.log('Target node ID:', targetNodeId);
    console.log('Current nodes:', this.nodes.map(n => n.id));

    // Validate nodes exist
    const sourceExists = this.nodes.find(n => n.id === sourceNodeId);
    const targetExists = this.nodes.find(n => n.id === targetNodeId);

    if (!sourceExists || !targetExists) {
      console.error('Connection failed: Invalid node IDs', {
        sourceNodeId,
        targetNodeId,
        sourceExists: !!sourceExists,
        targetExists: !!targetExists,
        availableNodeIds: this.nodes.map(n => n.id)
      });
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

    console.log('✅ Creating connection:', edge);
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
