import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowTemplate } from '../../services/template-workflows';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {
  @Input() availableTemplates: WorkflowTemplate[] = [];

  @Output() onNodeSelected = new EventEmitter<any>();
  @Output() onTemplateSelected = new EventEmitter<string>();

  nodeTemplates = [
    {
      type: 'level',
      icon: '💾',
      title: 'Level Step',
      description: 'Verification level or step'
    },
    {
      type: 'condition',
      icon: '🔀',
      title: 'Condition',
      description: 'Branch based on conditions'
    },
    {
      type: 'action',
      icon: '⚡',
      title: 'Action',
      description: 'Execute action or trigger'
    }
  ];

  onAddNode(type: string): void {
    this.onNodeSelected.emit({ type });
  }

  onSelectTemplate(templateId: string): void {
    this.onTemplateSelected.emit(templateId);
  }
}
