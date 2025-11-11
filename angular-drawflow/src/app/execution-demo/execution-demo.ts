import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkflowExecutor, DrawflowData, ExecutionResult } from '../utils/workflow-executor';

@Component({
  selector: 'app-execution-demo',
  imports: [CommonModule, FormsModule],
  templateUrl: './execution-demo.html',
  styleUrls: ['./execution-demo.css'],
  standalone: true
})
export class ExecutionDemo {
  @Input() workflowData!: DrawflowData;
  @Output() close = new EventEmitter<void>();

  testData: string = '{\n  "age": 25,\n  "country": "Singapore"\n}';
  executionResult: ExecutionResult | null = null;
  error: string | null = null;
  isExecuting: boolean = false;

  get nodeCount(): number {
    return Object.keys(this.workflowData?.drawflow?.Home?.data || {}).length;
  }

  get startNodeLabel(): string {
    if (!this.workflowData) return 'None';

    const nodes = this.workflowData.drawflow.Home.data;
    const nodesWithInput = new Set<string>();

    Object.keys(nodes).forEach(nodeId => {
      const node = nodes[nodeId];
      Object.keys(node.inputs || {}).forEach(inputKey => {
        const input = node.inputs[inputKey];
        if (input.connections && input.connections.length > 0) {
          nodesWithInput.add(nodeId);
        }
      });
    });

    const startNodeId = Object.keys(nodes).find(id => !nodesWithInput.has(id));
    return startNodeId && nodes[startNodeId] ? nodes[startNodeId].data.label : 'None';
  }

  async handleExecute(): Promise<void> {
    this.isExecuting = true;
    this.error = null;
    this.executionResult = null;

    try {
      const context = JSON.parse(this.testData);
      console.log('Creating executor with workflow:', this.workflowData);

      const executor = new WorkflowExecutor(this.workflowData);
      const result = await executor.execute(context);

      this.executionResult = result;
      console.log('Execution Result:', result);
    } catch (err: any) {
      this.error = err.message;
      console.error('Execution error:', err);
    } finally {
      this.isExecuting = false;
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
