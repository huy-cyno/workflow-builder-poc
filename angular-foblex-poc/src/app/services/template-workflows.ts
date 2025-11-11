import { Injectable } from '@angular/core';
import { Workflow } from './workflow';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  workflow: Workflow;
}

@Injectable({
  providedIn: 'root',
})
export class TemplateWorkflowsService {
  /**
   * Get all available workflow templates
   */
  getTemplates(): WorkflowTemplate[] {
    return [
      this.getRiskAssessmentTemplate(),
      this.getSimpleLinearTemplate(),
      this.getMultiBranchTemplate(),
    ];
  }

  /**
   * Get a template by ID
   */
  getTemplateById(id: string): WorkflowTemplate | undefined {
    return this.getTemplates().find(t => t.id === id);
  }

  /**
   * Risk Assessment Workflow (from React Flow PoC)
   * - Start: Collect user data
   * - Decision: Risk assessment check
   * - Branch 1: High risk → manual review
   * - Branch 2: Low risk → auto-approve
   */
  private getRiskAssessmentTemplate(): WorkflowTemplate {
    return {
      id: 'risk-assessment',
      name: 'Risk Assessment Workflow',
      description: 'Collects user data, assesses risk, and routes to appropriate action',
      workflow: {
        nodes: [
          {
            id: 'level-1',
            type: 'level',
            position: { x: 50, y: 100 },
            data: {
              label: 'Collect User Data',
              levelName: 'Identity Collection',
              levelType: 'Individuals',
              steps: ['APPLICANT_DATA', 'IDENTITY'],
              isStart: true,
            },
          },
          {
            id: 'condition-1',
            type: 'condition',
            position: { x: 350, y: 100 },
            data: {
              label: 'Risk Assessment',
              branches: [
                {
                  name: 'High Risk',
                  condition: 'riskScore >= 70',
                },
              ],
            },
          },
          {
            id: 'action-high',
            type: 'action',
            position: { x: 650, y: 50 },
            data: {
              label: 'High Risk Actions',
              actions: [
                {
                  type: 'createCase',
                  title: 'Create manual review case',
                  value: 'Compliance Team',
                },
                {
                  type: 'sendEmail',
                  title: 'Alert compliance team',
                  value: 'compliance@company.com',
                },
                {
                  type: 'log',
                  title: 'Log risk event',
                  value: 'High risk user detected',
                },
              ],
            },
          },
          {
            id: 'action-low',
            type: 'action',
            position: { x: 650, y: 250 },
            data: {
              label: 'Auto-Approve Actions',
              actions: [
                {
                  type: 'approve',
                  title: 'Auto-approve user',
                  value: '',
                },
                {
                  type: 'sendWebhook',
                  title: 'Notify partner system',
                  value: 'https://api.partner.com/webhook',
                },
                {
                  type: 'sendEmail',
                  title: 'Welcome email',
                  value: 'user@example.com',
                },
                {
                  type: 'notify',
                  title: 'Push notification',
                  value: 'Account approved!',
                },
              ],
            },
          },
        ],
        edges: [
          {
            id: 'e1-2',
            source: 'level-1',
            target: 'condition-1',
            sourceHandle: 'level-1-output',
            targetHandle: 'condition-1-input',
            type: 'smoothstep',
            style: { stroke: '#6D9DFF', strokeWidth: 2 },
          },
          {
            id: 'e2-3',
            source: 'condition-1',
            target: 'action-high',
            sourceHandle: 'branch-0',
            targetHandle: 'action-high-input',
            type: 'smoothstep',
            style: { stroke: '#FF6B9D', strokeWidth: 2 },
          },
          {
            id: 'e2-4',
            source: 'condition-1',
            target: 'action-low',
            sourceHandle: 'else',
            targetHandle: 'action-low-input',
            type: 'smoothstep',
            style: { stroke: '#27AE60', strokeWidth: 2 },
          },
        ],
        metadata: {
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }

  /**
   * Simple Linear Workflow
   * - Start: Collect data
   * - Middle: Process
   * - End: Approve
   */
  private getSimpleLinearTemplate(): WorkflowTemplate {
    return {
      id: 'simple-linear',
      name: 'Simple Linear Workflow',
      description: 'Basic workflow with sequential steps',
      workflow: {
        nodes: [
          {
            id: 'level-start',
            type: 'level',
            position: { x: 50, y: 100 },
            data: {
              label: 'Collect Information',
              levelName: 'Data Collection',
              levelType: 'Individuals',
              steps: ['APPLICANT_DATA'],
              isStart: true,
            },
          },
          {
            id: 'level-verify',
            type: 'level',
            position: { x: 350, y: 100 },
            data: {
              label: 'Verify Identity',
              levelName: 'Identity Verification',
              levelType: 'Individuals',
              steps: ['IDENTITY', 'SELFIE'],
            },
          },
          {
            id: 'action-approve',
            type: 'action',
            position: { x: 650, y: 100 },
            data: {
              label: 'Approve & Notify',
              actions: [
                {
                  type: 'approve',
                  title: 'Approve application',
                  value: '',
                },
                {
                  type: 'sendEmail',
                  title: 'Send confirmation email',
                  value: 'user@example.com',
                },
              ],
            },
          },
        ],
        edges: [
          {
            id: 'e-start-verify',
            source: 'level-start',
            target: 'level-verify',
            sourceHandle: 'level-start-output',
            targetHandle: 'level-verify-input',
            type: 'smoothstep',
            style: { stroke: '#6D9DFF', strokeWidth: 2 },
          },
          {
            id: 'e-verify-approve',
            source: 'level-verify',
            target: 'action-approve',
            sourceHandle: 'level-verify-output',
            targetHandle: 'action-approve-input',
            type: 'smoothstep',
            style: { stroke: '#6D9DFF', strokeWidth: 2 },
          },
        ],
        metadata: {
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }

  /**
   * Multi-Branch Workflow
   * - Start: Collect data
   * - Decision 1: Document type check
   * - Decision 2: Quality check (based on branch)
   * - Multiple end actions
   */
  private getMultiBranchTemplate(): WorkflowTemplate {
    return {
      id: 'multi-branch',
      name: 'Multi-Branch Workflow',
      description: 'Complex workflow with multiple decision points and branches',
      workflow: {
        nodes: [
          {
            id: 'level-collect',
            type: 'level',
            position: { x: 50, y: 150 },
            data: {
              label: 'Collect Documents',
              levelName: 'Document Collection',
              levelType: 'Companies',
              steps: ['COMPANY_DATA', 'DOCUMENTS'],
              isStart: true,
            },
          },
          {
            id: 'condition-doctype',
            type: 'condition',
            position: { x: 350, y: 100 },
            data: {
              label: 'Document Type Check',
              branches: [
                {
                  name: 'Passport',
                  condition: 'docType === "PASSPORT"',
                },
                {
                  name: 'ID Card',
                  condition: 'docType === "ID_CARD"',
                },
              ],
            },
          },
          {
            id: 'condition-quality',
            type: 'condition',
            position: { x: 650, y: 100 },
            data: {
              label: 'Quality Check',
              branches: [
                {
                  name: 'Good Quality',
                  condition: 'qualityScore >= 80',
                },
              ],
            },
          },
          {
            id: 'action-approve',
            type: 'action',
            position: { x: 950, y: 50 },
            data: {
              label: 'Approve',
              actions: [
                {
                  type: 'approve',
                  title: 'Approve verification',
                  value: '',
                },
              ],
            },
          },
          {
            id: 'action-retry',
            type: 'action',
            position: { x: 950, y: 200 },
            data: {
              label: 'Retry Upload',
              actions: [
                {
                  type: 'sendEmail',
                  title: 'Request re-upload',
                  value: 'Please re-upload clearer documents',
                },
              ],
            },
          },
          {
            id: 'action-reject',
            type: 'action',
            position: { x: 950, y: 350 },
            data: {
              label: 'Reject',
              actions: [
                {
                  type: 'sendEmail',
                  title: 'Send rejection notice',
                  value: 'Your application was rejected',
                },
              ],
            },
          },
        ],
        edges: [
          {
            id: 'e1',
            source: 'level-collect',
            target: 'condition-doctype',
            sourceHandle: 'level-collect-output',
            targetHandle: 'condition-doctype-input',
            type: 'smoothstep',
            style: { stroke: '#6D9DFF', strokeWidth: 2 },
          },
          {
            id: 'e2',
            source: 'condition-doctype',
            target: 'condition-quality',
            sourceHandle: 'branch-0',
            targetHandle: 'condition-quality-input',
            type: 'smoothstep',
            style: { stroke: '#FFB648', strokeWidth: 2 },
          },
          {
            id: 'e3',
            source: 'condition-doctype',
            target: 'condition-quality',
            sourceHandle: 'branch-1',
            targetHandle: 'condition-quality-input',
            type: 'smoothstep',
            style: { stroke: '#FFB648', strokeWidth: 2 },
          },
          {
            id: 'e4',
            source: 'condition-quality',
            target: 'action-approve',
            sourceHandle: 'branch-0',
            targetHandle: 'action-approve-input',
            type: 'smoothstep',
            style: { stroke: '#68CD86', strokeWidth: 2 },
          },
          {
            id: 'e5',
            source: 'condition-quality',
            target: 'action-retry',
            sourceHandle: 'else',
            targetHandle: 'action-retry-input',
            type: 'smoothstep',
            style: { stroke: '#FF6B9D', strokeWidth: 2 },
          },
          {
            id: 'e6',
            source: 'condition-doctype',
            target: 'action-reject',
            sourceHandle: 'else',
            targetHandle: 'action-reject-input',
            type: 'smoothstep',
            style: { stroke: '#FF6B9D', strokeWidth: 2 },
          },
        ],
        metadata: {
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }
}
