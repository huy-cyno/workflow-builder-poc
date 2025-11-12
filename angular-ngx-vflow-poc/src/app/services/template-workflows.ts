import { Injectable } from '@angular/core';
import { Workflow } from './workflow';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  workflow: Workflow;
}

@Injectable({
  providedIn: 'root'
})
export class TemplateWorkflowsService {
  private templates: WorkflowTemplate[] = [
    {
      id: 'risk-assessment',
      name: 'Risk Assessment Workflow',
      description: 'Complex workflow with multiple branches and conditions',
      workflow: {
        nodes: [
          {
            id: 'level-1',
            type: 'level',
            position: { x: 50, y: 150 },
            data: {
              label: 'Collect Documents',
              levelName: 'Document Collection',
              levelType: 'Individuals',
              steps: ['PASSPORT', 'ADDRESS_PROOF'],
              isStart: true
            }
          },
          {
            id: 'condition-1',
            type: 'condition',
            position: { x: 300, y: 150 },
            data: {
              label: 'Risk Check',
              branches: [
                {
                  name: 'High Risk',
                  condition: 'Risk score > 80'
                },
                {
                  name: 'Medium Risk',
                  condition: 'Risk score 40-80'
                }
              ]
            }
          },
          {
            id: 'action-1',
            type: 'action',
            position: { x: 100, y: 350 },
            data: {
              label: 'Manual Review',
              actions: [
                {
                  type: 'escalate',
                  title: 'Escalate to Reviewer',
                  value: 'Manual review required'
                }
              ]
            }
          },
          {
            id: 'action-2',
            type: 'action',
            position: { x: 350, y: 350 },
            data: {
              label: 'Approve',
              actions: [
                {
                  type: 'approve',
                  title: 'Auto Approve',
                  value: 'Low risk approved'
                }
              ]
            }
          }
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'level-1',
            target: 'condition-1'
          },
          {
            id: 'edge-2',
            source: 'condition-1',
            target: 'action-1'
          },
          {
            id: 'edge-3',
            source: 'condition-1',
            target: 'action-2'
          }
        ]
      }
    },
    {
      id: 'simple-linear',
      name: 'Simple Linear Workflow',
      description: 'Sequential steps without branching',
      workflow: {
        nodes: [
          {
            id: 'level-start',
            type: 'level',
            position: { x: 50, y: 100 },
            data: {
              label: 'Identity Verification',
              levelName: 'Collect ID',
              levelType: 'Individuals',
              steps: ['PASSPORT'],
              isStart: true
            }
          },
          {
            id: 'level-selfie',
            type: 'level',
            position: { x: 300, y: 100 },
            data: {
              label: 'Face Verification',
              levelName: 'Selfie Capture',
              levelType: 'Individuals',
              steps: ['SELFIE'],
              isStart: false
            }
          },
          {
            id: 'action-approve',
            type: 'action',
            position: { x: 550, y: 100 },
            data: {
              label: 'Approve',
              actions: [
                {
                  type: 'approve',
                  title: 'Grant Access',
                  value: 'User approved'
                }
              ]
            }
          }
        ],
        edges: [
          {
            id: 'edge-linear-1',
            source: 'level-start',
            target: 'level-selfie'
          },
          {
            id: 'edge-linear-2',
            source: 'level-selfie',
            target: 'action-approve'
          }
        ]
      }
    },
    {
      id: 'multi-branch',
      name: 'Multi-Branch Workflow',
      description: 'Multiple decision branches and paths',
      workflow: {
        nodes: [
          {
            id: 'level-country',
            type: 'level',
            position: { x: 50, y: 150 },
            data: {
              label: 'Collect Profile',
              levelName: 'User Information',
              levelType: 'Individuals',
              steps: ['NATIONALITY', 'ADDRESS'],
              isStart: true
            }
          },
          {
            id: 'condition-country',
            type: 'condition',
            position: { x: 300, y: 150 },
            data: {
              label: 'By Country',
              branches: [
                {
                  name: 'Singapore',
                  condition: 'Country = Singapore'
                },
                {
                  name: 'EU',
                  condition: 'Country in EU'
                },
                {
                  name: 'Others',
                  condition: 'Other countries'
                }
              ]
            }
          },
          {
            id: 'action-sg',
            type: 'action',
            position: { x: 100, y: 350 },
            data: {
              label: 'SG Process',
              actions: [
                {
                  type: 'process',
                  title: 'Singapore KYC',
                  value: 'SG compliance'
                }
              ]
            }
          },
          {
            id: 'action-eu',
            type: 'action',
            position: { x: 300, y: 350 },
            data: {
              label: 'EU Process',
              actions: [
                {
                  type: 'process',
                  title: 'GDPR Check',
                  value: 'EU compliance'
                }
              ]
            }
          },
          {
            id: 'action-other',
            type: 'action',
            position: { x: 500, y: 350 },
            data: {
              label: 'Standard Process',
              actions: [
                {
                  type: 'process',
                  title: 'Standard KYC',
                  value: 'Standard process'
                }
              ]
            }
          }
        ],
        edges: [
          {
            id: 'edge-mb-1',
            source: 'level-country',
            target: 'condition-country'
          },
          {
            id: 'edge-mb-2',
            source: 'condition-country',
            target: 'action-sg'
          },
          {
            id: 'edge-mb-3',
            source: 'condition-country',
            target: 'action-eu'
          },
          {
            id: 'edge-mb-4',
            source: 'condition-country',
            target: 'action-other'
          }
        ]
      }
    }
  ];

  constructor() {}

  getTemplates(): WorkflowTemplate[] {
    return this.templates;
  }

  getTemplateById(id: string): WorkflowTemplate | undefined {
    return this.templates.find(t => t.id === id);
  }
}
