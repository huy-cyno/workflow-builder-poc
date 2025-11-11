import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowNode } from '../../../services/workflow';

@Component({
  selector: 'app-level-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './level-node.html',
  styleUrl: './level-node.css',
})
export class LevelNodeComponent {
  @Input() node!: WorkflowNode;
  @Input() selected: boolean = false;

  get data(): any {
    return this.node.data || {};
  }
}
