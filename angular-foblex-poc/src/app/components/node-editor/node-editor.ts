import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowNode, WorkflowService } from '../../services/workflow';

@Component({
  selector: 'app-node-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './node-editor.html',
  styleUrl: './node-editor.css',
})
export class NodeEditorComponent {
  @Input() node!: WorkflowNode;
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  editData: any = {};

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.editData = { ...this.node.data };
  }

  ngOnChanges(): void {
    this.editData = { ...this.node.data };
  }

  saveChanges(): void {
    this.workflowService.updateNode(this.node.id, this.editData);
    this.onClose.emit();
  }

  closeEditor(): void {
    this.onClose.emit();
  }

  addBranch(): void {
    if (!this.editData.branches) {
      this.editData.branches = [];
    }
    this.editData.branches.push({
      name: `Branch ${this.editData.branches.length + 1}`,
      condition: '',
    });
  }

  removeBranch(index: number): void {
    if (this.editData.branches) {
      this.editData.branches.splice(index, 1);
    }
  }

  addAction(): void {
    if (!this.editData.actions) {
      this.editData.actions = [];
    }
    this.editData.actions.push({
      type: 'webhook',
      title: `Action ${this.editData.actions.length + 1}`,
      value: '',
    });
  }

  removeAction(index: number): void {
    if (this.editData.actions) {
      this.editData.actions.splice(index, 1);
    }
  }

  addStep(): void {
    if (!this.editData.steps) {
      this.editData.steps = [];
    }
    this.editData.steps.push(`STEP_${this.editData.steps.length + 1}`);
  }

  removeStep(index: number): void {
    if (this.editData.steps) {
      this.editData.steps.splice(index, 1);
    }
  }
}
