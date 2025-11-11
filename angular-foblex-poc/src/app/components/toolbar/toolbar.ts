import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css',
})
export class ToolbarComponent {
  @Input() selectedNodeId: string | undefined;
  @Output() onAddNode = new EventEmitter<any>();
  @Output() onDeleteNode = new EventEmitter<string>();
  @Output() onAnalyze = new EventEmitter<void>();
  @Output() onExecute = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();
  @Output() onLoad = new EventEmitter<void>();

  actions = [
    { id: 'save', label: 'Save', icon: '💾', tooltip: 'Save workflow to file' },
    { id: 'load', label: 'Load', icon: '📂', tooltip: 'Load workflow from file' },
    { id: 'analyze', label: 'Analyze', icon: '🔍', tooltip: 'Analyze workflow structure' },
    { id: 'execute', label: 'Execute', icon: '▶️', tooltip: 'Test execute workflow' },
    { id: 'delete', label: 'Delete', icon: '🗑️', tooltip: 'Delete selected node' },
    { id: 'edit', label: 'Edit', icon: '✏️', tooltip: 'Edit selected node' },
  ];

  handleAction(actionId: string): void {
    switch (actionId) {
      case 'save':
        this.onSave.emit();
        break;
      case 'load':
        this.onLoad.emit();
        break;
      case 'analyze':
        this.onAnalyze.emit();
        break;
      case 'execute':
        this.onExecute.emit();
        break;
      case 'delete':
        if (this.selectedNodeId) {
          this.onDeleteNode.emit(this.selectedNodeId);
        }
        break;
      case 'edit':
        // Edit is handled by double-clicking or selecting a node
        break;
    }
  }

  isActionDisabled(actionId: string): boolean {
    if (actionId === 'delete' || actionId === 'edit') {
      return !this.selectedNodeId;
    }
    return false;
  }
}
