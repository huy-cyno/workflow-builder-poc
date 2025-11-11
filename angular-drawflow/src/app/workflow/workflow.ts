import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Drawflow from 'drawflow';

@Component({
  selector: 'app-workflow',
  imports: [CommonModule],
  templateUrl: './workflow.html',
  styleUrl: './workflow.css',
  standalone: true
})
export class Workflow implements OnInit, AfterViewInit {
  @ViewChild('drawflowContainer', { static: false }) drawflowContainer!: ElementRef;

  editor!: Drawflow;
  selectedNode: any = null;

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Initialize Drawflow after view is ready
    const container = this.drawflowContainer.nativeElement;
    this.editor = new Drawflow(container);
    this.editor.start();

    // Set up event listeners
    this.editor.on('nodeSelected', (id: string) => {
      this.selectedNode = this.editor.getNodeFromId(id);
      console.log('Node selected:', this.selectedNode);
    });

    this.editor.on('nodeUnselected', () => {
      this.selectedNode = null;
    });

    // Add initial example nodes
    this.addExampleWorkflow();
  }

  addExampleWorkflow(): void {
    // Add Level Node
    const levelHtml = `
      <div class="node-content level-node">
        <div class="node-header">
          <span class="node-icon">💾</span>
          <span class="node-title">Collect User Data</span>
        </div>
        <div class="node-body">
          <div class="node-label">Identity Collection</div>
          <div class="node-steps">
            <span class="step-badge">APPLICANT_DATA</span>
            <span class="step-badge">IDENTITY</span>
          </div>
        </div>
      </div>
    `;

    const levelData = {
      label: 'Collect User Data',
      levelName: 'Identity Collection',
      levelType: 'Individuals',
      steps: ['APPLICANT_DATA', 'IDENTITY']
    };

    const levelId = this.editor.addNode('level', 0, 1, 50, 100, 'level-node', levelData, levelHtml);

    // Add Condition Node
    const conditionHtml = `
      <div class="node-content condition-node">
        <div class="node-header">
          <span class="node-icon">🔀</span>
          <span class="node-title">Risk Assessment</span>
        </div>
        <div class="node-body">
          <div class="condition-branch">High Risk: score >= 70</div>
          <div class="condition-else">Else: Low Risk</div>
        </div>
      </div>
    `;

    const conditionData = {
      label: 'Risk Assessment',
      branches: [
        { name: 'High Risk', condition: 'riskScore >= 70' }
      ]
    };

    const conditionId = this.editor.addNode('condition', 1, 2, 350, 100, 'condition-node', conditionData, conditionHtml);

    // Add Action Nodes
    const actionHighHtml = `
      <div class="node-content action-node">
        <div class="node-header">
          <span class="node-icon">⚡</span>
          <span class="node-title">High Risk Actions</span>
        </div>
        <div class="node-body">
          <div class="action-item">📋 Create review case</div>
          <div class="action-item">📧 Alert compliance team</div>
        </div>
      </div>
    `;

    const actionHighData = {
      label: 'High Risk Actions',
      actions: [
        { type: 'createCase', title: 'Create review case' },
        { type: 'sendEmail', title: 'Alert compliance team' }
      ]
    };

    const actionHighId = this.editor.addNode('action', 1, 0, 650, 50, 'action-node', actionHighData, actionHighHtml);

    const actionLowHtml = `
      <div class="node-content action-node">
        <div class="node-header">
          <span class="node-icon">⚡</span>
          <span class="node-title">Auto-Approve</span>
        </div>
        <div class="node-body">
          <div class="action-item">✅ Auto-approve user</div>
          <div class="action-item">🔗 Notify partner system</div>
        </div>
      </div>
    `;

    const actionLowData = {
      label: 'Auto-Approve',
      actions: [
        { type: 'approve', title: 'Auto-approve user' },
        { type: 'sendWebhook', title: 'Notify partner system' }
      ]
    };

    const actionLowId = this.editor.addNode('action', 1, 0, 650, 250, 'action-node', actionLowData, actionLowHtml);

    // Connect nodes
    this.editor.addConnection(levelId, conditionId, 'output_1', 'input_1');
    this.editor.addConnection(conditionId, actionHighId, 'output_1', 'input_1');
    this.editor.addConnection(conditionId, actionLowId, 'output_2', 'input_1');
  }

  addLevelNode(): void {
    const html = `
      <div class="node-content level-node">
        <div class="node-header">
          <span class="node-icon">💾</span>
          <span class="node-title">New Level</span>
        </div>
      </div>
    `;

    const data = {
      label: 'New Level',
      levelName: 'New Level Step',
      steps: []
    };

    this.editor.addNode('level', 0, 1, 200, 200, 'level-node', data, html);
  }

  addConditionNode(): void {
    const html = `
      <div class="node-content condition-node">
        <div class="node-header">
          <span class="node-icon">🔀</span>
          <span class="node-title">New Condition</span>
        </div>
      </div>
    `;

    const data = {
      label: 'New Condition',
      branches: []
    };

    this.editor.addNode('condition', 1, 2, 200, 200, 'condition-node', data, html);
  }

  addActionNode(): void {
    const html = `
      <div class="node-content action-node">
        <div class="node-header">
          <span class="node-icon">⚡</span>
          <span class="node-title">New Action</span>
        </div>
      </div>
    `;

    const data = {
      label: 'New Action',
      actions: []
    };

    this.editor.addNode('action', 1, 0, 200, 200, 'action-node', data, html);
  }

  deleteNode(): void {
    if (this.selectedNode) {
      this.editor.removeNodeId('node-' + this.selectedNode.id);
      this.selectedNode = null;
    }
  }

  clearWorkflow(): void {
    this.editor.clear();
  }

  exportWorkflow(): void {
    const exportData = this.editor.export();
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'workflow-drawflow.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  importWorkflow(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const workflow = JSON.parse(e.target.result);
          this.editor.import(workflow);
          console.log('Workflow imported successfully');
        } catch (error) {
          console.error('Error importing workflow:', error);
          alert('Failed to import workflow');
        }
      };

      reader.readAsText(file);
    }
  }

  zoomIn(): void {
    this.editor.zoom_in();
  }

  zoomOut(): void {
    this.editor.zoom_out();
  }

  zoomReset(): void {
    this.editor.zoom_reset();
  }
}
