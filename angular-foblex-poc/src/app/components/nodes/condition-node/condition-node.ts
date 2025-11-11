import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowNode } from '../../../services/workflow';

@Component({
  selector: 'app-condition-node',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './condition-node.html',
  styleUrl: './condition-node.css',
})
export class ConditionNodeComponent {
  @Input() node!: WorkflowNode;
  @Input() selected: boolean = false;

  get data(): any {
    return this.node.data || {};
  }
}
