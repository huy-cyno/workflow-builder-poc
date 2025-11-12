import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowNode } from '../../services/workflow';

@Component({
  selector: 'app-node-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './node-editor.html',
  styleUrl: './node-editor.css'
})
export class NodeEditorComponent {
  @Input() node: WorkflowNode | null = null;
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  ngOnChanges(): void {
    // Handle input changes if needed
  }

  close(): void {
    this.onClose.emit();
  }

  updateNodeData(field: string, value: any): void {
    if (this.node) {
      const updatedData = {
        ...this.node.data,
        [field]: value
      };
      // In a real scenario, we would emit an update event
      // For now, we're just updating locally
      this.node.data[field] = value;
    }
  }

  addBranch(): void {
    if (this.node && this.node.type === 'condition' && this.node.data.branches) {
      this.node.data.branches.push({
        name: `Branch ${this.node.data.branches.length + 1}`,
        condition: ''
      });
    }
  }

  removeBranch(index: number): void {
    if (this.node && this.node.type === 'condition' && this.node.data.branches) {
      this.node.data.branches.splice(index, 1);
    }
  }

  addAction(): void {
    if (this.node && this.node.type === 'action' && this.node.data.actions) {
      this.node.data.actions.push({
        type: 'custom',
        title: `Action ${this.node.data.actions.length + 1}`,
        value: ''
      });
    }
  }

  removeAction(index: number): void {
    if (this.node && this.node.type === 'action' && this.node.data.actions) {
      this.node.data.actions.splice(index, 1);
    }
  }

  addStep(): void {
    if (this.node && this.node.type === 'level' && this.node.data.steps) {
      this.node.data.steps.push(`STEP_${Date.now()}`);
    }
  }

  removeStep(index: number): void {
    if (this.node && this.node.type === 'level' && this.node.data.steps) {
      this.node.data.steps.splice(index, 1);
    }
  }
}
