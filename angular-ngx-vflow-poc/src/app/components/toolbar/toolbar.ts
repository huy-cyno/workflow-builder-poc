import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class ToolbarComponent {
  @Input() selectedNodeId: string | undefined;

  @Output() onAddNode = new EventEmitter<any>();
  @Output() onDeleteNode = new EventEmitter<string>();
  @Output() onAnalyze = new EventEmitter<void>();
  @Output() onExecute = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();
  @Output() onLoad = new EventEmitter<void>();

  onAddLevelNode(): void {
    this.onAddNode.emit({ type: 'level' });
  }

  onAddConditionNode(): void {
    this.onAddNode.emit({ type: 'condition' });
  }

  onAddActionNode(): void {
    this.onAddNode.emit({ type: 'action' });
  }

  onDelete(): void {
    if (this.selectedNodeId) {
      this.onDeleteNode.emit(this.selectedNodeId);
    } else {
      alert('Please select a node first');
    }
  }

  onClickExecute(): void {
    this.onExecute.emit();
  }

  onClickAnalyze(): void {
    this.onAnalyze.emit();
  }
}
