import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NodeTemplate {
  type: 'level' | 'condition' | 'action';
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() availableTemplates: any[] = [];
  @Output() onNodeSelected = new EventEmitter<any>();
  @Output() onTemplateSelected = new EventEmitter<string>();

  nodeTemplates: NodeTemplate[] = [
    {
      type: 'level',
      icon: '💾',
      title: 'Level Step',
      description: 'Represents a verification level or step',
    },
    {
      type: 'condition',
      icon: '🔀',
      title: 'Condition',
      description: 'Branch logic based on conditions',
    },
    {
      type: 'action',
      icon: '⚡',
      title: 'Action',
      description: 'Execute actions or triggers',
    },
  ];

  onNodeClick(template: NodeTemplate): void {
    this.onNodeSelected.emit({ type: template.type });
  }

  onLoadTemplateClick(templateId: string): void {
    this.onTemplateSelected.emit(templateId);
  }
}
