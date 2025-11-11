import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowNode } from '../../../services/workflow';

@Component({
  selector: 'app-action-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-node.html',
  styleUrl: './action-node.css',
})
export class ActionNodeComponent {
  @Input() node!: WorkflowNode;
  @Input() selected: boolean = false;

  get data(): any {
    return this.node.data || {};
  }
}
